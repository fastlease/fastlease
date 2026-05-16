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
		primary:
			"bg-accent text-accent-ink hover:bg-[color-mix(in_oklab,var(--accent),black_12%)]",
		ghost: "bg-transparent text-ink border-hair-strong border hover:border-ink",
	};

	return (
		<button
			className={cn(
				"inline-flex h-[52px] cursor-pointer items-center justify-center gap-[10px] rounded-full px-[22px] font-medium text-[16px] transition-all duration-120 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
				variants[variant],
				className,
			)}
			{...props}
		>
			{children}
			{showArrow && (
				<span className="translate-y-[-1px] text-[18px] leading-none">→</span>
			)}
		</button>
	);
};
