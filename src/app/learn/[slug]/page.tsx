import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import { InlineCTA, PageShell } from "~/app/_components/PageShell";
import { Reveal } from "~/app/_components/ui/Reveal";
import { findGlossaryPost, GLOSSARY_POSTS } from "~/lib/glossary";
import { articleSchema, faqSchema, SITE } from "~/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
	return GLOSSARY_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const post = findGlossaryPost(slug);
	if (!post) return {};
	const url = `${SITE.url}/learn/${post.slug}`;
	return {
		title: `${post.title} | FastLease`,
		description: post.summary,
		alternates: { canonical: url },
		openGraph: {
			title: post.title,
			description: post.summary,
			url,
			type: "article",
		},
	};
}

export default async function Page({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const post = findGlossaryPost(slug);
	if (!post) notFound();

	const url = `${SITE.url}/learn/${post.slug}`;
	const others = GLOSSARY_POSTS.filter((p) => p.slug !== post.slug);

	return (
		<PageShell>
			<Script
				id={`ld-learn-${post.slug}-article`}
				strategy="afterInteractive"
				type="application/ld+json"
			>
				{JSON.stringify(
					articleSchema({
						title: post.title,
						description: post.summary,
						url,
						datePublished: post.datePublished,
						dateModified: post.dateModified,
					}),
				)}
			</Script>
			<Script
				id={`ld-learn-${post.slug}-faq`}
				strategy="afterInteractive"
				type="application/ld+json"
			>
				{JSON.stringify(faqSchema(post.faq))}
			</Script>

			<section className="section-pad pt-[clamp(80px,8vw,140px)]">
				<div className="wrap max-w-[68ch]">
					<Reveal className="mb-5 flex items-center gap-3 text-[11px] text-ink-mute uppercase tracking-[0.14em]">
						<Link
							className="underline decoration-hair underline-offset-[3px] hover:text-ink"
							href="/"
						>
							FastLease
						</Link>
						<span className="text-ink-faint">·</span>
						<span>Learn</span>
					</Reveal>
					<Reveal
						as="h1"
						className="font-medium text-[clamp(32px,4.4vw,52px)] leading-[1.08] tracking-[-0.025em]"
					>
						{post.title}
					</Reveal>
					<Reveal
						as="p"
						className="mt-5 text-[18px] text-ink-soft leading-[1.55]"
					>
						{post.summary}
					</Reveal>
					<Reveal className="mt-6 flex items-center gap-3 text-[12px] text-ink-mute">
						<span>By Sasha Bastani, Broker</span>
						<span className="text-ink-faint">·</span>
						<span>{post.readingMinutes} min read</span>
						<span className="text-ink-faint">·</span>
						<span>
							Updated{" "}
							{new Date(post.dateModified).toLocaleDateString("en-CA", {
								month: "long",
								day: "numeric",
								year: "numeric",
							})}
						</span>
					</Reveal>
				</div>
			</section>

			<section className="section-pad">
				<div className="wrap max-w-[68ch]">
					{post.sections.map((s) => (
						<div className="mb-8 last:mb-0" key={s.heading || "introduction"}>
							{s.heading && (
								<Reveal
									as="h2"
									className="mb-4 font-medium text-[24px] leading-[1.2] tracking-[-0.015em]"
								>
									{s.heading}
								</Reveal>
							)}
							{s.paragraphs.map((p) => (
								<Reveal
									as="p"
									className="mb-4 text-[16px] text-ink-soft leading-[1.7] last:mb-0"
									key={p.slice(0, 40)}
								>
									{p}
								</Reveal>
							))}
						</div>
					))}
				</div>
			</section>

			<section className="section-pad">
				<div className="wrap max-w-[68ch]">
					<Reveal className="mb-7 flex items-center gap-4">
						<span className="num text-[12px] text-ink-mute uppercase tracking-[0.14em]">
							FAQ
						</span>
						<span className="h-[1px] flex-1 bg-hair" />
					</Reveal>
					<div className="flex flex-col">
						{post.faq.map((f) => (
							<Reveal
								className="grid grid-cols-[1fr] gap-3 border-hair border-t py-7 last:border-b"
								key={f.q}
							>
								<h3 className="font-medium text-[18px] tracking-[-0.01em]">
									{f.q}
								</h3>
								<p className="text-[15px] text-ink-soft leading-[1.65]">
									{f.a}
								</p>
							</Reveal>
						))}
					</div>
				</div>
			</section>

			{others.length > 0 && (
				<section className="section-pad">
					<div className="wrap max-w-[68ch]">
						<Reveal className="mb-3 text-[11px] text-ink-mute uppercase tracking-[0.14em]">
							More from FastLease
						</Reveal>
						<div className="flex flex-wrap gap-2">
							{others.map((o) => (
								<Link
									className="inline-flex h-9 items-center rounded-full border border-hair-strong px-3.5 text-[13px] transition-colors hover:border-ink"
									href={`/learn/${o.slug}`}
									key={o.slug}
								>
									{o.title.length > 60 ? `${o.title.slice(0, 58)}…` : o.title}
								</Link>
							))}
						</div>
					</div>
				</section>
			)}

			<InlineCTA
				buttonLabel="Run my estimate"
				eyebrow="Get a 21-day plan"
				headline="Get a 21-day plan for your unit, with real comparables."
			/>
		</PageShell>
	);
}
