import React, { useState, useEffect, useRef } from "react";
import Layout from "@/components/layout/Layout";
import { motion, AnimatePresence, animate } from "framer-motion";
import {
    BookOpen, Calendar, ArrowRight, Search, TrendingUp, Clock,
    ChevronRight, Flame, Star, Globe, Cpu, Leaf, BarChart2, Mail, Send,
    Users, Eye, Tag, Sparkles, Zap, ShieldCheck, Award
} from "lucide-react";
import { Link } from "react-router-dom";

/* ─────────────────────── DATA ─────────────────────── */
const blogPosts = [
    {
        id: 1,
        title: "The Shift to Digital: How B2B Trade is Evolving in India",
        excerpt: "Explore the rapid transformation of the Indian industrial market and how digital platforms are changing the game for manufacturers in the era of Industry 4.0.",
        author: "Arjun Mehta",
        authorRole: "Senior Trade Analyst",
        date: "March 25, 2024",
        category: "Industry Insights",
        readTime: "8 min read",
        views: "12.4K",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80",
        featured: true,
        trending: true,
        tags: ["Digital Trade", "India", "Industry 4.0"],
    },
    {
        id: 2,
        title: "10 Essential Tips for Sourcing Verified Suppliers",
        excerpt: "Finding reliable partners is the backbone of any successful business. These steps will help you verify and trust your B2B connections in a globalized market.",
        author: "Sarah Chen",
        authorRole: "Procurement Specialist",
        date: "March 22, 2024",
        category: "Guides",
        readTime: "5 min read",
        views: "9.1K",
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&auto=format&fit=crop&q=80",
        tags: ["Sourcing", "Suppliers", "Verification"],
    },
    {
        id: 3,
        title: "Maximizing Your ROI on ZenzeTrade Marketplace",
        excerpt: "Learn how to optimize your storefront and inquiry responses to turn more leads into loyal long-term enterprise clients using our advanced analytics.",
        author: "Rahul Sharma",
        authorRole: "Growth Strategist",
        date: "March 18, 2024",
        category: "Tips & Tricks",
        readTime: "6 min read",
        views: "7.8K",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
        tags: ["ROI", "Marketplace", "Growth"],
    },
    {
        id: 4,
        title: "Global Supply Chain Resilience in 2024",
        excerpt: "Analyzing the impact of recent geopolitical events on global trade routes and how businesses are adapting their supply chains to be more agile and resilient.",
        author: "David Miller",
        authorRole: "Global Trade Expert",
        date: "March 15, 2024",
        category: "Global Trade",
        readTime: "10 min read",
        views: "15.2K",
        image: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=1200&auto=format&fit=crop&q=80",
        trending: true,
        tags: ["Supply Chain", "Global Trade", "Resilience"],
    },
    {
        id: 5,
        title: "Green Tech: The Sustainability Wave in Manufacturing",
        excerpt: "How eco-friendly practices are not just good for the planet, but also for the bottom line. Manufacturers adopting circular economy principles gain a real edge.",
        author: "Elena Petrova",
        authorRole: "Sustainability Lead",
        date: "March 12, 2024",
        category: "Sustainability",
        readTime: "7 min read",
        views: "6.3K",
        image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&auto=format&fit=crop&q=80",
        tags: ["Green Tech", "Sustainability", "Manufacturing"],
    },
    {
        id: 6,
        title: "AI in B2B: Personalization at Scale",
        excerpt: "Discover how artificial intelligence is enabling hyper-personalized experiences in B2B, from automated RFQ systems to predictive inventory management.",
        author: "Samir Gupta",
        authorRole: "AI & Tech Analyst",
        date: "March 10, 2024",
        category: "Technology",
        readTime: "4 min read",
        views: "11.7K",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop&q=80",
        trending: true,
        tags: ["AI", "Personalization", "Automation"],
    },
    {
        id: 7,
        title: "Navigating Export Compliance: A Practical Guide",
        excerpt: "Export compliance can be complex, but understanding key requirements helps businesses expand globally without legal risks or costly penalties.",
        author: "Priya Nair",
        authorRole: "Legal & Compliance",
        date: "March 7, 2024",
        category: "Guides",
        readTime: "9 min read",
        views: "4.9K",
        image: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=1200&auto=format&fit=crop&q=80",
        tags: ["Export", "Compliance", "Legal"],
    },
    {
        id: 8,
        title: "Fintech Meets B2B: Smarter Trade Finance Solutions",
        excerpt: "New fintech innovations are revolutionizing how businesses manage trade finance, offering faster approvals, better rates, and improved cash flow management.",
        author: "Kevin Zhang",
        authorRole: "Fintech Analyst",
        date: "March 4, 2024",
        category: "Technology",
        readTime: "6 min read",
        views: "8.4K",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80",
        tags: ["Fintech", "Finance", "Innovation"],
    },
];

const categories = [
    { label: "All", icon: Star, count: blogPosts.length },
    { label: "Industry Insights", icon: BarChart2, count: blogPosts.filter(p => p.category === "Industry Insights").length },
    { label: "Guides", icon: BookOpen, count: blogPosts.filter(p => p.category === "Guides").length },
    { label: "Tips & Tricks", icon: Flame, count: blogPosts.filter(p => p.category === "Tips & Tricks").length },
    { label: "Global Trade", icon: Globe, count: blogPosts.filter(p => p.category === "Global Trade").length },
    { label: "Sustainability", icon: Leaf, count: blogPosts.filter(p => p.category === "Sustainability").length },
    { label: "Technology", icon: Cpu, count: blogPosts.filter(p => p.category === "Technology").length },
];

const categoryGradients: Record<string, { from: string; to: string; glow: string }> = {
    "Industry Insights": { from: "#7C3AED", to: "#4F46E5", glow: "rgba(124,58,237,0.25)" },
    "Guides": { from: "#0EA5E9", to: "#06B6D4", glow: "rgba(14,165,233,0.25)" },
    "Tips & Tricks": { from: "#F59E0B", to: "#EF4444", glow: "rgba(245,158,11,0.25)" },
    "Global Trade": { from: "#10B981", to: "#0D9488", glow: "rgba(16,185,129,0.25)" },
    "Sustainability": { from: "#22C55E", to: "#84CC16", glow: "rgba(34,197,94,0.25)" },
    "Technology": { from: "#EC4899", to: "#A855F7", glow: "rgba(236,72,153,0.25)" },
};
const getCatStyle = (cat: string) =>
    categoryGradients[cat] || { from: "#7C3AED", to: "#4F46E5", glow: "rgba(124,58,237,0.25)" };

/* ─────────────────────── STATS DATA ─────────────────────── */
const stats = [
    { end: 15, suffix: "K+", label: "Monthly Readers", icon: Users },
    { end: 200, suffix: "+", label: "Articles Published", icon: BookOpen },
    { end: 50, suffix: "+", label: "Expert Contributors", icon: Award },
    { end: 98, suffix: "%", label: "Satisfaction Rate", icon: ShieldCheck },
];

/* ─────────────────────── STAT COUNTER ─────────────────────── */
function StatCardCounter({ end, suffix }: { end: number; suffix: string }) {
    const countRef = useRef<HTMLSpanElement>(null);
    const animated = useRef(false);

    useEffect(() => {
        const el = countRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !animated.current) {
                    animated.current = true;
                    animate(0, end, {
                        duration: 2,
                        ease: [0.16, 1, 0.3, 1],
                        onUpdate(v) {
                            if (countRef.current)
                                countRef.current.textContent = Math.round(v).toString();
                        },
                    });
                }
            },
            { threshold: 0.1 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [end]);

    return (
        <span>
            <span ref={countRef}>0</span>{suffix}
        </span>
    );
}

/* ─────────────────────── FEATURED CARD (HYPER-ELITE) ─────────────────────── */
function FeaturedCard({ post }: { post: typeof blogPosts[0] }) {
    const { from, to } = getCatStyle(post.category);
    return (
        <Link to={`/blog/${post.id}`} className="group block relative">
            <motion.div
                whileHover={{ y: -12 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative overflow-hidden rounded-[3.5rem] border border-white/10 bg-black/40 backdrop-blur-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
            >
                <div className="flex flex-col lg:flex-row min-h-[480px]">
                    {/* Immersive Media Node */}
                    <div className="lg:w-3/5 relative overflow-hidden group-hover:scale-[1.03] transition-transform duration-[2.5s] ease-out">
                        <img
                            src={post.image} alt={post.title}
                            className="w-full h-full object-cover filter contrast-[1.15] brightness-[0.75]"
                            loading="eager"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent lg:block hidden" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent lg:hidden" />
                    </div>

                    {/* Industrial Content Node */}
                    <div className="lg:w-2/5 p-8 sm:p-10 md:p-12 flex flex-col justify-center relative overflow-hidden bg-gradient-to-br from-white/[0.03] to-transparent">
                        {/* Ambient Intelligence Glow */}
                        <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/15 rounded-full blur-[120px] pointer-events-none" />

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <span
                                    className="px-5 py-2 rounded-xl text-[10px] font-black
                                               uppercase tracking-[0.4em] text-white shadow-2xl"
                                    style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                                >
                                    {post.category}
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-white/40 text-[9px] font-black uppercase tracking-widest">
                                    <TrendingUp className="w-3 h-3" /> Trending
                                </span>
                            </div>

                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.05] tracking-tighter group-hover:text-primary transition-colors duration-500">
                                {post.title}
                            </h2>

                            <p className="text-white/80 font-medium text-sm md:text-base leading-relaxed line-clamp-3">
                                {post.excerpt}
                            </p>

                            <div className="flex items-center justify-between pt-8 border-t border-white/10 mt-2">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/20 to-transparent p-[1.5px] border border-white/10 overflow-hidden shadow-2xl">
                                        <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`}
                                            alt={post.author}
                                            className="w-full h-full rounded-2xl object-cover bg-muted/20"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-black tracking-[0.2em] uppercase">{post.author}</p>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest flex items-center gap-2">
                                                <Calendar className="w-3 h-3" /> {post.date}
                                            </p>
                                            <div className="w-1 h-1 rounded-full bg-white/20" />
                                            <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest flex items-center gap-2">
                                                <Clock className="w-3 h-3" /> {post.readTime}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden sm:flex w-16 h-16 rounded-full gradient-primary items-center justify-center text-white shadow-2xl shadow-primary/30 group-hover:scale-110 group-hover:rotate-[-5deg] transition-all duration-500">
                                    <ArrowRight className="w-7 h-7" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

/* ─────────────────────── ARTICLE CARD (HYPER-ELITE) ─────────────────────── */
function ArticleCard({ post, index }: { post: typeof blogPosts[0]; index: number }) {
    const { from, to } = getCatStyle(post.category);
    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="group h-full"
        >
            <Link to={`/blog/${post.id}`} className="flex flex-col h-full rounded-[3rem] bg-card border border-border/40 overflow-hidden hover:border-primary/50 hover:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.3)] transition-all duration-700 relative">

                {/* Media Link */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-[1.12] transition-transform duration-[1.5s] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Floating Tactical Segment Badge */}
                    <div className="absolute top-5 left-5">
                        <span
                            className="px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white shadow-2xl filter backdrop-blur-md border border-white/10"
                            style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                        >
                            {post.category}
                        </span>
                    </div>

                    {/* Elite Interaction Node */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-6 group-hover:translate-y-0">
                        <div className="px-8 py-3.5 rounded-2xl bg-white/15 backdrop-blur-2xl border border-white/30 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(0,0,0,0.4)] transform-gpu">
                            Access Segment
                        </div>
                    </div>
                </div>

                {/* Industrial Body Node */}
                <div className="p-8 pb-10 flex flex-col flex-1 space-y-5">
                    <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/50">
                        <span className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-primary/60" /> {post.readTime}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-border/60" />
                        <span className="flex items-center gap-2">
                            <Eye className="w-3.5 h-3.5 text-primary/60" /> {post.views}
                        </span>
                    </div>

                    <h3 className="text-2xl font-black text-foreground leading-[1.2] tracking-tighter line-clamp-2 group-hover:text-primary transition-colors duration-300">
                        {post.title}
                    </h3>

                    <p className="text-muted-foreground/90 text-sm font-medium leading-relaxed line-clamp-3 flex-1">
                        {post.excerpt}
                    </p>

                    {/* Credentials Signature */}
                    <div className="pt-7 border-t border-border/40 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-2xl bg-muted/60 p-0.5 border border-border/40 overflow-hidden shadow-inner flex items-center justify-center">
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`}
                                    alt={post.author}
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-foreground uppercase tracking-widest leading-none">{post.author}</p>
                                <p className="text-[9px] text-primary/70 font-black uppercase tracking-[0.2em] mt-1.5">{post.authorRole}</p>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-muted/80 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white group-hover:rotate-[-10deg] transition-all duration-500 shadow-sm">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}

/* ─────────────────────── PAGE ─────────────────────── */
function StatCard({
    end, suffix, label, icon: Icon, delay = 0,
}: {
    end: number; suffix: string; label: string;
    icon: React.ElementType; delay?: number;
}) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const countRef = useRef<HTMLSpanElement>(null);
    const animated = useRef(false);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !animated.current) {
                    animated.current = true;
                    const timer = setTimeout(() => {
                        const ctrl = animate(0, end, {
                            duration: 2.2,
                            ease: [0.16, 1, 0.3, 1],
                            onUpdate(v) {
                                if (countRef.current)
                                    countRef.current.textContent = Math.round(v).toString();
                            },
                        });
                        return () => ctrl.stop();
                    }, delay);
                    return () => clearTimeout(timer);
                }
            },
            { threshold: 0.4 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [end, delay]);

    return (
        <motion.div
            ref={wrapRef}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay / 1000 + 0.05, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="group text-center p-5 rounded-2xl bg-card border border-border/60
                       hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5
                       transition-all duration-300 cursor-default"
        >
            <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center
                            mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-foreground tabular-nums tracking-tight">
                <span ref={countRef}>0</span>
                <span className="text-primary">{suffix}</span>
            </p>
            <p className="text-[10px] text-muted-foreground font-semibold mt-1 uppercase tracking-widest">
                {label}
            </p>
        </motion.div>
    );
}

export default function Blog() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);

    const filteredPosts = blogPosts.filter((post) => {
        const matchCat = selectedCategory === "All" || post.category === selectedCategory;
        const matchSearch =
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchCat && matchSearch;
    });

    const featuredPost = blogPosts.find(p => p.featured);
    const showFeatured = selectedCategory === "All" && !searchQuery;
    const gridPosts = showFeatured ? filteredPosts.filter(p => !p.featured) : filteredPosts;

    /* ⌘K shortcut to focus search */
    useEffect(() => {
        const h = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                searchRef.current?.focus();
            }
        };
        window.addEventListener("keydown", h);
        return () => window.removeEventListener("keydown", h);
    }, []);

    return (
        <Layout>
            <main className="bg-background min-h-screen">

                {/* ══ DYNAMIC HERO SECTION ══ */}
                <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
                    {/* Immersive Background Container */}
                    <motion.div
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.8, ease: "easeOut" }}
                        className="absolute inset-0 z-0"
                    >
                        <img
                            src="/blog-hero.png"
                            alt="Intelligence Hero"
                            className="w-full h-full object-cover filter brightness-[0.4] contrast-[1.1] scale-105"
                        />
                        {/* Professional Tactical Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-[#050507]/40 to-background" />
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(5,5,7,0.8)_100%)]" />
                    </motion.div>

                    {/* Industrial Noise + Dot Mesh */}
                    <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                    <div
                        className="absolute inset-0 z-[1] opacity-[0.05] pointer-events-none"
                        style={{
                            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                            backgroundSize: "40px 40px",
                        }}
                    />

                    <div className="container-wide relative z-10 py-20">
                        <div className="max-w-5xl mx-auto text-center space-y-8">
                            {/* Status Node Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/20 backdrop-blur-xl shadow-2xl mx-auto"
                            >
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                                    Global Intelligence Network Active
                                </span>
                            </motion.div>

                            {/* Main Transmission Header */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                className="space-y-4"
                            >
                                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] text-white drop-shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
                                    The <span className="inline-block pr-3 md:pr-5 bg-gradient-to-r from-primary via-white to-accent bg-clip-text text-transparent italic filter drop-shadow-[0_4px_15px_rgba(139,92,246,0.4)]">ZenzeTrade</span> <br />
                                    Perspective.
                                </h1>
                                <p className="text-lg md:text-2xl text-white/60 font-medium max-w-2xl mx-auto tracking-tight leading-relaxed">
                                    Expert intelligence on global commerce, industrial innovation, and strategic B2B expansion — curated for industry leaders.
                                </p>
                            </motion.div>

                            {/* Tactical Search Interface (High Visibility Mode) */}
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="relative max-w-2xl mx-auto"
                            >
                                <div className={`relative flex items-center transition-all duration-500 rounded-2xl backdrop-blur-3xl border ${isSearchFocused
                                    ? 'bg-white/25 border-primary/60 ring-[12px] ring-primary/10 shadow-[0_40px_80px_-20px_rgba(139,92,246,0.5)]'
                                    : 'bg-white/15 border-white/30 shadow-2xl hover:border-white/50 hover:bg-white/20'}`}>

                                    <Search className={`ml-6 w-6 h-6 transition-colors duration-300 ${isSearchFocused ? 'text-primary' : 'text-white/70'}`} />

                                    <input
                                        ref={searchRef}
                                        type="text"
                                        placeholder="SEARCH ARCHIVES, INTELLIGENCE, NODES..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        onFocus={() => setIsSearchFocused(true)}
                                        onBlur={() => setIsSearchFocused(false)}
                                        className="w-full px-5 py-6 bg-transparent outline-none text-sm font-black tracking-[0.15em] text-white placeholder:text-white/50 uppercase"
                                    />

                                    <div className={`mr-6 px-3 py-1.5 rounded-lg border text-[10px] font-black hidden sm:block tracking-widest transition-colors duration-300 ${isSearchFocused ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-white/5 border-white/20 text-white/40'}`}>
                                        NODE:SEARCH
                                    </div>
                                </div>
                            </motion.div>

                            {/* Real-time Network Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 pt-16 border-t border-white/10">
                                {stats.map(({ end, suffix, label, icon: Icon }, i) => (
                                    <motion.div
                                        key={label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 + (i * 0.1) }}
                                        className="text-center group"
                                    >
                                        <div className="mb-3 flex justify-center">
                                            <Icon className="w-5 h-5 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="text-3xl font-black text-white tabular-nums tracking-tighter">
                                            <StatCardCounter end={end} suffix={suffix} />
                                        </div>
                                        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-primary transition-colors">
                                            {label}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══ ELITE CATEGORY SELECTION MATRIX ══ */}
                <section className="container-wide py-8 sm:py-14">
                    <div className="relative">
                        {/* Left & Right subtle edge fade indicators for horizontal scroll on mobile */}
                        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-background to-transparent z-20 md:hidden" />
                        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-20 md:hidden" />

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap gap-2.5 sm:gap-3.5 px-4 sm:px-6 md:px-0 py-2 md:flex-wrap md:justify-center touch-pan-x"
                        >
                            {categories.map(({ label, icon: Icon, count }, i) => {
                                const isActive = selectedCategory === label;
                                return (
                                    <motion.button
                                        key={label}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        onClick={() => setSelectedCategory(label)}
                                        className={`group relative flex items-center gap-2.5 sm:gap-3.5 px-3.5 sm:px-5 py-2.5 sm:py-3.5 rounded-2xl transition-all duration-300 overflow-hidden shrink-0 border ${
                                            isActive
                                                ? "bg-gradient-to-r from-primary via-primary to-accent text-white shadow-lg shadow-primary/25 border-white/20 ring-1 ring-white/20"
                                                : "bg-card/70 hover:bg-card border-border/70 dark:border-white/10 text-muted-foreground hover:text-foreground hover:border-primary/30 shadow-sm"
                                        }`}
                                    >
                                        {/* Active Background Layer */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeCategory"
                                                className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-accent pointer-events-none"
                                                initial={false}
                                                transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
                                            />
                                        )}

                                        <div className="relative z-10 flex items-center gap-2.5 sm:gap-3">
                                            <div className={`p-1.5 sm:p-2 rounded-xl transition-colors shrink-0 ${
                                                isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary group-hover:bg-primary/20"
                                            }`}>
                                                <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                                            </div>

                                            <div className="flex flex-col items-start text-left">
                                                <span className="text-xs sm:text-xs font-black uppercase tracking-wider leading-tight">
                                                    {label}
                                                </span>
                                                <div className="flex items-center gap-1 opacity-60 mt-0.5">
                                                    <span className="w-1 h-1 rounded-full bg-current" />
                                                    <span className="text-[8px] font-bold uppercase tracking-wider">Segment</span>
                                                </div>
                                            </div>

                                            {/* Node Counter Badge */}
                                            <div className={`ml-1.5 sm:ml-2 px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-black tabular-nums transition-colors shrink-0 ${
                                                isActive
                                                    ? "bg-black/25 text-white"
                                                    : "bg-muted dark:bg-white/10 text-muted-foreground group-hover:text-foreground"
                                            }`}>
                                                {count.toString().padStart(2, '0')}
                                            </div>
                                        </div>

                                        {/* Hover Shimmer Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                                    </motion.button>
                                );
                            })}
                        </motion.div>
                    </div>
                </section>

                {/* ══ FEATURED POST ══ */}
                <AnimatePresence mode="wait">
                    {showFeatured && featuredPost && (
                        <motion.section
                            key="featured"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: 0.08 }}
                            className="container-wide pb-14"
                        >
                            <div className="flex items-center gap-3 mb-7">
                                <Flame className="w-4 h-4 text-accent" />
                                <span className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground">
                                    Featured Article
                                </span>
                                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
                            </div>
                            <FeaturedCard post={featuredPost} />
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* ══ ARTICLES GRID ══ */}
                <section className="container-wide pb-24">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                            <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                                Intelligence Matrix
                            </span>
                            <span className="text-xs font-bold text-muted-foreground">
                                {searchQuery || selectedCategory !== "All"
                                    ? `${filteredPosts.length} SEGMENT${filteredPosts.length !== 1 ? "S" : ""} FOUND`
                                    : "ALL AVAILABLE DEPOSITS"}
                            </span>
                        </div>
                        <div className="flex-1 h-[2px] bg-gradient-to-r from-primary/10 via-border to-transparent ml-4" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 xl:gap-6">
                        <AnimatePresence mode="popLayout">
                            {gridPosts.map((post, index) => (
                                <ArticleCard key={post.id} post={post} index={index} />
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Empty state */}
                    {filteredPosts.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-32 flex flex-col items-center"
                        >
                            <div className="w-20 h-20 rounded-3xl bg-muted flex items-center
                                            justify-center mb-5 shadow-inner">
                                <Search className="w-9 h-9 text-muted-foreground/30" />
                            </div>
                            <h3 className="text-xl font-black text-foreground mb-2">No articles found</h3>
                            <p className="text-muted-foreground font-medium mb-6 max-w-xs text-sm">
                                Nothing matched your search. Try different keywords or browse a category.
                            </p>
                            <button
                                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                                className="px-6 py-3 rounded-xl gradient-primary text-white font-black
                                           text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
                            >
                                Clear Filters
                            </button>
                        </motion.div>
                    )}
                </section>


                {/* ══ HORIZONTAL NEWSLETTER NODE ══ */}
                <section className="container-wide pb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        className="relative overflow-hidden rounded-[3rem] p-8 sm:p-12 lg:p-16 border border-white/10"
                        style={{ background: "linear-gradient(135deg, hsl(var(--foreground)) 0%, hsl(262 60% 12%) 100%)" }}
                    >
                        {/* Immersive Tactical Glows */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
                        <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[100px] pointer-events-none" />

                        {/* Mesh Overlay */}
                        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
                            {/* Left Transmission: Info */}
                            <div className="lg:w-3/5 space-y-6">
                                <motion.span
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent text-[10px] font-black uppercase tracking-[0.3em]"
                                >
                                    <Zap className="w-3 h-3" /> Intelligence Feed Active
                                </motion.span>

                                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tighter">
                                    Stay ahead of the <br />
                                    <span className="italic bg-gradient-to-r from-primary via-white to-accent bg-clip-text text-transparent">market curve.</span>
                                </h2>

                                <p className="text-white/50 text-lg sm:text-xl font-medium leading-relaxed max-w-xl">
                                    Get specialized B2B insights, industry reports, and exclusive trade opportunities delivered to your inbox every week.
                                </p>

                                <div className="flex items-center gap-6 pt-4">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="subscriber" />
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                                        Join <span className="text-white">15,000+</span> Elite Readers
                                    </p>
                                </div>
                            </div>

                            {/* Right Transmission: Form */}
                            <div className="lg:w-2/5 w-full">
                                <div className="p-2 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-3xl shadow-2xl">
                                    <div className="p-6 sm:p-8 space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">
                                                COMMUNICATION NODE
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                                                <input
                                                    type="email"
                                                    placeholder="Enter work email..."
                                                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white text-sm font-bold placeholder:text-white/20 outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <button className="w-full py-5 rounded-2xl gradient-primary text-white text-xs font-black uppercase tracking-[0.4em] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all group relative overflow-hidden">
                                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                            <span className="relative z-10 flex items-center justify-center gap-3">
                                                Subscribe Now <ArrowRight className="w-4 h-4" />
                                            </span>
                                        </button>

                                        <p className="text-[9px] text-center text-white/30 font-bold uppercase tracking-widest">
                                            Zero Spam • Encrypted Transmission • Unsubscribe Anytime
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

            </main>
        </Layout>
    );
}
