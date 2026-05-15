import "~/styles/globals.css";

import type { Metadata } from "next";
import Script from "next/script";
import { TRPCReactProvider } from "~/trpc/react";
import { Analytics } from "./_components/providers/Analytics";
import { env } from "~/env";
import { localBusinessSchema } from "~/lib/seo";

export const metadata: Metadata = {
	metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
	title: "FastLease.ca — Leased by day 21, or 21% off the fee.",
	description:
		"21-day Toronto condo leasing operated by Property.ca Inc. Brokerage. Featured on property.ca and condos.ca. If we don't sign by day 21, our fee drops 21%.",
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

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
				<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
				<Script id="ld-org" type="application/ld+json" strategy="beforeInteractive">
					{JSON.stringify(localBusinessSchema())}
				</Script>
			</head>
			<body>
				<TRPCReactProvider>{children}</TRPCReactProvider>
				<Analytics />
			</body>
		</html>
	);
}
