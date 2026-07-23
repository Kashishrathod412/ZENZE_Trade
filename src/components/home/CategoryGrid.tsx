import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Factory, Cpu, Laptop, Gamepad2, Trophy, Smartphone, Shirt, Home,
  PenTool, Briefcase, Car, FlaskConical, Wheat, HardHat, HeartPulse,
  Dog, Truck, Gift, Shield, Scissors, Settings, Nut, Pipette,
  Sun, Construction, Brush, ShoppingBag, Wind, Layers, Waves,
  Wrench, Utensils, Presentation, Palmtree, Printer, Zap
} from "lucide-react";

const allCategories = [
  { name: "Industrial & Machinery", icon: Factory, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
  { name: "Electrical & Electronics", icon: Cpu, color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/20" },
  { name: "Computers & IT Products", icon: Laptop, color: "text-indigo-500", bg: "bg-indigo-500/10 border-indigo-500/20" },
  { name: "Gaming & Accessories", icon: Gamepad2, color: "text-pink-500", bg: "bg-pink-500/10 border-pink-500/20" },
  { name: "Sports & Fitness", icon: Trophy, color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20" },
  { name: "Consumer Electronics", icon: Smartphone, color: "text-cyan-500", bg: "bg-cyan-500/10 border-cyan-500/20" },
  { name: "Clothing & Fashion", icon: Shirt, color: "text-rose-500", bg: "bg-rose-500/10 border-rose-500/20" },
  { name: "Home, Kitchen & Furniture", icon: Home, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" },
  { name: "Stationery & Office Supplies", icon: PenTool, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { name: "Office & Commercial Equipment", icon: Briefcase, color: "text-slate-500", bg: "bg-slate-500/10 border-slate-500/20" },
  { name: "Automobile & Parts", icon: Car, color: "text-red-500", bg: "bg-red-500/10 border-red-500/20" },
  { name: "Chemicals & Raw Materials", icon: FlaskConical, color: "text-lime-600", bg: "bg-lime-500/10 border-lime-500/20" },
  { name: "Agriculture & Farming", icon: Wheat, color: "text-yellow-600", bg: "bg-yellow-500/10 border-yellow-500/20" },
  { name: "Construction & Building Materials", icon: HardHat, color: "text-orange-600", bg: "bg-orange-600/10 border-orange-600/20" },
  { name: "Beauty & Personal Care", icon: HeartPulse, color: "text-pink-600", bg: "bg-pink-600/10 border-pink-600/20" },
  { name: "Pets & Animal Supplies", icon: Dog, color: "text-violet-500", bg: "bg-violet-500/10 border-violet-500/20" },
  { name: "Packaging & Logistics", icon: Truck, color: "text-blue-600", bg: "bg-blue-600/10 border-blue-600/20" },
  { name: "Toys, Gifts & Baby Products", icon: Gift, color: "text-rose-400", bg: "bg-rose-400/10 border-rose-400/20" },
  { name: "Safety & Security", icon: Shield, color: "text-red-600", bg: "bg-red-600/10 border-red-600/20" },
  { name: "Textile & Fabric Industry", icon: Scissors, color: "text-fuchsia-500", bg: "bg-fuchsia-500/10 border-fuchsia-500/20" },
  { name: "Manufacturing & Production Equipment", icon: Settings, color: "text-teal-500", bg: "bg-teal-500/10 border-teal-500/20" },
  { name: "Fasteners & Hardware Components", icon: Nut, color: "text-slate-600", bg: "bg-slate-600/10 border-slate-600/20" },
  { name: "Pumps, Pipes & Fittings", icon: Pipette, color: "text-sky-500", bg: "bg-sky-500/10 border-sky-500/20" },
  { name: "Renewable Energy & Solar", icon: Sun, color: "text-yellow-500", bg: "bg-yellow-400/10 border-yellow-400/20" },
  { name: "Industrial Safety & PPE", icon: Construction, color: "text-orange-700", bg: "bg-orange-700/10 border-orange-700/20" },
  { name: "Cleaning & Maintenance Equipment", icon: Brush, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
  { name: "Bags, Packaging & Storage", icon: ShoppingBag, color: "text-emerald-600", bg: "bg-emerald-600/10 border-emerald-600/20" },
  { name: "HVAC & Cooling Systems", icon: Wind, color: "text-blue-400", bg: "bg-blue-300/10 border-blue-300/20" },
  { name: "Tiles, Marble & Stone", icon: Layers, color: "text-stone-500", bg: "bg-stone-500/10 border-stone-500/20" },
  { name: "Plastic & Rubber Products", icon: Waves, color: "text-sky-600", bg: "bg-sky-600/10 border-sky-600/20" },
  { name: "Repair & Maintenance Tools", icon: Wrench, color: "text-neutral-600", bg: "bg-neutral-600/10 border-neutral-600/20" },
  { name: "Hospitality & Restaurant Equipment", icon: Utensils, color: "text-amber-600", bg: "bg-amber-600/10 border-amber-600/20" },
  { name: "Event & Exhibition Equipment", icon: Presentation, color: "text-indigo-600", bg: "bg-indigo-600/10 border-indigo-600/20" },
  { name: "Handicrafts & Handmade Products", icon: Palmtree, color: "text-green-600", bg: "bg-green-600/10 border-green-600/20" },
  { name: "Printing Consumables & Office Tech", icon: Printer, color: "text-slate-400", bg: "bg-slate-400/10 border-slate-400/20" },
  { name: "Tech Gadgets", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10 border-yellow-500/20" },
];

const row1 = allCategories.slice(0, 18);
const row2 = allCategories.slice(18);

function CategoryPill({ cat }: { cat: typeof allCategories[0] }) {
  const Icon = cat.icon;
  return (
    <Link
      to={`/products?category=${encodeURIComponent(cat.name)}`}
      className={`inline-flex items-center gap-3 px-5 py-3 rounded-2xl border ${cat.bg} hover:scale-105 transition-transform duration-300 ease-out group shrink-0 mx-2 cursor-pointer will-change-transform`}
      style={{ transform: "translate3d(0,0,0)", willChange: "transform" }}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-white/60 dark:bg-black/20 group-hover:rotate-6 transition-transform duration-300 shrink-0`}>
        <Icon className={`w-5 h-5 ${cat.color}`} />
      </div>
      <span className={`text-sm font-black uppercase tracking-wider whitespace-nowrap ${cat.color} opacity-80 group-hover:opacity-100 transition-opacity duration-300`}>
        {cat.name}
      </span>
    </Link>
  );
}

function InfiniteRow({
  items,
  direction = "left",
  duration = 40,
}: {
  items: typeof allCategories;
  direction?: "left" | "right";
  duration?: number;
}) {
  const doubled = [...items, ...items];
  const animationClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div
      className="relative overflow-hidden w-full py-2"
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
        maskImage:
          "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
      }}
    >
      <div
        className={`flex items-center ${animationClass}`}
        style={{
          width: "max-content",
          "--duration": `${duration}s`,
        } as React.CSSProperties}
      >
        {doubled.map((cat, i) => (
          <CategoryPill key={`${cat.name}-${i}`} cat={cat} />
        ))}
      </div>
    </div>
  );
}

export default function CategoryGrid() {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <style>{`
        @keyframes marquee-left {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes marquee-right {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .animate-marquee-left {
          will-change: transform;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
          animation: marquee-left var(--duration, 100s) linear infinite;
        }
        .animate-marquee-right {
          will-change: transform;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
          animation: marquee-right var(--duration, 120s) linear infinite;
        }
        .animate-marquee-left:hover,
        .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>
      {/* Decorative blobs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="container-wide relative z-10 text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-5 py-2 mb-6 text-xs font-black uppercase tracking-[0.2em] text-primary bg-primary/5 rounded-full border border-primary/15"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Industries & Categories
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05, duration: 0.45 }}
          className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-4 leading-tight"
        >
          Connect Across{" "}
          <span className="text-gradient">36+ Elite Industries</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg leading-relaxed"
        >
          India's most comprehensive B2B & B2C marketplace — bridging manufacturers, suppliers & buyers across every industry.
        </motion.p>
      </div>

      {/* Infinite marquee rows */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="flex flex-col gap-4 relative z-10"
      >
        {/* Row 1 — scrolls left */}
        <InfiniteRow items={row1} direction="left" duration={100} />

        {/* Row 2 — scrolls right */}
        <InfiniteRow items={row2} direction="right" duration={120} />
      </motion.div>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="mt-10 container-wide flex flex-wrap items-center justify-center gap-6 relative z-10"
      >
        {["36+ Industries", "50,000+ Verified Suppliers", "1,20,000+ Products", "B2B & B2C Ready"].map((item) => (
          <div key={item} className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
            <span className="text-xs sm:text-sm font-black uppercase tracking-[0.1em] text-muted-foreground">
              {item}
            </span>
          </div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mt-10 text-center relative z-10"
      >
        <Link to="/categories">
          <Button
            variant="outline"
            className="rounded-2xl px-10 h-12 font-black text-sm uppercase tracking-widest border-2 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
          >
            Explore All 36+ Industries
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
