"use client";

import { useState } from "react";
import Link from "next/link";
import { Nav } from "~/app/_components/sections/Nav";
import { Footer } from "~/app/_components/sections/Footer";
import { Button } from "~/app/_components/ui/Button";
import { Reveal } from "~/app/_components/ui/Reveal";
import { cn } from "~/lib/utils";
import { LEASES, NEIGHBORHOODS, BEDROOM_TYPES } from "~/lib/leases";
import { api } from "~/trpc/react";
import { readAttribution } from "~/lib/referral";
import { track, Events } from "~/lib/analytics";

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
						<Reveal className="text-[11px] uppercase tracking-[0.14em] text-ink-mute mb-5 flex items-center gap-3">
							<Link href="/" className="hover:text-ink underline decoration-hair underline-offset-[3px]">FastLease</Link>
							<span className="text-ink-faint">·</span>
							<span className="text-ink">For renters</span>
						</Reveal>
						<Reveal as="h1" className="text-[clamp(40px,6vw,72px)] font-medium tracking-[-0.03em] leading-[1.02] max-w-[20ch]">
							Get the lease before it lists.
						</Reveal>
						<Reveal as="p" className="text-[18px] text-ink-soft mt-5 max-w-[58ch] leading-[1.55]">
							FastLease is operated by Property.ca Inc. Brokerage — the firm behind property.ca and condos.ca. Tell us what you&apos;re looking for and we&apos;ll match you to incoming leases before they hit the open market.
						</Reveal>
					</div>
				</section>

				<section className="section-pad pt-0">
					<div className="wrap">
						<Reveal className="p-9 max-md:p-7 bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] border border-hair rounded-[14px]">
							{sent ? (
								<div className="py-6 text-center">
									<div className="text-[11px] uppercase tracking-[0.14em] text-accent mb-2">You&apos;re on the list</div>
									<h3 className="text-[28px] font-medium tracking-[-0.02em] mb-2">
										We&apos;ll email you when a matching unit lists.
									</h3>
									<p className="text-[15px] text-ink-soft max-w-[44ch] mx-auto">
										Looking for: {bedrooms} in {neighborhood}, moving {MOVE_OPTIONS.find((m) => m.k === move)?.l.toLowerCase()}.
									</p>
								</div>
							) : (
								<>
									<div className="text-[11px] font-medium tracking-[0.14em] text-ink-mute uppercase mb-3">Join the shortlist</div>
									<h3 className="text-[clamp(24px,2.6vw,32px)] font-medium tracking-[-0.025em] leading-[1.1] mb-6 max-w-[26ch]">
										Three answers. Early access to listings, no junk.
									</h3>

									<div className="grid grid-cols-3 max-md:grid-cols-1 gap-4 mb-5">
										<Field label="Neighborhood">
											<select
												value={neighborhood}
												onChange={(e) => setNeighborhood(e.target.value)}
												className="h-12 px-3.5 rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] text-ink text-[15px] outline-none focus:border-ink w-full"
											>
												{NEIGHBORHOODS.map((n) => (
													<option key={n} value={n}>{n}</option>
												))}
											</select>
										</Field>
										<Field label="Bedrooms">
											<div className="flex flex-wrap gap-1.5">
												{BEDROOM_TYPES.map((b) => (
													<button
														key={b}
														type="button"
														onClick={() => setBedrooms(b)}
														className={cn(
															"appearance-none cursor-pointer h-10 px-3.5 border border-hair-strong rounded-full text-[13px] transition-colors hover:border-ink",
															bedrooms === b && "border-ink bg-ink text-paper",
														)}
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
														key={m.k}
														type="button"
														onClick={() => setMove(m.k)}
														className={cn(
															"appearance-none cursor-pointer h-10 px-3.5 border border-hair-strong rounded-full text-[13px] transition-colors hover:border-ink",
															move === m.k && "border-ink bg-ink text-paper",
														)}
													>
														{m.l}
													</button>
												))}
											</div>
										</Field>
									</div>

									<div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 mb-5">
										<Field label="Email">
											<input
												type="email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												placeholder="you@domain.com"
												className="h-12 px-3.5 rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] text-ink text-[15px] outline-none focus:border-ink w-full"
											/>
										</Field>
										<Field label="Name (optional)">
											<input
												value={name}
												onChange={(e) => setName(e.target.value)}
												placeholder="First name"
												className="h-12 px-3.5 rounded-lg border border-hair-strong bg-[var(--bg,#FAF8F3)] text-ink text-[15px] outline-none focus:border-ink w-full"
											/>
										</Field>
									</div>

									{error && (
										<div className="mb-4 py-2.5 px-3.5 text-[13px] text-[#a23] bg-[#fde] border border-[#fcb] rounded-lg">
											{error}
										</div>
									)}

									<Button onClick={send} showArrow disabled={submit.isPending}>
										{submit.isPending ? "Sending…" : "Add me to the shortlist"}
									</Button>
								</>
							)}
						</Reveal>
					</div>
				</section>

				<section className="section-pad">
					<div className="wrap">
						<Reveal className="flex items-center gap-4 mb-7">
							<span className="num text-[12px] tracking-[0.14em] text-ink-mute uppercase">02</span>
							<span className="flex-1 h-[1px] bg-hair" />
							<span className="text-[11px] font-medium tracking-[0.14em] text-ink-mute uppercase">Recent FastLease leases</span>
						</Reveal>
						<Reveal as="p" className="text-[17px] text-ink-soft max-w-[52ch] mb-8">
							What our shortlist members signed in the last 90 days. Anonymized at the unit level.
						</Reveal>
						<div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-4">
							{LEASES.slice(0, 6).map((l) => (
								<Reveal key={`${l.n}-${l.u}-${l.signed}`} className="p-6 flex flex-col gap-3 bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] border border-hair rounded-[14px]">
									<div className="flex justify-between items-baseline">
										<span className="text-[11px] font-medium tracking-[0.14em] text-ink-mute uppercase">{l.n}</span>
										<span className="text-[13px] text-ink-mute">{l.u}</span>
									</div>
									<div className="text-[28px] font-medium tracking-[-0.025em] leading-none num">
										${l.leased.toLocaleString()}
										<span className="text-[13px] text-ink-faint font-normal ml-1">/mo</span>
									</div>
									<div className="text-[13px] text-ink-soft num">Signed {l.signed} · {l.days} days on market</div>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div>
			<label className="text-[11px] uppercase tracking-[0.12em] text-ink-mute font-medium block mb-2">{label}</label>
			{children}
		</div>
	);
}
