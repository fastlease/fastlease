"use client";

/**
 * Referral attribution: capture ?ref=CODE on first visit, persist in
 * localStorage so it survives across pageviews, and surface it to the lead
 * router at submission time.
 *
 * Also captures UTM params + landing path for the same attribution row.
 */

const REF_KEY = "fastlease.ref.v1";

export interface Attribution {
	referralCode?: string;
	utmSource?: string;
	utmMedium?: string;
	utmCampaign?: string;
	landingPath?: string;
}

export function captureAttributionFromUrl(): Attribution | null {
	if (typeof window === "undefined") return null;
	const url = new URL(window.location.href);
	const params = url.searchParams;

	const ref = params.get("ref") ?? undefined;
	const utm_source = params.get("utm_source") ?? undefined;
	const utm_medium = params.get("utm_medium") ?? undefined;
	const utm_campaign = params.get("utm_campaign") ?? undefined;

	if (!ref && !utm_source && !utm_medium && !utm_campaign) return readAttribution();

	const attr: Attribution = {
		referralCode: ref,
		utmSource: utm_source,
		utmMedium: utm_medium,
		utmCampaign: utm_campaign,
		landingPath: url.pathname,
	};

	try {
		const existing = readAttribution();
		const merged: Attribution = { ...existing, ...stripUndef(attr) };
		localStorage.setItem(REF_KEY, JSON.stringify(merged));
		return merged;
	} catch {
		return attr;
	}
}

export function readAttribution(): Attribution | undefined {
	if (typeof window === "undefined") return undefined;
	try {
		const raw = localStorage.getItem(REF_KEY);
		if (!raw) return undefined;
		return JSON.parse(raw) as Attribution;
	} catch {
		return undefined;
	}
}

function stripUndef<T extends object>(o: T): Partial<T> {
	const out: Partial<T> = {};
	for (const k in o) {
		const v = o[k];
		if (v !== undefined && v !== null && v !== "") out[k] = v;
	}
	return out;
}
