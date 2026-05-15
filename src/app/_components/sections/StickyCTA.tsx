"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { cn } from "~/lib/utils";
import { env } from "~/env";
import { track, Events } from "~/lib/analytics";

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
				"hidden max-md:flex fixed bottom-4 inset-x-4 z-40 gap-2 transition-all duration-300",
				show ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none",
			)}
		>
			<Button
				onClick={onOpenForm}
				showArrow
				className="flex-1 shadow-[0_14px_36px_rgba(0,0,0,0.22)]"
			>
				21-day timeline
			</Button>
			{sms && (
				<a
					href={`sms:${sms}?&body=${encodeURIComponent("Hi Sasha — got a unit to lease, can you send your rent estimate?")}`}
					onClick={() => track(Events.smsClicked, { source: "sticky-cta" })}
					className="appearance-none cursor-pointer h-[52px] w-[52px] grid place-items-center rounded-full bg-[var(--bg)] border border-ink shadow-[0_14px_36px_rgba(0,0,0,0.18)] text-ink text-[20px]"
					aria-label="Text Sasha"
				>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
						<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
					</svg>
				</a>
			)}
		</div>
	);
}
