import type { ButtonHTMLAttributes, FC, ReactNode } from "react";
import { cn } from "~/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "ghost";
	children: ReactNode;
	showArrow?: boolean;
}

export const Button: FC<ButtonProps> = ({
	variant = "primary",
	children,
	showArrow = false,
	className,
	...props
}) => {
	const variants = {
		primary: "bg-accent text-accent-ink hover:bg-[color-mix(in_oklab,var(--accent),black_12%)]",
		ghost: "bg-transparent text-ink border-hair-strong border hover:border-ink",
	};

	return (
		<button
			className={cn(
				"inline-flex items-center justify-center gap-[10px] h-[52px] px-[22px] rounded-full font-medium text-[16px] transition-all duration-120 cursor-default outline-none",
				variants[variant],
				className
			)}
			{...props}
		>
			{children}
			{showArrow && (
				<span className="text-[18px] translate-y-[-1px] leading-none">→</span>
			)}
		</button>
	);
};
