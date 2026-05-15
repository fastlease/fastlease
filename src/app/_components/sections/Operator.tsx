"use client";

import { Reveal } from "../ui/Reveal";
import { Button } from "../ui/Button";
import { env } from "~/env";
import { LEASES } from "~/lib/leases";

interface OperatorProps {
	onOpenCall?: () => void;
}

export function Operator({ onOpenCall }: OperatorProps) {
	const loomId = env.NEXT_PUBLIC_LOOM_VIDEO_ID;
	const reco = env.NEXT_PUBLIC_RECO_LICENSE_NUMBER;

	return (
		<section id="operator" className="section-pad bg-[color-mix(in_oklab,var(--bg),var(--ink)_3%)]">
			<div className="wrap">
				<Reveal className="flex items-center gap-4 mb-7">
					<span className="num text-[12px] tracking-[0.14em] text-ink-mute uppercase">05</span>
					<span className="flex-1 h-[1px] bg-hair" />
					<span className="text-[11px] font-medium tracking-[0.14em] text-ink-mute uppercase">Who runs the file</span>
				</Reveal>

				<div className="grid grid-cols-[1fr_1.35fr] max-md:grid-cols-1 gap-14 max-md:gap-8 items-start">
					<div>
						<Reveal className="mb-6 max-md:max-w-[280px]">
							<div className="aspect-[4/5] rounded-[14px] border border-hair overflow-hidden bg-[color-mix(in_oklab,var(--bg,#fff),var(--ink)_6%)] relative">
								{/* When /sasha.jpg is dropped into /public, this img renders; otherwise the monogram + initials placeholder shows. */}
								<img
									src="/sasha.jpg"
									alt="Sasha Bastani, broker"
									className="w-full h-full object-cover"
									onError={(e) => {
										(e.currentTarget as HTMLImageElement).style.display = "none";
									}}
								/>
								<div className="absolute inset-0 grid place-items-center text-[64px] font-medium tracking-[-0.04em] text-ink-mute select-none pointer-events-none -z-[1]">
									SB
								</div>
							</div>
						</Reveal>
						<Reveal as="div" className="text-[clamp(28px,3vw,36px)] font-medium tracking-[-0.025em] leading-[1.05] mb-1">
							Sasha Bastani
						</Reveal>
						<Reveal as="div" className="text-[14px] text-ink-soft mb-7">
							Broker · Property.ca Inc. Brokerage
						</Reveal>

						<Reveal className="flex flex-col">
							{[
								{ k: "Brokerage", v: "Property.ca Inc.", href: "https://property.ca" },
								{ k: "Coverage", v: "Toronto condo market" },
								{ k: "Distribution", v: "property.ca · condos.ca" },
								{
									k: "Recent activity",
									v: `${LEASES.length} closed leases on the public log`,
									href: "#leases",
								},
								{
									k: "License",
									v: reco ? `Ontario · RECO #${reco}` : "Ontario · RECO registered",
									href: reco
										? `https://www.reco.on.ca/ComplaintsAndEnforcement/RegistrantSearch?term=${encodeURIComponent(reco)}`
										: undefined,
								},
							].map((r) => {
								const external = r.href?.startsWith("http");
								return (
									<div key={r.k} className="grid grid-cols-[140px_1fr] gap-3 py-3 border-t border-hair last:border-b">
										<span className="uppercase tracking-[0.12em] text-[11px] text-ink-mute font-medium pt-0.5">{r.k}</span>
										{r.href ? (
											<a
												href={r.href}
												{...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
												className="text-[15px] text-ink hover:text-accent transition-colors underline decoration-hair underline-offset-[3px]"
											>
												{r.v}
											</a>
										) : (
											<span className="text-[15px] text-ink">{r.v}</span>
										)}
									</div>
								);
							})}
						</Reveal>

						<Reveal className="mt-8">
							<Button variant="ghost" onClick={onOpenCall}>Book a 15-minute call</Button>
						</Reveal>
					</div>

					<div className="max-md:order-first">
						{loomId ? (
							<Reveal className="mb-7 rounded-[14px] overflow-hidden border border-hair bg-black aspect-video">
								<iframe
									title="Sasha — how FastLease works in 60 seconds"
									src={`https://www.loom.com/embed/${loomId}?hide_owner=true&hide_share=true&hideEmbedTopBar=true`}
									allowFullScreen
									className="w-full h-full"
								/>
							</Reveal>
						) : (
							<Reveal className="mb-7 rounded-[14px] overflow-hidden border border-dashed border-hair-strong bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] aspect-video grid place-items-center text-ink-mute">
								<div className="text-center px-6">
									<div className="text-[11px] uppercase tracking-[0.14em] mb-1.5">Video placeholder</div>
									<div className="text-[14px]">Set <span className="num">NEXT_PUBLIC_LOOM_VIDEO_ID</span> to render Sasha&apos;s intro.</div>
								</div>
							</Reveal>
						)}

						<Reveal as="p" className="text-[19px] max-md:text-[17px] text-ink leading-[1.45] max-w-[52ch] mb-6">
							&ldquo;I built FastLease because the leasing process I worked inside as a broker
							was good at activity and bad at outcomes. The 21-day guarantee, the
							published screening standards, and the placement on property.ca and
							condos.ca are the three things I wished every owner got by default.&rdquo;
						</Reveal>
						<Reveal as="div" className="text-[13px] uppercase tracking-[0.12em] text-ink-mute">
							— Sasha Bastani, Broker
						</Reveal>

						<Reveal as="p" className="mt-10 text-[15px] text-ink-soft leading-[1.6] max-w-[52ch]">
							Property.ca Inc. Brokerage is the firm behind property.ca and condos.ca, two of
							Toronto&apos;s most-trafficked real-estate platforms. FastLease is the leasing
							product built inside that brokerage — same audience, same data, with the
							operating discipline of a guaranteed timeline.
						</Reveal>
					</div>
				</div>
			</div>
		</section>
	);
}
