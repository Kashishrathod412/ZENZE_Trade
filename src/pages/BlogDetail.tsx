import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useParams, Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import {
    ArrowLeft, Calendar, Clock, Share2, Bookmark, Twitter,
    Linkedin, Link2, ChevronRight, Eye, Tag, ArrowRight,
    TrendingUp, MessageCircle, ThumbsUp, CheckCircle2, Quote,
    Users, BookOpen,
} from "lucide-react";

/* ─────────────────────── DATA ─────────────────────── */
const blogPosts = [
    {
        id: 1,
        title: "The Shift to Digital: How B2B Trade is Evolving in India",
        excerpt: "Explore the rapid transformation of the Indian industrial market and how digital platforms are changing the game for manufacturers in the era of Industry 4.0.",
        content: {
            intro: `The landscape of B2B trade in India is undergoing a profound transformation. As we move further into the decade, the traditional methods of commerce — cold calls, trade fairs, and paper-based catalogues — are being replaced by agile, digital-first strategies that leverage the power of connectivity, data analytics, and artificial intelligence. For Indian manufacturers and traders, adapting to this shift is no longer optional; it's a strategic imperative.`,
            sections: [
                {
                    id: "industry-40",
                    heading: "The Rise of Industry 4.0 in Indian Manufacturing",
                    body: `Industry 4.0 is not just a buzzword; it's a ground-level reality for thousands of manufacturers across the Indian subcontinent. By integrating IoT sensors, artificial intelligence, and cloud-based ERP systems into their production lines, businesses are achieving unprecedented levels of efficiency, quality control, and supply-chain transparency.\n\nSmall and medium enterprises (SMEs), which form the backbone of India's industrial fabric, are also beginning to embrace these technologies. Government initiatives like "Make in India" and "Digital India" have acted as catalysts, providing incentives and infrastructure that make digital adoption more accessible than ever before.`,
                    quote: `"Digital transformation is no longer an option for Indian manufacturers; it's a necessity for survival in a globalized, hyper-competitive market." — Arjun Mehta`,
                    list: undefined as undefined | { title: string; detail: string }[],
                },
                {
                    id: "drivers",
                    heading: "Key Drivers Accelerating the Digital Shift",
                    body: `Several converging forces are propelling this transition. Understanding each driver helps businesses prioritise where to invest their digital budgets for maximum return.`,
                    quote: undefined as undefined | string,
                    list: [
                        { title: "Hyper-connectivity", detail: "High-speed broadband and 5G rollout in industrial hubs has enabled real-time collaboration between geographically dispersed suppliers and buyers, dramatically reducing lead times." },
                        { title: "Data-driven Decision Making", detail: "Advanced analytics platforms are helping businesses predict market shifts, optimise inventory levels, and personalise outreach to key accounts with surgical precision." },
                        { title: "Evolving Buyer Expectations", detail: "Modern B2B buyers expect the same ease of use, transparency, and speed they experience on consumer platforms like Amazon or Flipkart." },
                        { title: "Post-Pandemic Resilience", detail: "COVID-19 exposed the fragility of analogue supply chains. Businesses that had invested in digital infrastructure recovered faster and emerged stronger." },
                        { title: "Platform Economy", detail: "B2B marketplaces like ZenzeTrade are creating network effects wherein a verified seller gains access to thousands of qualified buyers instantly, collapsing traditional sales cycles from months to days." },
                    ],
                },
                {
                    id: "opportunities",
                    heading: "Opportunities Unlocked by Digitisation",
                    body: `For Indian businesses willing to embrace this shift, the rewards are substantial. Digital platforms remove geographic barriers, allowing a manufacturer in Ludhiana to connect with a distributor in Frankfurt without a single trade fair visit. Transparency tools — verified profiles, authenticated certifications, live inventory data — build the trust that was previously forged through years of face-to-face relationships.\n\nFurthermore, digital engagement yields rich data. Every inquiry, product view, and quote request is a data point that, when aggregated, reveals demand signals, pricing trends, and competitive intelligence simply unavailable in the pre-digital era.`,
                    quote: undefined as undefined | string,
                    list: undefined as undefined | { title: string; detail: string }[],
                },
                {
                    id: "roadmap",
                    heading: "A Practical Roadmap for Digital Adoption",
                    body: `For businesses at the beginning of their digital journey, a phased approach is the most sustainable path. Start by digitising your product catalog with high-quality specifications and imagery. Next, establish a verified presence on a trusted B2B marketplace. As you grow comfortable with inbound inquiries, invest in CRM tools to manage relationships and analytics to measure performance.\n\nThe businesses that will lead India's industrial future are those that treat digital investment not as an IT expense, but as a strategic growth lever that compounds in value over time.`,
                    quote: undefined as undefined | string,
                    list: undefined as undefined | { title: string; detail: string }[],
                },
            ],
            conclusion: `The shift to digital in India's B2B ecosystem is irreversible and accelerating. The players who move decisively now — establishing digital storefronts, building data capabilities, and engaging with verified networks — will find themselves operating with an enduring competitive advantage. In this new era, your digital presence is your global address. Make it count.`,
        },
        author: "Arjun Mehta",
        authorRole: "Senior Trade Analyst",
        authorBio: "Arjun Mehta is ZenzeTrade's lead Industry Insights analyst with over 15 years of experience in Indian industrial markets. He has advised Fortune 500 companies on their B2B digital strategies and been published in the Economic Times and Business Standard.",
        date: "March 25, 2024",
        category: "Industry Insights",
        readTime: "8 min read",
        views: "12.4K",
        likes: 847,
        comments: 63,
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1400&auto=format&fit=crop&q=85",
        tags: ["Digital Trade", "India", "Industry 4.0", "B2B", "Manufacturing"],
        trending: true,
    },
    {
        id: 2,
        title: "10 Essential Tips for Sourcing Verified Suppliers",
        excerpt: "Finding reliable partners is the backbone of any successful business. These steps will help you verify and trust your B2B connections in a globalized market.",
        content: {
            intro: `In a global marketplace flooded with options, finding a trustworthy, high-quality supplier is one of the most consequential decisions a procurement professional can make. A poor supplier choice cascades into missed deadlines, quality failures, financial losses, and reputational damage. This guide distils 10 battle-tested strategies that will help you source with confidence.`,
            sections: [
                {
                    id: "background-checks",
                    heading: "1. Conduct Comprehensive Background Checks",
                    body: `Before any commercial conversation, verify the legal standing of the supplier. Review their business registration, GST certificates, import/export licences, and any ISO quality certifications. Platforms like ZenzeTrade provide verified supplier profiles, offering an immediate trust signal that manual verification would take weeks to establish.`,
                    quote: `"Trust is built in drops and lost in buckets. Invest the time upfront so you don't pay the price downstream." — Sarah Chen`,
                    list: undefined as undefined | { title: string; detail: string }[],
                },
                {
                    id: "samples",
                    heading: "2. Always Request and Test Samples",
                    body: `Never commit to a large-volume purchase without testing quality firsthand. Request samples under the same specifications your production order will carry and subject them to your quality benchmarks, stress tests, and regulatory standards.`,
                    quote: undefined as undefined | string,
                    list: [
                        { title: "Dimensional Accuracy", detail: "Ensure samples meet your engineering tolerances exactly." },
                        { title: "Material Certification", detail: "Verify raw material sourcing and request mill test certificates where applicable." },
                        { title: "Packaging Quality", detail: "Assess whether the packaging protects the product adequately for your supply chain." },
                        { title: "Lead Time Compliance", detail: "Track how long the supplier takes to deliver samples — it's a preview of production lead times." },
                    ],
                },
                {
                    id: "references",
                    heading: "3. Ask for and Contact References",
                    body: `A reputable supplier will readily provide a list of existing customers. Contact at least three references and ask specific questions: How has the supplier handled quality issues? What is their communication style under pressure? Reference conversations reveal the real character of a supplier in a way that any sales presentation cannot.`,
                    quote: undefined as undefined | string,
                    list: undefined as undefined | { title: string; detail: string }[],
                },
            ],
            conclusion: `Sourcing great suppliers is both an art and a science. By following a rigorous, multi-layered verification process, you replace blind trust with informed confidence. On a platform like ZenzeTrade, many of these steps are accelerated by verified profiles and transparent transaction histories, giving you a significant head-start.`,
        },
        author: "Sarah Chen",
        authorRole: "Procurement Specialist",
        authorBio: "Sarah Chen leads procurement strategy consulting at ZenzeTrade. With 12 years of experience in global supply chain management, she has helped over 200 businesses build resilient, verified supplier networks across Asia, Europe, and North America.",
        date: "March 22, 2024",
        category: "Guides",
        readTime: "5 min read",
        views: "9.1K",
        likes: 612,
        comments: 41,
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1400&auto=format&fit=crop&q=85",
        tags: ["Sourcing", "Suppliers", "Verification", "Procurement"],
        trending: false,
    },
    {
        id: 3,
        title: "Maximizing Your ROI on ZenzeTrade Marketplace",
        excerpt: "Learn how to optimise your storefront and inquiry responses to turn more leads into loyal long-term enterprise clients using our advanced analytics.",
        content: {
            intro: `Your presence on ZenzeTrade is your digital storefront to the world's B2B buyers. A well-optimised profile doesn't just attract more inquiries — it attracts the right inquiries from high-intent, enterprise-grade buyers. This guide walks you through the key levers that separate top performers from the rest.`,
            sections: [
                {
                    id: "catalog",
                    heading: "Optimise Your Product Catalog for Discovery",
                    body: `Your catalog is your most powerful sales tool. Use professional-grade photography or engineering renderings for every SKU. Write product descriptions that speak to the buyer's technical needs, not just generic marketing language. Include dimensions, materials, tolerances, certifications, and application use cases.`,
                    quote: `"The best product listing is one that answers every question a buyer might have — before they even think to ask it." — Rahul Sharma`,
                    list: undefined as undefined | { title: string; detail: string }[],
                },
                {
                    id: "inquiry",
                    heading: "Respond to Inquiries Like a Champion",
                    body: `Speed is your most powerful differentiator in B2B. Research consistently shows that responding to an RFQ within the first hour increases your conversion rate by over 40%.`,
                    quote: undefined as undefined | string,
                    list: [
                        { title: "Respond within 60 minutes", detail: "First responders win 40% more deals in B2B marketplaces." },
                        { title: "Personalise every reply", detail: "Reference the buyer's specific query to demonstrate you've read it carefully." },
                        { title: "Include a clear CTA", detail: "Every response should have a defined next step — a sample, a call, or a formal quotation." },
                        { title: "Follow up proactively", detail: "If you haven't heard back within 48 hours, send a polite, value-adding follow-up." },
                    ],
                },
                {
                    id: "analytics",
                    heading: "Leverage Analytics to Continuously Improve",
                    body: `ZenzeTrade's seller analytics dashboard is your strategic command centre. Track which products receive the most views but fewest inquiries — this signals a pricing or description gap. Monitor your inquiry-to-quote and quote-to-order conversion ratios. Analyse the geographic distribution of your inquiries to identify high-growth markets worth investing in.`,
                    quote: undefined as undefined | string,
                    list: undefined as undefined | { title: string; detail: string }[],
                },
            ],
            conclusion: `Success on ZenzeTrade is a continuous, compounding journey. The sellers who treat their digital marketplace presence as a living, evolving asset — constantly refining their catalog, sharpening their inquiry responses, and acting on analytics insights — consistently achieve ROI multiples that far exceed their investments.`,
        },
        author: "Rahul Sharma",
        authorRole: "Growth Strategist",
        authorBio: "Rahul Sharma is ZenzeTrade's Growth Strategy Lead, specialising in helping B2B sellers maximise their marketplace performance. He has personally guided over 500 sellers to their first major enterprise contract using data-driven optimisation frameworks.",
        date: "March 18, 2024",
        category: "Tips & Tricks",
        readTime: "6 min read",
        views: "7.8K",
        likes: 534,
        comments: 29,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&auto=format&fit=crop&q=85",
        tags: ["ROI", "Marketplace", "Growth", "Optimisation"],
        trending: false,
    },
    {
        id: 4,
        title: "Global Supply Chain Resilience in 2024",
        excerpt: "Analysing the impact of geopolitical events on global trade routes and how businesses are adapting their supply chains for maximum resilience.",
        content: {
            intro: `The global supply chain has faced its most severe stress test in decades. From the pandemic disruptions of 2020–2021 to escalating geopolitical tensions, businesses are being forced to radically rethink their supply chain architectures. In 2024, resilience is the new efficiency.`,
            sections: [
                {
                    id: "geopolitics",
                    heading: "Geopolitics as a Supply Chain Risk Factor",
                    body: `For decades, global supply chains were optimised purely for cost and efficiency. That assumption has been shattered. Trade tensions, regional conflicts, and rising protectionism have transformed geopolitics from a background consideration into a frontline supply chain risk.`,
                    quote: `"The race to the cheapest supplier is over. The new race is to the most resilient one." — David Miller`,
                    list: undefined as undefined | { title: string; detail: string }[],
                },
                {
                    id: "strategies",
                    heading: "Four Strategies for Building Resilient Supply Chains",
                    body: `The most resilient supply chains of 2024 share common architectural principles that buffer against disruption without sacrificing too much efficiency.`,
                    quote: undefined as undefined | string,
                    list: [
                        { title: "Near-shoring & Friend-shoring", detail: "Moving production closer to key markets or to geopolitically aligned countries reduces exposure to disruptive, long-distance supply routes." },
                        { title: "Dual Sourcing", detail: "Maintaining at least two qualified suppliers for every critical component is the simplest and most effective resilience lever." },
                        { title: "Strategic Inventory Buffers", detail: "The 'just-in-time' era is giving way to 'just-in-case' thinking, where maintaining higher safety stock for critical components is considered prudent risk management." },
                        { title: "Real-time Visibility Platforms", detail: "Control towers powered by AI and IoT provide an end-to-end view of the supply chain, enabling faster response to emerging disruptions." },
                    ],
                },
            ],
            conclusion: `Building supply chain resilience is not a one-time project — it's an ongoing strategic capability. Businesses that invest in diversification, visibility, and strong supplier relationships today are building a competitive moat that will protect them through whatever disruptions 2024 and beyond may bring.`,
        },
        author: "David Miller",
        authorRole: "Global Trade Expert",
        authorBio: "David Miller is a global trade strategist with 20 years of experience advising multinational corporations on supply chain risk management and cross-border trade strategy. He has worked with governments and industry bodies across 35 countries.",
        date: "March 15, 2024",
        category: "Global Trade",
        readTime: "10 min read",
        views: "15.2K",
        likes: 1204,
        comments: 97,
        image: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=1400&auto=format&fit=crop&q=85",
        tags: ["Supply Chain", "Global Trade", "Resilience", "Geopolitics"],
        trending: true,
    },
    {
        id: 5,
        title: "Green Tech: The Sustainability Wave in Manufacturing",
        excerpt: "How eco-friendly practices are not just good for the planet, but also for the bottom line of modern manufacturers.",
        content: {
            intro: `Sustainability is no longer a box to check on a CSR report. It has become a hard-nosed business imperative. Enterprise buyers are embedding ESG requirements into their supplier qualification criteria, and manufacturers who cannot demonstrate sustainable practices are increasingly locked out of the most valuable contracts.`,
            sections: [
                {
                    id: "business-case",
                    heading: "The Business Case for Green Manufacturing",
                    body: `Beyond regulatory compliance and buyer requirements, the financial math of sustainability is increasingly compelling. Energy-efficient production reduces operating costs. Waste reduction programmes improve material yield. Circular economy models create entirely new revenue streams.`,
                    quote: `"The circular economy is not an environmental ideology. It is the most sophisticated business model of the 21st century." — Elena Petrova`,
                    list: undefined as undefined | { title: string; detail: string }[],
                },
                {
                    id: "technologies",
                    heading: "Key Green Technologies Reshaping Manufacturing",
                    body: `A new generation of green technologies is making sustainable manufacturing practically and economically viable at scale.`,
                    quote: undefined as undefined | string,
                    list: [
                        { title: "Renewable Energy Integration", detail: "On-site solar and wind installations dramatically reduce Scope 1 and 2 emissions while offering long-term energy cost stability." },
                        { title: "AI Energy Management", detail: "AI-powered platforms optimise consumption in real-time, identifying waste and reducing utility costs by up to 25%." },
                        { title: "Water Recycling Systems", detail: "Closed-loop water treatment technologies allow manufacturers to recirculate water, reducing consumption from municipal sources." },
                        { title: "Bio-based & Recycled Materials", detail: "Advanced material science enables manufacturers to substitute virgin plastics and metals with high-performance bio-based or recycled alternatives." },
                    ],
                },
            ],
            conclusion: `The sustainability wave in manufacturing is not a trend — it's a structural shift in how global trade operates. Manufacturers who build their green credentials today are not just protecting the planet; they are securing their position in the premium tier of global supply chains.`,
        },
        author: "Elena Petrova",
        authorRole: "Sustainability Lead",
        authorBio: "Elena Petrova leads ZenzeTrade's sustainability practice, helping industrial manufacturers develop and communicate their ESG credentials. She holds a Master's in Environmental Management and has consulted for the UN Environment Programme.",
        date: "March 12, 2024",
        category: "Sustainability",
        readTime: "7 min read",
        views: "6.3K",
        likes: 489,
        comments: 35,
        image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1400&auto=format&fit=crop&q=85",
        tags: ["Green Tech", "Sustainability", "Manufacturing", "ESG"],
        trending: false,
    },
    {
        id: 6,
        title: "AI in B2B: Personalisation at Scale",
        excerpt: "Discover how artificial intelligence is enabling hyper-personalised experiences in B2B, from automated RFQ systems to predictive inventory management.",
        content: {
            intro: `Artificial intelligence is rapidly becoming the engine behind smarter supplier matching, automated RFQ processing, predictive inventory management, and hyper-personalised buyer experiences at a scale that was simply impossible just five years ago.`,
            sections: [
                {
                    id: "ai-applications",
                    heading: "Core AI Applications Transforming B2B Commerce",
                    body: `The most impactful AI applications in B2B today operate across the full commercial lifecycle — from discovery and matching through to order management and after-sales service.`,
                    quote: undefined as undefined | string,
                    list: [
                        { title: "Intelligent Supplier Matching", detail: "AI algorithms analyse buyer requirements, historical transaction data, and supplier performance metrics to recommend the optimal supplier for each specific need." },
                        { title: "Automated RFQ Processing", detail: "NLP-powered systems interpret incoming RFQs, extract key specifications, and auto-generate preliminary quotations, reducing response times from days to minutes." },
                        { title: "Predictive Inventory Management", detail: "Machine learning models analyse demand signals, seasonal patterns, and supply-side risk factors to optimise inventory positions and prevent stock-outs." },
                        { title: "Conversational Commerce", detail: "Advanced chatbots now handle qualification, product discovery, and even initial deal structuring conversations with enterprise buyers autonomously." },
                    ],
                },
                {
                    id: "future",
                    heading: "The Future: AI as a Strategic Partner",
                    body: `The next frontier of AI in B2B is not just automation of existing processes — it's genuine strategic augmentation. AI systems that can identify emerging market opportunities before human analysts and synthesise competitive intelligence in real-time are already in development at leading platforms.`,
                    quote: `"The B2B companies that thrive in the AI era won't be the ones who automate the most — they'll be the ones who augment their human judgement most effectively." — Samir Gupta`,
                    list: undefined as undefined | { title: string; detail: string }[],
                },
            ],
            conclusion: `AI-powered personalisation in B2B is not about replacing human relationships — it's about empowering your people to build better ones. By automating the repetitive and analytical, AI frees your commercial teams to focus on the strategic and the human: understanding needs, building trust, and creating long-term value.`,
        },
        author: "Samir Gupta",
        authorRole: "AI & Tech Analyst",
        authorBio: "Samir Gupta is ZenzeTrade's AI and Technology Analyst, tracking the intersection of artificial intelligence and global commerce. He previously led product development at a leading Silicon Valley AI startup and holds a PhD in Computer Science from IIT Delhi.",
        date: "March 10, 2024",
        category: "Technology",
        readTime: "4 min read",
        views: "11.7K",
        likes: 934,
        comments: 78,
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1400&auto=format&fit=crop&q=85",
        tags: ["AI", "Personalisation", "Automation", "B2B Tech"],
        trending: true,
    },
];

const categoryGradients: Record<string, { from: string; to: string }> = {
    "Industry Insights": { from: "#7C3AED", to: "#4F46E5" },
    "Guides": { from: "#0EA5E9", to: "#06B6D4" },
    "Tips & Tricks": { from: "#F59E0B", to: "#EF4444" },
    "Global Trade": { from: "#10B981", to: "#0D9488" },
    "Sustainability": { from: "#22C55E", to: "#84CC16" },
    "Technology": { from: "#EC4899", to: "#A855F7" },
};
const getCatGrad = (cat: string) =>
    categoryGradients[cat] || { from: "#7C3AED", to: "#4F46E5" };

/* ─────────────────────── COMPONENT ─────────────────────── */
export default function BlogDetail() {
    const { id } = useParams();
    const post = blogPosts.find(p => p.id === Number(id));
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [copied, setCopied] = useState(false);
    const [activeSection, setActiveSection] = useState("");
    const [pageUrl, setPageUrl] = useState("");

    /* Scroll to top every time a new article is opened */
    useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [id]);

    /* Page URL — safe, only set after mount */
    useEffect(() => { setPageUrl(window.location.href); }, []);

    /* Reading progress using page scroll (no target ref needed) */
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    /* Active TOC highlight */
    useEffect(() => {
        if (!post) return;
        const els = post.content.sections.map(s => document.getElementById(s.id));
        const obs = new IntersectionObserver(
            entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
            { rootMargin: "-25% 0px -60% 0px" }
        );
        els.forEach(el => el && obs.observe(el));
        return () => obs.disconnect();
    }, [post]);

    const handleCopy = () => {
        navigator.clipboard.writeText(pageUrl || window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const related = blogPosts.filter(p => p.id !== post?.id && p.category === post?.category).slice(0, 2);
    const extra = blogPosts.filter(p => p.id !== post?.id && !related.find(r => r.id === p.id)).slice(0, 1);
    const suggested = [...related, ...extra].slice(0, 3);

    /* ── NOT FOUND ── */
    if (!post) {
        return (
            <Layout>
                <div className="container-wide py-40 text-center">
                    <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-5">
                        <MessageCircle className="w-9 h-9 text-muted-foreground/30" />
                    </div>
                    <h1 className="text-3xl font-black mb-3">Article not found</h1>
                    <p className="text-muted-foreground mb-7 font-medium">
                        This article doesn't exist or may have been removed.
                    </p>
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary
                                   text-white font-black text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Blog
                    </Link>
                </div>
            </Layout>
        );
    }

    const { from, to } = getCatGrad(post.category);

    return (
        <Layout>
            {/* ══ READING PROGRESS ══ — z-[49] keeps it behind sticky header */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-[3px] z-[49] origin-left"
                style={{ scaleX, background: `linear-gradient(90deg, ${from}, ${to})` }}
            />

            <div className="bg-background pb-20">

                {/* ══ HERO IMAGE ══ */}
                <div className="relative overflow-hidden">
                    <div className="relative h-56 sm:h-72 md:h-[55vh] min-h-[280px] max-h-[680px] overflow-hidden">
                        <motion.img
                            initial={{ scale: 1.08 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            loading="eager"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-transparent" />
                    </div>

                    {/* Hero text overlaid on image bottom */}
                    <div className="container-wide relative -mt-36 sm:-mt-44 md:-mt-52 z-10 pb-0">
                        <div className="max-w-4xl">

                            {/* Back — frosted pill, always visible on hero image */}
                            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
                                <Link
                                    to="/blog"
                                    className="group inline-flex items-center gap-2 px-4 py-2 rounded-full
                                               bg-black/40 backdrop-blur-md border border-white/20
                                               text-white text-xs font-black uppercase tracking-widest
                                               hover:bg-black/60 hover:border-white/40 transition-all duration-300
                                               shadow-lg"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-200" />
                                    Back to Blog
                                </Link>
                            </motion.div>

                            {/* Badges */}
                            <motion.div
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.08 }}
                                className="flex flex-wrap gap-2 mb-4"
                            >
                                <span
                                    className="inline-block px-3.5 py-1.5 rounded-full text-[10px] font-black
                                               uppercase tracking-[0.2em] text-white shadow-md"
                                    style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                                >
                                    {post.category}
                                </span>
                                {post.trending && (
                                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
                                                     text-[10px] font-black uppercase tracking-widest bg-accent text-black">
                                        <TrendingUp className="w-3 h-3" /> Trending
                                    </span>
                                )}
                            </motion.div>

                            {/* Title */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.14 }}
                                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black
                                           text-foreground leading-[1.12] tracking-tight mb-6"
                            >
                                {post.title}
                            </motion.h1>

                            {/* Meta bar */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-wrap items-start sm:items-center justify-between
                                           gap-4 py-5 border-y border-border/50"
                            >
                                {/* Author */}
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`}
                                            alt={post.author}
                                            className="w-11 h-11 rounded-full border-2 border-primary/20"
                                        />
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full
                                                        bg-green-500 border-2 border-background" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-foreground leading-none">{post.author}</p>
                                        <p className="text-xs text-muted-foreground font-semibold mt-0.5">{post.authorRole}</p>
                                    </div>
                                </div>

                                {/* Stats + actions */}
                                <div className="flex flex-wrap items-center gap-3">
                                    {/* Stat pills */}
                                    <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3 text-accent" />{post.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" style={{ color: from }} />{post.readTime}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-3 h-3 text-primary" />{post.views}
                                        </span>
                                    </div>
                                    {/* Action buttons */}
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => setLiked(!liked)}
                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs
                                                        font-black transition-all border
                                                        ${liked
                                                    ? "bg-primary/10 text-primary border-primary/30"
                                                    : "bg-card border-border text-muted-foreground hover:text-primary hover:border-primary/30"}`}
                                        >
                                            <ThumbsUp className={`w-3.5 h-3.5 ${liked ? "fill-primary/30" : ""}`} />
                                            {post.likes + (liked ? 1 : 0)}
                                        </button>
                                        <button
                                            onClick={() => setBookmarked(!bookmarked)}
                                            className={`p-2 rounded-xl transition-all border
                                                        ${bookmarked
                                                    ? "bg-accent/10 text-accent border-accent/30"
                                                    : "bg-card border-border text-muted-foreground hover:text-foreground"}`}
                                            aria-label="Bookmark"
                                        >
                                            <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-accent/40" : ""}`} />
                                        </button>
                                        <button
                                            onClick={handleCopy}
                                            className="p-2 rounded-xl bg-card border border-border
                                                       text-muted-foreground hover:text-primary transition-all"
                                            aria-label="Copy link"
                                        >
                                            {copied
                                                ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                : <Link2 className="w-4 h-4" />}
                                        </button>
                                        {pageUrl && (
                                            <>
                                                <a
                                                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(post.title)}`}
                                                    target="_blank" rel="noopener noreferrer"
                                                    className="p-2 rounded-xl bg-card border border-border
                                                               text-muted-foreground hover:text-sky-500
                                                               hover:border-sky-400/30 transition-all"
                                                    aria-label="Share on Twitter"
                                                >
                                                    <Twitter className="w-4 h-4" />
                                                </a>
                                                <a
                                                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(post.title)}`}
                                                    target="_blank" rel="noopener noreferrer"
                                                    className="p-2 rounded-xl bg-card border border-border
                                                               text-muted-foreground hover:text-blue-600
                                                               hover:border-blue-500/30 transition-all"
                                                    aria-label="Share on LinkedIn"
                                                >
                                                    <Linkedin className="w-4 h-4" />
                                                </a>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* ══ CONTENT + SIDEBAR ══ */}
                <div className="container-wide pt-10 sm:pt-14">
                    <div className="flex gap-12 xl:gap-16 items-start">

                        {/* ── ARTICLE BODY ── */}
                        <motion.article
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.28 }}
                            className="flex-1 min-w-0"
                        >
                            {/* Intro */}
                            <p
                                className="text-base sm:text-lg md:text-xl leading-relaxed text-foreground
                                           font-medium mb-10 border-l-4 pl-5 sm:pl-6"
                                style={{ borderColor: from }}
                            >
                                {post.content.intro}
                            </p>

                            {/* Sections */}
                            {post.content.sections.map(sec => (
                                <section key={sec.id} id={sec.id} className="mb-12 scroll-mt-28">
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground
                                                   mb-4 leading-snug">
                                        {sec.heading}
                                    </h2>

                                    {sec.body.split("\n\n").map((para, pi) => (
                                        <p key={pi} className="text-muted-foreground text-sm sm:text-base md:text-lg
                                                                leading-relaxed font-medium mb-4">
                                            {para}
                                        </p>
                                    ))}

                                    {sec.quote && (
                                        <blockquote
                                            className="relative my-8 px-6 py-7 rounded-2xl overflow-hidden"
                                            style={{ background: `linear-gradient(135deg, ${from}18, ${to}10)` }}
                                        >
                                            <Quote
                                                className="absolute top-4 left-4 w-7 h-7 opacity-20"
                                                style={{ color: from }}
                                            />
                                            <p className="text-base sm:text-lg font-bold text-foreground
                                                          leading-relaxed italic pl-4">
                                                {sec.quote}
                                            </p>
                                        </blockquote>
                                    )}

                                    {sec.list && (
                                        <ul className="space-y-3 my-7">
                                            {sec.list.map((item, li) => (
                                                <li
                                                    key={li}
                                                    className="flex gap-4 p-4 sm:p-5 rounded-2xl bg-card
                                                               border border-border/60 hover:border-primary/30
                                                               transition-colors"
                                                >
                                                    <div
                                                        className="w-8 h-8 rounded-xl flex items-center justify-center
                                                                   shrink-0 mt-0.5 text-white font-black text-sm"
                                                        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                                                    >
                                                        {li + 1}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-black text-foreground mb-1 text-sm sm:text-base">
                                                            {item.title}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                                            {item.detail}
                                                        </p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </section>
                            ))}

                            {/* Conclusion */}
                            <div
                                className="p-6 sm:p-8 rounded-2xl mb-10"
                                style={{
                                    background: `linear-gradient(135deg, ${from}14, ${to}09)`,
                                    border: `1px solid ${from}28`,
                                }}
                            >
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2"
                                    style={{ color: from }}>
                                    Conclusion
                                </p>
                                <p className="text-sm sm:text-base md:text-lg text-foreground font-medium leading-relaxed">
                                    {post.content.conclusion}
                                </p>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap items-center gap-2 mb-10">
                                <span className="text-xs font-black uppercase tracking-widest
                                                 text-muted-foreground">Tags:</span>
                                {post.tags.map(tag => (
                                    <Link
                                        key={tag}
                                        to="/blog"
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted
                                                   hover:bg-primary/10 text-muted-foreground hover:text-primary
                                                   text-xs font-bold transition-all border border-transparent
                                                   hover:border-primary/20"
                                    >
                                        <Tag className="w-3 h-3" /> {tag}
                                    </Link>
                                ))}
                            </div>

                            {/* Engagement bar */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4
                                            p-5 sm:p-6 rounded-2xl bg-card border border-border/60 mb-14">
                                <div>
                                    <p className="font-black text-foreground text-sm sm:text-base mb-0.5">
                                        Found this article helpful?
                                    </p>
                                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                                        Share it with your network or leave a reaction.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <button
                                        onClick={() => setLiked(!liked)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm
                                                    font-black transition-all
                                                    ${liked
                                                ? "gradient-primary text-white shadow-lg"
                                                : "border border-border hover:border-primary/30 text-muted-foreground hover:text-primary"}`}
                                    >
                                        <ThumbsUp className="w-4 h-4" />
                                        {liked ? "Liked!" : "Like"}
                                    </button>
                                    <button
                                        onClick={handleCopy}
                                        className="p-2.5 rounded-xl border border-border text-muted-foreground
                                                   hover:text-primary hover:border-primary/30 transition-all"
                                    >
                                        {copied
                                            ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            : <Share2 className="w-4 h-4" />}
                                    </button>
                                    {pageUrl && (
                                        <>
                                            <a
                                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(post.title)}`}
                                                target="_blank" rel="noopener noreferrer"
                                                className="p-2.5 rounded-xl border border-border text-muted-foreground
                                                           hover:text-sky-500 hover:border-sky-400/30 transition-all"
                                            >
                                                <Twitter className="w-4 h-4" />
                                            </a>
                                            <a
                                                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(pageUrl)}`}
                                                target="_blank" rel="noopener noreferrer"
                                                className="p-2.5 rounded-xl border border-border text-muted-foreground
                                                           hover:text-blue-600 hover:border-blue-500/30 transition-all"
                                            >
                                                <Linkedin className="w-4 h-4" />
                                            </a>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Author bio */}
                            <div className="rounded-3xl border border-border/60 bg-card overflow-hidden mb-20">
                                <div className="h-1.5 w-full"
                                    style={{ background: `linear-gradient(90deg, ${from}, ${to})` }} />
                                <div className="p-6 sm:p-8 md:p-10 flex flex-col sm:flex-row items-start gap-6">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`}
                                        alt={post.author}
                                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2
                                                   border-border shrink-0"
                                    />
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em]
                                                      text-muted-foreground mb-1">About the Author</p>
                                        <h3 className="text-lg sm:text-xl font-black text-foreground mb-0.5">
                                            {post.author}
                                        </h3>
                                        <p className="text-xs font-bold mb-3" style={{ color: from }}>
                                            {post.authorRole}
                                        </p>
                                        <p className="text-muted-foreground font-medium text-sm leading-relaxed mb-4">
                                            {post.authorBio}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <button
                                                className="px-5 py-2 rounded-xl text-white text-xs font-black
                                                           uppercase tracking-widest hover:opacity-90 transition-all shadow-md"
                                                style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                                            >
                                                Follow Author
                                            </button>
                                            <span className="flex items-center gap-1.5 text-xs
                                                             text-muted-foreground font-semibold">
                                                <Users className="w-3.5 h-3.5" /> {post.likes} Followers
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.article>

                        {/* ── SIDEBAR (XL only) ── */}
                        <aside className="hidden xl:block w-64 shrink-0 sticky top-28 self-start space-y-6">

                            {/* Table of Contents */}
                            <div className="rounded-2xl border border-border/60 bg-card p-5">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em]
                                              text-muted-foreground mb-3">Table of Contents</p>
                                <nav className="space-y-0.5">
                                    {post.content.sections.map(sec => (
                                        <a
                                            key={sec.id}
                                            href={`#${sec.id}`}
                                            className={`flex items-start gap-2 px-3 py-2.5 rounded-xl text-xs
                                                        font-semibold transition-all duration-200 leading-snug
                                                        ${activeSection === sec.id
                                                    ? "text-primary bg-primary/8 font-bold"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                                        >
                                            <div
                                                className={`w-1 h-4 rounded-full shrink-0 mt-0.5 transition-all
                                                    ${activeSection === sec.id ? "opacity-100" : "opacity-0"}`}
                                                style={{ background: `linear-gradient(180deg, ${from}, ${to})` }}
                                            />
                                            {sec.heading}
                                        </a>
                                    ))}
                                </nav>
                            </div>

                            {/* Article stats */}
                            <div className="rounded-2xl border border-border/60 bg-card p-5">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em]
                                              text-muted-foreground mb-3">Article Stats</p>
                                <div className="space-y-2.5">
                                    {[
                                        { icon: Eye, label: "Views", value: post.views, color: "text-primary" },
                                        { icon: ThumbsUp, label: "Likes", value: String(post.likes + (liked ? 1 : 0)), color: "text-blue-500" },
                                        { icon: MessageCircle, label: "Comments", value: String(post.comments), color: "text-green-500" },
                                        { icon: Clock, label: "Read Time", value: post.readTime, color: "text-amber-500" },
                                    ].map(({ icon: Icon, label, value, color }) => (
                                        <div key={label} className="flex items-center gap-3 py-2
                                                                     border-b border-border/50 last:border-0">
                                            <Icon className={`w-3.5 h-3.5 shrink-0 ${color}`} />
                                            <span className="text-xs text-muted-foreground font-semibold flex-1">
                                                {label}
                                            </span>
                                            <span className="text-sm font-black text-foreground">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Share */}
                            <div className="rounded-2xl border border-border/60 bg-card p-5">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em]
                                              text-muted-foreground mb-3">Share Article</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {pageUrl && (
                                        <>
                                            <a
                                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(post.title)}`}
                                                target="_blank" rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-3 py-2.5 rounded-xl
                                                           bg-sky-50 dark:bg-sky-950/30 text-sky-600
                                                           hover:bg-sky-100 dark:hover:bg-sky-900/40
                                                           transition-colors text-xs font-bold"
                                            >
                                                <Twitter className="w-3.5 h-3.5" /> Twitter
                                            </a>
                                            <a
                                                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(pageUrl)}`}
                                                target="_blank" rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-3 py-2.5 rounded-xl
                                                           bg-blue-50 dark:bg-blue-950/30 text-blue-600
                                                           hover:bg-blue-100 dark:hover:bg-blue-900/40
                                                           transition-colors text-xs font-bold"
                                            >
                                                <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                                            </a>
                                        </>
                                    )}
                                    <button
                                        onClick={handleCopy}
                                        className="col-span-2 flex items-center justify-center gap-2 px-3 py-2.5
                                                   rounded-xl bg-muted hover:bg-muted/70 text-muted-foreground
                                                   hover:text-foreground transition-colors text-xs font-bold"
                                    >
                                        {copied
                                            ? <><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Copied!</>
                                            : <><Link2 className="w-3.5 h-3.5" /> Copy Link</>}
                                    </button>
                                </div>
                            </div>
                        </aside>
                    </div>

                    {/* ══ RELATED ARTICLES ══ */}
                    {suggested.length > 0 && (
                        <motion.section
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            className="mt-4 max-w-5xl"
                        >
                            <div className="flex items-center gap-3 mb-7">
                                <BookOpen className="w-4 h-4 text-primary" />
                                <span className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground">
                                    Continue Reading
                                </span>
                                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
                                <Link
                                    to="/blog"
                                    className="text-xs font-black uppercase tracking-widest text-primary
                                               hover:text-primary/80 transition-colors flex items-center gap-1"
                                >
                                    All Articles <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                                {suggested.map((rp, i) => {
                                    const { from: rf, to: rt } = getCatGrad(rp.category);
                                    return (
                                        <motion.div
                                            key={rp.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.08 }}
                                        >
                                            <Link
                                                to={`/blog/${rp.id}`}
                                                className="group flex flex-col h-full rounded-2xl border
                                                           border-border/60 bg-card overflow-hidden
                                                           hover:border-primary/40 hover:shadow-xl
                                                           hover:-translate-y-1 transition-all duration-300"
                                            >
                                                <div className="relative h-40 sm:h-44 overflow-hidden">
                                                    <img
                                                        src={rp.image} alt={rp.title}
                                                        className="w-full h-full object-cover
                                                                   group-hover:scale-110 transition-transform duration-700"
                                                        loading="lazy"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                                    <span
                                                        className="absolute top-3 left-3 px-2.5 py-1 rounded-full
                                                                   text-[9px] font-black uppercase tracking-widest text-white"
                                                        style={{ background: `linear-gradient(135deg, ${rf}, ${rt})` }}
                                                    >
                                                        {rp.category}
                                                    </span>
                                                </div>
                                                <div className="p-4 flex flex-col flex-1">
                                                    <div className="flex items-center gap-3 text-[10px] font-bold
                                                                    text-muted-foreground uppercase tracking-widest mb-2">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />{rp.readTime}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="w-3 h-3" />{rp.views}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-black text-foreground text-sm sm:text-base
                                                                   leading-snug mb-2 group-hover:text-primary
                                                                   transition-colors line-clamp-2">
                                                        {rp.title}
                                                    </h3>
                                                    <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2
                                                                  font-medium flex-1">
                                                        {rp.excerpt}
                                                    </p>
                                                    <div className="flex items-center gap-1 mt-3 text-[10px]
                                                                    font-black uppercase tracking-widest text-primary">
                                                        Read Article
                                                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.section>
                    )}
                </div>
            </div>
        </Layout>
    );
}
