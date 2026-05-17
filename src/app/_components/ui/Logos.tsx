import type { FC } from "react";
import { cn } from "~/lib/utils";

interface LogoMarkProps {
	variant?: "timestamp" | "counter" | "abstract";
	size?: number;
	className?: string;
}

export const LogoMark: FC<LogoMarkProps> = ({
	variant = "timestamp",
	size = 22,
	className,
}) => {
	const sw = 1.6;

	if (variant === "timestamp") {
		return (
			<svg
				aria-hidden="true"
				className={className}
				height={size}
				viewBox="0 0 24 24"
				width={size}
			>
				<rect
					fill="none"
					height="19"
					rx="3"
					stroke="currentColor"
					strokeWidth={sw}
					width="19"
					x="2.5"
					y="2.5"
				/>
				<path
					d="M7 12.4 L10.6 16 L17 8.5"
					fill="none"
					stroke="var(--accent)"
					strokeLinecap="square"
					strokeLinejoin="miter"
					strokeWidth="2"
				/>
			</svg>
		);
	}

	if (variant === "counter") {
		return (
			<svg
				aria-hidden="true"
				className={className}
				height={size}
				viewBox="0 0 24 24"
				width={size}
			>
				<circle
					cx="12"
					cy="12"
					fill="none"
					opacity=".22"
					r="9"
					stroke="currentColor"
					strokeWidth={sw}
				/>
				<path
					d="M12 3 a9 9 0 0 1 7.79 13.5"
					fill="none"
					stroke="var(--accent)"
					strokeLinecap="square"
					strokeWidth={sw + 0.4}
				/>
				<circle cx="12" cy="12" fill="currentColor" r="1.6" />
			</svg>
		);
	}

	return (
		<svg
			aria-hidden="true"
			className={className}
			height={size}
			viewBox="0 0 24 24"
			width={size}
		>
			<rect fill="currentColor" height="18" width="6" x="3" y="3" />
			<rect
				fill="currentColor"
				height="15"
				opacity=".55"
				width="4"
				x="11"
				y="6"
			/>
			<rect fill="var(--accent)" height="12" width="4" x="17" y="9" />
		</svg>
	);
};

interface WordmarkProps {
	variant?: "timestamp" | "counter" | "abstract" | "wordmark";
	mono?: boolean;
	className?: string;
}

export const Wordmark: FC<WordmarkProps> = ({
	variant = "timestamp",
	mono = false,
	className,
}) => {
	return (
		<span className={cn("inline-flex items-center gap-[10px]", className)}>
			{variant !== "wordmark" && (
				<LogoMark size={20} variant={variant as never} />
			)}
			<span
				style={{
					fontWeight: 600,
					fontSize: 17,
					letterSpacing: "-0.018em",
					color: mono ? "inherit" : "var(--color-ink)",
				}}
			>
				FastLease
				<span style={{ color: "var(--color-ink-faint)", fontWeight: 500 }}>
					.ca
				</span>
			</span>
		</span>
	);
};
