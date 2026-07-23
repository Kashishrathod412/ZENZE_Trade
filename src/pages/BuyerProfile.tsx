import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { getUsers, getOrCreateChatRoom, getCurrentUser } from "@/lib/storage";
import { 
    User as UserIcon, 
    Mail, 
    Phone, 
    MapPin, 
    ShieldCheck, 
    MessageSquare,
    ChevronLeft,
    Clock,
    Zap,
    Globe
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function BuyerProfile() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const currentUser = getCurrentUser();
    
    const buyer = getUsers().find(u => u.id === id);

    if (!buyer) return (
        <Layout>
            <div className="container py-40 text-center">
                <h1 className="text-4xl font-black uppercase">Profile Expunged</h1>
                <p className="text-muted-foreground mt-4">Node identifier not found in marketplace registry.</p>
                <Button onClick={() => navigate(-1)} className="mt-8 rounded-xl px-8 h-12 gradient-primary text-white font-black uppercase tracking-widest text-[10px]">Back to Matrix</Button>
            </div>
        </Layout>
    );

    const handleStartChat = () => {
        if (!currentUser) {
            toast.error("Login required for node-to-node comms");
            navigate("/login");
            return;
        }
        const room = getOrCreateChatRoom(currentUser.id, buyer.id, {
            type: "general",
            id: buyer.id,
            title: `Direct: ${buyer.name}`
        });
        navigate(currentUser.role === 'buyer' ? '/buyer/dashboard' : '/seller/dashboard');
    };

    return (
        <Layout>
            <div className="bg-[#f8fafc] dark:bg-background min-h-screen pb-20">
                {/* Header/Cover */}
                <div className="h-64 md:h-80 gradient-primary relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                    <button 
                        onClick={() => navigate(-1)}
                        className="absolute top-8 left-8 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"
                    >
                        <ChevronLeft className="w-4 h-4" /> Go Back
                    </button>
                </div>

                <div className="container max-w-5xl -mt-32 relative z-10">
                    <div className="flex flex-col md:flex-row gap-10">
                        {/* Sidebar */}
                        <div className="w-full md:w-80 space-y-6">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-card border border-border rounded-[2.5rem] p-8 shadow-xl text-center"
                            >
                                <div className="w-32 h-32 rounded-[2.5rem] gradient-primary mx-auto mb-6 flex items-center justify-center text-white font-black text-4xl shadow-xl shadow-primary/20 border-4 border-white dark:border-card">
                                    {buyer.name.charAt(0)}
                                </div>
                                <h1 className="text-2xl font-black uppercase tracking-tighter text-foreground leading-none">{buyer.name}</h1>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-3 flex items-center justify-center gap-2">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Verified Buyer Node
                                </p>
                                <div className="mt-8 flex flex-col gap-3">
                                    <Button onClick={handleStartChat} className="w-full h-14 rounded-2xl gradient-primary text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all gap-2">
                                        <MessageSquare className="w-4 h-4" /> Transmit Message
                                    </Button>
                                    <Button variant="outline" className="w-full h-14 rounded-2xl border-2 border-border font-black uppercase tracking-widest text-[10px] gap-2">
                                        <Zap className="w-4 h-4 text-primary" /> Request Intel
                                    </Button>
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white dark:bg-card border border-border rounded-[2.5rem] p-8 shadow-sm space-y-6"
                            >
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Network Coordinates</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-xs font-bold text-foreground">
                                            <Mail className="w-4 h-4 text-primary" /> {buyer.email}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs font-bold text-foreground">
                                            <Phone className="w-4 h-4 text-primary" /> {buyer.phone || "Not Disclosed"}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs font-bold text-foreground">
                                            <MapPin className="w-4 h-4 text-primary" /> {buyer.country || "Global Node"}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 space-y-8">
                             <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white dark:bg-card border border-border rounded-[3rem] p-12 shadow-sm"
                             >
                                <div className="mb-10">
                                   <h2 className="text-3xl font-black uppercase tracking-tighter">Buyer Overview</h2>
                                   <div className="w-20 h-1.5 bg-primary mt-4 rounded-full" />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-8 rounded-[2rem] bg-muted/20 border border-transparent hover:border-border transition-all">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Registration Status</p>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                                <ShieldCheck className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black uppercase tracking-tight">Active Matrix Node</h4>
                                                <p className="text-[10px] font-bold text-muted-foreground">ID Verified for Trade</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8 rounded-[2rem] bg-muted/20 border border-transparent hover:border-border transition-all">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Trade Activity</p>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                                <Clock className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black uppercase tracking-tight">Frequent Negotiator</h4>
                                                <p className="text-[10px] font-bold text-muted-foreground">Active in Industrial Sectors</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 p-10 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden group">
                                    <div className="relative z-10">
                                        <h3 className="text-xl font-black uppercase tracking-tight mb-4">Professional Trade Profile</h3>
                                        <p className="text-white/60 text-sm leading-relaxed max-w-lg italic">
                                            This node is part of the ZenzeTrade verified buyer network. All negotiations conducted through the platform are encrypted and archived for regulatory compliance and trade security.
                                        </p>
                                        <div className="mt-8 flex items-center gap-4">
                                            <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                                <Globe className="w-3.5 h-3.5" /> Global Access
                                            </div>
                                            <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Secure Transit
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-1000">
                                        <UserIcon className="w-48 h-48" />
                                    </div>
                                </div>
                             </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
