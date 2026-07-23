import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone, ShieldCheck, Globe, Zap, Building2, ArrowRight, ArrowLeft, CheckCircle2, Instagram, Facebook, Linkedin, Youtube, AtSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { registerUser, loginUser } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COUNTRIES = [
  { code: "+91",  iso: "IN",  flag: "🇮🇳", label: "India" },
  { code: "+1",   iso: "US",  flag: "🇺🇸", label: "USA" },
  { code: "+971", iso: "AE",  flag: "🇦🇪", label: "UAE" },
  { code: "+44",  iso: "GB",  flag: "🇬🇧", label: "UK" },
  { code: "+65",  iso: "SG",  flag: "🇸🇬", label: "Singapore" },
  { code: "+61",  iso: "AU",  flag: "🇦🇺", label: "Australia" },
  { code: "+49",  iso: "DE",  flag: "🇩🇪", label: "Germany" },
  { code: "+1",   iso: "CA",  flag: "🇨🇦", label: "Canada" },
  { code: "+81",  iso: "JP",  flag: "🇯🇵", label: "Japan" },
  { code: "+60",  iso: "MY",  flag: "🇲🇾", label: "Malaysia" },
  { code: "+966", iso: "SA",  flag: "🇸🇦", label: "Saudi Arabia" },
  { code: "+974", iso: "QA",  flag: "🇶🇦", label: "Qatar" },
  { code: "+27",  iso: "ZA",  flag: "🇿🇦", label: "South Africa" },
  { code: "+55",  iso: "BR",  flag: "🇧🇷", label: "Brazil" },
  { code: "+86",  iso: "CN",  flag: "🇨🇳", label: "China" },
  { code: "+82",  iso: "KR",  flag: "🇰🇷", label: "South Korea" },
  { code: "+33",  iso: "FR",  flag: "🇫🇷", label: "France" },
  { code: "+39",  iso: "IT",  flag: "🇮🇹", label: "Italy" },
  { code: "+7",   iso: "RU",  flag: "🇷🇺", label: "Russia" },
  { code: "+92",  iso: "PK",  flag: "🇵🇰", label: "Pakistan" },
  { code: "+880", iso: "BD",  flag: "🇧🇩", label: "Bangladesh" },
];

const SELLER_TYPES = ["Manufacturer","Wholesaler","Distributor","Exporter","Importer","Retailer","Trader","Service Provider"];
const CATEGORIES = ["Industrial & Machinery","Electrical & Electronics","Computers & IT Products","Consumer Electronics","Clothing & Fashion","Home, Kitchen & Furniture","Agriculture & Farming","Chemicals & Raw Materials","Construction & Building Materials","Automobile & Parts","Beauty & Personal Care","Food & Beverages","Textile & Fabric Industry","Safety & Security","Renewable Energy & Solar","Other"];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

const inputCls = "w-full h-14 px-4 rounded-2xl border border-border bg-background/80 focus:ring-4 focus:ring-primary/15 focus:border-primary/60 outline-none text-sm font-semibold text-foreground placeholder:text-muted-foreground/50 transition-all";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const isRegisterPath = location.pathname === "/register" || location.pathname === "/seller/register";
  const [mode, setMode] = useState<"login" | "register">(isRegisterPath ? "register" : "login");
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  // Form fields
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [countryIso, setCountryIso] = useState("IN");
  const [phone, setPhone] = useState("");
  const [sellerType, setSellerType] = useState("");
  const [category, setCategory] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [youtube, setYoutube] = useState("");

  const totalSteps = role === "seller" ? 4 : 3;

  const goNext = () => { setDir(1); setStep(s => s + 1); };
  const goBack = () => { setDir(-1); setStep(s => s - 1); };

  const validateStep = () => {
    if (step === 1) return true; // role selection
    if (step === 2) { if (!name.trim()) { toast.error("Name required"); return false; } if (!email.trim()) { toast.error("Email required"); return false; } if (password.length < 6) { toast.error("Password min 6 chars"); return false; } return true; }
    if (step === 3) { if (!phone.trim()) { toast.error("Phone required"); return false; } return true; }
    if (step === 4) { if (!sellerType) { toast.error("Select seller type"); return false; } if (!category) { toast.error("Select category"); return false; } return true; }
    return true;
  };

  const handleNext = () => { if (validateStep()) goNext(); };

  const handleRegister = async () => {
    if (!validateStep()) return;
    setIsLoading(true);
    try {
      await new Promise(r => setTimeout(r, 400));

      // 1. Save to localStorage (keeps app working as before)
      const result = registerUser({
        name, email, password,
        phone: phone ? `${countryCode}${phone}` : undefined,
        country: countryIso,
        role,
        sellerType: role === "seller" ? sellerType : undefined,
        category: role === "seller" ? category : undefined,
        socialLinks: { instagram: instagram || undefined, facebook: facebook || undefined, linkedin: linkedin || undefined, youtube: youtube || undefined },
      });
      if (!result.success) { toast.error(result.error || "Registration failed"); return; }

      // 2. Also save to MySQL database (so admin panel & phpMyAdmin shows it)
      try {
        await fetch("http://localhost/api/register_user.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name, email, password,
            phone: phone ? `${countryCode}${phone}` : null,
            country: countryIso,
            role,
            sellerType: role === "seller" ? sellerType : null,
            category: role === "seller" ? category : null,
            socialLinks: { instagram: instagram || null, facebook: facebook || null, linkedin: linkedin || null, youtube: youtube || null },
          }),
        });
      } catch {
        // DB save failed silently — app still works via localStorage
        console.warn("Could not sync registration to MySQL. App still works.");
      }

      setUser(result.user!);
      toast.success("Welcome to ZenzeTrade! 🎉");
      navigate(role === "seller" ? "/seller/dashboard" : "/buyer/dashboard");
    } catch { toast.error("Something went wrong"); }
    finally { setIsLoading(false); }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      const result = loginUser(email, password);
      if (!result.success) { toast.error(result.error || "Login failed"); return; }
      setUser(result.user!);
      toast.success("Welcome back!");
      const u = result.user!;
      if (u.role === "admin") navigate("/admin");
      else if (u.role === "seller") navigate("/seller/dashboard");
      else if (u.role === "delivery") navigate("/delivery");
      else navigate("/buyer/dashboard");
    } catch { toast.error("Something went wrong"); }
    finally { setIsLoading(false); }
  };

  const switchMode = (m: "login" | "register") => { setMode(m); setStep(1); setDir(1); };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#FFFFFF] via-[#FAF7FF] to-[#F4EEFF] flex items-center justify-center py-12 px-4 relative overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#7C3AED]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#A855F7]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-[420px] relative z-10">

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="bg-white/80 backdrop-blur-[20px] border border-[rgba(124,58,237,0.15)] rounded-[32px] shadow-[0_20px_60px_rgba(124,58,237,0.12),0_8px_24px_rgba(0,0,0,0.05)] overflow-hidden transition-transform duration-500 hover:-translate-y-1"
          >
            {/* Header */}
            <div className="p-8 pb-0">
              <div className="flex flex-col items-center gap-3 mb-8">
                <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white font-bold text-xl shadow-[0_8px_20px_rgba(124,58,237,0.3)]">ZT</div>
                <div className="text-center">
                  <h1 className="font-heading font-[700] text-[#111827] text-[18px] tracking-tight">ZenzeTrade</h1>
                  <p className="text-[10px] text-[#A855F7] font-[700] uppercase tracking-[4px] opacity-80 mt-1">Industrial Elite</p>
                </div>
              </div>

              {/* Tab switcher */}
              <div className="flex gap-1 p-1 bg-[#F3E8FF]/60 rounded-full mb-2 h-[52px]">
                {["login","register"].map(m => (
                  <button key={m} onClick={() => switchMode(m as any)}
                    className={`flex-1 rounded-full text-sm font-[600] transition-all duration-300 ${mode === m ? "bg-white shadow-[0_2px_10px_rgba(124,58,237,0.1)] text-[#7C3AED]" : "text-[#6B7280] hover:text-[#111827]"}`}>
                    {m === "login" ? "Sign In" : "Register"}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 pt-6">
              <AnimatePresence mode="wait">

                {/* ── LOGIN ─────────────────────────────────── */}
                {mode === "login" && (
                  <motion.form key="login" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} onSubmit={handleLogin} className="space-y-5">
                    <div className="mb-6 text-center">
                      <h2 className="font-heading font-[700] text-[34px] text-[#111827] mb-2 leading-tight">Welcome back</h2>
                      <p className="text-[#6B7280] font-[500] text-sm">Sign in to your business account</p>
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                      <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required className="w-full h-[48px] px-4 pl-11 rounded-[16px] border border-[rgba(124,58,237,0.15)] bg-white focus:ring-4 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] outline-none text-[14px] font-[500] text-[#111827] placeholder:text-[#6B7280]/60 transition-all" />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                      <input type={showPw ? "text" : "password"} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full h-[48px] px-4 pl-11 pr-11 rounded-[16px] border border-[rgba(124,58,237,0.15)] bg-white focus:ring-4 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] outline-none text-[14px] font-[500] text-[#111827] placeholder:text-[#6B7280]/60 transition-all" />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#7C3AED] transition-colors">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full h-[48px] mt-2 rounded-[16px] bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-[600] text-[15px] tracking-wide border-none shadow-[0_15px_35px_rgba(124,58,237,0.35)] hover:-translate-y-[2px] hover:shadow-[0_20px_45px_rgba(124,58,237,0.45)] transition-all duration-300 relative overflow-hidden group">
                      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      <span className="relative z-10 flex items-center justify-center">
                        {isLoading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</span> : <span className="flex items-center gap-2">Sign In <ArrowRight className="w-4 h-4" /></span>}
                      </span>
                    </Button>
                    <p className="text-center text-[13px] text-[#6B7280] font-[500] mt-6">Don't have an account? <button type="button" onClick={() => switchMode("register")} className="text-[#7C3AED] font-[600] hover:underline">Register now</button></p>
                  </motion.form>
                )}

                {/* ── REGISTER MULTI-STEP ────────────────────── */}
                {mode === "register" && (
                  <motion.div key="register" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    {/* Progress */}
                    <div className="mb-8 mt-2">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-[700] text-[#6B7280] uppercase tracking-widest">Step {step} of {totalSteps}</span>
                        <span className="text-[11px] font-[700] text-[#7C3AED]">{Math.round((step / totalSteps) * 100)}%</span>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: totalSteps }).map((_, i) => (
                          <div key={i} className={`h-[6px] flex-1 rounded-full transition-all duration-500 ${i < step ? "bg-gradient-to-r from-[#7C3AED] to-[#A855F7]" : "bg-[#F3E8FF]"}`} />
                        ))}
                      </div>
                    </div>

                    <AnimatePresence custom={dir} mode="wait">

                      {/* STEP 1 — Role */}
                      {step === 1 && (
                        <motion.div key="s1" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-6">
                          <div className="mb-8">
                            <h2 className="font-heading font-[700] text-[34px] text-[#111827] mb-2 leading-tight">Who are you?</h2>
                            <p className="text-[#6B7280] font-[500] text-sm">Choose your role to continue</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            {[
                              { val: "buyer", label: "Buyer", icon: ShieldCheck, desc: "Source products and manage orders", feats: ["Find suppliers", "Compare products", "Manage purchases"] },
                              { val: "seller", label: "Seller", icon: Building2, desc: "List products and grow sales", feats: ["Showcase products", "Generate leads", "Increase visibility"] },
                            ].map(r => (
                              <button key={r.val} onClick={() => setRole(r.val as any)}
                                className={`relative h-[200px] p-4 rounded-[24px] border text-left transition-all duration-400 ease-[cubic-bezier(0.25,0.1,0.25,1)] group ${role === r.val ? "border-transparent bg-[#F3E8FF] shadow-[0_0_30px_rgba(124,58,237,0.18)] scale-[1.03]" : "border-[rgba(124,58,237,0.15)] bg-white hover:-translate-y-[8px] hover:border-[#7C3AED] hover:shadow-[0_15px_30px_rgba(124,58,237,0.1)]"}`}>
                                {role === r.val && <div className="absolute inset-0 rounded-[24px] border-2 border-transparent bg-gradient-to-r from-[#7C3AED] to-[#A855F7] [mask-image:linear-gradient(white,white),linear-gradient(white,white)] [mask-clip:padding-box,border-box] [mask-composite:exclude] pointer-events-none opacity-100" />}
                                {role === r.val && <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#7C3AED] flex items-center justify-center shadow-md"><CheckCircle2 className="w-3.5 h-3.5 text-white" /></div>}
                                
                                <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] flex items-center justify-center mb-3 shadow-[0_4px_15px_rgba(124,58,237,0.3)]">
                                  <r.icon className="w-5 h-5 text-white" />
                                </div>
                                <p className="font-[700] text-[15px] text-[#111827] mb-1">{r.label}</p>
                                <p className="text-[11px] text-[#6B7280] font-[500] leading-snug mb-3">{r.desc}</p>
                                <ul className="space-y-1">
                                  {r.feats.map(f => (
                                    <li key={f} className="text-[9px] text-[#6B7280] flex items-center gap-1 font-[500]"><CheckCircle2 className="w-2.5 h-2.5 text-[#A855F7]" /> {f}</li>
                                  ))}
                                </ul>
                              </button>
                            ))}
                          </div>
                          <Button onClick={handleNext} className="w-full h-[48px] mt-4 rounded-[16px] bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-[600] text-[15px] tracking-wide border-none shadow-[0_15px_35px_rgba(124,58,237,0.35)] hover:-translate-y-[2px] hover:shadow-[0_20px_45px_rgba(124,58,237,0.45)] transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            <span className="relative z-10 flex items-center justify-center">Continue as {role === "buyer" ? "Buyer" : "Seller"} <ArrowRight className="w-4 h-4 ml-2" /></span>
                          </Button>
                        </motion.div>
                      )}

                      {/* STEP 2 — Identity */}
                      {step === 2 && (
                        <motion.div key="s2" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-5">
                          <div className="mb-6">
                            <h2 className="font-heading font-[700] text-[34px] text-[#111827] mb-2 leading-tight">Your identity</h2>
                            <p className="text-[#6B7280] font-[500] text-sm">Create your secure account</p>
                          </div>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                            <input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} className="w-full h-[48px] px-4 pl-11 rounded-[16px] border border-[rgba(124,58,237,0.15)] bg-white focus:ring-4 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] outline-none text-[14px] font-[500] text-[#111827] placeholder:text-[#6B7280]/60 transition-all" />
                          </div>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                            <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} className="w-full h-[48px] px-4 pl-11 rounded-[16px] border border-[rgba(124,58,237,0.15)] bg-white focus:ring-4 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] outline-none text-[14px] font-[500] text-[#111827] placeholder:text-[#6B7280]/60 transition-all" />
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                            <input type={showPw ? "text" : "password"} placeholder="Password (min 6 chars)" value={password} onChange={e => setPassword(e.target.value)} className="w-full h-[48px] px-4 pl-11 pr-11 rounded-[16px] border border-[rgba(124,58,237,0.15)] bg-white focus:ring-4 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] outline-none text-[14px] font-[500] text-[#111827] placeholder:text-[#6B7280]/60 transition-all" />
                            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#7C3AED]">
                              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          <div className="flex gap-3 pt-2">
                            <Button variant="outline" onClick={goBack} className="h-[48px] w-[48px] rounded-[16px] flex-shrink-0 border-[rgba(124,58,237,0.15)] text-[#6B7280] hover:text-[#111827] hover:bg-[#F3E8FF] transition-all"><ArrowLeft className="w-5 h-5" /></Button>
                            <Button onClick={handleNext} className="flex-1 h-[48px] rounded-[16px] bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-[600] text-[15px] tracking-wide border-none shadow-[0_15px_35px_rgba(124,58,237,0.35)] hover:-translate-y-[2px] hover:shadow-[0_20px_45px_rgba(124,58,237,0.45)] transition-all duration-300 relative overflow-hidden group">
                              <span className="relative z-10 flex items-center justify-center">Continue <ArrowRight className="w-4 h-4 ml-2" /></span>
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 3 — Country & Phone */}
                      {step === 3 && (
                        <motion.div key="s3" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-5">
                          <div className="mb-6">
                            <h2 className="font-heading font-[700] text-[34px] text-[#111827] mb-2 leading-tight">Contact</h2>
                            <p className="text-[#6B7280] font-[500] text-sm">Select your country for local pricing</p>
                          </div>

                          {/* Country selector */}
                          <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none z-10" />
                            <select value={countryCode} onChange={e => {
                              const opt = e.target.options[e.target.selectedIndex];
                              setCountryCode(e.target.value);
                              setCountryIso(opt.dataset.iso || "IN");
                            }} className="w-full h-[48px] px-4 pl-11 appearance-none cursor-pointer rounded-[16px] border border-[rgba(124,58,237,0.15)] bg-white focus:ring-4 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] outline-none text-[14px] font-[500] text-[#111827] transition-all">
                              {COUNTRIES.map(c => (
                                <option key={c.iso} value={c.code} data-iso={c.iso}>
                                  {c.flag} {c.label} ({c.code})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Phone */}
                          <div className="flex gap-2">
                            <div className="h-[48px] px-4 flex items-center rounded-[16px] border border-[rgba(124,58,237,0.15)] bg-[#F3E8FF]/40 font-[600] text-[14px] text-[#111827] shrink-0 min-w-[72px] justify-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-[#6B7280]" />
                              {countryCode}
                            </div>
                            <input type="tel" placeholder="Phone number" value={phone} onChange={e => setPhone(e.target.value)} className="w-full h-[48px] px-4 rounded-[16px] border border-[rgba(124,58,237,0.15)] bg-white focus:ring-4 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] outline-none text-[14px] font-[500] text-[#111827] placeholder:text-[#6B7280]/60 transition-all flex-1" />
                          </div>

                          <div className="flex gap-3 pt-2">
                            <Button variant="outline" onClick={goBack} className="h-[48px] w-[48px] rounded-[16px] flex-shrink-0 border-[rgba(124,58,237,0.15)] text-[#6B7280] hover:text-[#111827] hover:bg-[#F3E8FF] transition-all"><ArrowLeft className="w-5 h-5" /></Button>
                            {role === "buyer" ? (
                              <Button onClick={handleRegister} disabled={isLoading} className="flex-1 h-[48px] rounded-[16px] bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-[600] text-[15px] tracking-wide border-none shadow-[0_15px_35px_rgba(124,58,237,0.35)] hover:-translate-y-[2px] hover:shadow-[0_20px_45px_rgba(124,58,237,0.45)] transition-all duration-300 relative overflow-hidden group">
                                <span className="relative z-10 flex items-center justify-center">
                                  {isLoading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating...</span> : <>Create Account <Zap className="w-4 h-4 ml-2" /></>}
                                </span>
                              </Button>
                            ) : (
                              <Button onClick={handleNext} className="flex-1 h-[48px] rounded-[16px] bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-[600] text-[15px] tracking-wide border-none shadow-[0_15px_35px_rgba(124,58,237,0.35)] hover:-translate-y-[2px] hover:shadow-[0_20px_45px_rgba(124,58,237,0.45)] transition-all duration-300 relative overflow-hidden group">
                                <span className="relative z-10 flex items-center justify-center">Continue <ArrowRight className="w-4 h-4 ml-2" /></span>
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 4 — Seller Business Profile */}
                      {step === 4 && role === "seller" && (
                        <motion.div key="s4" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-5">
                          <div className="mb-6">
                            <h2 className="font-heading font-[700] text-[34px] text-[#111827] mb-2 leading-tight">Business profile</h2>
                            <p className="text-[#6B7280] font-[500] text-sm">Tell buyers what you offer</p>
                          </div>

                          <Select value={sellerType} onValueChange={setSellerType}>
                            <SelectTrigger className="w-full h-[48px] rounded-[16px] border border-[rgba(124,58,237,0.15)] bg-white focus:ring-4 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] outline-none text-[14px] font-[500] text-[#111827]">
                              <SelectValue placeholder="Seller type (e.g. Manufacturer)" />
                            </SelectTrigger>
                            <SelectContent>
                              {SELLER_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                          </Select>

                          <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="w-full h-[48px] rounded-[16px] border border-[rgba(124,58,237,0.15)] bg-white focus:ring-4 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] outline-none text-[14px] font-[500] text-[#111827]">
                              <SelectValue placeholder="Main product category" />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                          </Select>

                          <div className="space-y-2 mt-4">
                            <p className="text-[11px] font-[700] uppercase tracking-widest text-[#6B7280] mb-3">Social links (optional)</p>
                            {[
                              { icon: Instagram, val: instagram, set: setInstagram, ph: "Instagram handle" },
                              { icon: Facebook, val: facebook, set: setFacebook, ph: "Facebook page URL" },
                              { icon: Linkedin, val: linkedin, set: setLinkedin, ph: "LinkedIn profile URL" },
                              { icon: Youtube, val: youtube, set: setYoutube, ph: "YouTube channel URL" },
                            ].map(({ icon: Icon, val, set, ph }) => (
                              <div key={ph} className="relative">
                                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                                <input placeholder={ph} value={val} onChange={e => set(e.target.value)} className="w-full h-[46px] px-4 pl-11 rounded-[14px] border border-[rgba(124,58,237,0.15)] bg-white focus:ring-4 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] outline-none text-[13px] font-[500] text-[#111827] placeholder:text-[#6B7280]/60 transition-all" />
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-3 pt-2">
                            <Button variant="outline" onClick={goBack} className="h-[48px] w-[48px] rounded-[16px] flex-shrink-0 border-[rgba(124,58,237,0.15)] text-[#6B7280] hover:text-[#111827] hover:bg-[#F3E8FF] transition-all"><ArrowLeft className="w-5 h-5" /></Button>
                            <Button onClick={handleRegister} disabled={isLoading} className="flex-1 h-[48px] rounded-[16px] bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-[600] text-[15px] tracking-wide border-none shadow-[0_15px_35px_rgba(124,58,237,0.35)] hover:-translate-y-[2px] hover:shadow-[0_20px_45px_rgba(124,58,237,0.45)] transition-all duration-300 relative overflow-hidden group">
                              <span className="relative z-10 flex items-center justify-center">
                                {isLoading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating...</span> : <>Launch Business <Zap className="w-4 h-4 ml-2" /></>}
                              </span>
                            </Button>
                          </div>
                        </motion.div>
                      )}

                    </AnimatePresence>

                    <p className="text-center text-[13px] text-[#6B7280] font-[500] mt-8">Already registered? <button onClick={() => switchMode("login")} className="text-[#7C3AED] font-[600] hover:underline">Sign In</button></p>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-10 pb-8 pt-0">
              <p className="text-center text-[10px] text-[#6B7280] font-[600] flex items-center justify-center gap-3 tracking-widest uppercase">
                <Lock className="w-3 h-3 text-[#A855F7]" /> SECURED · <Link to="/privacy" className="hover:text-[#7C3AED] transition-colors">PRIVACY</Link> · <Link to="/terms" className="hover:text-[#7C3AED] transition-colors">TERMS</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
