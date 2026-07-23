import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Globe, Clock, ShieldCheck, Building2, MessageSquare, ArrowRight, Zap, Target, Building } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { toast } from "sonner";

function Counter({ from, to, suffix, duration = 2.5 }: { from: number, to: number, suffix: string, duration?: number }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });
    const count = useMotionValue(from);
    const rounded = useTransform(count, (latest) => Math.round(latest) + suffix);

    useEffect(() => {
        if (inView) {
            animate(count, to, { duration, ease: "easeOut" });
        }
    }, [count, inView, to, duration]);

    return <motion.span ref={ref}>{rounded}</motion.span>;
}

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            toast.error("Protocol error: Required mission fields missing");
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            toast.success("Identity synched. Mission signal transmitted successfully.");
            setFormData({ name: "", email: "", subject: "", message: "" });
            setIsSubmitting(false);
        }, 2000);
    };

    return (
        <Layout>
            <div className="relative min-h-screen bg-background overflow-hidden flex flex-col font-sans">
                
                {/* Global Background Elements */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    {/* Ambient Glow Orbs */}
                    <div className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-50" />
                    <div className="absolute top-[60%] -right-[10%] w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] opacity-50" />
                    
                    {/* Grain Overlay */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
                </div>

                <div className="relative z-10 flex-1 flex flex-col w-full">
                    
                    {/* SECTION 1: Compact Hero */}
                    <section className="relative w-full pt-32 pb-48 flex flex-col justify-center items-center text-center px-4 overflow-hidden border-b border-white/5">
                        {/* Background Photo for Upper Section */}
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center" />
                        <div className="absolute inset-0 bg-black/60" /> {/* Dark overlay */}

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="relative z-10 space-y-6 max-w-4xl mx-auto"
                        >
                            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.4em] shadow-xl">
                                <Target className="w-3.5 h-3.5 animate-pulse" />
                                Global Communication Link
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] text-white">
                                Connect to <br />
                                <span className="text-primary italic">The Trade Core.</span>
                            </h1>
                            <p className="text-sm md:text-base text-white/70 font-medium max-w-lg mx-auto tracking-widest uppercase">
                                Our elite concierge is standing by to integrate your node into the global network.
                            </p>
                        </motion.div>
                    </section>

                    {/* SECTION 2: Bento Grid */}
                    <section className="relative z-20 w-full px-6 lg:px-12 pb-24 -mt-32">
                        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                            
                            {/* TILE A: Transmission Form (7 Columns, spans 2 rows) */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0, ease: [0.16, 1, 0.3, 1] }}
                                className="lg:col-span-7 lg:row-span-2 relative bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 overflow-hidden shadow-2xl"
                            >
                                {/* Top-right glow blob */}
                                <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/15 rounded-full blur-[80px] pointer-events-none" />

                                <div className="relative z-10">
                                    <div className="flex items-center gap-5 mb-10">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                                            <MessageSquare className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter">Initiate Transmission</h2>
                                            <p className="text-[10px] text-white/70 font-black uppercase tracking-widest mt-1">Direct Link to Sector Command</p>
                                        </div>
                                    </div>

                                    <form className="space-y-6" onSubmit={handleSubmit}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Identification</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Entity / Individual Name"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full h-14 px-5 rounded-2xl bg-white/5 border border-foreground/20 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm font-bold tracking-tight text-foreground placeholder:text-muted-foreground/40"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Comms Channel</label>
                                                <input
                                                    type="email"
                                                    required
                                                    placeholder="your-node@network.com"
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full h-14 px-5 rounded-2xl bg-white/5 border border-foreground/20 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm font-bold tracking-tight text-foreground placeholder:text-muted-foreground/40"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Mission Objective</label>
                                            <input
                                                type="text"
                                                placeholder="What are we solving today?"
                                                value={formData.subject}
                                                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                                className="w-full h-14 px-5 rounded-2xl bg-white/5 border border-foreground/20 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm font-bold tracking-tight text-foreground placeholder:text-muted-foreground/40"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Detailed Intelligence</label>
                                            <textarea
                                                required
                                                placeholder="Provide deep-dive context..."
                                                rows={5}
                                                value={formData.message}
                                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-foreground/20 focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm font-bold tracking-tight text-foreground placeholder:text-muted-foreground/40 resize-none"
                                            />
                                        </div>

                                        <div className="pt-2">
                                            <Button
                                                size="lg"
                                                disabled={isSubmitting}
                                                className="w-full h-16 rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-black text-xs tracking-[0.3em] transition-all relative overflow-hidden uppercase group shadow-lg border-none"
                                            >
                                                {isSubmitting ? (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                        SECURING...
                                                    </div>
                                                ) : (
                                                    <span className="relative z-10 flex items-center gap-3">
                                                        Transmit Signal
                                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                                    </span>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>

                            {/* RIGHT COLUMN WRAPPER (Tiles B & C) */}
                            <div className="lg:col-span-5 lg:row-span-2 flex flex-col gap-6 justify-center">
                                {/* TILE B: Mission Headquarters */}
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    whileHover={{ scale: 1.02 }}
                                    viewport={{ once: true }}
                                    transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                                    className="relative bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden cursor-default group"
                                >
                                    {/* Subtle animated grid-dot pattern inside the tile */}
                                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(139,92,246,0.15)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                                    
                                    <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left h-full justify-center">
                                        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 shrink-0 shadow-inner">
                                            <Building className="w-7 h-7" />
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-white/70 mb-1.5">Mission Headquarters</h3>
                                            <p className="text-2xl md:text-3xl font-black text-white tracking-tight mb-1">Hub Elite Tower</p>
                                            <p className="text-[10px] md:text-xs text-primary font-bold uppercase tracking-widest">Trade City, IN 400001</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* TILE C: Contact Sub-grid */}
                                <div className="grid grid-cols-2 gap-6">
                                    {/* Phone Card */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        whileHover={{ scale: 1.02 }}
                                        viewport={{ once: true }}
                                        transition={{ type: "spring", stiffness: 300, delay: 0.15 }}
                                        className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-primary/30 transition-all duration-300 shadow-xl group cursor-pointer flex flex-col justify-center"
                                    >
                                        <Phone className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors mb-4" />
                                        <p className="text-lg md:text-xl font-black text-foreground tracking-tight mb-1.5">+91 (800) ZENZE</p>
                                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">24/7 Concierge</p>
                                    </motion.div>

                                    {/* Email Card */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        whileHover={{ scale: 1.02 }}
                                        viewport={{ once: true }}
                                        transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                                        className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-primary/30 transition-all duration-300 shadow-xl group cursor-pointer flex flex-col justify-center"
                                    >
                                        <Mail className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors mb-4" />
                                        <p className="text-lg md:text-xl font-black text-foreground tracking-tight mb-1.5">ops@zenzetrade</p>
                                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">60 Min Response</p>
                                    </motion.div>

                                    {/* Trust / Security Card (Spans 2 columns) */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        whileHover={{ scale: 1.02 }}
                                        viewport={{ once: true }}
                                        transition={{ type: "spring", stiffness: 300, delay: 0.25 }}
                                        className="col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-primary/30 transition-all duration-300 shadow-xl group flex flex-col justify-center"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <ShieldCheck className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                                            <h4 className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-foreground">Protocol Secured</h4>
                                        </div>
                                        <p className="text-[10px] md:text-xs font-mono text-muted-foreground leading-relaxed uppercase tracking-widest">
                                            ALL COMMUNICATIONS ORIGINATING FROM THIS NODE ARE AUTOMATICALLY ROUTED THROUGH END-TO-END MILITARY GRADE ENCRYPTION CHANNELS.
                                        </p>
                                    </motion.div>
                                </div>
                            </div>

                        </div>
                    </section>
                </div>

                {/* SECTION 3: Global Distribution Stats (Kept as-is) */}
                <section className="relative w-full py-12 border-t border-white/5 bg-black/10 overflow-hidden">
                    {/* Massive spinning globe background */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                        <Globe className="w-[1200px] h-[1200px] text-primary opacity-10 animate-[spin_120s_linear_infinite]" strokeWidth={0.5} />
                    </div>

                    <div className="relative z-10 max-w-[1400px] mx-auto px-4 lg:px-12 xl:px-24">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16"
                        >
                            {[
                                { countTo: 50, suffix: "K+", label: "VETTED PARTNERS", icon: Building2 },
                                { countTo: 190, suffix: "+", label: "TRADE NODES", icon: Globe },
                                { countTo: 24, suffix: "/7", label: "ACTIVE LINKAGE", icon: Clock }
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col items-center justify-center text-center group">
                                    <div className="mb-4 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 shadow-sm flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 backdrop-blur-md">
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tighter mb-1">
                                        <Counter from={0} to={stat.countTo} suffix={stat.suffix} />
                                    </h3>
                                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{stat.label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>

            </div>
        </Layout>
    );
}


