import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost/api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();

      if (data.success && data.user?.role === "admin") {
        localStorage.setItem("th_admin_user", JSON.stringify(data.user));
        toast.success("Access Granted. Command Center Initialized.");
        navigate("/admin");
      } else {
        toast.error("Unauthorized. Secure Protocol Violation Detected.");
      }
    } catch (error) {
      toast.error("Connection Error. Unable to reach authentication server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-40" />
          
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20 mb-6 group-hover:scale-110 transition-transform duration-500">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase mb-2">Command Access</h1>
            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-60 leading-relaxed">Identity Verification Matrix V4.2</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="group relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="ADMIN EMAIL ID"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full h-16 pl-16 pr-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-white font-bold tracking-tight placeholder:opacity-30"
                />
              </div>

              <div className="group relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPw ? "text" : "password"}
                  required
                  placeholder="SECURITY KEY"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-16 pl-16 pr-14 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-white font-bold tracking-widest placeholder:tracking-tight placeholder:opacity-30"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                >
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              disabled={isLoading}
              className="w-full h-16 rounded-2xl bg-primary text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all group/btn overflow-hidden relative"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2 relative z-10">
                  Execute Authorization
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 text-center">
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em] opacity-40">Unauthorized access attempts are logged and reported.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
