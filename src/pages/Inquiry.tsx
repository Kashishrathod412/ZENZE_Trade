import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2, ShieldCheck, Zap, User, Phone, Mail, Package, FileText, BarChart3, Building, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addInquiry, getProducts, getUsers } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const CustomSelect = ({ 
  icon: Icon, 
  value, 
  onChange, 
  options, 
  placeholder 
}: { 
  icon: any, 
  value: string, 
  onChange: (val: string) => void, 
  options: { label: string, value: string }[], 
  placeholder: string 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.value === value);

  return (
    <div className={`relative ${isOpen ? 'z-[60]' : 'z-30'}`}>
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 pointer-events-none" />
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full pl-12 pr-10 py-4 rounded-2xl border ${isOpen ? "border-primary/50 bg-background ring-4 ring-primary/20 text-primary" : "border-border/40 bg-background/40 dark:bg-white/5 shadow-inner hover:bg-background/60 text-muted-foreground"} outline-none text-sm transition-all cursor-pointer flex items-center justify-between group`}
      >
        <span className={selectedOption ? "text-foreground font-black uppercase tracking-widest" : "group-hover:text-foreground transition-colors"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : "group-hover:text-foreground"}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-[calc(100%+0.5rem)] left-0 w-full bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-[50] max-h-60 overflow-y-auto"
          >
            <div 
              className="px-4 py-3 hover:bg-primary/10 cursor-pointer text-sm text-muted-foreground transition-colors"
              onClick={() => { onChange(""); setIsOpen(false); }}
            >
              {placeholder}
            </div>
            {options.map(opt => (
              <div 
                key={opt.value}
                className={`px-4 py-3 hover:bg-primary/10 cursor-pointer text-sm transition-colors ${value === opt.value ? "bg-primary/5 text-primary font-black uppercase tracking-widest" : "text-foreground font-medium"}`}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
              >
                {opt.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {isOpen && (
        <div className="fixed inset-0 z-[40]" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} />
      )}
    </div>
  );
};

export default function Inquiry() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const allProducts = getProducts();
  const product = productId ? allProducts.find(p => p.id === productId) : null;
  const sellers = getUsers().filter(u => u.role === "seller");

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [productName, setProductName] = useState(product?.name || "");
  const [sellerId, setSellerId] = useState(product?.sellerId || "");
  const [sellerName, setSellerName] = useState(product?.sellerName || "");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");

  const displayedProducts = sellerId ? allProducts.filter(p => p.sellerId === sellerId) : allProducts;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !productName) {
      toast.error("Please fill all required fields");
      return;
    }
    
    const payload = {
      buyerName: name,
      buyerPhone: phone,
      buyerEmail: email,
      buyerId: user?.id,
      productName,
      description,
      quantity,
      sellerId: sellerId || undefined,
      sellerName: sellerName || undefined,
      productId: product?.id,
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
        toast.success("Elite Requirement Posted Successfully!");
        navigate("/buyer/dashboard");
      } else {
        toast.error("Failed to sync requirement to server.");
      }
    } catch (err) {
      toast.error("Failed to connect to server.");
    }
  };

  return (
    <Layout>
      <section className="py-24 bg-muted/30 min-h-screen relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary rounded-full blur-[150px]" />
        </div>

        <div className="container-wide relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left Side: Content & Trust Markers */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-4"
                >
                  Elite RFQ System
                </motion.div>
                <h1 className="font-heading text-5xl md:text-6xl font-black text-foreground tracking-tight leading-tight mb-6">
                  Post Your <br />
                  <span className="text-gradient">Industrial</span> Requirement
                </h1>
                <p className="text-lg text-muted-foreground font-medium max-w-md">
                  Connect with India's top verified manufacturers and global suppliers through the ZenzeTrade elite network.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 p-4 rounded-3xl bg-card border border-border zenze-shadow shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-wider mb-1">Verified Suppliers Only</h3>
                    <p className="text-xs text-muted-foreground">Your requirement is shared only with certified, high-tier industrial partners.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-3xl bg-card border border-border zenze-shadow shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-wider mb-1">Instant Quotes</h3>
                    <p className="text-xs text-muted-foreground">Receive competitive bids within 24 hours from pre-vetted market leaders.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-3xl bg-card border border-border zenze-shadow shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-wider mb-1">Market Analysis</h3>
                    <p className="text-xs text-muted-foreground">Receive detailed industry insights and pricing trends for your requirement.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side: The Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/60 dark:bg-black/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/40 dark:border-white/10 p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative"
            >
              <div className="absolute top-0 right-12 -translate-y-1/2 w-24 h-24 rounded-full bg-primary/90 backdrop-blur-md shadow-[0_0_25px_rgba(139,92,246,0.5)] border border-white/20 flex items-center justify-center text-white animate-bounce-slow">
                <Send className="w-8 h-8" />
              </div>

              <div className="mb-10 pt-4">
                <h2 className="text-2xl font-black text-foreground mb-2 tracking-tight">Build Your Order</h2>
                <p className="text-sm text-muted-foreground font-medium">Precision sourcing for the modern economy.</p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input type="text" placeholder="Full Name *" value={name} onChange={e => setName(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border/40 bg-background/40 dark:bg-white/5 shadow-inner focus:bg-background focus:ring-4 focus:ring-primary/20 focus:border-primary/50 outline-none text-sm transition-all" />
                  </div>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input type="tel" placeholder="Phone Number *" value={phone} onChange={e => setPhone(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border/40 bg-background/40 dark:bg-white/5 shadow-inner focus:bg-background focus:ring-4 focus:ring-primary/20 focus:border-primary/50 outline-none text-sm transition-all" />
                  </div>
                </div>

                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input type="email" placeholder="Business Email (Optional)" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border/40 bg-background/40 dark:bg-white/5 shadow-inner focus:bg-background focus:ring-4 focus:ring-primary/20 focus:border-primary/50 outline-none text-sm transition-all" />
                </div>

                <CustomSelect 
                  icon={Building}
                  value={sellerId}
                  onChange={(val) => {
                    setSellerId(val);
                    if (val) {
                      setSellerName(sellers.find(s => s.id === val)?.name || "");
                    } else {
                      setSellerName("");
                    }
                  }}
                  options={sellers.map(s => ({ label: s.name, value: s.id }))}
                  placeholder="Select Target Company (Optional)"
                />

                <CustomSelect 
                  icon={Package}
                  value={productName}
                  onChange={(val) => {
                    setProductName(val);
                    const selectedP = allProducts.find(p => p.name === val);
                    if (selectedP && !sellerId) {
                        setSellerId(selectedP.sellerId);
                        setSellerName(selectedP.sellerName);
                    }
                  }}
                  options={displayedProducts.map(p => ({ label: p.name, value: p.name }))}
                  placeholder="Select a Product / Service *"
                />

                <div className="relative group">
                  <FileText className="absolute left-4 top-5 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <textarea placeholder="Describe your technical specifications..." rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border/40 bg-background/40 dark:bg-white/5 shadow-inner focus:bg-background focus:ring-4 focus:ring-primary/20 focus:border-primary/50 outline-none text-sm transition-all resize-none" />
                </div>

                <div className="relative group">
                  <BarChart3 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input type="text" placeholder="Expected Quantity (e.g., 500 Units)" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border/40 bg-background/40 dark:bg-white/5 shadow-inner focus:bg-background focus:ring-4 focus:ring-primary/20 focus:border-primary/50 outline-none text-sm transition-all" />
                </div>

                <div className="pt-4">
                  <Button size="lg" className="w-full h-16 rounded-2xl gradient-primary text-white font-black text-sm tracking-[0.2em] border-t border-white/20 shadow-lg hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(139,92,246,0.3)] transition-all duration-300">
                    BROADCAST TO ELITE NETWORK
                  </Button>
                </div>

                <p className="text-[9px] text-center text-muted-foreground/60 font-bold uppercase tracking-[0.3em] mt-6">
                  Secure Sourcing Powered by ZenzeTrust™
                </p>
              </form>
            </motion.div>

          </div>
        </div>
      </section>
    </Layout>
  );
}
