"use client";

/**
 * Thin analytics facade. Every call is safe when keys are missing — pages
 * never break on a missing PostHog/Meta/GA key. Use these helpers, not the
 * vendor SDKs directly, so swapping providers later is a one-file change.
 */

type Props = Record<string, string | number | boolean | null | undefined>;

type PostHogLike = {
	capture: (event: string, props?: Props) => void;
	identify: (id: string, props?: Props) => void;
};

type Win = Window & {
	posthog?: PostHogLike;
	fbq?: (...args: unknown[]) => void;
	gtag?: (...args: unknown[]) => void;
};

const w = (): Win | null => (typeof window === "undefined" ? null : (window as Win));

export function track(event: string, props?: Props) {
	const win = w();
	if (!win) return;
	try {
		win.posthog?.capture(event, props);
		// Meta standard events: map a few common conversion events
		if (win.fbq) {
			if (event === "lead_submitted") win.fbq("track", "Lead", props);
			else if (event === "call_booked") win.fbq("track", "Schedule", props);
			else if (event === "form_started") win.fbq("track", "InitiateCheckout", props);
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
} as const;
