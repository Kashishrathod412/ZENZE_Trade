import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Scale, Gavel, CreditCard, Ship, CheckCircle, AlertTriangle, Download, ArrowRight, ShieldCheck, Briefcase } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Terms = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
    const [activeTab, setActiveTab] = useState("Escrow");

    const legalTerms = [
        {
            id: "Accounts",
            icon: ShieldCheck,
            title: "Identity & Node Access",
            desc: "Protocol for elite network membership and authentication.",
            details: [
                "Only verified business entities are permitted to initialize trading nodes.",
                "Users must maintain 2FA (Two-Factor Authentication) for all high-value transactions.",
                "ZenzeTrade reserves the right to terminate nodes for protocol violations within 24 hours."
            ]
        },
        {
            id: "Escrow",
            icon: CreditCard,
            title: "Financial Escrow Matrix",
            desc: "Secure clearinghouse protocols for B2B settlements.",
            details: [
                "100% funds are held in specialized escrow nodes until cargo authentication.",
                "Automated payouts are processed via ISO-20022 protocols post-delivery success.",
                "A standard 2% network maintenance fee applies to all processed trade volumes."
            ]
        },
        {
            id: "Logistics",
            icon: Ship,
            title: "Logistics & Payload",
            desc: "Standardized shipping and weight-limit enforcement.",
            details: [
                "Sellers must specify precise weight limits for each vehicle class (20kg bike default).",
                "Wait charges activate precisely 2 minutes after arrival at pickup/drop nodes.",
                "Riders must maintain active GPS telemetry throughout the mission duration."
            ]
        },
        {
            id: "Quality",
            icon: CheckCircle,
            title: "Asset Quality Assurance",
            desc: "Verification protocols for industrial-grade inventory.",
            details: [
                "All industrial equipment must carry valid ISO/CE/SGS quality certificates.",
                "Material Testing Reports (MTR) are mandatory for all raw material listings.",
                "Buyers have a 48-hour 'Audit Window' post-delivery for quality discrepancy claims."
            ]
        },
        {
            id: "Compliance",
            icon: Scale,
            title: "Regulatory Protocol",
            desc: "Adherence to international trade laws and KYC standards.",
            details: [
                "Full compliance with GST/VAT regulations in respective jurisdictions is required.",
                "Platform integrity is monitored by AI for anti-money laundering (AML) detection.",
                "Data sovereignty is maintained under regional data protection laws (DPDP/GDPR)."
            ]
        }
    ];

    return (
        <div className="min-h-screen font-body bg-background selection:bg-primary/20">
            <Header />

            {/* Scroll Progress Bar */}
            <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-primary z-50 origin-left" style={{ scaleX }} />

            {/* Hero Section with Parallax Particles */}
            <section className="relative py-28 md:py-40 overflow-hidden bg-[#0A0A0B]">
                <div className="absolute inset-0 opacity-40">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute bg-primary/20 rounded-full blur-xl"
                            style={{
                                width: Math.random() * 300 + 100,
                                height: Math.random() * 300 + 100,
                                top: Math.random() * 100 + "%",
                                left: Math.random() * 100 + "%",
                            }}
                            animate={{
                                y: [0, -40, 0],
                                x: [0, 30, 0],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: Math.random() * 10 + 10,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        />
                    ))}
                </div>

                <div className="container-wide relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6 md:mb-8 inline-block"
                    >
                        <div className="p-3 md:p-4 rounded-2xl md:rounded-3xl bg-white/5 backdrop-blur-3xl border border-white/10 ring-1 ring-white/20">
                            <Scale className="w-8 h-8 md:w-12 md:h-12 text-accent" />
                        </div>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-6 md:mb-8 tracking-tighter"
                    >
                        Terms of <span className="text-gradient underline decoration-primary/30 underline-offset-8">Trade.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-2xl text-white/60 max-w-3xl mx-auto font-medium leading-relaxed px-4 md:px-0"
                    >
                        The legal framework designed to empower $10B+ in annual B2B volume. <br className="hidden md:block" />
                        <span className="text-accent underline decoration-accent/20 font-bold">Safe. Verified. Elite.</span>
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-12 flex flex-col md:flex-row justify-center items-stretch md:items-center gap-4 md:gap-6"
                    >
                        <Button size="lg" className="rounded-2xl gradient-primary text-white h-14 md:h-16 px-6 md:px-10 font-bold shadow-2xl shadow-primary/40 hover:scale-105 transition-all text-sm md:text-base">
                            <Download className="mr-2 w-4 h-4 md:w-5 md:h-5" /> Download Legal PDF
                        </Button>
                        <Button variant="outline" size="lg" className="rounded-2xl border-white/10 bg-white/5 text-white h-14 md:h-16 px-6 md:px-10 font-bold hover:bg-white/10 backdrop-blur-sm transition-all border-2 text-sm md:text-base">
                            View Changelog
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Legal Info Section */}
            <section className="py-24 md:py-32 bg-background relative border-t border-white/5 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
                
                <div className="container-wide relative z-10">
                    <div className="flex flex-col lg:flex-row gap-20">

                        {/* Left Column: Interactive Tab Navigation */}
                        <div className="lg:w-3/5 space-y-10">
                            <div className="bg-muted/30 p-2 rounded-[32px] border border-border/50 flex flex-nowrap overflow-x-auto md:flex-wrap gap-2 no-scrollbar backdrop-blur-xl">
                                {legalTerms.map((term) => (
                                    <button
                                        key={term.id}
                                        onClick={() => setActiveTab(term.id)}
                                        className={`flex-none md:flex-1 min-w-[140px] px-6 py-4 rounded-[24px] font-black transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-3 ${activeTab === term.id
                                            ? "bg-white dark:bg-primary text-primary dark:text-white shadow-2xl ring-1 ring-primary/10 scale-[1.02]"
                                            : "text-muted-foreground hover:bg-white/50 dark:hover:bg-white/5"
                                            }`}
                                    >
                                        <term.icon className="w-4 h-4" />
                                        {term.title.split(" ")[0]}
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="glass-card p-10 md:p-20 border-primary/20 relative group overflow-hidden rounded-[40px] shadow-2xl shadow-primary/5"
                                >
                                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] translate-x-10 -translate-y-10 rotate-12 group-hover:rotate-0 transition-all duration-1000">
                                        <Briefcase className="w-60 h-60" />
                                    </div>

                                    <div className="flex items-center gap-6 mb-10">
                                        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
                                            {(() => {
                                                const Icon = legalTerms.find(t => t.id === activeTab)?.icon || Scale;
                                                return <Icon className="w-8 h-8" />;
                                            })()}
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter leading-none">
                                            {legalTerms.find(t => t.id === activeTab)?.title}
                                        </h2>
                                    </div>

                                    <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed font-medium">
                                        {legalTerms.find(t => t.id === activeTab)?.desc}
                                    </p>

                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {legalTerms.find(t => t.id === activeTab)?.details.map((detail, i) => (
                                            <motion.li
                                                key={i}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex flex-col items-start gap-5 p-8 rounded-[32px] bg-muted/20 border border-border/50 hover:border-primary/20 hover:bg-muted/40 transition-all group/item h-full min-h-[160px] shadow-sm"
                                            >
                                                <div className="p-2 rounded-full bg-primary/10 mt-0.5 group-hover/item:bg-primary group-hover/item:text-white transition-all shadow-sm">
                                                    <CheckCircle className="w-4 h-4 text-primary group-hover/item:text-white" />
                                                </div>
                                                <div className="flex-1">
                                                   <span className="text-lg md:text-xl text-foreground/80 font-bold leading-snug">
                                                       {detail}
                                                   </span>
                                                </div>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Right Column: Visual Breakdown / Infographic */}
                        <div className="lg:w-2/5 flex flex-col justify-center gap-10">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="relative group"
                            >
                                <div className="absolute -inset-2 bg-gradient-to-r from-primary to-accent rounded-[40px] blur-2xl opacity-10 group-hover:opacity-25 transition-all duration-1000" />
                                <div className="relative bg-card rounded-[40px] p-12 md:p-16 border border-border shadow-2xl">
                                    <div className="w-20 h-20 rounded-[28px] gradient-primary/10 flex items-center justify-center mb-10 group-hover:rotate-6 transition-transform">
                                        <ShieldCheck className="w-10 h-10 text-primary" />
                                    </div>
                                    <h3 className="text-3xl font-black text-foreground mb-6 tracking-tight">ZenzeGuard™ Verification</h3>
                                    <p className="text-muted-foreground text-xl leading-relaxed font-medium mb-10">
                                        Every member undergoes a multi-step KYB (Know Your Business) check before they can engage in elite-level trade contracts.
                                    </p>
                                    <div className="space-y-4">
                                        {["Identity Audit", "Capacity Verification", "License Authentication"].map((step, i) => (
                                            <div key={i} className="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-primary/70">
                                                <div className="w-2 h-2 rounded-full bg-primary" />
                                                {step}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="glass-card p-10 rounded-[35px] border border-border hover:border-primary/20 hover:scale-[1.02] transition-all group">
                                    <div className="text-5xl font-black text-primary mb-3 tabular-nums group-hover:scale-110 transition-transform">99.9%</div>
                                    <div className="text-[10px] font-black text-muted-foreground tracking-[0.2em] uppercase">Safe Mission Rate</div>
                                </div>
                                <div className="glass-card p-10 rounded-[35px] border border-border hover:border-accent/20 hover:scale-[1.02] transition-all group">
                                    <div className="text-5xl font-black text-accent mb-3 tabular-nums group-hover:scale-110 transition-transform">24h</div>
                                    <div className="text-[10px] font-black text-muted-foreground tracking-[0.2em] uppercase">Settlement Node</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Disclaimer / Warning Section */}
            <section className="py-20 bg-[#0A0A0B] text-white">
                <div className="container-wide">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-8 md:p-16 rounded-[30px] md:rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-xl relative"
                    >
                        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                            <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-destructive/20 border border-destructive/30">
                                <AlertTriangle className="w-8 h-8 md:w-12 md:h-12 text-destructive animate-pulse" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-2xl md:text-3xl font-black mb-3 md:mb-4">Important Notice</h3>
                                <p className="text-base md:text-lg text-white/60 leading-relaxed font-medium">
                                    Failure to comply with any section of the ZenzeTrade Terms of Trade may result in permanent membership suspension and forfeiture of Elite status. Please consult with your legal counsel before final commitment to these terms.
                                </p>
                            </div>
                            <Link to="/contact" className="w-full md:w-auto">
                                <Button className="h-14 md:h-16 px-8 rounded-xl md:rounded-2xl gradient-primary text-white font-black shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all w-full md:w-auto text-base md:text-lg">
                                    Legal Inquiry <ArrowRight className="ml-3 w-5 h-5 md:w-6 md:h-6" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};


export default Terms;
