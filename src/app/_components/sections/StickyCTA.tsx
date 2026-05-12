"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { cn } from "~/lib/utils";

interface StickyCTAProps {
	onOpenForm?: () => void;
}

export function StickyCTA({ onOpenForm }: StickyCTAProps) {
	const [show, setShow] = useState(false);

	useEffect(() => {
		const onScroll = () => setShow(window.scrollY > 700);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<div
			className={cn(
				"hidden max-md:flex fixed bottom-4 inset-x-4 z-40 transition-all duration-300",
				show ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none",
			)}
		>
			<Button
				onClick={onOpenForm}
				showArrow
				className="w-full shadow-[0_14px_36px_rgba(0,0,0,0.22)]"
			>
				Get your 21-day timeline
			</Button>
		</div>
	);
}
