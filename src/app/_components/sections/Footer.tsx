import { Wordmark } from "../ui/Logos";

export function Footer({ logoVariant = "timestamp" }: { logoVariant?: "timestamp" | "counter" | "abstract" }) {
	return (
		<footer className="py-20 pb-10 border-t border-hair bg-[color-mix(in_oklab,var(--bg),var(--ink)_2%)]">
			<div className="wrap grid grid-cols-[1.2fr_2fr] max-md:grid-cols-1 gap-14 max-md:gap-8">
				<div>
					<Wordmark variant={logoVariant} />
					<p className="text-[14px] text-ink-soft mt-3.5 max-w-[34ch]">A 21-day leasing system for Toronto condo owners, operated through Property.ca Inc. Brokerage.</p>
				</div>
				<div className="grid grid-cols-3 max-sm:grid-cols-2 gap-6">
					<div>
						<div className="text-[11px] font-medium tracking-[0.12em] text-ink-mute uppercase mb-3.5">The page</div>
						<a href="#how" className="block text-[14px] text-ink-soft mb-2 hover:text-ink transition-colors">How It Works</a>
						<a href="#pricing" className="block text-[14px] text-ink-soft mb-2 hover:text-ink transition-colors">Pricing</a>
						<a href="#leases" className="block text-[14px] text-ink-soft mb-2 hover:text-ink transition-colors">Recent Leases</a>
						<a href="#operator" className="block text-[14px] text-ink-soft mb-2 hover:text-ink transition-colors">Who runs it</a>
					</div>
					<div>
						<div className="text-[11px] font-medium tracking-[0.12em] text-ink-mute uppercase mb-3.5">Operations</div>
						<a className="block text-[14px] text-ink-soft mb-2 hover:text-ink transition-colors" href="mailto:sasha@fastlease.ca">sasha@fastlease.ca</a>
						<a className="block text-[14px] text-ink-soft mb-2 hover:text-ink transition-colors" href="tel:+14165550121">+1 (416) 555-0121</a>
						<span className="block text-[14px] text-ink-soft mb-2">Sasha Bastani, Broker</span>
					</div>
					<div>
						<div className="text-[11px] font-medium tracking-[0.12em] text-ink-mute uppercase mb-3.5">Coverage</div>
						<div className="text-[14px] text-ink-soft mb-2">Downtown · East End</div>
						<div className="text-[14px] text-ink-soft mb-2">Midtown · Waterfront</div>
						<div className="text-[14px] text-ink-soft mb-2">98 buildings · 12 districts</div>
					</div>
				</div>
			</div>
			<div className="wrap mt-14">
				<hr className="border-t border-hair" />
				<div className="flex justify-between pt-6 text-[12px] text-ink-mute max-md:flex-col max-md:gap-1.5">
					<span>© 2026 Property.ca Inc. Brokerage · FastLease is a service offering of Property.ca Inc. Brokerage.</span>
					<span>Brokerage licensed in Ontario.</span>
				</div>
			</div>
		</footer>
	);
}
