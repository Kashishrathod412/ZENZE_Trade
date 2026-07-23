import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Shield, Globe, Award, Database } from "lucide-react";

export default function CTABanner() {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 95,
        staggerChildren: 0.08,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 20, stiffness: 100 }
    }
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-surface">
      <div className="container-wide relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 flex flex-col lg:flex-row min-h-[480px]"
        >
          {/* Left Column: Dark Slate Content Panel */}
          <div className="w-full lg:w-[55%] p-8 sm:p-12 lg:p-16 flex flex-col justify-center items-start text-left relative z-10">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-bold uppercase tracking-wider text-accent bg-accent/5 rounded-sm border border-accent/10"
            >
              <Zap className="w-3.5 h-3.5 fill-accent" />
              The Future of B2B Trade
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight"
            >
              Ready to <span className="text-accent">Scale</span> Your Business?
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-slate-400 text-base sm:text-lg mb-8 max-w-lg leading-relaxed"
            >
              Join <span className="text-white font-bold underline decoration-accent decoration-2 underline-offset-4">50,000+ elite</span> business leaders on ZenzeTrade and start capturing high-intent leads instantly.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link to="/seller/register" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-3.5 rounded-sm bg-accent text-slate-950 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors duration-250 shadow-lg">
                  Launch Store <Zap className="w-4 h-4 fill-current" />
                </button>
              </Link>

              <Link to="/pricing" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-3.5 rounded-sm bg-transparent border-2 border-slate-700 hover:border-slate-500 hover:bg-slate-900 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors duration-250">
                  Partner Pricing
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Premium Isometric & Geometric Mockup Representation */}
          <div className="w-full lg:w-[45%] bg-slate-900/40 p-8 sm:p-12 flex items-center justify-center border-t lg:border-t-0 lg:border-l border-slate-800/80 relative overflow-hidden select-none">
            {/* Subtle background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),transparent_70%)] pointer-events-none" />
            
            {/* Decorative background grid line structure */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-sm bg-slate-950/80 border border-slate-800 rounded-lg p-6 shadow-2xl relative z-10"
            >
              {/* Mockup Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-accent" /> ZENZE NETWORKS
                </div>
              </div>

              {/* Mockup Body: Network Node Representation */}
              <div className="space-y-4">
                {/* Node Row 1 */}
                <div className="flex items-center justify-between p-3 rounded-sm bg-slate-900/50 border border-slate-800/60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-sm bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">Global Connectivity</p>
                      <p className="text-[10px] text-slate-500">Cross-border verified routes</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/5 px-2 py-0.5 border border-emerald-500/10 rounded-sm">
                    ONLINE
                  </span>
                </div>

                {/* Node Row 2 */}
                <div className="flex items-center justify-between p-3 rounded-sm bg-slate-900/50 border border-slate-800/60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">Zero-Trust Verification</p>
                      <p className="text-[10px] text-slate-500">100% authenticated sellers</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 border border-primary/10 rounded-sm">
                    ACTIVE
                  </span>
                </div>

                {/* Node Row 3 */}
                <div className="flex items-center justify-between p-3 rounded-sm bg-slate-900/50 border border-slate-800/60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-sm bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">Smart Storage Ledger</p>
                      <p className="text-[10px] text-slate-500">Real-time local synchronization</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/5 px-2 py-0.5 border border-amber-500/10 rounded-sm">
                    SYNCED
                  </span>
                </div>
              </div>

              {/* Graphic Connector line art */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[radial-gradient(circle_at_100%_100%,rgba(250,204,21,0.06),transparent_80%)] rounded-full" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
