import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import { Search, Send, Handshake, TrendingUp, CheckCircle2 } from "lucide-react";

const steps = [
  {
    id: "01",
    icon: Search,
    title: "Search & Discover",
    desc: "Browse through an extensive, curated directory of thousands of verified industrial suppliers and high-quality products across India. Filter by category, location, and ratings.",
    features: ["Verified Suppliers", "Thousands of Products", "Smart Filtering"],
    color: "from-blue-600 to-cyan-500",
    shadow: "shadow-blue-500/10"
  },
  {
    id: "02",
    icon: Send,
    title: "Send Inquiry",
    desc: "Found the perfect product? Instantly submit your specific requirements. Get competitive quotes directly from multiple top-rated sellers tailored to your needs.",
    features: ["Instant RFPs", "Competitive Quotes", "Tailored Responses"],
    color: "from-primary to-purple-600",
    shadow: "shadow-primary/10"
  },
  {
    id: "03",
    icon: Handshake,
    title: "Connect & Negotiate",
    desc: "Engage seamlessly with sellers through our secure platform. Compare your quotes, negotiate pricing, and clarify terms to ensure you get the absolute best deal.",
    features: ["Direct Chat", "Secure Messaging", "Quote Comparison"],
    color: "from-pink-600 to-rose-500",
    shadow: "shadow-pink-500/10"
  },
  {
    id: "04",
    icon: TrendingUp,
    title: "Grow Your Business",
    desc: "Finalize deals securely and build long-term, trusted business relationships. Scale your operations efficiently with a reliable supply chain behind you.",
    features: ["Long-term Partnerships", "Scalable Sourcing", "Trusted Growth"],
    color: "from-orange-500 to-amber-500",
    shadow: "shadow-orange-500/10"
  },
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-surface relative overflow-hidden" ref={containerRef}>
      {/* Exquisite Architectural Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] rounded-full bg-primary/5 blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
      <div className="absolute bottom-[10%] right-[5%] w-[40rem] h-[40rem] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

      <div className="container-wide relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Superior Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-surface-elevated border shadow-sm mb-8 hover:shadow-md transition-shadow cursor-default"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-foreground/80">
              The Process
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-8 tracking-tight font-heading leading-[1.1]"
          >
            Sourcing Reimagined.<br />
            <span className="text-transparent bg-clip-text gradient-primary relative inline-block mt-2">
              Simplified for You.
              <svg className="absolute w-full h-4 -bottom-3 left-0 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto"
          >
            We've revolutionized B2B trade into a seamless journey. Follow these four definitive steps to unlock your business's true potential.
          </motion.p>
        </div>

        {/* Breathtaking Alternating Timeline Layout */}
        <div className="relative">
          {/* Main Desktop Timeline Background Line */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-1 -translate-x-1/2 bg-border/40 rounded-full" />

          {/* Animated Glowing Progress Line (Reacts to Scroll) */}
          <motion.div
            className="hidden md:block absolute left-1/2 top-4 bottom-4 w-1 -translate-x-1/2 bg-gradient-to-b from-blue-500 via-primary to-orange-500 rounded-full origin-top z-0 shadow-[0_0_15px_rgba(var(--primary),0.3)]"
            style={{ scaleY: scrollYProgress }}
          />

          <div className="space-y-0 md:space-y-24">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;

              return (
                <div key={step.id} className="relative flex flex-col md:flex-row items-center justify-center w-full group">

                  {/* Timeline Desktop Node (Middle) */}
                  <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-surface-elevated border-[6px] border-surface shadow-xl items-center justify-center z-20 group-hover:scale-[1.15] transition-all duration-500 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-10 group-hover:opacity-100 transition-opacity duration-500`} />
                    <step.icon className="w-6 h-6 text-foreground group-hover:text-white relative z-10 transition-colors duration-500" />
                  </div>

                  {/* Desktop Alternating Containers */}
                  <div className="hidden md:flex w-full items-center">
                    <div className={`w-1/2 flex justify-end ${isEven ? 'pr-16 lg:pr-24' : ''}`}>
                      {isEven && (
                        <motion.div
                          initial={{ opacity: 0, x: -30, y: 15 }}
                          whileInView={{ opacity: 1, x: 0, y: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ type: "spring", damping: 22, stiffness: 85 }}
                          className="w-full max-w-xl relative"
                        >
                          <StepCard step={step} alignment="right" />
                        </motion.div>
                      )}
                    </div>
                    <div className={`w-1/2 flex justify-start ${!isEven ? 'pl-16 lg:pl-24' : ''}`}>
                      {!isEven && (
                        <motion.div
                          initial={{ opacity: 0, x: 30, y: 15 }}
                          whileInView={{ opacity: 1, x: 0, y: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ type: "spring", damping: 22, stiffness: 85 }}
                          className="w-full max-w-xl relative"
                        >
                          <StepCard step={step} alignment="left" />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="md:hidden flex flex-col items-center w-full relative pt-6 pb-12">
                    {/* Mobile central dotted line piece */}
                    {index !== steps.length - 1 && <div className="absolute top-20 bottom-[-1.5rem] w-0.5 bg-gradient-to-b from-border to-border/50" />}

                    <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br ${step.color} text-white shadow-xl shadow-primary/20 mx-auto relative z-10 mb-8 border-[6px] border-surface bg-surface`}>
                      <step.icon className="w-6 h-6" />
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ type: "spring", damping: 20, stiffness: 90 }}
                      className="w-full relative px-2"
                    >
                      <StepCard step={step} alignment="left" />
                    </motion.div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

function StepCard({ step, alignment }: { step: any, alignment: "left" | "right" }) {
  return (
    <div className={`p-8 md:p-10 rounded-[2.5rem] bg-surface-elevated border border-border/60 shadow-lg hover:shadow-2xl ${step.shadow} transition-all duration-500 relative overflow-hidden group/card`}>
      {/* Background Hover Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover/card:opacity-[0.03] transition-opacity duration-700 pointer-events-none`} />

      {/* Elegantly positioned Number Identifier */}
      <div
        className={`absolute -top-4 ${alignment === "right" ? "-left-4 text-left" : "-right-4 text-right"} text-8xl md:text-9xl font-black text-foreground/[0.03] dark:text-foreground/[0.05] group-hover/card:text-foreground/[0.06] pointer-events-none font-heading select-none transition-transform duration-700 ${alignment === "right" ? "group-hover/card:translate-x-4" : "group-hover/card:-translate-x-4"} group-hover/card:translate-y-4`}
      >
        {step.id}
      </div>

      <div className={`relative z-10 flex flex-col ${alignment === "right" ? "md:items-end md:text-right" : "md:items-start md:text-left"} items-start text-left`}>
        <motion.div
          className="w-14 h-14 md:hidden rounded-2xl flex items-center justify-center mb-6 bg-surface shadow-sm border"
        >
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} opacity-20 absolute`} />
          <step.icon className="w-6 h-6 text-foreground relative z-10" />
        </motion.div>

        <h3 className="text-3xl font-heading font-extrabold text-foreground mb-4">
          <span className={`text-transparent bg-clip-text bg-gradient-to-r ${step.color}`}>
            {step.title.split(' ')[0]}
          </span>{' '}
          {step.title.split(' ').slice(1).join(' ')}
        </h3>

        <p className="text-muted-foreground text-lg leading-relaxed mb-8 font-medium">
          {step.desc}
        </p>

        <div className={`space-y-4 flex flex-col ${alignment === "right" ? "md:items-end" : "md:items-start"} items-start`}>
          {step.features.map((feature: string, idx: number) => (
            <div key={idx} className={`flex items-center gap-3 ${alignment === "right" ? "md:flex-row-reverse" : "flex-row"} flex-row group/feature`}>
              <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-sm ring-2 ring-transparent group-hover/feature:ring-primary/20 transition-all`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-foreground font-semibold tracking-wide">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
