import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText, Globe, Bell, Mail, ArrowRight, UserCheck, Search, Sparkles, CheckCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Privacy = () => {

    const sections = [
        { 
            id: "introduction", 
            icon: Shield, 
            title: "Security Mission", 
            intro: "At ZenzeTrade Elite, we take your professional data privacy with utmost seriousness. Our industrial shield is built on:",
            points: [
                "Bank-grade AES-256 encryption for all data at rest.",
                "ISO 27001 certified data center protocols.",
                "Zero-knowledge architecture for sensitive business documents."
            ]
        },
        { 
            id: "collection", 
            icon: FileText, 
            title: "Data Intelligence", 
            intro: "We collect only the essential telemetry needed to bridge global trade barriers:",
            points: [
                "KYC-verified business registration and tax identity (GST/VAT).",
                "Real-time GPS telemetry for active logistics missions.",
                "Professional contact nodes for authorized trade representatives."
            ]
        },
        { 
            id: "usage", 
            icon: Globe, 
            title: "Data Sovereignty", 
            intro: "Your data is the fuel for your growth, and we protect it as such:",
            points: [
                "Automated matching of high-intent industrial leads.",
                "Verification of trust scores across the elite marketplace.",
                "Strict 'No-Sell' policy: Your data is never leveraged for third-party ads."
            ]
        },
        { 
            id: "security", 
            icon: Lock, 
            title: "Network Defense", 
            intro: "Multi-layered protocols ensuring your trade secrets remain yours alone:",
            points: [
                "Distributed data storage to prevent single-point-of-failure vulnerabilities.",
                "Biometric and 2FA authenticated access to all command dashboards.",
                "Regular AI-driven penetration testing for threat neutralization."
            ]
        },
        { 
            id: "rights", 
            icon: UserCheck, 
            title: "Privacy Rights", 
            intro: "You maintain total sovereignty over your industrial identity:",
            points: [
                "Right to 'Digital Oblivion': Request full node purge at any time.",
                "Instant data export for comprehensive trade history audits.",
                "Transparent logging of every system access to your data nodes."
            ]
        }
    ];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="min-h-screen font-body bg-background selection:bg-primary/20">
            <Header />

            {/* Hero Section with Enhanced Creativity */}
            <section className="relative py-28 md:py-48 overflow-hidden gradient-hero">
                <div className="absolute inset-0 pointer-events-none">
                    {/* Animated Floating Particles */}
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute bg-primary/10 rounded-full blur-3xl"
                            style={{
                                width: Math.random() * 400 + 200,
                                height: Math.random() * 400 + 200,
                                top: Math.random() * 100 + "%",
                                left: Math.random() * 100 + "%",
                            }}
                            animate={{
                                y: [0, -100, 0],
                                x: [0, 50, 0],
                                opacity: [0.1, 0.3, 0.1],
                            }}
                            transition={{
                                duration: Math.random() * 15 + 15,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        />
                    ))}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-primary/5 rounded-full pointer-events-none"
                    />
                </div>

                <div className="container-wide relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/40 backdrop-blur-xl border border-white/20 text-primary font-black text-xs uppercase tracking-widest shadow-xl mb-10"
                    >
                        <Sparkles className="w-4 h-4 text-accent animate-pulse" /> THE ZENZE PRIVACY STANDARD
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="text-4xl sm:text-6xl md:text-9xl font-black text-foreground mb-8 tracking-tighter leading-[0.9]"
                    >
                        Privacy <br />
                        <span className="text-gradient italic relative inline-block">
                            Commitment.
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: "100%" }}
                                className="absolute -bottom-2 left-0 h-2 bg-accent shadow-lg shadow-accent/20 rounded-full"
                            />
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl md:text-3xl text-muted-foreground/80 max-w-3xl mx-auto font-medium leading-tight"
                    >
                        Encryption by default. Transparency by design. <br />
                        <span className="text-foreground font-black underline decoration-primary/20">Elite-level protection</span> for your trade secrets.
                    </motion.p>
                </div>
            </section>

            {/* Main Layout Grid */}
            <section className="py-12 md:py-24 container-wide">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 relative">

                    {/* Navigation Sidebar */}
                    <aside className="w-full lg:w-[350px] shrink-0 lg:sticky top-32 h-fit z-10 pb-2 sm:pb-4">
                        <div className="glass-card p-4 sm:p-6 lg:p-12 border border-primary/10 rounded-2xl sm:rounded-3xl lg:rounded-[40px] shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/15 rounded-full blur-[100px] group-hover:bg-primary/25 transition-all duration-700 pointer-events-none" />

                            <h3 className="font-black text-2xl mb-10 hidden lg:flex items-center gap-4 text-foreground border-b border-border/50 pb-8 uppercase tracking-tighter">
                                <Search className="w-6 h-6 text-primary" /> Sector Map
                            </h3>

                            {/* Desktop Nav */}
                            <nav className="hidden lg:flex flex-col space-y-8">
                                {sections.map((section, i) => (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollToSection(section.id)}
                                        className="flex items-center gap-6 w-full text-left font-bold text-lg transition-all group/nav hover:translate-x-3"
                                    >
                                        <span className="text-primary/30 text-sm font-black italic shrink-0 tabular-nums">{(i + 1).toString().padStart(2, '0')}</span>
                                        <span className="text-muted-foreground group-hover/nav:text-primary transition-colors hover:underline decoration-primary/40 underline-offset-[12px] decoration-2">{section.title}</span>
                                    </button>
                                ))}
                            </nav>

                            {/* Mobile Nav - Premium Scroll */}
                            <div className="lg:hidden">
                                <div className="flex items-center justify-between mb-2.5 px-0.5">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1.5">
                                        <Search className="w-3.5 h-3.5 text-primary" /> Quick Navigation
                                    </span>
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">5 Sections</span>
                                </div>
                                <nav className="flex overflow-x-auto gap-2 pb-2 -mx-1 px-1 no-scrollbar scroll-smooth">
                                    {sections.map((section) => (
                                        <button
                                            key={section.id}
                                            onClick={() => scrollToSection(section.id)}
                                            className="shrink-0 inline-flex items-center gap-2 whitespace-nowrap bg-muted/60 dark:bg-white/5 border border-primary/15 hover:border-primary/30 active:bg-primary/20 px-3.5 py-2.5 rounded-xl text-xs font-bold text-foreground transition-all shadow-sm active:scale-95"
                                        >
                                            <section.icon className="w-4 h-4 text-primary shrink-0" />
                                            <span>{section.title}</span>
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            <div className="mt-4 sm:mt-6 lg:mt-16 bg-primary/5 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl lg:rounded-[28px] border border-primary/10 text-center relative overflow-hidden group/cta flex flex-col items-center gap-2 sm:gap-3">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover/cta:opacity-100 transition-opacity duration-700" />
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.25em] relative z-10">Elite Privacy Shield</p>
                                <Link to="/contact" className="relative z-10">
                                    <Button className="rounded-xl gradient-primary text-white h-8 sm:h-9 px-3.5 sm:px-4 font-bold text-xs shadow-md shadow-primary/20 hover:scale-[1.03] active:scale-95 transition-all gap-1.5 whitespace-nowrap">
                                        Data Support Node <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Policy Sections */}
                    <div className="flex-1 space-y-8 sm:space-y-16 lg:space-y-28 min-w-0">
                        {sections.map((section, index) => (
                            <motion.div
                                key={section.id}
                                id={section.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className="relative group p-0.5"
                            >
                                <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-[50px] opacity-0 group-hover:opacity-100 transition-all duration-1000 blur-3xl" />
                                <div className="glass-card p-5 sm:p-10 md:p-16 lg:p-20 border border-white/10 relative overflow-hidden hover:border-primary/20 transition-all duration-700 shadow-2xl rounded-2xl sm:rounded-3xl lg:rounded-[40px]">

                                    <div className="absolute top-0 right-0 p-12 lg:p-16 opacity-[0.03] translate-x-10 -translate-y-10 group-hover:rotate-6 group-hover:scale-110 transition-all duration-[2000ms] hidden sm:block">
                                        <section.icon className="w-48 h-48 lg:w-72 lg:h-72 text-primary" />
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 lg:gap-10 mb-6 sm:mb-10 lg:mb-12 relative z-10">
                                        <div className="w-12 h-12 sm:w-20 sm:h-20 lg:w-24 lg:h-24 shrink-0 rounded-xl sm:rounded-[30px] lg:rounded-[35px] bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-xl shadow-primary/30 ring-4 sm:ring-8 ring-primary/5">
                                            <section.icon className="w-6 h-6 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
                                        </div>
                                        <div>
                                            <div className="flex gap-4 mb-1.5 sm:mb-3">
                                                <span className="text-[10px] sm:text-xs font-black text-primary/50 uppercase tracking-[0.25em] sm:tracking-[0.3em]">Protocol {index + 1}.0 Elite</span>
                                            </div>
                                            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tighter leading-none">{section.title}</h2>
                                        </div>
                                    </div>

                                    <div className="space-y-6 sm:space-y-10 relative z-10">
                                        <p className="text-sm sm:text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-4xl">
                                            {section.intro}
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-6 mt-6 sm:mt-10">
                                            {section.points.map((point, pIdx) => (
                                                <div key={pIdx} className="flex flex-col items-start gap-3 sm:gap-5 p-4 sm:p-8 rounded-xl sm:rounded-[32px] bg-muted/30 border border-border/50 hover:border-primary/20 hover:bg-muted/50 transition-all duration-500 group/point h-full min-h-[100px] sm:min-h-[160px] shadow-sm hover:shadow-xl">
                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-lg sm:rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover/point:scale-110 group-hover/point:bg-primary group-hover/point:text-white transition-all duration-500 shadow-sm">
                                                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className="text-sm sm:text-lg md:text-xl font-bold text-muted-foreground/90 group-hover:text-foreground transition-colors leading-snug">{point}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Premium CTA Block */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="rounded-2xl sm:rounded-[30px] md:rounded-[50px] p-6 sm:p-10 md:p-24 text-center text-white relative overflow-hidden shadow-[0_20px_80px_-15px_rgba(124,58,237,0.4)]"
                            style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%), hsl(262 83% 35%))' }}
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 opacity-10 pointer-events-none scale-150"
                            >
                                <Globe className="w-full h-full opacity-5" />
                            </motion.div>

                            <h3 className="text-2xl sm:text-4xl md:text-7xl font-black mb-3 sm:mb-8 md:mb-10 relative z-10 leading-tight tracking-tight">
                                Data Integrity at Global Scale.
                            </h3>
                            <p className="text-xs sm:text-lg md:text-2xl text-white/80 mb-6 sm:mb-10 md:mb-14 max-w-3xl mx-auto font-medium relative z-10 leading-relaxed">
                                Connect with our certified Data Privacy Officers for a detailed security audit of your elite membership.
                            </p>

                            <Link to="/contact" className="relative z-10 inline-block w-full sm:w-auto">
                                <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-xl sm:rounded-2xl md:rounded-[30px] h-11 sm:h-14 md:h-20 px-5 sm:px-8 md:px-16 font-black text-xs sm:text-base md:text-xl shadow-[0_15px_30px_-5px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all w-full sm:w-auto">
                                    Request Security Audit <ArrowRight className="ml-2 md:ml-4 w-4 h-4 md:w-8 md:h-8" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>

                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Privacy;
