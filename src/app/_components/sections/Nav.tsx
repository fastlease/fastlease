"use client";

import { useEffect, useState } from "react";
import { trackCTA } from "~/lib/analytics";
import { cn } from "~/lib/utils";
import { Button } from "../ui/Button";
import { Wordmark } from "../ui/Logos";

interface NavProps {
	onOpenForm?: () => void;
	logoVariant?: "timestamp" | "counter" | "abstract";
}

export function Nav({ onOpenForm, logoVariant = "timestamp" }: NavProps) {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={cn(
				"sticky top-0 z-30 transition-all duration-200",
				scrolled &&
					"border-hair border-b bg-[color-mix(in_oklab,var(--bg,#FAF8F3)_88%,transparent)] backdrop-blur-[14px] backdrop-saturate-[160%]",
			)}
		>
			<div className="wrap flex items-center justify-between gap-7 py-[18px] max-md:py-[14px]">
				<a className="shrink-0" href="#top">
					<Wordmark variant={logoVariant} />
				</a>

				<nav className="flex items-center gap-[26px] max-md:hidden">
					<a
						className="text-[14px] text-ink-soft tracking-[-0.005em] transition-colors hover:text-ink"
						href="#how"
					>
						How It Works
					</a>
					<a
						className="text-[14px] text-ink-soft tracking-[-0.005em] transition-colors hover:text-ink"
						href="#pricing"
					>
						Pricing
					</a>
					<a
						className="text-[14px] text-ink-soft tracking-[-0.005em] transition-colors hover:text-ink"
						href="#leases"
					>
						Recent Leases
					</a>
				</nav>

				<Button
					className="h-[42px] px-4 text-[14px]"
					onClick={() => {
						trackCTA("nav", "timeline");
						onOpenForm?.();
					}}
					showArrow
					variant="primary"
				>
					Get my plan
				</Button>
			</div>
		</header>
	);
}
