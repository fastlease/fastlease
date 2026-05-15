export interface GlossarySection {
	heading?: string;
	paragraphs: string[];
}

export interface GlossaryPost {
	slug: string;
	title: string;
	summary: string;
	datePublished: string;
	dateModified: string;
	readingMinutes: number;
	sections: GlossarySection[];
	faq: { q: string; a: string }[];
}

export const GLOSSARY_POSTS: GlossaryPost[] = [
	{
		slug: "toronto-condo-leasing-fee-cost",
		title: "What does a Toronto condo leasing fee actually cost in 2026?",
		summary:
			"The standard Toronto residential leasing fee is one month's rent plus 13% HST, paid by the landlord on signed lease. Here's the full math, what it covers, and why FastLease's 21-day model changes the equation.",
		datePublished: "2026-05-01",
		dateModified: "2026-05-15",
		readingMinutes: 6,
		sections: [
			{
				paragraphs: [
					"The short answer: in Toronto, a residential leasing fee is one month's gross rent plus 13% HST, paid by the landlord, contingent on a signed lease. On a $2,800/month unit, that works out to $3,164 ($2,800 commission + $364 HST). The fee is typically split 50/50 between the listing brokerage and the cooperating brokerage representing the tenant.",
					"That's the industry-standard structure across virtually every Toronto residential brokerage. Where brokerages differ is in what risks they take on for that fee, and which costs they treat as separate line items. The number itself is rarely the real comparison.",
				],
			},
			{
				heading: "Who pays the fee?",
				paragraphs: [
					"In Toronto residential leasing, the landlord pays the full fee. Tenants do not pay a brokerage fee in residential leasing — this is different from some U.S. markets and different from Toronto commercial leasing, where commission structures vary.",
					"If the tenant is represented by a different brokerage (a 'co-operating brokerage'), the landlord's fee is split — typically 50/50 — between the two brokerages. The landlord pays once; the tenant's representation is funded out of the landlord's payment.",
				],
			},
			{
				heading: "What the fee covers",
				paragraphs: [
					"A complete leasing engagement in Toronto typically includes: a comparative market analysis to anchor pricing, professional photography, listing copy and syndication across MLS and consumer rental portals, hosting showings, screening applicants, presenting applications, preparing the Ontario Standard Lease (Form 2229E), collecting deposits, and managing move-in inspection paperwork.",
					"Treat any brokerage that quotes 'one month rent' but then itemizes photography, listing fees, or 'premium placement' charges as effectively charging more than the headline number. The honest version of one-month-rent-on-signed-lease is all-in.",
				],
			},
			{
				heading: "What the fee doesn't cover",
				paragraphs: [
					"Ongoing property management — rent collection, maintenance dispatch, lease renewals, end-of-tenancy turnover — is a different product, typically priced as a monthly percentage of rent (commonly 6–10% in Toronto). Leasing brokers and property managers solve different problems; some firms offer both.",
					"Repairs identified during showings or move-in are the landlord's responsibility. So is HST remittance: the brokerage collects HST and remits it to CRA, but it appears as a line on the landlord's invoice.",
				],
			},
			{
				heading: "How FastLease's model changes the math",
				paragraphs: [
					"FastLease's fee follows the same industry-standard one-month-rent contingent structure, with a single addition: if the unit isn't signed by day 21, the brokerage fee automatically drops to 79% of one month — a 21% reduction. On a $2,800 unit, that's $2,212 + HST = $2,500 total, compared to $3,164 under the standard structure.",
					"The reduction is automatic and written into the listing agreement before signing. There is no escalation, no late-listing surcharge, no walk-away charge. The 21-day clock is the only number that changes the invoice.",
				],
			},
			{
				heading: "The real cost is vacancy, not the fee",
				paragraphs: [
					"On a $2,800/month unit, every day of vacancy costs roughly $92 in lost rent. A unit that sits for 35 days on market — close to Toronto's 2025 average for slower-absorbing condo types — has already cost the landlord $3,267 in carry, before the brokerage fee is even paid. Two units that lease at the same rent, ten days apart, produce different annualized yields by 2–3%.",
					"This is why the right comparison isn't 'fee A vs fee B' — it's 'fee + expected vacancy A vs fee + expected vacancy B.' A brokerage with a slightly higher fee that consistently leases in 14 days is cheaper, in total, than a discount brokerage that takes 40.",
				],
			},
		],
		faq: [
			{
				q: "Is the fee negotiable?",
				a: "Yes, in theory — brokerages set their own rates and there is no regulatory minimum. In practice, one month's rent has been the Toronto residential standard for decades, and discount fees usually correlate with cut services (no professional photography, MLS-only distribution). The more useful question is what the fee includes.",
			},
			{
				q: "Do I pay if the unit doesn't lease?",
				a: "Under standard Toronto residential leasing agreements, no — the fee is contingent on a signed lease. If no qualified tenant signs during the listing period, the engagement ends and no fee is owed.",
			},
			{
				q: "Is HST really 13%?",
				a: "Yes. Ontario's combined federal-provincial HST is 13%, applicable to all real estate commissions in the province. The brokerage collects it and remits to CRA; landlords cannot opt out of HST on a commission invoice.",
			},
			{
				q: "What's the difference between a leasing fee and a finder's fee?",
				a: "In Ontario residential leasing they refer to the same thing — the commission paid to the brokerage that finds a qualified tenant. In some U.S. markets 'finder's fee' is paid by the tenant, but in Toronto residential leasing the landlord is the payer.",
			},
		],
	},

	{
		slug: "how-long-condo-takes-to-lease-toronto",
		title: "How long should a Toronto condo take to lease?",
		summary:
			"Toronto condos in 2025 averaged roughly 24 days on market — but the spread between fast and slow leases is enormous, and most of it is controllable. Here's what determines speed, what the seasonal pattern looks like, and when a 21-day target is realistic.",
		datePublished: "2026-05-01",
		dateModified: "2026-05-15",
		readingMinutes: 7,
		sections: [
			{
				paragraphs: [
					"Toronto condominium apartments averaged around 24 days on market across 2025, according to Toronto Regional Real Estate Board (TRREB) quarterly data. Freehold semi and detached rentals run slower, often 30+ days. But the average is the least useful number — the spread is what matters. The same building, the same bedroom mix, the same week of the year, can produce a 9-day lease and a 42-day lease depending on a handful of inputs the landlord (or the broker) controls.",
				],
			},
			{
				heading: "The five inputs that determine speed",
				paragraphs: [
					"In rough order of impact: list price relative to true market, photography quality, distribution channels, response-time discipline on inquiries, and screening throughput.",
					"List price is the dominant factor. A unit priced 5% above its true market range typically sees showings drop 30–50% in the first 14 days, and days-to-lease often doubles. The same unit priced inside the range books showings within 24 hours.",
					"Photography quality is the second-largest controllable input. Phone-shot listings on a sunny day with a clean unit underperform professional photography by a measurable margin in click-through rate on rental portals. Photography is a one-day, recoverable investment that affects the entire listing window.",
					"Distribution channels matter more than landlords typically realize. MLS-only distribution captures the agents-with-clients segment but misses the much larger pool of renters searching directly on consumer portals. Featured placement on property.ca and condos.ca — together over a million monthly registered Toronto-area users — multiplies the inquiry funnel without changing anything about the unit itself.",
				],
			},
			{
				heading: "The seasonal pattern",
				paragraphs: [
					"Toronto's condo rental market has a pronounced seasonal curve. May through August is the fastest absorption window — university and graduate-school turnover, corporate transfers, summer move-in timing. Same building, same unit, listed in June versus December: the June lease typically signs 5–8 days faster.",
					"September through October is the second-strongest window, driven by the academic-year start. November through February is the slowest stretch, particularly the December-to-mid-January gap. A unit listed on December 12 should expect 4–6 additional days on market compared to the same unit listed on May 12.",
					"Seasonality doesn't mean a winter lease is a bad lease. It does mean a 21-day target in mid-January warrants a slightly more aggressive opening price than the same target in mid-May.",
				],
			},
			{
				heading: "When 21 days is realistic, and when it isn't",
				paragraphs: [
					"For a well-priced unit in a tier-1 condo neighborhood (King West, Liberty Village, CityPlace, St. Lawrence, Yonge & Eg, the Annex), with professional photography and featured portal distribution, 21 days is well inside the normal range. Most FastLease engagements in these areas close inside 16.",
					"For units priced more than 5% above the recommended range, or listed during the December lull, or in less-trafficked clusters, the 21-day target gets harder. FastLease's listing agreement explicitly addresses this: if an owner chooses to list more than 5% above the FastLease recommended range, the 21-day guarantee is suspended for that listing. The marketing continues unchanged; the date guarantee doesn't apply.",
					"This isn't a hedge — it's accurate. A 21-day guarantee on a unit priced 8% above market would be either dishonest or financially unworkable. The honest version of the guarantee is conditional on the pricing being inside the recommended band.",
				],
			},
			{
				heading: "What 'days on market' actually measures",
				paragraphs: [
					"Days-on-market in Toronto convention runs from the list date to the signed-lease date — not to the move-in date. A lease signed on day 14 for a June 1 move-in still counts as a 14-day lease. This matters because two listings reported at the same DOM can have very different move-in friction; a unit available immediately versus one with a 45-day delayed possession will receive different inquiry volumes.",
					"FastLease reports both numbers (days to signed lease, and days to occupancy) on its weekly owner report, because they tell different stories about how the unit performed in market.",
				],
			},
		],
		faq: [
			{
				q: "What's the 2025 Toronto condo average days-on-market?",
				a: "TRREB's 2025 quarterly reports indicated Toronto CMA condominium apartments averaged around 24 days on market, with significant variance by quarter, neighborhood, and unit type. The most recent quarter's figures are the most relevant; older averages can mislead in a market that has shifted from undersupply to inventory surplus.",
			},
			{
				q: "Why do some units lease in under a week?",
				a: "Almost always a combination of: priced slightly under the obvious comp set, professional staging or already-empty unit ready for immediate move-in, listed at the start of a strong seasonal week, and featured placement on the right consumer portals. Single factors rarely produce sub-7-day leases on their own.",
			},
			{
				q: "Does the 21-day FastLease guarantee mean we'll always lease in 21 days?",
				a: "It means the brokerage fee drops 21% if a qualified tenant isn't signed by day 21 — that's the contractual mechanism. The actual average across recent FastLease engagements is around 16 days. Some units take longer, particularly when pricing or seasonality push against the unit, and the reduction is automatic in those cases.",
			},
			{
				q: "Should I drop the price if my unit isn't leased by day 14?",
				a: "It depends what's happening. If showing volume is high but applications aren't coming, the issue is usually a unit-presentation or pricing-for-the-tenant-pool mismatch, not asking-price math. If showing volume is low, the asking price is almost always the lever to pull first. FastLease's weekly owner report tracks both metrics specifically so the decision is data-driven, not gut-feel.",
			},
		],
	},

	{
		slug: "ontario-standard-lease-section-15",
		title: "Ontario Standard Lease form: what landlords actually need to know",
		summary:
			"Ontario's Standard Lease (Form 2229E) has been mandatory for most residential tenancies since April 30, 2018. The form itself is straightforward; the failure modes — particularly around Section 15's 'Additional Terms' — are where landlords lose money.",
		datePublished: "2026-05-01",
		dateModified: "2026-05-15",
		readingMinutes: 8,
		sections: [
			{
				paragraphs: [
					"The Residential Tenancy Agreement (Standard Form of Lease), Form 2229E, has been mandatory for most new residential tenancies in Ontario since April 30, 2018. It is the only lease form a residential landlord can require a tenant to sign — custom-drafted leases for covered tenancies are unenforceable on their face. The form is 13 pages long and contains 17 sections; most of it is well-designed and clear. The exceptions to that, where landlords routinely lose money, are concentrated in two places: Section 15 ('Additional Terms') and the LMR (last month's rent) deposit handling.",
				],
			},
			{
				heading: "When the Standard Lease applies (and when it doesn't)",
				paragraphs: [
					"The Standard Lease is required for new residential tenancies covered by the Residential Tenancies Act, 2006. That includes most apartments, condos, basement suites, and rented houses. It does not apply to: rooming houses where the tenant shares a kitchen or bathroom with the owner, care homes, mobile home parks, most social and supportive housing, commercial tenancies, or short-term rentals under 28 days.",
					"For a typical Toronto condo lease, the Standard Lease applies in essentially every case. If you're unsure whether your tenancy is covered, the Residential Tenancies Act section 5 lists the exclusions; the Landlord and Tenant Board (LTB) can confirm in writing.",
				],
			},
			{
				heading: "The penalty for not using the Standard Lease",
				paragraphs: [
					"If a landlord uses a non-standard lease for a covered tenancy, the tenant can issue a written request for the Standard Lease. The landlord has 21 days to provide it. If they don't, the tenant can withhold one month's rent — and that withheld rent does not have to be repaid. The tenant can also give 60 days' notice to terminate the tenancy on this ground.",
					"This is a costly mistake. A landlord who uses a custom lease and stalls on the 21-day window can lose more than $2,800 in withheld rent on a typical Toronto 1BR — far more than the cost of just using the form correctly from day one.",
				],
			},
			{
				heading: "Section 15: where landlords get into trouble",
				paragraphs: [
					"Section 15 is the 'Additional Terms' section — blank space for landlord-specific provisions. It is where most enforceable-versus-unenforceable arguments end up. The rule, from Section 3 of the Standard Lease itself: any term added here that conflicts with the Residential Tenancies Act is void. Not 'partially enforced,' not 'modified to comply' — void.",
					"Common void clauses landlords still write into Section 15:",
					"• 'No pets allowed' — unenforceable. Section 14 of the Residential Tenancies Act prohibits no-pets clauses in residential leases. (Specific pet behavior — damage, noise, allergies affecting other residents — can still ground a termination application, but the blanket clause is void.)",
					"• 'Tenant agrees to annual rent increase of X%' — void. Rent increases are governed by the provincial Rent Increase Guideline (2.5% for 2025) and require formal N1 or N2 notice with 90 days' lead time. A pre-agreed rate above guideline is unenforceable for buildings first occupied before November 15, 2018.",
					"• 'No overnight guests' — void. The tenant has rights of quiet enjoyment under section 22.",
					"• 'Tenant pays for all repairs' — void. Section 20 of the RTA assigns repair obligations to the landlord.",
					"• 'Lease automatically renews at X%' — partially void; the rent figure must follow the guideline, and renewal happens automatically by statute regardless.",
				],
			},
			{
				heading: "What you should include in Section 15",
				paragraphs: [
					"Terms that complement rather than contradict the RTA are enforceable and often important. Useful inclusions:",
					"• Smoking restrictions — unlike pet bans, smoking restrictions in residential leases are enforceable in Ontario. Be specific (cigarettes, cannabis, vaping; indoor balconies; common areas).",
					"• Insurance requirements — requiring the tenant to carry tenant's contents insurance is permitted and standard practice.",
					"• Condo board addendum compliance — if the unit is in a condominium corporation, including a clause that the tenant agrees to abide by the condo's declaration, by-laws, and rules is essential. Attach the rules as Appendix A.",
					"• Parking and locker assignment — specify which numbered parking spot and locker (if any) are included.",
					"• Utility responsibility breakdown — specify exactly which utilities are included in rent and which are tenant-paid (heat, hydro, water, internet). This affects future N1 rent-increase calculations.",
					"• Property-specific rules that don't conflict with the RTA — e.g., 'no satellite dishes affixed to exterior surfaces,' 'no painting walls without written consent.'",
				],
			},
			{
				heading: "The LMR (last month's rent) deposit",
				paragraphs: [
					"In Ontario, a landlord can collect a rent deposit equal to one month's rent (or one rent period, if rent is paid differently), and it must be applied to the last month of the tenancy — that's what 'LMR' means. The Standard Lease handles this correctly in Section 6 if filled in properly.",
					"Two specific landlord obligations attach to LMR that are sometimes missed:",
					"• Interest must be paid annually on the LMR at the rate equal to that year's Rent Increase Guideline (2.5% for 2025). The interest is owed even if the tenant doesn't ask. It can be paid in cash or credited against rent.",
					"• Security deposits for damage are not permitted. A 'pet damage deposit' or 'cleaning deposit' on top of LMR is not enforceable; the landlord's remedy for damage is an LTB application after the fact.",
				],
			},
			{
				heading: "Common signing-day mistakes",
				paragraphs: [
					"Five mistakes seen repeatedly on Toronto leases:",
					"1. Pre-dating the lease to before the actual signing date. The lease is enforceable from the date of signing; pre-dating creates ambiguity in any future dispute.",
					"2. Leaving the guarantor section blank when there is a guarantor — a guarantor must sign Section 17 or there is no enforceable guarantee.",
					"3. Filling in a monthly rent amount without specifying the utility allocation in Section 6 — this creates ambiguity for future rent-increase math.",
					"4. Skipping the condo addendum entirely — most Toronto condo boards have rules around move-in dates, elevator booking, noise, and short-term rentals. A tenant who breaches these without knowing is the landlord's problem.",
					"5. Verbal side-deals not captured in the lease — anything not in writing is, in practical terms, unenforceable. Side agreements about pets, paint colors, or 'temporary' guests must go in Section 15 or they don't exist.",
				],
			},
			{
				heading: "A note on accuracy",
				paragraphs: [
					"This guide is operational orientation, not legal advice. Specific situations — disputed clauses, eviction grounds, AGI applications, conversions of pre-2018 tenancies — should be reviewed with an Ontario real estate lawyer or a paralegal licensed by the Law Society of Ontario. The Landlord and Tenant Board (tribunalsontario.ca/ltb) publishes the current Standard Lease form and its companion guide; both are free.",
				],
			},
		],
		faq: [
			{
				q: "Is Form 2229E the same as the 'OREA' lease?",
				a: "No. Form 2229E is the Government of Ontario's Standard Lease, mandatory since April 30, 2018. OREA (Ontario Real Estate Association) publishes industry forms separately. For covered residential tenancies, the government form is what must be used.",
			},
			{
				q: "Can I add a no-pets clause if my condo board prohibits pets?",
				a: "The condo board's rules can be incorporated into Section 15 via the condo addendum, and the tenant agrees to those rules when they sign. The clause's enforceability rests on the condo declaration, not on the lease itself. A blanket landlord no-pets clause, separate from condo rules, remains unenforceable.",
			},
			{
				q: "What happens if I forget to pay LMR interest?",
				a: "The tenant can apply to the LTB for back-interest owed at any point during the tenancy or within one year of moving out. Interest accrues annually at the guideline rate; the LTB can order payment plus filing fees. It's worth getting right on the first anniversary.",
			},
			{
				q: "Does FastLease prepare the Standard Lease as part of the engagement?",
				a: "Yes. The Ontario Standard Lease (with Section 15 customized for the specific unit, condo addendum attached, and LMR/parking/locker fields properly filled in) is prepared as part of every FastLease engagement. The lease is presented to the owner for review before the tenant signs.",
			},
		],
	},
];

export function findGlossaryPost(slug: string): GlossaryPost | undefined {
	return GLOSSARY_POSTS.find((p) => p.slug === slug);
}
