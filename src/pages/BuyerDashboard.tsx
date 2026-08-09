import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
    MessageSquare,
    Heart,
    ShoppingBag,
    Settings,
    Bell,
    MapPin,
    TrendingUp,
    Search,
    Clock,
    ArrowRight,
    Filter,
    CheckCircle2,
    AlertCircle,
    Shield,
    ShieldCheck,
    Edit2,
    LayoutDashboard,
    Mail,
    LogOut,
    type LucideIcon,
    CreditCard,
    Target,
    LifeBuoy,
    Globe,
    Instagram,
    Facebook,
    Linkedin,
    Youtube,
    AtSign,
    ChevronRight,
    X
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ChatCore from "@/components/chat/ChatCore";
import { 
    getInquiries, 
    markInquiriesAsRead,
    getProducts, 
    getUserWishlist, 
    updateUserProfile, 
    getNotifications, 
    markNotificationsRead,
    getUserAddresses,
    removeFromWishlist,
    getOrCreateChatRoom,
    getChatRooms,
    getChatMessages
} from "@/lib/storage";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const h = Math.floor(diff / 3600000);
    return h < 1 ? "Just now" : `${h}h ago`;
};
interface NavItem {
    id: string;
    label: string;
    icon: LucideIcon;
    color: string;
}

const navItems: NavItem[] = [
    { id: "overview", label: "My Hub", icon: LayoutDashboard, color: "text-primary" },
    { id: "chats", label: "Live Comms", icon: MessageSquare, color: "text-indigo-500" },
    { id: "inquiries", label: "My Inquiries", icon: ShoppingBag, color: "text-blue-500" },
    { id: "wishlist", label: "My Wishlist", icon: Heart, color: "text-rose-500" },
    { id: "addresses", label: "Saved Addresses", icon: MapPin, color: "text-emerald-500" },
    { id: "notifications", label: "Security Alerts", icon: Bell, color: "text-amber-500" },
    { id: "settings", label: "Account Matrix", icon: Settings, color: "text-slate-500" },
    { id: "payments", label: "Payments", icon: CreditCard, color: "text-amber-500" },
];

export default function BuyerDashboard() {
    const { user, setUser, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");
    const [isUpdating, setIsUpdating] = useState(false);

    // Settings State
    const [name, setName] = useState(user?.name || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [location, setLocation] = useState(user?.location || "");
    const [website, setWebsite] = useState(user?.website || "");
    const [instagram, setInstagram] = useState(user?.socialLinks?.instagram || "");
    const [facebook, setFacebook] = useState(user?.socialLinks?.facebook || "");
    const [threads, setThreads] = useState(user?.socialLinks?.threads || "");
    const [linkedin, setLinkedin] = useState(user?.socialLinks?.linkedin || "");
    const [youtube, setYoutube] = useState(user?.socialLinks?.youtube || "");
    const [sector, setSector] = useState(user?.sector || "");
    const [showSocials, setShowSocials] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [wishlistKey, setWishlistKey] = useState(0);
    const [inquiryRefreshKey, setInquiryRefreshKey] = useState(0);
    const [inquiryPage, setInquiryPage] = useState(1);
    const [targetRoomId, setTargetRoomId] = useState<string | null>(null);
    const [unreadChatCount, setUnreadChatCount] = useState(0);
    const [notificationKey, setNotificationKey] = useState(0);
    const ITEMS_PER_PAGE = 5;

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

    const handleOpenChat = (inq: any) => {
        const room = getOrCreateChatRoom(user.id, inq.sellerId, { 
            type: "product", 
            id: inq.productId, 
            title: `INQ: ${inq.productName}` 
        });
        setTargetRoomId(room.id);
        setActiveTab("chats");
    };

    useEffect(() => {
        setInquiryPage(1);
    }, [searchQuery]);

    const allProducts = useMemo(() => getProducts(), []);

    const allInquiries = useMemo(() => {
        if (!user) return [];
        return getInquiries().filter(i => i.buyerId === user.id || i.buyerEmail === user.email);
    }, [user, inquiryRefreshKey]);

    useEffect(() => {
        if (activeTab === "inquiries" && user) {
            const unreadCount = allInquiries.filter(i => !i.isRead).length;
            if (unreadCount > 0) {
                markInquiriesAsRead(user.id);
                setInquiryRefreshKey(k => k + 1);
            }
        }
    }, [activeTab, allInquiries, user]);

    const wishlistProductIds = useMemo(() => {
        if (!user) return [];
        return getUserWishlist(user.id);
    }, [user, wishlistKey]);

    const wishlistedProducts = useMemo(() => {
        return allProducts.filter(p => wishlistProductIds.includes(p.id));
    }, [allProducts, wishlistProductIds]);

    const notifications = useMemo(() => {
        if (!user) return [];
        return getNotifications(user.id);
    }, [user, notificationKey]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Refresh notifications when visiting the tab
    useEffect(() => {
        if (activeTab === "notifications") {
            setNotificationKey(k => k + 1);
        }
    }, [activeTab]);

    const handleMarkAllRead = () => {
        if (user) {
            markNotificationsRead(user.id);
            setNotificationKey(k => k + 1);
            toast.success("Security Alerts Cleared");
        }
    };

    if (!user) return <Navigate to="/login" replace />;
    if (user.role === "seller") return <Navigate to="/seller/dashboard" replace />;

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const [myAddresses, setMyAddresses] = useState<any[]>(() => getUserAddresses(user?.id || ""));
    const [editingNode, setEditingNode] = useState<any>(null);
    const [showNodeModal, setShowNodeModal] = useState(false);
    const [nodeName, setNodeName] = useState("");
    const [nodeAddr, setNodeAddr] = useState("");
    const [nodeBadge, setNodeBadge] = useState("");

    const handleEditNode = (hub: any) => {
        setEditingNode(hub);
        setNodeName(hub.name);
        setNodeAddr(hub.addr);
        setNodeBadge(hub.badge);
        setShowNodeModal(true);
    };

    const handleSaveNode = () => {
        if (!nodeName || !nodeAddr) {
            toast.error("Please fill in all node details.");
            return;
        }

        if (editingNode) {
            const updated = myAddresses.map(a => a.id === editingNode.id ? { ...a, name: nodeName, addr: nodeAddr, badge: nodeBadge } : a);
            setMyAddresses(updated);
            toast.success("Node updated successfully");
        } else {
            const newNode = {
                id: "addr_" + Date.now(),
                name: nodeName,
                addr: nodeAddr,
                type: "Shipping",
                badge: nodeBadge || "Custom"
            };
            setMyAddresses([...myAddresses, newNode]);
            toast.success("New node created");
        }
        setShowNodeModal(false);
    };

    const handleDiscard = () => {
        setName(user?.name || "");
        setPhone(user?.phone || "");
        setLocation(user?.location || "");
        setWebsite(user?.website || "");
        setInstagram(user?.socialLinks?.instagram || "");
        setFacebook(user?.socialLinks?.facebook || "");
        setThreads(user?.socialLinks?.threads || "");
        setLinkedin(user?.socialLinks?.linkedin || "");
        setYoutube(user?.socialLinks?.youtube || "");
        setSector(user?.sector || "");
    };

    const handleUpdateProfile = async () => {
        setIsUpdating(true);
        await new Promise(r => setTimeout(r, 1000));

        const updatedUser = {
            ...user,
            name,
            phone,
            location,
            sector,
            website: website || undefined,
            socialLinks: {
                instagram: instagram || undefined,
                facebook: facebook || undefined,
                threads: threads || undefined,
                linkedin: linkedin || undefined,
                youtube: youtube || undefined,
            }
        };

        const result = updateUserProfile(updatedUser);
        if (result.success) {
            setUser(result.user!);
            toast.success("Profile Node Synchronized Successfully");
        } else {
            toast.error(result.error);
        }
        setIsUpdating(false);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 5 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3, staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-[#F4F7FA] dark:bg-background/95">
                {/* Top Profile Header (Amazon/Flipkart Style) */}
                <div className="bg-white dark:bg-card border-b border-border shadow-sm py-5 sm:py-6">
                    <div className="container-wide flex flex-col md:flex-row items-center md:items-start justify-between gap-5 sm:gap-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left w-full md:w-auto">
                            <div className="relative group shrink-0">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full gradient-primary p-0.5 shadow-xl group-hover:scale-105 transition-all duration-300">
                                    <div className="w-full h-full rounded-full bg-white dark:bg-surface flex items-center justify-center text-primary font-heading font-black text-2xl sm:text-3xl">
                                        {user.name.charAt(0)}
                                    </div>
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 sm:w-6 sm:h-6 bg-success border-2 border-white dark:border-card rounded-full z-10 shadow-lg" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-xl sm:text-2xl font-heading font-black text-foreground mb-1 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                                    <span className="truncate max-w-[200px] sm:max-w-none">{user.name}</span>
                                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-lg border border-primary/20 shrink-0">Pro Buyer</span>
                                </h1>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 text-muted-foreground text-xs sm:text-sm font-medium">
                                    <span className="flex items-center gap-1 max-w-[220px] sm:max-w-none truncate"><Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-primary/70" /> <span className="truncate">{user.email}</span></span>
                                    <span className="opacity-30 hidden sm:inline">•</span>
                                    <span className="flex items-center gap-1 font-bold text-foreground text-xs sm:text-sm bg-muted/60 px-2.5 py-0.5 rounded-md border border-border/40">Elite ID: #{user.id.slice(0, 8)}</span>
                                </div>

                                {/* Dynamic Social Icons Node */}
                                {(user.website || user.socialLinks) && (
                                    <div className="mt-2.5 sm:mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                        {user.website && (
                                            <a href={user.website} target="_blank" rel="noopener noreferrer" className="h-7 sm:h-8 px-2.5 sm:px-3 rounded-lg bg-muted flex items-center justify-center gap-1.5 text-primary hover:bg-primary hover:text-white transition-all shadow-sm border border-border">
                                                <Globe className="w-3.5 h-3.5" /> <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Website</span>
                                            </a>
                                        )}
                                        {user.socialLinks?.linkedin && (
                                            <a href={`https://linkedin.com/in/${user.socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer" className="h-7 sm:h-8 px-2.5 sm:px-3 rounded-lg bg-blue-50 flex items-center justify-center gap-1.5 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100">
                                                <Linkedin className="w-3.5 h-3.5" /> <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">LinkedIn</span>
                                            </a>
                                        )}
                                        {user.socialLinks?.instagram && (
                                            <a href={`https://instagram.com/${user.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="h-7 sm:h-8 px-2.5 sm:px-3 rounded-lg bg-rose-50 flex items-center justify-center gap-1.5 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-rose-100">
                                                <Instagram className="w-3.5 h-3.5" /> <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Instagram</span>
                                            </a>
                                        )}
                                        {user.socialLinks?.facebook && (
                                            <a href={`https://facebook.com/${user.socialLinks.facebook}`} target="_blank" rel="noopener noreferrer" className="h-7 sm:h-8 px-2.5 sm:px-3 rounded-lg bg-blue-50 flex items-center justify-center gap-1.5 text-blue-800 hover:bg-blue-800 hover:text-white transition-all shadow-sm border border-blue-200">
                                                <Facebook className="w-3.5 h-3.5" /> <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Facebook</span>
                                            </a>
                                        )}
                                        {user.socialLinks?.youtube && (
                                            <a href={`https://youtube.com/@${user.socialLinks.youtube}`} target="_blank" rel="noopener noreferrer" className="h-7 sm:h-8 px-2.5 sm:px-3 rounded-lg bg-red-50 flex items-center justify-center gap-1.5 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100">
                                                <Youtube className="w-3.5 h-3.5" /> <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">YouTube</span>
                                            </a>
                                        )}
                                        {user.socialLinks?.threads && (
                                            <a href={`https://threads.net/@${user.socialLinks.threads}`} target="_blank" rel="noopener noreferrer" className="h-7 sm:h-8 px-2.5 sm:px-3 rounded-lg bg-slate-50 flex items-center justify-center gap-1.5 text-foreground hover:bg-foreground hover:text-white transition-all shadow-sm border border-slate-200">
                                                <AtSign className="w-3.5 h-3.5" /> <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Threads</span>
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                            <Link to="/products" className="flex-1 sm:flex-initial">
                                <Button className="w-full sm:w-auto rounded-xl px-4 sm:px-8 h-10 sm:h-12 gradient-primary border-none font-bold text-xs sm:text-[13px] uppercase tracking-wider relative overflow-hidden group">
                                    <span className="relative z-10 flex items-center justify-center gap-2">Explore Market <ShoppingBag className="w-4 h-4" /></span>
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Button>
                            </Link>
                            <Button variant="outline" className="flex-1 sm:flex-initial rounded-xl px-4 sm:px-5 h-10 sm:h-12 border-border font-bold text-xs sm:text-[13px] hover:bg-muted justify-center">
                                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 mr-1.5 sm:mr-2 shrink-0" /> Verified
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="container-wide py-5 sm:py-8">
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

                        {/* Account Sidebar Navigation */}
                        <aside className="w-full lg:w-64 shrink-0">
                            <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible no-scrollbar gap-1.5 p-1.5 lg:p-0 bg-white dark:bg-card lg:bg-transparent rounded-2xl lg:rounded-none border border-border/60 lg:border-none shadow-sm lg:shadow-none snap-x">
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`flex items-center gap-2.5 sm:gap-3 px-3.5 py-2.5 sm:px-5 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap text-left border-b-2 lg:border-b-0 lg:border-l-4 snap-start shrink-0 ${activeTab === item.id
                                            ? "bg-primary text-primary-foreground lg:bg-primary/5 lg:text-primary border-primary shadow-sm lg:shadow-none"
                                            : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted"
                                            }`}
                                    >
                                        <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${activeTab === item.id ? "text-primary-foreground lg:" + item.color : "text-muted-foreground/70"}`} />
                                        <span>{item.label}</span>
                                        {item.id === "inquiries" && allInquiries.filter(i => !i.isRead).length > 0 && (
                                            <span className="ml-auto bg-primary text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-black animate-pulse">
                                                {allInquiries.filter(i => !i.isRead).length}
                                            </span>
                                        )}
                                        {item.id === "chats" && unreadChatCount > 0 && (
                                            <span className="ml-auto bg-indigo-500 text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-black animate-pulse">
                                                {unreadChatCount}
                                            </span>
                                        )}
                                        {item.id === "notifications" && notifications.filter(n => !n.isRead).length > 0 && (
                                            <span className="ml-auto bg-rose-500 text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-black">
                                                {notifications.filter(n => !n.isRead).length}
                                            </span>
                                        )}
                                    </button>
                                ))}

                                <div className="hidden lg:block mt-6 p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 text-center">
                                    <p className="text-[10px] font-black uppercase text-primary mb-3">Enterprise Access</p>
                                    <p className="text-xs font-medium text-foreground/70 mb-4">Connect directly with 12K+ verified manufacturers.</p>
                                    <Link to="/contact">
                                        <Button variant="outline" size="sm" className="rounded-lg h-8 px-4 text-[10px] font-black uppercase tracking-widest border-primary/30 text-primary hover:bg-primary hover:text-white transition-all w-full">Support Hub</Button>
                                    </Link>
                                </div>
                                <button onClick={handleLogout} className="flex items-center gap-2.5 sm:gap-3 px-3.5 py-2.5 sm:px-5 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-rose-500 hover:bg-rose-50/50 w-auto lg:w-full hover:shadow-sm border border-transparent hover:border-rose-100 whitespace-nowrap snap-start shrink-0 mt-0 lg:mt-4">
                                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                                    <span className="uppercase tracking-wider sm:tracking-widest text-[10px] sm:text-[11px] font-black">Disconnect Net</span>
                                </button>
                            </nav>
                        </aside>

                        {/* Content Display Area */}
                        <main className="flex-1 min-w-0">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit={{ opacity: 0, y: 10 }}
                                >

                                    {activeTab === "overview" && (
                                        <div className="space-y-6">
                                            {/* Grid of Actionable Cards - Retail Dashboard Style */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                                                 {/* Summary Card 1: My Inquiries */}
                                                <div className="bg-white dark:bg-card rounded-2xl border border-border shadow-sm p-5 sm:p-6 hover:shadow-md transition-all group overflow-hidden relative">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                                                            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
                                                        </div>
                                                        <span className="text-xl sm:text-2xl font-black text-foreground tabular-nums">{allInquiries.length}</span>
                                                    </div>
                                                    <h3 className="text-base sm:text-lg font-black text-foreground group-hover:text-primary transition-colors">My Inquiries</h3>
                                                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 mb-5 sm:mb-6">Track your sourcing requests and supplier quotes.</p>
                                                    <button onClick={() => setActiveTab("inquiries")} className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest group/btn">
                                                        Manage Requirements <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                    </button>
                                                    <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-colors" />
                                                </div>

                                                {/* Summary Card 2: Wishlist */}
                                                <div className="bg-white dark:bg-card rounded-2xl border border-border shadow-sm p-5 sm:p-6 hover:shadow-md transition-all group overflow-hidden relative">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                                                            <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                                                        </div>
                                                        <span className="text-xl sm:text-2xl font-black text-foreground tabular-nums">{wishlistedProducts.length}</span>
                                                    </div>
                                                    <h3 className="text-base sm:text-lg font-black text-foreground group-hover:text-primary transition-colors">Strategic Wishlist</h3>
                                                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 mb-5 sm:mb-6">Industrial assets you are monitoring for procurement.</p>
                                                    <button onClick={() => setActiveTab("wishlist")} className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest group/btn">
                                                        View Interested <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                    </button>
                                                    <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10 transition-colors" />
                                                </div>

                                                {/* Summary Card 3: Saved Addresses */}
                                                <div className="bg-white dark:bg-card rounded-2xl border border-border shadow-sm p-5 sm:p-6 hover:shadow-md transition-all group overflow-hidden relative">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                                            <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                                                        </div>
                                                        <span className="text-xl sm:text-2xl font-black text-foreground tabular-nums">2</span>
                                                    </div>
                                                    <h3 className="text-base sm:text-lg font-black text-foreground group-hover:text-primary transition-colors">Plant Addresses</h3>
                                                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 mb-5 sm:mb-6">Shipping and billing locations for procurement hubs.</p>
                                                    <button onClick={() => setActiveTab("addresses")} className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest group/btn">
                                                        Edit Locations <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                    </button>
                                                    <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors" />
                                                </div>

                                                {/* Summary Card 4: Payments/Credit */}
                                                <div className="bg-white dark:bg-card rounded-2xl border border-border shadow-sm p-5 sm:p-6 hover:shadow-md transition-all group overflow-hidden relative">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                                                            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                                                        </div>
                                                        <span className="text-xs sm:text-sm font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded-lg uppercase">Prepaid</span>
                                                    </div>
                                                    <h3 className="text-base sm:text-lg font-black text-foreground group-hover:text-primary transition-colors">Payments & Wallet</h3>
                                                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 mb-5 sm:mb-6">Manage transaction history and credit limits.</p>
                                                    <button onClick={() => setActiveTab("payments")} className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest group/btn">
                                                        View Balance <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                    </button>
                                                </div>

                                                {/* Summary Card 5: Notifications */}
                                                <div className="bg-white dark:bg-card rounded-2xl border border-border shadow-sm p-5 sm:p-6 hover:shadow-md transition-all group overflow-hidden relative">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                                                            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                                                        </div>
                                                        <span className={`text-xs sm:text-sm font-black px-2 py-0.5 rounded-lg uppercase ${unreadCount > 0 ? 'text-amber-600 bg-amber-100' : 'text-slate-600 bg-slate-100'}`}>
                                                            {unreadCount > 0 ? `${unreadCount} New` : "All Read"}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-base sm:text-lg font-black text-foreground group-hover:text-primary transition-colors">Alert Matrix</h3>
                                                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 mb-5 sm:mb-6">Critical market alerts and inquiry status updates.</p>
                                                    <button onClick={() => setActiveTab("notifications")} className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest group/btn">
                                                        Check Node Notifications <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                    </button>
                                                </div>

                                                {/* Summary Card 6: Help Center */}
                                                <div className="bg-white dark:bg-card rounded-2xl border border-border shadow-sm p-5 sm:p-6 hover:shadow-md transition-all group overflow-hidden relative">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center">
                                                            <LifeBuoy className="w-5 h-5 sm:w-6 sm:h-6" />
                                                        </div>
                                                        <span className="text-xs sm:text-sm font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg uppercase">24/7</span>
                                                    </div>
                                                    <h3 className="text-base sm:text-lg font-black text-foreground group-hover:text-primary transition-colors">Concierge Hub</h3>
                                                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 mb-5 sm:mb-6">Direct access to support and sourcing expertise.</p>
                                                    <Link to="/contact" className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest group/btn">
                                                        Contact Specialist <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                    </Link>
                                                </div>

                                            </div>

                                            {/* Recent Activity / Recommendations Section */}
                                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
                                                {/* Recent Inquiries List */}
                                                <div className="xl:col-span-2 space-y-6">
                                                    <div className="bg-white dark:bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                                                        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-border flex items-center justify-between">
                                                            <h2 className="font-heading font-black text-sm sm:text-base flex items-center gap-2 uppercase tracking-tight">
                                                                <Clock className="w-4 h-4 text-primary" /> Active Requirements
                                                            </h2>
                                                            <Link to="/products" className="text-primary text-[10px] sm:text-xs font-black uppercase tracking-widest hover:underline">Market Hub</Link>
                                                        </div>
                                                        <div className="p-0">
                                                            {allInquiries.length === 0 ? (
                                                                <div className="py-12 text-center text-muted-foreground text-sm font-medium">No active broadcasts. Start sourcing to see updates.</div>
                                                            ) : (
                                                                <div className="divide-y divide-border">
                                                                    {allInquiries.slice(0, 3).map((inquiry) => (
                                                                        <div key={inquiry.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:bg-muted/30 transition-all cursor-pointer group">
                                                                            <div className="flex items-center gap-3.5 min-w-0">
                                                                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-muted/50 flex items-center justify-center text-xl sm:text-2xl group-hover:bg-primary/5 transition-colors shrink-0">🏭</div>
                                                                                <div className="flex-1 min-w-0">
                                                                                    <h4 className="font-bold text-foreground text-xs sm:text-sm group-hover:text-primary transition-colors truncate">{inquiry.productName}</h4>
                                                                                    <p className="text-[11px] sm:text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
                                                                                        <Target className="w-3 h-3 shrink-0" /> Supplier: {inquiry.sellerName || "Direct"}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 border-border/40 pt-2 sm:pt-0">
                                                                                <span className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${inquiry.status === 'new' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                                                                                    }`}>
                                                                                    {inquiry.status}
                                                                                </span>
                                                                                <p className="text-[9px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">{timeAgo(inquiry.updatedAt || inquiry.createdAt)}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button onClick={() => setActiveTab("inquiries")} className="w-full text-center py-3 text-xs font-black text-muted-foreground hover:bg-muted/50 border-t border-border uppercase tracking-[0.2em]">View Analysis Matrix</button>
                                                    </div>
                                                </div>

                                                {/* Quick Performance Card */}
                                                <div className="space-y-6">
                                                    <div className="bg-gradient-to-br from-indigo-900 to-primary rounded-2xl p-5 sm:p-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
                                                        <div className="relative z-10">
                                                            <div className="flex items-center gap-2 text-indigo-200 text-[10px] font-black uppercase tracking-[0.3em] mb-3 sm:mb-4">
                                                                <TrendingUp className="w-4 h-4" /> Market Discovery
                                                            </div>
                                                            <h3 className="text-lg sm:text-xl font-heading font-black mb-2 leading-tight">Identify Your Next Asset Node</h3>
                                                            <p className="text-indigo-100/70 text-xs sm:text-sm mb-5 sm:mb-6 leading-relaxed">System has identified 12 new manufacturers matching your sourcing criteria.</p>
                                                            <Link to="/products"><Button className="w-full rounded-xl h-11 sm:h-12 bg-white text-primary hover:bg-indigo-50 font-black text-xs uppercase tracking-[0.2em] shadow-xl">Explore Hub</Button></Link>
                                                        </div>
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "notifications" && (
                                        <div className="space-y-6 sm:space-y-8">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-card border border-border rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 shadow-sm">
                                                <div>
                                                    <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight">Security & Activity Log</h2>
                                                    <p className="text-[9px] sm:text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1 opacity-60">Real-time node status and transmission updates</p>
                                                </div>
                                                <Button variant="outline" onClick={handleMarkAllRead} className="rounded-xl px-5 h-10 sm:h-12 text-[10px] font-black uppercase tracking-widest border-border self-start sm:self-auto">Clear History</Button>
                                            </div>

                                            <div className="space-y-3 sm:space-y-4">
                                                {notifications.map((n) => (
                                                    <motion.div
                                                        key={n.id}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className={`p-4 sm:p-6 rounded-2xl sm:rounded-[1.5rem] border flex items-start gap-3 sm:gap-5 transition-all ${n.isRead ? 'bg-white dark:bg-card/50 border-border opacity-60' : 'bg-primary/5 border-primary/20 shadow-lg shadow-primary/5'}`}
                                                    >
                                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${n.type === 'ad_reply' ? 'bg-rose-500/10 text-rose-500' : 'bg-primary/10 text-primary'}`}>
                                                            {n.type === 'ad_reply' ? <Target className="w-5 h-5 sm:w-6 sm:h-6" /> : <Bell className="w-5 h-5 sm:w-6 sm:h-6" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                                <h4 className="text-xs sm:text-sm font-black uppercase tracking-tight truncate">{n.title}</h4>
                                                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1 shrink-0">
                                                                    <Clock className="w-3 h-3" /> {new Date(n.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs font-medium text-muted-foreground leading-relaxed">{n.message}</p>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                                {notifications.length === 0 && (
                                                    <div className="py-16 sm:py-24 text-center bg-white dark:bg-card border border-dashed border-border rounded-2xl sm:rounded-[2.5rem]">
                                                        <Bell className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/10 mx-auto mb-4 sm:mb-6" />
                                                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-40 italic">System quiet. No new alerts detected.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "chats" && (
                                        <div className="space-y-4 sm:space-y-8">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                                                <div>
                                                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">Market Comms</h2>
                                                    <p className="text-[10px] sm:text-[11px] text-muted-foreground uppercase font-black tracking-widest mt-1.5 sm:mt-2 opacity-60">Secure direct channel for marketplace negotiations</p>
                                                </div>
                                            </div>
                                            <ChatCore key={targetRoomId || 'default'} initialRoomId={targetRoomId} />
                                        </div>
                                    )}

                                    {activeTab === "inquiries" && (
                                        <div className="bg-white dark:bg-card border border-border rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
                                            <div className="px-5 sm:px-8 py-4 sm:py-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 bg-muted/5">
                                                <div>
                                                    <h2 className="text-lg sm:text-xl font-black text-foreground uppercase tracking-tight">Requirement Analysis Matrix</h2>
                                                    <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5 italic">Real-time tracking of active broadcasts and supplier connections.</p>
                                                </div>
                                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto">
                                                    <div className="relative flex-1 sm:flex-initial">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                        <input type="text" placeholder="FILTER BY ID/ITEM..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2.5 rounded-xl bg-white border border-border outline-none text-[11px] font-black tracking-widest w-full sm:w-64 focus:ring-2 focus:ring-primary/20 transition-all shadow-inner" />
                                                    </div>
                                                    <Button variant="outline" className="rounded-xl border-border h-10 px-4 flex items-center justify-center hover:bg-muted font-bold text-[11px] uppercase tracking-widest">
                                                        <Filter className="w-4 h-4 mr-2" /> Sort
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="p-0">
                                                {allInquiries.length === 0 ? (
                                                    <div className="py-16 sm:py-24 text-center">
                                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                                            <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground/30" />
                                                        </div>
                                                        <h3 className="text-lg sm:text-xl font-black">No Active Broadcasts</h3>
                                                        <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-2 max-w-sm mx-auto px-4">Launch a sourcing requirement to start receiving verified supplier quotes.</p>
                                                        <Link to="/products" className="mt-6 sm:mt-8 inline-block"><Button className="rounded-xl px-8 sm:px-10 h-11 sm:h-12 font-black uppercase tracking-widest gradient-primary text-xs">Explore Industry Hub</Button></Link>
                                                    </div>
                                                ) : (
                                                    <div className="divide-y divide-border">
                                                        {allInquiries.filter(inq => 
                                                            inq.productName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                                            inq.id?.toLowerCase().includes(searchQuery.toLowerCase())
                                                        ).slice(0, inquiryPage * ITEMS_PER_PAGE).map((inquiry) => (
                                                            <div key={inquiry.id} className="p-4 sm:p-6 md:p-8 hover:bg-muted/20 transition-all flex flex-col md:flex-row md:items-center gap-4 sm:gap-6 md:gap-8 group">
                                                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-muted/30 flex items-center justify-center text-4xl sm:text-5xl group-hover:bg-primary/5 transition-all shadow-inner relative overflow-hidden shrink-0">
                                                                    🏭
                                                                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-2.5 sm:mb-3">
                                                                        <div>
                                                                            <h4 className="text-base sm:text-xl font-heading font-black text-foreground group-hover:text-primary transition-colors leading-tight uppercase tracking-tight">{inquiry.productName}</h4>
                                                                            <div className="flex flex-wrap items-center gap-2 mt-1.5 sm:mt-2">
                                                                                <span className="text-[10px] font-black text-muted-foreground bg-muted px-2 py-0.5 rounded uppercase font-mono">NODE_{inquiry.id.slice(0, 8)}</span>
                                                                                <div className="w-1 h-1 rounded-full bg-border hidden sm:block" />
                                                                                <span className="text-[11px] font-bold text-primary italic">{inquiry.sellerName || "Global Broadcast"}</span>
                                                                            </div>
                                                                        </div>
                                                                        <span className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest border self-start sm:self-auto ${inquiry.status === 'new' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                                            }`}>
                                                                            {inquiry.status}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-xs sm:text-sm text-balance text-muted-foreground font-medium leading-relaxed italic line-clamp-2 max-w-4xl">"{inquiry.description || "System broadcast enabled. Technical audit pending for this procurement node."}"</p>
                                                                    <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-4 sm:mt-5 text-[10px] font-black uppercase tracking-widest">
                                                                        <div className="flex items-center gap-1.5 text-muted-foreground opacity-70">
                                                                            <Clock className="w-3.5 h-3.5 text-primary shrink-0" /> Active Since: {new Date(inquiry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                                        </div>
                                                                        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                                                                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> High Trust Link
                                                                        </div>
                                                                        <button onClick={() => handleOpenChat(inquiry)} className="text-indigo-500 hover:underline flex items-center gap-1">
                                                                            <MessageSquare className="w-3.5 h-3.5 shrink-0" /> Comm Channel
                                                                        </button>
                                                                        <Link to={inquiry.productId ? `/products/${inquiry.productId}` : (allProducts.find(p => p.name.toLowerCase() === inquiry.productName.toLowerCase())?.id ? `/products/${allProducts.find(p => p.name.toLowerCase() === inquiry.productName.toLowerCase())?.id}` : '/products')} className="text-primary hover:underline flex items-center gap-1 ml-0 sm:ml-auto">
                                                                            View Data Node <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {allInquiries.length > inquiryPage * ITEMS_PER_PAGE && (
                                                    <button
                                                        onClick={() => setInquiryPage(p => p + 1)}
                                                        className="w-full py-4 text-xs font-black text-primary uppercase tracking-widest hover:bg-muted/50 border-t border-border transition-all"
                                                    >
                                                        Load More Requirements
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "wishlist" && (
                                        <div className="space-y-6 sm:space-y-8">
                                            <div className="bg-white dark:bg-card border border-border rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                                                <div>
                                                    <h2 className="text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight flex items-center gap-2.5 sm:gap-3">
                                                        <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 fill-rose-500 shrink-0" /> Industrial Interest Matrix
                                                    </h2>
                                                    <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1 italic tracking-wide">Monitoring pricing and technical updates for {wishlistedProducts.length} assets.</p>
                                                </div>
                                                <Link to="/products" className="self-start sm:self-auto"><Button variant="outline" className="rounded-xl px-6 sm:px-8 h-10 sm:h-12 border-border font-black text-xs uppercase tracking-widest hover:bg-muted">Market Probe Hub</Button></Link>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                                                {wishlistedProducts.length === 0 ? (
                                                    <div className="col-span-full py-20 sm:py-32 bg-white/50 border rounded-2xl sm:rounded-3xl text-center border-dashed border-border shadow-inner">
                                                        <Heart className="w-16 h-16 text-muted-foreground/10 mx-auto mb-6" />
                                                        <h3 className="text-xl font-bold text-muted-foreground">Matrix Empty</h3>
                                                        <p className="text-sm text-muted-foreground/60 mt-2">Tag industrial products for real-time performance tracking.</p>
                                                    </div>
                                                ) : (
                                                    wishlistedProducts.map((prod) => (
                                                        <motion.div
                                                            key={prod.id}
                                                            variants={itemVariants}
                                                            className="bg-white dark:bg-card rounded-3xl border border-border overflow-hidden shadow-sm group hover:border-primary/40 transition-all duration-500"
                                                        >
                                                            <div className="aspect-[4/3] bg-muted/20 flex items-center justify-center text-[100px] relative overflow-hidden group">
                                                                <span className="group-hover:scale-110 transition-transform duration-700">{prod.image}</span>
                                                                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />

                                                                <button 
                                                                    onClick={() => {
                                                                        removeFromWishlist(user.id, prod.id);
                                                                        setWishlistKey(k => k + 1);
                                                                        toast.success("Removed from wishlist");
                                                                    }}
                                                                    className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-rose-500 hover:scale-110 active:scale-95 transition-all border border-white/50"
                                                                >
                                                                    <Heart className="w-5 h-5 fill-current" />
                                                                </button>

                                                                {prod.verified && (
                                                                    <div className="absolute top-6 left-6 px-3 py-1 bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase flex items-center gap-1.5 shadow-lg border border-white/20">
                                                                        <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="p-6">
                                                                <div className="flex items-center justify-between mb-3 text-[9px] font-black uppercase tracking-[0.2em]">
                                                                    <span className="text-primary">{prod.category}</span>
                                                                    <span className="text-muted-foreground">Market ID: {prod.id.slice(0, 6)}</span>
                                                                </div>
                                                                <h4 className="font-bold text-lg text-foreground leading-tight line-clamp-1 mb-5 group-hover:text-primary transition-colors uppercase tracking-tight">{prod.name}</h4>
                                                                <div className="flex items-center justify-between pt-5 border-t border-border/50">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[10px] font-black text-muted-foreground uppercase opacity-60 mb-0.5">Value</span>
                                                                        <p className="text-2xl font-black text-foreground tabular-nums tracking-tighter">{prod.price}</p>
                                                                    </div>
                                                                    <Link to={`/products/${prod.id}`}>
                                                                        <Button className="rounded-xl px-8 h-12 font-black text-xs uppercase tracking-widest gradient-primary border-none shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                                                                            Inquire
                                                                        </Button>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}

                                     {activeTab === "addresses" && (
                                        <div className="space-y-6 sm:space-y-8">
                                            <div className="bg-white dark:bg-card border border-border rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                                                <div>
                                                    <h2 className="text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight flex items-center gap-2.5 sm:gap-3">
                                                        <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 shrink-0" /> Procurement Hubs
                                                    </h2>
                                                    <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1 italic tracking-wide">Manage shipping nodes and primary delivery locations.</p>
                                                </div>
                                                <Button onClick={() => { setEditingNode(null); setNodeName(""); setNodeAddr(""); setNodeBadge(""); setShowNodeModal(true); }} className="rounded-xl px-6 sm:px-8 h-10 sm:h-12 gradient-primary border-none font-black text-xs uppercase tracking-widest self-start sm:self-auto">+ New Node</Button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                                                {myAddresses.map((hub: any) => (
                                                    <div key={hub.id} className="bg-white dark:bg-card border border-border rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm hover:border-primary/30 transition-all group relative overflow-hidden">
                                                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                                                            <h3 className="text-lg sm:text-xl font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">{hub.name}</h3>
                                                            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-lg border border-emerald-100">{hub.badge}</span>
                                                        </div>
                                                        <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed mb-6 sm:mb-8 flex items-start gap-2">
                                                            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground/30 shrink-0 mt-0.5" />
                                                            {hub.addr}
                                                        </p>
                                                        <div className="flex items-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-border/50">
                                                            <Button onClick={() => handleEditNode(hub)} variant="ghost" className="h-9 sm:h-10 px-4 sm:px-6 font-bold text-xs uppercase tracking-widest">Edit Node</Button>
                                                            <Button onClick={() => setMyAddresses(myAddresses.filter(a => a.id !== hub.id))} variant="ghost" className="h-9 sm:h-10 px-4 sm:px-6 font-bold text-xs uppercase tracking-widest text-rose-500 hover:text-rose-600 hover:bg-rose-50">Remove</Button>
                                                        </div>
                                                        <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                                                            <MapPin className="w-32 h-32" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "payments" && (
                                        <div className="bg-white dark:bg-card border border-border rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] text-center">
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted/30 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                                                <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground/30" />
                                            </div>
                                            <h2 className="text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight mb-2">Coming Soon</h2>
                                            <p className="text-xs sm:text-sm text-muted-foreground font-medium">Payment history and wallet features will be available here.</p>
                                        </div>
                                    )}

                                    {activeTab === "settings" && (
                                        <div className="bg-white dark:bg-card border border-border rounded-3xl p-5 sm:p-8 md:p-16 shadow-sm max-w-5xl relative overflow-hidden">
                                            <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-10 md:gap-14 mb-8 sm:mb-12 md:mb-16 relative z-10 text-center md:text-left">
                                                <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full gradient-primary flex items-center justify-center text-white font-black text-4xl sm:text-5xl md:text-6xl shadow-2xl relative group cursor-pointer border-4 sm:border-8 border-white dark:border-card shrink-0">
                                                    {user.name.charAt(0)}
                                                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Edit2 className="w-6 h-6 sm:w-10 sm:h-10 text-white" />
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-xl sm:rounded-2xl shadow-xl flex items-center justify-center text-primary border border-border">
                                                        <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-3 md:mb-4 uppercase tracking-tighter break-words">{user.name}</h2>
                                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4">
                                                        <div className="flex items-center gap-2.5 sm:gap-3 text-muted-foreground bg-muted/50 px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl font-bold border border-border/30 text-xs sm:text-sm max-w-full truncate">
                                                            <Mail className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary shrink-0" /> <span className="truncate">{user.email}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 sm:gap-3 text-emerald-600 bg-emerald-50 px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl font-black text-[10px] sm:text-[11px] uppercase tracking-widest border border-emerald-100">
                                                            <ShieldCheck className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" /> Identity Authenticated
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
                                                    <label className="text-[10px] sm:text-[11px] font-black text-muted-foreground uppercase tracking-[0.15em] sm:tracking-[0.3em] ml-1 sm:ml-2">Primary Comms Relay</label>
                                                    <div className="relative">
                                                        <input type="email" defaultValue={user.email} disabled className="w-full h-12 sm:h-14 md:h-16 px-4 sm:px-8 rounded-2xl bg-muted/5 border border-transparent outline-none text-xs sm:text-sm font-black text-muted-foreground/50 italic" />
                                                        <div className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 flex items-center gap-1.5 sm:gap-2 text-emerald-500 bg-white px-2 py-1 rounded-lg text-[8px] sm:text-[9px] font-black uppercase tracking-widest border border-border shadow-sm">
                                                            <ShieldCheck className="w-3 h-3 shrink-0" /> Secure Node
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 sm:space-y-3">
                                                    <label className="text-[10px] sm:text-[11px] font-black text-muted-foreground uppercase tracking-[0.15em] sm:tracking-[0.3em] ml-1 sm:ml-2">Secure Contact Relay</label>
                                                    <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" className="w-full h-12 sm:h-14 md:h-16 px-4 sm:px-8 rounded-2xl bg-muted/20 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-xs sm:text-sm font-black text-foreground tracking-tight shadow-inner" />
                                                </div>
                                                <div className="space-y-2 sm:space-y-3">
                                                    <label className="text-[10px] sm:text-[11px] font-black text-muted-foreground uppercase tracking-[0.15em] sm:tracking-[0.3em] ml-1 sm:ml-2">Location / City Base</label>
                                                    <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Pune, Mumbai, etc." className="w-full h-12 sm:h-14 md:h-16 px-4 sm:px-8 rounded-2xl bg-muted/20 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-xs sm:text-sm font-black text-foreground tracking-tight shadow-inner" />
                                                </div>
                                                <div className="space-y-2 sm:space-y-3">
                                                    <label className="text-[10px] sm:text-[11px] font-black text-muted-foreground uppercase tracking-[0.15em] sm:tracking-[0.3em] ml-1 sm:ml-2">Procurement Sector</label>
                                                    <select value={sector} onChange={(e) => setSector(e.target.value)} className="w-full h-12 sm:h-14 md:h-16 px-4 sm:px-8 rounded-2xl bg-muted/20 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-xs sm:text-sm font-black text-foreground cursor-pointer appearance-none shadow-inner">
                                                        <option>Automobile Production & Spares</option>
                                                        <option>Industrial Electronics & Robotics</option>
                                                        <option>Advanced Manufacturing & Textiles</option>
                                                    </select>
                                                </div>

                                                {/* Social Assets Settings Area */}
                                                <div className="md:col-span-2 mt-4 sm:mt-8">
                                                    <Collapsible open={showSocials} onOpenChange={setShowSocials}>
                                                        <CollapsibleTrigger asChild>
                                                            <Button variant="ghost" className="w-full h-auto min-h-[3.5rem] py-3 rounded-2xl border border-dashed border-border flex items-center justify-between px-4 sm:px-8 hover:bg-muted/50 transition-all group gap-3 whitespace-normal">
                                                                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider sm:tracking-widest text-muted-foreground group-hover:text-primary text-left leading-snug flex-1">Social Links & Web Identity Nodes</span>
                                                                <ChevronRight className={`w-5 h-5 shrink-0 transition-transform duration-300 ${showSocials ? 'rotate-90' : ''}`} />
                                                            </Button>
                                                        </CollapsibleTrigger>
                                                        <CollapsibleContent className="space-y-4 sm:space-y-6 pt-6 sm:pt-8">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Official Website</label>
                                                                    <div className="relative">
                                                                        <Globe className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary/40" />
                                                                        <input type="url" placeholder="https://yourcompany.com" value={website} onChange={e => setWebsite(e.target.value)} className="w-full h-12 sm:h-14 pl-11 sm:pl-14 pr-4 sm:pr-6 rounded-2xl bg-muted/20 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-xs sm:text-sm font-bold shadow-inner" />
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">LinkedIn Profile</label>
                                                                    <div className="relative">
                                                                        <Linkedin className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-4.5 sm:h-4.5 text-blue-500/40" />
                                                                        <input type="text" placeholder="username" value={linkedin} onChange={e => setLinkedin(e.target.value)} className="w-full h-12 sm:h-14 pl-11 sm:pl-14 pr-4 sm:pr-6 rounded-2xl bg-muted/20 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-xs sm:text-sm font-bold shadow-inner" />
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Instagram Handle</label>
                                                                    <div className="relative">
                                                                        <Instagram className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-4.5 sm:h-4.5 text-rose-500/40" />
                                                                        <input type="text" placeholder="@username" value={instagram} onChange={e => setInstagram(e.target.value)} className="w-full h-12 sm:h-14 pl-11 sm:pl-14 pr-4 sm:pr-6 rounded-2xl bg-muted/20 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-xs sm:text-sm font-bold shadow-inner" />
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Facebook Page</label>
                                                                    <div className="relative">
                                                                        <Facebook className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-4.5 sm:h-4.5 text-blue-600/40" />
                                                                        <input type="text" placeholder="pagename" value={facebook} onChange={e => setFacebook(e.target.value)} className="w-full h-12 sm:h-14 pl-11 sm:pl-14 pr-4 sm:pr-6 rounded-2xl bg-muted/20 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-xs sm:text-sm font-bold shadow-inner" />
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Threads Profile</label>
                                                                    <div className="relative">
                                                                        <AtSign className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-500/40" />
                                                                        <input type="text" placeholder="@username" value={threads} onChange={e => setThreads(e.target.value)} className="w-full h-12 sm:h-14 pl-11 sm:pl-14 pr-4 sm:pr-6 rounded-2xl bg-muted/20 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-xs sm:text-sm font-bold shadow-inner" />
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">YouTube Channel</label>
                                                                    <div className="relative">
                                                                        <Youtube className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-4.5 sm:h-4.5 text-red-500/40" />
                                                                        <input type="text" placeholder="channel name" value={youtube} onChange={e => setYoutube(e.target.value)} className="w-full h-12 sm:h-14 pl-11 sm:pl-14 pr-4 sm:pr-6 rounded-2xl bg-muted/20 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-xs sm:text-sm font-bold shadow-inner" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CollapsibleContent>
                                                    </Collapsible>
                                                </div>
                                            </div>

                                            <div className="mt-8 sm:mt-14 md:mt-20 pt-6 sm:pt-8 md:pt-10 border-t border-border flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-10 relative z-10 pb-16 md:pb-0">
                                                <div className="flex items-center gap-6 sm:gap-10 opacity-60 flex-wrap md:flex-nowrap w-full lg:w-auto justify-center lg:justify-start">
                                                    <div className="flex flex-col items-center sm:items-start">
                                                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 whitespace-nowrap">Integrity Matrix</span>
                                                        <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase whitespace-nowrap">
                                                            <Shield className="w-4 h-4 shrink-0" /> 256-Bit E2E Node
                                                        </div>
                                                    </div>
                                                    <div className="w-px h-10 bg-border hidden md:block" />
                                                    <div className="flex flex-col items-center sm:items-start">
                                                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 whitespace-nowrap">Active Cluster</span>
                                                        <span className="text-xs font-black text-foreground uppercase tracking-tight whitespace-nowrap">South-Asia Node 01</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full lg:w-auto">
                                                    <Button variant="ghost" onClick={handleDiscard} className="w-full sm:w-auto h-12 px-6 font-bold uppercase tracking-wider text-xs rounded-xl whitespace-nowrap">Discard</Button>
                                                    <Button
                                                        disabled={isUpdating}
                                                        onClick={handleUpdateProfile}
                                                        className="w-full sm:w-auto h-12 px-6 md:px-8 font-bold uppercase tracking-wider text-xs rounded-xl gradient-primary border-none shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95 whitespace-normal sm:whitespace-nowrap text-center overflow-hidden text-ellipsis"
                                                    >
                                                        {isUpdating ? "Synchronizing..." : "Update Command Core"}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}



                                </motion.div>
                            </AnimatePresence>
                        </main>

                    </div>
                </div>
            </div>
            {/* NODE EDIT MODAL */}
            <AnimatePresence>
                {showNodeModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowNodeModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-[#111116] w-full max-w-lg rounded-[3rem] border border-white/10 shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="p-10">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-black uppercase tracking-tight">{editingNode ? "Configure Node" : "Deploy New Node"}</h3>
                                    <button onClick={() => setShowNodeModal(false)} className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2">Node Principal</label>
                                        <input type="text" value={nodeName} onChange={e => setNodeName(e.target.value)} placeholder="e.g. Primary Plant" className="w-full h-14 px-6 rounded-2xl bg-muted/30 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-sm font-black shadow-inner" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2">Location Coordinates</label>
                                        <textarea value={nodeAddr} onChange={e => setNodeAddr(e.target.value)} placeholder="Full address..." className="w-full h-24 py-4 px-6 rounded-2xl bg-muted/30 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-sm font-medium shadow-inner resize-none" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2">Node Badge</label>
                                        <input type="text" value={nodeBadge} onChange={e => setNodeBadge(e.target.value)} placeholder="e.g. Primary, Logistics" className="w-full h-14 px-6 rounded-2xl bg-muted/30 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all text-sm font-black shadow-inner" />
                                    </div>
                                    
                                    <Button onClick={handleSaveNode} className="w-full h-16 mt-4 rounded-2xl gradient-primary font-black uppercase tracking-widest text-white shadow-xl hover:scale-105 active:scale-95 transition-all">
                                        {editingNode ? "Synchronize Updates" : "Deploy Node"}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Layout>
    );
}
