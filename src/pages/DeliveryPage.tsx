import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Truck, Bike, Car, Box, ShieldCheck, MapPin, 
  CreditCard, TrendingUp, History, Settings, 
  Power, Package, CheckCircle2, Navigation,
  Clock, ArrowRight, User, Phone, Mail, 
  Lock, Globe, LayoutDashboard, LogOut,
  ChevronRight, Activity, Wallet, Star,
  Zap, Building2, Briefcase, AlertCircle, Eye, EyeOff,
  Smartphone, Camera, Fingerprint, RefreshCw, X, Slash, XCircle, Shield, Upload
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Navigate, useNavigate } from "react-router-dom";
import { 
  updateUserProfile, getDeliveries, addDelivery,
  updateDeliveryStatus, registerUser, saveDeliveries,
  isLogisticsLocked,
  type Delivery, type User as StorageUser
} from "@/lib/storage";
import TacticalMap from "@/components/delivery/TacticalMap";
import RiderRouteSelector from "@/components/delivery/RiderRouteSelector";

const navItems = [
  { id: "overview", label: "Fleet Command", icon: LayoutDashboard, color: "text-primary" },
  { id: "route", label: "Route Planner", icon: MapPin, color: "text-rose-500" },
  { id: "tasks", label: "Active Nodes", icon: Navigation, color: "text-blue-500" },
  { id: "history", label: "Mission Logs", icon: History, color: "text-emerald-500" },
  { id: "earnings", label: "Revenue Matrix", icon: Wallet, color: "text-amber-500" },
  { id: "settings", label: "System Config", icon: Settings, color: "text-slate-500" },
];

const vehicleIcons = {
  bike: Bike,
  car: Car,
  van: Box,
  truck: Truck
};

export default function DeliveryPage() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [logisticsLocked] = useState(isLogisticsLocked());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [regStep, setRegStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useMemo(() => ({ current: null as HTMLVideoElement | null }), []);
  const canvasRef = useMemo(() => ({ current: null as HTMLCanvasElement | null }), []);
  const fileInputRef = useMemo(() => ({ current: null as HTMLInputElement | null }), []);
  const [regData, setRegData] = useState({ 
    docs: { 
      profilePhoto: "", 
      govtId: "", 
      license: "" 
    } 
  });
  const [activeCaptureType, setActiveCaptureType] = useState<"profilePhoto" | "govtId" | "license">("profilePhoto");

  const startCamera = async () => {
    setIsCapturing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      toast.error("Optical Sensor Failed: Access Denied");
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const photo = canvasRef.current.toDataURL('image/jpeg');
        setRegData(prev => ({
          ...prev,
          docs: { ...prev.docs, [activeCaptureType]: photo }
        }));
        stopCamera();
        toast.success(`${activeCaptureType.replace(/([A-Z])/g, ' $1').trim()} Captured Successfully`);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const photo = reader.result as string;
        setRegData(prev => ({
          ...prev,
          docs: { ...prev.docs, [activeCaptureType]: photo }
        }));
        toast.success(`${activeCaptureType.replace(/([A-Z])/g, ' $1').trim()} Uploaded Successfully`);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    setDirection(1);
    setRegStep(prev => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setDirection(-1);
    setRegStep(prev => Math.max(prev - 1, 1));
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  const [activeTab, setActiveTab] = useState("overview");

  // Registration State
  const [pType, setPType] = useState<"individual" | "company" | "fleet">("individual");
  const [vType, setVType] = useState<"bike" | "car" | "van" | "truck">("bike");
  const [vNumber, setVNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Unified Registration State (for new users)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPw, setShowPw] = useState(false);

  // Dashboard State
  const [isOnline, setIsOnline] = useState(false);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [activeCall, setActiveCall] = useState<{ isOpen: boolean; target: string; deliveryId: string } | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const allDeliveries = getDeliveries();
      let changed = false;
      const updated = allDeliveries.map(d => {
        const arrivalTime = d.status === "arrived_pickup" ? d.arrivalTimePickup : (d.status === "arrived_drop" ? d.arrivalTimeDrop : null);
        if (arrivalTime) {
          const arrival = new Date(arrivalTime).getTime();
          const now = new Date().getTime();
          const diffMins = Math.floor((now - arrival) / 60000);
          
          if (diffMins > 2) {
            const newWaitingMins = diffMins - 2;
            // Fetch seller's wait charge rate
            const allUsers = JSON.parse(localStorage.getItem("zenzetrade_users") || "[]");
            const seller = allUsers.find((u: any) => u.id === d.sellerId);
            const waitRate = seller?.deliveryPricing?.waitChargePerMin || 5;
            
            const newCharges = newWaitingMins * waitRate;
            if (d.waitingCharges !== newCharges) {
              changed = true;
              return { ...d, waitingTime: newWaitingMins, waitingCharges: newCharges };
            }
          }
        }
        return d;
      });

      if (changed) {
        saveDeliveries(updated);
        setDeliveries(updated.filter(d => d.partnerId === user?.id || d.status === "pending"));
      }
    }, 10000); // Check every 10s

    return () => clearInterval(timer);
  }, [user]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  useEffect(() => {
    if (user?.deliveryDetails) {
      setIsOnline(user.deliveryDetails.status === "online");
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === "delivery" && user.deliveryDetails?.verificationStatus === "approved") {
      const allDeliveries = getDeliveries();
      if (allDeliveries.length === 0) {
        const samples: any[] = [
          { id: "1", orderId: "ORD-9921", partnerId: "", customerName: "Industrial Hub A", deliveryAddress: "Industrial Area Phase 2, Delhi", pickupAddress: "Sector 18, Noida", status: "pending", estimatedTime: "25 min", amount: 450, createdAt: new Date().toISOString() },
          { id: "2", orderId: "ORD-8812", partnerId: "", customerName: "Tech Corp Z", deliveryAddress: "Cyber City, Gurugram", pickupAddress: "Okhla Estate, Delhi", status: "pending", estimatedTime: "40 min", amount: 820, createdAt: new Date().toISOString() },
          { id: "3", orderId: "ORD-7734", partnerId: "", customerName: "Global Exports", deliveryAddress: "Whitefield, Bengaluru", pickupAddress: "Peenya Industrial Area", status: "pending", estimatedTime: "35 min", amount: 650, createdAt: new Date().toISOString() },
        ];
        
        samples.forEach(s => addDelivery(s));
        setDeliveries(getDeliveries().filter(d => d.partnerId === user.id || d.status === "pending"));
      } else {
        setDeliveries(allDeliveries.filter(d => d.partnerId === user.id || d.status === "pending"));
      }
    } else {
      // Strictly Zero Missions for Unverified Nodes
      setDeliveries([]);
    }
  }, [user]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regStep < 5) {
      nextStep();
      return;
    }
    
    if (!vNumber) return toast.error("Vehicle ID required for network synchronization");
    
    if (!user) {
      if (!name || !email || !password) return toast.error("All mission-critical identity fields required");
    }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));

    if (user) {
      const updatedUser: StorageUser = {
        ...user,
        name, // Allow updating name
        phone, // New field
        role: "delivery",
        deliveryDetails: {
          type: pType,
          vehicleType: vType,
          vehicleNumber: vNumber,
          status: "offline",
          earnings: 0,
          completedDeliveries: 0,
          cancelledDeliveries: 0,
          rating: 5.0,
          verificationStatus: "pending",
          docs: {
            profilePhoto: regData.docs.profilePhoto || "simulated_photo_url",
            govtId: regData.docs.govtId || "simulated_id_url",
            license: regData.docs.license || "simulated_license_url"
          }
        },
      };

      const res = updateUserProfile(updatedUser);
      if (res.success) {
        setUser(updatedUser);
        toast.success("Logistics Node Established. Welcome to the Force.");
      } else {
        toast.error(res.error || "Network Sync Failed");
      }
    } else {
      const res = registerUser({
        name,
        email,
        password,
        phone,
        role: "delivery",
        deliveryDetails: {
          type: pType,
          vehicleType: vType,
          vehicleNumber: vNumber,
          status: "offline",
          earnings: 0,
          completedDeliveries: 0,
          cancelledDeliveries: 0,
          rating: 5.0,
          verificationStatus: "pending",
          docs: {
            profilePhoto: regData.docs.profilePhoto || "simulated_photo_url",
            govtId: regData.docs.govtId || "simulated_id_url",
            license: regData.docs.license || "simulated_license_url"
          }
        }
      });
      if (res.success) {
        setUser(res.user!);
        toast.success("Identity Authenticated. Logistics Node Established.");
      } else {
        toast.error(res.error || "Network Sync Failed");
      }
    }
    setIsSubmitting(false);
  };

  const toggleOnline = () => {
    const newStatus = isOnline ? "offline" : "online";
    const updatedUser: StorageUser = {
      ...user!,
      deliveryDetails: {
        ...user!.deliveryDetails!,
        status: newStatus as any
      }
    };
    updateUserProfile(updatedUser);
    setUser(updatedUser);
    setIsOnline(!isOnline);
    toast(newStatus === "online" ? "System Online. Scanning for missions..." : "System Offline. Disconnected from network.");
  };

  const handleLogout = () => {
    setUser(null);
    import("@/lib/storage").then(mod => mod.logoutUser());
    toast.success("Identity De-authenticated. Returning to Home.");
    navigate("/");
  };

  const handleAcceptDelivery = (id: string) => {
    if (user?.deliveryDetails?.verificationStatus !== "approved") {
      toast.error("MISSION REJECTED: Node Authentication Required");
      return;
    }
    
    const deliveries = getDeliveries();
    const d = deliveries.find(x => x.id === id);
    if (d) {
      d.status = "accepted";
      d.partnerId = user!.id;
      d.partnerName = user!.name;
      d.partnerPhone = user!.email; // Using email as phone for demo
      saveDeliveries(deliveries);
      setDeliveries(deliveries.filter(x => x.partnerId === user!.id || x.status === "pending"));
      toast.success("Mission Locked. Proceed to pickup node.");
    }
  };

  const [otpModal, setOtpModal] = useState<{ isOpen: boolean; deliveryId: string; type: 'pickup' | 'drop' }>({
    isOpen: false,
    deliveryId: '',
    type: 'pickup'
  });
  const [otpValue, setOtpValue] = useState(['', '', '', '']);

  const handleOtpInput = (index: number, val: string) => {
    if (val.length > 1) return;
    const newOtp = [...otpValue];
    newOtp[index] = val;
    setOtpValue(newOtp);
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOTP = () => {
    const code = otpValue.join('');
    const delivery = deliveries.find(d => d.id === otpModal.deliveryId);
    const targetOtp = otpModal.type === 'pickup' ? (delivery?.pickupOtp || "1234") : (delivery?.dropOtp || "1234");
    
    if (code === targetOtp) {
      const newStatus = otpModal.type === 'pickup' ? 'picked_up' : 'completed';
      updateDeliveryStatus(otpModal.deliveryId, newStatus);
      
      // Update deliveryDetails stats if completed
      if (newStatus === 'completed' && user) {
        const updatedUser: StorageUser = {
          ...user,
          deliveryDetails: {
            ...user.deliveryDetails!,
            earnings: (user.deliveryDetails?.earnings || 0) + Math.round((delivery?.amount || 0) * 0.8) + (delivery?.waitingCharges || 0),
            completedDeliveries: (user.deliveryDetails?.completedDeliveries || 0) + 1
          }
        };
        updateUserProfile(updatedUser);
        setUser(updatedUser);
      }

      setDeliveries(getDeliveries().filter(d => d.partnerId === user?.id || d.status === "pending"));
      toast.success(otpModal.type === 'pickup' ? "Cargo Authenticated. Proceed to drop node." : "Mission Success. Revenue Matrix Updated.");
      setOtpModal({ ...otpModal, isOpen: false });
      setOtpValue(['', '', '', '']);
    } else {
      toast.error("INVALID TOKEN: Authentication Failed");
    }
  };

  const handleArrive = (id: string, type: 'pickup' | 'drop') => {
    const status = type === 'pickup' ? 'arrived_pickup' : 'arrived_drop';
    const all = getDeliveries();
    const updated = all.map(d => {
      if (d.id === id) {
        const now = new Date().toISOString();
        return { 
          ...d, 
          status, 
          [type === 'pickup' ? 'arrivalTimePickup' : 'arrivalTimeDrop']: now 
        } as Delivery;
      }
      return d;
    });
    import("@/lib/storage").then(mod => {
      mod.saveDeliveries(updated);
      setDeliveries(updated.filter(d => d.partnerId === user?.id || d.status === "pending"));
    });
    toast.info(`Node Arrival Logged. Grace period: 2 mins.`);
  };

  const handleSimulateCall = (deliveryId: string, target: string) => {
    setActiveCall({ isOpen: true, target, deliveryId });
    setIsRecording(true);
    toast.info("Call Connection Established. Recording Node...");
  };

  const handleEndCall = () => {
    if (activeCall) {
      const all = getDeliveries();
      const updated = all.map(d => {
        if (d.id === activeCall.deliveryId) {
          const rec = {
            type: "audio" as const,
            url: "simulated_recording_url",
            timestamp: new Date().toISOString()
          };
          return { ...d, callRecordings: [...(d.callRecordings || []), rec] };
        }
        return d;
      });
      import("@/lib/storage").then(mod => {
        mod.saveDeliveries(updated);
        setDeliveries(updated.filter(d => d.partnerId === user?.id || d.status === "pending"));
      });
      toast.success("Call Terminated. Recording Encrypted & Stored.");
    }
    setActiveCall(null);
    setIsRecording(false);
  };

  // If user is not a delivery partner, show registration
  if (!user || user.role !== "delivery") {
    return (
      <Layout>
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-background/95 py-20 px-4 relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -mr-64 -mt-64 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -ml-64 -mb-64 animate-pulse" style={{ animationDelay: '2s' }} />

          <div className="container max-w-5xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-primary/20"
              >
                <Zap className="w-4 h-4" /> Join the Logistics Command
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight text-foreground mb-6 leading-tight">
                Become a <span className="text-gradient">Delivery Titan.</span>
              </h1>
              <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
                Join the world's most advanced logistics network. High-velocity missions, instant settlements, and elite-tier growth.
              </p>
            </div>

            <div className="grid lg:grid-cols-5 gap-12 items-start">
              {/* Left Side: Onboarding Protocol */}
              <div className="lg:col-span-2 space-y-8">
                <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10">
                    <h3 className="text-xl font-black uppercase tracking-tight mb-8 flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-primary/20"><ShieldCheck className="w-5 h-5 text-primary" /></div>
                      Operational Protocol
                    </h3>
                    <div className="space-y-10">
                      {[
                        { step: "01", title: "Identity Auth", desc: "Establish your secure digital node in the network." },
                        { step: "02", title: "Node Class", desc: "Select your operational classification (Solo/Corp/Fleet)." },
                        { step: "03", title: "Asset Sync", desc: "Initialize your transport matrix for mission deployment." },
                        { step: "04", title: "Live Link", desc: "Activate your node and begin high-velocity delivery." }
                      ].map((s, i) => (
                        <div key={i} className="flex gap-6 relative">
                          {i < 3 && <div className="absolute left-[19px] top-10 bottom-[-40px] w-0.5 bg-gradient-to-b from-primary/50 to-transparent" />}
                          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 z-10 group-hover:scale-110 transition-transform">
                            <span className="text-xs font-black text-primary">{s.step}</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-black uppercase tracking-widest text-white/90">{s.title}</h4>
                            <p className="text-[11px] text-white/50 mt-1 font-medium leading-relaxed">{s.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                    <Building2 className="w-64 h-64 text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {[
                    { icon: Zap, title: "Instant Payouts", desc: "Real-time earnings settlements." },
                    { icon: ShieldCheck, title: "Elite Coverage", desc: "Full-spectrum transit protection." }
                  ].map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-6 rounded-[2rem] bg-white dark:bg-card border border-border shadow-sm hover:border-primary/30 transition-all flex items-center gap-5 group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors shrink-0">
                        <f.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-[10px] font-black text-foreground uppercase tracking-widest">{f.title}</h3>
                        <p className="text-[10px] text-muted-foreground font-medium mt-0.5 leading-relaxed">{f.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Side: Form */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:col-span-3 bg-white dark:bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
              >
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-muted">
                  <motion.div 
                    initial={{ width: "20%" }}
                    animate={{ width: `${(regStep / 5) * 100}%` }}
                    className="h-full gradient-primary"
                  />
                </div>

                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Mission Onboarding</h2>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-1">Step {regStep} of 5: {
                      regStep === 1 ? "Account Setup" : 
                      regStep === 2 ? "Identity Verify" : 
                      regStep === 3 ? "Partner Type" : 
                      regStep === 4 ? "Vehicle Selection" : 
                      "Final Verification"
                    }</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-black">{regStep}</span>
                  </div>
                </div>

                <form onSubmit={handleRegister} className="space-y-8 relative min-h-[400px]">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={regStep}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="space-y-8"
                    >
                      {regStep === 1 && (
                        <div className="space-y-6">
                          <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2">Personal Identity & Contact</label>
                          <div className="grid grid-cols-1 gap-4">
                            <div className="relative">
                              <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                              <input 
                                type="text" 
                                required 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                placeholder="FULL NAME" 
                                readOnly={!!user && user.role === 'admin'}
                                className={`w-full h-16 pl-16 pr-6 rounded-2xl bg-muted/30 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-sm font-black uppercase tracking-widest shadow-inner ${user?.role === 'admin' ? 'opacity-60 cursor-not-allowed' : ''}`} 
                              />
                            </div>
                            <div className="relative">
                              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                              <input 
                                type="email" 
                                required 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                placeholder="EMAIL ADDRESS" 
                                readOnly={!!user && user.role === 'admin'}
                                className={`w-full h-16 pl-16 pr-6 rounded-2xl bg-muted/30 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-sm font-black uppercase tracking-widest shadow-inner ${user?.role === 'admin' ? 'opacity-60 cursor-not-allowed' : ''}`} 
                              />
                            </div>
                            <div className="relative">
                              <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                              <input 
                                type="tel" 
                                required 
                                value={phone} 
                                onChange={e => setPhone(e.target.value)} 
                                placeholder="MOBILE NUMBER (FOR MISSION COMMS)" 
                                className="w-full h-16 pl-16 pr-6 rounded-2xl bg-muted/30 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-sm font-black uppercase tracking-widest shadow-inner" 
                              />
                            </div>
                            {!user && (
                              <div className="relative">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                                <input type={showPw ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} placeholder="CREATE ACCESS KEY" className="w-full h-16 pl-16 pr-14 rounded-2xl bg-muted/30 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-sm font-black uppercase tracking-widest shadow-inner" />
                                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground">
                                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            )}
                          </div>

                          {user && (
                            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-black text-xs">{user.name.charAt(0)}</div>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Logged in as {user.role}. Your existing credentials will be upgraded.</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* STEP 2: BIO-METRIC & DOCUMENT CAPTURE */}
                      {regStep === 2 && (
                        <div className="space-y-12">
                          <div className="text-center space-y-2">
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2 bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent">Bio-Metric Command</h2>
                            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Synchronizing Identity with the Logistics Grid</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-12 items-start">
                             {/* VIEWPORT & CAPTURE ACTIONS */}
                             <div className="space-y-8">
                                <div className="relative aspect-[16/10] bg-slate-950 rounded-[2.5rem] overflow-hidden border-[6px] border-slate-900 shadow-2xl group ring-1 ring-white/5">
                                   {/* Scanning Overlay */}
                                   {isCapturing && (
                                     <div className="absolute inset-0 z-20 pointer-events-none">
                                        <motion.div 
                                          initial={{ top: "0%" }}
                                          animate={{ top: "100%" }}
                                          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                          className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_20px_#3b82f6] z-40"
                                        />
                                        <div className="absolute inset-0 bg-primary/10 animate-pulse z-10" />
                                        {/* Corner Accents */}
                                        <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-primary/50 z-30" />
                                        <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-primary/50 z-30" />
                                        <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-primary/50 z-30" />
                                        <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-primary/50 z-30" />
                                     </div>
                                   )}

                                   {isCapturing ? (
                                     <video ref={v => { videoRef.current = v; }} className="w-full h-full object-cover scale-x-[-1] opacity-90" />
                                   ) : regData.docs[activeCaptureType] ? (
                                     <motion.img 
                                       initial={{ opacity: 0, scale: 1.1 }}
                                       animate={{ opacity: 1, scale: 1 }}
                                       src={regData.docs[activeCaptureType]} 
                                       className="w-full h-full object-cover" 
                                     />
                                   ) : (
                                     <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900">
                                        <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-4 border border-white/5 shadow-inner">
                                          <Camera className="w-8 h-8 text-white/20" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Sensor Offline</p>
                                     </div>
                                   )}

                                   {/* Viewport Badge */}
                                   <div className="absolute top-6 left-6 z-30">
                                      <div className="px-4 py-2 bg-black/80 backdrop-blur-xl rounded-full border border-white/10 flex items-center gap-2">
                                         <div className={`w-2 h-2 rounded-full ${isCapturing ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                                         <p className="text-[9px] font-black text-white uppercase tracking-[0.2em]">{activeCaptureType.replace(/([A-Z])/g, ' $1').trim()} Viewport</p>
                                      </div>
                                   </div>
                                   
                                   <canvas ref={c => { canvasRef.current = c; }} className="hidden" />
                                </div>

                                 <div className="flex flex-col gap-6">
                                   {!isCapturing ? (
                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                       <Button 
                                         type="button" 
                                         onClick={startCamera} 
                                         className="h-20 rounded-[1.5rem] bg-primary text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 hover:scale-[1.02] transition-all active:scale-95 group relative overflow-hidden"
                                       >
                                          <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                                          <Camera className="w-5 h-5 shrink-0" /> 
                                          <span className="relative z-10">Live Scan</span>
                                       </Button>
                                       <Button 
                                         type="button" 
                                         onClick={() => fileInputRef.current?.click()} 
                                         variant="outline"
                                         className="h-20 rounded-[1.5rem] border-2 border-primary/20 bg-white dark:bg-slate-900/50 text-primary font-black text-xs uppercase tracking-widest hover:bg-primary/5 hover:border-primary/40 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg"
                                       >
                                          <Upload className="w-5 h-5 shrink-0" /> 
                                          <span>Manual Upload</span>
                                       </Button>
                                       <input 
                                         type="file" 
                                         ref={el => { if (el) fileInputRef.current = el; }} 
                                         onChange={handleFileUpload} 
                                         accept="image/*" 
                                         className="hidden" 
                                       />
                                     </div>
                                   ) : (
                                     <div className="flex gap-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <Button 
                                          type="button" 
                                          onClick={capturePhoto} 
                                          className="flex-1 h-20 rounded-[1.5rem] bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center gap-3"
                                        >
                                          <Zap className="w-5 h-5 fill-white" /> Execute Capture
                                        </Button>
                                        <Button 
                                          type="button" 
                                          onClick={stopCamera} 
                                          variant="ghost" 
                                          className="w-20 h-20 rounded-[1.5rem] border-2 border-rose-500/20 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/40 flex items-center justify-center transition-all shrink-0"
                                        >
                                          <X className="w-7 h-7" />
                                        </Button>
                                     </div>
                                   )}
                                   <div className="flex items-center justify-center gap-4 opacity-40">
                                      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-muted-foreground/30" />
                                      <p className="text-[8px] text-muted-foreground font-black uppercase tracking-[0.4em] whitespace-nowrap">
                                        Secure Encryption Layer Active
                                      </p>
                                      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-muted-foreground/30" />
                                   </div>
                                 </div>
                             </div>

                             {/* SELECTION MATRIX */}
                             <div className="space-y-4">
                                {[
                                  { id: "profilePhoto", label: "Biometric Face Scan", icon: User, desc: "A.I. Enabled Recognition" },
                                  { id: "govtId", label: "National Identity ID", icon: Fingerprint, desc: "Aadhar / PAN / Passport" },
                                  { id: "license", label: "Operational Permit", icon: ShieldCheck, desc: "Certified Vehicle License" }
                                ].map((doc) => (
                                  <button
                                    key={doc.id}
                                    type="button"
                                    onClick={() => { setActiveCaptureType(doc.id as any); stopCamera(); }}
                                    className={`w-full group relative flex items-center gap-6 p-6 rounded-[2rem] border-2 transition-all text-left overflow-hidden ${activeCaptureType === doc.id ? "border-primary bg-primary/5 shadow-2xl scale-[1.02] z-10" : "border-border hover:bg-muted/50"}`}
                                  >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shrink-0 ${regData.docs[doc.id as keyof typeof regData.docs] ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : (activeCaptureType === doc.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-muted text-muted-foreground')}`}>
                                       {regData.docs[doc.id as keyof typeof regData.docs] ? <CheckCircle2 className="w-7 h-7" /> : <doc.icon className="w-7 h-7" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                       <p className="text-xs font-black text-foreground uppercase tracking-tight mb-1">{doc.label}</p>
                                       <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">{doc.desc}</p>
                                    </div>
                                    {regData.docs[doc.id as keyof typeof regData.docs] && (
                                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                    )}
                                    {activeCaptureType === doc.id && (
                                      <motion.div 
                                        layoutId="active-indicator"
                                        className="absolute right-0 top-0 bottom-0 w-1 bg-primary" 
                                      />
                                    )}
                                  </button>
                                ))}

                                <div className="mt-8 p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden group">
                                   <div className="relative z-10">
                                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Protocol Status</h4>
                                      <p className="text-[11px] font-bold text-white/70 leading-relaxed uppercase tracking-tight">
                                        Please ensure all documents are original and clearly visible. 
                                      </p>
                                   </div>
                                   <Shield className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5 group-hover:rotate-12 transition-transform duration-700" />
                                </div>
                             </div>
                          </div>
                        </div>
                      )}

                      {regStep === 3 && (
                        <div className="space-y-6">
                          <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2">Partner Classification</label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                              { id: "individual", label: "Solo Operator", desc: "Working Individually", icon: User },
                              { id: "company", label: "Corporate Entity", desc: "Registered Company", icon: Building2 },
                              { id: "fleet", label: "Fleet Command", desc: "Managing Multiple Nodes", icon: Briefcase }
                            ].map((t) => (
                              <button
                                key={t.id}
                                type="button"
                                onClick={() => setPType(t.id as any)}
                                className={`flex flex-col items-center justify-center p-8 rounded-3xl border-2 transition-all gap-4 text-center ${pType === t.id ? "border-primary bg-primary/5 shadow-xl scale-[1.02]" : "border-border hover:bg-muted"}`}
                              >
                                <div className={`p-4 rounded-2xl ${pType === t.id ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                                  <t.icon className="w-6 h-6" />
                                </div>
                                <div>
                                  <span className="block text-[10px] font-black uppercase tracking-widest">{t.label}</span>
                                  <span className="block text-[9px] text-muted-foreground font-medium mt-1 uppercase tracking-tighter">{t.desc}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {regStep === 4 && (
                        <div className="space-y-6">
                          <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2">Transport Matrix Selection</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                              { id: "bike", label: "2-Wheeler", desc: "Bike / Scooter / EV", icon: Bike },
                              { id: "car", label: "4-Wheeler", desc: "Car / Sedan / SUV", icon: Car },
                              { id: "van", label: "Commercial", desc: "Van / Mini Truck", icon: Box },
                              { id: "truck", label: "Heavy Logistics", desc: "Truck / Trailer", icon: Truck }
                            ].map((v) => (
                              <button
                                key={v.id}
                                type="button"
                                onClick={() => setVType(v.id as any)}
                                className={`flex items-center gap-6 p-6 rounded-3xl border-2 transition-all text-left ${vType === v.id ? "border-primary bg-primary/5 shadow-xl scale-[1.02]" : "border-border hover:bg-muted"}`}
                              >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${vType === v.id ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                                  <v.icon className="w-7 h-7" />
                                </div>
                                <div>
                                  <span className="block text-[10px] font-black uppercase tracking-widest">{v.label}</span>
                                  <span className="block text-[9px] text-muted-foreground font-medium mt-1 uppercase tracking-tighter">{v.desc}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {regStep === 5 && (
                        <div className="space-y-6">
                          <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2">Final Node Verification</label>
                          <div className="relative">
                            <Truck className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground/40" />
                            <input
                              type="text"
                              value={vNumber}
                              onChange={e => setVNumber(e.target.value.toUpperCase())}
                              placeholder="ENTER LICENSE PLATE NO."
                              className="w-full h-20 pl-16 pr-6 rounded-2xl bg-muted/30 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-lg font-black uppercase tracking-[0.3em] shadow-inner"
                            />
                          </div>
                          <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-4">
                            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold leading-relaxed uppercase tracking-wider">
                              By establishing this logistics link, you agree to the Titan Protocol and high-velocity transit regulations.
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex gap-4 pt-8">
                    {regStep > 1 && (
                      <Button
                        type="button"
                        onClick={prevStep}
                        variant="outline"
                        className="flex-1 h-16 rounded-2xl border-2 border-border font-black text-[10px] uppercase tracking-[0.2em] hover:bg-muted transition-all"
                      >
                        Previous Step
                      </Button>
                    )}
                    <Button
                      disabled={isSubmitting || (regStep === 2 && (!regData.docs.profilePhoto || !regData.docs.govtId || !regData.docs.license))}
                      className={`h-16 rounded-2xl gradient-primary text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all ${regStep === 1 ? 'w-full' : 'flex-[2]'}`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Synchronizing...
                        </div>
                      ) : (
                        regStep === 5 ? "Complete Registration" : "Continue Registration"
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // DASHBOARD VIEW
  if (user.deliveryDetails?.verificationStatus === "pending") {
    return (
      <Layout>
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-background/95 flex items-center justify-center py-20 px-6">
          <div className="max-w-2xl w-full text-center">
            <motion.div 
              animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-40 h-40 rounded-[3rem] bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-12 shadow-2xl shadow-amber-500/10 mx-auto"
            >
              <ShieldCheck className="w-20 h-20 text-amber-500" />
            </motion.div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-amber-500/20">
              <Clock className="w-4 h-4" /> Node Sync Under Review
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-foreground uppercase tracking-tight mb-6">Logistics Identity Syncing...</h2>
            <p className="text-muted-foreground text-lg font-medium leading-relaxed mb-12 italic">
              "Your tactical profile is currently being audited by our central command. This high-fidelity verification ensures platform integrity. Access to missions will be granted within <span className="text-primary font-black">24 hours</span>."
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              {[
                { label: "Network Scan", status: "Completed", icon: Globe, color: "text-emerald-500" },
                { label: "Identity Sync", status: "In Progress", icon: User, color: "text-amber-500" },
                { label: "Vehicle Audit", status: "Queued", icon: Truck, color: "text-muted-foreground" }
              ].map((s, i) => (
                <div key={i} className="p-8 rounded-[2rem] bg-white dark:bg-card border border-border flex flex-col items-center gap-4 shadow-sm hover:shadow-md transition-all">
                  <s.icon className={`w-8 h-8 ${s.color}`} />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1">{s.label}</p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">{s.status}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate("/")} variant="outline" className="h-16 px-10 rounded-2xl border-2 border-border font-black text-[11px] uppercase tracking-[0.3em]">
                Return to Command
              </Button>
              <Button onClick={handleLogout} className="h-16 px-10 rounded-2xl bg-rose-500 text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-xl">
                De-Authenticate
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (user.deliveryDetails?.verificationStatus === "rejected") {
    return (
      <Layout>
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-background/95 flex items-center justify-center py-20 px-6">
          <div className="max-w-2xl w-full text-center">
            <div className="w-40 h-40 rounded-[3rem] bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-12 shadow-2xl shadow-rose-500/10 mx-auto">
              <AlertCircle className="w-20 h-20 text-rose-500" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-foreground uppercase tracking-tight mb-6">Authentication Failed</h2>
            <p className="text-muted-foreground text-lg font-medium leading-relaxed mb-12">
              Central command has rejected your logistics application due to inconsistent identity tokens or invalid documentation. You must re-initialize your onboarding process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => {
                  const updatedUser = { ...user, role: "buyer" as any, deliveryDetails: undefined };
                  setUser(updatedUser);
                  updateUserProfile(updatedUser);
                }}
                className="h-16 px-12 rounded-2xl gradient-primary text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-xl"
              >
                Re-Initialize Node
              </Button>
              <Button onClick={handleLogout} variant="outline" className="h-16 px-10 rounded-2xl border-2 border-border font-black text-[11px] uppercase tracking-[0.3em]">
                Exit System
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-background/95 pb-20">
        <div className="container-wide px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-8 pt-8">
            
            {/* SIDEBAR NAVIGATION */}
            <aside className="w-full lg:w-72 shrink-0">
              <div className="bg-white dark:bg-card border border-border rounded-[2.5rem] p-6 shadow-sm sticky top-24">
                <div className="flex items-center gap-4 mb-8 px-2">
                  <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center text-white font-black text-xl shadow-lg relative">
                    {user.name.charAt(0)}
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-card ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-foreground truncate uppercase tracking-tight">{user.name}</p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Titan ID: #{user.id.slice(0, 8)}</p>
                  </div>
                </div>

                <div className="px-2 mb-8">
                  <button
                    onClick={toggleOnline}
                    className={`w-full h-14 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                      isOnline 
                        ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20" 
                        : "bg-muted text-muted-foreground hover:bg-slate-200"
                    }`}
                  >
                    <Power className="w-4 h-4" />
                    {isOnline ? "Node Online" : "System Offline"}
                  </button>
                </div>

                <nav className="space-y-1.5">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all group ${
                        activeTab === item.id 
                          ? "bg-primary text-white shadow-xl shadow-primary/20" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === item.id ? "text-white" : item.color}`} />
                      {item.label}
                    </button>
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t border-border px-2">
                  <button onClick={() => navigate("/")} className="w-full flex items-center gap-4 px-4 py-2 text-primary hover:text-primary/80 font-bold text-[10px] uppercase tracking-[0.2em] transition-colors">
                    <Globe className="w-4 h-4" /> Central Command
                  </button>
                  <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-2 mt-2 text-rose-500 hover:text-rose-600 font-bold text-[10px] uppercase tracking-[0.2em] transition-colors">
                    <LogOut className="w-4 h-4" /> Eject Node
                  </button>
                </div>
              </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  
                  {/* OVERVIEW TAB */}
                  {activeTab === "overview" && (
                    <div className="space-y-8">
                      {/* Top Metrics */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {(() => {
                          const ratedMissions = deliveries.filter(d => d.partnerId === user.id && d.isRated && d.rating);
                          const avgRating = ratedMissions.length > 0 
                            ? (ratedMissions.reduce((acc, curr) => acc + (curr.rating || 0), 0) / ratedMissions.length).toFixed(1)
                            : "5.0";
                          
                          return [
                            { label: "Completed Force", val: user.deliveryDetails?.completedDeliveries || 0, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/5" },
                            { label: "Aborted Nodes", val: user.deliveryDetails?.cancelledDeliveries || 0, icon: XCircle, color: "text-rose-500", bg: "bg-rose-500/5" },
                            { label: "Success Rate", val: `${Math.round(((user.deliveryDetails?.completedDeliveries || 0) / (Math.max(1, (user.deliveryDetails?.completedDeliveries || 0) + (user.deliveryDetails?.cancelledDeliveries || 0)))) * 100)}%`, icon: Activity, color: "text-primary", bg: "bg-primary/5" },
                            { label: "Node Rating", val: avgRating, icon: Star, color: "text-amber-500", bg: "bg-amber-500/5", fill: true }
                          ].map((m, i) => (
                            <div key={i} className="bg-white dark:bg-card border border-border rounded-3xl p-8 shadow-sm group hover:border-primary/30 transition-all relative overflow-hidden">
                              <div className={`absolute top-0 right-0 w-24 h-24 ${m.bg} rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700`} />
                              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-4 group-hover:text-primary transition-colors relative z-10">{m.label}</p>
                              <div className="flex items-end justify-between relative z-10">
                                <h3 className="text-3xl font-black text-foreground tracking-tighter">{m.val}</h3>
                                <m.icon className={`w-8 h-8 ${m.color} opacity-20 ${m.fill ? 'fill-current' : ''}`} />
                              </div>
                            </div>
                          ));
                        })()}
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* Tactical Mission Feed */}
                        <div className="bg-white dark:bg-card border border-border rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
                          <div className="flex items-center justify-between mb-10 relative z-10">
                            <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Active Sector Scans</h3>
                            <button onClick={() => setActiveTab("tasks")} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline decoration-2 underline-offset-4">View All Missions</button>
                          </div>
                          <div className="space-y-4 relative z-10">
                            {deliveries.filter(d => d.status === "pending").slice(0, 3).map((d) => (
                              <div key={d.id} className="flex flex-col p-6 bg-muted/20 rounded-[2rem] border border-transparent hover:border-border transition-all group relative overflow-hidden">
                                <div className="flex items-start justify-between mb-6">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm border border-border group-hover:scale-110 transition-transform">📦</div>
                                    <div>
                                      <p className="text-xs font-black text-foreground uppercase tracking-tight">{d.customerName}</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <MapPin className="w-3 h-3 text-muted-foreground" />
                                        <p className="text-[10px] font-bold text-muted-foreground truncate max-w-[150px]">{d.deliveryAddress}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xl font-black text-primary tracking-tighter">₹{d.amount}</p>
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Est. Payout</p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5">
                                      <Navigation className="w-3.5 h-3.5 text-blue-500" />
                                      <span className="text-[10px] font-black uppercase tracking-widest">4.2 KM</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                                      <span className="text-[10px] font-black uppercase tracking-widest">12 MIN</span>
                                    </div>
                                  </div>
                                  <Button 
                                    onClick={() => handleAcceptDelivery(d.id)}
                                    disabled={!isOnline}
                                    className="h-10 px-6 rounded-xl gradient-primary text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95"
                                  >
                                    Accept Mission
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Performance Matrix */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-12 text-white relative overflow-hidden group">
                          <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6 border border-primary/30">
                              <ShieldCheck className="w-3.5 h-3.5" /> Optimal Sync Status
                            </div>
                            <h3 className="text-3xl font-black uppercase tracking-tighter leading-tight mb-4">Tactical Growth<br/>Metrics</h3>
                            <div className="grid grid-cols-2 gap-8 mt-12">
                              <div>
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">Weekly Goal</p>
                                <p className="text-4xl font-black tracking-tighter">75%</p>
                                <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                                  <div className="w-[75%] h-full bg-primary" />
                                </div>
                              </div>
                              <div>
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">Peak Period</p>
                                <p className="text-4xl font-black tracking-tighter text-emerald-400">18:00</p>
                                <p className="text-[9px] text-white/30 uppercase mt-1">Prime Sourcing window</p>
                              </div>
                            </div>
                            <div className="mt-12 pt-12 border-t border-white/5">
                              <Button onClick={() => setActiveTab("earnings")} className="rounded-2xl px-8 h-14 bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all shadow-2xl">Financial Analysis</Button>
                            </div>
                          </div>
                          <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-1000">
                            <TrendingUp className="w-64 h-64 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ROUTE PLANNER TAB */}
                  {activeTab === "route" && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-rose-500" />
                        </div>
                        <div>
                          <h2 className="text-lg font-black text-foreground uppercase tracking-tight">Route Planner</h2>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Select your delivery zone · Like Rapido</p>
                        </div>
                      </div>
                      <RiderRouteSelector isOnline={isOnline} />
                    </div>
                  )}

                  {/* TASKS TAB */}
                  {activeTab === "tasks" && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[700px]">
                        <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar-sleek">
                          <div className="flex items-center justify-between mb-4">
                             <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Mission Log</h3>
                             <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/20">
                                {deliveries.length} Active Nodes
                             </span>
                          </div>
                          {deliveries.map((d) => (
                            <motion.div 
                              layout
                              key={d.id} 
                              className={`p-6 rounded-[2rem] border transition-all cursor-pointer group relative overflow-hidden ${
                                d.status === 'picked_up' ? 'bg-primary/5 border-primary/30 ring-2 ring-primary/20' : 'bg-white dark:bg-card border-border hover:border-primary/30'
                              }`}
                            >
                              <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📍</div>
                                <div>
                                  <p className="text-sm font-black text-foreground uppercase tracking-tight line-clamp-1">{d.customerName}</p>
                                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest opacity-60">ID: {d.orderId}</p>
                                </div>
                              </div>
                              <div className="space-y-3 mb-6">
                                <div className="flex items-start gap-3">
                                  <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  </div>
                                  <p className="text-[11px] font-bold text-muted-foreground truncate">{d.pickupAddress}</p>
                                </div>
                                <div className="flex items-start gap-3">
                                  <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                  </div>
                                  <p className="text-[11px] font-bold text-muted-foreground truncate">{d.deliveryAddress}</p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                <div className="flex flex-col gap-2">
                                  <p className="text-xl font-black text-foreground tracking-tighter">₹{d.amount}</p>
                                  {(d.status === 'arrived_pickup' || d.status === 'arrived_drop') && d.waitingCharges ? (
                                    <p className="text-[9px] font-black text-rose-500 uppercase flex items-center gap-1 animate-pulse">
                                      <Zap className="w-3 h-3" /> Waiting: +₹{d.waitingCharges}
                                    </p>
                                  ) : null}
                                </div>
                                <div className="flex gap-2">
                                  {(d.status === 'accepted' || d.status === 'picked_up' || d.status === 'arrived_pickup' || d.status === 'arrived_drop') && (
                                    <button 
                                      onClick={() => handleSimulateCall(d.id, d.customerName)}
                                      className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all"
                                    >
                                      <Phone className="w-4 h-4" />
                                    </button>
                                  )}
                                  {d.status === 'pending' && (
                                    <Button onClick={() => handleAcceptDelivery(d.id)} className="h-10 px-6 rounded-xl gradient-primary text-white font-black text-[9px] uppercase tracking-widest shadow-lg">Accept</Button>
                                  )}
                                  {d.status === 'accepted' && (
                                    <Button onClick={() => handleArrive(d.id, 'pickup')} className="h-10 px-6 rounded-xl bg-emerald-500 text-white font-black text-[9px] uppercase tracking-widest shadow-lg">Arrived</Button>
                                  )}
                                  {d.status === 'arrived_pickup' && (
                                    <Button onClick={() => setOtpModal({ isOpen: true, deliveryId: d.id, type: 'pickup' })} className="h-10 px-6 rounded-xl bg-amber-500 text-white font-black text-[9px] uppercase tracking-widest shadow-lg">Verify OTP</Button>
                                  )}
                                  {d.status === 'picked_up' && (
                                    <Button onClick={() => handleArrive(d.id, 'drop')} className="h-10 px-6 rounded-xl bg-primary text-white font-black text-[9px] uppercase tracking-widest shadow-lg">Arrived Drop</Button>
                                  )}
                                  {d.status === 'arrived_drop' && (
                                    <Button onClick={() => setOtpModal({ isOpen: true, deliveryId: d.id, type: 'drop' })} className="h-10 px-6 rounded-xl bg-emerald-500 text-white font-black text-[9px] uppercase tracking-widest shadow-lg">Complete OTP</Button>
                                  )}
                                  {d.status === 'completed' && (
                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">Delivered</span>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                          {deliveries.length === 0 && (
                            <div className="py-20 text-center bg-muted/20 rounded-[2rem] border-2 border-dashed border-border">
                               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">No Missions Detected</p>
                            </div>
                          )}
                        </div>

                        <div className="lg:col-span-2">
                           <TacticalMap 
                              pickup={deliveries.find(d => d.status === 'picked_up')?.pickupAddress}
                              drop={deliveries.find(d => d.status === 'picked_up')?.deliveryAddress}
                           />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* HISTORY TAB */}
                  {activeTab === "history" && (
                    <div className="bg-white dark:bg-card border border-border rounded-[2.5rem] p-10 shadow-sm">
                      <h3 className="text-lg font-black text-foreground uppercase tracking-tight mb-10">Mission Logistics History</h3>
                      <div className="space-y-4">
                        {deliveries.map((d, i) => (
                          <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-muted/20 border border-transparent hover:border-border transition-all">
                            <div className="flex items-center gap-6">
                              <div className="w-12 h-12 rounded-xl bg-white border border-border flex items-center justify-center font-black text-muted-foreground text-xs">#{d.orderId.slice(-4)}</div>
                              <div>
                                <p className="text-xs font-black text-foreground uppercase tracking-tight">{d.customerName}</p>
                                <p className="text-[10px] text-muted-foreground mt-1">Completed on 24 April, 2026</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-10">
                              <div className="hidden sm:block text-right">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Duration</p>
                                <p className="text-xs font-bold text-foreground">32 Minutes</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-black text-foreground">₹{d.amount}</p>
                                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">Secured</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* EARNINGS TAB */}
                  {activeTab === "earnings" && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 bg-white dark:bg-card border border-border rounded-[2.5rem] p-10 shadow-sm">
                          <h3 className="text-lg font-black text-foreground uppercase tracking-tight mb-10">Revenue Matrix Analysis</h3>
                          <div className="h-64 flex items-end justify-between gap-4 px-4">
                            {[45, 65, 40, 85, 55, 75, 90].map((h, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                <motion.div 
                                  initial={{ height: 0 }}
                                  animate={{ height: `${h}%` }}
                                  className="w-full max-w-[40px] gradient-primary rounded-t-xl relative group-hover:brightness-110 transition-all shadow-lg shadow-primary/10"
                                >
                                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹{h * 20}</div>
                                </motion.div>
                                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Day {i + 1}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col justify-between">
                          <div>
                            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-8">Payout Strategy</h3>
                            <div className="space-y-6">
                              <div>
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Current Balance</p>
                                <p className="text-4xl font-black tracking-tighter text-white">₹4,240</p>
                              </div>
                              <div>
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Next Auto-Transfer</p>
                                <p className="text-xl font-bold text-emerald-400">28 April, 2026</p>
                              </div>
                            </div>
                          </div>
                          <Button className="w-full h-14 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-primary hover:text-white transition-all">Request Instant Payout</Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SETTINGS TAB */}
                  {activeTab === "settings" && (
                    <div className="max-w-2xl bg-white dark:bg-card border border-border rounded-[2.5rem] p-10 shadow-sm">
                      <h3 className="text-lg font-black text-foreground uppercase tracking-tight mb-10">System Node Configuration</h3>
                      <div className="space-y-8">
                        <div className="flex items-center justify-between p-6 rounded-3xl bg-muted/20 border border-transparent">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-border"><Smartphone className="w-5 h-5 text-muted-foreground" /></div>
                            <div>
                              <p className="text-sm font-black text-foreground uppercase tracking-tight">Push Notifications</p>
                              <p className="text-[10px] text-muted-foreground font-medium">Alerts for high-payout missions</p>
                            </div>
                          </div>
                          <div className="w-12 h-6 bg-primary rounded-full relative p-1 cursor-pointer">
                            <div className="w-4 h-4 bg-white rounded-full absolute right-1" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-6 rounded-3xl bg-muted/20 border border-transparent">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-border"><ShieldCheck className="w-5 h-5 text-muted-foreground" /></div>
                            <div>
                              <p className="text-sm font-black text-foreground uppercase tracking-tight">Node Privacy</p>
                              <p className="text-[10px] text-muted-foreground font-medium">Stealth mode when offline</p>
                            </div>
                          </div>
                          <div className="w-12 h-6 bg-muted rounded-full relative p-1 cursor-pointer">
                            <div className="w-4 h-4 bg-white rounded-full absolute left-1" />
                          </div>
                        </div>
                        <Button variant="outline" className="w-full h-14 rounded-2xl border-2 border-border font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all">Deactivate Logistics Node</Button>
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>

      {/* TACTICAL OTP MODAL */}
      <AnimatePresence>
        {otpModal.isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOtpModal({ ...otpModal, isOpen: false })}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#111116] w-full max-w-md rounded-[3rem] border border-white/10 shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-10 text-center">
                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 ${otpModal.type === 'pickup' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  <Lock className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">
                  {otpModal.type === 'pickup' ? 'Pickup Authentication' : 'Drop-off Verification'}
                </h3>
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-10">
                  Enter the 4-digit token provided by the {otpModal.type === 'pickup' ? 'Sender' : 'Receiver'}
                </p>

                <div className="flex justify-center gap-4 mb-10">
                  {otpValue.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpInput(i, e.target.value)}
                      className="w-16 h-20 rounded-2xl bg-muted/30 border-2 border-border text-center text-3xl font-black focus:border-primary focus:bg-primary/5 outline-none transition-all"
                    />
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={() => setOtpModal({ ...otpModal, isOpen: false })}
                    variant="outline" 
                    className="flex-1 h-16 rounded-2xl border-2 border-border font-black text-[11px] uppercase tracking-widest"
                  >
                    Abort
                  </Button>
                  <Button 
                    onClick={handleVerifyOTP}
                    className={`flex-1 h-16 rounded-2xl font-black text-[11px] uppercase tracking-widest text-white shadow-xl ${
                      otpModal.type === 'pickup' ? 'bg-amber-500 shadow-amber-500/20' : 'bg-emerald-500 shadow-emerald-500/20'
                    }`}
                  >
                    Authenticate
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* CALL MODAL */}
      <AnimatePresence>
        {activeCall && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
             <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/95 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white/5 border border-white/10 w-full max-w-sm rounded-[3rem] p-12 text-center relative z-10"
            >
               <div className="relative mb-12">
                  <div className="w-32 h-32 rounded-full gradient-primary mx-auto flex items-center justify-center text-4xl font-black text-white shadow-2xl relative z-10">
                    {activeCall.target.charAt(0)}
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping scale-150 opacity-20" />
                  <div className="absolute inset-0 rounded-full border-4 border-primary/10 animate-ping scale-[2] opacity-10" />
               </div>
               <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">{activeCall.target}</h3>
               <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-12 flex items-center justify-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                 Secure Call Recording Active
               </p>

               <div className="flex flex-col gap-4">
                  <div className="h-16 px-8 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-4 text-white/40 text-[10px] font-black uppercase tracking-widest">
                     <Activity className="w-4 h-4 text-emerald-500" /> 
                     Encryption Level: Military Grade
                  </div>
                  <Button 
                    onClick={handleEndCall}
                    className="h-20 rounded-[2.5rem] bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center gap-4 shadow-2xl shadow-rose-500/20 active:scale-95 transition-all"
                  >
                    <Phone className="w-6 h-6 rotate-[135deg]" />
                    <span className="font-black text-sm uppercase tracking-widest">Terminate Link</span>
                  </Button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
