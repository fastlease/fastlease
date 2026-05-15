"use client";

import { useEffect, useState } from "react";
import { env } from "~/env";
import { Events, track, trackCTA } from "~/lib/analytics";
import { cn } from "~/lib/utils";
import { Button } from "../ui/Button";

interface StickyCTAProps {
	onOpenForm?: () => void;
}

export function StickyCTA({ onOpenForm }: StickyCTAProps) {
	const [show, setShow] = useState(false);
	const sms = env.NEXT_PUBLIC_SMS_NUMBER;

	useEffect(() => {
		const onScroll = () => setShow(window.scrollY > 700);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<div
			className={cn(
				"fixed inset-x-4 bottom-4 z-40 hidden gap-2 transition-all duration-300 max-md:flex",
				show
					? "translate-y-0 opacity-100"
					: "pointer-events-none translate-y-16 opacity-0",
			)}
		>
			<Button
				className="flex-1 shadow-[0_14px_36px_rgba(0,0,0,0.22)]"
				onClick={() => {
					trackCTA("sticky-cta", "timeline");
					onOpenForm?.();
				}}
				showArrow
			>
				21-day timeline
			</Button>
			{sms && (
				<a
					aria-label="Text Sasha"
					className="grid h-[52px] w-[52px] cursor-pointer appearance-none place-items-center rounded-full border border-ink bg-[var(--bg)] text-[20px] text-ink shadow-[0_14px_36px_rgba(0,0,0,0.18)]"
					href={`sms:${sms}?&body=${encodeURIComponent("Hi Sasha — got a unit to lease, can you send your rent estimate?")}`}
					onClick={() => track(Events.smsClicked, { source: "sticky-cta" })}
				>
					<span className="sr-only">Text Sasha</span>
					<svg
						aria-hidden
						fill="none"
						height="20"
						role="img"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="1.8"
						viewBox="0 0 24 24"
						width="20"
					>
						<title>SMS Icon</title>
						<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
					</svg>
				</a>
			)}
		</div>
	);
}
