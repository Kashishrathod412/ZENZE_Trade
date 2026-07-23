import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, ArrowRight, ArrowLeft, Send, ShieldCheck, MapPin, 
  Sparkles, Plus, Minus, Cpu, Settings, Thermometer, Hammer, 
  Truck, Check, Loader2 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { addInquiry } from "@/lib/storage";
import { toast } from "sonner";

const CATEGORIES = [
  { id: "machinery", label: "Industrial Machinery", icon: Cpu, color: "from-blue-500 to-indigo-500" },
  { id: "electrical", label: "Electricals & IT", icon: Zap, color: "from-amber-500 to-orange-500" },
  { id: "construction", label: "Construction", icon: Hammer, color: "from-emerald-500 to-teal-500" },
  { id: "chemical", label: "Chemicals & Plastics", icon: Thermometer, color: "from-purple-500 to-pink-500" },
  { id: "automotive", label: "Automotive Parts", icon: Settings, color: "from-rose-500 to-red-500" },
  { id: "logistics", label: "Textiles & Safety", icon: Truck, color: "from-cyan-500 to-blue-500" },
];

const POPULAR_HUBS = ["Mumbai", "New Delhi", "Bengaluru", "Ahmedabad", "Chennai"];

const UNITS = ["Units", "Tons", "Kilograms", "Meters", "Liters", "Containers"];

export default function RFQWidget() {
  const { user } = useAuth();
  
  // Step navigation: 1 (Category & Hub), 2 (Specs & Quantity), 3 (Contact Info), 'success' (Radar Broadcast)
  const [step, setStep] = useState<1 | 2 | 3 | "success">(1);
  const [loading, setLoading] = useState(false);
  const [radarMatches, setRadarMatches] = useState(0);

  // Form Fields State
  const [selectedCategory, setSelectedCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("500");
  const [unit, setUnit] = useState("Units");
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  
  const [sendToVerifiedOnly, setSendToVerifiedOnly] = useState(true);
  const [urgentResponse, setUrgentResponse] = useState(false);

  // Pre-populate user details if authenticated
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // Handle unit decrement/increment
  const handleQtyChange = (type: "inc" | "dec") => {
    const numeric = parseInt(quantity) || 0;
    if (type === "inc") {
      setQuantity((numeric + 100).toString());
    } else {
      setQuantity(Math.max(100, numeric - 100).toString());
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!selectedCategory) {
        toast.error("Please select a sourcing category");
        return;
      }
      if (!location.trim()) {
        toast.error("Please specify a location or hub");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!description.trim()) {
        toast.error("Please describe your specifications");
        return;
      }
      if (!quantity.trim() || parseInt(quantity) <= 0) {
        toast.error("Please enter a valid target quantity");
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter your contact phone number");
      return;
    }

    setLoading(true);
    
    const catLabel = CATEGORIES.find(c => c.id === selectedCategory)?.label || "Industrial Products";
    const fullDesc = `[Category: ${catLabel}] [Hub: ${location}] ${description} ${urgentResponse ? "(URGENT)" : ""}`;
    
    const payload = {
      buyerName: name,
      buyerPhone: phone,
      buyerEmail: email,
      buyerId: user?.id,
      productName: catLabel,
      description: fullDesc,
      quantity: `${quantity} ${unit}`,
    };

    // Store locally as fallback and to get generated ID
    const newInquiry = addInquiry(payload);

    try {
      const res = await fetch("http://localhost/api/add_inquiry.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInquiry)
      });
      
      if (res.ok) {
        setLoading(false);
        setStep("success");
        toast.success("Industrial Requirement Registered!");

        // Animate fake live radar matching count
        let matches = 0;
        const interval = setInterval(() => {
          matches += Math.floor(Math.random() * 4) + 1;
          if (matches >= 18) {
            setRadarMatches(18);
            clearInterval(interval);
          } else {
            setRadarMatches(matches);
          }
        }, 200);
      } else {
        setLoading(false);
        toast.error("Failed to sync requirement to server.");
      }
    } catch (err) {
      setLoading(false);
      toast.error("Failed to connect to server.");
    }
  };

  const resetForm = () => {
    setSelectedCategory("");
    setLocation("");
    setDescription("");
    setQuantity("500");
    setUnit("Units");
    setUrgentResponse(false);
    setRadarMatches(0);
    setStep(1);
  };

  return (
    <section className="py-24 bg-surface relative overflow-hidden">
      {/* Exquisite Architectural Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-1/4 left-0 w-96 h-96 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

      <div className="container-wide relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-card border shadow-sm mb-6 hover:shadow-md transition-all cursor-default">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.25em] uppercase text-foreground/80">
              Rapid Sourcing Engine
            </span>
          </div>

          <h2 className="font-heading text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight leading-tight">
            Broadcast Your <span className="text-gradient">RFQ</span> Instantly
          </h2>
          <p className="text-muted-foreground text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
            Provide your exact technical specifications. Let top-tier manufacturers and verified sellers compete for your order with competitive quotations.
          </p>
        </div>

        {/* The Multi-Step Card Wrapper */}
        <div className="max-w-4xl mx-auto bg-card rounded-[2rem] border border-border/70 shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
          
          {/* Left Feature Column */}
          <div className="w-full md:w-80 bg-gradient-to-br from-primary via-indigo-600 to-purple-800 p-8 md:p-10 text-white flex flex-col justify-between shrink-0">
            <div className="space-y-6">
              <div className="inline-flex p-3 rounded-2xl bg-white/10 border border-white/20">
                <Sparkles className="w-6 h-6 text-accent animate-pulse" />
              </div>
              <h3 className="text-2xl font-black font-heading leading-tight">
                ZenzeTrade Broadcast
              </h3>
              <p className="text-white/80 text-sm leading-relaxed font-medium">
                Our automated pipeline matches your requirement against thousands of certified suppliers matching your geography and category node.
              </p>
            </div>

            <div className="space-y-6 pt-12 md:pt-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-white/90">Verified Nodes Only</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-accent" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-white/90">Instant Bid Returns</span>
              </div>
            </div>
          </div>

          {/* Right Form Wizard Column */}
          <div className="flex-1 p-8 md:p-10 flex flex-col justify-between min-h-[460px] bg-card">
            
            {/* Step Indicators Track (Only show if not in success state) */}
            {step !== "success" && (
              <div className="flex items-center justify-between border-b border-border/40 pb-6 mb-8 overflow-x-auto whitespace-nowrap">
                {[
                  { num: 1, label: "Sourcing Domain" },
                  { num: 2, label: "Specifications" },
                  { num: 3, label: "Broadcast Details" },
                ].map((s) => (
                  <div key={s.num} className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                      step === s.num 
                        ? "bg-primary text-white shadow-md shadow-primary/20 scale-110" 
                        : step > s.num 
                        ? "bg-primary/20 text-primary" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {step > s.num ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.num}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider transition-colors ${
                      step === s.num ? "text-primary" : "text-muted-foreground/60"
                    }`}>
                      {s.label}
                    </span>
                    {s.num < 3 && <div className="w-4 sm:w-8 h-[1px] bg-border/50 mx-1" />}
                  </div>
                ))}
              </div>
            )}

            {/* Steps Container with slide variations */}
            <div className="flex-1 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-2">Step 1 of 3</h4>
                      <h3 className="text-xl font-black text-foreground">Select Sourcing Category & Target Hub</h3>
                    </div>

                    {/* Visual Grid Category Selector */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {CATEGORIES.map((cat) => {
                        const isSelected = selectedCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-4 transition-all duration-300 group ${
                              isSelected 
                                ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                                : "border-border/60 hover:border-primary/40 hover:bg-muted/10 bg-muted/5"
                            }`}
                          >
                            <div className={`p-2 rounded-xl w-fit bg-gradient-to-br ${cat.color} text-white shadow-md group-hover:scale-110 transition-transform`}>
                              <cat.icon className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-foreground truncate block">
                              {cat.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Target Sourcing Hub Location */}
                    <div className="space-y-3">
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                          type="text"
                          placeholder="Enter Sourcing Hub (e.g. Mumbai) *"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-border bg-background focus:ring-4 focus:ring-primary/10 outline-none text-xs font-bold uppercase tracking-wider transition-all"
                        />
                      </div>
                      
                      {/* Popular Hub Quick badging */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60">Quick Select:</span>
                        {POPULAR_HUBS.map((hub) => (
                          <button
                            key={hub}
                            type="button"
                            onClick={() => setLocation(hub)}
                            className={`text-[9.5px] font-black uppercase tracking-widest px-3 py-1 rounded-full border transition-all ${
                              location === hub 
                                ? "bg-primary text-white border-primary" 
                                : "bg-muted/20 text-muted-foreground border-border/50 hover:border-primary/40 hover:bg-muted/40"
                            }`}
                          >
                            {hub}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-2">Step 2 of 3</h4>
                      <h3 className="text-xl font-black text-foreground">Specifications & Target Volume</h3>
                    </div>

                    {/* Requirements specifications description textarea */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Technical Specifications *</label>
                      <textarea
                        placeholder="Describe technical specs, materials, standards (e.g., 500 Meters of High-Tension copper wire, grade A, ISO compliant)..."
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-4 rounded-2xl border border-border bg-background focus:ring-4 focus:ring-primary/10 outline-none text-xs font-medium transition-all resize-none"
                      />
                    </div>

                    {/* Quantity & Units Step increment select row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Target Volume *</label>
                        <div className="flex items-center rounded-2xl border border-border overflow-hidden bg-background">
                          <button
                            type="button"
                            onClick={() => handleQtyChange("dec")}
                            className="px-4 py-3.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full text-center py-3 px-2 outline-none font-bold text-xs bg-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => handleQtyChange("inc")}
                            className="px-4 py-3.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Sourcing Unit</label>
                        <select
                          value={unit}
                          onChange={(e) => setUnit(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-2xl border border-border bg-background focus:ring-4 focus:ring-primary/10 outline-none text-xs font-bold uppercase tracking-wider transition-all"
                        >
                          {UNITS.map((u) => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-2">Step 3 of 3</h4>
                      <h3 className="text-xl font-black text-foreground">Verify Nodes & Broadcast Sourcing Call</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9.5px] font-black uppercase tracking-wider text-muted-foreground">Full Name *</label>
                          <input
                            type="text"
                            placeholder="Enter Name *"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-2xl border border-border bg-background focus:ring-4 focus:ring-primary/10 outline-none text-xs font-bold transition-all"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9.5px] font-black uppercase tracking-wider text-muted-foreground">Contact Phone *</label>
                          <input
                            type="tel"
                            placeholder="Enter Phone *"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-2xl border border-border bg-background focus:ring-4 focus:ring-primary/10 outline-none text-xs font-bold transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9.5px] font-black uppercase tracking-wider text-muted-foreground">Business Email</label>
                        <input
                          type="email"
                          placeholder="Email (Optional)"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-2xl border border-border bg-background focus:ring-4 focus:ring-primary/10 outline-none text-xs font-bold transition-all"
                        />
                      </div>

                      {/* Checkbox Matrix configurations */}
                      <div className="space-y-2 pt-2">
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={sendToVerifiedOnly}
                            onChange={(e) => setSendToVerifiedOnly(e.target.checked)}
                            className="w-4 h-4 rounded text-primary focus:ring-primary border-border bg-background"
                          />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/80">Broadcast only to verified partners</span>
                        </label>
                        
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={urgentResponse}
                            onChange={(e) => setUrgentResponse(e.target.checked)}
                            className="w-4 h-4 rounded text-primary focus:ring-primary border-border bg-background"
                          />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/80">Mark Sourcing Inquiry as High-Urgency</span>
                        </label>
                      </div>

                      {/* Submit controls */}
                      <div className="pt-4 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleBack}
                          disabled={loading}
                          className="px-6 py-4 rounded-2xl border border-border bg-background text-muted-foreground hover:text-foreground font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-muted/15 transition-all"
                        >
                          <ArrowLeft className="w-4 h-4" /> Back
                        </button>

                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 py-4 rounded-2xl gradient-primary text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" /> Matching Sourcing Nodes...
                            </>
                          ) : (
                            <>
                              Broadcast Requirement <Send className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {step === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="text-center py-8 space-y-6"
                  >
                    {/* Sonar Radar Pulse Matching Graphic */}
                    <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" style={{ animationDuration: '2s' }} />
                      <div className="absolute w-24 h-24 rounded-full bg-emerald-500/20 animate-ping animate-delay-300" style={{ animationDuration: '2.5s' }} />
                      <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 z-10">
                        <Check className="w-8 h-8 stroke-[3.5]" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-foreground">Sourcing Wave Transmitted!</h3>
                      <p className="text-xs font-black uppercase tracking-widest text-primary">RFQ Broadcast Sector Completed</p>
                    </div>

                    <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-md mx-auto">
                      Your technical specs have been safely dispatched. Radar detected <span className="text-emerald-500 font-extrabold">{radarMatches}/18 matching industrial nodes</span> in <span className="font-extrabold text-foreground">{location}</span>. Suppliers will prepare bids shortly.
                    </p>

                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
                      <Link to="/buyer/dashboard" className="w-full">
                        <button className="w-full py-3.5 rounded-xl border border-border bg-background hover:bg-muted/20 text-foreground font-black text-xs uppercase tracking-widest transition-all">
                          View Dashboard
                        </button>
                      </Link>
                      <button
                        onClick={resetForm}
                        className="w-full py-3.5 rounded-xl gradient-primary text-white font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-md"
                      >
                        New Sourcing Call
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Back / Next bottom toolbar (Only show on Step 1 and 2) */}
            {step !== "success" && step !== 3 && (
              <div className="border-t border-border/40 pt-6 mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={step === 1}
                  className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${
                    step === 1 
                      ? "opacity-0 pointer-events-none" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/15"
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3 rounded-xl gradient-primary text-white font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-md"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}
