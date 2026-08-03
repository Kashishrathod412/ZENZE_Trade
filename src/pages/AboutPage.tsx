import Layout from "@/components/layout/Layout";
import { ShieldCheck, Users, Target, Award, Lightbulb, Compass, BarChart, Activity } from "lucide-react";
import { motion, useInView, animate } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef, useEffect } from "react";

// Flexible Animated counter for About page stats
function Counter({ value, suffix = "", prefix = "", decimals = 0 }: { value: number; suffix?: string; prefix?: string; decimals?: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inViewRef = useRef<HTMLDivElement>(null);
    const inView = useInView(inViewRef, { once: true, margin: "-50px" });
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (inView && !hasAnimated.current && ref.current) {
            hasAnimated.current = true;
            const node = ref.current;
            const controls = animate(0, value, {
                duration: 2.5,
                ease: [0.16, 1, 0.3, 1],
                onUpdate(latest) {
                    node.textContent = prefix + latest.toLocaleString("en-US", {
                        minimumFractionDigits: decimals,
                        maximumFractionDigits: decimals,
                    }) + suffix;
                },
            });
            return () => controls.stop();
        }
    }, [inView, value, suffix, prefix, decimals]);

    return (
        <div ref={inViewRef} className="inline-block">
            <span ref={ref}>{prefix}0{suffix}</span>
        </div>
    );
}

export default function AboutPage() {
    return (
        <Layout>
            {/* ─── FULL-WIDTH HERO BANNER ─── */}
            <section className="relative w-full min-h-[580px] sm:min-h-[640px] lg:h-[88vh] flex items-center justify-center overflow-hidden py-16 sm:py-24">
                {/* Banner Image */}
                <motion.div
                    initial={{ scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                >
                    <img
                        src="https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2670&auto=format&fit=crop"
                        alt="ZenzeTrade Industrial Commerce Platform"
                        className="w-full h-full object-cover object-center"
                    />
                </motion.div>

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-background" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

                {/* Animated dot grid */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-5xl mx-auto w-full my-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="inline-flex items-center gap-2 sm:gap-3 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md mb-4 sm:mb-6 max-w-full"
                    >
                        <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                        </span>
                        <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.18em] sm:tracking-[0.35em] text-white/90 truncate">
                            India's #1 Industrial B2B Platform
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.45 }}
                        className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-heading font-black text-white tracking-tight leading-[1.1] mb-4 sm:mb-6 max-w-5xl"
                    >
                        About <span className="inline-block pr-1 sm:pr-2 text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary to-accent">ZenzeTrade</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-xs sm:text-base md:text-xl text-white/80 font-medium max-w-2xl leading-relaxed px-2 sm:px-0"
                    >
                        Architecting the world's most advanced industrial commerce matrix — connecting verified manufacturers, suppliers, and buyers across India and beyond.
                    </motion.p>

                    {/* Floating Stat Badges */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.75 }}
                        className="grid grid-cols-3 gap-2 sm:gap-3.5 max-w-md sm:max-w-2xl mx-auto w-full mt-6 sm:mt-8 px-1"
                    >
                        {[
                            { val: "10,000+", label: "Elite Suppliers" },
                            { val: "190+", label: "Regional Hubs" },
                            { val: "$50B+", label: "Trade Flow" },
                        ].map((s, i) => (
                            <div key={i} className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 px-2.5 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/10 dark:bg-black/30 backdrop-blur-md border border-white/20 shadow-lg">
                                <span className="text-sm sm:text-xl font-black text-white tracking-tight whitespace-nowrap">{s.val}</span>
                                <span className="text-[7.5px] sm:text-[10px] font-bold sm:font-black uppercase tracking-wider text-white/70 text-center whitespace-nowrap">{s.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Scroll Cue */}
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 hidden xs:flex flex-col items-center gap-1.5 sm:gap-2 z-10 pointer-events-none"
                >
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.25em] text-white/40">Scroll to explore</span>
                    <div className="w-4 h-7 sm:w-5 sm:h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white/60"
                        />
                    </div>
                </motion.div>
            </section>

            {/* Premium Intelligence Hero Section */}
            <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-background pt-0 md:pt-4">
                {/* Dynamic Background Matrix */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[50%] h-full bg-[radial-gradient(circle_at_70%_30%,#8b5cf615_0%,transparent_70%)]" />
                    <div className="absolute bottom-0 left-0 w-[50%] h-full bg-[radial-gradient(circle_at_30%_70%,#f59e0b10_0%,transparent_70%)]" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
                    <div className="absolute inset-0 bg-[radial-gradient(#80808008_1px,transparent_1px)] [background-size:40px_40px]" />
                </div>

                <div className="container-wide relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center pt-12 pb-16 md:pt-20 md:pb-24 px-6 sm:px-8">
                    {/* Left content: The Narrative */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-primary/20 bg-primary/5 mb-8 backdrop-blur-sm"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/90">The Future of Trade, Today</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-black tracking-tight text-foreground leading-[1.1] mb-8 max-w-3xl"
                        >
                            Architecting the <span className="text-transparent bg-clip-text gradient-primary">Commerce</span> Matrix.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-[15px] md:text-base text-muted-foreground font-medium mb-12 max-w-xl leading-relaxed opacity-80"
                        >
                            At ZenzeTrade, we aren't just building a marketplace; we're engineering the world's most sophisticated, zero-latency industrial trading backbone for global elite enterprises.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-16"
                        >
                            <Link to="/contact" className="group relative px-10 py-5 rounded-2xl bg-foreground text-background font-black text-xs uppercase tracking-widest hover:translate-y-[-2px] transition-all duration-300 shadow-xl overflow-hidden min-w-[200px] text-center">
                                <span className="relative z-10">Initialize Connection</span>
                                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                            </Link>
                            <Link to="/inquiry" className="px-10 py-5 rounded-2xl border border-border bg-background/50 backdrop-blur-md text-foreground font-black text-xs uppercase tracking-widest hover:bg-muted transition-all duration-300 min-w-[200px] text-center">
                                View Intelligence
                            </Link>
                        </motion.div>

                        {/* Immersive Stats Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="grid grid-cols-2 lg:grid-cols-3 gap-8 w-full border-t border-border/50 pt-10"
                        >
                            {[
                                { val: 10000, suffix: "+", prefix: "", label: "Elite Suppliers" },
                                { val: 190, suffix: "+", prefix: "", label: "Regional Hubs" },
                                { val: 50, suffix: "B+", prefix: "$", label: "Trade Flow" },
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col">
                                    <span className="text-3xl font-black text-foreground tracking-tighter mb-1">
                                        <Counter value={stat.val} suffix={stat.suffix} prefix={stat.prefix} />
                                    </span>
                                    <span className="text-[9px] uppercase tracking-[0.2em] font-black text-muted-foreground">{stat.label}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right Visual: Immersive Platform Render */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1.2, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        {/* Main Asset Container */}
                        <div className="relative group p-4">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-[3rem] blur-2xl group-hover:blur-3xl transition-all duration-1000 opacity-50" />

                            <div className="relative aspect-[4/5] xl:aspect-square rounded-[2.5rem] border border-white/10 bg-card overflow-hidden shadow-2xl">
                                <img
                                    src="/about-hero-new.png"
                                    alt="Intelligence Matrix"
                                    className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-[2s] ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />

                                {/* Floating Overlay Interface Cards */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-12 left-8 glass-card p-5 border border-white/10 backdrop-blur-2xl rounded-2xl w-48 shadow-2xl"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                            <Activity className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[8px] uppercase tracking-widest font-black text-muted-foreground">Network Load</span>
                                            <span className="text-xs font-black text-foreground">Optimal</span>
                                        </div>
                                    </div>
                                    <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                        <div className="h-full w-2/3 bg-primary" />
                                    </div>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                    className="absolute bottom-12 right-8 glass-card p-5 border border-white/10 backdrop-blur-2xl rounded-2xl w-56 shadow-2xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full border-2 border-primary/40 p-0.5">
                                            <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center">
                                                <Users className="w-4 h-4 text-primary" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[8px] uppercase tracking-widest font-black text-muted-foreground">Certified Networks</span>
                                            <span className="text-sm font-black text-foreground">
                                                <Counter value={12.4} suffix="K Nodes" decimals={1} />
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Decorative Corner Ornaments */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-primary/20 rounded-tr-[2rem]" />
                            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-accent/20 rounded-bl-[2rem]" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Premium Infinite Partner Marquee */}
            <div className="py-20 bg-background relative overflow-hidden group">
                {/* Side Fade Masking - For Premium Look */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

                <div className="container-wide mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center text-center"
                    >
                        <div className="relative mb-4">
                            <span className="text-2xl md:text-3xl font-black uppercase tracking-[0.6em] text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-accent animate-pulse">
                                Global Network Integrity
                            </span>
                            {/* Technical Indicator Line */}
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-primary/20 rounded-full" />
                        </div>
                        <p className="text-[9px] md:text-[11px] font-black text-muted-foreground/40 uppercase tracking-[0.4em] mt-4">
                            Establishing the industrial gold standard for <span className="text-primary/40">Fortune 500</span> operations
                        </p>
                    </motion.div>
                </div>

                {/* The Scrolling Track */}
                <div className="flex overflow-hidden select-none">
                    <motion.div
                        initial={{ x: 0 }}
                        animate={{ x: "-50%" }}
                        transition={{
                            duration: 35,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="flex items-center gap-16 md:gap-32 pr-16 md:pr-32 whitespace-nowrap"
                    >
                        {/* Partner List - Duplicated for seamless loop */}
                        {[
                            "SIEMENS", "CATERPILLAR", "SCHNEIDER", "HONEYWELL", "ALSTOM",
                            "MITSUBISHI", "ABB", "EMERSON", "ROCKWELL", "THALES",
                            "SIEMENS", "CATERPILLAR", "SCHNEIDER", "HONEYWELL", "ALSTOM",
                            "MITSUBISHI", "ABB", "EMERSON", "ROCKWELL", "THALES"
                        ].map((brand, i) => (
                            <div key={i} className="flex items-center gap-6 md:gap-10 opacity-20 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-700 cursor-default">
                                <Activity className="w-5 h-5 md:w-8 md:h-8 text-primary group-hover:animate-pulse" />
                                <span className="text-3xl md:text-6xl xl:text-8xl font-black tracking-tighter text-foreground font-heading">
                                    {brand}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Decorative Bottom Bar */}
                <div className="mt-16 container-wide">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
                </div>
            </div>

            {/* Elite Pillars Section - Reimagined with Premium Industrial Aesthetic */}
            <section className="py-24 md:py-40 bg-background relative overflow-hidden">
                {/* Industrial Matrix Background Components */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-[radial-gradient(circle_at_70%_30%,#8b5cf608_0%,transparent_60%)]" />
                    <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-[radial-gradient(circle_at_30%_70%,#f59e0b08_0%,transparent_60%)]" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
                    {/* Architectural Grid */}
                    <div className="absolute inset-0 opacity-[0.05]"
                        style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '100px 100px' }} />
                </div>

                <div className="container-wide relative z-10 px-6 sm:px-8">
                    {/* Architectural Header Layout */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24 border-b border-border/40 pb-16">
                        <div className="max-w-3xl">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-4 mb-8"
                            >
                                <span className="h-px w-12 bg-primary/40" />
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/80">Corporate DNA & Framework</span>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-[0.95]"
                            >
                                Unshakeable <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-accent italic">Industrial Pillars</span>
                            </motion.h2>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="max-w-md lg:text-right"
                        >
                            <div className="h-12 w-12 bg-muted rounded-full mb-6 lg:ml-auto flex items-center justify-center border border-border group">
                                <Activity className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed">
                                In a world of volatility, we provide the industrial bedrock. Our foundation revolves around <span className="text-foreground">absolute precision</span> and unyielding integrity.
                            </p>
                        </motion.div>
                    </div>

                    {/* Architectural Pillar Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                        {[
                            {
                                icon: Target,
                                title: "Algorithmic Precision",
                                text: "Proprietary matchmaking that algorithmically saves sourcing teams hundreds of labor hours through deep-link vetting.",
                                color: "var(--primary)",
                                tag: "EFFICIENCY",
                                metric: "99.9%"
                            },
                            {
                                icon: Lightbulb,
                                title: "Relentless Innovation",
                                text: "Constantly engineering features that stay five years ahead of the current supply chain curve and geopolitical shifts.",
                                color: "var(--accent)",
                                tag: "FUTURE-PROOF",
                                metric: "V 4.0"
                            },
                            {
                                icon: ShieldCheck,
                                title: "Zero-Trust Integrity",
                                text: "Every vendor operates under a mathematically proven trust system to eliminate fraud and ensure compliance.",
                                color: "var(--primary)",
                                tag: "SECURITY",
                                metric: "AES-256"
                            },
                            {
                                icon: Compass,
                                title: "Global Calibration",
                                text: "A unified marketplace perfectly calibrated across dozens of legal jurisdictions, tax codes, and regional standards.",
                                color: "var(--accent)",
                                tag: "COMPLIANCE",
                                metric: "ISO-C1"
                            }
                        ].map((item, i) => (
                            <div key={i} className="group/perspective perspective-2000 aspect-square">
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    className="relative w-full h-full transition-all duration-[800ms] group-hover/perspective:rotate-y-180"
                                    style={{ transformStyle: 'preserve-3d' }}
                                >
                                    <div
                                        className="absolute inset-0 bg-background rounded-[3rem] border border-border/80 p-8 md:p-10 flex flex-col overflow-hidden shadow-sm"
                                        style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                                    >
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary),0.02),transparent_70%)]" />

                                        {/* Top Row: Icon & Status */}
                                        <div className="relative z-10 flex justify-between items-start mb-auto">
                                            <div className="relative">
                                                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-2xl border border-white/10 ${item.tag === 'FUTURE-PROOF' || item.tag === 'COMPLIANCE' ? 'bg-foreground text-background' : 'bg-primary text-white'}`}>
                                                    <item.icon className="w-6 h-6 md:w-7 md:h-7 stroke-[2.5]" />
                                                </div>
                                                {/* Live Status Pulse */}
                                                <div className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40"></span>
                                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-primary border-2 border-background"></span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-[10px] md:text-[11px] font-black tracking-[0.3em] text-muted-foreground/40 uppercase mb-2">{item.tag}</span>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] md:text-[12px] font-mono font-bold text-primary tracking-widest">{item.metric}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Core Content */}
                                        <div className="relative z-10 my-8">
                                            <h3 className="text-xl md:text-3xl font-black text-foreground mb-4 tracking-tighter leading-tight">
                                                {item.title}
                                            </h3>
                                            <p className="text-[14px] md:text-[15px] text-muted-foreground font-medium leading-relaxed line-clamp-3">
                                                {item.text}
                                            </p>
                                        </div>

                                        {/* Bottom Progress View */}
                                        <div className="relative z-10 mt-auto pt-6 border-t border-border/40">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.5em]">Real-time Status</span>
                                                <span className="text-[10px] font-mono font-bold text-primary">OPTIMAL</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: "85%" }}
                                                    transition={{ duration: 1.5 }}
                                                    className="h-full bg-primary"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="absolute inset-0 bg-background rounded-[3rem] border-2 border-primary/20 p-8 md:p-10 flex flex-col shadow-2xl overflow-hidden"
                                        style={{
                                            backfaceVisibility: 'hidden',
                                            WebkitBackfaceVisibility: 'hidden',
                                            transform: 'rotateY(180deg)'
                                        }}
                                    >
                                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`, backgroundSize: '16px 16px', color: 'hsl(var(--primary))' }} />

                                        <div className="relative z-10 mb-8 border-b border-border/50 pb-6">
                                            <div className="flex flex-col gap-2">
                                                <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.4em]">System Blueprint</span>
                                                <h4 className="text-xl font-bold font-mono tracking-tight text-foreground uppercase truncate">
                                                    ARCH_ID_{i + 1}
                                                </h4>
                                            </div>
                                        </div>

                                        <div className="relative z-10 space-y-4 flex-1">
                                            <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                                                <span className="block text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.5em] mb-2">Core Specifications</span>
                                                <ul className="space-y-2">
                                                    <li className="flex justify-between items-center text-[11px]">
                                                        <span className="font-medium text-muted-foreground">Version Control</span>
                                                        <span className="font-mono font-bold text-foreground">v5.0.1</span>
                                                    </li>
                                                    <li className="flex justify-between items-center text-[11px]">
                                                        <span className="font-medium text-muted-foreground">Calibration</span>
                                                        <span className="font-mono font-bold text-primary">{item.metric}</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                                <span className="block text-[9px] font-black text-primary/60 uppercase tracking-[0.5em] mb-2">Operational Integrity</span>
                                                <p className="text-[12px] text-muted-foreground font-medium leading-relaxed">
                                                    Maximum system stability verified across all regional procurement nodes.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="relative z-10 mt-6 flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-[0.5em] mb-1">Architecture Node</span>
                                                <span className="text-[11px] font-mono font-bold text-foreground">XRT_{i + 1}-SYS</span>
                                            </div>
                                            <Link to="/contact" className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-foreground flex items-center justify-center text-background hover:scale-110 transition-transform duration-300">
                                                <Activity className="w-5 h-5" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>


                        ))}
                    </div>

                </div>
            </section>


            {/* The Story Section - Creative Narrative Redesign */}
            <section className="py-24 md:py-32 relative overflow-hidden">
                <div className="container-wide">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="lg:col-span-5 relative"
                        >
                            {/* Artistic Frame */}
                            <div className="relative group perspective-1000">
                                <div className="absolute -inset-4 bg-primary/10 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                                <div className="relative aspect-[4/5] rounded-[3rem] bg-muted border-[12px] border-card overflow-hidden shadow-2xl transform-gpu transition-transform duration-700 group-hover:rotate-1 group-hover:scale-[1.02]">
                                    <img
                                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop"
                                        alt="Supply Chain Revolution"
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                                    <div className="absolute bottom-10 left-10 right-10">
                                        <div className="glass-card p-8 rounded-[2rem] border border-white/10 backdrop-blur-xl">
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                                                    <Award className="w-5 h-5" />
                                                </div>
                                                <h3 className="text-xl font-black text-white leading-tight">Founded by Veterans</h3>
                                            </div>
                                            <p className="text-sm text-white/70 font-medium leading-relaxed">Built by industry experts tired of outdated sourcing inefficiencies.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Badge */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-10 -right-10 hidden xl:flex flex-col items-center justify-center w-40 h-40 rounded-full bg-accent border-4 border-background text-black shadow-2xl z-20"
                                >
                                    <span className="text-4xl font-black tracking-tighter mb-0">TOP 1%</span>
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80">Certified Manufacturers</span>
                                </motion.div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="lg:col-span-7"
                        >
                            <div className="mb-12">
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-6 block"
                                >
                                    The Sourcing Evolution
                                </motion.span>
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-none mb-8">
                                    Restructuring the <br />
                                    <span className="text-gradient">Supply Chain</span> Backbone.
                                </h2>
                                <p className="text-xl text-muted-foreground leading-relaxed font-medium mb-10 border-l-2 border-primary/20 pl-8">
                                    The archaic standard for finding enterprise suppliers was broken—taking months to vet. ZenzeTrade collapsed this timeline into pure milliseconds.
                                </p>
                            </div>

                            <div className="space-y-12 relative">
                                {/* Vertical Progress Line */}
                                <div className="absolute top-0 left-4 w-px h-[90%] bg-border/50 hidden sm:block" />

                                {[
                                    { step: "01", title: "Conceptualizing the Elite Network", desc: "We started by deeply mapping the exact pain points and technical bottlenecks of Global Fortune 500 procurement teams." },
                                    { step: "02", title: "Developing Sentinel Technology", desc: "Engineered our proprietary zero-trust vetting algorithm to violently filter out all but the absolute top 1% of manufacturers." },
                                    { step: "03", title: "Scaling Across Borders", desc: "Deployed our live trading matrix connecting active industrial hubs across North America, Europe, and Asia simultaneously." }
                                ].map((step, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2 + i * 0.1 }}
                                        key={i}
                                        className="flex gap-8 group items-start relative z-10"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-sm font-black text-muted-foreground group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:scale-110 transition-all duration-300 shadow-sm shrink-0">
                                            {step.step}
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-black text-foreground mb-2 group-hover:text-primary transition-colors duration-300">{step.title}</h4>
                                            <p className="text-[16px] text-muted-foreground font-medium leading-relaxed max-w-xl group-hover:text-foreground/80 transition-colors">{step.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Final Conversion CTA - Industrial Tech Style */}
            <section className="py-24 relative overflow-hidden">
                <div className="container-wide">
                    <div className="relative rounded-[3rem] bg-foreground p-12 md:p-24 overflow-hidden border border-white/10">
                        {/* Background Deco */}
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_100%_0%,#8b5cf630_0%,transparent_70%)]" />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none" />

                        <div className="relative z-10 max-w-3xl">
                            <h2 className="text-4xl md:text-6xl font-black text-background tracking-tighter leading-tight mb-8">
                                Ready to Architect Your <br />
                                <span className="text-primary italic">Supply Chain 2.0?</span>
                            </h2>
                            <p className="text-xl text-background/60 font-medium mb-12 max-w-xl">
                                Join the elite network of industrial giants. Secure your position in the world's most advanced trade matrix.
                            </p>
                            <div className="flex flex-wrap gap-6">
                                <Link to="/contact" className="px-10 py-5 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest hover:scale-105 transition-all duration-300">
                                    Apply for Access
                                </Link>
                                <Link to="/pricing" className="px-10 py-5 rounded-2xl border border-white/20 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all duration-300">
                                    Explore Membership
                                </Link>
                            </div>
                        </div>

                        {/* Abstract Floating Cube/Shape */}
                        <div className="absolute right-[-10%] bottom-[-10%] w-96 h-96 border-[40px] border-white/5 rounded-full rotate-45 hidden lg:block" />
                    </div>
                </div>
            </section>
        </Layout>
    );
}
