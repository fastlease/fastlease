import { Nav } from "./_components/sections/Nav";
import { Hero } from "./_components/sections/Hero";
import { TimelineSection } from "./_components/sections/Timeline";
import { ProofBar } from "./_components/sections/ProofBar";
import { Problem } from "./_components/sections/Problem";
import { HowItWorks } from "./_components/sections/HowItWorks";
import { Screening } from "./_components/sections/Screening";
import { RecentLeases } from "./_components/sections/RecentLeases";
import { Pricing } from "./_components/sections/Pricing";
import { FAQ } from "./_components/sections/FAQ";
import { FinalCTA } from "./_components/sections/FinalCTA";
import { Footer } from "./_components/sections/Footer";

export default function Home() {
	return (
		<div className="min-h-screen bg-paper text-ink selection:bg-accent/10 selection:text-accent">
			<Nav />
			<main>
				<Hero />
				<TimelineSection treatment="calendar" />
				<ProofBar />
				<Problem />
				<HowItWorks />
				<Screening />
				<RecentLeases layout="cards" />
				<Pricing />
				<FAQ />
				<FinalCTA />
			</main>
			<Footer />
		</div>
	);
}
