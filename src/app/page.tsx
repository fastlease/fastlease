"use client";

import { useCallback, useState } from "react";
import Script from "next/script";
import { Nav } from "./_components/sections/Nav";
import { Hero } from "./_components/sections/Hero";
import { TimelineSection } from "./_components/sections/Timeline";
import { Distribution } from "./_components/sections/Distribution";
import { Problem } from "./_components/sections/Problem";
import { HowItWorks } from "./_components/sections/HowItWorks";
import { Operator } from "./_components/sections/Operator";
import { Screening } from "./_components/sections/Screening";
import { RecentLeases } from "./_components/sections/RecentLeases";
import { RentWidget } from "./_components/sections/RentWidget";
import { Pricing } from "./_components/sections/Pricing";
import { FAQ } from "./_components/sections/FAQ";
import { FinalCTA } from "./_components/sections/FinalCTA";
import { Footer } from "./_components/sections/Footer";
import { FormModal } from "./_components/sections/FormModal";
import { StickyCTA } from "./_components/sections/StickyCTA";
import { ExitIntent } from "./_components/sections/ExitIntent";
import { faqSchema } from "~/lib/seo";
import { HOMEPAGE_FAQS } from "~/lib/faqs";

type ModalState = { open: boolean; mode: "timeline" | "call" };
type Prefill = { neighborhood?: string; bedrooms?: string } | undefined;
type CalcCtx = { neighborhood: string; bedrooms: string };

export default function Home() {
	const [modal, setModal] = useState<ModalState>({ open: false, mode: "timeline" });
	const [prefill, setPrefill] = useState<Prefill>(undefined);
	const [calcCtx, setCalcCtx] = useState<CalcCtx>({ neighborhood: "King West", bedrooms: "1BR" });
	const onCalcChange = useCallback((next: CalcCtx) => setCalcCtx(next), []);

	const openForm = () => {
		setPrefill(undefined);
		setModal({ open: true, mode: "timeline" });
	};
	const openFormWith = (initial: { neighborhood: string; bedrooms: string }) => {
		setPrefill(initial);
		setModal({ open: true, mode: "timeline" });
	};
	const openCall = () => {
		setPrefill(undefined);
		setModal({ open: true, mode: "call" });
	};
	const close = () => setModal((m) => ({ ...m, open: false }));

	return (
		<div className="min-h-screen bg-paper text-ink selection:bg-accent/10 selection:text-accent">
			<Script id="ld-faq" type="application/ld+json" strategy="afterInteractive">
				{JSON.stringify(faqSchema(HOMEPAGE_FAQS))}
			</Script>
			<Nav onOpenForm={openForm} />
			<main>
				<Hero onOpenForm={openForm} />
				<TimelineSection treatment="calendar" />
				<Distribution />
				<RentWidget onOpen={openFormWith} onChange={onCalcChange} />
				<Problem ctx={calcCtx} />
				<HowItWorks />
				<Operator onOpenCall={openCall} />
				<Screening />
				<RecentLeases layout="cards" />
				<Pricing onOpenForm={openForm} />
				<FAQ />
				<FinalCTA onOpenForm={openForm} onOpenCall={openCall} />
			</main>
			<Footer />
			<FormModal
				open={modal.open}
				onClose={close}
				mode={modal.mode}
				onBookCall={openCall}
				initialData={prefill}
			/>
			<StickyCTA onOpenForm={openForm} />
			<ExitIntent onOpen={openFormWith} />
		</div>
	);
}
