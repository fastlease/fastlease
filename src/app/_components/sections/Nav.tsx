"use client";

import { useEffect, useState } from "react";
import { Wordmark } from "../ui/Logos";
import { Button } from "../ui/Button";
import { cn } from "~/lib/utils";

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
				scrolled && "bg-[color-mix(in_oklab,var(--bg,#FAF8F3)_88%,transparent)] backdrop-saturate-[160%] backdrop-blur-[14px] border-b border-hair"
			)}
		>
			<div className="wrap flex items-center justify-between py-[18px] max-md:py-[14px] gap-7">
				<a className="shrink-0" href="#top">
					<Wordmark variant={logoVariant} />
				</a>
				
				<nav className="flex max-md:hidden items-center gap-[26px]">
					<a className="text-[14px] text-ink-soft tracking-[-0.005em] hover:text-ink transition-colors" href="#how">How It Works</a>
					<a className="text-[14px] text-ink-soft tracking-[-0.005em] hover:text-ink transition-colors" href="#pricing">Pricing</a>
					<a className="text-[14px] text-ink-soft tracking-[-0.005em] hover:text-ink transition-colors" href="#leases">Recent Leases</a>
				</nav>

				<Button 
					variant="primary" 
					className="h-[42px] px-4 text-[14px]" 
					showArrow 
					onClick={onOpenForm}
				>
					Get Your Timeline
				</Button>
			</div>
		</header>
	);
}
