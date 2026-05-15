"use client";

/**
 * Thin analytics facade. Every call is safe when keys are missing — pages
 * never break on a missing PostHog/Meta/GA key. Use these helpers, not the
 * vendor SDKs directly, so swapping providers later is a one-file change.
 */

import { useEffect, useRef } from "react";

type Props = Record<string, string | number | boolean | null | undefined>;

type PostHogLike = {
	capture: (event: string, props?: Props) => void;
	identify: (id: string, props?: Props) => void;
	getFeatureFlag?: (key: string) => string | boolean | undefined;
	onFeatureFlags?: (cb: (flags: string[]) => void) => void;
};

type Win = Window & {
	posthog?: PostHogLike;
	fbq?: (...args: unknown[]) => void;
	gtag?: (...args: unknown[]) => void;
};

const w = (): Win | null =>
	typeof window === "undefined" ? null : (window as Win);

export function track(event: string, props?: Props) {
	const win = w();
	if (!win) return;
	try {
		win.posthog?.capture(event, props);
		if (win.fbq) {
			if (event === "lead_submitted") win.fbq("track", "Lead", props);
			else if (event === "call_booked") win.fbq("track", "Schedule", props);
			else if (event === "form_started")
				win.fbq("track", "InitiateCheckout", props);
		}
		if (win.gtag) {
			win.gtag("event", event, props ?? {});
		}
	} catch {
		// analytics must never throw into the app
	}
}

export function identify(id: string, props?: Props) {
	const win = w();
	if (!win) return;
	try {
		win.posthog?.identify(id, props);
	} catch {}
}

export function getPostHog(): PostHogLike | null {
	return w()?.posthog ?? null;
}

export const Events = {
	formStarted: "form_started",
	formStepCompleted: "form_step_completed",
	formAbandoned: "form_abandoned",
	estimateRevealed: "estimate_revealed",
	leadSubmitted: "lead_submitted",
	callBooked: "call_booked",
	exitIntentShown: "exit_intent_shown",
	exitIntentConverted: "exit_intent_converted",
	rentWidgetSubmitted: "rent_widget_submitted",
	smsClicked: "sms_clicked",
	referralVisited: "referral_visited",
	ctaClicked: "cta_clicked",
	sectionViewed: "section_viewed",
	experimentExposed: "experiment_exposed",
} as const;

/**
 * CTA tracking. Every button that opens the form/call modal goes through this.
 * Without `source` the CRO funnel is unattributable — we can see modal opens,
 * but not which surface caused them.
 */
export type CtaSource =
	| "nav"
	| "hero"
	| "rent-widget"
	| "pricing"
	| "final-cta"
	| "sticky-cta"
	| "exit-intent"
	| "operator"
	| "form-result";

export function trackCTA(
	source: CtaSource,
	mode: "timeline" | "call" = "timeline",
	extra?: Props,
) {
	track(Events.ctaClicked, { source, mode, ...(extra ?? {}) });
}

/**
 * Section-view tracking. Fires once per section per page load when the element
 * scrolls into view. Required to compute "viewed → clicked → submitted" rates
 * per surface. No-op without PostHog config — events still flow to gtag/fbq
 * as plain custom events.
 */
const VIEWED_SECTIONS = new Set<string>();

export function useSectionView(name: string) {
	const ref = useRef<HTMLElement | null>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el || typeof IntersectionObserver === "undefined") return;
		if (VIEWED_SECTIONS.has(name)) return;

		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting && !VIEWED_SECTIONS.has(name)) {
						VIEWED_SECTIONS.add(name);
						track(Events.sectionViewed, { section: name });
						io.disconnect();
					}
				}
			},
			{ threshold: 0.35, rootMargin: "0px 0px -10% 0px" },
		);
		io.observe(el);
		return () => io.disconnect();
	}, [name]);

	return ref;
}
