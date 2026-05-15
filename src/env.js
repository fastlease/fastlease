import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	/**
	 * Server-side env vars. Required vars throw at build time;
	 * optional vars are silently unwired in production.
	 */
	server: {
		AUTH_SECRET:
			process.env.NODE_ENV === "production"
				? z.string()
				: z.string().optional(),
		AUTH_DISCORD_ID: z.string(),
		AUTH_DISCORD_SECRET: z.string(),
		DATABASE_URL: z.string().url(),
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),

		// Lead notifications (resend.com or similar — wire in lead router)
		LEAD_NOTIFY_EMAIL: z.string().email().optional(),
		RESEND_API_KEY: z.string().optional(),
	},

	/**
	 * Client-side env vars. Must be prefixed with NEXT_PUBLIC_.
	 */
	client: {
		NEXT_PUBLIC_CAL_USERNAME: z.string().optional(),
		NEXT_PUBLIC_CAL_EVENT: z.string().optional().default("15min"),
		NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
		NEXT_PUBLIC_POSTHOG_HOST: z.string().optional().default("https://us.i.posthog.com"),
		NEXT_PUBLIC_META_PIXEL_ID: z.string().optional(),
		NEXT_PUBLIC_GADS_ID: z.string().optional(),
		NEXT_PUBLIC_SMS_NUMBER: z.string().optional(),
		NEXT_PUBLIC_SITE_URL: z.string().url().optional().default("https://fastlease.ca"),
		// Operator identity (public-facing — surfaced in Operator section)
		NEXT_PUBLIC_RECO_LICENSE_NUMBER: z.string().optional(),
		NEXT_PUBLIC_LOOM_VIDEO_ID: z.string().optional(),
	},

	runtimeEnv: {
		AUTH_SECRET: process.env.AUTH_SECRET,
		AUTH_DISCORD_ID: process.env.AUTH_DISCORD_ID,
		AUTH_DISCORD_SECRET: process.env.AUTH_DISCORD_SECRET,
		DATABASE_URL: process.env.DATABASE_URL,
		NODE_ENV: process.env.NODE_ENV,
		LEAD_NOTIFY_EMAIL: process.env.LEAD_NOTIFY_EMAIL,
		RESEND_API_KEY: process.env.RESEND_API_KEY,
		NEXT_PUBLIC_CAL_USERNAME: process.env.NEXT_PUBLIC_CAL_USERNAME,
		NEXT_PUBLIC_CAL_EVENT: process.env.NEXT_PUBLIC_CAL_EVENT,
		NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
		NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
		NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID,
		NEXT_PUBLIC_GADS_ID: process.env.NEXT_PUBLIC_GADS_ID,
		NEXT_PUBLIC_SMS_NUMBER: process.env.NEXT_PUBLIC_SMS_NUMBER,
		NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
		NEXT_PUBLIC_RECO_LICENSE_NUMBER: process.env.NEXT_PUBLIC_RECO_LICENSE_NUMBER,
		NEXT_PUBLIC_LOOM_VIDEO_ID: process.env.NEXT_PUBLIC_LOOM_VIDEO_ID,
	},
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
});
