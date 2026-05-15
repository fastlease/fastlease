"use client";

import Link from "next/link";
import { useState } from "react";
import { Footer } from "~/app/_components/sections/Footer";
import { Nav } from "~/app/_components/sections/Nav";
import { Button } from "~/app/_components/ui/Button";
import { Reveal } from "~/app/_components/ui/Reveal";
import { Events, track } from "~/lib/analytics";
import { BEDROOM_TYPES, LEASES, NEIGHBORHOODS } from "~/lib/leases";
import { readAttribution } from "~/lib/referral";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

const MOVE_OPTIONS = [
	{ k: "urgent", l: "< 30 days" },
	{ k: "soon", l: "30–60 days" },
	{ k: "flexible", l: "Flexible" },
];

export function TenantsClient() {
	const [neighborhood, setNeighborhood] = useState("King West");
	const [bedrooms, setBedrooms] = useState("1BR");
	const [move, setMove] = useState("flexible");
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [sent, setSent] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const submit = api.lead.tenantShortlist.useMutation();

	const send = async () => {
		setError(null);
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			setError("That email doesn't look right.");
			return;
		}
		try {
			await submit.mutateAsync({
				email,
				name: name || undefined,
				neighborhood,
				bedrooms,
				moveWindow: move,
				attribution: readAttribution(),
			});
			track(Events.leadSubmitted, { source: "tenants" });
			setSent(true);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Something went wrong.");
		}
	};

	return (
		<div className="min-h-screen bg-paper text-ink">
			<Nav />
			<main>
				<section className="section-pad pt-[clamp(80px,8vw,140px)]">
					<div className="wrap">
						<Reveal className="mb-5 flex items-center gap-3 text-[11px] text-ink-mute uppercase tracking-[0.14em]">
							<Link
								className="underline decoration-hair underline-offset-[3px] hover:text-ink"
								href="/"
							>
								FastLease
							</Link>
							<span className="text-ink-faint">·</span>
							<span className="text-ink">For renters</span>
						</Reveal>
						<Reveal
							as="h1"
							className="max-w-[20ch] font-medium text-[clamp(40px,6vw,72px)] leading-[1.02] tracking-[-0.03em]"
						>
							Get the lease before it lists.
						</Reveal>
						<Reveal
							as="p"
							className="mt-5 max-w-[58ch] text-[18px] text-ink-soft leading-[1.55]"
						>
							FastLease is operated by Property.ca Inc. Brokerage — the firm
							behind property.ca and condos.ca. Tell us what you&apos;re looking
							for and we&apos;ll match you to incoming leases before they hit
							the open market.
						</Reveal>
					</div>
				</section>

				<section className="section-pad pt-0">
					<div className="wrap">
						<Reveal className="rounded-[14px] border border-hair bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] p-9 max-md:p-7">
							{sent ? (
								<div className="py-6 text-center">
									<div className="mb-2 text-[11px] text-accent uppercase tracking-[0.14em]">
										You&apos;re on the list
									</div>
									<h3 className="mb-2 font-medium text-[28px] tracking-[-0.02em]">
										We&apos;ll email you when a matching unit lists.
									</h3>
									<p className="mx-auto max-w-[44ch] text-[15px] text-ink-soft">
										Looking for: {bedrooms} in {neighborhood}, moving{" "}
										{MOVE_OPTIONS.find((m) => m.k === move)?.l.toLowerCase()}.
									</p>
								</div>
							) : (
								<>
									<div className="mb-3 font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
										Join the shortlist
									</div>
									<h3 className="mb-6 max-w-[26ch] font-medium text-[clamp(24px,2.6vw,32px)] leading-[1.1] tracking-[-0.025em]">
										Three answers. Early access to listings, no junk.
									</h3>

									<div className="mb-5 grid grid-cols-3 gap-4 max-md:grid-cols-1">
										<Field label="Neighborhood">
											<select
												className="h-12 w-full rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] px-3.5 text-[15px] text-ink outline-none focus:border-ink"
												onChange={(e) => setNeighborhood(e.target.value)}
												value={neighborhood}
											>
												{NEIGHBORHOODS.map((n) => (
													<option key={n} value={n}>
														{n}
													</option>
												))}
											</select>
										</Field>
										<Field label="Bedrooms">
											<div className="flex flex-wrap gap-1.5">
												{BEDROOM_TYPES.map((b) => (
													<button
														className={cn(
															"h-10 cursor-pointer appearance-none rounded-full border border-hair-strong px-3.5 text-[13px] transition-colors hover:border-ink",
															bedrooms === b && "border-ink bg-ink text-paper",
														)}
														key={b}
														onClick={() => setBedrooms(b)}
														type="button"
													>
														{b}
													</button>
												))}
											</div>
										</Field>
										<Field label="Move-in window">
											<div className="flex flex-wrap gap-1.5">
												{MOVE_OPTIONS.map((m) => (
													<button
														className={cn(
															"h-10 cursor-pointer appearance-none rounded-full border border-hair-strong px-3.5 text-[13px] transition-colors hover:border-ink",
															move === m.k && "border-ink bg-ink text-paper",
														)}
														key={m.k}
														onClick={() => setMove(m.k)}
														type="button"
													>
														{m.l}
													</button>
												))}
											</div>
										</Field>
									</div>

									<div className="mb-5 grid grid-cols-2 gap-4 max-md:grid-cols-1">
										<Field label="Email">
											<input
												className="h-12 w-full rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] px-3.5 text-[15px] text-ink outline-none focus:border-ink"
												onChange={(e) => setEmail(e.target.value)}
												placeholder="you@domain.com"
												type="email"
												value={email}
											/>
										</Field>
										<Field label="Name (optional)">
											<input
												className="h-12 w-full rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] px-3.5 text-[15px] text-ink outline-none focus:border-ink"
												onChange={(e) => setName(e.target.value)}
												placeholder="First name"
												value={name}
											/>
										</Field>
									</div>

									{error && (
										<div className="mb-4 rounded-lg border border-[#fcb] bg-[#fde] px-3.5 py-2.5 text-[#a23] text-[13px]">
											{error}
										</div>
									)}

									<Button disabled={submit.isPending} onClick={send} showArrow>
										{submit.isPending ? "Sending…" : "Add me to the shortlist"}
									</Button>
								</>
							)}
						</Reveal>
					</div>
				</section>

				<section className="section-pad">
					<div className="wrap">
						<Reveal className="mb-7 flex items-center gap-4">
							<span className="num text-[12px] text-ink-mute uppercase tracking-[0.14em]">
								02
							</span>
							<span className="h-[1px] flex-1 bg-hair" />
							<span className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
								Recent FastLease leases
							</span>
						</Reveal>
						<Reveal
							as="p"
							className="mb-8 max-w-[52ch] text-[17px] text-ink-soft"
						>
							What our shortlist members signed in the last 90 days. Anonymized
							at the unit level.
						</Reveal>
						<div className="grid grid-cols-3 gap-4 max-md:grid-cols-1 max-lg:grid-cols-2">
							{LEASES.slice(0, 6).map((l) => (
								<Reveal
									className="flex flex-col gap-3 rounded-[14px] border border-hair bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] p-6"
									key={`${l.n}-${l.u}-${l.signed}`}
								>
									<div className="flex items-baseline justify-between">
										<span className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
											{l.n}
										</span>
										<span className="text-[13px] text-ink-mute">{l.u}</span>
									</div>
									<div className="num font-medium text-[28px] leading-none tracking-[-0.025em]">
										${l.leased.toLocaleString()}
										<span className="ml-1 font-normal text-[13px] text-ink-faint">
											/mo
										</span>
									</div>
									<div className="num text-[13px] text-ink-soft">
										Signed {l.signed} · {l.days} days on market
									</div>
								</Reveal>
							))}
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
}

function Field({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div>
			<div className="mb-2 block font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em]">
				{label}
			</div>
			{children}
		</div>
	);
}
