import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import {
  Factory, Cpu, Laptop, Gamepad2, Trophy, Smartphone, Shirt, Home,
  PenTool, Briefcase, Car, FlaskConical, Wheat, HardHat, HeartPulse,
  Dog, Truck, Gift, Shield, Scissors, Settings, Nut, Pipette,
  Sun, Construction, Brush, ShoppingBag, Wind, Layers, Waves,
  Wrench, Utensils, Presentation, Palmtree, Printer, Zap
} from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  { name: "Industrial & Machinery", icon: Factory, desc: "Manufacturing, tools & equipment" },
  { name: "Electrical & Electronics", icon: Cpu, desc: "Components, circuits & devices" },
  { name: "Computers & IT Products", icon: Laptop, desc: "Hardware, software & networking" },
  { name: "Gaming & Accessories", icon: Gamepad2, desc: "Consoles, peripherals & gear" },
  { name: "Sports & Fitness", icon: Trophy, desc: "Equipment, apparel & supplements" },
  { name: "Consumer Electronics", icon: Smartphone, desc: "Mobiles, audio & home tech" },
  { name: "Clothing & Fashion", icon: Shirt, desc: "Apparel, footwear & accessories" },
  { name: "Home, Kitchen & Furniture", icon: Home, desc: "Decor, appliances & fittings" },
  { name: "Stationery & Office Supplies", icon: PenTool, desc: "Paper, pens & office essentials" },
  { name: "Office & Commercial Equipment", icon: Briefcase, desc: "Furniture, tech & solutions" },
  { name: "Automobile & Parts", icon: Car, desc: "Vehicles, spares & accessories" },
  { name: "Chemicals & Raw Materials", icon: FlaskConical, desc: "Industrial & specialty chemicals" },
  { name: "Agriculture & Farming", icon: Wheat, desc: "Seeds, crops & farm tech" },
  { name: "Construction & Building Materials", icon: HardHat, desc: "Steel, cement & architecture" },
  { name: "Beauty & Personal Care", icon: HeartPulse, desc: "Cosmetics, wellness & grooming" },
  { name: "Pets & Animal Supplies", icon: Dog, desc: "Food, toys & pet care" },
  { name: "Packaging & Logistics", icon: Truck, desc: "Solutions, shipping & storage" },
  { name: "Toys, Gifts & Baby Products", icon: Gift, desc: "Fun, celebration & parenting" },
  { name: "Safety & Security", icon: Shield, desc: "Surveillance, PPE & protection" },
  { name: "Textile & Fabric Industry", icon: Scissors, desc: "Threads, looms & industry" },
  { name: "Manufacturing & Production Equipment", icon: Settings, desc: "Production lines & systems" },
  { name: "Fasteners & Hardware Components", icon: Nut, desc: "Nuts, bolts & industry parts" },
  { name: "Pumps, Pipes & Fittings", icon: Pipette, desc: "Fluid handling systems" },
  { name: "Renewable Energy & Solar", icon: Sun, desc: "Panels, wind & green energy" },
  { name: "Industrial Safety & PPE", icon: Construction, desc: "Workplace protection gear" },
  { name: "Cleaning & Maintenance Equipment", icon: Brush, desc: "Industrial & home cleaning" },
  { name: "Bags, Packaging & Storage", icon: ShoppingBag, desc: "Carry solutions & storage" },
  { name: "HVAC & Cooling Systems", icon: Wind, desc: "Air conditioning & filtration" },
  { name: "Tiles, Marble & Stone", icon: Layers, desc: "Flooring & stone industry" },
  { name: "Plastic & Rubber Products", icon: Waves, desc: "Molded parts & raw materials" },
  { name: "Repair & Maintenance Tools", icon: Wrench, desc: "Hand & power tool kits" },
  { name: "Hospitality & Restaurant Equipment", icon: Utensils, desc: "Professional kitchen gear" },
  { name: "Event & Exhibition Equipment", icon: Presentation, desc: "Banners, stages & tech" },
  { name: "Handicrafts & Handmade Products", icon: Palmtree, desc: "Artisan crafts & local art" },
  { name: "Printing Consumables & Office Tech", icon: Printer, desc: "Ink, toners & digital systems" },
  { name: "Tech Gadgets", icon: Zap, desc: "Innovation & smart accessories" }
];

export default function Categories() {
  return (
    <Layout>
      <div className="bg-muted/30 py-20 border-b border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        </div>
        <div className="container-wide text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-foreground"
          >
            All <span className="text-gradient">Categories</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto"
          >
            Explore our massive catalogue across 36+ verified industrial and retail categories across India.
          </motion.p>
        </div>
      </div>
      <div className="container-wide py-16 md:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.02 }}
            >
              <Link
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-start rounded-3xl border border-border bg-card p-8 hover:shadow-2xl hover:border-primary/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
              >
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-150 transition-transform duration-700">
                  <cat.icon className="w-24 h-24 text-primary" />
                </div>
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500 zenze-shadow">
                  <cat.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-heading font-black text-foreground text-xl leading-tight mb-2 group-hover:text-primary transition-colors">{cat.name}</h3>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{cat.desc}</p>
                <div className="mt-auto flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest group-hover:gap-4 transition-all">
                  Browse Industry <Zap className="w-3 h-3 text-accent" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
