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
	className 
}) => {
	const sw = 1.6;

	if (variant === "timestamp") {
		return (
			<svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className}>
				<rect x="2.5" y="2.5" width="19" height="19" rx="3" fill="none" stroke="currentColor" strokeWidth={sw}/>
				<path d="M7 12.4 L10.6 16 L17 8.5" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"/>
			</svg>
		);
	}
	
	if (variant === "counter") {
		return (
			<svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className}>
				<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth={sw} opacity=".22"/>
				<path d="M12 3 a9 9 0 0 1 7.79 13.5" fill="none" stroke="var(--accent)" strokeWidth={sw + 0.4} strokeLinecap="square"/>
				<circle cx="12" cy="12" r="1.6" fill="currentColor"/>
			</svg>
		);
	}

	return (
		<svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className}>
			<rect x="3" y="3" width="6" height="18" fill="currentColor"/>
			<rect x="11" y="6" width="4" height="15" fill="currentColor" opacity=".55"/>
			<rect x="17" y="9" width="4" height="12" fill="var(--accent)"/>
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
	className 
}) => {
	return (
		<span className={cn("inline-flex items-center gap-[10px]", className)}>
			{variant !== "wordmark" && <LogoMark variant={variant as any} size={20}/>}
			<span style={{
				fontWeight: 600,
				fontSize: 17,
				letterSpacing: '-0.018em',
				color: mono ? 'inherit' : 'var(--color-ink)'
			}}>
				FastLease<span style={{ color: 'var(--color-ink-faint)', fontWeight: 500 }}>.ca</span>
			</span>
		</span>
	);
};
