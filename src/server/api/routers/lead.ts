import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";

const attributionSchema = z
	.object({
		referralCode: z.string().optional(),
		utmSource: z.string().optional(),
		utmMedium: z.string().optional(),
		utmCampaign: z.string().optional(),
		landingPath: z.string().optional(),
	})
	.optional();

const estimateSnapshotSchema = z
	.object({
		days: z.number().int().optional(),
		rentLow: z.number().int().optional(),
		rentHigh: z.number().int().optional(),
		listDate: z.string().optional(),
		leaseBy: z.string().optional(),
	})
	.optional();

export const leadRouter = createTRPCRouter({
	submitEstimate: publicProcedure
		.input(
			z.object({
				email: z.string().email(),
				name: z.string().optional(),
				neighborhood: z.string().min(1),
				bedrooms: z.string().min(1),
				targetRent: z.string().optional(),
				address: z.string().optional(),
				moveWindow: z.string().optional(),
				source: z.string().optional(),
				estimate: estimateSnapshotSchema,
				attribution: attributionSchema,
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const targetRent = input.targetRent
				? Number.parseInt(input.targetRent.replace(/[^0-9]/g, ""), 10) || null
				: null;

			const lead = await ctx.db.lead.create({
				data: {
					kind: "ESTIMATE",
					source: input.source ?? "form",
					email: input.email,
					name: input.name,
					neighborhood: input.neighborhood,
					bedrooms: input.bedrooms,
					targetRent: targetRent ?? undefined,
					address: input.address,
					moveWindow: input.moveWindow,
					estDays: input.estimate?.days,
					estRentLow: input.estimate?.rentLow,
					estRentHigh: input.estimate?.rentHigh,
					estListDate: input.estimate?.listDate,
					estLeaseBy: input.estimate?.leaseBy,
					referralCode: input.attribution?.referralCode,
					utmSource: input.attribution?.utmSource,
					utmMedium: input.attribution?.utmMedium,
					utmCampaign: input.attribution?.utmCampaign,
					landingPath: input.attribution?.landingPath,
				},
			});

			if (input.attribution?.referralCode) {
				await ctx.db.referral
					.update({
						where: { code: input.attribution.referralCode },
						data: { uses: { increment: 1 }, lastUsedAt: new Date() },
					})
					.catch(() => null);
			}

			await notify(lead.id, "estimate", input.email, input).catch(() => null);

			return { id: lead.id };
		}),

	bookCall: publicProcedure
		.input(
			z.object({
				email: z.string().email(),
				name: z.string().min(1),
				phone: z.string().optional(),
				neighborhood: z.string().min(1),
				bedrooms: z.string().min(1),
				timeWindow: z.string().optional(),
				source: z.string().optional(),
				estimate: estimateSnapshotSchema,
				attribution: attributionSchema,
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const lead = await ctx.db.lead.create({
				data: {
					kind: "CALL",
					source: input.source ?? "form-call",
					email: input.email,
					name: input.name,
					phone: input.phone,
					neighborhood: input.neighborhood,
					bedrooms: input.bedrooms,
					timeWindow: input.timeWindow,
					estDays: input.estimate?.days,
					estRentLow: input.estimate?.rentLow,
					estRentHigh: input.estimate?.rentHigh,
					referralCode: input.attribution?.referralCode,
					utmSource: input.attribution?.utmSource,
					utmMedium: input.attribution?.utmMedium,
					utmCampaign: input.attribution?.utmCampaign,
					landingPath: input.attribution?.landingPath,
				},
			});

			await notify(lead.id, "call", input.email, input).catch(() => null);
			return { id: lead.id };
		}),

	tenantShortlist: publicProcedure
		.input(
			z.object({
				email: z.string().email(),
				name: z.string().optional(),
				neighborhood: z.string().min(1),
				bedrooms: z.string().min(1),
				moveWindow: z.string().optional(),
				attribution: attributionSchema,
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const lead = await ctx.db.lead.create({
				data: {
					kind: "TENANT_SHORTLIST",
					source: "tenants",
					email: input.email,
					name: input.name,
					neighborhood: input.neighborhood,
					bedrooms: input.bedrooms,
					moveWindow: input.moveWindow,
					referralCode: input.attribution?.referralCode,
					utmSource: input.attribution?.utmSource,
					utmMedium: input.attribution?.utmMedium,
					utmCampaign: input.attribution?.utmCampaign,
					landingPath: input.attribution?.landingPath,
				},
			});
			return { id: lead.id };
		}),
});

async function notify(id: string, kind: string, email: string, payload: unknown) {
	if (!env.RESEND_API_KEY || !env.LEAD_NOTIFY_EMAIL) return;
	// Resend transactional send — replace with real client when adding @react-email
	await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${env.RESEND_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			from: "FastLease <leads@fastlease.ca>",
			to: env.LEAD_NOTIFY_EMAIL,
			subject: `New ${kind} lead: ${email}`,
			text: `Lead ${id}\n\n${JSON.stringify(payload, null, 2)}`,
		}),
	});
}
