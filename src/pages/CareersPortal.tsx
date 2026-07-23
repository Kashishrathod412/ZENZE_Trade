import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, MapPin, Clock, Search, ArrowRight,
  Globe, Users, Zap, ShieldCheck, ChevronRight,
  Sparkles, Terminal, Building2, TrendingUp, Heart, Coffee
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getJobs, type Job } from "@/lib/storage";

const PILLARS = [
  { icon: Zap, color: "from-violet-500/20 to-purple-500/10", iconColor: "text-violet-500", title: "Velocity First", desc: "We move at the speed of global trade. No bureaucracy — just pure execution, innovation, and results." },
  { icon: ShieldCheck, color: "from-emerald-500/20 to-green-500/10", iconColor: "text-emerald-500", title: "Unwavering Trust", desc: "Integrity is our core protocol. We build systems that thousands of businesses around the world rely on." },
  { icon: Globe, color: "from-blue-500/20 to-cyan-500/10", iconColor: "text-blue-500", title: "Global Perspective", desc: "A diverse network working across continents to solve planetary-scale industrial and trade problems." },
  { icon: Heart, color: "from-rose-500/20 to-pink-500/10", iconColor: "text-rose-500", title: "People First", desc: "We invest in people as our core infrastructure. Great culture breeds the best products." },
];

const PERKS = [
  { icon: Coffee, label: "Remote First" },
  { icon: TrendingUp, label: "Fast Growth" },
  { icon: Globe, label: "12+ Countries" },
  { icon: Users, label: "Elite Team" },
  { icon: Sparkles, label: "AI Toolset" },
  { icon: Heart, label: "Health Cover" },
];

const DEPT_COLORS: Record<string, string> = {
  Engineering: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  Product: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Operations: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Marketing: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  Sales: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Design: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
};

export default function Careers() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  useEffect(() => { setJobs(getJobs()); }, []);

  const departments = ["All", ...new Set(jobs.map(j => j.department))];

  const filteredJobs = jobs.filter(j => {
    const q = search.toLowerCase();
    const matchesSearch = j.title.toLowerCase().includes(q) || j.description.toLowerCase().includes(q) || j.department.toLowerCase().includes(q);
    const matchesDept = selectedDept === "All" || j.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container-wide relative z-10">
          <div className="max-w-4xl mx-auto text-center px-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[11px] font-black uppercase tracking-[0.2em] mb-6 border border-primary/20">
              <Terminal className="w-3.5 h-3.5" /> Join the Industrial Evolution
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="font-heading text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-6">
              Build the{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%] animate-gradient">
                Future
              </span>{" "}
              of Global Trade
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed mb-10">
              We're architecting the world's most sophisticated B2B network. From logistics to AI-driven procurement, we need the boldest minds.
            </motion.p>

            {/* Perks row */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-2 mb-10">
              {PERKS.map(p => (
                <div key={p.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-xs font-bold text-muted-foreground">
                  <p.icon className="w-3.5 h-3.5 text-primary" /> {p.label}
                </div>
              ))}
            </motion.div>

            {/* Search bar */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="flex flex-col sm:flex-row gap-3 p-2 bg-card border border-border rounded-2xl shadow-xl max-w-2xl mx-auto">
              <div className="flex-1 flex items-center gap-3 px-4 py-2">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input type="text" placeholder="Search roles..." value={search} onChange={e => setSearch(e.target.value)}
                  className="bg-transparent outline-none w-full text-sm font-semibold placeholder:text-muted-foreground/50" />
              </div>
              <div className="flex items-center gap-3 px-4 py-2 border-t sm:border-t-0 sm:border-l border-border sm:min-w-[160px]">
                <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
                <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)}
                  className="bg-transparent outline-none w-full text-sm font-bold cursor-pointer">
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <Button className="h-12 px-8 rounded-xl gradient-primary text-white font-black text-xs tracking-widest border-none shadow-lg shrink-0">
                Search
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CULTURE PILLARS ───────────────────────────────── */}
      <section className="py-20 md:py-28 bg-muted/20 border-b border-border">
        <div className="container-wide px-4">
          <div className="text-center mb-14">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-3">Why ZenzeTrade</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-black tracking-tight">Our Culture Protocol</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className={`p-7 rounded-3xl bg-gradient-to-br ${p.color} border border-border group cursor-default`}>
                <div className={`w-12 h-12 rounded-2xl bg-background/80 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm`}>
                  <p.icon className={`w-6 h-6 ${p.iconColor}`} />
                </div>
                <h3 className="font-black text-lg text-foreground mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOB LISTINGS ──────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="container-wide px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Live Opportunities</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-black tracking-tight">
                Open Roles <span className="text-muted-foreground/40">({filteredJobs.length})</span>
              </h2>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl shrink-0">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600">Actively Hiring</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <AnimatePresence>
              {filteredJobs.map((job, i) => {
                const deptColor = DEPT_COLORS[job.department] || "bg-primary/10 text-primary border-primary/20";
                const isExpanded = expandedJob === job.id;
                return (
                  <motion.div key={job.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: i * 0.05 }}
                    className="group bg-card border border-border rounded-3xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-400">

                    {/* Card top */}
                    <div className="p-6 sm:p-8">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${deptColor}`}>
                            {job.department}
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-muted text-muted-foreground text-[10px] font-black uppercase tracking-widest border border-border">
                            {job.type}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest mb-0.5">Package</p>
                          <p className="text-sm font-black text-foreground">{job.salary}</p>
                        </div>
                      </div>

                      <h3 className="font-heading text-xl sm:text-2xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors mb-3">
                        {job.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-semibold mb-5">
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{job.description}</p>
                    </div>

                    {/* Expanded requirements */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden border-t border-border">
                          <div className="px-6 sm:px-8 py-5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Requirements</p>
                            <div className="space-y-2">
                              {(job.requirements || []).map((req, ri) => (
                                <div key={ri} className="flex items-start gap-2 text-sm text-foreground/80">
                                  <ChevronRight className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                                  <span>{req}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Card footer */}
                    <div className="px-6 sm:px-8 py-5 border-t border-border flex items-center justify-between gap-4 bg-muted/20">
                      <button onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                        className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                        {isExpanded ? "Show less ↑" : "View details ↓"}
                      </button>
                      <Button className="h-10 px-6 rounded-xl gradient-primary text-white font-black text-[10px] tracking-widest border-none shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                        Apply Now <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredJobs.length === 0 && (
              <div className="col-span-full py-28 text-center bg-muted/20 rounded-3xl border border-dashed border-border">
                <Briefcase className="w-16 h-16 text-muted-foreground/20 mx-auto mb-5" />
                <h3 className="text-xl font-black text-muted-foreground/40 mb-2">No matching roles</h3>
                <p className="text-sm text-muted-foreground/60">Try adjusting your search or department filter.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ───────────────────────────────────── */}
      <section className="py-20 md:py-28 border-t border-border bg-card/50">
        <div className="container-wide px-4">
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-14 md:p-20 text-white overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(124,58,237,0.15)_0%,transparent_60%)]" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/10 blur-[100px] rounded-full" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-primary text-[11px] font-black uppercase tracking-widest mb-6">
                  <Sparkles className="w-4 h-4" /> Strategic Talent Pool
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-5">
                  Can't find your <span className="text-primary">perfect role?</span>
                </h2>
                <p className="text-base text-white/60 font-medium leading-relaxed mb-8">
                  We're always looking for exceptional talent. Submit your profile to our strategic talent pool and we'll reach out when the right mission opens up.
                </p>
                <Button className="h-14 px-10 rounded-2xl bg-white text-slate-900 font-black uppercase tracking-[0.15em] text-xs hover:bg-primary hover:text-white transition-all shadow-2xl hover:scale-105 active:scale-95">
                  Submit General Application <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4 shrink-0 w-full lg:w-auto lg:max-w-xs">
                {[
                  { val: "100%", label: "Remote First" },
                  { val: "12+", label: "Active Sectors" },
                  { val: "₹0", label: "Commute Cost" },
                  { val: "Elite", label: "Only Protocol" },
                ].map(s => (
                  <div key={s.label} className="aspect-square rounded-2xl bg-white/5 border border-white/10 p-5 flex flex-col justify-end hover:bg-white/10 transition-all">
                    <p className="text-2xl sm:text-3xl font-black tracking-tighter mb-1">{s.val}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
