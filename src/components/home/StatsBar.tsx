import { motion, useInView, useMotionValue, useSpring, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { getUsers, getProducts, getInquiries } from "@/lib/storage";
import { Users, Package, TrendingUp, MapPin } from "lucide-react";

// Animated counter that counts up from 0 to target when in view
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inViewRef = useRef<HTMLDivElement>(null);
  const inView = useInView(inViewRef, { once: true, margin: "-50px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (inView && !hasAnimated.current && ref.current) {
      hasAnimated.current = true;
      const node = ref.current;
      const controls = animate(0, value, {
        duration: 1.1,
        ease: [0.16, 1, 0.3, 1],
        onUpdate(latest) {
          node.textContent = Math.floor(latest).toLocaleString("en-IN") + suffix;
        },
      });
      return () => controls.stop();
    }
  }, [inView, value, suffix]);

  return (
    <div ref={inViewRef}>
      <span ref={ref}>0{suffix}</span>
    </div>
  );
}

export default function StatsBar() {
  const users = getUsers();
  const products = getProducts();
  const inquiries = getInquiries();

  const stats = [
    {
      icon: Users,
      value: 50000,
      suffix: "+",
      label: "Registered Businesses",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Package,
      value: 120000,
      suffix: "+",
      label: "Products Listed",
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      icon: TrendingUp,
      value: 80000,
      suffix: "+",
      label: "Leads Generated",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      icon: MapPin,
      value: 500,
      suffix: "+",
      label: "Cities Covered",
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
  ];

  return (
    <section className="py-14 bg-card border-y border-border relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-accent/3 pointer-events-none" />

      <div className="container-wide relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center group"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>

              {/* Animated Number */}
              <div className={`font-heading text-3xl md:text-4xl lg:text-5xl font-black ${s.color} leading-none mb-2`}>
                <AnimatedNumber value={s.value} suffix={s.suffix} />
              </div>

              {/* Label */}
              <p className="text-xs md:text-sm font-black uppercase tracking-widest text-muted-foreground leading-tight">
                {s.label}
              </p>

              {/* Bottom accent line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 + 0.4, duration: 0.6 }}
                className={`mt-3 h-0.5 w-10 rounded-full ${s.bg.replace("/10", "")} opacity-40 origin-left`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
