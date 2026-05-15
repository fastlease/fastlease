"use client";

import Image from "next/image";
import { env } from "~/env";
import { LEASES } from "~/lib/leases";
import { Button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";

interface OperatorProps {
	onOpenCall?: () => void;
}

export function Operator({ onOpenCall }: OperatorProps) {
	const loomId = env.NEXT_PUBLIC_LOOM_VIDEO_ID;
	const reco = env.NEXT_PUBLIC_RECO_LICENSE_NUMBER;

	return (
		<section
			className="section-pad bg-[color-mix(in_oklab,var(--bg),var(--ink)_3%)]"
			id="operator"
		>
			<div className="wrap">
				<Reveal className="mb-7 flex items-center gap-4">
					<span className="num text-[12px] text-ink-mute uppercase tracking-[0.14em]">
						05
					</span>
					<span className="h-[1px] flex-1 bg-hair" />
					<span className="font-medium text-[11px] text-ink-mute uppercase tracking-[0.14em]">
						Who runs the file
					</span>
				</Reveal>

				<div className="grid grid-cols-[1fr_1.35fr] items-start gap-14 max-md:grid-cols-1 max-md:gap-8">
					<div>
						<Reveal className="mb-6 max-md:max-w-[280px]">
							<div className="relative aspect-[4/5] overflow-hidden rounded-[14px] border border-hair bg-[color-mix(in_oklab,var(--bg,#fff),var(--ink)_6%)]">
								{/* When /sasha.jpg is dropped into /public, this img renders; otherwise the monogram + initials placeholder shows. */}
								<Image
									alt="Sasha Bastani, broker"
									className="h-full w-full object-cover"
									fill
									onError={(e) => {
										(e.currentTarget as HTMLImageElement).style.display =
											"none";
									}}
									src="/sasha.jpg"
								/>
								<div className="pointer-events-none absolute inset-0 -z-[1] grid select-none place-items-center font-medium text-[64px] text-ink-mute tracking-[-0.04em]">
									SB
								</div>
							</div>
						</Reveal>
						<Reveal
							as="div"
							className="mb-1 font-medium text-[clamp(28px,3vw,36px)] leading-[1.05] tracking-[-0.025em]"
						>
							Sasha Bastani
						</Reveal>
						<Reveal as="div" className="mb-7 text-[14px] text-ink-soft">
							Broker · Property.ca Inc. Brokerage
						</Reveal>

						<Reveal className="flex flex-col">
							{[
								{
									k: "Brokerage",
									v: "Property.ca Inc.",
									href: "https://property.ca",
								},
								{ k: "Coverage", v: "Toronto condo market" },
								{ k: "Distribution", v: "property.ca · condos.ca" },
								{
									k: "Recent activity",
									v: `${LEASES.length} closed leases on the public log`,
									href: "#leases",
								},
								{
									k: "License",
									v: reco
										? `Ontario · RECO #${reco}`
										: "Ontario · RECO registered",
									href: reco
										? `https://www.reco.on.ca/ComplaintsAndEnforcement/RegistrantSearch?term=${encodeURIComponent(reco)}`
										: undefined,
								},
							].map((r) => {
								const external = r.href?.startsWith("http");
								return (
									<div
										className="grid grid-cols-[140px_1fr] gap-3 border-hair border-t py-3 last:border-b"
										key={r.k}
									>
										<span className="pt-0.5 font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em]">
											{r.k}
										</span>
										{r.href ? (
											<a
												href={r.href}
												{...(external
													? { target: "_blank", rel: "noopener noreferrer" }
													: {})}
												className="text-[15px] text-ink underline decoration-hair underline-offset-[3px] transition-colors hover:text-accent"
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
							<Button onClick={onOpenCall} variant="ghost">
								Book a 15-minute call
							</Button>
						</Reveal>
					</div>

					<div className="max-md:order-first">
						{loomId ? (
							<Reveal className="mb-7 aspect-video overflow-hidden rounded-[14px] border border-hair bg-black">
								<iframe
									allowFullScreen
									className="h-full w-full"
									src={`https://www.loom.com/embed/${loomId}?hide_owner=true&hide_share=true&hideEmbedTopBar=true`}
									title="Sasha — how FastLease works in 60 seconds"
								/>
							</Reveal>
						) : (
							<Reveal className="mb-7 grid aspect-video place-items-center overflow-hidden rounded-[14px] border border-hair-strong border-dashed bg-[color-mix(in_oklab,var(--bg,#fff),white_35%)] text-ink-mute">
								<div className="px-6 text-center">
									<div className="mb-1.5 text-[11px] uppercase tracking-[0.14em]">
										Video placeholder
									</div>
									<div className="text-[14px]">
										Set <span className="num">NEXT_PUBLIC_LOOM_VIDEO_ID</span>{" "}
										to render Sasha&apos;s intro.
									</div>
								</div>
							</Reveal>
						)}

						<Reveal
							as="p"
							className="mb-6 max-w-[52ch] text-[19px] text-ink leading-[1.45] max-md:text-[17px]"
						>
							&ldquo;I built FastLease because the leasing process I worked
							inside as a broker was good at activity and bad at outcomes. The
							21-day guarantee, the published screening standards, and the
							placement on property.ca and condos.ca are the three things I
							wished every owner got by default.&rdquo;
						</Reveal>
						<Reveal
							as="div"
							className="text-[13px] text-ink-mute uppercase tracking-[0.12em]"
						>
							— Sasha Bastani, Broker
						</Reveal>

						<Reveal
							as="p"
							className="mt-10 max-w-[52ch] text-[15px] text-ink-soft leading-[1.6]"
						>
							Property.ca Inc. Brokerage is the firm behind property.ca and
							condos.ca, two of Toronto&apos;s most-trafficked real-estate
							platforms. FastLease is the leasing product built inside that
							brokerage — same audience, same data, with the operating
							discipline of a guaranteed timeline.
						</Reveal>
					</div>
				</div>
			</div>
		</section>
	);
}
