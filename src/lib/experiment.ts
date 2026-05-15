"use client";

/**
 * Tiny A/B testing runtime.
 *
 * - Cookie-sticky: same visitor always sees same variant for a given key.
 * - PostHog-aware: if PostHog has a feature flag matching `key` returning one
 *   of the variant names, that wins. Otherwise we pick 50/50 client-side.
 * - Exposure-tracked: fires `experiment_exposed` once per session per key,
 *   so PostHog analysis only counts users who actually saw a variant.
 * - SSR-safe: always renders the first variant during SSR/initial paint and
 *   resolves the real variant in useEffect. Brief flash possible on first
 *   visit; no flash on subsequent visits (cookie read is synchronous in
 *   useEffect before the second paint).
 */

import { useEffect, useRef, useState } from "react";
import { Events, getPostHog, track } from "~/lib/analytics";

const COOKIE_PREFIX = "fl_exp_";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year
const EXPOSED_SESSION_KEY = "fastlease.exp.exposed";

function readCookie(name: string): string | null {
	if (typeof document === "undefined") return null;
	const parts = document.cookie.split(";");
	for (const raw of parts) {
		const c = raw.trim();
		if (c.startsWith(`${name}=`))
			return decodeURIComponent(c.slice(name.length + 1));
	}
	return null;
}

function writeCookie(name: string, value: string) {
	if (typeof document === "undefined") return;
	// biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API not yet supported in Safari; document.cookie is required for synchronous read in useEffect.
	document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

function getExposedSet(): Set<string> {
	if (typeof sessionStorage === "undefined") return new Set();
	try {
		const raw = sessionStorage.getItem(EXPOSED_SESSION_KEY);
		return new Set(raw ? (JSON.parse(raw) as string[]) : []);
	} catch {
		return new Set();
	}
}

function markExposed(key: string) {
	if (typeof sessionStorage === "undefined") return;
	try {
		const set = getExposedSet();
		set.add(key);
		sessionStorage.setItem(EXPOSED_SESSION_KEY, JSON.stringify([...set]));
	} catch {}
}

function fireExposure(key: string, variant: string) {
	const exposed = getExposedSet();
	if (exposed.has(key)) return;
	markExposed(key);
	track(Events.experimentExposed, { experiment: key, variant });
}

/**
 * Resolve a variant for `key`. Variants must be a stable tuple (declare at
 * module scope as `as const`, not inline in JSX, or the resolver will re-run).
 *
 * Returns `variants[0]` during SSR and the first client render, then the
 * resolved variant on subsequent renders.
 */
export function useExperiment<V extends string>(
	key: string,
	variants: readonly [V, ...V[]],
): V {
	const variantsRef = useRef(variants);
	variantsRef.current = variants;
	const [variant, setVariant] = useState<V>(variants[0]);

	useEffect(() => {
		const list = variantsRef.current;
		const cookieKey = `${COOKIE_PREFIX}${key}`;

		// 1. Cookie wins — keeps users on their assigned variant.
		const cookieVal = readCookie(cookieKey);
		if (cookieVal && (list as readonly string[]).includes(cookieVal)) {
			setVariant(cookieVal as V);
			fireExposure(key, cookieVal);
			return;
		}

		// 2. PostHog flag (if configured and returning a known variant name).
		let resolved: V | null = null;
		const ph = getPostHog();
		const flagVal = ph?.getFeatureFlag?.(key);
		if (
			typeof flagVal === "string" &&
			(list as readonly string[]).includes(flagVal)
		) {
			resolved = flagVal as V;
		}

		// 3. Random 50/50 fallback.
		if (!resolved) {
			const idx = Math.floor(Math.random() * list.length);
			resolved = list[idx] as V;
		}

		writeCookie(cookieKey, resolved);
		setVariant(resolved);
		fireExposure(key, resolved);
	}, [key]);

	return variant;
}

/**
 * Experiment keys. Keep variant names in sync with PostHog feature flag
 * payloads if you flag-gate later.
 */
export const Experiments = {
	heroCopy: "exp-hero-copy",
	emailGate: "exp-email-gate",
	pricingFraming: "exp-pricing-framing",
} as const;

export const HERO_VARIANTS = ["control", "guarantee-first"] as const;
export const EMAIL_GATE_VARIANTS = ["control", "enriched"] as const;
export const PRICING_VARIANTS = ["control", "dollar"] as const;
