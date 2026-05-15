"use client";

import Script from "next/script";
import { useCallback, useState } from "react";
import { HOMEPAGE_FAQS } from "~/lib/faqs";
import { faqSchema } from "~/lib/seo";
import { Distribution } from "./_components/sections/Distribution";
import { ExitIntent } from "./_components/sections/ExitIntent";
import { FAQ } from "./_components/sections/FAQ";
import { FinalCTA } from "./_components/sections/FinalCTA";
import { Footer } from "./_components/sections/Footer";
import { FormModal } from "./_components/sections/FormModal";
import { Hero } from "./_components/sections/Hero";
import { HowItWorks } from "./_components/sections/HowItWorks";
import { Nav } from "./_components/sections/Nav";
import { Operator } from "./_components/sections/Operator";
import { Pricing } from "./_components/sections/Pricing";
import { Problem } from "./_components/sections/Problem";
import { RecentLeases } from "./_components/sections/RecentLeases";
import { RentWidget } from "./_components/sections/RentWidget";
import { Screening } from "./_components/sections/Screening";
import { StickyCTA } from "./_components/sections/StickyCTA";
import { TimelineSection } from "./_components/sections/Timeline";

type ModalState = { open: boolean; mode: "timeline" | "call" };
type Prefill = { neighborhood?: string; bedrooms?: string } | undefined;
type CalcCtx = { neighborhood: string; bedrooms: string };

export default function Home() {
	const [modal, setModal] = useState<ModalState>({
		open: false,
		mode: "timeline",
	});
	const [prefill, setPrefill] = useState<Prefill>(undefined);
	const [calcCtx, setCalcCtx] = useState<CalcCtx>({
		neighborhood: "King West",
		bedrooms: "1BR",
	});
	const onCalcChange = useCallback((next: CalcCtx) => setCalcCtx(next), []);

	const openForm = () => {
		setPrefill(undefined);
		setModal({ open: true, mode: "timeline" });
	};
	const openFormWith = (initial: {
		neighborhood: string;
		bedrooms: string;
	}) => {
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
			<Script
				id="ld-faq"
				strategy="afterInteractive"
				type="application/ld+json"
			>
				{JSON.stringify(faqSchema(HOMEPAGE_FAQS))}
			</Script>
			<Nav onOpenForm={openForm} />
			<main>
				<Hero onOpenForm={openForm} />
				<TimelineSection treatment="calendar" />
				<Distribution />
				<RentWidget onChange={onCalcChange} onOpen={openFormWith} />
				<Problem ctx={calcCtx} />
				<HowItWorks />
				<Operator onOpenCall={openCall} />
				<Screening />
				<RecentLeases layout="cards" />
				<Pricing onOpenForm={openForm} />
				<FAQ />
				<FinalCTA onOpenCall={openCall} onOpenForm={openForm} />
			</main>
			<Footer />
			<FormModal
				initialData={prefill}
				mode={modal.mode}
				onBookCall={openCall}
				onClose={close}
				open={modal.open}
			/>
			<StickyCTA onOpenForm={openForm} />
			<ExitIntent onOpen={openFormWith} />
		</div>
	);
}
