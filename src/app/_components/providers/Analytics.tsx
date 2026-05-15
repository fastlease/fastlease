"use client";

import Script from "next/script";
import { useEffect } from "react";
import { env } from "~/env";
import { Events, track } from "~/lib/analytics";
import { captureAttributionFromUrl } from "~/lib/referral";

/**
 * Loads analytics tags only when their env keys are set. We use vendor loaders
 * served from /public/scripts and inject the config via small meta scripts —
 * this keeps us free of inline-vendor-snippet maintenance and CSP-friendly.
 *
 * Also runs first-paint attribution capture (?ref=, ?utm_*) and fires
 * referral_visited when a referral code was in the URL.
 */
export function Analytics() {
	useEffect(() => {
		const attr = captureAttributionFromUrl();
		if (attr?.referralCode) {
			track(Events.referralVisited, { ref: attr.referralCode });
		}
	}, []);

	return (
		<>
			{env.NEXT_PUBLIC_POSTHOG_KEY && (
				<>
					<Script id="posthog-config" strategy="beforeInteractive">
						{`window.__PH_CONFIG={key:${JSON.stringify(env.NEXT_PUBLIC_POSTHOG_KEY)},host:${JSON.stringify(env.NEXT_PUBLIC_POSTHOG_HOST)}};`}
					</Script>
					<Script
						src="/scripts/posthog-loader.js"
						strategy="afterInteractive"
					/>
				</>
			)}
			{env.NEXT_PUBLIC_META_PIXEL_ID && (
				<>
					<Script id="meta-config" strategy="beforeInteractive">
						{`window.__META_PIXEL_ID=${JSON.stringify(env.NEXT_PUBLIC_META_PIXEL_ID)};`}
					</Script>
					<Script src="/scripts/meta-pixel.js" strategy="afterInteractive" />
				</>
			)}
			{env.NEXT_PUBLIC_GADS_ID && (
				<>
					<Script id="gads-config" strategy="beforeInteractive">
						{`window.__GADS_ID=${JSON.stringify(env.NEXT_PUBLIC_GADS_ID)};`}
					</Script>
					<Script
						src={`https://www.googletagmanager.com/gtag/js?id=${env.NEXT_PUBLIC_GADS_ID}`}
						strategy="afterInteractive"
					/>
					<Script src="/scripts/gads.js" strategy="afterInteractive" />
				</>
			)}
		</>
	);
}
