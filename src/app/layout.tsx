import "~/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { env } from "~/env";
import { localBusinessSchema, serviceOfferSchema } from "~/lib/seo";
import { TRPCReactProvider } from "~/trpc/react";
import { Analytics } from "./_components/providers/Analytics";

const jakarta = Plus_Jakarta_Sans({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-plus-jakarta-sans",
	display: "swap",
});

const jetbrains = JetBrains_Mono({
	subsets: ["latin"],
	weight: ["400", "500"],
	variable: "--font-jetbrains-mono",
	display: "swap",
});

export const metadata: Metadata = {
	metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
	title: "FastLease.ca — Leased by day 21, or 21% off the fee.",
	description:
		"21-day Toronto condo leasing operated by Property.ca Inc. Brokerage. Featured on property.ca and condos.ca. If we don't sign by day 21, our fee drops 21%.",
	alternates: { canonical: env.NEXT_PUBLIC_SITE_URL },
	icons: [{ rel: "icon", url: "/favicon.ico" }],
	openGraph: {
		title: "FastLease.ca — Leased by day 21, or 21% off the fee.",
		description:
			"21-day Toronto condo leasing. Featured on property.ca and condos.ca.",
		url: env.NEXT_PUBLIC_SITE_URL,
		siteName: "FastLease",
		type: "website",
		locale: "en_CA",
	},
	twitter: {
		card: "summary_large_image",
		title: "FastLease.ca — Leased by day 21, or 21% off the fee.",
		description:
			"21-day Toronto condo leasing. Featured on property.ca and condos.ca.",
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: "#FAF8F3",
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html className={`${jakarta.variable} ${jetbrains.variable}`} lang="en">
			<head>
				<Script
					id="ld-org"
					strategy="beforeInteractive"
					type="application/ld+json"
				>
					{JSON.stringify(localBusinessSchema())}
				</Script>
				<Script
					id="ld-service"
					strategy="beforeInteractive"
					type="application/ld+json"
				>
					{JSON.stringify(serviceOfferSchema())}
				</Script>
			</head>
			<body>
				<TRPCReactProvider>{children}</TRPCReactProvider>
				<Analytics />
			</body>
		</html>
	);
}
