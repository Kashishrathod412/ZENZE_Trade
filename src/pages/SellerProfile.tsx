import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Package,
  Award,
  Zap,
  Mail,
  Phone,
  Globe,
  Activity,
  Star,
  Eye,
  Heart,
  Clock,
  MapPin,
  ArrowRight,
  ArrowLeft,
  BadgeCheck,
  TrendingUp,
  MessageSquare,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Twitter,
  AtSign,
  type LucideIcon,
  Send,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  Quote,
  Loader2,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  getProducts,
  getProductReviews,
  getProductWishlistCount,
  getUsers,
  toggleWishlist,
  isInWishlist,
  getSellerReviews,
  addReview,
  getOrCreateChatRoom,
} from "@/lib/storage";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useState, useMemo, useRef } from "react";
import { ProductShareDialog } from "@/components/products/ProductShareDialog";

/* ─── Certifications ──────────────────────────────────────── */
const CERTS = [
  { label: "Technical ISO 9001",  status: "Verified",  date: "Jan 2024" },
  { label: "Trade Authorization", status: "Active",    date: "Present"  },
  { label: "Plant Audit Hub",     status: "Passed",    date: "Dec 2023" },
  { label: "Zenze Protocol V4.2", status: "Certified", date: "Q2 2026"  },
];

/* ─── Stat card type ──────────────────────────────────────── */
interface StatCard {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bg: string;
}

/* ─── Social link type ────────────────────────────────────── */
interface SocialLink {
  href: string;
  icon: LucideIcon;
  label: string;
  cls: string;
}

export default function SellerProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleStartChat = () => {
    if (!user) {
      toast.error("Please login to start a conversation");
      navigate("/login");
      return;
    }
    if (id) {
      getOrCreateChatRoom(user.id, id, {
        type: "general",
        id: id,
        title: `Chat with Seller`,
      });
      navigate(user.role === 'buyer' ? '/buyer/dashboard' : '/seller/dashboard');
    }
  };

  const exactSeller = getUsers().find((u) => u.id === id);
  const fallbackId = id?.includes("seller-") ? id : `seller-${id}`;
  const seller = exactSeller || getUsers().find((u) => u.id === fallbackId);
  const activeSellerId = seller?.id || id;
  
  const allProducts = useMemo(() => getProducts().filter(
    (p) => p.sellerId === activeSellerId && p.status === "active"
  ), [activeSellerId]);

  // Pagination State
  const [visibleCount, setVisibleCount] = useState(4);
  const [isProductLoading, setIsProductLoading] = useState(false);
  const visibleProducts = useMemo(() => allProducts.slice(0, visibleCount), [allProducts, visibleCount]);
  const hasMoreProducts = allProducts.length > visibleCount;

  const [productsState, setProductsState] = useState(allProducts);
  const [shareDialog, setShareDialog] = useState<{ isOpen: boolean; product: any }>({ isOpen: false, product: null });
  
  // Feedback State
  const [sellerReviews, setSellerReviews] = useState(() => getSellerReviews(activeSellerId!));
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Aggregate Strategy: Direct Seller Reviews + All Product Reviews
  const combinedReviews = useMemo(() => {
    const productReviews = allProducts.flatMap(p => getProductReviews(p.id));
    return [...sellerReviews, ...productReviews];
  }, [sellerReviews, allProducts]);

  const averageRating = useMemo(() => {
    if (combinedReviews.length === 0) return "0.0";
    const sum = combinedReviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / combinedReviews.length).toFixed(1);
  }, [combinedReviews]);

  const loadMoreProducts = () => {
    setIsProductLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 4);
      setIsProductLoading(false);
      toast.info("Industrial Inventory Synced. New nodes active.");
    }, 800);
  };

  const handleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to manage wishlist");
      navigate("/login");
      return;
    }
    const added = toggleWishlist(user.id, productId);
    toast.success(added ? "Added to wishlist" : "Removed from wishlist");
  };

  const scrollReviews = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const submitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Protocol Error: Identity verification required to transmit feedback.");
      navigate("/login");
      return;
    }
    if (rating === 0) {
      toast.error("Protocol Error: Sector rating intensity not specified.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      addReview({
        sellerId: activeSellerId!,
        userId: user.id,
        userName: user.name,
        rating,
        comment,
      });
      setSellerReviews(getSellerReviews(activeSellerId!));
      setRating(0);
      setComment("");
      setIsSubmitting(false);
      toast.success("Feedback Matrix Synced. Mission accomplished.");
    }, 1000);
  };

  /* ── 404 ──────────────────────────────────────────────────── */
  if (!seller) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#F4F7FA] dark:bg-background/95 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-card border border-border rounded-3xl p-12 sm:p-16 text-center max-w-md w-full shadow-xl"
          >
            <div className="w-20 h-20 rounded-2xl bg-muted mx-auto flex items-center justify-center mb-8 rotate-6">
              <Package className="w-10 h-10 text-muted-foreground/20" />
            </div>
            <h1 className="font-heading text-3xl font-black text-foreground mb-3 uppercase tracking-tighter">
              Node Offline
            </h1>
            <p className="text-muted-foreground mb-8 text-sm font-medium">
              The requested seller node is currently decommissioned or does not exist.
            </p>
            <Link to="/products">
              <Button className="rounded-xl px-10 h-12 gradient-primary border-none font-black uppercase tracking-widest text-xs w-full">
                Return to Hub
              </Button>
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  /* ── Stats ────────────────────────────────────────────────── */
  const stats: StatCard[] = [
    { label: "Products",     value: allProducts.length, icon: Package,    color: "text-indigo-500",  bg: "bg-indigo-50 dark:bg-indigo-500/10"  },
    { label: "Rating",       value: `${averageRating} ★`, icon: Star,       color: "text-amber-500",   bg: "bg-amber-50 dark:bg-amber-500/10"    },
    { label: "Response",     value: "< 2 h",          icon: Clock,      color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10"},
    { label: "Active Since", value: "2022",           icon: TrendingUp, color: "text-blue-500",    bg: "bg-blue-50 dark:bg-blue-500/10"      },
  ];

  /* ── Social links logic (Type-Safe) ───────────────────────── */
  const socials: SocialLink[] = [];
  if (seller.website) {
    socials.push({
      href: seller.website, icon: Globe, label: "Website",
      cls: "bg-muted text-foreground hover:bg-foreground hover:text-white border border-border",
    });
  }
  if (seller.socialLinks) {
    const sl = seller.socialLinks;
    if (sl.linkedin) {
      socials.push({ href: `https://linkedin.com/in/${sl.linkedin}`, icon: Linkedin, label: "LinkedIn", cls: "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100" });
    }
    if (sl.instagram) {
      socials.push({ href: `https://instagram.com/${sl.instagram}`, icon: Instagram, label: "Instagram", cls: "bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-100" });
    }
    if (sl.facebook) {
      socials.push({ href: `https://facebook.com/${sl.facebook}`, icon: Facebook, label: "Facebook", cls: "bg-blue-50 text-blue-800 hover:bg-blue-800 hover:text-white border border-blue-200" });
    }
    if (sl.youtube) {
      socials.push({ href: `https://youtube.com/@${sl.youtube}`, icon: Youtube, label: "YouTube", cls: "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100" });
    }
    if (sl.threads) {
      socials.push({ href: `https://threads.net/@${sl.threads}`, icon: AtSign, label: "Threads", cls: "bg-slate-50 text-slate-900 hover:bg-slate-900 hover:text-white border border-slate-200" });
    }
    if (sl.twitter) {
      socials.push({ href: `https://twitter.com/${sl.twitter}`, icon: Twitter, label: "Twitter", cls: "bg-gray-50 text-gray-900 hover:bg-gray-900 hover:text-white border border-gray-200" });
    }
  }

  /* ═══════════════════════ RENDER ═════════════════════════════ */
  return (
    <Layout>
      <div className="min-h-screen bg-[#F4F7FA] dark:bg-background/95">

        {/* ══ PROFILE HEADER ══════ */}
        <div className="bg-white dark:bg-card border-b border-border shadow-sm pt-8 pb-6">
          <div className="container-wide px-4 sm:px-6">
            
            {/* Back Navigation */}
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4 sm:mb-6 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] relative z-20"
            >
              <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              </div>
              Back to Sector
            </motion.button>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* LEFT: avatar + info */}
              <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 text-center sm:text-left">

                {/* Avatar */}
                <div className="relative shrink-0 group">
                  <div className="w-20 h-20 rounded-full gradient-primary p-0.5 shadow-xl group-hover:scale-105 transition-all duration-300">
                    <div className="w-full h-full rounded-full bg-white dark:bg-surface flex items-center justify-center text-primary font-heading font-black text-3xl">
                      {seller.name.charAt(0)}
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success border-2 border-white dark:border-card rounded-full z-10 shadow-lg" />
                </div>

                {/* Name + meta */}
                <div>
                  <h1 className="text-2xl font-heading font-black text-foreground mb-1 flex flex-wrap items-center justify-center sm:justify-start gap-2 leading-tight">
                    {seller.name}
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-lg border border-primary/20 tracking-wider">
                      ProSeller
                    </span>
                    {seller.verified && (
                      <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase rounded-lg border border-emerald-200 dark:border-emerald-500/20 tracking-wider flex items-center gap-1">
                        <BadgeCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </h1>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-muted-foreground text-sm font-medium">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 shrink-0" />
                      {seller.email}
                    </span>
                    <span className="opacity-30 hidden sm:inline">•</span>
                    <span className="font-bold text-foreground text-[13px]">
                      Elite ID: #{seller.id.slice(0, 10).toUpperCase()}
                    </span>
                  </div>

                  {seller.location && (
                    <div className="mt-1.5 flex items-center justify-center sm:justify-start gap-1.5 text-xs text-muted-foreground font-medium">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      {seller.location}
                    </div>
                  )}

                  {socials.length > 0 && (
                    <div className="mt-4">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-2 text-center sm:text-left opacity-60">
                        Social Presence
                      </p>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        {socials.map((s) => (
                          <Tooltip key={s.label}>
                            <TooltipTrigger asChild>
                              <a
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`h-8 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm hover:scale-105 hover:shadow-md active:scale-95 text-[10px] font-black uppercase tracking-widest ${s.cls}`}
                              >
                                <s.icon className="w-3.5 h-3.5" />
                                {s.label}
                              </a>
                            </TooltipTrigger>
                            <TooltipContent className="bg-foreground text-background text-[10px] font-bold uppercase tracking-widest border-none">
                              Visit {s.label}
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: actions */}
              <div className="flex items-center gap-3 shrink-0">
                <Button onClick={handleStartChat} className="rounded-xl px-7 h-12 bg-white text-black hover:bg-gray-100 border border-border font-bold text-[13px] uppercase tracking-wider shadow-sm hover:scale-[1.03] active:scale-95 transition-all gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Direct Message
                </Button>
                <Link to={`/inquiry?seller=${seller.id}`}>
                  <Button className="rounded-xl px-7 h-12 gradient-primary border-none font-bold text-[13px] uppercase tracking-wider relative overflow-hidden group shadow-lg shadow-primary/20 hover:scale-[1.03] active:scale-95 transition-all">
                    <span className="relative z-10 flex items-center gap-2">
                      Request Quote
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ══ MAIN CONTENT ═════════ */}
        <div className="container-wide px-4 sm:px-6 py-2">

          {/* ── Stats row ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 my-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className="bg-white dark:bg-card rounded-2xl border border-border shadow-sm p-5 flex items-center gap-4 hover:shadow-md hover:border-primary/20 transition-all group cursor-default"
              >
                <div className={`w-11 h-11 rounded-xl ${s.bg} ${s.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <p className="text-xl font-black text-foreground tabular-nums leading-none">
                    {s.value}
                  </p>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                    {s.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Products grid ── */}
          <section className="bg-white dark:bg-card/40 rounded-3xl p-5 border border-border shadow-sm mb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
              <div>
                <div className="flex items-center gap-2 text-primary font-black text-[11px] uppercase tracking-[0.4em] mb-2">
                  <Activity className="w-4 h-4" />
                  Live Inventory
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tighter uppercase leading-tight">
                  Asset Matrix
                  <span className="ml-3 text-sm font-black text-muted-foreground bg-muted px-3 py-1 rounded-xl align-middle">
                    {visibleProducts.length} / {allProducts.length} Units
                  </span>
                </h2>
              </div>
              {hasMoreProducts && (
                <Button 
                  onClick={loadMoreProducts}
                  variant="outline" 
                  className="rounded-2xl px-8 h-12 font-black text-xs uppercase tracking-widest group border-2 border-border hover:border-primary hover:bg-primary/5 hover:text-primary transition-all duration-300 gap-2"
                >
                  {isProductLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      View More Products
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              )}
            </div>

            {allProducts.length === 0 ? (
              <div className="bg-white dark:bg-card border-2 border-dashed border-border rounded-3xl py-24 text-center">
                <Package className="w-14 h-14 text-muted-foreground/10 mx-auto mb-5" />
                <p className="text-lg font-black text-muted-foreground uppercase tracking-widest">
                  No Active Products
                </p>
                <p className="text-sm text-muted-foreground mt-2 italic">
                  This seller has no active listings at this time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {visibleProducts.map((p, idx) => {
                  const pReviews = getProductReviews(p.id);
                  const pRating = pReviews.length > 0
                    ? (pReviews.reduce((s, r) => s + r.rating, 0) / pReviews.length).toFixed(1)
                    : "4.8";
                  const wishlistCount = getProductWishlistCount(p.id) || 0;
                  const viewsCount = p.views || 0;

                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05, duration: 0.4 }}
                      className="group flex flex-col h-full bg-white dark:bg-card rounded-3xl border border-border/60 overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 shadow-sm"
                    >
                      <Link
                        to={`/products/${p.id}`}
                        className="flex flex-col h-full"
                      >
                        {/* Image */}
                        <div className="relative aspect-[14/10] bg-muted overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center text-6xl bg-gradient-to-br from-muted to-muted/50 group-hover:scale-110 transition-transform duration-700 ease-out">
                            <span className="opacity-80 drop-shadow-sm transform group-hover:-rotate-3 transition-transform duration-500">
                              {p.image}
                            </span>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />



                          <div className="absolute top-3 right-3 z-30">
                            <button
                              onClick={(e) => handleWishlist(e, p.id)}
                              className={`w-10 h-10 rounded-[1.2rem] flex items-center justify-center transition-all duration-500 shadow-xl backdrop-blur-md border hover:scale-110 active:scale-95 ${user && isInWishlist(user.id, p.id) ? 'bg-destructive text-white border-destructive shadow-destructive/20' : 'bg-white/90 text-muted-foreground border-border/20 hover:text-destructive hover:bg-white'}`}
                            >
                              <Heart className={`w-5 h-5 ${user && isInWishlist(user.id, p.id) ? 'fill-current' : ''}`} />
                            </button>
                          </div>

                          <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
                            <div className="rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-widest shadow-xl bg-primary text-white flex items-center gap-2">
                              View Product <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>

                        {/* Body */}
                        <div className="p-4 sm:p-5 flex flex-col flex-1 relative z-10 bg-card">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-md truncate max-w-[45%]">
                              {p.category}
                            </span>
                            <div className="flex items-center gap-2.5 text-xs font-bold text-muted-foreground">
                              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-accent text-accent" /> {pRating}</span>
                              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {viewsCount}</span>
                              <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-500 fill-red-500/20" /> {wishlistCount}</span>
                            </div>
                          </div>

                          <h3 className="font-heading font-extrabold text-base md:text-lg text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors mb-3">
                            {p.name}
                          </h3>

                          <div className="flex-1" />

                          <div className="flex items-end justify-between pt-4 border-t border-border/50 mb-4">
                            <div>
                              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5 opacity-80">Price</p>
                              <p className="font-heading text-2xl font-black text-foreground leading-none">{p.price.startsWith("₹") ? p.price : `₹${p.price}`}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5 opacity-80">MOQ</p>
                              <p className="text-sm font-bold text-foreground bg-muted px-2.5 py-1 rounded-md inline-block">{p.moq}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                              {(p.sellerName || "U").substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-sm font-bold text-foreground truncate">{p.sellerName || "Unknown Seller"}</p>
                                {p.verified && <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium uppercase tracking-wider opacity-80">
                                <MapPin className="w-3 h-3" /> {(p.location || "India").split(",")[0]}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>

          {/* ── Footer Sections ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
            <div className="lg:col-span-2 flex flex-col gap-5">
              {/* Sector Feedback Protocol (Reviews) */}
              <div className="bg-white dark:bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                      <Star className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-foreground uppercase tracking-tighter leading-none">Sector Feedback Protocol</h2>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">Verified Industrial Intelligence ({combinedReviews.length} Points)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-3xl font-black text-foreground leading-none">{averageRating} ★</div>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1">Weighted Industrial Index</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <Button onClick={() => scrollReviews('left')} variant="outline" size="icon" className="w-8 h-8 rounded-full border-border hover:bg-muted"><ChevronLeft className="w-4 h-4" /></Button>
                       <Button onClick={() => scrollReviews('right')} variant="outline" size="icon" className="w-8 h-8 rounded-full border-border hover:bg-muted"><ChevronRight className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                   {/* Reviews Horizontal Slider (Google Style) */}
                   <div className="mb-12 relative">
                     {combinedReviews.length === 0 ? (
                       <div className="bg-muted/20 border-2 border-dashed border-border rounded-3xl py-16 text-center">
                         <Activity className="w-12 h-12 mx-auto mb-4 text-muted-foreground/10" />
                         <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">No Node Intelligence Logged Yet</p>
                         <p className="text-[10px] text-muted-foreground/30 uppercase mt-2">Waiting for first authorized transmission...</p>
                       </div>
                     ) : (
                       <div 
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto gap-5 pb-6 snap-x no-scrollbar"
                       >
                         {combinedReviews.map((rev) => (
                           <motion.div
                             key={rev.id}
                             initial={{ opacity: 0, scale: 0.9 }}
                             animate={{ opacity: 1, scale: 1 }}
                             className="min-w-[320px] max-w-[320px] snap-center p-6 rounded-[2rem] bg-white dark:bg-surface border border-border shadow-[0_15px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-primary/20 transition-all flex flex-col relative group"
                           >
                             <Quote className="absolute top-6 right-6 w-8 h-8 text-muted-foreground/5 group-hover:text-primary/10 transition-colors" />
                             <div className="flex items-center gap-3 mb-5">
                               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-indigo-500/10 flex items-center justify-center text-primary border border-primary/20">
                                 <UserIcon className="w-5 h-5" />
                               </div>
                               <div>
                                 <p className="text-sm font-black tracking-tight text-foreground truncate max-w-[150px]">{rev.userName}</p>
                                 <div className="flex items-center gap-0.5 text-amber-500">
                                   {[...Array(5)].map((_, i) => (
                                     <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'opacity-20'}`} />
                                   ))}
                                 </div>
                               </div>
                             </div>
                             <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4 italic mb-4">"{rev.comment}"</p>
                             <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                               <div className="flex flex-col">
                                 <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">{new Date(rev.createdAt).toLocaleDateString()}</span>
                                 {rev.productId && <span className="text-[8px] font-bold text-primary/60 uppercase">Product Review</span>}
                               </div>
                               <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 text-[8px] font-black uppercase rounded border border-emerald-100 tracking-tighter">Verified Node</span>
                             </div>
                           </motion.div>
                         ))}
                       </div>
                     )}
                   </div>

                   {/* Add Feedback Form */}
                   <form onSubmit={submitFeedback} className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] dark:from-card dark:to-card/50 border border-border relative overflow-hidden group shadow-inner">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] group-hover:bg-primary/10 transition-colors pointer-events-none" />
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                        <div>
                          <h3 className="text-sm font-black text-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-primary" /> Transmit Direct Node Intelligence
                          </h3>
                          <p className="text-[10px] text-muted-foreground font-medium mt-1">Your direct feedback recalibrates the global industrial trust index.</p>
                        </div>
                        <div className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-black/20 rounded-2xl border border-border shadow-sm">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setRating(s)}
                              onMouseEnter={() => setRating(s)}
                              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                rating >= s ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "bg-transparent text-muted-foreground/30 hover:text-amber-500"
                              }`}
                            >
                              <Star className={`w-5 h-5 ${rating >= s ? "fill-current" : ""}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-5">
                        <div className="relative">
                          <textarea
                            placeholder="Describe your technical experience with this seller node..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-6 rounded-3xl border border-border bg-white dark:bg-background focus:ring-8 focus:ring-primary/5 focus:border-primary/50 outline-none text-sm font-medium transition-all min-h-[140px] shadow-sm resize-none"
                          />
                          <div className="absolute bottom-4 right-6 text-[10px] font-black text-muted-foreground/20 uppercase tracking-widest pointer-events-none">
                            Authorized Bypass 4.2
                          </div>
                        </div>
                        <Button
                          disabled={isSubmitting || rating === 0}
                          className="w-full h-16 rounded-2xl gradient-primary text-white font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all gap-3 relative overflow-hidden"
                        >
                          <span className="relative z-10 flex items-center gap-3">
                            {isSubmitting ? "Syncing Network..." : "Initiate Signal Transmit"}
                            <Send className="w-4 h-4" />
                          </span>
                          <motion.div 
                            className="absolute inset-0 bg-white/20"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          />
                        </Button>
                      </div>
                   </form>
                </div>
              </div>
            </div>

            {/* Contact + Comms */}
            <div className="flex flex-col gap-4">
              <div className="bg-white dark:bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center gap-3 bg-muted/5">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Zap className="w-4 h-4" /></div>
                  <h2 className="text-sm font-black text-foreground uppercase tracking-wide">Secure Comms</h2>
                </div>
                <div className="p-5 space-y-3">
                  <a href={`mailto:${seller.email}`} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 hover:bg-primary/5 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all"><Mail className="w-4 h-4" /></div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-60 mb-0.5">Email</p>
                      <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">{seller.email}</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-transparent">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0"><Phone className="w-4 h-4" /></div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-60 mb-0.5">Phone</p>
                      <p className="text-sm font-bold text-foreground">{seller.phone || "+91 90000 00000"}</p>
                    </div>
                  </div>
                  {seller.website && (
                    <a href={seller.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 hover:bg-blue-50 transition-all group">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-all"><Globe className="w-4 h-4" /></div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-60 mb-0.5">Website</p>
                        <p className="text-sm font-bold text-foreground truncate">{seller.website.replace(/^https?:\/\//, "")}</p>
                      </div>
                    </a>
                  )}
                  {socials.filter(s => s.label !== "Website").length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                       {socials.filter(s => s.label !== "Website").map((s) => (
                        <Tooltip key={`c-${s.label}`}>
                          <TooltipTrigger asChild>
                            <a href={s.href} target="_blank" rel="noopener noreferrer" className={`p-3 rounded-xl flex items-center gap-3 transition-all border border-transparent bg-muted/20 hover:bg-muted/40`}>
                              <s.icon className="w-4 h-4" />
                              <span className="text-[10px] font-black uppercase tracking-widest leading-none">{s.label}</span>
                            </a>
                          </TooltipTrigger>
                          <TooltipContent className="bg-foreground text-background text-[10px] font-bold uppercase tracking-widest border-none">Official {s.label}</TooltipContent>
                        </Tooltip>
                       ))}
                    </div>
                  )}
                </div>
              </div>

               {/* Direct Inquiry CTA */}
               <Link to={`/inquiry?seller=${seller.id}`} className="block bg-gradient-to-br from-[#1e1b4b] to-primary rounded-3xl p-8 text-white shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all group overflow-hidden relative border border-white/10">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-white/50 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                      <MessageSquare className="w-4 h-4" /> Secure Communication
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-3 leading-none text-white">Strategic Bridge</h3>
                    <p className="text-white/60 text-xs font-medium leading-relaxed mb-6">
                      Initiate direct pricing from {seller.name}.
                    </p>
                  <div className="h-12 w-full bg-white text-primary rounded-xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em] group-hover:bg-accent group-hover:text-white transition-all shadow-xl shadow-black/20 shrink-0">
                    Initiate Signal <ArrowRight className="w-4 h-4 group-hover:translate-x-1" />
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
              </Link>
            </div>
          </div>

          {/* ── Certifications Section (Full Width) ── */}
          <div className="mb-8">
            <div className="bg-white dark:bg-card border border-border rounded-[2.5rem] shadow-sm overflow-hidden h-fit">
              <div className="px-10 py-6 border-b border-border flex items-center justify-between bg-muted/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[1.2rem] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-inner">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-foreground uppercase tracking-tight leading-none">Sector Verification Hub</h2>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] mt-1.5 opacity-60">Global Industrial Compliance Grid</p>
                  </div>
                </div>
                <div className="px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-emerald-500/20">
                  <ShieldCheck className="w-4 h-4" /> Node Verified
                </div>
              </div>
              <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {CERTS.map((doc) => (
                  <div key={doc.label} className="p-6 rounded-[2rem] bg-[#f8fafc] dark:bg-white/[0.03] border border-border hover:border-emerald-500/30 hover:bg-white dark:hover:bg-emerald-500/5 transition-all flex items-start gap-5 group shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform shadow-sm">
                      <BadgeCheck className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-1.5">{doc.status}</p>
                      <p className="text-base font-black text-foreground uppercase tracking-tight leading-tight group-hover:text-emerald-600 transition-colors">{doc.label}</p>
                      <p className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-2">{doc.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center py-4 border-t border-border/30 opacity-60">
            <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.5em] mb-0.5 font-heading">ZENZETRADE HUB UNIT 01</p>
            <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest italic">Global Protocol Verified Q2 2026</p>
          </div>
        </div>
      </div>

      {shareDialog.product && (
        <ProductShareDialog
          isOpen={shareDialog.isOpen}
          onClose={() => setShareDialog({ ...shareDialog, isOpen: false })}
          product={shareDialog.product}
          onShareComplete={() => setProductsState([...getProducts().filter(p => p.sellerId === activeSellerId! && p.status === "active")])}
        />
      )}
    </Layout>
  );
}
