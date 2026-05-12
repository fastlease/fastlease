"use client";

import { motion } from "framer-motion";
import type { ReactNode, ElementType } from "react";

interface RevealProps {
	children: ReactNode;
	as?: ElementType;
	className?: string;
	delay?: number;
}

export function Reveal({
	children,
	as: Component = "div",
	className = "",
	delay = 0,
}: RevealProps) {
	const MotionComponent = motion.create(Component as any);
	
	return (
		<MotionComponent
			initial={{ opacity: 0, y: 14 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "0px 0px -60px 0px" }}
			transition={{
				duration: 0.6,
				ease: [0.21, 0.47, 0.32, 0.98],
				delay: delay,
			}}
			className={className}
		>
			{children}
		</MotionComponent>
	);
}
