import type { Metadata } from "next";
import { SITE } from "~/lib/seo";
import { TenantsClient } from "./Client";

export const metadata: Metadata = {
	title: "Find your next Toronto condo — FastLease shortlist",
	description:
		"FastLease is operated by Property.ca Inc. Brokerage — the firm behind property.ca and condos.ca. Join the shortlist and we'll match you to incoming leases before they hit the open market.",
	alternates: { canonical: `${SITE.url}/tenants` },
	openGraph: {
		title: "Find your next Toronto condo — FastLease shortlist",
		description: "Early access to incoming condo leases from Property.ca Inc. Brokerage.",
		url: `${SITE.url}/tenants`,
	},
};

export default function Page() {
	return <TenantsClient />;
}
