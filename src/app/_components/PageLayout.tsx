"use client";

import { useState } from "react";
import { Nav } from "./sections/Nav";
import { Hero } from "./sections/Hero";
import { TimelineSection } from "./sections/Timeline";
import { Distribution } from "./sections/Distribution";
import { Problem } from "./sections/Problem";
import { HowItWorks } from "./sections/HowItWorks";
import { Operator } from "./sections/Operator";
import { Screening } from "./sections/Screening";
import { RecentLeases } from "./sections/RecentLeases";
import { Pricing } from "./sections/Pricing";
import { FAQ } from "./sections/FAQ";
import { FinalCTA } from "./sections/FinalCTA";
import { Footer } from "./sections/Footer";
import { FormModal } from "./sections/FormModal";
import { StickyCTA } from "./sections/StickyCTA";

type ModalState = { open: boolean; mode: "timeline" | "call" };

export function PageLayout() {
	const [modal, setModal] = useState<ModalState>({ open: false, mode: "timeline" });

	const openForm = () => setModal({ open: true, mode: "timeline" });
	const openCall = () => setModal({ open: true, mode: "call" });
	const close = () => setModal((m) => ({ ...m, open: false }));

	return (
		<div className="min-h-screen bg-paper text-ink selection:bg-accent/10 selection:text-accent">
			<Nav onOpenForm={openForm} />
			<main>
				<Hero onOpenForm={openForm} />
				<TimelineSection treatment="calendar" />
				<Distribution />
				<Problem />
				<HowItWorks />
				<Operator onOpenCall={openCall} />
				<Screening />
				<RecentLeases layout="cards" />
				<Pricing onOpenForm={openForm} />
				<FAQ />
				<FinalCTA onOpenForm={openForm} onOpenCall={openCall} />
			</main>
			<Footer />
			<FormModal open={modal.open} onClose={close} mode={modal.mode} onBookCall={openCall} />
			<StickyCTA onOpenForm={openForm} />
		</div>
	);
}
