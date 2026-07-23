import { Search, ShieldCheck, Zap, Globe, Mic, MicOff, ChevronRight, Users, Package, TrendingUp, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useInView, animate } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getProducts, getUsers, type Product } from "@/lib/storage";
import { fuzzyMatch } from "@/lib/utils";

// Preloader is gone. Hero starts instantly.
const BASE = 0.05;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: BASE + delay, ease: [0.16, 1, 0.3, 1] },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5, delay: BASE + delay },
});

const scaleIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.9, y: 15 },
  animate: { opacity: 1, scale: 1, y: 0 },
  transition: { duration: 0.4, delay: BASE + delay, ease: [0.16, 1, 0.3, 1] },
});

const ALL_CATEGORIES = [
  "Industrial & Machinery",
  "Electrical & Electronics",
  "Computers & IT Products",
  "Gaming & Accessories",
  "Sports & Fitness",
  "Consumer Electronics",
  "Clothing & Fashion",
  "Home, Kitchen & Furniture",
  "Stationery & Office Supplies",
  "Office & Commercial Equipment",
  "Automobile & Parts",
  "Chemicals & Raw Materials",
  "Agriculture & Farming",
  "Construction & Building Materials",
  "Beauty & Personal Care",
  "Pets & Animal Supplies",
  "Packaging & Logistics",
  "Toys, Gifts & Baby Products",
  "Safety & Security",
  "Textile & Fabric Industry",
  "Manufacturing & Production Equipment",
  "Fasteners & Hardware Components",
  "Pumps, Pipes & Fittings",
  "Renewable Energy & Solar",
  "Industrial Safety & PPE",
  "Cleaning & Maintenance Equipment",
  "Bags, Packaging & Storage",
  "Tiles, Marble & Stone",
  "Plastic & Rubber Products",
  "HVAC & Cooling Systems",
  "Hospitality & Restaurant Equipment",
  "Event & Exhibition Equipment",
  "Repair & Maintenance Tools",
  "Adhesives, Sealants & Coatings",
  "Medical & Healthcare Equipment",
  "Food Processing & Packaging",
];

const SEARCH_PLACEHOLDERS = ALL_CATEGORIES.map((c) => `Search "${c}"...`);

// Typewriter hook: cycles through all categories with typing/deleting animation
function useTypingEffect(items: string[], typingSpeed = 60, deleteSpeed = 30, pauseMs = 1400, paused = false) {
  const [displayed, setDisplayed] = useState("");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");

  useEffect(() => {
    if (paused) return; // Freeze typewriter animation when input is focused

    const current = items[currentIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (displayed.length < current.length) {
        timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), typingSpeed);
      } else {
        timeout = setTimeout(() => setPhase("pausing"), pauseMs);
      }
    } else if (phase === "pausing") {
      timeout = setTimeout(() => setPhase("deleting"), 100);
    } else if (phase === "deleting") {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), deleteSpeed);
      } else {
        setCurrentIdx((i) => (i + 1) % items.length);
        setPhase("typing");
      }
    }

    return () => clearTimeout(timeout);
  }, [displayed, phase, currentIdx, items, typingSpeed, deleteSpeed, pauseMs, paused]);

  return displayed;
}

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

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [sellerSuggestions, setSellerSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const allProducts = getProducts();
      const allSellers = getUsers().filter(u => u.role === "seller");

      const filtered = allProducts.filter(p =>
        fuzzyMatch(p.name, searchQuery) ||
        fuzzyMatch(p.category, searchQuery) ||
        fuzzyMatch(p.sellerName, searchQuery) ||
        fuzzyMatch(p.location, searchQuery) ||
        fuzzyMatch(p.sellerType, searchQuery)
      ).slice(0, 4);

      const filteredSellers = allSellers.filter(s =>
        fuzzyMatch(s.name, searchQuery) ||
        fuzzyMatch(s.category, searchQuery) ||
        fuzzyMatch(s.location, searchQuery) ||
        fuzzyMatch(s.sellerType, searchQuery)
      ).slice(0, 3);

      setSuggestions(filtered);
      setSellerSuggestions(filteredSellers);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setSellerSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const typedPlaceholder = useTypingEffect(
    SEARCH_PLACEHOLDERS,
    55,
    25,
    1600,
    isFocused // Stop typing effect when focused
  );

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }, [searchQuery, navigate]);

  // Check voice support on mount
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setVoiceSupported(!!SpeechRecognition);
  }, []);

  const startVoice = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    setVoiceError("");
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join("");
      setSearchQuery(transcript);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      if (event.error === "not-allowed") {
        setVoiceError("Mic permission denied");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      // Auto-search if result captured
      setTimeout(() => {
        setSearchQuery((q) => {
          const finalQuery = q.trim();
          if (finalQuery) {
            // Move navigation outside or use the value directly
            setTimeout(() => navigate(`/products?q=${encodeURIComponent(finalQuery)}`), 10);
          }
          return q;
        });
      }, 400);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [navigate]);

  const stopVoice = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-background">
      {/* Immersive Photo Background */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        {/* Full Industrial Photo */}
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8ed74514f4?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-100"
        />
        {/* White/Glass overlay to ensure text readability */}
        <div className="absolute inset-0 bg-white/50 dark:bg-black/60 backdrop-blur-[2px]" />
        
        {/* Subtle radial highlights */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
      </div>

      <div className="container-wide relative z-10">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
          {/* Trust badge */}
          <motion.div {...scaleIn(0)} className="inline-flex items-center gap-2 group px-5 py-2.5 rounded-full bg-card border border-border/80 mb-8 backdrop-blur-md hover:border-primary/30 transition-all cursor-default shadow-lg shadow-black/5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
            <span className="text-xs font-black uppercase tracking-[0.25em] text-foreground/80 group-hover:text-primary transition-colors">
              India's #1 Elite Industry Matrix — Trusted by 50,000+ Leaders
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-black text-foreground mb-8 leading-[1.1] tracking-tight"
          >
            Sourcing the <span className="text-gradient">Industrial Future</span>, <br className="hidden md:block" />
            One Verified Asset at a Time.
          </motion.h1>

          <motion.p
            {...fadeUp(0.2)}
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Directly connect with India's most trusted manufacturers and wholesale suppliers through our hyper-secure B2B & B2C matrix.
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="w-full max-w-3xl mx-auto mb-8 relative" ref={searchContainerRef}>
            <div className={`relative group transition-all duration-500 rounded-[2rem] p-1 ${showSuggestions ? 'bg-gradient-to-r from-primary/30 to-accent/30 shadow-2xl' : 'bg-transparent'}`}>
              <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-card border border-border shadow-2xl rounded-3xl sm:rounded-[1.8rem] overflow-hidden focus-within:border-primary/50 transition-all duration-300">
                <div className="flex items-center flex-1">
                  <div className="pl-4 sm:pl-6 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onFocus={() => {
                      setIsFocused(true);
                      if (searchQuery.trim().length > 1) setShowSuggestions(true);
                    }}
                    onBlur={() => setIsFocused(false)}
                    placeholder={isFocused ? "Type what you're looking for..." : typedPlaceholder}
                    className="flex-1 px-3 sm:px-4 py-4 sm:py-6 bg-transparent outline-none text-foreground font-medium text-base sm:text-lg placeholder:text-muted-foreground/40 min-w-0"
                  />
                  {voiceSupported && (
                    <button
                      onClick={isListening ? stopVoice : startVoice}
                      className={`sm:hidden p-3 mr-1 rounded-xl transition-all ${isListening ? "bg-destructive text-white animate-pulse" : "hover:bg-muted text-muted-foreground hover:text-primary"}`}
                      title={isListening ? "Stop listening" : "Voice search"}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  )}
                </div>
                
                <div className="flex items-center gap-2 p-2 sm:p-0 sm:pr-3 bg-muted/20 sm:bg-transparent border-t border-border/50 sm:border-t-0">
                  {voiceSupported && (
                    <button
                      onClick={isListening ? stopVoice : startVoice}
                      className={`hidden sm:block p-3 rounded-2xl transition-all ${isListening ? "bg-destructive text-white animate-pulse" : "hover:bg-muted text-muted-foreground hover:text-primary"}`}
                      title={isListening ? "Stop listening" : "Voice search"}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                  )}
                  <Button
                    onClick={handleSearch}
                    className="w-full sm:w-auto rounded-xl sm:rounded-2xl px-4 sm:px-8 py-3 sm:py-4 h-auto gradient-primary text-white font-black text-[10px] sm:text-xs uppercase tracking-widest hover:scale-[1.02] sm:hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
                  >
                    Search Network
                  </Button>
                </div>
              </div>

              {voiceError && (
                <p className="absolute -bottom-6 left-6 text-[10px] font-bold text-destructive uppercase tracking-widest">{voiceError}</p>
              )}
            </div>

            {/* Prediction / Suggestion Matrix */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  className="absolute top-full left-0 right-0 mt-4 bg-card border border-border/80 backdrop-blur-2xl rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.2)] overflow-hidden z-20"
                >
                  <div className="p-2">
                    {suggestions.length > 0 && (
                      <div className="mb-2">
                        <div className="px-6 py-2 text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center justify-between opacity-50 bg-primary/5 mb-1 rounded-t-2xl">
                          <span>Verified Assets</span>
                          <ShieldCheck className="w-3 h-3 text-primary" />
                        </div>
                        <div className="space-y-1">
                          {suggestions.map((p) => (
                            <button
                              key={p.id}
                              onClick={() => {
                                navigate(`/products/${p.id}`);
                                setShowSuggestions(false);
                                setSearchQuery("");
                              }}
                              className="w-full flex items-center gap-4 p-4 hover:bg-primary/5 rounded-2xl transition-all group text-left border border-transparent hover:border-primary/20"
                            >
                              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-4xl group-hover:scale-110 transition-transform shadow-lg shadow-black/5">
                                {p.image}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-black uppercase tracking-tight text-foreground group-hover:text-primary transition-colors truncate">{p.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs font-black text-primary uppercase tracking-widest">{p.price}</span>
                                  <span className="text-xs text-muted-foreground uppercase tracking-widest truncate opacity-80">• {p.category}</span>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-all shrink-0 pr-2" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {sellerSuggestions.length > 0 && (
                      <div>
                        <div className="px-6 py-2 text-[10px] font-black text-success uppercase tracking-[0.3em] flex items-center justify-between opacity-50 bg-success/5 mb-1">
                          <span>Industrial Nodes</span>
                          <ShieldCheck className="w-3 h-3 text-success" />
                        </div>
                        <div className="space-y-1">
                          {sellerSuggestions.map((seller) => (
                            <button
                              key={seller.id}
                              onClick={() => {
                                navigate(`/seller/${seller.id}`);
                                setShowSuggestions(false);
                                setSearchQuery("");
                              }}
                              className="w-full flex items-center gap-4 p-4 hover:bg-success/5 rounded-2xl transition-all group text-left border border-transparent hover:border-success/20"
                            >
                              <div className="w-14 h-14 rounded-2xl bg-success text-white flex items-center justify-center text-lg font-black group-hover:scale-110 transition-transform shadow-lg shadow-success/10">
                                {seller.name.split(/\s+/).filter(Boolean).map((n: string) => n[0]).join('')}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-black uppercase tracking-tight text-foreground group-hover:text-success transition-colors truncate flex items-center gap-2">
                                  {seller.name}
                                  <ShieldCheck className="w-3.5 h-3.5 text-success" />
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs font-black text-success uppercase tracking-[0.2em] px-2 py-0.5 bg-success/10 rounded-md border border-success/20">
                                    {seller.sellerType || 'Manufacturer'}
                                  </span>
                                  <span className="text-xs text-muted-foreground uppercase tracking-widest truncate opacity-80">• {seller.location || 'Global Hub'}</span>
                                </div>
                              </div>
                              <Globe className="w-4 h-4 text-success opacity-0 group-hover:opacity-100 transition-all shrink-0 pr-2" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleSearch}
                      className="w-full mt-2 p-4 text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-2xl transition-all border-t border-border/50 text-center flex items-center justify-center gap-2"
                    >
                      Search for "{searchQuery}" in Global Matrix <Zap className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search hints */}
            <motion.p {...fadeIn(0.1)} className="text-xs font-black uppercase tracking-widest text-muted-foreground/50 mt-3 opacity-80">
              Search across 36+ categories · B2B Bulk & B2C Retail · Voice enabled
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div {...fadeUp(0.4)} className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/inquiry">
              <Button size="lg" className="rounded-2xl px-10 h-14 font-black border-2 border-primary bg-primary text-white hover:bg-transparent hover:text-primary transition-all shadow-lg shadow-primary/20">
                Post Requirement
              </Button>
            </Link>
            <Link to="/seller/register">
              <Button variant="outline" size="lg" className="rounded-2xl px-10 h-14 font-black border-2 border-border hover:border-primary hover:bg-primary/5 hover:text-primary hover:translate-y-[-2px] transition-all shadow-sm active:scale-95">
                Become a Seller
              </Button>
            </Link>
          </motion.div>

          {/* Features list */}
          <motion.div {...fadeIn(0.4)} className="mt-20 pt-10 border-t border-border/40 w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/30">
              {[
                { icon: ShieldCheck, label: "Verified Partners", desc: "50,000+ Industry Leaders", color: "text-primary" },
                { icon: Globe, label: "Global Reach", desc: "120+ International Hubs", color: "text-accent" },
                { icon: Zap, label: "Direct Sourcing", desc: "Zero Middleman Markups", color: "text-success" },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ backgroundColor: "hsla(262, 83%, 58%, 0.05)" }}
                  className="group py-6 md:py-4 px-8 flex items-center justify-center md:justify-start gap-5 transition-all duration-300 cursor-default"
                >
                  <div className={`w-12 h-12 rounded-xl bg-muted/40 flex items-center justify-center ${feature.color} group-hover:scale-110 transition-transform duration-500`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground leading-none mb-1.5">
                      {feature.label}
                    </h4>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Integrated Modular Floating Glass Stats Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full backdrop-blur-md bg-card/80 border border-border/50 rounded-3xl p-6 sm:p-8 mt-16 shadow-2xl relative z-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((s, i) => (
              <div key={s.label} className="flex flex-col items-center text-center group">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>

                {/* Animated Number */}
                <div className={`font-heading text-2xl md:text-3xl font-black ${s.color} leading-none mb-1`}>
                  <AnimatedNumber value={s.value} suffix={s.suffix} />
                </div>

                {/* Label */}
                <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground leading-tight">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
