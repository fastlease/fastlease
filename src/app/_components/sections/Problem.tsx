"use client";

import { Reveal } from "../ui/Reveal";

export function Problem() {
	return (
		<section className="section-pad bg-[color-mix(in_oklab,var(--bg),var(--ink)_3%)]">
			<div className="wrap grid grid-cols-1">
				<Reveal className="flex items-center gap-4 mb-7">
					<span className="num text-[12px] tracking-[0.14em] text-ink-mute uppercase">02</span>
					<span className="flex-1 h-[1px] bg-hair" />
					<span className="text-[11px] font-medium tracking-[0.14em] text-ink-mute uppercase">The cost of vacancy</span>
				</Reveal>

				<div className="mt-2">
					<Reveal as="h2" className="max-w-[22ch] mb-8">
						Every vacant day costs you <span className="text-accent num">$107</span>.
					</Reveal>
					<div className="grid grid-cols-2 max-md:grid-cols-1 gap-14 max-md:gap-5 max-w-[920px]">
						<Reveal as="p" className="text-[17px] text-ink-soft leading-[1.55] max-w-[44ch]">
							The number above is the daily rent on a typical King West one-bedroom. Vacancy
							is rarely dramatic. It&apos;s a slow leak — three weeks here, six there — that most
							landlords don&apos;t sit down and total at the end of the year.
						</Reveal>
						<Reveal as="p" className="text-[17px] text-ink-soft leading-[1.55] max-w-[44ch]">
							That&apos;s why FastLease is built around a date instead of a best effort. We don&apos;t
							think you&apos;re losing thousands. We think you already know the math, and you&apos;d
							rather work with someone who reports against it.
						</Reveal>
					</div>
				</div>
			</div>
		</section>
	);
}
