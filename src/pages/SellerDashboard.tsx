import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Package, MessageSquare, TrendingUp, Target, CreditCard, Shield, Clock, ShieldCheck, Plus, X, Edit2, Trash2, Zap, ArrowRight, Eye, CheckCircle2,
  Navigation, Mail, MapPin, Target as Crosshair, Map, Activity, Briefcase, Lock, Database, ArrowUpRight, Copy, Share2, Target as TargetIcon, UserX, Menu, Settings, Download, MoreHorizontal, PieChart, Link as LinkIcon, LogOut, Upload, Image as ImageIcon,
  Truck, Smartphone, Search, Phone, Star, BarChart3, Users, LayoutDashboard, Globe, Linkedin, Instagram, Facebook, Youtube, AtSign, ChevronRight
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getProducts, addProduct, updateProduct, deleteProduct,
  getInquiries, updateInquiryStatus, updateUserProfile,
  getAds, addAd, deleteAd, getDeliveries, addDelivery,
  saveDeliveries,
  isLogisticsLocked,
  isSubscriptionActive,
  getAllProductsRaw,
  getOrCreateChatRoom,
  getChatRooms,
  getChatMessages,
  type Product, type Ad
} from "@/lib/storage";
import TacticalMap from "@/components/delivery/TacticalMap";
import { toast } from "sonner";
import ChatCore from "@/components/chat/ChatCore";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import InteractiveEarth from "../components/dashboard/InteractiveEarth";
import { PaymentModal, type PaymentPlan } from "@/components/payment/PaymentModal";

interface CityData {
  name: string;
  count: string;
}

interface StateData {
  name: string;
  val: string;
  count: string;
  color: string;
  cities?: CityData[];
}

interface CountryData {
  name: string;
  flag: string;
  stat: string;
  states: StateData[];
}

const navItems = [
  { id: "overview", label: "Supplier Hub", icon: LayoutDashboard, color: "text-primary" },
  { id: "leads", label: "Lead Pipeline", icon: MessageSquare, color: "text-blue-500" },
  { id: "products", label: "Inventory Matrix", icon: Package, color: "text-emerald-500" },
  { id: "logistics", label: "Logistics Hub", icon: Navigation, color: "text-blue-600" },
  { id: "chats", label: "Live Comms", icon: MessageSquare, color: "text-indigo-500" },
  { id: "ads", label: "Ad Command", icon: Target, color: "text-rose-500" },
  { id: "analytics", label: "Intelligence", icon: BarChart3, color: "text-amber-500" },
  { id: "verification", label: "Verification", icon: ShieldCheck, color: "text-indigo-500" },
  { id: "profile", label: "Command Settings", icon: Settings, color: "text-slate-500" },
];

const statusColor: Record<string, string> = {
  new: "bg-amber-100 text-amber-700 border-amber-200",
  contacted: "bg-blue-100 text-blue-700 border-blue-200",
  closed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  draft: "bg-slate-100 text-slate-700 border-slate-200",
};

const categoryOptions = ["Industrial & Machinery", "Electrical & Electronics", "Computers & IT Products", "Gaming & Accessories", "Sports & Fitness", "Consumer Electronics", "Clothing & Fashion", "Home, Kitchen & Furniture", "Stationery & Office Supplies", "Office & Commercial Equipment", "Automobile & Parts", "Chemicals & Raw Materials", "Agriculture & Farming", "Construction & Building Materials", "Beauty & Personal Care", "Pets & Animal Supplies", "Packaging & Logistics", "Toys, Gifts & Baby Products", "Safety & Security", "Textile & Fabric Industry"];
const categoryIconMap: Record<string, string> = {
  "Industrial & Machinery": "🏭",
  "Electrical & Electronics": "🔌",
  "Computers & IT Products": "💻",
  "Gaming & Accessories": "🎮",
  "Sports & Fitness": "🏋️",
  "Consumer Electronics": "📺",
  "Clothing & Fashion": "👕",
  "Home, Kitchen & Furniture": "🏠",
  "Stationery & Office Supplies": "📝",
  "Office & Commercial Equipment": "🏢",
  "Automobile & Parts": "🚗",
  "Chemicals & Raw Materials": "🧪",
  "Agriculture & Farming": "🌿",
  "Construction & Building Materials": "🏗️",
  "Beauty & Personal Care": "🧴",
  "Pets & Animal Supplies": "🐾",
  "Packaging & Logistics": "📦",
  "Toys, Gifts & Baby Products": "🧸",
  "Safety & Security": "🛡️",
  "Textile & Fabric Industry": "🧵",
};

export default function SellerDashboard() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  if (!user || user.role !== "seller") return <Navigate to="/login" replace />;

  const isExpired = !isSubscriptionActive(user);
  const daysRemaining = user.subscription ? Math.ceil((new Date(user.subscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const showExpiryAlert = user.subscription && daysRemaining <= 5 && daysRemaining > 0;
  const isFullyExpired = user.subscription ? daysRemaining <= 0 : false; // No subscription = free tier, not expired

  const [activeTab, setActiveTab] = useState("overview");
  const [targetRoomId, setTargetRoomId] = useState<string | null>(null);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);

  useEffect(() => {
    if (!user) return;
    const loadUnread = () => {
        const allRooms = getChatRooms().filter(r => r.participantIds.includes(user.id));
        const roomIds = allRooms.map(r => r.id);
        const msgs = getChatMessages().filter(m => roomIds.includes(m.roomId) && m.senderId !== user.id && !m.isRead);
        setUnreadChatCount(msgs.length);
    };
    loadUnread();
    const interval = setInterval(loadUnread, 3000);
    return () => clearInterval(interval);
  }, [user]);
  const [myProducts, setMyProducts] = useState(() => getAllProductsRaw().filter(p => p.sellerId === user.id));
  const [inquiries, setInquiries] = useState(() => getInquiries().filter(i => i.sellerId === user.id));
  const [myAds, setMyAds] = useState(() => getAds().filter(a => a.sellerId === user.id));

  const handleOpenChat = (inq: any) => {
    const room = getOrCreateChatRoom(user.id, inq.buyerId, { 
      type: "product", 
      id: inq.productId, 
      title: `INQ: ${inq.productName}` 
    });
    setTargetRoomId(room.id);
    setActiveTab("chats");
  };
  const [logisticsConfig, setLogisticsConfig] = useState(user.deliveryPricing || {
    basePrice: 40,
    pricePerKm: 12,
    waitChargePerMin: 5,
    bikeWeightLimit: 20
  });
  
  // Product Form State
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [pName, setPName] = useState("");
  const [pCategory, setPCategory] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pMoq, setPMoq] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pImage, setPImage] = useState("📦");
  const [pImages, setPImages] = useState<string[]>([]);
  const [pOffers, setPOffers] = useState<string[]>([""]);
  const [pHighlights, setPHighlights] = useState<string[]>([""]);
  const [pShipping, setPShipping] = useState("Fast Global Deployment");
  const [pWarranty, setPWarranty] = useState("12 Month Coverage");
  const [pSecurity, setPSecurity] = useState("Trade-Escrow Protection");

  // Profile Edit State
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || "");
  const [location, setLocation] = useState(user.location || "");
  const [website, setWebsite] = useState(user.website || "");
  const [linkedin, setLinkedin] = useState(user.socialLinks?.linkedin || "");
  const [instagram, setInstagram] = useState(user.socialLinks?.instagram || "");
  const [facebook, setFacebook] = useState(user.socialLinks?.facebook || "");
  const [showSocials, setShowSocials] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [gstDocument, setGstDocument] = useState<{name: string, url: string, file?: File} | null>(user.documents?.gst || null);
  const [panDocument, setPanDocument] = useState<{name: string, url: string, file?: File} | null>(user.documents?.pan || null);

  // Ads Form State
  const [showAdForm, setShowAdForm] = useState(false);
  const [adType, setAdType] = useState<"daily" | "package">("daily");
  const [adProductId, setAdProductId] = useState("");
  const [dailyBudget, setDailyBudget] = useState("200");
  const [adDuration, setAdDuration] = useState("7");
  const [adHeadline, setAdHeadline] = useState("");
  const [adMessage, setAdMessage] = useState("");
  const [adVideoFile, setAdVideoFile] = useState<File | null>(null);
  const [isLaunchingAd, setIsLaunchingAd] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [myBookings, setMyBookings] = useState(() => getDeliveries().filter(d => d.sellerId === user.id));

  // Logistics Booking State
  const [logisticsLocked] = useState(isLogisticsLocked());
  const [dropLoc, setDropLoc] = useState("");
  const [pickupLoc, setPickupLoc] = useState(user.location || "Sector 4 Industrial Hub");
  const [recName, setRecName] = useState("");
  const [recPhone, setRecPhone] = useState("");
  const [shipTime, setShipTime] = useState("");
  const [distanceMode, setDistanceMode] = useState<"auto" | "custom">("auto");
  const [shipWeight, setShipWeight] = useState("1");
  const [shipDistance, setShipDistance] = useState("5.0");
  const [isCalculating, setIsCalculating] = useState(false);
  const [selVehicle, setSelVehicle] = useState<"bike" | "car" | "van" | "truck">("bike");
  const [isBooking, setIsBooking] = useState(false);
  const [rateModal, setRateModal] = useState<{ isOpen: boolean; deliveryId: string; driverId: string } | null>(null);
  const [ratingValue, setRatingValue] = useState(5);

  const handleSaveLogistics = () => {
    const updatedUser = { ...user, deliveryPricing: logisticsConfig };
    const result = updateUserProfile(updatedUser);
    if (result.success) {
      toast.success("Logistics Matrix Reconfigured");
    }
  };

  const vehicleConfigs = useMemo(() => ({
    bike: { label: "2-Wheeler", baseFare: logisticsConfig.basePrice, perKm: logisticsConfig.pricePerKm, maxWeight: logisticsConfig.bikeWeightLimit, icon: Truck },
    car: { label: "4-Wheeler", baseFare: 80, perKm: 25, maxWeight: 200, icon: Navigation },
    van: { label: "Commercial", baseFare: 150, perKm: 45, maxWeight: 1000, icon: Package },
    truck: { label: "Heavy Duty", baseFare: 300, perKm: 90, maxWeight: 5000, icon: Truck },
  }), [logisticsConfig]);

  const demandFactor = 1.2; // Peak hour surcharge simulation

  const estimatedPrice = useMemo(() => {
    const dist = parseFloat(shipDistance) || 5;
    const cfg = vehicleConfigs[selVehicle];
    const subtotal = cfg.baseFare + (dist * cfg.perKm);
    return Math.round(subtotal * demandFactor);
  }, [shipDistance, selVehicle, vehicleConfigs]);

  // Smart GIS Auto Distance Calculation
  useEffect(() => {
    if (distanceMode === "auto") {
      setIsCalculating(true);
      const timer = setTimeout(() => {
        const p = pickupLoc.trim();
        const d = dropLoc.trim();
        if (!p && !d) {
          setShipDistance("5.0");
        } else {
          const combined = (p + d).toLowerCase().replace(/[^a-z0-9]/g, "");
          let hash = 0;
          for (let i = 0; i < combined.length; i++) {
            hash = ((hash << 5) - hash) + combined.charCodeAt(i);
            hash |= 0;
          }
          const calculatedKM = ((Math.abs(hash) % 350 + 40) / 10).toFixed(1);
          setShipDistance(calculatedKM);
        }
        setIsCalculating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pickupLoc, dropLoc, distanceMode]);

  useEffect(() => {
    const weight = parseFloat(shipWeight) || 0;
    if (weight > 1000) setSelVehicle("truck");
    else if (weight > 200) setSelVehicle("van");
    else if (weight > logisticsConfig.bikeWeightLimit) setSelVehicle("car");
    else setSelVehicle("bike");
  }, [shipWeight, logisticsConfig.bikeWeightLimit]);

  // Intelligence Global Matrix State
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [expandedState, setExpandedState] = useState<string | null>(null);

  // Reset expanded state when switching countries
  useEffect(() => {
    setExpandedState(null);
  }, [selectedCountry]);

  // Real-time Delivery Synchronizer for Seller Logistics Hub
  useEffect(() => {
    const syncSellerBookings = () => {
      if (user?.id) {
        setMyBookings(getDeliveries().filter(d => d.sellerId === user.id));
      }
    };

    syncSellerBookings();
    window.addEventListener("deliveries_updated", syncSellerBookings);
    window.addEventListener("storage", syncSellerBookings);
    const poll = setInterval(syncSellerBookings, 3000);

    return () => {
      window.removeEventListener("deliveries_updated", syncSellerBookings);
      window.removeEventListener("storage", syncSellerBookings);
      clearInterval(poll);
    };
  }, [user]);

  const adPackages = [
    { id: "starter", name: "Starter Boost", duration: 7, reach: "500+", price: 999, color: "from-blue-500/20 to-purple-500/20" },
    { id: "growth", name: "Growth Matrix", duration: 30, reach: "2500+", price: 2999, color: "from-purple-500/20 to-rose-500/20" },
    { id: "elite", name: "Elite Dominance", duration: 60, reach: "10,000+", price: 9999, color: "from-amber-500/20 to-orange-500/20" },
  ];

  useEffect(() => {
    if (user?.category && !pCategory) {
      setPCategory(user.category);
      setPImage(categoryIconMap[user.category] || "🏭");
    }
  }, [user, pCategory]);

  useEffect(() => {
    const fetchMyAds = async () => {
      try {
        const res = await fetch("http://localhost/api/get_ads.php");
        if (res.ok) {
          const data = await res.json();
          setMyAds(data.filter((a: any) => a.sellerId === user.id));
        }
      } catch (e) {
        console.error("Failed to fetch ads from API", e);
      }
    };
    fetchMyAds();
  }, [user.id]);

  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate(n => n + 1);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pCategory || !pPrice || !pMoq) return toast.error("All mission critical fields required");

    const data = {
      name: pName,
      category: pCategory,
      price: pPrice,
      priceNum: parseFloat(pPrice.replace(/[^0-9.]/g, "")),
      moq: pMoq,
      description: pDesc,
      image: pImage,
      images: pImages,
      offers: pOffers.filter(o => o.trim()),
      highlights: pHighlights.filter(h => h.trim()),
      shipping: pShipping,
      warranty: pWarranty,
      security: pSecurity,
      sellerId: user.id,
      sellerName: user.name,
      sellerType: user.sellerType || "manufacturer",
      location: user.location || "India",
      verified: user.verified || false,
      status: "active" as const,
    };

    let savedId = editingProduct?.id;

    if (editingProduct) {
      // 1. Update in localStorage
      updateProduct(editingProduct.id, data);
      toast.success("Asset recalibrated successfully");

      // 2. Sync update to MySQL
      try {
        await fetch("http://localhost/api/add_product.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, id: editingProduct.id }),
        });
      } catch {
        console.warn("MySQL product update sync failed.");
      }
    } else {
      // 1. Save to localStorage
      const newProduct = addProduct(data);
      if (!newProduct) return; // Stop if it failed to save (e.g. quota exceeded)
      
      savedId = newProduct.id;
      toast.success("New asset deployed to network");

      // 2. Sync to MySQL database so it appears in phpMyAdmin
      try {
        await fetch("http://localhost/api/add_product.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, id: savedId }),
        });
      } catch {
        console.warn("MySQL product save sync failed.");
      }
    }

    setMyProducts(getAllProductsRaw().filter(p => p.sellerId === user.id));
    setShowProductForm(false);
    setEditingProduct(null);
    setPName("");
    setPDesc("");
    setPImages([]);
    setPOffers([""]);
    setPHighlights([""]);
    setPShipping("Fast Global Deployment");
    setPWarranty("12 Month Coverage");
    setPSecurity("Trade-Escrow Protection");
  };

  const handleEditProduct = (p: Product) => {
    setEditingProduct(p);
    setPName(p.name);
    setPCategory(p.category);
    setPPrice(p.price);
    setPMoq(p.moq);
    setPDesc(p.description);
    setPImage(p.image);
    setPImages(p.images || []);
    setPOffers(p.offers && p.offers.length > 0 ? p.offers : [""]);
    setPHighlights(p.highlights && p.highlights.length > 0 ? p.highlights : [""]);
    setPShipping(p.shipping || "Fast Global Deployment");
    setPWarranty(p.warranty || "12 Month Coverage");
    setPSecurity(p.security || "Trade-Escrow Protection");
    setShowProductForm(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Decommission this asset? This action is irreversible.")) {
      deleteProduct(id);
      setMyProducts(getAllProductsRaw().filter(p => p.sellerId === user.id));
      toast.error("Asset purged from matrix");
    }
  };

  const handleUpdateInquiry = (id: string, status: any) => {
    updateInquiryStatus(id, status);
    setInquiries(getInquiries().filter(i => i.sellerId === user.id));
    toast.info(`Lead status updated to ${status}`);
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    const updated = {
      ...user,
      name,
      phone,
      location,
      website,
      socialLinks: {
        ...user.socialLinks,
        linkedin,
        instagram,
        facebook
      }
    };
    
    const res = updateUserProfile(updated);
    if (res.success) {
      toast.success("Node identity synchronized");
    } else {
      toast.error(res.error || "Sync failed");
    }
    setIsUpdating(false);
  };

  const handleLaunchAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adType === "package" && !selectedPackage) return toast.error("Select an elite tier package");
    if (!adProductId) return toast.error("Select target asset for deployment");

    setIsLaunchingAd(true);

    let uploadedVideoUrl = null;
    if (adVideoFile) {
      const formData = new FormData();
      formData.append("video", adVideoFile);
      try {
        const uploadRes = await fetch("http://localhost/api/upload_video.php", {
          method: "POST",
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          uploadedVideoUrl = uploadData.url;
        } else {
          toast.error("Video upload failed: " + uploadData.message);
          setIsLaunchingAd(false);
          return;
        }
      } catch (err) {
        toast.error("Failed to upload video.");
        setIsLaunchingAd(false);
        return;
      }
    }

    const pkg = adPackages.find(p => p.id === selectedPackage);
    const product = myProducts.find(p => p.id === adProductId);

    const newAd = {
      id: "ad-" + Date.now(),
      sellerId: user.id,
      type: adType,
      productId: adProductId,
      productName: product?.name,
      packageName: adType === "package" ? pkg?.name : "Precision Burn",
      dailyBudget: adType === "daily" ? parseFloat(dailyBudget) : undefined,
      duration: adType === "daily" ? parseInt(adDuration) : (pkg?.duration || 7),
      totalCost: adType === "daily" 
        ? parseFloat(dailyBudget) * parseInt(adDuration) 
        : (pkg?.price || 0),
      status: "scheduled",
      headline: adHeadline || (product?.name ? `${product.name} Promoted` : "Untitled Campaign"),
      message: adMessage || product?.description || "Strategic product promotion",
      videoUrl: uploadedVideoUrl,
      verificationStatus: "pending"
    };

    // Save locally for UI consistency if needed
    addAd(newAd as any);

    // Sync to MySQL
    try {
      const res = await fetch("http://localhost/api/add_ad.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAd),
      });
      if (res.ok) {
        toast.success("Strategic ad force launched & synced to Admin");
        // Refetch from DB to ensure sync
        const fetchRes = await fetch("http://localhost/api/get_ads.php");
        if (fetchRes.ok) {
          const ads = await fetchRes.json();
          setMyAds(ads.filter((a: any) => a.sellerId === user.id));
        } else {
          setMyAds(getAds().filter(a => a.sellerId === user.id));
        }
      } else {
        toast.error("Failed to sync ad to server.");
        setMyAds(getAds().filter(a => a.sellerId === user.id));
      }
    } catch (e) {
      console.warn("MySQL ad save sync failed.", e);
      setMyAds(getAds().filter(a => a.sellerId === user.id));
    }

    setIsLaunchingAd(false);
    setShowAdForm(false);
    setAdVideoFile(null);
  };

  const handleDeleteAd = async (id: string) => {
    if (!confirm("Are you sure you want to terminate this Ad Campaign?")) return;
    
    // Delete locally
    deleteAd(id);
    
    // Delete from MySQL
    try {
      const res = await fetch("http://localhost/api/delete_ad.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        toast.info("Strategic ad force terminated");
        setMyAds(prev => prev.filter(a => a.id !== id));
      } else {
        toast.error("Failed to delete ad from server.");
      }
    } catch (e) {
      console.warn("MySQL ad delete sync failed.", e);
    }
  };

  const handleBookDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dropLoc || !recName || !recPhone) return toast.error("Logistics parameters required");

    const weight = parseFloat(shipWeight);
    if (weight > vehicleConfigs[selVehicle].maxWeight) {
      return toast.error(`Weight exceeds ${vehicleConfigs[selVehicle].label} capacity (${vehicleConfigs[selVehicle].maxWeight}kg)`);
    }

    const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const dropOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const newDelivery = {
      orderId: `SHIP-${Math.floor(Math.random() * 10000)}`,
      partnerId: "",
      customerName: recName,
      deliveryAddress: dropLoc,
      pickupAddress: pickupLoc,
      status: "pending" as const,
      estimatedTime: `${Math.round(parseFloat(shipDistance) * 3 + 10)} min`,
      amount: estimatedPrice,
      pickupOtp,
      dropOtp,
      sellerId: user.id,
      receiverPhone: recPhone,
      scheduledTime: shipTime || "Immediate Extraction",
      weight,
      distance: parseFloat(shipDistance),
      vehicleType: selVehicle,
      waitingCharges: 0,
      waitingTime: 0
    };

    addDelivery(newDelivery);
    setMyBookings(getDeliveries().filter(d => d.sellerId === user.id));
    setIsBooking(false);
    setDropLoc("");
    setRecName("");
    setRecPhone("");
    setShipWeight("1");
    setShipDistance("5");
    
    toast.success("Logistics Mission Logged. Pickup OTP Generated.");
    // Simulate sending OTP to buyer
    console.log(`[SYSTEM] Transmitting Drop OTP ${dropOtp} to ${recPhone}`);
  };

  const handleRateDriver = () => {
    if (!rateModal) return;
    
    const deliveries = getDeliveries();
    const d = deliveries.find(x => x.id === rateModal.deliveryId);
    if (d) {
      d.isRated = true;
      d.rating = ratingValue;
      saveDeliveries(deliveries);
      setMyBookings(deliveries.filter(x => x.sellerId === user.id));
      toast.success("Operational Feedback Logged. Reputation Updated.");
    }
    setRateModal(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-background/95 pb-20">
        <div className="container-wide px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-8 pt-8">
            
            {/* SIDEBAR NAVIGATION - REFINED FOR NO-WRAP RESPONSIVENESS */}
            <aside className="w-full lg:w-[320px] shrink-0">
              <div className="bg-white dark:bg-card border border-border rounded-[2.5rem] p-5 sm:p-6 shadow-sm sticky top-24">
                <div className="flex items-center gap-4 mb-10 px-2">
                  <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-foreground truncate uppercase tracking-tight">{user.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Node ID: #{user.id.slice(0, 8)}</p>
                    </div>
                  </div>
                </div>

                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wide transition-all group whitespace-nowrap ${
                        activeTab === item.id 
                          ? "bg-primary text-white shadow-xl shadow-primary/20" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <item.icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${activeTab === item.id ? "text-white" : item.color}`} />
                      <span className="truncate">{item.label}</span>
                      {item.id === "chats" && unreadChatCount > 0 && (
                        <span className="ml-auto bg-indigo-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black animate-pulse">
                          {unreadChatCount}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>

                <div className="mt-10 pt-10 border-t border-border px-2">
                  <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-2 text-rose-500 hover:text-rose-600 font-bold text-xs uppercase tracking-[0.15em] transition-colors whitespace-nowrap">
                    <LogOut className="w-4.5 h-4.5 shrink-0" /> Disconnect Node
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
                  {/* Subscription Alerts */}
                  {showExpiryAlert && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="mb-8 p-5 bg-amber-500/10 border border-amber-500/20 rounded-[2rem] flex items-center justify-between shadow-xl shadow-amber-500/5 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-4 text-amber-600">
                        <div className="p-3 bg-amber-500/20 rounded-xl">
                          <Clock className="w-6 h-6 animate-pulse" />
                        </div>
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-[0.2em] leading-none mb-1">Strategic Alert: Protocol Ending</p>
                          <p className="text-base font-black tracking-tight uppercase">Plan Expiring in {daysRemaining} Day{daysRemaining > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <Button onClick={() => navigate("/pricing")} className="bg-amber-500 hover:bg-amber-600 text-white font-black text-[10px] uppercase tracking-[0.2em] h-12 rounded-xl px-8 shadow-lg shadow-amber-500/30">
                        Renew Now
                      </Button>
                    </motion.div>
                  )}

                  {isFullyExpired && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-10 p-8 bg-rose-500/10 border-2 border-rose-500/30 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-rose-500/10 backdrop-blur-xl relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none">
                        <Lock className="w-32 h-32 text-rose-500" />
                      </div>
                      <div className="flex items-center gap-6 relative z-10">
                        <div className="w-20 h-20 rounded-3xl bg-rose-500 flex items-center justify-center text-white shadow-xl shadow-rose-500/40">
                          <Shield className="w-10 h-10" />
                        </div>
                        <div>
                          <h4 className="text-2xl font-black uppercase tracking-tighter text-rose-600 leading-none mb-2">Node Access Terminated (Frozen)</h4>
                          <p className="text-[11px] font-bold uppercase tracking-widest text-rose-500/70">Your plan expired on {new Date(user.subscription!.endDate).toLocaleDateString()}. All assets purged from global network visibility.</p>
                        </div>
                      </div>
                      <Button size="lg" onClick={() => navigate("/pricing")} className="w-full md:w-auto h-16 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl px-12 shadow-xl shadow-rose-500/30 active:scale-95 transition-all relative z-10">
                        Restore Access Now
                      </Button>
                    </motion.div>
                  )}
                  
                  {/* OVERVIEW TAB */}
                  {activeTab === "overview" && (
                    <div className="space-y-6 sm:space-y-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <div className="bg-white dark:bg-card border border-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm group hover:border-primary/30 transition-all cursor-default overflow-hidden">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider sm:tracking-[0.3em] mb-3 sm:mb-4 group-hover:text-primary transition-colors truncate">Live Inventory</p>
                          <div className="flex items-end justify-between gap-2">
                            <h3 className="text-3xl sm:text-4xl font-black text-foreground tracking-tighter">{myProducts.length}</h3>
                            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-primary opacity-20 shrink-0" />
                          </div>
                        </div>
                        <div className="bg-white dark:bg-card border border-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm group hover:border-blue-500/30 transition-all cursor-default overflow-hidden">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider sm:tracking-[0.3em] mb-3 sm:mb-4 group-hover:text-blue-500 transition-colors truncate">Lead Pipeline</p>
                          <div className="flex items-end justify-between gap-2">
                            <h3 className="text-3xl sm:text-4xl font-black text-foreground tracking-tighter">{inquiries.length}</h3>
                            <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 opacity-20 shrink-0" />
                          </div>
                        </div>
                        <div className="bg-white dark:bg-card border border-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm group hover:border-amber-500/30 transition-all cursor-default overflow-hidden">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider sm:tracking-[0.3em] mb-3 sm:mb-4 group-hover:text-amber-500 transition-colors truncate">Asset Impressions</p>
                          <div className="flex items-end justify-between gap-2">
                            <h3 className="text-3xl sm:text-4xl font-black text-foreground tracking-tighter">{myProducts.reduce((sum, p) => sum + (p.views || 0), 0)}</h3>
                            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 opacity-20 shrink-0" />
                          </div>
                        </div>
                        <div className="bg-white dark:bg-card border border-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm group hover:border-rose-500/30 transition-all cursor-default overflow-hidden">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider sm:tracking-[0.3em] mb-3 sm:mb-4 group-hover:text-rose-500 transition-colors truncate">Ad Strength</p>
                          <div className="flex items-end justify-between gap-2">
                            <h3 className="text-3xl sm:text-4xl font-black text-foreground tracking-tighter">{myAds.length}</h3>
                            <Target className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500 opacity-20 shrink-0" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
                        <div className="bg-white dark:bg-card border border-border rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-10 shadow-sm">
                          <div className="flex items-center justify-between mb-6 sm:mb-10">
                            <h3 className="text-base sm:text-lg font-black text-foreground uppercase tracking-tight">Recent Intelligence</h3>
                            <button onClick={() => setActiveTab("leads")} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Full Feed</button>
                          </div>
                          <div className="space-y-3 sm:space-y-4">
                            {inquiries.slice(0, 5).map((inq) => (
                              <div key={inq.id} className="flex items-center justify-between p-3.5 sm:p-5 bg-muted/20 rounded-xl sm:rounded-2xl border border-transparent hover:border-border transition-all">
                                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center text-xs sm:text-sm shadow-sm shrink-0">👤</div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-black text-foreground uppercase tracking-tight truncate">{inq.buyerName}</p>
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest truncate">{inq.productName}</p>
                                  </div>
                                </div>
                                <span className={`px-2 sm:px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border shrink-0 ${statusColor[inq.status]}`}>{inq.status}</span>
                              </div>
                            ))}
                            {inquiries.length === 0 && (
                              <div className="py-8 sm:py-12 text-center text-muted-foreground italic text-xs sm:text-sm">No incoming data signals detected.</div>
                            )}
                          </div>
                        </div>

                        {/* Subscription & Gateway Command Center Card */}
                        <div className="bg-slate-900 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 md:p-10 text-white relative overflow-hidden group flex flex-col justify-between">
                          <div className="relative z-10 space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/30">
                                <ShieldCheck className="w-3.5 h-3.5" /> {user.subscription?.planName ? `${user.subscription.planName} Plan` : "Starter Network"}
                              </div>
                              <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${isExpired ? "bg-rose-500/20 text-rose-300 border-rose-500/30" : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"}`}>
                                {isExpired ? "Protocol Expired" : "Active & Verified"}
                              </span>
                            </div>

                            <div>
                              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-tight mb-2">
                                Razorpay Direct<br />Settlement Node
                              </h3>
                              <p className="text-white/60 text-xs font-medium leading-relaxed">
                                {user.subscription ? (
                                  <>Active through <span className="text-white font-bold">{new Date(user.subscription.endDate).toLocaleDateString()}</span> ({daysRemaining} days remaining). Supports UPI, Cards & Netbanking.</>
                                ) : (
                                  <>Upgrade to unlock priority visibility, verified business badge, and 100+ product catalog expansion.</>
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="relative z-10 pt-6 flex flex-wrap items-center gap-3">
                            <Button
                              onClick={() => {
                                setSelectedPlan({
                                  id: "advanced",
                                  name: "Advanced",
                                  price: 499,
                                  billingCycle: "yearly",
                                  desc: "Top tier positioning & verified badge"
                                });
                                setPaymentModalOpen(true);
                              }}
                              className="rounded-xl px-6 h-12 bg-gradient-to-r from-primary to-purple-600 text-white font-black uppercase tracking-widest text-xs hover:opacity-90 shadow-xl"
                            >
                              <Zap className="w-3.5 h-3.5 mr-1.5" /> Upgrade Plan
                            </Button>
                            <Button
                              onClick={() => navigate("/pricing")}
                              variant="outline"
                              className="rounded-xl px-5 h-12 border-white/20 text-white hover:bg-white/10 font-bold uppercase tracking-wider text-xs"
                            >
                              Compare Plans <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                          </div>

                          <div className="absolute top-0 right-0 p-8 sm:p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-1000">
                            <CreditCard className="w-32 h-32 sm:w-48 sm:h-48 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* LEADS TAB */}
                  {activeTab === "leads" && (
                    <div className="bg-white dark:bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
                      <div className="px-10 py-8 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-6">
                        <h3 className="text-xl font-black text-foreground uppercase tracking-tight flex items-center gap-3">
                          <MessageSquare className="w-6 h-6 text-blue-500" /> Lead Pipeline Hub
                        </h3>
                        <div className="flex items-center gap-3 bg-muted/50 p-1.5 rounded-2xl border border-border shadow-inner">
                          {["all", "new", "contacted"].map(f => (
                            <button key={f} className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white hover:shadow-sm">
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-muted/30 border-b border-border">
                              <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Principal Node</th>
                              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Asset Target</th>
                              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Quantum</th>
                              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sync Date</th>
                              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                              <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Command</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/50">
                            {inquiries.map((inq) => (
                              <tr key={inq.id} className="hover:bg-muted/10 transition-colors group">
                                <td className="px-10 py-6">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold shadow-sm">{inq.buyerName.charAt(0)}</div>
                                    <div>
                                      <p className="text-xs font-black text-foreground uppercase tracking-tight">{inq.buyerName}</p>
                                      <p className="text-[10px] font-medium text-muted-foreground">{inq.buyerEmail}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-6 font-bold text-xs text-foreground uppercase tracking-tight">{inq.productName}</td>
                                <td className="px-6 py-6 font-bold text-xs text-foreground">{inq.quantity}</td>
                                <td className="px-6 py-6 text-xs text-muted-foreground font-medium">{new Date(inq.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-6">
                                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border inline-block ${statusColor[inq.status]}`}>
                                    {inq.status}
                                  </span>
                                </td>
                                <td className="px-10 py-6 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <select 
                                      value={inq.status} 
                                      onChange={(e) => handleUpdateInquiry(inq.id, e.target.value as any)}
                                      className="bg-muted text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl outline-none focus:ring-2 ring-primary/20 transition-all border border-transparent"
                                    >
                                      <option value="new">Mark New</option>
                                      <option value="contacted">Mark Contacted</option>
                                      <option value="closed">Mark Closed</option>
                                    </select>
                                    <button onClick={() => handleOpenChat(inq)} className="w-10 h-10 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center active:scale-90 shadow-sm"><Mail className="w-4 h-4" /></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {inquiries.length === 0 && (
                              <tr>
                                <td colSpan={6} className="px-10 py-20 text-center text-muted-foreground italic">No incoming inquiry signals detected in the current sector.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* PRODUCTS TAB */}
                  {activeTab === "products" && (
                    <div className="space-y-8">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white dark:bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
                        <div>
                          <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Inventory Matrix</h3>
                          <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-widest opacity-60">Manage your deployed network assets</p>
                        </div>
                        <Button 
                          disabled={isFullyExpired}
                          onClick={() => { setEditingProduct(null); setShowProductForm(true); }} 
                          className="rounded-2xl px-8 h-14 gradient-primary border-none font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 text-white disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                        >
                          <Plus className="w-5 h-5" /> Deploy New Asset
                        </Button>
                      </div>

                      <AnimatePresence>
                        {showProductForm && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-white dark:bg-card border border-border rounded-[2.5rem] p-10 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between mb-10">
                              <h3 className="text-lg font-black text-foreground uppercase tracking-tight">{editingProduct ? 'Recalibrate Asset' : 'New Asset Protocol'}</h3>
                              <button onClick={() => { setShowProductForm(false); setEditingProduct(null); }} className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-colors"><X className="w-5 h-5" /></button>
                            </div>
                            <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-3">
                                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2">Asset Identifier <span className="text-rose-500">*</span></label>
                                <input type="text" value={pName} required onChange={e => setPName(e.target.value)} placeholder="Enter technical name" className="w-full h-16 px-8 rounded-2xl bg-muted/30 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-sm font-black text-foreground shadow-inner" />
                              </div>
                              <div className="space-y-3">
                                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2">Sector Classification <span className="text-rose-500">*</span></label>
                                <select value={pCategory} required onChange={e => { setPCategory(e.target.value); setPImage(categoryIconMap[e.target.value] || "📦"); }} className="w-full h-16 px-8 rounded-2xl bg-muted/30 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-sm font-black text-foreground shadow-inner">
                                  <option value="" disabled>Select Sector Classification...</option>
                                  {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                              </div>
                              <div className="space-y-3">
                                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2">Resource Valuation <span className="text-rose-500">*</span></label>
                                <input type="text" value={pPrice} required onChange={e => setPPrice(e.target.value)} placeholder="e.g. ₹50,000" className="w-full h-16 px-8 rounded-2xl bg-muted/30 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-sm font-black text-foreground shadow-inner" />
                              </div>
                              <div className="space-y-3">
                                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2">Minimum Operational Quantum (MOQ) <span className="text-rose-500">*</span></label>
                                <input type="text" value={pMoq} required onChange={e => setPMoq(e.target.value)} placeholder="e.g. 10 Units" className="w-full h-16 px-8 rounded-2xl bg-muted/30 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-sm font-black text-foreground shadow-inner" />
                              </div>
                              <div className="md:col-span-2 space-y-3">
                                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2">Technical Specifications</label>
                                <textarea value={pDesc} onChange={e => setPDesc(e.target.value)} placeholder="Detail the technical capabilities of the asset..." className="w-full h-32 px-8 py-6 rounded-2xl bg-muted/30 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-sm font-bold text-foreground resize-none shadow-inner" />
                              </div>

                              {/* Asset Photos */}
                              <div className="md:col-span-2 space-y-3 mt-2">
                                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2">Asset Media (Photos)</label>
                                <div className="p-6 border-2 border-dashed border-border rounded-2xl bg-muted/10 relative group hover:border-primary/50 transition-colors">
                                  <input 
                                    type="file" 
                                    multiple 
                                    accept="image/*"
                                    onChange={(e) => {
                                      const files = Array.from(e.target.files || []);
                                      files.forEach(file => {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          if (typeof reader.result === 'string') {
                                            setPImages(prev => [...prev, reader.result as string]);
                                          }
                                        };
                                        reader.readAsDataURL(file);
                                      });
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                  />
                                  <div className="flex flex-col items-center justify-center text-center space-y-2 pointer-events-none">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                      <ImageIcon className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm font-bold text-foreground">Click or Drag images to upload</p>
                                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Supports multiple high-res photos (Max 5MB total)</p>
                                  </div>
                                </div>
                                {pImages.length > 0 && (
                                  <div className="flex flex-wrap gap-4 mt-4">
                                    {pImages.map((img, idx) => (
                                      <div key={idx} className="relative w-24 h-24 rounded-xl border border-border shadow-sm group">
                                        <img src={img} alt={`Asset ${idx}`} className="w-full h-full object-cover rounded-xl" />
                                        <button 
                                          type="button"
                                          onClick={() => setPImages(pImages.filter((_, i) => i !== idx))}
                                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-20"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Available Offers */}
                              <div className="md:col-span-2 space-y-3 mt-2">
                                <div className="flex items-center justify-between ml-2">
                                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em]">Available Offers</label>
                                  <button 
                                    type="button" 
                                    onClick={() => setPOffers([...pOffers, ""])}
                                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1"
                                  >
                                    <Plus className="w-3 h-3" /> Add Offer
                                  </button>
                                </div>
                                <div className="space-y-3">
                                  {pOffers.map((offer, idx) => (
                                    <div key={idx} className="flex gap-4 items-center">
                                      <input 
                                        type="text" 
                                        value={offer} 
                                        onChange={e => {
                                          const newOffers = [...pOffers];
                                          newOffers[idx] = e.target.value;
                                          setPOffers(newOffers);
                                        }} 
                                        placeholder="e.g. Bank Offer 10% instant discount on Credit Cards..." 
                                        className="flex-1 h-14 px-6 rounded-2xl bg-muted/30 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-sm font-bold text-foreground shadow-inner" 
                                      />
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          if (pOffers.length > 1) {
                                            setPOffers(pOffers.filter((_, i) => i !== idx));
                                          } else {
                                            setPOffers([""]);
                                          }
                                        }}
                                        className="w-12 h-14 flex-shrink-0 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Shipping, Warranty, Security */}
                              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                <div className="space-y-3">
                                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2">Shipping</label>
                                  <input type="text" value={pShipping} onChange={e => setPShipping(e.target.value)} placeholder="e.g. Fast Global Deployment" className="w-full h-14 px-6 rounded-2xl bg-muted/30 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-sm font-bold text-foreground shadow-inner" />
                                </div>
                                <div className="space-y-3">
                                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2">Warranty</label>
                                  <input type="text" value={pWarranty} onChange={e => setPWarranty(e.target.value)} placeholder="e.g. 12 Month Coverage" className="w-full h-14 px-6 rounded-2xl bg-muted/30 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-sm font-bold text-foreground shadow-inner" />
                                </div>
                                <div className="space-y-3">
                                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2">Security</label>
                                  <input type="text" value={pSecurity} onChange={e => setPSecurity(e.target.value)} placeholder="e.g. Trade-Escrow Protection" className="w-full h-14 px-6 rounded-2xl bg-muted/30 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-sm font-bold text-foreground shadow-inner" />
                                </div>
                              </div>

                              {/* Product Highlights */}
                              <div className="md:col-span-2 space-y-3 mt-2">
                                <div className="flex items-center justify-between ml-2">
                                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em]">Product Highlights</label>
                                  <button 
                                    type="button" 
                                    onClick={() => setPHighlights([...pHighlights, ""])}
                                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1"
                                  >
                                    <Plus className="w-3 h-3" /> Add Highlight
                                  </button>
                                </div>
                                <div className="space-y-3">
                                  {pHighlights.map((highlight, idx) => (
                                    <div key={idx} className="flex gap-4 items-center">
                                      <input 
                                        type="text" 
                                        value={highlight} 
                                        onChange={e => {
                                          const newHighlights = [...pHighlights];
                                          newHighlights[idx] = e.target.value;
                                          setPHighlights(newHighlights);
                                        }} 
                                        placeholder="e.g. Industrial-grade durability with 2024 specifications..." 
                                        className="flex-1 h-14 px-6 rounded-2xl bg-muted/30 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-sm font-bold text-foreground shadow-inner" 
                                      />
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          if (pHighlights.length > 1) {
                                            setPHighlights(pHighlights.filter((_, i) => i !== idx));
                                          } else {
                                            setPHighlights([""]);
                                          }
                                        }}
                                        className="w-12 h-14 flex-shrink-0 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="md:col-span-2 flex justify-end pt-6">
                                <Button type="submit" className="h-16 px-12 rounded-2xl font-black text-xs uppercase tracking-[0.2em] gradient-primary shadow-2xl shadow-primary/20 text-white">Execute Protocol</Button>
                              </div>
                            </form>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {myProducts.map((p) => (
                          <motion.div layout key={p.id} className="bg-white dark:bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm group hover:border-primary/40 transition-all duration-500 hover:shadow-2xl">
                            <div className="aspect-video bg-muted relative flex items-center justify-center text-7xl group-hover:scale-105 transition-transform duration-700">
                              {p.image}
                              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEditProduct(p)} className="w-10 h-10 rounded-xl bg-white text-primary flex items-center justify-center shadow-lg hover:bg-primary hover:text-white transition-all"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => handleDeleteProduct(p.id)} className="w-10 h-10 rounded-xl bg-white text-rose-500 flex items-center justify-center shadow-lg hover:bg-rose-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </div>
                            <div className="p-8">
                              <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em] bg-primary/10 px-3 py-1 rounded-lg border border-primary/10">{p.category}</span>
                              <h4 className="text-lg font-black text-foreground mt-4 mb-2 uppercase tracking-tight truncate group-hover:text-primary transition-colors">{p.name}</h4>
                              <p className="text-xs text-muted-foreground font-medium line-clamp-2 mb-6 h-8 opacity-60 italic">{p.description}</p>
                              <div className="flex items-end justify-between pt-6 border-t border-border/50">
                                <div>
                                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-40">Valuation</p>
                                  <p className="text-2xl font-black text-foreground tracking-tighter">{p.price.startsWith("₹") ? p.price : `₹${p.price}`}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-40">Impact</p>
                                  <p className="text-sm font-black text-primary flex items-center gap-1"><Eye className="w-4 h-4" /> {p.views || 0}</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "chats" && (
                    <div className="space-y-4 sm:space-y-8">
                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                         <div>
                           <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">Transmission Hub</h2>
                           <p className="text-[10px] sm:text-[11px] text-muted-foreground uppercase font-black tracking-widest mt-1.5 sm:mt-2 opacity-60">Secure industrial negotiations and trade signal management</p>
                         </div>
                       </div>
                       <ChatCore key={targetRoomId || 'default'} initialRoomId={targetRoomId} />
                    </div>
                  )}

                  {/* ADS TAB */}
                  {activeTab === "ads" && (
                    <div className="space-y-8">
                      <div className="bg-white dark:bg-card border border-border rounded-[2.5rem] p-10 shadow-sm">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                          <div className="flex-1 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest mb-6 border border-rose-500/20">
                              <Target className="w-3.5 h-3.5" /> Sector Visibility Boost
                            </div>
                            <h3 className="text-4xl font-black text-foreground uppercase tracking-tighter leading-tight mb-4">Launch Strategic Ad Campaigns</h3>
                            <p className="text-muted-foreground text-sm font-medium leading-relaxed">Amplify your node's visibility in the global marketplace. Our algorithmic matching prioritizes active ad campaigns for maximum sector-wide impact.</p>
                          </div>
                          {!showAdForm && (
                            <Button 
                              disabled={isFullyExpired}
                              onClick={() => setShowAdForm(true)} 
                              className="rounded-2xl px-12 h-16 bg-rose-500 hover:bg-rose-600 text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-rose-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                            >
                              Initialize Ad Campaign
                            </Button>
                          )}
                        </div>
                      </div>

                      <AnimatePresence>
                        {showAdForm && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-white dark:bg-card border border-border rounded-[2.5rem] shadow-xl overflow-hidden">
                            <div className="p-10">
                              <div className="flex items-center justify-between mb-12">
                                <h3 className="text-xl font-black text-foreground uppercase tracking-tight flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-white"><Plus className="w-5 h-5" /></div>
                                  New Campaign Parameters
                                </h3>
                                <button onClick={() => setShowAdForm(false)} className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all"><X className="w-5 h-5" /></button>
                              </div>

                              <form onSubmit={handleLaunchAd} className="space-y-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                  {/* Target Asset Selection */}
                                  <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Select Target Asset</label>
                                    <div className="grid grid-cols-1 gap-3">
                                      {myProducts.map(p => (
                                        <button
                                          key={p.id}
                                          type="button"
                                          onClick={() => setAdProductId(p.id)}
                                          className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${adProductId === p.id ? "border-primary bg-primary/5 shadow-md" : "border-border hover:bg-muted/50"}`}
                                        >
                                          <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-xl shadow-inner">{p.image}</div>
                                          <div className="min-w-0">
                                            <p className="text-[11px] font-black text-foreground uppercase tracking-tight truncate">{p.name}</p>
                                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{p.category}</p>
                                          </div>
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Strategy Selection */}
                                  <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Operational Strategy</label>
                                    <div className="grid grid-cols-2 gap-4 h-full max-h-[160px]">
                                      <button
                                        type="button"
                                        onClick={() => setAdType("daily")}
                                        className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center gap-3 transition-all ${adType === "daily" ? "border-rose-500 bg-rose-50 shadow-lg" : "border-border hover:bg-muted"}`}
                                      >
                                        <Activity className={`w-8 h-8 ${adType === "daily" ? "text-rose-500" : "text-muted-foreground"}`} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Precision Burn</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setAdType("package")}
                                        className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center gap-3 transition-all ${adType === "package" ? "border-indigo-500 bg-indigo-50 shadow-lg" : "border-border hover:bg-muted"}`}
                                      >
                                        <Shield className={`w-8 h-8 ${adType === "package" ? "text-indigo-500" : "text-muted-foreground"}`} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Elite Tier</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Strategy Configuration UI */}
                                <div className="pt-6 border-t border-border/50">
                                  {adType === "daily" ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                      <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Daily Resource Allocation (₹)</label>
                                        <div className="relative">
                                          <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-500/40" />
                                          <input
                                            type="number"
                                            min="100"
                                            step="50"
                                            value={dailyBudget}
                                            onChange={(e) => setDailyBudget(e.target.value)}
                                            className="w-full h-16 pl-16 pr-6 rounded-2xl bg-muted/20 border border-transparent focus:bg-white focus:border-rose-500/30 outline-none transition-all text-xl font-black tabular-nums shadow-inner"
                                          />
                                        </div>
                                        <p className="text-[10px] text-muted-foreground font-medium pl-1 italic">Min: ₹100/day for efficient algorithmic matching.</p>
                                      </div>
                                      <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Operational Duration (Days)</label>
                                        <div className="flex gap-3">
                                          {["7", "15", "30", "60"].map(d => (
                                            <button
                                              key={d}
                                              type="button"
                                              onClick={() => setAdDuration(d)}
                                              className={`flex-1 h-16 rounded-2xl font-black text-sm uppercase transition-all ${adDuration === d ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                                            >
                                              {d}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-6">
                                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Select Elite Tier Package</label>
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {adPackages.map(pkg => (
                                          <button
                                            key={pkg.id}
                                            type="button"
                                            onClick={() => setSelectedPackage(pkg.id)}
                                            className={`relative group p-8 rounded-3xl border-2 transition-all text-left overflow-hidden ${selectedPackage === pkg.id ? "border-indigo-500 bg-indigo-50 shadow-xl" : "border-border hover:border-indigo-200"}`}
                                          >
                                            <div className="relative z-10">
                                              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2">{pkg.duration} Days Plan</p>
                                              <h4 className="text-xl font-black text-foreground mb-4">{pkg.name}</h4>
                                              <div className="space-y-2 mb-8">
                                                <p className="text-[11px] font-bold text-muted-foreground flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {pkg.reach} Estimated Reach</p>
                                                <p className="text-[11px] font-bold text-muted-foreground flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Sector Wide Broadcast</p>
                                                <p className="text-[11px] font-bold text-muted-foreground flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> HD Product Placement</p>
                                              </div>
                                              <p className="text-2xl font-black tracking-tighter text-indigo-700">₹{pkg.price.toLocaleString("en-IN")}</p>
                                            </div>
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rotate-45 translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Campaign Headline */}
                                <div className="space-y-4 pt-6 border-t border-border/50">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Campaign Headline (Optional)</label>
                                  <input
                                    type="text"
                                    value={adHeadline}
                                    onChange={(e) => setAdHeadline(e.target.value)}
                                    placeholder="Enter a custom headline for your ad... (Leaves blank to auto-fill with asset name)"
                                    className="w-full p-4 rounded-2xl bg-muted/20 border border-transparent focus:bg-white focus:border-rose-500/30 outline-none transition-all text-sm font-medium shadow-inner"
                                  />
                                </div>

                                {/* Campaign Message */}
                                <div className="space-y-4 pt-6 border-t border-border/50">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Campaign Message (Optional)</label>
                                  <textarea
                                    rows={3}
                                    value={adMessage}
                                    onChange={(e) => setAdMessage(e.target.value)}
                                    placeholder="Enter a brief description for your ad campaign... (Leaves blank to auto-fill with asset description)"
                                    className="w-full p-6 rounded-2xl bg-muted/20 border border-transparent focus:bg-white focus:border-rose-500/30 outline-none transition-all text-sm font-medium shadow-inner resize-none"
                                  />
                                </div>

                                {/* Video Upload */}
                                <div className="space-y-4 pt-6 border-t border-border/50">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Campaign Video (Optional)</label>
                                  <div className="flex items-center gap-4">
                                    <input
                                      type="file"
                                      accept="video/mp4,video/webm,video/ogg,video/quicktime"
                                      onChange={(e) => setAdVideoFile(e.target.files ? e.target.files[0] : null)}
                                      className="block w-full text-sm text-slate-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-indigo-50 file:text-indigo-700
                                        hover:file:bg-indigo-100 transition-all cursor-pointer"
                                    />
                                    {adVideoFile && (
                                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                                        {adVideoFile.name}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-border/50">
                                  <div className="text-center md:text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Resource Commitment</p>
                                    <p className="text-4xl font-black tracking-tighter text-foreground">
                                      ₹{adType === "daily"
                                        ? (parseFloat(dailyBudget) * parseInt(adDuration)).toLocaleString("en-IN")
                                        : (adPackages.find(p => p.id === selectedPackage)?.price || 0).toLocaleString("en-IN")
                                      }
                                    </p>
                                  </div>
                                  <div className="flex gap-4 w-full md:w-auto">
                                    <Button type="button" variant="ghost" onClick={() => setShowAdForm(false)} className="flex-1 md:flex-none h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-xs" disabled={isLaunchingAd}>Abort Operation</Button>
                                    <Button type="submit" disabled={isLaunchingAd} className="flex-1 md:flex-none h-16 px-16 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-rose-500/30 active:scale-95 transition-all">
                                      {isLaunchingAd ? "Deploying..." : "Launch Ad Force"}
                                    </Button>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Active Campaigns List */}
                      <div className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Live Deployment Status</h3>

                        {myAds.length === 0 ? (
                          <div className="py-24 text-center bg-white/50 border rounded-[2.5rem] border-dashed border-border shadow-inner">
                            <Target className="w-20 h-20 text-muted-foreground/10 mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-muted-foreground uppercase tracking-tight">No Active Campaigns</h3>
                            <p className="text-sm text-muted-foreground/60 mt-3 max-w-sm mx-auto italic">Strategic advertising is currently offline. Launch campaigns to capture market dominance.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {myAds.map((ad) => (
                              <motion.div variants={itemVariants} key={ad.id} className="bg-white dark:bg-card border border-border rounded-[2rem] p-6 md:p-8 shadow-sm hover:shadow-xl hover:border-rose-500/30 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500 opacity-[0.02] -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-700" />

                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 border-b border-border/50 pb-6 relative z-10">
                                  <div className="flex items-center gap-5">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-rose-500/10 ${ad.type === 'daily' ? 'bg-rose-500' : 'bg-indigo-500'}`}>
                                      {ad.type === 'daily' ? <Activity className="w-7 h-7" /> : <Shield className="w-7 h-7" />}
                                    </div>
                                    <div>
                                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{ad.type === 'daily' ? 'Daily Allocation' : 'Tier Package'}</p>
                                      <h4 className="text-lg font-black text-foreground uppercase tracking-tight leading-tight">{ad.headline || ad.packageName || 'Precision Burn'}</h4>
                                      {ad.message && <p className="text-[10px] text-muted-foreground font-bold line-clamp-1 mt-1">{ad.message}</p>}
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-2">
                                    <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5 border ${
                                      ad.verificationStatus === 'approved' 
                                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                                        : ad.verificationStatus === 'pending'
                                        ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                        : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                                    }`}>
                                      <span className={`w-1.5 h-1.5 rounded-full ${ad.verificationStatus === 'approved' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} /> 
                                      {ad.verificationStatus === 'approved' ? 'Verified & Active' : ad.verificationStatus === 'pending' ? 'Pending Audit' : 'Rejected'}
                                    </span>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Expires in {ad.duration} Days</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 relative z-10">
                                  <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5"><Eye className="w-3 h-3" /> Potential Reach</p>
                                    <p className="text-xl font-black text-foreground tabular-nums tracking-tighter">{ad.reach.toLocaleString()}</p>
                                  </div>
                                  <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5"><ArrowRight className="w-3 h-3" /> Market Clicks</p>
                                    <p className="text-xl font-black text-foreground tabular-nums tracking-tighter">{ad.clicks.toLocaleString()}</p>
                                  </div>
                                  <div className={`p-4 rounded-2xl border ${ad.type === 'daily' ? 'bg-rose-50 border-rose-100' : 'bg-indigo-50 border-indigo-100'}`}>
                                    <p className={`text-[9px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5 ${ad.type === 'daily' ? 'text-rose-500' : 'text-indigo-500'}`}><CreditCard className="w-3 h-3" /> Inv. Value</p>
                                    <p className={`text-xl font-black tabular-nums tracking-tighter ${ad.type === 'daily' ? 'text-rose-700' : 'text-indigo-700'}`}>₹{ad.totalCost.toLocaleString("en-IN")}</p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-border/50 relative z-10">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-xl shadow-inner">{myProducts.find(p => p.id === ad.productId)?.image || "📦"}</div>
                                    <div>
                                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Target Asset</p>
                                      <p className="text-xs font-black text-foreground uppercase tracking-tight truncate max-w-[120px]">{ad.productName}</p>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button onClick={() => handleDeleteAd(ad.id)} className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center active:scale-90"><Trash2 className="w-5 h-5" /></button>
                                    <button onClick={() => setActiveTab("analytics")} className="h-12 px-6 rounded-xl bg-muted text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-foreground hover:text-white transition-all">Detailed Analytics</button>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* LOGISTICS HUB TAB */}
                  {activeTab === "logistics" && (
                    <div className="space-y-6 sm:space-y-8 min-w-0 w-full">
                      {/* Logistics Configuration Section */}
                      <div className="bg-white dark:bg-card border border-border rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-6 md:p-8 shadow-sm overflow-hidden relative min-w-0 w-full">
                         <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none"><Settings className="w-32 h-32 sm:w-40 sm:h-40" /></div>
                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 relative z-10">
                            <div>
                               <h2 className="text-lg sm:text-2xl font-black text-foreground uppercase tracking-tight flex items-center gap-2.5 sm:gap-3">
                                  <Truck className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 shrink-0" /> Logistics Command Config
                               </h2>
                               <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1 italic tracking-normal sm:tracking-wide">Set your per-km pricing, weight limits and waiting charge protocols.</p>
                            </div>
                            <Button onClick={handleSaveLogistics} className="w-full md:w-auto rounded-xl px-6 sm:px-10 h-12 sm:h-14 gradient-primary text-white font-black text-xs uppercase tracking-wider sm:tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all whitespace-normal sm:whitespace-nowrap text-center">Synchronize Config</Button>
                         </div>

                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10">
                            <div className="p-4 sm:p-6 rounded-2xl bg-muted/20 border border-border/50">
                               <label className="text-[10px] font-black uppercase tracking-wider sm:tracking-widest text-muted-foreground mb-2 sm:mb-3 block">Base Pickup Charge</label>
                               <div className="relative">
                                  <span className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-base sm:text-lg font-black text-foreground opacity-30">₹</span>
                                  <input 
                                     type="number" 
                                     value={logisticsConfig.basePrice} 
                                     onChange={e => setLogisticsConfig({...logisticsConfig, basePrice: parseInt(e.target.value)})}
                                     className="w-full h-12 sm:h-14 pl-9 sm:pl-10 pr-4 sm:pr-6 rounded-xl bg-white border border-border outline-none text-base sm:text-lg font-black focus:border-primary/30 transition-all shadow-inner" 
                                  />
                               </div>
                            </div>
                            <div className="p-4 sm:p-6 rounded-2xl bg-muted/20 border border-border/50">
                               <label className="text-[10px] font-black uppercase tracking-wider sm:tracking-widest text-muted-foreground mb-2 sm:mb-3 block">Rate Per Kilometer</label>
                               <div className="relative">
                                  <span className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-base sm:text-lg font-black text-foreground opacity-30">₹</span>
                                  <input 
                                     type="number" 
                                     value={logisticsConfig.pricePerKm} 
                                     onChange={e => setLogisticsConfig({...logisticsConfig, pricePerKm: parseInt(e.target.value)})}
                                     className="w-full h-12 sm:h-14 pl-9 sm:pl-10 pr-4 sm:pr-6 rounded-xl bg-white border border-border outline-none text-base sm:text-lg font-black focus:border-primary/30 transition-all shadow-inner" 
                                  />
                               </div>
                            </div>
                            <div className="p-4 sm:p-6 rounded-2xl bg-muted/20 border border-border/50">
                               <label className="text-[10px] font-black uppercase tracking-wider sm:tracking-widest text-muted-foreground mb-2 sm:mb-3 block">Wait Charge (Per Min)</label>
                               <div className="relative">
                                  <span className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-base sm:text-lg font-black text-foreground opacity-30">₹</span>
                                  <input 
                                     type="number" 
                                     value={logisticsConfig.waitChargePerMin} 
                                     onChange={e => setLogisticsConfig({...logisticsConfig, waitChargePerMin: parseInt(e.target.value)})}
                                     className="w-full h-12 sm:h-14 pl-9 sm:pl-10 pr-4 sm:pr-6 rounded-xl bg-white border border-border outline-none text-base sm:text-lg font-black focus:border-primary/30 transition-all shadow-inner" 
                                  />
                               </div>
                            </div>
                            <div className="p-4 sm:p-6 rounded-2xl bg-muted/20 border border-border/50">
                               <label className="text-[10px] font-black uppercase tracking-wider sm:tracking-widest text-muted-foreground mb-2 sm:mb-3 block">2W Weight Limit (KG)</label>
                               <div className="relative">
                                  <span className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-base sm:text-lg font-black text-foreground opacity-30">KG</span>
                                  <input 
                                     type="number" 
                                     value={logisticsConfig.bikeWeightLimit} 
                                     onChange={e => setLogisticsConfig({...logisticsConfig, bikeWeightLimit: parseInt(e.target.value)})}
                                     className="w-full h-12 sm:h-14 pl-11 sm:pl-12 pr-4 sm:pr-6 rounded-xl bg-white border border-border outline-none text-base sm:text-lg font-black focus:border-primary/30 transition-all shadow-inner" 
                                  />
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* Booking Section - Wide Horizontal Card on PC */}
                      <div className="bg-white dark:bg-card border border-border rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-6 md:p-8 shadow-sm relative overflow-hidden group min-w-0 w-full">
                        <div className="relative z-10">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest mb-4 sm:mb-6 border border-blue-500/20">
                            <Navigation className="w-3.5 h-3.5" /> Outward Logistics
                          </div>
                          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-tight mb-2 sm:mb-4">Book Extraction Node</h3>
                          <p className="text-muted-foreground text-xs sm:text-sm font-medium mb-6 sm:mb-8 max-w-2xl">Deploy a logistics partner for professional asset extraction and delivery.</p>
                          
                          {logisticsLocked ? (
                            <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2rem] bg-rose-500/5 border border-rose-500/20 text-center space-y-4 sm:space-y-6">
                               <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 mx-auto shadow-inner">
                                  <Lock className="w-6 h-6 sm:w-8 sm:h-8" />
                               </div>
                               <div>
                                  <h4 className="text-lg sm:text-xl font-black uppercase tracking-tight text-rose-600 mb-1 sm:mb-2">Service Paused</h4>
                                  <p className="text-xs font-medium text-muted-foreground leading-relaxed max-w-md mx-auto">The logistics extraction network is currently undergoing global calibration. Manual booking is temporarily restricted by central command.</p>
                               </div>
                               <div className="pt-2 sm:pt-4 flex items-center justify-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-600">Re-Initializing Soon</span>
                               </div>
                            </div>
                          ) : !isBooking ? (
                            <Button onClick={() => setIsBooking(true)} className="w-full sm:w-auto h-12 sm:h-14 md:h-16 px-8 sm:px-12 rounded-xl sm:rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider sm:tracking-widest text-xs shadow-2xl shadow-blue-500/20">New Booking Protocol</Button>
                          ) : (
                            <form onSubmit={handleBookDelivery} className="space-y-6">
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Pickup Node</label>
                                  <input value={pickupLoc} onChange={e => setPickupLoc(e.target.value)} type="text" placeholder="Warehouse Sector" className="w-full h-12 sm:h-14 px-4 sm:px-6 rounded-xl bg-muted/30 border border-transparent focus:bg-white focus:border-blue-500/30 outline-none transition-all text-xs font-black shadow-inner" />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Drop Location</label>
                                  <input value={dropLoc} onChange={e => setDropLoc(e.target.value)} type="text" placeholder="Destination Point" className="w-full h-12 sm:h-14 px-4 sm:px-6 rounded-xl bg-muted/30 border border-transparent focus:bg-white focus:border-blue-500/30 outline-none transition-all text-xs font-black shadow-inner" />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Payload Weight (kg)</label>
                                  <input value={shipWeight} onChange={e => setShipWeight(e.target.value)} type="number" min="0.1" step="0.1" className="w-full h-12 sm:h-14 px-4 sm:px-6 rounded-xl bg-muted/30 border border-transparent focus:bg-white focus:border-blue-500/30 outline-none transition-all text-xs font-black shadow-inner" />
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between mb-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Distance Matrix</label>
                                    <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border">
                                      <button 
                                        type="button" 
                                        onClick={() => setDistanceMode("auto")} 
                                        className={`px-2 py-0.5 text-[8px] font-black uppercase rounded transition-all ${
                                          distanceMode === "auto" ? "bg-blue-600 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                                        }`}
                                      >
                                        Auto GIS
                                      </button>
                                      <button 
                                        type="button" 
                                        onClick={() => setDistanceMode("custom")} 
                                        className={`px-2 py-0.5 text-[8px] font-black uppercase rounded transition-all ${
                                          distanceMode === "custom" ? "bg-blue-600 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                                        }`}
                                      >
                                        Custom KM
                                      </button>
                                    </div>
                                  </div>

                                  {distanceMode === "auto" ? (
                                    <div className="flex items-center justify-between gap-2 h-12 sm:h-14 px-4 sm:px-6 bg-muted/30 rounded-xl border border-transparent relative overflow-hidden">
                                      {isCalculating ? (
                                        <div className="flex items-center gap-2">
                                          <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest animate-pulse">Calculating Path...</span>
                                        </div>
                                      ) : (
                                        <>
                                          <div className="flex items-center gap-2 truncate">
                                            <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                            <span className="text-xs font-black text-foreground truncate">{shipDistance || "5.0"} KM</span>
                                          </div>
                                          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 text-[8px] font-black uppercase rounded border border-blue-500/20 shrink-0">Auto Calc</span>
                                        </>
                                      )}
                                      <div className="absolute bottom-0 left-0 h-0.5 bg-blue-500 transition-all duration-500" style={{ width: isCalculating ? '60%' : '100%', opacity: isCalculating ? 1 : 0 }} />
                                    </div>
                                  ) : (
                                    <div className="relative">
                                      <input 
                                        type="number" 
                                        min="0.1" 
                                        step="0.1" 
                                        value={shipDistance} 
                                        onChange={e => setShipDistance(e.target.value)} 
                                        placeholder="e.g. 15.5" 
                                        className="w-full h-12 sm:h-14 pl-4 sm:pl-6 pr-14 rounded-xl bg-muted/30 border border-transparent focus:bg-white focus:border-blue-500/30 outline-none transition-all text-xs font-black shadow-inner" 
                                      />
                                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-600 uppercase tracking-wider bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">KM</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-end">
                                <div className="lg:col-span-2 space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Transport Matrix</label>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                                    {(Object.entries(vehicleConfigs) as [keyof typeof vehicleConfigs, any][]).map(([key, cfg]) => {
                                      const isDisabled = parseFloat(shipWeight) > cfg.maxWeight;
                                      return (
                                        <button
                                          key={key}
                                          type="button"
                                          disabled={isDisabled}
                                          onClick={() => setSelVehicle(key)}
                                          className={`flex items-center justify-center gap-2 h-12 sm:h-14 px-3 sm:px-4 rounded-xl border transition-all ${
                                            selVehicle === key ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-muted/30 border-transparent text-muted-foreground hover:bg-muted'
                                          } ${isDisabled ? 'opacity-20 cursor-not-allowed grayscale' : ''}`}
                                        >
                                          <cfg.icon className="w-4 h-4 shrink-0" />
                                          <span className="text-[10px] font-black uppercase truncate">{cfg.label}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:col-span-1">
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Receiver Name</label>
                                    <input value={recName} onChange={e => setRecName(e.target.value)} type="text" placeholder="Buyer Entity" className="w-full h-12 sm:h-14 px-4 rounded-xl bg-muted/30 border border-transparent focus:bg-white focus:border-blue-500/30 outline-none transition-all text-xs font-black shadow-inner" />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Contact Sync</label>
                                    <input value={recPhone} onChange={e => setRecPhone(e.target.value)} type="tel" placeholder="+91 XXXX" className="w-full h-12 sm:h-14 px-4 rounded-xl bg-muted/30 border border-transparent focus:bg-white focus:border-blue-500/30 outline-none transition-all text-xs font-black shadow-inner" />
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 shadow-inner">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 w-full sm:w-auto">
                                  <div>
                                    <p className="text-[8px] sm:text-[9px] font-black uppercase text-blue-500/60 tracking-[0.2em]">Total Estimate</p>
                                    <p className="text-3xl font-black text-blue-600 tracking-tighter">₹{estimatedPrice}</p>
                                  </div>
                                  <div className="hidden sm:block border-l border-blue-500/20 h-10" />
                                  <div className="flex items-center gap-4">
                                    <div className="px-3 py-1 bg-rose-500/10 rounded-full border border-rose-500/20 inline-flex items-center gap-1.5">
                                      <TrendingUp className="w-3 h-3 text-rose-500" />
                                      <span className="text-[8px] sm:text-[9px] font-black text-rose-500 uppercase tracking-widest">High Demand 1.2x</span>
                                    </div>
                                    <div className="text-[9px] font-bold text-muted-foreground uppercase">
                                      Base ₹{vehicleConfigs[selVehicle].baseFare} + Dist ₹{Math.round(parseFloat(shipDistance) * vehicleConfigs[selVehicle].perKm)}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                  <Button type="button" variant="ghost" onClick={() => setIsBooking(false)} className="w-1/2 sm:w-auto h-12 sm:h-14 px-6 rounded-xl font-black uppercase text-xs tracking-widest">Abort</Button>
                                  <Button type="submit" className="w-1/2 sm:w-auto h-12 sm:h-14 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs tracking-widest shadow-xl">Execute Booking</Button>
                                </div>
                              </div>
                            </form>
                          )}
                        </div>
                      </div>

                      {/* Map & Security Token Section - 2 Columns on PC View */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 min-w-0 w-full">
                        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                           <div className="bg-white dark:bg-card border border-border rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-10 shadow-sm h-[400px] sm:h-[500px] lg:h-[650px] overflow-hidden">
                              <div className="flex items-center justify-between mb-6 sm:mb-8">
                                 <div>
                                    <h3 className="text-lg sm:text-xl font-black text-foreground uppercase tracking-tight">Tactical Fleet Tracker</h3>
                                    <p className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Real-time Node Tracing Active</p>
                                 </div>
                                 <div className="flex items-center gap-1.5 sm:gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-emerald-500">Live Satellite Link</span>
                                 </div>
                              </div>
                              <div className="h-[calc(100%-60px)] sm:h-[calc(100%-80px)] rounded-2xl sm:rounded-[2rem] overflow-hidden border border-border">
                                 <TacticalMap 
                                    pickup={myBookings.find(b => b.status === 'accepted' || b.status === 'arrived_pickup')?.pickupAddress}
                                    drop={myBookings.find(b => b.status === 'picked_up' || b.status === 'arrived_drop')?.deliveryAddress}
                                 />
                              </div>
                           </div>
                        </div>

                        <div className="lg:col-span-1 space-y-6 sm:space-y-8 min-w-0 w-full">
                          <div className="bg-slate-900 rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-10 text-white relative overflow-hidden min-h-[350px] sm:min-h-[400px] flex flex-col justify-between border border-white/10 shadow-2xl">
                             <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4 sm:mb-6">
                                   <h3 className="text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary">Security Token Matrix</h3>
                                   <span className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-wider">Live Protection</span>
                                </div>
                                
                                <div className="space-y-4 sm:space-y-6">
                                   {myBookings.filter(b => b.status !== 'completed').slice(0, 3).map(b => (
                                     <div key={b.id} className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 shadow-lg">
                                        <div className="flex justify-between items-center mb-3 sm:mb-4">
                                           <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">ID: {b.orderId}</p>
                                           <span className="px-2 py-0.5 sm:py-1 rounded-lg bg-blue-500/20 text-blue-400 text-[8px] font-black uppercase tracking-widest">{b.status}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                           <div>
                                              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1">Pickup OTP</p>
                                              <p className="text-xl sm:text-2xl font-black tracking-widest text-white">{b.pickupOtp || '----'}</p>
                                           </div>
                                           <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/60">
                                              <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                                           </div>
                                        </div>
                                        <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 mt-3 sm:mt-4 italic">Give this OTP to driver on arrival</p>
                                     </div>
                                   ))}
                                   {myBookings.filter(b => b.status !== 'completed').length === 0 && (
                                      <div className="py-12 sm:py-16 text-center flex flex-col items-center justify-center gap-3 border border-dashed border-white/10 rounded-2xl sm:rounded-3xl bg-white/[0.02]">
                                         <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                                            <ShieldCheck className="w-6 h-6" />
                                         </div>
                                         <p className="text-xs font-black text-slate-200 uppercase tracking-widest">No Active Tokens</p>
                                         <p className="text-[10px] text-slate-400 font-medium max-w-[220px] leading-relaxed">Security verification OTPs will generate automatically when an extraction node is deployed.</p>
                                      </div>
                                   )}
                                </div>
                             </div>
                             <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                <Lock className="w-36 h-36 text-white" />
                             </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-card border border-border rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-sm">
                        <div className="px-5 sm:px-10 py-5 sm:py-8 border-b border-border flex items-center justify-between">
                           <h3 className="text-lg sm:text-xl font-black text-foreground uppercase tracking-tight">Shipment Registry</h3>
                           <button className="p-2.5 sm:p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors"><Search className="w-4 h-4" /></button>
                        </div>
                        <div className="overflow-x-auto">
                           <table className="w-full text-left">
                              <thead>
                                 <tr className="bg-muted/30 border-b border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    <th className="px-10 py-5">Shipment ID</th>
                                    <th className="px-6 py-5">Receiver Node</th>
                                    <th className="px-6 py-5">Drop Point</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5">Assigned Driver</th>
                                    <th className="px-10 py-5 text-right">Extraction Value</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-border/50">
                                 {myBookings.map((b) => {
                                    const assignedDriver = b.partnerId ? getDeliveries().find(d => d.id === b.id)?.partnerId : null;
                                    // In a real app we'd fetch the user object by ID. 
                                    // For this simulation, we'll look up the driver from the global users list if possible.
                                    return (
                                    <tr key={b.id} className="hover:bg-muted/10 transition-colors">
                                       <td className="px-10 py-6">
                                          <div className="flex items-center gap-3">
                                             <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center"><Truck className="w-4 h-4" /></div>
                                             <p className="text-xs font-black text-foreground uppercase tracking-tight">{b.orderId}</p>
                                          </div>
                                       </td>
                                       <td className="px-6 py-6">
                                          <p className="text-xs font-black text-foreground uppercase tracking-tight">{b.customerName}</p>
                                          <p className="text-[9px] font-bold text-muted-foreground">{b.receiverPhone}</p>
                                       </td>
                                       <td className="px-6 py-6 text-xs font-bold text-muted-foreground truncate max-w-[200px]">{b.deliveryAddress}</td>
                                       <td className="px-6 py-6">
                                          <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                                             b.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                                          }`}>{b.status}</span>
                                       </td>
                                       <td className="px-6 py-6">
                                          {b.status === 'completed' && !b.isRated ? (
                                             <Button onClick={() => setRateModal({ isOpen: true, deliveryId: b.id, driverId: b.partnerId! })} className="h-8 px-4 rounded-lg gradient-primary text-white text-[9px] font-black uppercase tracking-widest shadow-lg">Rate Driver</Button>
                                          ) : b.partnerId ? (
                                             <div className="flex items-center gap-3 bg-primary/5 p-2 rounded-xl border border-primary/10">
                                                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-[10px] font-black">{b.partnerName?.charAt(0) || "D"}</div>
                                                <div>
                                                   <p className="text-[10px] font-black uppercase tracking-tight text-foreground">{b.partnerName || "Assigned Driver"}</p>
                                                   <p className="text-[8px] font-bold text-muted-foreground">{b.partnerPhone || "Identity Verified"}</p>
                                                   <div className="flex gap-2 mt-1">
                                                      <button className="p-1.5 rounded-md bg-white text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all"><Phone className="w-3 h-3" /></button>
                                                      <button className="p-1.5 rounded-md bg-white text-blue-500 border border-blue-200 hover:bg-blue-500 hover:text-white transition-all"><MessageSquare className="w-3 h-3" /></button>
                                                   </div>
                                                </div>
                                             </div>
                                          ) : (
                                             <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-40 italic">Waiting for Driver...</span>
                                          )}
                                       </td>
                                       <td className="px-10 py-6 text-right font-black text-xs">₹{b.amount}</td>
                                    </tr>
                                 )})}
                                 {myBookings.length === 0 && (
                                    <tr>
                                       <td colSpan={5} className="px-10 py-20 text-center text-muted-foreground italic text-sm">No logistics history found in the current sector.</td>
                                    </tr>
                                 )}
                              </tbody>
                           </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ANALYTICS TAB */}
                  {activeTab === "analytics" && (
                    <div className="space-y-8">
                      <div className="bg-white dark:bg-card border border-border rounded-3xl p-8 shadow-sm flex items-center gap-4">
                        <BarChart3 className="w-8 h-8 text-amber-500" />
                        <div>
                          <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Intelligence Feed</h2>
                          <p className="text-sm text-muted-foreground font-medium mt-0.5 italic">Asset impression metrics and algorithmic positioning.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* Global Intelligence Matrix - The Globe */}
                        <div className="bg-white dark:bg-card border border-border rounded-3xl overflow-hidden shadow-sm relative min-h-[600px]">
                          <div className="absolute top-6 left-6 z-10">
                            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Global Match Flow</h3>
                            <p className="text-[10px] text-primary font-black uppercase tracking-widest flex items-center gap-1">
                              <Activity className="w-3 h-3" /> Real-time Nodes
                            </p>
                          </div>
                          
                          <InteractiveEarth onSelectCountry={(c) => setSelectedCountry(c)} />

                          {/* Data Drill-down Overlay */}
                          <AnimatePresence>
                            {selectedCountry && (
                              <motion.div
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 100 }}
                                className="absolute top-4 right-4 bottom-4 w-[320px] z-30 pointer-events-auto"
                              >
                                <div className="bg-black/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] h-full flex flex-col p-6 shadow-2xl">
                                  <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                      <span className="text-4xl">{selectedCountry.flag}</span>
                                      <div>
                                        <h4 className="text-xl font-black text-white uppercase tracking-tighter">{selectedCountry.name}</h4>
                                        <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">{selectedCountry.stat} PROTOCOL</span>
                                      </div>
                                    </div>
                                    <button 
                                      onClick={() => {
                                        if (expandedState) setExpandedState(null);
                                        else setSelectedCountry(null);
                                      }}
                                      className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>

                                  <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar-sleek">
                                    {selectedCountry.states.map((s) => (
                                      <div 
                                        key={s.name}
                                        onClick={() => setExpandedState(s.name === expandedState ? null : s.name)}
                                        className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
                                      >
                                        <div className="flex justify-between items-start mb-2">
                                          <div>
                                            <p className="text-sm font-black text-white uppercase tracking-tight">{s.name}</p>
                                            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{s.count} Inquiries</p>
                                          </div>
                                          <span className="text-lg font-black text-primary tracking-tighter">{s.val}</span>
                                        </div>
                                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                          <motion.div 
                                            initial={{ width: 0 }} 
                                            animate={{ width: s.val }} 
                                            className="h-full bg-primary shadow-[0_0_10px_rgba(139,92,246,0.5)]" 
                                          />
                                        </div>

                                        {expandedState === s.name && (
                                          <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="mt-4 pt-4 border-t border-white/5 space-y-3"
                                          >
                                            <div className="text-[9px] font-black uppercase tracking-widest text-primary/60 mb-2">City-Level Matrix</div>
                                            {s.cities?.map(city => (
                                              <div key={city.name} className="flex items-center justify-between group/city">
                                                <span className="text-[10px] font-black uppercase text-white/60 group-hover/city:text-white transition-colors">{city.name}</span>
                                                <div className="flex items-center gap-2">
                                                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                                  <span className="text-[10px] font-black text-emerald-500">{city.count} Total</span>
                                                </div>
                                              </div>
                                            ))}
                                          </motion.div>
                                        )}
                                      </div>
                                    ))}
                                  </div>

                                  <div className="mt-6 pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-3">
                                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                      <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Inquiry Data Verified</span>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="bg-white dark:bg-card border border-border rounded-3xl p-8 shadow-sm">
                          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6">Asset Performance Hierarchy</h3>
                          <div className="space-y-4">
                            {myProducts.sort((a, b) => b.views - a.views).map((p, idx) => (
                              <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-border/50 hover:bg-muted/40 transition-colors">
                                <span className="text-[10px] font-black text-muted-foreground w-4">{String(idx + 1).padStart(2, '0')}</span>
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm">{p.image}</div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[11px] font-black text-foreground uppercase tracking-wider truncate">{p.name}</p>
                                  <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden flex">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (p.views / (myProducts[0]?.views || 1)) * 100)}%` }} transition={{ duration: 1.5 }} className="h-full bg-amber-500" />
                                  </div>
                                </div>
                                <div className="text-right shrink-0">
                                  <span className="text-sm font-black text-foreground tabular-nums tracking-tighter">{p.views}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-8">
                          <div className="bg-gradient-to-br from-slate-900 to-[#111116] border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.05]"><Target className="w-32 h-32 text-white" /></div>
                            <div className="relative z-10">
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-2 block">System Optimization</span>
                              <h3 className="text-3xl font-black text-white tracking-tighter leading-tight mb-4">Elite Visibility Matrix</h3>
                              <p className="text-white/60 text-sm font-medium mb-8 leading-relaxed max-w-sm">Products with rich technical descriptions and HD assets receive 300% more B2B inquiries natively.</p>
                              <Button onClick={() => setActiveTab("products")} className="rounded-xl px-8 h-12 bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-amber-400 hover:text-black transition-colors shadow-xl">Tune Assets Now</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* VERIFICATION TAB */}
                  {activeTab === "verification" && (
                    <div className="bg-white dark:bg-card border border-border rounded-3xl p-10 shadow-sm max-w-4xl">
                      <div className="flex flex-col md:flex-row items-center gap-8 mb-10 text-center md:text-left">
                        <div className="w-24 h-24 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 border-4 border-white shadow-xl relative">
                          <ShieldCheck className="w-10 h-10" />
                          {user?.verified ? (
                            <div className="absolute -bottom-2 right-0 w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white"><CheckCircle2 className="w-4 h-4" /></div>
                          ) : (
                            <div className="absolute -bottom-2 right-0 w-8 h-8 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-white"><Clock className="w-4 h-4" /></div>
                          )}
                        </div>
                        <div>
                          <h2 className="text-3xl font-black uppercase tracking-tighter text-foreground mb-2">Corporate Identity Review</h2>
                          {user?.verified ? (
                            <p className="text-sm text-muted-foreground font-medium">Your node status is currently <span className="text-emerald-600 font-black">VERIFIED & AUTHORIZED</span> in the global matrix.</p>
                          ) : (
                            <p className="text-sm text-muted-foreground font-medium">Your node status is currently <span className="text-amber-600 font-black">PENDING AUTHORIZATION</span> in the global matrix.</p>
                          )}
                        </div>
                      </div>

                      {user?.verified ? (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                            <ShieldCheck className="w-8 h-8" />
                          </div>
                          <h3 className="text-lg font-black uppercase tracking-widest text-emerald-900 mb-2">Verification Complete</h3>
                          <p className="text-sm font-medium text-emerald-700 max-w-md">Your compliance assets have been manually reviewed and verified by Central Command. Your business profile is fully integrated into the global trading matrix.</p>
                        </div>
                      ) : user?.documents?.gst && user?.documents?.pan && user?.verified === false ? (
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-4">
                            <Clock className="w-8 h-8 animate-pulse" />
                          </div>
                          <h3 className="text-lg font-black uppercase tracking-widest text-amber-900 mb-2">Under Verification</h3>
                          <p className="text-sm font-medium text-amber-700 max-w-md">Your compliance assets have been successfully transmitted and are currently under review by Central Command. Your business profile will be integrated into the global matrix once authorized.</p>
                        </div>
                      ) : (
                        <>
                          <div className="bg-muted/10 border border-border rounded-2xl p-6 mb-8">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Required Compliance Assets</h4>
                              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">Max 5MB per file (PDF, JPG, PNG)</span>
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-border shadow-sm border-amber-200">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600"><Activity className="w-4 h-4 animate-pulse" /></div>
                                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">Government ID (PAN/Aadhaar)</span>
                                </div>
                                {panDocument ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-foreground max-w-[150px] truncate">{panDocument.name}</span>
                                    <Button variant="ghost" size="sm" onClick={() => setPanDocument(null)} className="h-8 w-8 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg">✕</Button>
                                  </div>
                                ) : (
                                  <div>
                                    <input type="file" id="pan-upload" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        const file = e.target.files[0];
                                        if (file.size > 5 * 1024 * 1024) {
                                          toast.error("File size must be less than 5MB");
                                          return;
                                        }
                                        const reader = new FileReader();
                                        reader.onload = (ev) => {
                                          setPanDocument({ name: file.name, url: ev.target?.result as string, file: file });
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }} />
                                    <label htmlFor="pan-upload" className="cursor-pointer inline-flex items-center justify-center h-8 px-3 rounded-md text-[9px] font-black uppercase tracking-widest border border-amber-300 text-amber-700 hover:bg-amber-100 transition-colors">
                                      Upload Data
                                    </label>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-border shadow-sm border-amber-200">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600"><Activity className="w-4 h-4 animate-pulse" /></div>
                                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">Business License (GST/MSME)</span>
                                </div>
                                {gstDocument ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-foreground max-w-[150px] truncate">{gstDocument.name}</span>
                                    <Button variant="ghost" size="sm" onClick={() => setGstDocument(null)} className="h-8 w-8 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg">✕</Button>
                                  </div>
                                ) : (
                                  <div>
                                    <input type="file" id="gst-upload" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        const file = e.target.files[0];
                                        if (file.size > 5 * 1024 * 1024) {
                                          toast.error("File size must be less than 5MB");
                                          return;
                                        }
                                        const reader = new FileReader();
                                        reader.onload = (ev) => {
                                          setGstDocument({ name: file.name, url: ev.target?.result as string, file: file });
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }} />
                                    <label htmlFor="gst-upload" className="cursor-pointer inline-flex items-center justify-center h-8 px-3 rounded-md text-[9px] font-black uppercase tracking-widest border border-amber-300 text-amber-700 hover:bg-amber-100 transition-colors">
                                      Upload Data
                                    </label>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <Button onClick={async () => {
                            if (!gstDocument || !panDocument) {
                              toast.error("Please upload all required compliance assets first.");
                              return;
                            }
                            
                            // To fallback to localStorage if PHP is not setup
                            const fallbackLocal = () => {
                              const updatedUser = { ...user, verified: false, documents: { ...user.documents, gst: gstDocument, pan: panDocument } };
                              const result = updateUserProfile(updatedUser as any);
                              if (result.success && result.user) {
                                setUser(result.user);
                                toast.success("Audit requested locally (Backend skipped).");
                              }
                            };

                            if (!gstDocument.file || !panDocument.file) {
                              fallbackLocal();
                              return;
                            }

                            const formData = new FormData();
                            formData.append('userId', user.id);
                            formData.append('userName', user.name);
                            formData.append('gst', gstDocument.file);
                            formData.append('pan', panDocument.file);

                            try {
                              const res = await fetch('http://localhost/api/upload_compliance.php', {
                                method: 'POST',
                                body: formData
                              });
                              
                              if (!res.ok) throw new Error("Server returned " + res.status);
                              const data = await res.json();
                              
                              if (data.success) {
                                // Also update local state so the UI reflects "Under Verification" immediately
                                const updatedUser = { ...user, verified: false, documents: { ...user.documents, gst: gstDocument, pan: panDocument } };
                                updateUserProfile(updatedUser as any);
                                setUser(updatedUser as any);
                                toast.success("Audit requested. Central command notified with your documents.");
                              } else {
                                toast.error(data.error || "Failed to upload to database.");
                                fallbackLocal(); // Fallback if DB fails (e.g. no password configured)
                              }
                            } catch (err) {
                              console.error("Upload error:", err);
                              toast.error("Could not connect to PHP backend. Falling back to local storage.");
                              fallbackLocal();
                            }
                          }} className="w-full rounded-2xl h-14 gradient-primary font-black text-xs uppercase tracking-[0.2em] shadow-xl text-white">Execute Fast-Track Authorization</Button>
                        </>
                      )}
                    </div>
                  )}

                  {/* PROFILE TAB */}
                  {activeTab === "profile" && (
                    <div className="bg-white dark:bg-card border border-border rounded-3xl p-5 sm:p-8 md:p-16 shadow-sm max-w-5xl relative overflow-hidden">
                      <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-10 md:gap-14 mb-8 sm:mb-12 md:mb-16 relative z-10 text-center md:text-left">
                        <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full gradient-primary flex items-center justify-center text-white font-black text-4xl sm:text-5xl md:text-6xl shadow-2xl relative border-4 sm:border-8 border-white dark:border-card shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-3 md:mb-4 uppercase tracking-tighter break-words">{user.name}</h2>
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4">
                            <div className="flex items-center gap-2.5 sm:gap-3 text-muted-foreground bg-muted/50 px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl font-bold border border-border/30 text-xs sm:text-sm max-w-full truncate">
                              <Mail className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary shrink-0" /> <span className="truncate">{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 md:gap-10 relative z-10">
                        <div className="space-y-2 sm:space-y-3">
                          <label className="text-[10px] sm:text-[11px] font-black text-muted-foreground uppercase tracking-[0.15em] sm:tracking-[0.3em] ml-1 sm:ml-2">Node Principal</label>
                          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full h-12 sm:h-14 md:h-16 px-4 sm:px-8 rounded-2xl bg-muted/20 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-xs sm:text-sm font-black text-foreground tracking-tight shadow-inner" />
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <label className="text-[10px] sm:text-[11px] font-black text-muted-foreground uppercase tracking-[0.15em] sm:tracking-[0.3em] ml-1 sm:ml-2">Secure Contact Relay</label>
                          <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" className="w-full h-12 sm:h-14 md:h-16 px-4 sm:px-8 rounded-2xl bg-muted/20 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-xs sm:text-sm font-black text-foreground tracking-tight shadow-inner" />
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <label className="text-[10px] sm:text-[11px] font-black text-muted-foreground uppercase tracking-[0.15em] sm:tracking-[0.3em] ml-1 sm:ml-2">Location / City Base</label>
                          <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Pune, Mumbai, etc." className="w-full h-12 sm:h-14 md:h-16 px-4 sm:px-8 rounded-2xl bg-muted/20 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-xs sm:text-sm font-black text-foreground tracking-tight shadow-inner" />
                        </div>

                        {/* Social Assets Settings Area */}
                        <div className="md:col-span-2 mt-4 sm:mt-8">
                          <Collapsible open={showSocials} onOpenChange={setShowSocials}>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" className="w-full h-auto min-h-[3.5rem] py-3 rounded-2xl border border-dashed border-border flex items-center justify-between px-4 sm:px-8 hover:bg-muted/50 transition-all group gap-3 whitespace-normal">
                                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider sm:tracking-widest text-muted-foreground group-hover:text-primary text-left leading-snug flex-1">Corporate Web Presence & Social Nodes</span>
                                <ChevronRight className={`w-5 h-5 shrink-0 transition-transform duration-300 ${showSocials ? 'rotate-90' : ''}`} />
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-4 sm:space-y-6 pt-6 sm:pt-8">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Official Website Hub</label>
                                  <div className="relative">
                                    <Globe className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary/40" />
                                    <input type="url" placeholder="https://yourcompany.com" value={website} onChange={e => setWebsite(e.target.value)} className="w-full h-12 sm:h-14 pl-11 sm:pl-14 pr-4 sm:pr-6 rounded-2xl bg-muted/20 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-xs sm:text-sm font-bold shadow-inner" />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">LinkedIn Professional Node</label>
                                  <div className="relative">
                                    <Linkedin className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-4.5 sm:h-4.5 text-blue-500/40" />
                                    <input type="text" placeholder="username" value={linkedin} onChange={e => setLinkedin(e.target.value)} className="w-full h-12 sm:h-14 pl-11 sm:pl-14 pr-4 sm:pr-6 rounded-2xl bg-muted/20 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-xs sm:text-sm font-bold shadow-inner" />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Instagram Display Portfolio</label>
                                  <div className="relative">
                                    <Instagram className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-4.5 sm:h-4.5 text-rose-500/40" />
                                    <input type="text" placeholder="@username" value={instagram} onChange={e => setInstagram(e.target.value)} className="w-full h-12 sm:h-14 pl-11 sm:pl-14 pr-4 sm:pr-6 rounded-2xl bg-muted/20 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-xs sm:text-sm font-bold shadow-inner" />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Facebook Comms</label>
                                  <div className="relative">
                                    <Facebook className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-4.5 sm:h-4.5 text-blue-600/40" />
                                    <input type="text" placeholder="pagename" value={facebook} onChange={e => setFacebook(e.target.value)} className="w-full h-12 sm:h-14 pl-11 sm:pl-14 pr-4 sm:pr-6 rounded-2xl bg-muted/20 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-xs sm:text-sm font-bold shadow-inner" />
                                  </div>
                                </div>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      </div>

                      <div className="mt-8 sm:mt-14 md:mt-20 pt-6 sm:pt-8 md:pt-10 border-t border-border flex flex-col sm:flex-row justify-end items-center gap-3 sm:gap-6 relative z-10 pb-16 md:pb-0">
                        <Button variant="ghost" className="w-full sm:w-auto h-12 sm:h-14 md:h-16 px-6 sm:px-12 font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-xs rounded-2xl">Revert</Button>
                        <Button
                          disabled={isUpdating}
                          onClick={handleUpdateProfile}
                          className="w-full sm:w-auto h-12 sm:h-14 md:h-16 px-6 sm:px-12 md:px-16 font-black uppercase tracking-[0.15em] sm:tracking-[0.3em] text-xs rounded-2xl gradient-primary border-none shadow-2xl shadow-primary/20 hover:scale-105 transition-all active:scale-95 text-white whitespace-normal sm:whitespace-nowrap text-center"
                        >
                          {isUpdating ? "Synchronizing..." : "Update Command Core"}
                        </Button>
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>
      {/* FORCE FEEDBACK MODAL */}
      <AnimatePresence>
        {rateModal?.isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRateModal(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#111116] w-full max-w-md rounded-[3rem] border border-white/10 shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-10 text-center">
                <div className="w-20 h-20 rounded-[2rem] bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-8">
                  <Star className="w-10 h-10 fill-current" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Driver Audit</h3>
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-10">Evaluate the extraction and transit performance</p>

                <div className="flex justify-center gap-3 mb-10">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRatingValue(star)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        ratingValue >= star ? "bg-amber-500 text-white scale-110 shadow-lg shadow-amber-500/20" : "bg-muted text-muted-foreground hover:bg-amber-500/20"
                      }`}
                    >
                      <Star className={`w-6 h-6 ${ratingValue >= star ? "fill-current" : ""}`} />
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-10">
                   {["Professional", "Fast Transit", "Secure Cargo", "Great Comms"].map(tag => (
                     <div key={tag} className="px-4 py-3 rounded-xl bg-muted/50 border border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary transition-all cursor-pointer">
                        {tag}
                     </div>
                   ))}
                </div>

                <div className="flex gap-4">
                  <Button onClick={() => setRateModal(null)} variant="outline" className="flex-1 h-16 rounded-2xl border-2 border-border font-black text-[11px] uppercase tracking-widest">Abort</Button>
                  <Button onClick={handleRateDriver} className="flex-[2] h-16 rounded-2xl gradient-primary text-white font-black text-[11px] uppercase tracking-widest shadow-xl">Confirm Feedback</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RAZORPAY & MULTI-METHOD PAYMENT MODAL */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        plan={selectedPlan}
        user={user}
        onPaymentSuccess={() => {
          if (setUser && user) {
            const updated = {
              ...user,
              subscription: {
                planId: selectedPlan?.id || "advanced",
                planName: selectedPlan?.name || "Advanced",
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 365 * 86400000).toISOString(),
                status: "active" as const,
                billingCycle: "yearly" as const,
                pricePaid: selectedPlan?.price || 499
              }
            };
            setUser(updated);
          }
        }}
      />
    </Layout>
  );
}
