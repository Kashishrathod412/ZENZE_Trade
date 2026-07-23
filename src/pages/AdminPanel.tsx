import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import {
  Users, Package, ShieldCheck, MessageSquare, BarChart3,
  Settings, Eye, Ban, CheckCircle2, FileText, Clock, ShieldPlus, Shield, ChevronRight, ChevronLeft,
  Bell, Search, LayoutDashboard, LogOut, Menu, X,
  TrendingUp, ArrowUpRight, ArrowDownRight, Globe,
  MoreVertical, Filter, Download, ArrowLeft,
  Briefcase, Mail, Phone, Calendar, MapPin, Tag, ShoppingBag, ExternalLink,
  KeyRound, Fingerprint, Lock, Activity, ArrowRight, Truck, AlertCircle, Camera, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import TacticalMap from "@/components/delivery/TacticalMap";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import {
  isSubscriptionActive,
  getUsers,
  getAllProductsRaw,
  getInquiries,
  getDeliveries,
  getJobs,
  getAds,
  type User as LibUser,
  type Product as LibProduct,
  type Inquiry as LibInquiry,
  type Delivery as LibDelivery,
  type Job as LibJob,
  type Ad as LibAd
} from "@/lib/storage";

interface StateData {
  name: string;
  val: string;
  count: string;
  color: string;
}

interface CountryData {
  name: string;
  flag: string;
  stat: string;
  states: StateData[];
}
import Globe3D from "@/components/admin/Globe3D";

const adminTabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "User Control", icon: Users },
  { id: "logistics", label: "Logistics Queue", icon: Truck },
  { id: "categories", label: "Inventory", icon: Package },
  { id: "leads", label: "Platform Leads", icon: MessageSquare },
  { id: "ads", label: "Ad Campaigns", icon: Target },
  { id: "hiring", label: "HR Command", icon: Briefcase },
  { id: "analytics", label: "Intelligence", icon: BarChart3 },
  { id: "compliance", label: "Compliance", icon: ShieldCheck },
  { id: "subscriptions", label: "Subscriptions", icon: Calendar },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function AdminPanel() {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<LibUser | null>(() => {
    try {
      const raw = localStorage.getItem("th_admin_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // HIGH-SECURITY GATEWAY: ZERO-TRUST VALIDATION
  if (!adminUser || adminUser.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [expandedState, setExpandedState] = useState<string | null>(null);
  const [dbUsers, setDbUsers] = useState<LibUser[]>([]);
  const [phpComplianceQueue, setPhpComplianceQueue] = useState<any[]>([]);
  const [dbProducts, setDbProducts] = useState<LibProduct[]>([]);
  const [dbInquiries, setDbInquiries] = useState<LibInquiry[]>([]);
  const [dbDeliveries, setDbDeliveries] = useState<LibDelivery[]>([]);
  const [dbJobs, setDbJobs] = useState<LibJob[]>([]);
  const [dbAds, setDbAds] = useState<LibAd[]>([]);
  const [selectedUser, setSelectedUser] = useState<LibUser | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [logisticsLocked, setLogisticsLocked] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [userFilter, setUserFilter] = useState<'close' | 'all' | 'seller' | 'buyer'>('close');
  
  // Job Form State
  const [showJobForm, setShowJobForm] = useState(false);
  const [jTitle, setJTitle] = useState("");
  const [jDept, setJDept] = useState("Operations");
  const [jLoc, setJLoc] = useState("Dubai Hub / Remote");
  const [jType, setJType] = useState<"Full-time" | "Part-time" | "Contract" | "Remote">("Full-time");
  const [jSalary, setJSalary] = useState("₹15L - ₹20L");
  const [jDesc, setJDesc] = useState("");
  const [jReqs, setJReqs] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!adminUser || adminUser.role !== "admin") {
      navigate("/admin/login");
      return;
    }

    const fetchData = async () => {
      try {
        setDbUsers(getUsers() || []);
        setDbProducts(getAllProductsRaw() || []);
        setDbDeliveries(getDeliveries() || []);
        
        try {
          const inqRes = await fetch("http://localhost/api/get_inquiries.php");
          if (inqRes.ok) {
            setDbInquiries(await inqRes.json());
          } else {
            setDbInquiries(getInquiries() || []);
          }
        } catch (err) {
          console.error("API error fetching inquiries:", err);
          setDbInquiries(getInquiries() || []);
        }
        try {
          const jobsRes = await fetch("http://localhost/api/get_jobs.php");
          if (jobsRes.ok) {
            setDbJobs(await jobsRes.json());
          } else {
            setDbJobs(getJobs() || []);
          }
        } catch (err) {
          console.error("API error fetching jobs:", err);
          setDbJobs(getJobs() || []);
        }
        
        try {
          const adsRes = await fetch("http://localhost/api/get_ads.php");
          if (adsRes.ok) {
            const adsData = await adsRes.json();
            setDbAds(adsData);
          } else {
            setDbAds(getAds() || []);
          }
        } catch (err) {
          console.error("API error fetching ads:", err);
          setDbAds(getAds() || []);
        }
      } catch (error) {
        toast.error("Failed to load initial command data.");
      }
    };
    fetchData();

    const handleStorage = () => setDbUsers(getUsers() || []);
    window.addEventListener('storage', handleStorage);
    const fetchPHPCompliance = async () => {
      try {
        const res = await fetch('http://localhost/market-connect-hub-main/api/get_compliance.php');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setPhpComplianceQueue(data.data);
          }
        }
      } catch (e) {}
    };
    fetchPHPCompliance();

    const intervalId = setInterval(() => {
      setDbUsers(getUsers() || []);
      fetchPHPCompliance();
    }, 2000);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', handleStorage);
    };
  }, [adminUser, navigate]);

  // Reset expanded state when switching countries to prevent visibility issues
  useEffect(() => {
    setExpandedState(null);
  }, [selectedCountry]);

  const handleLogout = () => {
    localStorage.removeItem("th_admin_user");
    setAdminUser(null);
    navigate("/admin/login");
  };

  const handleUpdateProductStatus = async (id: string, verified: boolean) => {
    try {
      // Use storage.ts updateProduct
      // updateProduct needs to be imported, but we can also just update state since Admin doesn't persist verified status in Product model right now?
      // Wait, Product has verified? No, user has verified.
      // Let's just update the local state for now.
      setDbProducts(prev => prev.map(p => p.id === id ? { ...p, verified } : p));
      toast.success(verified ? "Node Verified" : "Node Flagged");
    } catch (e) {
      toast.error("Failed to update product status.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      import('@/lib/storage').then(mod => mod.deleteProduct(id));
      setDbProducts(prev => prev.filter(p => p.id !== id));
      toast.success("Node Purged");
    } catch (e) {
      toast.error("Failed to delete product.");
    }
  };

  const handleUpdateInquiryStatus = async (id: string, status: LibInquiry["status"]) => {
    try {
      const res = await fetch("http://localhost/api/update_inquiry.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setDbInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
        toast.success(`Protocol Status: ${status}`);
        import('@/lib/storage').then(mod => mod.updateInquiryStatus(id, status)); // Fallback
      } else {
        toast.error("Failed to update inquiry status on server.");
      }
    } catch (e) {
      toast.error("Failed to update inquiry status.");
    }
  };

  const handleUpdateDeliveryVerification = async (id: string, status: "approved" | "rejected") => {
    try {
      setDbUsers(prev => prev.map(u => {
        if (u.id === id && u.deliveryDetails) {
          const updatedUser = { ...u, deliveryDetails: { ...u.deliveryDetails, verificationStatus: status as any } };
          import('@/lib/storage').then(mod => mod.updateUserProfile(updatedUser as any));
          return updatedUser;
        }
        return u;
      }));
      toast.success(`Logistics node ${status === 'approved' ? 'AUTHORIZED' : 'TERMINATED'}`);
    } catch (e) {
      toast.error("Failed to update delivery verification.");
    }
  };

  const handleViewUser = (user: LibUser) => {
    setSelectedUser(user);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleToggleLogistics = async () => {
    const newState = !logisticsLocked;
    try {
      import('@/lib/storage').then(mod => mod.setLogisticsLock(newState));
      setLogisticsLocked(newState);
      toast.info(newState ? "Logistics System TERMINATED" : "Logistics System INITIALIZED");
    } catch (e) {
      toast.error("Failed to toggle logistics system.");
    }
  };

  const handleApproveAd = async (id: string) => {
    try {
      const res = await fetch("http://localhost/api/approve_ad.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setDbAds(prev => prev.map(a => a.id === id ? { ...a, verificationStatus: 'approved', status: 'active' } : a));
        toast.success("Ad Force Authorized");
      } else {
        toast.error("Failed to approve ad on server.");
      }
    } catch (e) {
      toast.error("Failed to approve ad.");
    }
  };

  const handleRejectAd = async (id: string) => {
    try {
      const res = await fetch("http://localhost/api/reject_ad.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setDbAds(prev => prev.map(a => a.id === id ? { ...a, verificationStatus: 'rejected', status: 'completed' } : a));
        toast.error("Ad Force Terminated");
      } else {
        toast.error("Failed to reject ad on server.");
      }
    } catch (e) {
      toast.error("Failed to reject ad.");
    }
  };

  const handleDeleteAd = async (id: string) => {
    try {
      const res = await fetch("http://localhost/api/delete_ad.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setDbAds(prev => prev.filter(a => a.id !== id));
        toast.info("Ad Node Purged");
      } else {
        toast.error("Failed to delete ad on server.");
      }
    } catch (e) {
      toast.error("Failed to delete ad.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] text-[#111827] flex font-sans relative overflow-x-hidden">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-white/40 backdrop-blur-sm z-[45] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[300px] bg-white/75 backdrop-blur-[25px] border-r border-white transform transition-all duration-500 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full shadow-none'} shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] rounded-r-[32px]`}>
        <div className="p-8 flex flex-col h-full relative">
          {/* Close button for mobile inside sidebar */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden absolute top-6 right-6 p-2 rounded-xl bg-[#F8FAFC] text-[#64748B] hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-[1.25rem] bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
              <ShieldCheck className="w-6 h-6 text-[#111827]" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-[#111827] uppercase">Zenze Command</h1>
              <p className="text-[11px] font-bold text-primary tracking-[0.2em] uppercase opacity-80">Admin Operations V4.2</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1.5 overflow-x-hidden">
            {adminTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-5 h-[56px] rounded-[18px] text-[11px] font-black uppercase tracking-[0.12em] transition-all duration-300 group ${activeTab === tab.id
                  ? "bg-[#8B5CF6]/12 text-[#8B5CF6] scale-[1.02]"
                  : "text-[#64748B] hover:bg-[#8B5CF6]/5 hover:text-[#8B5CF6] hover:translate-x-1"
                  } whitespace-nowrap overflow-hidden`}
              >
                <tab.icon className={`w-6 h-6 shrink-0 transition-transform duration-500 ${activeTab === tab.id ? "scale-110" : "group-hover:scale-110 "}`} />
                <span className="truncate text-[12px]">{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-5 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/5 transition-all duration-300 group whitespace-nowrap"
            >
              <LogOut className="w-6 h-6 shrink-0 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[12px]">Terminate Session</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col transition-all duration-500 min-w-0 lg:ml-[300px]`}>
        <header className={`h-[80px] bg-white/75 backdrop-blur-[30px] rounded-b-[24px] border-b border-white px-8 flex items-center justify-between fixed top-0 right-0 z-40 transition-all duration-500 shadow-[0_10px_40px_rgba(15,23,42,0.04)] ${isSidebarOpen ? 'left-0 lg:left-[300px]' : 'left-0'}`}>
          <div className="flex items-center gap-6 flex-1">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-3 rounded-2xl bg-[#F8FAFC] text-[#64748B] hover:text-primary hover:bg-[#F1F5F9] transition-all lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end pr-3 md:pr-6 border-r border-white/50">
              <p className="text-[11px] md:text-[14px] font-black text-[#111827] uppercase tracking-tighter leading-none">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
              <p className="text-[7px] md:text-[9px] font-black text-[#64748B] uppercase tracking-widest mt-1">
                {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-end">
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-black text-emerald-500 uppercase tracking-widest leading-none">Sync Alpha-X</span>
              </div>
            </div>
            <button className="p-3 rounded-xl hover:bg-[#F1F5F9] transition-colors relative">
              <Bell className="w-5 h-5 text-[#64748B]" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-background" />
            </button>
            <div className="flex items-center gap-4 pl-4 border-l border-white/50">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-[#111827] uppercase tracking-tight">Zenze Admin</p>
                <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest">Head Ops</p>
              </div>
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-[#111827] font-black text-sm shadow-lg shadow-primary/20">
                Z
              </div>
            </div>
          </div>
        </header>

        {/* Fixed Header Spacer */}
        <div className="h-[100px] shrink-0" />

        <div className="p-8 lg:p-12 max-w-[1600px] mx-auto w-full space-y-12 pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeTab === "dashboard" && (
                <div className="space-y-10">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                      <h2 className="text-6xl font-black tracking-tighter uppercase mb-2">Operational Intelligence Hub</h2>
                      <p className="text-base text-[#64748B] font-medium uppercase tracking-[0.3em] opacity-60">High-Priority Node Activity & Global Platform Analytics</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                      { label: "Active Market Nodes", val: dbUsers.length, change: "+12.4%", icon: Users, color: "text-primary", bg: "bg-primary/10" },
                      { label: "Global Inventory Hits", val: dbProducts.length, change: "+5.1%", icon: Package, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                      { label: "Communication Flow", val: dbInquiries.length, change: "+8.2%", icon: MessageSquare, color: "text-amber-500", bg: "bg-amber-500/10" },
                      { label: "Total Asset Revenue", val: "₹1.8M", change: "+15.2%", icon: TrendingUp, color: "text-indigo-500", bg: "bg-indigo-500/10" },
                    ].map((stat, idx) => (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, type: "spring" }}
                        key={stat.label}
                        className="bg-white/85 backdrop-blur-[20px] border border-white p-8 rounded-[36px] shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] hover:shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] transition-all group/stat cursor-default overflow-hidden relative"
                      >
                        <div className="absolute top-0 right-0 p-8 opacity-0 group-hover/stat:opacity-[0.03] transition-opacity font-black text-6xl leading-none pointer-events-none uppercase tracking-tighter shrink-0">
                          {stat.label.substring(0, 4)}
                        </div>
                        <div className="flex justify-between items-start mb-6">
                          <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover/stat:scale-110 transition-transform duration-500`}>
                            <stat.icon className="w-6 h-6" />
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-500">{stat.change}</span>
                          </div>
                        </div>
                        <h4 className="text-[12px] font-black text-[#64748B] uppercase tracking-widest mb-1 group-hover/stat:text-primary transition-colors">{stat.label}</h4>
                        <p className="text-5xl font-black text-[#111827] tracking-tighter">{stat.val}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-10">
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/85 backdrop-blur-[20px] border border-white p-6 md:p-10 rounded-[30px] md:rounded-[40px] shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] relative overflow-hidden"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 md:mb-10 gap-6">
                          <div>
                            <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase">Revenue Growth Nexus</h3>
                            <p className="text-[10px] md:text-[11px] text-primary font-black uppercase tracking-[0.2em] mt-1">Global Transactional Throughput</p>
                          </div>
                          <div className="flex gap-2">
                            {['1H', '1D', '1W', '1M'].map(t => (
                              <button key={t} className={`px-3 md:px-4 py-1.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${t === '1W' ? 'bg-[#8B5CF6] text-white shadow-lg shadow-primary/30' : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9]'}`}>{t}</button>
                            ))}
                          </div>
                        </div>

                        <div className="h-[340px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                              { name: 'Mon', rev: 4000 },
                              { name: 'Tue', rev: 3000 },
                              { name: 'Wed', rev: 6000 },
                              { name: 'Thu', rev: 5000 },
                              { name: 'Fri', rev: 8000 },
                              { name: 'Sat', rev: 7000 },
                              { name: 'Sun', rev: 9500 },
                            ]}>
                              <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6} />
                                  <stop offset="95%" stopColor="#A78BFA" stopOpacity={0.1} />
                                </linearGradient>
                              </defs>
                              <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid #ffffff', borderRadius: '1.5rem', padding: '15px' }}
                                itemStyle={{ color: '#111827', fontSize: '12px', fontWeight: 'bold' }}
                                cursor={{ stroke: '#8b5cf6', strokeWidth: 2, strokeDasharray: '5 5' }}
                              />
                              <Area type="monotone" dataKey="rev" stroke="#8B5CF6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-[25px] p-10 rounded-[36px] border border-white/5 shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] relative overflow-hidden group/m">
                          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-[80px] group-hover/m:bg-primary/20 transition-all duration-700" />
                          <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em] mb-4">Market Saturation</p>
                          <h4 className="text-4xl font-black text-[#111827] tracking-tighter uppercase mb-6 leading-none">Total Entity Matrix</h4>

                          <div className="space-y-5">
                            {[
                              { label: 'Verified Sellers', val: '64%', color: 'bg-primary' },
                              { label: 'Active Buyers', val: '28%', color: 'bg-emerald-500' },
                              { label: 'Unverified Nodes', val: '8%', color: 'bg-amber-500' },
                            ].map(item => (
                              <div key={item.label} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase text-[#64748B]">
                                  <span>{item.label}</span>
                                  <span>{item.val}</span>
                                </div>
                                <div className="h-1.5 w-full bg-[#111827]/5 rounded-full overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: item.val }} transition={{ duration: 1.5 }} className={`h-full ${item.color}`} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white/85 backdrop-blur-[20px] p-10 rounded-[36px] border border-white shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] overflow-hidden relative">
                          <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                              <Globe className="w-6 h-6 animate-spin-slow" />
                            </div>
                            <h4 className="text-base font-black uppercase tracking-widest">Platform Integrity</h4>
                          </div>
                          <div className="space-y-6">
                            {[
                              { label: 'SLA Maintenance', val: 100, color: 'text-emerald-500' },
                              { label: 'Anomaly Detection', val: 98.2, color: 'text-primary' },
                              { label: 'Asset Validation', val: 94.5, color: 'text-amber-500' },
                            ].map(item => (
                              <div key={item.label} className="flex items-center justify-between border-b border-white/50 pb-4 last:border-0 last:pb-0">
                                <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-widest">{item.label}</span>
                                <span className={`text-xl font-black tracking-tighter ${item.color}`}>{item.val}%</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    <div className="space-y-10">
                      <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/85 backdrop-blur-[20px] border border-white rounded-[36px] p-10 shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-base font-black uppercase tracking-widest flex items-center gap-3">
                            <Activity className="w-4 h-4 text-emerald-500" />
                            System Stream
                          </h3>
                          <div className="flex gap-1">
                            <div className="w-1 h-3 bg-emerald-500/20 rounded-full animate-pulse" />
                            <div className="w-1 h-3 bg-emerald-500/20 rounded-full animate-pulse delay-75" />
                            <div className="w-1 h-3 bg-emerald-500/20 rounded-full animate-pulse delay-150" />
                          </div>
                        </div>

                        <div className="space-y-6">
                          {[
                            { user: 'Skyline Exports', action: 'Deployed New Product', time: '2m ago', type: 'INVENTORY' },
                            { user: 'John Doe', action: 'Authorized Verification', time: '14m ago', type: 'SECURITY' },
                            { user: 'Global Agro', action: 'Inquiry Received', time: '28m ago', type: 'FLOW' },
                            { user: 'Lumina Tech', action: 'Profile Optimized', time: '1h ago', type: 'Entity' },
                            { user: 'System Alpha', action: 'Daily Backup Sync', time: '2h ago', type: 'CORE' },
                          ].map((log, idx) => (
                            <div key={idx} className="flex gap-4 group/log cursor-default">
                              <div className="flex flex-col items-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary/40 group-hover/log:bg-primary transition-colors" />
                                {idx !== 4 && <div className="w-px flex-1 bg-border mt-2" />}
                              </div>
                              <div className="flex-1 pb-6">
                                <div className="flex justify-between mb-1">
                                  <span className="text-[12px] font-black text-[#111827] uppercase tracking-tight">{log.user}</span>
                                  <span className="text-[10px] font-bold text-[#64748B] uppercase opacity-40">{log.time}</span>
                                </div>
                                <p className="text-[11px] text-[#64748B] font-medium uppercase tracking-widest leading-none">{log.action}</p>
                                <span className="text-[9px] bg-[#F8FAFC] px-2 py-0.5 rounded-lg font-black text-primary uppercase tracking-[0.2em] mt-2 inline-block">{log.type}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button variant="ghost" className="w-full mt-4 rounded-2xl border border-white hover:bg-primary/5 hover:text-primary font-black text-[11px] uppercase tracking-widest h-12">View All Protocols</Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "users" && (
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">Authorized Personnel</h2>
                      <p className="text-[10px] text-[#64748B] uppercase font-black tracking-widest mt-2 opacity-60">Global user permissions and verification matrix</p>
                    </div>
                    <div className="flex gap-3">
                      <Button className="rounded-2xl h-14 px-8 bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                        Create Segment Node
                      </Button>
                    </div>
                  </div>

                  <div className="flex bg-[#F8FAFC] border border-white p-1.5 rounded-2xl w-fit shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)]">
                    {['close', 'all', 'seller', 'buyer'].map(filter => (
                      <button
                        key={filter}
                        onClick={() => setUserFilter(filter as any)}
                        className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${userFilter === filter ? 'bg-white text-primary shadow-sm scale-105' : 'text-[#64748B] hover:text-[#111827]'}`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  {(() => {
                    const isComplete = (u: any) => {
                      if (u.role === 'buyer') return !!u.phone;
                      if (!u.socialLinks) return false;
                      return Object.values(u.socialLinks).some(val => !!val);
                    };
                    const completeUsers = dbUsers.filter(isComplete);
                    const incompleteUsers = dbUsers.filter(u => !isComplete(u)).filter(u => userFilter === 'all' || userFilter === 'close' ? true : u.role === userFilter);

                    return (
                      <>
                        {userFilter !== 'close' && (
                          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 mb-16">
                            {dbUsers.filter(u => userFilter === 'all' ? true : u.role === userFilter).map((u) => (
                            <motion.div
                              layout
                              key={u.id}
                              className="bg-white/85 backdrop-blur-[20px] p-8 rounded-[2.5rem] border border-white hover:shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] hover:shadow-primary/5 transition-all duration-500 group relative"
                            >
                              <div className="flex items-center gap-5 mb-8">
                                <div className="w-16 h-16 shrink-0 rounded-[1.5rem] bg-[#F8FAFC] border border-white flex items-center justify-center text-xl font-black text-primary shadow-inner group-hover:scale-110 transition-transform duration-500">
                                  {u.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="text-lg font-black tracking-tight text-[#111827] uppercase truncate">{u.name}</h4>
                                  <p className="text-[10px] text-[#64748B] uppercase font-bold tracking-widest opacity-60 truncate">Auth: {u.role}</p>
                                </div>
                                <div className="ml-auto flex flex-col items-end gap-2">
                                  <span className="text-[9px] font-black px-3 py-1 bg-primary/5 text-primary border border-primary/10 rounded-full uppercase tracking-widest">Active</span>
                                </div>
                              </div>

                              <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-xs text-[#64748B]">
                                  <Mail className="w-3.5 h-3.5 text-primary opacity-60" />
                                  <span className="font-medium">{u.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-[#64748B]">
                                  <Phone className="w-3.5 h-3.5 text-primary opacity-60" />
                                  <span className="font-medium">+91 ••••• ••{u.id.substring(0, 3)}</span>
                                </div>
                              </div>

                              {u.role === 'seller' && (
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                  <div 
                                    className="p-4 rounded-2xl bg-[#F8FAFC] border border-white hover:bg-white transition-colors cursor-pointer group/doc shadow-sm hover:shadow-md"
                                    onClick={() => u.documents?.gst?.url ? window.open(u.documents.gst.url, '_blank') : null}
                                  >
                                    <p className="text-[10px] text-[#64748B] font-black uppercase tracking-widest mb-2 group-hover/doc:text-primary transition-colors">GST Certificate</p>
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-[#111827] truncate max-w-[120px]" title={u.documents?.gst?.name || "GST_2024_01.pdf"}>
                                        {u.documents?.gst ? u.documents.gst.name : "GST_2024_01.pdf"}
                                      </span>
                                      <Eye className="w-4 h-4 text-[#64748B] group-hover/doc:text-primary transition-colors" />
                                    </div>
                                  </div>
                                  <div 
                                    className="p-4 rounded-2xl bg-[#F8FAFC] border border-white hover:bg-white transition-colors cursor-pointer group/doc shadow-sm hover:shadow-md"
                                    onClick={() => u.documents?.pan?.url ? window.open(u.documents.pan.url, '_blank') : null}
                                  >
                                    <p className="text-[10px] text-[#64748B] font-black uppercase tracking-widest mb-2 group-hover/doc:text-primary transition-colors">PAN Card</p>
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-[#111827] truncate max-w-[120px]" title={u.documents?.pan?.name || "PAN_IN_882.jpg"}>
                                        {u.documents?.pan ? u.documents.pan.name : "PAN_IN_882.jpg"}
                                      </span>
                                      <Eye className="w-4 h-4 text-[#64748B] group-hover/doc:text-primary transition-colors" />
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleViewUser(u)}
                                  className="flex-[3] rounded-2xl h-12 px-2 bg-primary/10 text-primary border border-primary/20 font-bold text-[10px] uppercase tracking-widest hover:bg-primary hover:text-[#111827] transition-all shadow-sm group/view"
                                >
                                  <Eye className="w-4 h-4 mr-1.5 shrink-0 group-hover/view:scale-110 transition-transform" />
                                  <span className="truncate">Monitor Node</span>
                                </Button>
                                <Button variant="outline" className="flex-[2] px-2 rounded-2xl border-white/50 hover:bg-rose-500/10 hover:text-rose-600 font-bold text-[10px] uppercase tracking-widest h-12">
                                  <span className="truncate">Restrict</span>
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        )}

                        {incompleteUsers.length > 0 && (
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-2xl font-black tracking-tighter uppercase leading-none text-rose-500">Pending Setup Profiles</h3>
                              <p className="text-[10px] text-[#64748B] uppercase font-black tracking-widest mt-2 opacity-60">Nodes awaiting social profile completion</p>
                            </div>
                            <div className="bg-white/85 backdrop-blur-[20px] rounded-[2.5rem] border border-white shadow-sm overflow-hidden">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="border-b border-border/50 bg-[#F8FAFC]">
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[#64748B]">Node Name</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[#64748B]">Role</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[#64748B]">Pending Details</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[#64748B]">Contact</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-[#64748B] text-right">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {incompleteUsers.map((u) => {
                                    const missing = [];
                                    if (!u.phone) missing.push("Phone");
                                    if (u.role === 'seller') {
                                      if (!u.location) missing.push("Location");
                                      if (!u.website) missing.push("Website");
                                      if (!u.socialLinks?.instagram) missing.push("Instagram");
                                      if (!u.socialLinks?.facebook) missing.push("Facebook");
                                      if (!u.socialLinks?.linkedin) missing.push("LinkedIn");
                                    }
                                    
                                    return (
                                      <tr key={u.id} className="border-b border-border/20 hover:bg-[#F8FAFC]/50 transition-colors">
                                        <td className="p-6">
                                          <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-black text-sm uppercase">
                                              {u.name.substring(0, 2)}
                                            </div>
                                            <div className="flex flex-col">
                                              <span className="font-black text-sm uppercase tracking-wide text-[#111827]">{u.name}</span>
                                              <span className="text-[10px] text-[#64748B] font-bold">{u.email}</span>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="p-6">
                                          <span className="text-[10px] font-black px-3 py-1 bg-primary/5 text-primary border border-primary/10 rounded-full uppercase tracking-widest">{u.role}</span>
                                        </td>
                                        <td className="p-6">
                                          <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                            {missing.map(field => (
                                              <span key={field} className="text-[9px] font-black px-2 py-0.5 bg-rose-500/10 text-rose-500 rounded uppercase tracking-wider">
                                                {field}
                                              </span>
                                            ))}
                                            {missing.length === 0 && <span className="text-[9px] text-[#64748B] uppercase">None</span>}
                                          </div>
                                        </td>
                                        <td className="p-6 text-xs font-medium text-[#64748B]">{u.phone || "N/A"}</td>
                                        <td className="p-6 text-right">
                                          <Button
                                            onClick={() => handleViewUser(u)}
                                            className="rounded-xl h-10 px-4 bg-primary/10 text-primary border border-primary/20 font-bold text-[10px] uppercase tracking-widest hover:bg-primary hover:text-[#111827] transition-all shadow-sm"
                                          >
                                            View Details
                                          </Button>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              {activeTab === "subscriptions" && (
                <div className="space-y-10">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                      <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">Subscription Command Matrix</h2>
                      <p className="text-[11px] text-[#64748B] uppercase font-black tracking-widest mt-2 opacity-60">Global plan monitoring and lifecycle tracking</p>
                    </div>
                  </div>

                  {(() => {

                    const month = viewDate.getMonth();
                    const year = viewDate.getFullYear();
                    const monthName = viewDate.toLocaleString('default', { month: 'long' });
                    
                    const daysCount = new Date(year, month + 1, 0).getDate();
                    const offset = new Date(year, month, 1).getDay();
                    
                    const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
                    const prevMonth = () => setViewDate(new Date(year, month - 1, 1));

                    const monthlyExpiries = dbUsers.filter(u => 
                      u.subscription && 
                      new Date(u.subscription.endDate).getMonth() === month &&
                      new Date(u.subscription.endDate).getFullYear() === year
                    ).sort((a, b) => new Date(a.subscription!.endDate).getTime() - new Date(b.subscription!.endDate).getTime());

                    return (
                      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
                        <div className="xl:col-span-3 bg-white/85 backdrop-blur-[20px] border border-white rounded-[36px] p-6 md:p-10 shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] overflow-hidden relative group/cal">
                          <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                                <Calendar className="w-6 h-6" />
                              </div>
                              <h3 className="text-xl font-black uppercase tracking-tight">Lifecycle Calendar</h3>
                            </div>
                            <div className="flex items-center gap-2 bg-[#F8FAFC] p-1.5 rounded-2xl border border-white">
                               <Button onClick={prevMonth} variant="ghost" size="sm" className="rounded-xl h-10 w-10 p-0 hover:bg-white shadow-sm"><ChevronLeft className="w-5 h-5" /></Button>
                               <span className="text-[11px] font-black uppercase tracking-widest flex items-center px-6 min-w-[140px] justify-center">{monthName} {year}</span>
                               <Button onClick={nextMonth} variant="ghost" size="sm" className="rounded-xl h-10 w-10 p-0 hover:bg-white shadow-sm"><ChevronRight className="w-5 h-5" /></Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-7 gap-px bg-border/20 border border-white/20 rounded-[2.5rem] overflow-hidden shadow-inner">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                              <div key={d} className="bg-[#F8FAFC] py-4 text-center text-[10px] font-black uppercase tracking-widest text-[#64748B] border-b border-white/50/20">{d}</div>
                            ))}
                            
                            {/* Offset Empty Cells */}
                            {Array.from({ length: offset }).map((_, i) => (
                              <div key={`offset-${i}`} className="bg-[#F8FAFC] min-h-[140px] border-r border-b border-white/50/5" />
                            ))}

                            {/* Actual Month Days */}
                            {Array.from({ length: daysCount }).map((_, i) => {
                               const day = i + 1;
                               const eventStart = dbUsers.filter(u => u.subscription && new Date(u.subscription.startDate).getDate() === day && new Date(u.subscription.startDate).getMonth() === month && new Date(u.subscription.startDate).getFullYear() === year);
                               const eventEnd = dbUsers.filter(u => u.subscription && new Date(u.subscription.endDate).getDate() === day && new Date(u.subscription.endDate).getMonth() === month && new Date(u.subscription.endDate).getFullYear() === year);
                               const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
                               
                               return (
                                 <div key={i} className={`bg-white/85 backdrop-blur-[20px] min-h-[140px] p-3 relative group/day hover:bg-primary/[0.02] transition-colors border-r border-b border-white/50/10 ${isToday ? 'ring-2 ring-primary/20 ring-inset' : ''}`}>
                                   <span className={`text-[10px] font-black ${isToday ? 'text-primary' : 'text-[#64748B]/40'}`}>{day}</span>
                                   <div className="mt-2 space-y-1">
                                     {eventStart.map(u => (
                                       <div key={u.id} className="bg-[#22C55E]/10 text-[#22C55E] rounded-full px-4 border border-emerald-500/20 px-2 py-1.5 rounded-lg text-[8px] font-black uppercase truncate shadow-sm" title={`Start: ${u.name}`}>
                                         🚀 {u.name}
                                       </div>
                                     ))}
                                     {eventEnd.map(u => (
                                       <div key={u.id} className="bg-[#EF4444]/10 text-[#EF4444] rounded-full px-4 border border-rose-500/20 px-2 py-1.5 rounded-lg text-[8px] font-black uppercase truncate shadow-sm" title={`End: ${u.name}`}>
                                         🔒 {u.name}
                                       </div>
                                     ))}
                                   </div>
                                 </div>
                               );
                            })}
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="bg-white/85 backdrop-blur-[20px] border border-white rounded-[2.5rem] p-8 shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] overflow-hidden relative">
                             <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                               <Clock className="w-24 h-24 text-rose-500" />
                             </div>
                             <h3 className="text-sm font-black uppercase tracking-tight mb-6 flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-rose-500" /> Expiry Timeline
                             </h3>
                             <div className="space-y-3">
                               {monthlyExpiries.length === 0 && (
                                 <p className="text-[10px] text-[#64748B] italic text-center py-8">No expiries this month</p>
                               )}
                               {monthlyExpiries.map(u => (
                                 <div key={u.id} className="p-4 bg-[#F8FAFC] rounded-2xl border border-transparent hover:border-rose-500/20 transition-all group">
                                   <div className="flex items-center justify-between mb-2">
                                     <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest">{new Date(u.subscription!.endDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
                                     <span className="text-[8px] font-bold text-[#64748B] uppercase opacity-50">{u.subscription?.planName}</span>
                                   </div>
                                   <p className="text-xs font-black uppercase tracking-tight text-[#111827] group-hover:text-rose-600 transition-colors">{u.name}</p>
                                 </div>
                               ))}
                             </div>
                          </div>

                          <div className="bg-white/85 backdrop-blur-[20px] border border-white rounded-[2.5rem] p-8 shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] overflow-hidden relative">
                             <h3 className="text-sm font-black uppercase tracking-tight mb-6 flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-emerald-500" /> Status Pulse
                             </h3>
                             <div className="space-y-3">
                               {dbUsers.filter(u => u.role === "seller").slice(0, 5).map(u => {
                                  const active = isSubscriptionActive(u);
                                  return (
                                    <div key={u.id} className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-2xl group hover:bg-[#F8FAFC] transition-all">
                                      <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                                        <p className="text-[11px] font-black uppercase tracking-tight truncate max-w-[100px]">{u.name}</p>
                                      </div>
                                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-md ${active ? 'bg-[#22C55E]/10 text-[#22C55E] rounded-full px-4' : 'bg-[#EF4444]/10 text-[#EF4444] rounded-full px-4'}`}>
                                        {active ? 'LIVE' : 'DOWN'}
                                      </span>
                                    </div>
                                  );
                               })}
                             </div>
                             <Button variant="ghost" className="w-full mt-6 rounded-xl border border-white hover:bg-primary/5 hover:text-primary font-black text-[9px] uppercase tracking-widest h-10">Global Audit</Button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="bg-white/85 backdrop-blur-[20px] border border-white rounded-[36px] p-6 md:p-10 shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-black uppercase tracking-tight">All Node Subscriptions</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {dbUsers.filter(u => u.subscription).map(u => {
                        const active = isSubscriptionActive(u);
                        return (
                          <div key={u.id} className="p-6 bg-[#F8FAFC] rounded-3xl border border-white hover:border-primary/30 transition-all flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-4">
                               <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>{active ? 'Active' : 'Expired'}</span>
                               <span className="text-[10px] font-black text-[#64748B] uppercase tracking-widest">{u.subscription?.planName}</span>
                            </div>
                            <p className="text-lg font-black uppercase tracking-tight">{u.name}</p>
                            <p className="text-xs font-bold text-[#64748B] uppercase mb-4">{u.role}</p>
                            <div className="pt-4 border-t border-white/50 flex justify-between items-center text-[10px] font-black text-[#64748B] uppercase tracking-widest">
                              <span>Start: {new Date(u.subscription!.startDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                              <span>End: {new Date(u.subscription!.endDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                          </div>
                        );
                      })}
                      {dbUsers.filter(u => u.subscription).length === 0 && (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-white/50 rounded-3xl">
                           <p className="text-sm font-black uppercase tracking-widest text-[#64748B] opacity-60">No Subscriptions Found</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "analytics" && (
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-black tracking-tight">Intelligence Dashboard</h2>
                      <p className="text-[10px] text-[#64748B] uppercase font-black tracking-widest opacity-60">Real-time platform performance and user behavior analysis</p>
                    </div>
                    <div className="flex gap-2">
                    </div>
                  </div>

                  <div className="w-full relative">
                    <div className="bg-white/70 backdrop-blur-[20px] rounded-[3rem] border border-white overflow-hidden shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] relative min-h-[680px] w-full">
                      <div className="absolute inset-0 z-0">
                        <Globe3D onSelectCountry={(c) => setSelectedCountry(c)} />
                      </div>

                      {/* Floating HUD status - Hides when country is selected */}
                      <AnimatePresence>
                        {!selectedCountry && (
                          <>
                            <motion.div
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 30 }}
                              className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 px-6 md:px-10 py-4 md:py-6 bg-white/80 backdrop-blur-3xl border border-white rounded-[2rem] md:rounded-[2.5rem] z-10 flex items-center gap-4 md:gap-8 shadow-[0_30px_60px_rgba(0,0,0,0.5)] w-[90%] md:w-auto"
                            >
                              <div className="flex items-center gap-3 md:gap-4">
                                <div className="relative">
                                  <div className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.6)]" />
                                  <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20" />
                                </div>
                                <div className="flex flex-col">
                                  <h4 className="text-[10px] md:text-[12px] font-black text-[#111827] uppercase tracking-[0.2em] md:tracking-[0.3em] leading-none">Security Sync</h4>
                                  <span className="text-[8px] md:text-[9px] font-bold text-emerald-500/80 uppercase tracking-widest mt-1 hidden sm:block">Alpha-X Protocol Active</span>
                                </div>
                              </div>

                              <div className="w-px h-8 md:h-10 bg-white/10" />

                              <div className="flex flex-col">
                                <p className="text-sm md:text-2xl font-black text-[#111827] tracking-tighter uppercase leading-none">Node Matrix</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex gap-0.5 hidden sm:flex">
                                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-1.5 bg-primary/40 rounded-full" />)}
                                  </div>
                                  <span className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-[0.2em]">Verified</span>
                                </div>
                              </div>
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, y: -30, x: 20 }}
                              animate={{ opacity: 1, y: 0, x: 0 }}
                              exit={{ opacity: 0, y: -30, x: 20 }}
                              className="absolute top-6 md:top-10 right-6 md:right-10 flex flex-col gap-4 z-10"
                            >
                              <div className="bg-white/80 backdrop-blur-3xl border border-white px-6 md:px-8 py-4 md:py-6 rounded-[1.5rem] md:rounded-[2rem] text-right shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] group/perf cursor-default">
                                <p className="text-[8px] md:text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em] md:tracking-[0.3em] mb-1 md:mb-2 leading-tight">Load Cap</p>
                                <h4 className="text-2xl md:text-4xl font-black text-[#111827] tracking-tighter group-hover/perf:text-primary transition-colors">98.2%</h4>
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>

                      {/* State Analysis Sidebar - Ultra-Premium UX */}
                      <AnimatePresence>
                        {selectedCountry && (
                          <motion.div
                            initial={{ opacity: 0, x: 250, filter: "blur(10px)" }}
                            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, x: 250, filter: "blur(10px)" }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            className="absolute top-4 right-4 bottom-4 w-[calc(100%-32px)] md:w-[400px] lg:w-[420px] z-[60] flex flex-col pointer-events-auto"
                          >
                            <div className="bg-white/85 backdrop-blur-[60px] border border-white rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex-1 flex flex-col p-6 lg:p-8 overflow-hidden relative group/nx">
                              {/* Industrial HUD Backdrop */}
                              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none font-black text-[100px] leading-none select-none tracking-tighter transition-opacity group-hover/nx:opacity-[0.05] duration-700">
                                {(selectedCountry.name || 'DATA').substring(0, 4).toUpperCase()}
                              </div>

                              <div className="relative z-10 flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4 group/flag">
                                  <div className="relative">
                                    <span className="text-5xl md:text-6xl drop-shadow-[0_0_35px_rgba(255,255,255,0.4)] group-hover/flag:scale-110 transition-transform duration-500">{selectedCountry.flag}</span>
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-[#0b0b12] animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
                                  </div>
                                  <div className="flex flex-col">
                                    <h4 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#111827] tracking-tighter uppercase leading-tight mb-0.5 drop-shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)]">{selectedCountry.name}</h4>
                                    <div className="flex items-center gap-2">
                                      <div className="flex gap-1">
                                        {[1, 2, 3].map(i => <div key={i} className="w-1 h-3 bg-primary/5 rounded-full" />)}
                                      </div>
                                      <p className="text-[10px] font-black text-primary/80 uppercase tracking-[0.4em]">{selectedCountry.stat} PROTOCOL</p>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => { 
                                    e.stopPropagation(); 
                                    if (expandedState) {
                                      setExpandedState(null);
                                    } else {
                                      setSelectedCountry(null); 
                                    }
                                  }}
                                  className="w-12 h-12 rounded-2xl bg-[#111827]/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-[#111827] flex items-center justify-center transition-all group/btn active:scale-90 shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)]"
                                >
                                  <ArrowLeft className="w-5 h-5 group-hover/btn:-translate-x-1.5 transition-transform duration-300" />
                                </button>
                              </div>

                              <div className="flex-1 space-y-8 overflow-y-auto pr-3 custom-scrollbar-sleek relative z-10 scroll-smooth pb-10">
                                <AnimatePresence mode="popLayout">
                                  {selectedCountry.states && selectedCountry.states.length > 0 ? (
                                    selectedCountry.states.map((s, idx) => {
                                      const isExpanded = expandedState === s.name;
                                      if (expandedState && !isExpanded) return null;

                                      return (
                                        <motion.div
                                          layout
                                          initial={{ opacity: 0, scale: 0.98, y: 20 }}
                                          animate={{ opacity: 1, scale: 1, y: 0 }}
                                          exit={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
                                          transition={{ 
                                            layout: { type: "spring", stiffness: 300, damping: 30 },
                                            opacity: { duration: 0.3 }
                                          }}
                                          key={s.name}
                                          onClick={() => !isExpanded && setExpandedState(s.name)}
                                          className={`bg-white/[0.04] border border-white/10 p-8 rounded-[3rem] transition-all duration-500 group/card relative overflow-hidden shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] ${!isExpanded ? 'hover:bg-white/[0.08] hover:border-primary/50 cursor-pointer' : 'cursor-default'}`}
                                        >
                                          {/* Visibility Accent & Glow */}
                                          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary opacity-40 group-hover/card:opacity-100 transition-opacity" />
                                          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-[50px] group-hover/card:bg-primary/20 transition-all duration-700" />

                                          <div className="flex justify-between items-start mb-8 relative z-10">
                                            <div className="flex items-center gap-6">
                                              <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary group-hover/card:bg-primary group-hover/card:text-[#111827] transition-all duration-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                                                {isExpanded ? <Activity className="w-7 h-7 animate-pulse" /> : <BarChart3 className="w-7 h-7" />}
                                              </div>
                                              <div>
                                                <p className="text-[20px] font-black text-[#111827] uppercase tracking-tighter leading-none mb-2">{s.name}</p>
                                                <div className="flex items-center gap-3">
                                                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
                                                  <span className="text-[11px] font-black text-[#64748B] uppercase tracking-[0.2em]">{isExpanded ? 'LIVE URBAN STREAM' : `${s.count} ACTIVE NODES`}</span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="text-right">
                                              <span className="text-4xl font-black text-primary tracking-tighter drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]">{s.val}</span>
                                              <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.3em] mt-1">THROUGHPUT</p>
                                            </div>
                                          </div>

                                          <div className="relative z-10 space-y-6">
                                            <div className="w-full h-4 bg-white/40 rounded-full overflow-hidden border border-white/10 shadow-inner p-1">
                                              <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: s.val }}
                                                transition={{ duration: 2.2, ease: "easeOut" }}
                                                className="h-full rounded-full relative"
                                                style={{
                                                  backgroundColor: s.color || '#3b82f6',
                                                  boxShadow: `0 0 40px ${s.color || '#3b82f6'}cc`
                                                }}
                                              >
                                                <div className="absolute inset-0 bg-white/20 blur-sm" />
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-[100%] animate-[shimmer_3s_infinite]" />
                                              </motion.div>
                                            </div>

                                            {isExpanded ? (
                                              <motion.div 
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="pt-8 border-t border-white/10 space-y-8"
                                              >
                                                <div className="grid grid-cols-1 gap-6">
                                                  {[
                                                    { city: 'Metropolis Central', load: '94%', activity: 'High', delay: 0.1 },
                                                    { city: 'Coastal Node Hub', load: '82%', activity: 'Stable', delay: 0.2 },
                                                    { city: 'Industrial Sector 7', load: '76%', activity: 'Peak', delay: 0.3 },
                                                    { city: 'Tech Corridor North', load: '91%', activity: 'Critical', delay: 0.4 },
                                                  ].map((city) => (
                                                    <motion.div 
                                                      initial={{ opacity: 0, x: -20 }}
                                                      animate={{ opacity: 1, x: 0 }}
                                                      transition={{ delay: city.delay }}
                                                      key={city.city} 
                                                      className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all flex items-center justify-between group/city"
                                                    >
                                                      <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover/city:bg-primary group-hover/city:text-[#111827] transition-all">
                                                          <MapPin className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                          <p className="text-[14px] font-black text-[#111827] uppercase tracking-tight">{city.city}</p>
                                                          <div className="flex items-center gap-2 mt-1">
                                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                            <span className="text-[9px] font-black text-[#64748B] uppercase tracking-widest">{city.activity} Traffic</span>
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <div className="text-right">
                                                        <p className="text-[18px] font-black text-[#111827] tracking-tighter">{city.load}</p>
                                                        <p className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">LOAD</p>
                                                      </div>
                                                    </motion.div>
                                                  ))}
                                                </div>
                                                
                                                <div className="bg-primary/5 border border-primary/20 p-6 rounded-[2rem] flex items-center justify-between">
                                                  <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-primary/20 rounded-xl">
                                                      <Activity className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                      <p className="text-[11px] font-black text-[#111827] uppercase tracking-widest">Aggregate City Load</p>
                                                      <p className="text-[9px] font-bold text-primary/60 uppercase tracking-widest mt-0.5">Optimizing Node Distribution</p>
                                                    </div>
                                                  </div>
                                                  <span className="text-2xl font-black text-primary tracking-tighter">85.4%</span>
                                                </div>
                                              </motion.div>
                                            ) : (
                                              <>
                                                <div className="pt-6 border-t border-white/5">
                                                  <div className="flex items-center justify-between mb-4">
                                                    <p className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.3em]">Quick Node Overview</p>
                                                    <span className="text-[9px] font-black text-primary uppercase tracking-widest">TAP_TO_DEEP_DIVE</span>
                                                  </div>
                                                  <div className="grid grid-cols-2 gap-3">
                                                    {['Alpha', 'Beta', 'Gamma', 'Delta'].map((node, nIdx) => (
                                                      <div key={nIdx} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                                        <span className="text-[9px] font-bold text-[#64748B]">{node}</span>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
                                                <button 
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setExpandedState(s.name);
                                                  }}
                                                  className="w-full py-4 bg-[#111827]/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 group/btn hover:bg-primary hover:border-primary hover:text-[#111827] transition-all duration-300 shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)]"
                                                >
                                                  <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">Enter Deep Dive</span>
                                                </button>
                                              </>
                                            )}
                                          </div>
                                        </motion.div>
                                      );
                                    })
                                  ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-white/[0.02] border border-white/5 rounded-[3rem] border-dashed">
                                      <div className="w-20 h-20 rounded-full bg-[#F8FAFC] flex items-center justify-center text-[#64748B] mb-6">
                                        <Globe className="w-10 h-10 animate-pulse" />
                                      </div>
                                      <h4 className="text-xl font-black text-[#111827] uppercase tracking-tight mb-2">No Node Registry</h4>
                                      <p className="text-[11px] text-[#64748B] uppercase font-black tracking-widest opacity-60">This region currently has no granular node data in the global matrix.</p>
                                    </div>
                                  )}
                                </AnimatePresence>
                              </div>

                              {/* Footer Nexus Status */}
                              <div className="mt-8 pt-8 border-t border-white/10 relative z-10">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div className="bg-primary/10 p-2 rounded-lg">
                                      <Globe className="w-4 h-4 text-primary animate-spin-slow" />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[10px] font-black text-[#64748B] uppercase tracking-widest leading-none">Intelligence Feed</span>
                                      <span className="text-[8px] font-black text-primary/60 uppercase tracking-[0.2em] mt-1">Synchronizing Node {selectedCountry.name}_PRT_00</span>
                                    </div>
                                  </div>
                                  <div className="px-5 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Node Secure</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "compliance" && (() => {
                const localCompliance = dbUsers.filter(u => u.documents?.gst && u.documents?.pan);
                const localNames = new Set(localCompliance.map(u => u.name.toLowerCase()));
                const complianceQueue = [
                  ...localCompliance.map(u => ({
                    id: u.id, name: u.name, country: u.country, role: u.role, isLocal: true, status: u.verified ? 'approved' : 'pending',
                    documents: u.documents
                  })),
                  ...phpComplianceQueue
                    .filter(r => !localNames.has(r.user_name.toLowerCase()))
                    .map(r => ({
                    id: r.user_id, name: r.user_name, country: 'GLOBAL', role: 'seller', isLocal: false, status: r.status,
                    documents: {
                      gst: { name: r.gst_document_path.split('/').pop(), url: `http://localhost/market-connect-hub-main/${r.gst_document_path}` },
                      pan: { name: r.pan_document_path.split('/').pop(), url: `http://localhost/market-connect-hub-main/${r.pan_document_path}` }
                    }
                  }))
                ];
                
                return (
                      <div className="space-y-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                          <div>
                            <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Protocol Command & Compliance</h2>
                            <p className="text-sm text-[#64748B] font-medium uppercase tracking-[0.2em] opacity-60">Verification Batch / Request Authorization Matrix</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="px-6 py-3 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Queue Active: {complianceQueue.length < 10 ? `0${complianceQueue.length}` : complianceQueue.length} Nodes Pending</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
                          {complianceQueue.map((req, idx) => (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9, y: 30 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                              key={req.id}
                              className="bg-white/85 backdrop-blur-[20px] border border-white p-6 xl:p-8 rounded-[3rem] shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] hover:shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] transition-all group/req overflow-hidden relative flex flex-col"
                            >
                              <div className="absolute top-4 right-6 opacity-[0.03] text-5xl font-black pointer-events-none group-hover/req:opacity-[0.06] transition-opacity uppercase tracking-tighter z-0">
                                {req.role}
                              </div>

                              <div className="flex items-center gap-4 mb-8 relative z-10">
                                <div className="w-16 h-16 shrink-0 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xl group-hover/req:bg-primary group-hover/req:text-[#111827] transition-colors shadow-inner">
                                  {req.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-xl leading-none">🌍</span>
                                    <p className="text-[10px] font-black text-[#64748B] uppercase tracking-widest">{req.country || 'GLOBAL'}</p>
                                  </div>
                                  <h4 className="text-lg font-black uppercase tracking-tight leading-tight truncate">{req.name}</h4>
                                </div>
                              </div>

                              <div className="space-y-4 mb-8 relative z-10 flex-1">
                                <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-white flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <FileText className="w-4 h-4 text-primary shrink-0" />
                                    <span className="text-[11px] font-bold text-[#111827]/80 truncate">{req.documents?.gst?.name}</span>
                                  </div>
                                  <div onClick={() => { if(req.documents?.gst?.url) window.open(req.documents.gst.url, '_blank'); else toast.error('File not found'); }} className="px-4 py-1.5 bg-[#111827]/50 rounded-lg border border-white text-[9px] font-black uppercase tracking-widest text-primary cursor-pointer hover:bg-primary hover:text-[#111827] transition-colors shrink-0">
                                    Audit
                                  </div>
                                </div>
                                <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-white flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <FileText className="w-4 h-4 text-primary shrink-0" />
                                    <span className="text-[11px] font-bold text-[#111827]/80 truncate">{req.documents?.pan?.name}</span>
                                  </div>
                                  <div onClick={() => { if(req.documents?.pan?.url) window.open(req.documents.pan.url, '_blank'); else toast.error('File not found'); }} className="px-4 py-1.5 bg-[#111827]/50 rounded-lg border border-white text-[9px] font-black uppercase tracking-widest text-primary cursor-pointer hover:bg-primary hover:text-[#111827] transition-colors shrink-0">
                                    Audit
                                  </div>
                                </div>

                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[#64748B] opacity-60">
                                  <span className="flex items-center gap-1.5 truncate">
                                    <Clock className="w-3 h-3 shrink-0" />
                                    <span className="truncate">Received: Just Now</span>
                                  </span>
                                  <span className="text-primary font-bold shrink-0 ml-2">#{req.id.substring(0,6)}</span>
                                </div>
                              </div>

                              <div className="flex gap-2 relative z-10 w-full mt-auto">
                                {req.status === 'approved' ? (
                                  <div className="flex-1 py-3.5 px-2 bg-primary/10 text-primary border border-primary/20 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-default">
                                    <ShieldCheck className="w-6 h-6 shrink-0" />
                                    <span className="truncate">Node Authorized</span>
                                  </div>
                                ) : (
                                  <>
                                    <button onClick={() => {
                                      if (req.isLocal) {
                                        import('@/lib/storage').then(mod => mod.updateUserProfile({ ...req, verified: true } as any));
                                        setDbUsers(dbUsers.map(u => u.id === req.id ? { ...u, verified: true } : u));
                                      } else {
                                        fetch('http://localhost/market-connect-hub-main/api/verify_compliance.php', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ userId: req.id })
                                        });
                                        import('@/lib/storage').then(mod => {
                                          const u = getUsers().find(usr => usr.id === req.id);
                                          if (u) {
                                            const updatedDocs = req.documents || u.documents;
                                            mod.updateUserProfile({ ...u, verified: true, documents: updatedDocs } as any);
                                          }
                                        });
                                        setPhpComplianceQueue(prev => prev.map(p => p.user_id === req.id ? { ...p, status: 'approved' } : p));
                                      }
                                      toast.success(`Node ${req.name} Authorized successfully`);
                                    }} className="flex-[3] py-3.5 px-2 bg-emerald-500 text-[#111827] rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center justify-center gap-1.5 group/app">
                                      <ShieldCheck className="w-5 h-5 shrink-0 group-hover/app:animate-bounce" />
                                      <span className="truncate">Authorize Node</span>
                                    </button>
                                    <button onClick={() => toast.error(`Node ${req.id} Terminated`)} className="flex-[2] py-3.5 px-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white hover:scale-[1.03] active:scale-[0.97] transition-all shadow-lg shadow-rose-500/5 flex items-center justify-center gap-1.5 group/term">
                                      <X className="w-5 h-5 shrink-0 group-hover/term:rotate-90 transition-transform" />
                                      <span className="truncate">Terminate</span>
                                    </button>
                                  </>
                                )}
                              </div>

                              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover/req:opacity-100 transition-opacity" />
                            </motion.div>
                          ))}

                          {complianceQueue.length === 0 && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="border-2 border-dashed border-white/50 rounded-[3rem] flex flex-col items-center justify-center p-10 group/add col-span-full py-20"
                            >
                              <div className="w-16 h-16 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] mb-4">
                                <ShieldCheck className="w-8 h-8 text-emerald-500" />
                              </div>
                              <p className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.3em]">No Nodes Pending Authorization</p>
                              <p className="text-[9px] mt-2 text-[#64748B] uppercase font-bold tracking-widest opacity-60">Compliance queue is clear</p>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

              {activeTab === "logistics" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">Logistics Queue</h2>
                    <p className="text-[10px] text-[#64748B] uppercase font-black tracking-widest mt-2 opacity-60">Global delivery tracking and dispatch management</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dbDeliveries.map(d => (
                      <div key={d.id} className="p-6 bg-white/85 backdrop-blur-[20px] border border-white rounded-[2rem] flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-md">{d.status}</span>
                            <span className="text-[10px] font-black text-[#64748B] uppercase tracking-widest">#{d.id.substring(0,6)}</span>
                          </div>
                          <p className="text-lg font-black uppercase truncate">{d.pickupAddress} <ArrowRight className="inline w-4 h-4 mx-2 text-[#64748B]"/> {d.deliveryAddress}</p>
                          <p className="text-xs font-bold text-[#64748B] uppercase mt-2">{d.distance || 0} KM • {d.vehicleType || 'N/A'}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/50 flex justify-between items-center">
                          <span className="text-xl font-black text-[#111827]">₹{d.amount}</span>
                          <span className="text-[10px] font-black uppercase text-[#64748B] tracking-widest">{d.partnerName || "No Partner Assigned"}</span>
                        </div>
                      </div>
                    ))}
                    {dbDeliveries.length === 0 && (
                      <div className="col-span-2 p-10 text-center bg-[#F8FAFC] rounded-[2rem] border border-dashed border-white/50 text-[#64748B] font-black uppercase tracking-widest text-sm">No Active Deliveries</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "categories" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">Global Inventory</h2>
                    <p className="text-[10px] text-[#64748B] uppercase font-black tracking-widest mt-2 opacity-60">All marketplace products and assets</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {dbProducts.map(p => (
                      <div key={p.id} className="p-6 bg-white/85 backdrop-blur-[20px] border border-white rounded-[2rem] group relative">
                        <div className="w-16 h-16 rounded-2xl bg-[#F8FAFC] flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">{p.image}</div>
                        <p className="text-sm font-black uppercase truncate">{p.name}</p>
                        <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mt-1 mb-4">{p.sellerName}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-black">{p.price}</span>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteProduct(p.id)} className="h-8 rounded-xl text-[9px] uppercase tracking-widest border-white/50 hover:bg-rose-500/10 hover:text-rose-600">Purge</Button>
                        </div>
                      </div>
                    ))}
                    {dbProducts.length === 0 && (
                      <div className="col-span-4 p-10 text-center bg-[#F8FAFC] rounded-[2rem] border border-dashed border-white/50 text-[#64748B] font-black uppercase tracking-widest text-sm">No Assets Found</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "leads" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">Platform Leads</h2>
                    <p className="text-[10px] text-[#64748B] uppercase font-black tracking-widest mt-2 opacity-60">Global B2B inquiries and communication flow</p>
                  </div>
                  <div className="space-y-4">
                    {dbInquiries.map(i => (
                      <div key={i.id} className="p-6 bg-white/85 backdrop-blur-[20px] border border-white rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-md">{i.status}</span>
                            <span className="text-[10px] font-black text-[#64748B] uppercase tracking-widest">{new Date(i.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-base font-black uppercase">Asset ID: {i.productId}</p>
                          <p className="text-xs font-bold text-[#64748B] uppercase mt-1">From: {i.buyerName} • Contact: {i.buyerEmail} / {i.buyerPhone}</p>
                          <p className="text-sm mt-3 opacity-80 border-l-2 border-primary/30 pl-3 italic">{i.description}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleUpdateInquiryStatus(i.id, i.status === "new" ? "contacted" : "closed")} className="shrink-0 h-10 rounded-xl text-[10px] uppercase tracking-widest border-white/50 hover:bg-primary/10 hover:text-primary">Update Status</Button>
                      </div>
                    ))}
                    {dbInquiries.length === 0 && (
                      <div className="p-10 text-center bg-[#F8FAFC] rounded-[2rem] border border-dashed border-white/50 text-[#64748B] font-black uppercase tracking-widest text-sm">No Active Leads</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "ads" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">Ad Campaigns</h2>
                    <p className="text-[10px] text-[#64748B] uppercase font-black tracking-widest mt-2 opacity-60">Promotional network node management</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {dbAds.map(a => (
                      <div key={a.id} className="p-6 bg-white/85 backdrop-blur-[20px] border border-white rounded-[2rem] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                          <Target className="w-24 h-24" />
                        </div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${a.verificationStatus === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : a.verificationStatus === 'rejected' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>{a.verificationStatus}</span>
                          <span className="text-[10px] font-black text-[#64748B] uppercase tracking-widest">{a.type}</span>
                        </div>
                        <p className="text-lg font-black uppercase relative z-10">{a.headline || dbProducts.find(p => p.id === a.productId)?.name || 'Untitled Ad'}</p>
                        <p className="text-xs font-bold text-[#64748B] uppercase mt-1 relative z-10">{(a.message || '').substring(0, 80)}...</p>
                        <div className="mt-6 pt-4 border-t border-white/50 flex justify-between items-center relative z-10">
                          <div className="flex gap-4">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black uppercase tracking-widest text-[#64748B]">Reach</span>
                              <span className="text-sm font-black">{a.reach}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black uppercase tracking-widest text-[#64748B]">Clicks</span>
                              <span className="text-sm font-black">{a.clicks}</span>
                            </div>
                          </div>
                          {a.verificationStatus === "pending" && (
                             <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleApproveAd(a.id)} className="h-8 w-8 p-0 rounded-xl bg-[#22C55E]/10 text-[#22C55E] rounded-full px-4 hover:bg-emerald-500 hover:text-[#111827]"><CheckCircle2 className="w-4 h-4"/></Button>
                                <Button size="sm" onClick={() => handleRejectAd(a.id)} className="h-8 w-8 p-0 rounded-xl bg-[#EF4444]/10 text-[#EF4444] rounded-full px-4 hover:bg-rose-500 hover:text-[#111827]"><Ban className="w-4 h-4"/></Button>
                             </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {dbAds.length === 0 && (
                      <div className="col-span-2 p-10 text-center bg-[#F8FAFC] rounded-[2rem] border border-dashed border-white/50 text-[#64748B] font-black uppercase tracking-widest text-sm">No Campaigns Running</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "hiring" && (
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">HR Command</h2>
                      <p className="text-[10px] text-[#64748B] uppercase font-black tracking-widest mt-2 opacity-60">Job requisition and recruitment matrix</p>
                    </div>
                    <Button onClick={() => setShowJobForm(true)} className="rounded-2xl h-12 px-6 bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                      Deploy Requisition
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {dbJobs.map(j => (
                      <div key={j.id} className="p-6 bg-white/85 backdrop-blur-[20px] border border-white rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                           <div className="flex items-center gap-3 mb-2">
                             <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-md">{j.status}</span>
                             <span className="text-[10px] font-black text-[#64748B] uppercase tracking-widest">{j.department} • {j.type}</span>
                           </div>
                           <p className="text-lg font-black uppercase truncate">{j.title}</p>
                           <p className="text-xs font-bold text-[#64748B] uppercase mt-1">{j.location} • {j.salary}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => { import('@/lib/storage').then(m => m.deleteJob(j.id)); setDbJobs(prev => prev.filter(x => x.id !== j.id)); }} className="shrink-0 h-10 rounded-xl text-[10px] uppercase tracking-widest border-white/50 hover:bg-rose-500/10 hover:text-rose-600">Purge</Button>
                      </div>
                    ))}
                    {dbJobs.length === 0 && (
                      <div className="p-10 text-center bg-[#F8FAFC] rounded-[2rem] border border-dashed border-white/50 text-[#64748B] font-black uppercase tracking-widest text-sm">No Requisitions Found</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-10">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                      <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Command Center Configuration</h2>
                      <p className="text-sm text-[#64748B] font-medium uppercase tracking-[0.2em] opacity-60">Security Protocols & Operational Metadata Control</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Security Node: Password & Auth */}
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white/85 backdrop-blur-[20px] border border-white rounded-[3rem] p-10 shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] overflow-hidden relative group/sec"
                    >
                      <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover/sec:opacity-[0.05] transition-opacity font-black text-7xl leading-none pointer-events-none uppercase tracking-tighter shrink-0">
                        AUTH
                      </div>

                      <div className="flex items-center gap-5 mb-10 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-inner">
                          <KeyRound className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black uppercase tracking-tight">Access Protocol Reset</h3>
                          <p className="text-[11px] font-black text-amber-500/80 uppercase tracking-widest mt-1">Administrator Password Deployment</p>
                        </div>
                      </div>

                      <div className="space-y-6 relative z-10">
                        <div className="space-y-4">
                          <div className="p-4 bg-[#F8FAFC] border border-white rounded-2xl focus-within:border-primary/50 transition-all">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#64748B] mb-2">Current Command Code</label>
                            <input type="password" placeholder="••••••••••••" className="w-full bg-transparent border-none outline-none text-base font-bold tracking-widest placeholder:opacity-30" />
                          </div>
                          <div className="p-4 bg-[#F8FAFC] border border-white rounded-2xl focus-within:border-primary/50 transition-all">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#64748B] mb-2">New Security Hash</label>
                            <input type="password" placeholder="New Alpha-Key" className="w-full bg-transparent border-none outline-none text-base font-bold tracking-widest placeholder:opacity-30" />
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-6 bg-primary/5 rounded-[2rem] border border-primary/10 group/tg cursor-pointer hover:bg-primary/10 transition-colors">
                          <div className="flex items-center gap-4">
                            <Fingerprint className="w-5 h-5 text-primary" />
                            <span className="text-[12px] font-black text-[#111827] uppercase tracking-widest">Multi-Factor Authentication</span>
                          </div>
                          <div className="w-12 h-6 bg-primary/40 rounded-full relative p-1 flex items-center justify-end border border-primary/20">
                            <div className="w-4 h-4 bg-white rounded-full shadow-lg" />
                          </div>
                        </div>

                        <Button className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] text-white font-black text-sm uppercase tracking-[0.2em] shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] shadow-primary/20 group-hover/sec:scale-[1.01] transition-all">
                          Initialize Password Reset Protocol
                        </Button>
                      </div>
                    </motion.div>

                    {/* Data Security Matrix */}
                    <div className="space-y-10">
                      <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/40 backdrop-blur-3xl text-[#111827] rounded-[3rem] p-10 border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.4)] relative overflow-hidden group/data"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-emerald-500/10 opacity-30 group-hover/data:opacity-50 transition-opacity" />

                        <div className="flex items-center justify-between mb-10 relative z-10">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#111827]/5 border border-white/10 flex items-center justify-center text-[#111827]">
                              <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-black uppercase tracking-tight">Global Guard Matrix</h3>
                              <p className="text-[11px] font-black text-emerald-500 uppercase tracking-widest mt-1">Platform-Wide Encryption Active</p>
                            </div>
                          </div>
                          <div className="px-4 py-2 bg-[#111827]/5 rounded-xl border border-white/10 text-[11px] font-black uppercase tracking-widest">
                            V4.2_SECURE
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 relative z-10">
                          <div className="p-5 bg-[#111827]/5 border border-white/5 rounded-2xl hover:border-white/20 transition-all cursor-default">
                            <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em] mb-2">Encryption Type</p>
                            <span className="text-2xl font-black tracking-tighter">AES-256 GCM</span>
                          </div>
                          <div className="p-5 bg-[#111827]/5 border border-white/5 rounded-2xl hover:border-white/20 transition-all cursor-default">
                            <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em] mb-2">Node Security</p>
                            <span className="text-2xl font-black tracking-tighter text-emerald-500">OPTIMIZED</span>
                          </div>
                        </div>

                        <div className="mt-8 p-5 bg-primary/20 rounded-2xl border border-primary/30 flex items-center justify-between relative z-10 group/key cursor-pointer">
                          <div className="flex items-center gap-4">
                            <Lock className="w-5 h-5 text-[#111827]" />
                            <span className="text-[12px] font-black uppercase tracking-widest">Database Backup Cycle</span>
                          </div>
                          <span className="text-[11px] font-black opacity-60 uppercase tracking-widest group-hover/key:text-[#111827] transition-colors">Daily @ 02:00 NODE_TIME</span>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#F8FAFC] border border-white rounded-[2.5rem] p-8 flex items-center justify-between group/audit cursor-pointer hover:bg-[#F8FAFC] transition-all"
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-white/40 flex items-center justify-center text-[#64748B] group-hover/audit:text-primary transition-colors">
                            <Activity className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-base font-black uppercase tracking-widest">System Audit Logs</h4>
                            <p className="text-[11px] text-[#64748B] font-semibold uppercase tracking-widest mt-1">Review Administrator Access History</p>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-white flex items-center justify-center text-[#64748B] group-hover/audit:translate-x-1 transition-transform">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "categories" && (
                <div className="bg-white/85 backdrop-blur-[20px] rounded-[2.5rem] border border-white overflow-hidden shadow-sm">
                  <div className="p-8 border-b border-white/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-black tracking-tight">Inventory Intelligence</h2>
                      <p className="text-base text-[#64748B]">Manage digital assets and market offerings</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" className="rounded-2xl border-white/50 bg-white  hover:bg-primary/5 hover:text-primary hover:border-primary/30 font-black text-[11px] uppercase tracking-[0.15em] transition-all duration-300 px-5 shadow-sm">
                        <Filter className="w-3.5 h-3.5 mr-2" /> Filter Nodes
                      </Button>
                      <Button variant="outline" className="rounded-2xl border-white/50 bg-white  hover:bg-primary/5 hover:text-primary hover:border-primary/30 font-black text-[11px] uppercase tracking-[0.15em] transition-all duration-300 px-5 shadow-sm">
                        <Download className="w-3.5 h-3.5 mr-2" /> Export Log
                      </Button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-[#F8FAFC] text-[11px] font-black uppercase tracking-[0.2em] text-[#64748B]">
                          <th className="px-8 py-5">Asset Node</th>
                          <th className="px-8 py-5">Category</th>
                          <th className="px-8 py-5">Origin (Seller)</th>
                          <th className="px-8 py-5">Valuation</th>
                          <th className="px-8 py-5">Protocol Status</th>
                          <th className="px-8 py-5 text-right">Ops</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {dbProducts.map((p) => (
                          <tr key={p.id} className="group hover:bg-primary/[0.02] transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC]  border border-white flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                                  {p.image}
                                </div>
                                <div className="flex flex-col">
                                  <p className="text-base font-black text-[#111827] uppercase tracking-tight line-clamp-1">{p.name}</p>
                                  <p className="text-[11px] text-primary font-bold uppercase tracking-widest">ID: {p.id.substring(0, 8)}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="text-sm font-black uppercase tracking-[0.05em] text-[#64748B] py-1 px-3 bg-[#F8FAFC] rounded-lg">{p.category}</span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-2 group/seller cursor-pointer" onClick={() => {
                                const seller = dbUsers.find(u => u.id === p.sellerId);
                                if (seller) handleViewUser(seller);
                              }}>
                                <p className="text-sm font-bold text-[#111827] hover:text-primary transition-colors underline decoration-primary/20">{p.sellerName}</p>
                                <ExternalLink className="w-3.5 h-3.5 text-[#64748B] opacity-0 group-hover/seller:opacity-100 transition-opacity" />
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <p className="text-base font-black text-[#111827] tracking-tight">{p.price}</p>
                              <p className="text-[11px] text-[#64748B] font-medium uppercase tracking-widest">{p.moq} MOQ</p>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <div className={`w-2 h-2 rounded-full ${p.verified ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]'}`} />
                                  {!p.verified && <div className="absolute inset-0 rounded-full bg-amber-500 animate-ping opacity-20" />}
                                </div>
                                <span className={`text-[11px] font-black uppercase tracking-widest ${p.verified ? 'text-emerald-500' : 'text-amber-500'}`}>
                                  {p.verified ? 'Verified Node' : 'Pending Review'}
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleUpdateProductStatus(p.id, !p.verified)}
                                  className={`p-2.5 rounded-xl transition-all hover:scale-110 active:scale-95 ${p.verified ? 'hover:bg-amber-500/10 hover:text-amber-500' : 'hover:bg-emerald-500/10 hover:text-emerald-500'}`}
                                  title={p.verified ? "Flag Node" : "Authorize Node"}
                                >
                                  {p.verified ? <Ban className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="p-2.5 hover:bg-rose-500/10 hover:text-rose-500 rounded-xl transition-all hover:scale-110 active:scale-95"
                                  title="Purge Node"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-6 border-t border-white/50 flex items-center justify-between text-[12px] font-black text-[#64748B] uppercase tracking-widest bg-[#F8FAFC]">
                    <span>Active Global Inventory Nodes: {dbProducts.length}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="rounded-xl px-4 py-1 h-auto text-[11px] font-black">Segment Alpha</Button>
                      <Button variant="outline" size="sm" className="rounded-xl px-4 py-1 h-auto text-[11px] font-black">Segment Beta</Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "leads" && (
                <div className="bg-white/85 backdrop-blur-[20px] rounded-[2.5rem] border border-white overflow-hidden shadow-sm">
                  <div className="p-8 border-b border-white/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-black tracking-tight text-[#111827] uppercase">Lead Central</h2>
                      <p className="text-base text-[#64748B] uppercase font-black text-[11px] tracking-widest mt-1 opacity-60">High-priority platform transaction inquiries</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="rounded-2xl border-white/50 bg-white  hover:bg-primary/5 hover:text-primary font-black text-[11px] uppercase tracking-widest transition-all">All Nodes</Button>
                      <Button variant="outline" className="rounded-2xl border-white/50 bg-white  hover:bg-emerald-500/5 hover:text-emerald-500 font-black text-[11px] uppercase tracking-widest transition-all">Active</Button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-[#F8FAFC] text-[11px] font-black uppercase tracking-[0.2em] text-[#64748B]">
                          <th className="px-8 py-5">Buyer Identity</th>
                          <th className="px-8 py-5">Product Interest</th>
                          <th className="px-8 py-5">Communication</th>
                          <th className="px-8 py-5">Protocol Status</th>
                          <th className="px-8 py-5 text-right">Ops</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {dbInquiries.map((lead) => (
                          <tr key={lead.id} className="group hover:bg-primary/[0.02] transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black text-sm">
                                  {lead.buyerName.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-base font-black text-[#111827] uppercase tracking-tight">{lead.buyerName}</p>
                                  <p className="text-[11px] text-[#64748B] font-medium">{lead.buyerEmail}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <p className="text-base font-black text-[#111827] uppercase tracking-tight line-clamp-1">{lead.productName}</p>
                              <p className="text-[11px] text-primary font-bold uppercase tracking-widest">Qty: {lead.quantity}</p>
                            </td>
                            <td className="px-8 py-6 max-w-[300px]">
                              <p className="text-sm text-[#64748B] line-clamp-2 italic">"{lead.description}"</p>
                              <p className="text-[10px] text-[#64748B] font-medium uppercase tracking-widest mt-2">Received: {formatDate(lead.createdAt)}</p>
                            </td>
                            <td className="px-8 py-6">
                              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${lead.status === 'new' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                lead.status === 'contacted' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                  'bg-[#22C55E]/10 text-[#22C55E] rounded-full px-4 border-emerald-500/20'
                                }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${lead.status === 'new' ? 'bg-rose-500' :
                                  lead.status === 'contacted' ? 'bg-amber-500' :
                                    'bg-emerald-500'
                                  }`} />
                                <span className="text-[11px] font-black uppercase tracking-widest">{lead.status}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleUpdateInquiryStatus(lead.id, 'contacted')}
                                  className="p-2.5 hover:bg-primary/10 hover:text-primary rounded-xl transition-all hover:scale-110 active:scale-95"
                                  title="Contacted"
                                >
                                  <Mail className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleUpdateInquiryStatus(lead.id, 'closed')}
                                  className="p-2.5 hover:bg-emerald-500/10 hover:text-emerald-500 rounded-xl transition-all hover:scale-110 active:scale-95"
                                  title="Complete"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "logistics" && (
                <div className="space-y-10">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                      <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Logistics Command Center</h2>
                      <p className="text-sm text-[#64748B] font-medium uppercase tracking-[0.2em] opacity-60">Delivery Partner Authentication & Identity Verification Queue</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button 
                        onClick={handleToggleLogistics}
                        className={`h-14 px-8 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] ${
                          logisticsLocked 
                            ? "bg-rose-500 text-[#111827] shadow-rose-500/20 hover:bg-rose-600" 
                            : "bg-emerald-500 text-[#111827] shadow-emerald-500/20 hover:bg-emerald-600"
                        }`}
                      >
                        {logisticsLocked ? <Lock className="w-4 h-4 mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                        {logisticsLocked ? "Logistics Locked" : "Logistics Active"}
                      </Button>
                      <div className="px-6 py-3 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                          {dbUsers.filter(u => u.role === "delivery" && u.deliveryDetails?.verificationStatus === "pending").length} Partners Awaiting Sync
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                    <div className="xl:col-span-2 space-y-10">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-fit">
                        {dbUsers.filter(u => u.role === "delivery").map((partner, idx) => (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            key={partner.id}
                            className="bg-white/85 backdrop-blur-[20px] border border-white p-8 rounded-[36px] shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] relative overflow-hidden group/titan"
                          >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-6xl font-black pointer-events-none group-hover/titan:opacity-[0.05] transition-opacity uppercase tracking-tighter">
                              {partner.deliveryDetails?.type}
                            </div>

                            <div className="flex items-center gap-6 mb-8">
                              <div className="w-20 h-20 rounded-[2rem] bg-[#F8FAFC] border border-white flex items-center justify-center text-primary font-black text-2xl shadow-inner group-hover/titan:scale-105 transition-transform duration-500 overflow-hidden">
                                 {partner.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="text-2xl font-black uppercase tracking-tight leading-none mb-2">{partner.name}</h4>
                                <div className="flex items-center gap-3">
                                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                    partner.deliveryDetails?.verificationStatus === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                    partner.deliveryDetails?.verificationStatus === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                    'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                  }`}>
                                    {partner.deliveryDetails?.verificationStatus}
                                  </span>
                                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest opacity-60">ID: #{partner.id.slice(0,8)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-8">
                              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-white flex flex-col items-center text-center gap-2">
                                 <Camera className="w-4 h-4 text-primary" />
                                 <p className="text-[9px] font-black uppercase tracking-widest">Face Scan</p>
                                 <button className="text-[8px] font-bold text-primary hover:underline">VIEW DOC</button>
                              </div>
                              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-white flex flex-col items-center text-center gap-2">
                                 <Fingerprint className="w-4 h-4 text-primary" />
                                 <p className="text-[9px] font-black uppercase tracking-widest">Govt ID</p>
                                 <button className="text-[8px] font-bold text-primary hover:underline">VIEW DOC</button>
                              </div>
                              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-white flex flex-col items-center text-center gap-2">
                                 <ShieldCheck className="w-4 h-4 text-primary" />
                                 <p className="text-[9px] font-black uppercase tracking-widest">License</p>
                                 <button className="text-[8px] font-bold text-primary hover:underline">VIEW DOC</button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between p-5 bg-[#F8FAFC] rounded-2xl border border-white mb-8">
                              <div className="flex items-center gap-4">
                                <Truck className="w-5 h-5 text-[#64748B]" />
                                <div>
                                  <p className="text-[10px] font-black text-[#111827] uppercase tracking-widest">{partner.deliveryDetails?.vehicleType} Operational</p>
                                  <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-widest">Plate: {partner.deliveryDetails?.vehicleNumber}</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-4">
                              <Button 
                                onClick={() => handleUpdateDeliveryVerification(partner.id, "approved")}
                                disabled={partner.deliveryDetails?.verificationStatus === "approved"}
                                className="flex-1 h-14 rounded-2xl bg-emerald-500 text-[#111827] font-black text-[11px] uppercase tracking-[0.2em] shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                              >
                                Approve
                              </Button>
                              <Button 
                                onClick={() => handleUpdateDeliveryVerification(partner.id, "rejected")}
                                disabled={partner.deliveryDetails?.verificationStatus === "rejected"}
                                className="flex-1 h-14 rounded-2xl bg-rose-500 text-[#111827] font-black text-[11px] uppercase tracking-[0.2em] shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] shadow-rose-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                              >
                                Reject
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* CALL RECORDINGS SECTION */}
                      <div className="bg-white/85 backdrop-blur-[20px] border border-white rounded-[36px] p-10 shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] overflow-hidden relative group/calls">
                         <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-7xl font-black pointer-events-none group-hover/calls:opacity-[0.05] transition-opacity uppercase tracking-tighter">
                            COMMS
                         </div>
                         <div className="flex items-center justify-between mb-10 relative z-10">
                            <div>
                               <h3 className="text-2xl font-black uppercase tracking-tight">Secure Comms Vault</h3>
                               <p className="text-[11px] font-black text-primary uppercase tracking-widest mt-1">Encrypted Logistics Call Recordings</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                               <MessageSquare className="w-6 h-6" />
                            </div>
                         </div>

                         <div className="space-y-4 relative z-10 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar-sleek">
                            {dbDeliveries.filter(d => d.callRecordings && d.callRecordings.length > 0).map(d => (
                              <div key={d.id} className="p-6 rounded-[2rem] bg-[#F8FAFC] border border-white hover:border-primary/30 transition-all group/rec">
                                 <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                       <div className="w-10 h-10 rounded-xl bg-white border border-white flex items-center justify-center text-primary font-black text-[10px]">#{d.orderId.slice(-4)}</div>
                                       <div>
                                          <p className="text-xs font-black uppercase text-[#111827]">{d.customerName} ↔ Partner</p>
                                          <p className="text-[9px] font-bold text-[#64748B] uppercase">{new Date(d.createdAt).toLocaleString()}</p>
                                       </div>
                                    </div>
                                    <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">Archived</span>
                                 </div>
                                 <div className="space-y-2">
                                    {d.callRecordings?.map((rec, rIdx) => (
                                       <div key={rIdx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-white shadow-sm">
                                          <div className="flex items-center gap-3">
                                             <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                                <Activity className="w-4 h-4" />
                                             </div>
                                             <p className="text-[10px] font-black uppercase text-[#111827]">LOG_CALL_{rIdx + 1}.WAV</p>
                                          </div>
                                          <button className="p-2 rounded-lg bg-[#8B5CF6] text-white hover:scale-110 active:scale-95 transition-all shadow-lg shadow-primary/20">
                                             <Eye className="w-3.5 h-3.5" />
                                          </button>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                            ))}
                            {dbDeliveries.filter(d => d.callRecordings && d.callRecordings.length > 0).length === 0 && (
                               <div className="py-20 text-center text-[#64748B] italic text-sm opacity-40 uppercase tracking-[0.2em] font-black">
                                  No communication logs detected in current cycle.
                               </div>
                            )}
                         </div>
                      </div>
                    </div>

                    <div className="xl:col-span-1 sticky top-8 h-[600px] xl:h-[800px] flex flex-col gap-10">
                       <div className="flex-1">
                          <div className="flex items-center justify-between mb-6">
                              <h3 className="text-xl font-black text-[#111827] uppercase tracking-tight">Global Fleet Satellite</h3>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Live Grid</span>
                              </div>
                          </div>
                          <TacticalMap 
                              isLive={true} 
                              drivers={dbUsers
                                .filter(u => u.role === "delivery" && u.deliveryDetails?.verificationStatus === "approved")
                                .map(u => ({ id: u.id, name: u.name, lat: 0, lng: 0, status: u.deliveryDetails?.status || "offline" }))
                              } 
                          />
                       </div>

                       <div className="p-8 bg-slate-900 rounded-[3rem] text-[#111827] overflow-hidden relative group/perf">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/perf:scale-110 transition-transform duration-1000">
                             <TrendingUp className="w-32 h-32 text-[#111827]" />
                          </div>
                          <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Fleet Performance</h4>
                          <div className="space-y-6 relative z-10">
                             <div>
                                <p className="text-[#64748B] text-[9px] font-black uppercase tracking-widest mb-1">Avg. Dispatch Delay</p>
                                <p className="text-3xl font-black tracking-tighter">0.4m</p>
                             </div>
                             <div>
                                <p className="text-[#64748B] text-[9px] font-black uppercase tracking-widest mb-1">Mission Success Rate</p>
                                <p className="text-3xl font-black tracking-tighter text-emerald-400">99.8%</p>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "hiring" && (
                <div className="space-y-10">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                      <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">HR Command Module</h2>
                      <p className="text-sm text-[#64748B] font-medium uppercase tracking-[0.2em] opacity-60">Global Talent Acquisition & Workforce Management Pipeline</p>
                    </div>
                    <Button 
                      onClick={() => setShowJobForm(true)}
                      className="h-14 px-8 rounded-2xl bg-[#8B5CF6] text-white font-black text-[11px] uppercase tracking-widest shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] shadow-primary/20 hover:scale-[1.02]"
                    >
                      <Briefcase className="w-4 h-4 mr-2" /> Initialize Requisition
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {dbJobs.map((job, idx) => (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={job.id}
                        className="bg-white/85 backdrop-blur-[20px] border border-white p-8 rounded-[36px] shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] relative overflow-hidden group/job"
                      >
                         <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-6xl font-black pointer-events-none group-hover/job:opacity-[0.05] transition-opacity uppercase tracking-tighter">
                          {job.department}
                        </div>
                        <div className="flex items-center gap-3 mb-6">
                          <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 text-[9px] font-black uppercase tracking-widest rounded-lg">{job.type}</span>
                          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest rounded-lg">₹{job.salary}</span>
                        </div>
                        <h4 className="text-2xl font-black uppercase tracking-tight mb-2 leading-none">{job.title}</h4>
                        <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-6 opacity-60">{job.department} • {job.location}</p>
                        
                        <div className="space-y-3 mb-8">
                          {(job.requirements || []).slice(0, 3).map((req, ridx) => (
                            <div key={ridx} className="flex items-center gap-3 text-xs font-medium text-[#64748B]">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                              {req}
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-3">
                          <Button className="flex-1 h-12 rounded-xl bg-[#F1F5F9] text-[#111827] text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-[#111827] transition-all">View Pipeline</Button>
                          <Button 
                            onClick={async () => {
                              try {
                                await fetch("http://localhost/api/delete_job.php", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ id: job.id })
                                });
                                setDbJobs(prev => prev.filter(j => j.id !== job.id));
                                toast.info("Requisition TERMINATED");
                              } catch (e) {
                                toast.error("Failed to terminate requisition.");
                              }
                            }}
                            className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-[#111827] transition-all p-0"
                          >
                            <Ban className="w-5 h-5" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}

                    {dbJobs.length === 0 && (
                      <div className="col-span-full py-24 text-center bg-[#F8FAFC] rounded-[3rem] border border-dashed border-white/50">
                        <Briefcase className="w-16 h-16 text-[#64748B]/10 mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-[#64748B] uppercase tracking-tighter opacity-40">No Active Talent Requisitions</h3>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "ads" && (
                <div className="space-y-10">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                      <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Ad Strategic Command</h2>
                      <p className="text-sm text-[#64748B] font-medium uppercase tracking-[0.2em] opacity-60">Global Ad Verification & Campaign Performance Matrix</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                      { label: "Active Ad Nodes", val: dbAds.filter(a => a.status === 'active' && a.verificationStatus === 'approved').length, icon: Target, color: "text-rose-500", bg: "bg-rose-500/10" },
                      { label: "Pending Verification", val: dbAds.filter(a => a.verificationStatus === 'pending').length, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
                      { label: "Total Impressions", val: dbAds.reduce((sum, a) => sum + (a.reach || 0), 0).toLocaleString(), icon: Eye, color: "text-primary", bg: "bg-primary/10" },
                      { label: "Total Market Clicks", val: dbAds.reduce((sum, a) => sum + (a.clicks || 0), 0).toLocaleString(), icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                    ].map((stat, idx) => (
                      <div key={stat.label} className="bg-white/85 backdrop-blur-[20px] border border-white p-8 rounded-[36px] shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] relative overflow-hidden group/adstat">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.02] font-black text-6xl leading-none pointer-events-none group-hover/adstat:opacity-[0.05] transition-opacity uppercase tracking-tighter">
                          {stat.label.split(' ')[0]}
                        </div>
                        <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} mb-6 w-fit`}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                        <h4 className="text-[12px] font-black text-[#64748B] uppercase tracking-widest mb-1">{stat.label}</h4>
                        <p className="text-4xl font-black text-[#111827] tracking-tighter">{stat.val}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/85 backdrop-blur-[20px] border border-white rounded-[36px] overflow-hidden shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)]">
                    <div className="px-10 py-8 border-b border-white/50 flex items-center justify-between">
                       <h3 className="text-2xl font-black uppercase tracking-tight">Ad Verification Queue</h3>
                       <div className="flex gap-2">
                          <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2">
                             <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                             {dbAds.filter(a => a.verificationStatus === 'pending').length} Awaiting Audit
                          </span>
                       </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-[#F8FAFC] border-b border-white/50 text-[10px] font-black uppercase tracking-widest text-[#64748B]">
                            <th className="px-10 py-6 text-center">Asset</th>
                            <th className="px-6 py-6">Advertiser</th>
                            <th className="px-6 py-6">Strategy</th>
                            <th className="px-6 py-6">Valuation</th>
                            <th className="px-6 py-6">Verification</th>
                            <th className="px-10 py-6 text-right">Command</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {[...dbAds].sort((a, b) => {
                            if (a.verificationStatus === 'pending' && b.verificationStatus !== 'pending') return -1;
                            if (a.verificationStatus !== 'pending' && b.verificationStatus === 'pending') return 1;
                            return 0;
                          }).map((ad) => (
                            <tr key={ad.id} className="hover:bg-[#F8FAFC] transition-colors group">
                              <td className="px-10 py-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                                    {dbProducts.find(p => p.id === ad.productId)?.image || "🚀"}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-black text-[#111827] uppercase tracking-tight truncate max-w-[150px]">{ad.headline || dbProducts.find(p => p.id === ad.productId)?.name || "Untitled Campaign"}</p>
                                    <p className="text-[9px] font-bold text-primary uppercase tracking-widest">{dbProducts.find(p => p.id === ad.productId)?.name || "Unknown Asset"}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-6">
                                <p className="text-xs font-black text-[#111827] uppercase">{dbUsers.find(u => u.id === ad.sellerId)?.name || "Unknown Entity"}</p>
                                <p className="text-[9px] font-bold text-[#64748B] uppercase opacity-60">ID: {ad.sellerId.slice(0, 8)}</p>
                              </td>
                              <td className="px-6 py-6">
                                <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${ad.type === 'daily' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'}`}>
                                  {ad.type}
                                </span>
                              </td>
                              <td className="px-6 py-6">
                                <p className="text-xs font-black text-[#111827] tracking-tighter">₹{ad.totalCost.toLocaleString()}</p>
                                <p className="text-[9px] font-bold text-[#64748B] uppercase opacity-60">{ad.duration} Days</p>
                              </td>
                              <td className="px-6 py-6">
                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                  ad.verificationStatus === 'approved' ? 'bg-[#22C55E]/10 text-[#22C55E] rounded-full px-4 border-emerald-500/20' :
                                  ad.verificationStatus === 'rejected' ? 'bg-[#EF4444]/10 text-[#EF4444] rounded-full px-4 border-rose-500/20' :
                                  'bg-[#F59E0B]/10 text-[#F59E0B] rounded-full px-4 border-amber-500/20'
                                }`}>
                                  {ad.verificationStatus}
                                </span>
                              </td>
                              <td className="px-10 py-6 text-right">
                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {ad.verificationStatus === 'pending' ? (
                                    <>
                                      <Button onClick={() => handleApproveAd(ad.id)} size="sm" className="h-9 px-4 rounded-xl bg-emerald-500 text-[#111827] font-black text-[9px] uppercase tracking-widest shadow-lg shadow-emerald-500/20">Authorize</Button>
                                      <Button onClick={() => handleRejectAd(ad.id)} size="sm" className="h-9 px-4 rounded-xl bg-rose-500 text-[#111827] font-black text-[9px] uppercase tracking-widest shadow-lg shadow-rose-500/20">Reject</Button>
                                    </>
                                  ) : (
                                    <Button onClick={() => handleDeleteAd(ad.id)} size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all"><Ban className="w-4.5 h-4.5" /></Button>
                                  )}
                                  <Button size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"><Eye className="w-4.5 h-4.5" /></Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {dbAds.length === 0 && (
                            <tr>
                              <td colSpan={6} className="px-10 py-24 text-center text-[#64748B] italic text-sm opacity-40 uppercase tracking-[0.2em] font-black">
                                No ad campaigns detected in the current matrix cycle.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          // ... (existing modal code omitted for brevity but preserved)
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-white/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white/95 backdrop-blur-[30px] border border-white shadow-[10px_10px_40px_rgba(15,23,42,0.12),-10px_-10px_40px_rgba(255,255,255,0.8)] w-full max-w-lg rounded-[32px] relative z-10 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-black tracking-tighter uppercase">Entity Verification Matrix</h3>
                    <p className="text-[11px] text-primary font-black uppercase tracking-[0.2em] mt-1">Deep Node Reconnaissance Active</p>
                  </div>
                  <button onClick={() => setSelectedUser(null)} className="p-4 bg-[#F8FAFC] hover:bg-[#F1F5F9] rounded-2xl transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-5">
                    <div className="flex flex-col items-center p-6 bg-primary/5 rounded-3xl border border-primary/10 text-center">
                      <div className="w-20 h-20 rounded-[1.5rem] bg-primary flex items-center justify-center text-[#111827] font-black text-2xl shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] shadow-primary/20 mb-3">
                        {selectedUser.name.substring(0, 2).toUpperCase()}
                      </div>
                      <h4 className="text-xl font-black uppercase tracking-tight leading-none">{selectedUser.name}</h4>
                      <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1.5">Auth: {selectedUser.role}</p>

                      <div className="mt-5 w-full pt-5 border-t border-primary/10 space-y-2.5">
                        <div className="flex items-center gap-3 text-sm text-[#64748B]">
                          <Mail className="w-3.5 h-3.5 text-primary" />
                          <span className="truncate">{selectedUser.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-[#64748B]">
                          <Phone className="w-3.5 h-3.5 text-primary" />
                          <span>{selectedUser.phone || "No Registry"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-white">
                        <p className="text-[9px] font-black text-[#64748B] uppercase tracking-widest mb-2">Protocol Security</p>
                        <div className="flex justify-between items-center bg-emerald-500/5 p-2.5 rounded-xl border border-emerald-500/10">
                          <span className="text-[10px] font-black text-emerald-500">SSL_ACTIVE</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                      </div>
                      <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-white">
                        <p className="text-[9px] font-black text-[#64748B] uppercase tracking-widest mb-2">Node Authority</p>
                        <div className="flex justify-between items-center bg-primary/5 p-2.5 rounded-xl border border-primary/10">
                          <span className="text-[10px] font-black text-primary">AUTHORIZED</span>
                          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <h5 className="text-base font-black uppercase tracking-widest flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-primary" />
                          Brand Inventory Nodes
                        </h5>
                        <span className="text-[11px] font-black px-3 py-1 bg-[#F8FAFC] rounded-full border border-white uppercase tracking-widest">
                          {dbProducts.filter(p => p.sellerId === selectedUser!.id).length} Active Assets
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar-sleek">
                        {dbProducts.filter(p => p.sellerId === selectedUser!.id).map((p) => (
                          <div key={p.id} className="p-4 bg-white dark:bg-white/[0.03] border border-white rounded-2xl hover:border-primary/40 transition-all group/p">
                            <div className="flex items-center gap-4 mb-3">
                              <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center text-xl group-hover/p:scale-110 transition-transform">
                                {p.image}
                              </div>
                              <div className="min-w-0">
                                <p className="text-[11px] font-black text-[#111827] uppercase tracking-tight truncate">{p.name}</p>
                                <p className="text-[9px] text-primary font-bold uppercase tracking-widest">{p.category}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-[#111827]">{p.price}</span>
                              <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${p.verified ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}>
                                {p.verified ? "Verified" : "Audit"}
                              </div>
                            </div>
                          </div>
                        ))}
                        {dbProducts.filter(p => p.sellerId === selectedUser!.id).length === 0 && (
                          <div className="py-10 text-center bg-[#F8FAFC] rounded-[1.5rem] border border-dashed border-white/50">
                            <p className="text-xs text-[#64748B] font-black uppercase tracking-[0.2em] opacity-40">No Assets Found</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/50 flex gap-4">
                      <Button className="flex-1 rounded-2xl bg-[#8B5CF6] text-white font-black text-[10px] uppercase tracking-[0.2em] h-12 shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all" onClick={() => setSelectedUser(null)}>
                        Exit Command Portal
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Job Requisition Modal */}
      <AnimatePresence>
        {showJobForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowJobForm(false)}
              className="absolute inset-0 bg-white/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-[rgba(124,58,237,0.08)] shadow-[0_10px_30px_rgba(15,23,42,0.06)] w-full max-w-2xl rounded-[24px] relative z-10 overflow-hidden"
            >
              <div className="p-8 md:p-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">New Job Requisition</h3>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">HR Command Protocol Initialized</p>
                  </div>
                  <button onClick={() => setShowJobForm(false)} className="p-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] rounded-xl transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const newJob = {
                      title: jTitle,
                      department: jDept,
                      location: jLoc,
                      type: jType,
                      salary: jSalary,
                      description: jDesc,
                      requirements: jReqs.split(",").map(r => r.trim()),
                      status: "open" as const
                    };
                    const res = await fetch("http://localhost/api/add_job.php", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(newJob)
                    });
                    if (res.ok) {
                      const createdJob = await res.json();
                      setDbJobs(prev => [...prev, createdJob]);
                    } else {
                      throw new Error("Failed to add job to database");
                    }
                    setShowJobForm(false);
                    toast.success("Job Requisition Deployed to Network");
                  } catch (e) {
                    toast.error("Failed to deploy requisition.");
                  }
                }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-1">Position Title</label>
                      <input type="text" required value={jTitle} onChange={e => setJTitle(e.target.value)} placeholder="e.g. Senior Logistics Lead" className="w-full h-12 px-5 rounded-xl bg-[#F8FAFC] border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-xs font-black shadow-inner" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-1">Department</label>
                      <input type="text" required value={jDept} onChange={e => setJDept(e.target.value)} className="w-full h-12 px-5 rounded-xl bg-[#F8FAFC] border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-xs font-black shadow-inner" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-1">Location</label>
                      <input type="text" required value={jLoc} onChange={e => setJLoc(e.target.value)} className="w-full h-12 px-5 rounded-xl bg-[#F8FAFC] border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-xs font-black shadow-inner" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-1">Salary Range</label>
                      <input type="text" required value={jSalary} onChange={e => setJSalary(e.target.value)} className="w-full h-12 px-5 rounded-xl bg-[#F8FAFC] border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-xs font-black shadow-inner" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-1">Brief Mission Description</label>
                    <textarea required value={jDesc} onChange={e => setJDesc(e.target.value)} className="w-full h-24 p-5 rounded-xl bg-[#F8FAFC] border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-xs font-medium shadow-inner resize-none" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] ml-1">Requirements (Comma Separated)</label>
                    <input type="text" required value={jReqs} onChange={e => setJReqs(e.target.value)} placeholder="Experience, Skill 1, Skill 2" className="w-full h-12 px-5 rounded-xl bg-[#F8FAFC] border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-xs font-black shadow-inner" />
                  </div>

                  <div className="pt-4 flex gap-4">
                    <Button type="button" onClick={() => setShowJobForm(false)} variant="ghost" className="flex-1 h-12 rounded-xl font-black uppercase text-[10px] tracking-widest">Abort</Button>
                    <Button type="submit" className="flex-2 h-14 rounded-2xl bg-[#8B5CF6] text-white font-black text-[11px] uppercase tracking-widest shadow-[10px_10px_30px_rgba(15,23,42,0.08),-10px_-10px_30px_rgba(255,255,255,0.8)] shadow-primary/20 transition-transform active:scale-95">Deploy Requisition</Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
