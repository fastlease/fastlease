import type { Metadata } from "next";
import { PageLayout } from "./_components/PageLayout";

export const metadata: Metadata = {
	title: "FastLease | Toronto Condo Leasing, Streamlined",
	description: "A modern leasing system for Toronto condo owners. Leased by day 21, or 21% off the fee.",
	openGraph: {
		title: "FastLease | Toronto Condo Leasing, Streamlined",
		description: "A modern leasing system for Toronto condo owners. Leased by day 21, or 21% off the fee.",
		url: "https://fastlease.ca", // Adjust URL as appropriate later
		siteName: "FastLease",
		locale: "en_CA",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "FastLease | Toronto Condo Leasing, Streamlined",
		description: "A modern leasing system for Toronto condo owners. Leased by day 21, or 21% off the fee.",
	},
};

export default function Home() {
	return <PageLayout />;
}
