"use client";

import {
	motion,
	useInView,
	useMotionValue,
	useSpring,
	useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "~/lib/utils";

interface CountUpProps {
	to: number;
	decimals?: number;
	suffix?: string;
	prefix?: string;
	className?: string;
}

export function CountUp({
	to,
	decimals = 0,
	suffix = "",
	prefix = "",
	className = "",
}: CountUpProps) {
	const ref = useRef<HTMLSpanElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	const motionValue = useMotionValue(0);
	const springValue = useSpring(motionValue, {
		damping: 30,
		stiffness: 100,
	});

	const displayValue = useTransform(springValue, (latest) => {
		const formatted =
			decimals > 0
				? latest.toFixed(decimals)
				: Math.round(latest).toLocaleString();
		return `${prefix}${formatted}${suffix}`;
	});

	useEffect(() => {
		if (isInView) {
			motionValue.set(to);
		}
	}, [isInView, to, motionValue]);

	return (
		<motion.span className={cn("num", className)} ref={ref}>
			{displayValue}
		</motion.span>
	);
}
