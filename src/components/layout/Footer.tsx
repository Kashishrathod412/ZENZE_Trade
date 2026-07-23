import { Link } from "react-router-dom";
import {
  Globe, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin,
  Send, ShieldCheck, Zap, Globe2, Sparkles, ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";

const footerLinks = {
  "Marketplace": [
    { label: "Browse Products", to: "/products" },
    { label: "Elite Categories", to: "/categories" },
    { label: "Industry Blog", to: "/blog" },
    { label: "Concierge Service", to: "/contact" },
    { label: "About Us", to: "/about" },
  ],
  "Partnership": [
    { label: "Register as Seller", to: "/seller/register" },
    { label: "Become a Delivery Partner", to: "/delivery" },
    { label: "Premium Pricing", to: "/pricing" },
    { label: "Seller Dashboard", to: "/seller/dashboard" },
    { label: "Enterprise Solutions", to: "/pricing" },
  ],
  "Careers & Hiring": [
    { label: "Browse Open Roles", to: "/careers" },
  ],

};

export default function Footer() {
  return (
    <footer className="bg-[#030712] text-white/60 relative overflow-hidden border-t border-white/5 pt-10 pb-6">
      {/* Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container-wide relative z-10">
        {/* Newsletter & High Impact Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-center">
          <div className="max-w-xl text-center lg:text-left">
            <h3 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">Stay ahead of the <span className="text-transparent bg-clip-text gradient-primary">Industrial Curve</span>.</h3>
            <p className="text-white/70 text-lg leading-relaxed mb-0">Join 10,000+ industry leaders receiving weekly analysis.</p>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative flex p-1 bg-background border border-white/10 rounded-xl overflow-hidden focus-within:border-primary/50 transition-all duration-300">
              <input
                type="email"
                placeholder="Business email"
                className="flex-1 px-4 py-2.5 bg-transparent outline-none text-white text-sm font-medium"
              />
              <button className="px-6 py-2.5 gradient-primary text-white rounded-lg font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                Subscribe <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-4 group w-fit">
              <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.3)] group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 overflow-hidden relative">
                <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors" />
                <span className="text-white font-heading font-black text-lg z-10">ZT</span>
              </div>
               <div className="flex flex-col">
                <span className="font-heading font-black text-2xl text-white tracking-tighter leading-none">ZenzeTrade</span>
                <span className="text-xs font-black text-white/40 uppercase tracking-[0.4em] mt-1">Industrial Elite</span>
              </div>
            </Link>
            <p className="text-lg leading-relaxed max-w-sm text-balance">
              The world's most trusted B2B network driving the next generation of industrial efficiency. Connect with verified global suppliers instantly.
            </p>
            <div className="flex items-center gap-2.5">
              {[
                { Icon: Facebook, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Instagram, href: "#" },
                { Icon: Linkedin, href: "#" }
              ].map((item, idx) => (
                <Link
                  key={idx}
                  to={item.href}
                  className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:text-white hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 group shadow-lg"
                >
                  <item.Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                </Link>
              ))}
            </div>

             <div className="flex flex-wrap items-center gap-6 mt-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-white/80 uppercase tracking-widest">ISO 27001</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                <Globe2 className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Global Reach</span>
              </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
             <div key={title} className="flex flex-col gap-4">
              <h4 className="font-black text-white uppercase tracking-[0.2em] text-sm flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                {title}
              </h4>
              <ul className="flex flex-col gap-2">
                 {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-base font-medium text-white/70 hover:text-primary transition-all duration-300 flex items-center gap-1 group"
                    >
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 -translate-y-0.5 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-[14px] font-medium opacity-80">© {new Date().getFullYear()} ZenzeTrade Elite. Built for Global Scale.</p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-[13px] font-bold hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-[13px] font-bold hover:text-white transition-colors">Terms of Trade</Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
             <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] font-black uppercase tracking-[0.2em] group transition-all hover:bg-white/10 hover:border-primary/30">
              <span className="opacity-40">Developed by</span>
              <span className="text-white group-hover:text-primary transition-colors">Vertex Global Tech</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
