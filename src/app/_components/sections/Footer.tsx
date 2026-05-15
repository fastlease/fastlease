import { Wordmark } from "../ui/Logos";

export function Footer({
	logoVariant = "timestamp",
}: {
	logoVariant?: "timestamp" | "counter" | "abstract";
}) {
	return (
		<footer className="border-hair border-t bg-[color-mix(in_oklab,var(--bg),var(--ink)_2%)] py-20 pb-10">
			<div className="wrap grid grid-cols-[1.2fr_2fr] gap-14 max-md:grid-cols-1 max-md:gap-8">
				<div>
					<Wordmark variant={logoVariant} />
					<p className="mt-3.5 max-w-[34ch] text-[14px] text-ink-soft">
						A 21-day leasing system for Toronto condo owners, operated through
						Property.ca Inc. Brokerage.
					</p>
				</div>
				<div className="grid grid-cols-3 gap-6 max-sm:grid-cols-2">
					<div>
						<div className="mb-3.5 font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em]">
							The page
						</div>
						<a
							className="mb-2 block text-[14px] text-ink-soft transition-colors hover:text-ink"
							href="#how"
						>
							How It Works
						</a>
						<a
							className="mb-2 block text-[14px] text-ink-soft transition-colors hover:text-ink"
							href="#pricing"
						>
							Pricing
						</a>
						<a
							className="mb-2 block text-[14px] text-ink-soft transition-colors hover:text-ink"
							href="#leases"
						>
							Recent Leases
						</a>
						<a
							className="mb-2 block text-[14px] text-ink-soft transition-colors hover:text-ink"
							href="#operator"
						>
							Who runs it
						</a>
					</div>
					<div>
						<div className="mb-3.5 font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em]">
							Operations
						</div>
						<a
							className="mb-2 block text-[14px] text-ink-soft transition-colors hover:text-ink"
							href="mailto:contact@fastlease.ca"
						>
							contact@fastlease.ca
						</a>
						<a
							className="mb-2 block text-[14px] text-ink-soft transition-colors hover:text-ink"
							href="tel:+16478356368"
						>
							+1 (647) 835-6368
						</a>
						<span className="mb-2 block text-[14px] text-ink-soft">
							Sasha Bastani, Broker
						</span>
					</div>
					<div>
						<div className="mb-3.5 font-medium text-[11px] text-ink-mute uppercase tracking-[0.12em]">
							Coverage
						</div>
						<div className="mb-2 text-[14px] text-ink-soft">
							Downtown · East End
						</div>
						<div className="mb-2 text-[14px] text-ink-soft">
							Midtown · Waterfront
						</div>
						<div className="mb-2 text-[14px] text-ink-soft">
							98 buildings · 12 districts
						</div>
					</div>
				</div>
			</div>
			<div className="wrap mt-14">
				<hr className="border-hair border-t" />
				<div className="flex justify-between pt-6 text-[12px] text-ink-mute max-md:flex-col max-md:gap-1.5">
					<span>
						© 2026 Property.ca Inc. Brokerage · FastLease is a service offering
						of Property.ca Inc. Brokerage.
					</span>
					<span>Brokerage licensed in Ontario.</span>
				</div>
			</div>
		</footer>
	);
}
