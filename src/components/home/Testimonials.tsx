import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronRight, ChevronLeft, Plus, X, Send } from "lucide-react";
import { useRef, useEffect, useState } from "react";

const testimonials = [
  {
    name: "Rajesh Patel",
    role: "CEO, Patel Industries",
    text: "ZenzeTrade helped us find reliable suppliers and grow our manufacturing business by 3x in just one year. The platform's ease of use and verified network is simply unmatched in India.",
    rating: 5,
    gradient: "from-blue-600 to-cyan-500"
  },
  {
    name: "Priya Sharma",
    role: "Procurement Head, ShopEasy",
    text: "The elite lead system is incredible. We receive quality inquiries daily and our conversion rate has never been better. Highly recommend to any serious enterprise looking to scale rapidly.",
    rating: 5,
    gradient: "from-primary to-purple-600"
  },
  {
    name: "Amit Kumar",
    role: "Founder, AgriTech Solutions",
    text: "As a small business, getting verified on ZenzeTrade gave us instant credibility and opened doors to massive enterprise clients we could never reach before. Our revenue has doubled.",
    rating: 5,
    gradient: "from-orange-500 to-amber-500"
  },
  {
    name: "Vikram Singh",
    role: "Director, Singh Exports",
    text: "We transitioned our entire B2B sourcing model to this platform. The verified badges and seamless UI make finding trustworthy partners completely effortless and highly rewarding.",
    rating: 5,
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    name: "Neha Gupta",
    role: "Operations Manager, Global Traders",
    text: "The sheer volume of high-intent leads we get is staggering. The built-in messaging system makes negotiations fast, professional, and easily trackable. A true industry game-changer.",
    rating: 5,
    gradient: "from-rose-500 to-pink-500"
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 15 },
  show: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 110,
    }
  }
};

export default function Testimonials() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scroll("right");
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Lock body scrolling when the testimonial submission modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  return (
    <section className="py-24 md:py-32 bg-surface relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-muted/30 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Glow Orbs */}
      <div className="absolute top-[20%] right-[10%] w-[30rem] h-[30rem] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[10%] w-[30rem] h-[30rem] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="container-wide relative z-10 overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 md:mb-16 gap-8 px-4">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-elevated border shadow-sm font-semibold text-xs mb-8 uppercase tracking-wider text-foreground ring-1 ring-border/50"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Success Stories
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight"
            >
              Trusted by <span className="text-transparent bg-clip-text gradient-primary relative inline-block">Market Leaders
                <svg className="absolute w-full h-3 -bottom-2 left-0 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="3" />
                </svg>
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg md:text-xl leading-relaxed"
            >
              See how elite businesses are transforming their sourcing and sales operations with ZenzeTrade's network.
            </motion.p>
          </div>

          {/* Action Area (Add Review + Arrows) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 lg:mb-2 w-full md:w-auto mt-6 md:mt-0 justify-between md:justify-end"
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Add Review
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-12 h-12 rounded-full bg-surface border shadow-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-md hover:scale-105 transition-all group active:scale-95"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="w-6 h-6 group-active:-translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-12 h-12 rounded-full bg-surface border shadow-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-md hover:scale-105 transition-all group active:scale-95"
                aria-label="Next Testimonial"
              >
                <ChevronRight className="w-6 h-6 group-active:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* CSS Native Carousel Container */}
        <div className="relative -mx-4 px-4 pb-12 pt-4 group">
          <motion.div
            ref={scrollRef}
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="flex overflow-x-auto gap-6 sm:gap-8 pb-8 snap-x snap-mandatory scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                variants={cardVariants}
                className="group/card flex-shrink-0 w-[85vw] sm:w-[500px] lg:w-[450px] snap-center sm:snap-start"
              >
                <div className="h-full w-full rounded-2xl bg-card border border-border/60 p-6 md:p-8 relative overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                  <div className="relative z-10 flex flex-col flex-1">
                    {/* Tweet Header: Avatar, Name, and Role */}
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-border/50 flex items-center justify-center text-lg font-bold shadow-sm flex-shrink-0">
                        {t.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-heading font-bold text-foreground text-lg group-hover/card:text-primary transition-colors leading-snug truncate">
                          {t.name}
                        </p>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
                          {t.role}
                        </p>
                      </div>
                    </div>

                    {/* Star Rating Directly Below Header */}
                    <div className="flex gap-1 mb-5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star 
                          key={j} 
                          className={`w-4 h-4 ${j < t.rating ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`} 
                        />
                      ))}
                    </div>

                    {/* Quote Text at the Bottom */}
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-medium italic mt-auto">
                      "{t.text}"
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <style>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>

      </div>

      {/* Glassmorphism Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm"
            />

            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-lg bg-white dark:bg-slate-950 border-2 border-border/50 shadow-2xl rounded-3xl overflow-hidden pointer-events-auto flex flex-col relative"
              >
                {/* Glow behind modal */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-primary to-orange-500" />

                {/* Modal Header */}
                <div className="px-6 py-6 border-b border-border/50 bg-slate-50 dark:bg-slate-900/50 flex items-start justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-2xl text-foreground">Share Your Experience</h3>
                    <p className="text-sm text-muted-foreground mt-1 font-medium">Your feedback empowers thousands of B2B buyers.</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mt-1">
                    <X className="w-4 h-4 text-foreground" />
                  </button>
                </div>

                {/* Modal Body (Form) */}
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">Overall Rating</label>
                    <div className="flex gap-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="transition-all outline-none"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                        >
                          <Star
                            className={`w-10 h-10 transition-all ${star <= (hoverRating || rating)
                                ? "fill-accent text-accent scale-110"
                                : "text-slate-300 dark:text-slate-600 hover:scale-110 hover:text-accent/50"
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">Full Name</label>
                      <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-foreground" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">Company & Role</label>
                      <input type="text" placeholder="CEO, TechCorp" className="w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-foreground" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">Your Review</label>
                    <textarea rows={4} placeholder="Tell us how ZenzeTrade helped your business..." className="w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none font-medium text-foreground" />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-5 border-t border-border/50 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
                  <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-border transition-colors">Cancel</button>
                  <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5">
                    Submit Review
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </section>
  );
}
