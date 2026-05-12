"use client";

import { useState } from "react";
import { Nav } from "./_components/sections/Nav";
import { Hero } from "./_components/sections/Hero";
import { TimelineSection } from "./_components/sections/Timeline";
import { Distribution } from "./_components/sections/Distribution";
import { Problem } from "./_components/sections/Problem";
import { HowItWorks } from "./_components/sections/HowItWorks";
import { Operator } from "./_components/sections/Operator";
import { Screening } from "./_components/sections/Screening";
import { RecentLeases } from "./_components/sections/RecentLeases";
import { Pricing } from "./_components/sections/Pricing";
import { FAQ } from "./_components/sections/FAQ";
import { FinalCTA } from "./_components/sections/FinalCTA";
import { Footer } from "./_components/sections/Footer";
import { FormModal } from "./_components/sections/FormModal";
import { StickyCTA } from "./_components/sections/StickyCTA";

type ModalState = { open: boolean; mode: "timeline" | "call" };

export default function Home() {
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
