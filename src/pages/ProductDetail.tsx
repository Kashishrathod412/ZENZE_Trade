import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Star, ShieldCheck, MapPin, Send, Minus, Plus, Heart, Eye, MessageSquare, Box, Truck, Award, ChevronRight, ChevronLeft, Share2, Sparkles, Quote, ThumbsUp, Calendar, Info, Store, BadgeCheck, Globe, ArrowLeft, Zap } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProducts, incrementViews, getProductReviews, addReview, toggleWishlist, isInWishlist, getProductWishlistCount, getUsers, getReviews, incrementShares, getOrCreateChatRoom } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ProductCard } from "@/components/products/ProductCard";

import { ProductShareDialog } from "@/components/products/ProductShareDialog";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [qty, setQty] = useState(1);
  const [product, setProduct] = useState(() => getProducts().find(p => p.id === id));
  const [reviews, setReviews] = useState(() => getProductReviews(id || ""));
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [reviewSliderRef, setReviewSliderRef] = useState<HTMLDivElement | null>(null);
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const globalReviews = useMemo(() => getReviews(), []);
  const displayReviews = useMemo(() => {
    return reviews.length > 0 ? reviews : globalReviews.slice(0, 5);
  }, [reviews, globalReviews]);
  const isUsingFallback = reviews.length === 0 && displayReviews.length > 0;

  // Handle scroll to update active dot
  useEffect(() => {
    if (!reviewSliderRef) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = reviewSliderRef;
      if (scrollWidth <= clientWidth) {
        setActiveSlideIndex(0);
        return;
      }
      const scrollAmount = clientWidth > 600 ? 500 : 320;
      const index = Math.round(scrollLeft / scrollAmount);
      setActiveSlideIndex(index);
    };

    reviewSliderRef.addEventListener('scroll', handleScroll);
    return () => reviewSliderRef.removeEventListener('scroll', handleScroll);
  }, [reviewSliderRef]);

  useEffect(() => {
    if (!reviewSliderRef || displayReviews.length < 2 || isSliderHovered) return;

    const interval = setInterval(() => {
      if (reviewSliderRef) {
        const { scrollLeft, scrollWidth, clientWidth } = reviewSliderRef;
        const maxScroll = scrollWidth - clientWidth;

        // Only auto-scroll if there is actually content to scroll to
        if (maxScroll > 10) {
          if (scrollLeft >= maxScroll - 50) {
            reviewSliderRef.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            // Scroll by a proportional amount of the viewport for better UX
            const scrollAmount = clientWidth > 600 ? 500 : 320;
            reviewSliderRef.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
        }
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [reviewSliderRef, displayReviews.length, isSliderHovered]);

  useEffect(() => {
    setQty(1);
  }, [id]);

  // Review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  const allProducts = useMemo(() => getProducts(), []);
  const seller = useMemo(() => {
    if (!product) return null;
    return getUsers().find(u => u.id === product.sellerId) || null;
  }, [product]);

  const handleStartChat = () => {
    if (!user) {
        toast.error("Please login to initiate secure comms");
        navigate("/login");
        return;
    }
    if (product) {
        getOrCreateChatRoom(user.id, product.sellerId);
        navigate(user.role === 'buyer' ? '/buyer/dashboard' : '/seller/dashboard');
    }
  };

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  }, [allProducts, product]);

  useEffect(() => {
    if (id) {
      incrementViews(id);
      const found = getProducts().find(p => p.id === id);
      setProduct(found);
      setWishlistCount(getProductWishlistCount(id));
      window.scrollTo(0, 0);
    }
  }, [id]);

  useEffect(() => {
    if (user && id) setWishlisted(isInWishlist(user.id, id));
  }, [user, id]);

  if (!product) {
    return (
      <Layout>
        <div className="container-wide py-40 text-center">
          <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center mb-6">
            <Box className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">The requested industrial asset is currently unavailable in the matrix.</p>
          <Link to="/products"><Button variant="hero" className="rounded-xl px-10 h-14">Return to Search</Button></Link>
        </div>
      </Layout>
    );
  }

  const avgRating = displayReviews.length > 0
    ? (displayReviews.reduce((sum, r) => sum + r.rating, 0) / displayReviews.length).toFixed(1)
    : "4.8";

  const handleWishlist = () => {
    if (!user) { toast.error("Please login to add to wishlist"); navigate("/login"); return; }
    const added = toggleWishlist(user.id, product.id);
    setWishlisted(added);
    setWishlistCount(getProductWishlistCount(product.id));
    toast.success(added ? "Added to wishlist" : "Removed from wishlist");
  };

  const handleShare = () => {
    setShareDialogOpen(true);
  };

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please login to write a review"); navigate("/login"); return; }
    if (!reviewComment.trim()) { toast.error("Please provide validation feedback"); return; }
    addReview({ productId: product.id, userId: user.id, userName: user.name, rating: reviewRating, comment: reviewComment });
    setReviews(getProductReviews(product.id));
    setReviewComment("");
    setShowReviewForm(false);
    toast.success("Industrial validation submitted!");
  };

  return (
    <Layout>
      <ProductShareDialog isOpen={shareDialogOpen} onClose={() => setShareDialogOpen(false)} product={product} />
      <div className="bg-[#f1f3f6] dark:bg-background min-h-screen pb-20 font-sans">
        <div className="bg-white dark:bg-card border-b border-border/50 sticky top-0 z-[40]">
          <div className="container-wide py-3 flex items-center justify-between">
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 px-4 py-2 bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/40 rounded-full text-xs font-black text-primary transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              BACK TO SECTOR
            </motion.button>

            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/products" className="hover:text-primary transition-colors">Industrial Hub</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground/60 truncate">{product.name}</span>
            </div>
          </div>
        </div>

        <div className="container-wide mt-4">
          <div className="bg-white dark:bg-card rounded-sm shadow-sm p-4 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">

              {/* Image Gallery Column */}
              <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-28 z-30">
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Thumbnails Sidebar */}
                    <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible no-scrollbar gap-2 order-2 md:order-1 max-w-full pb-2 md:pb-0">
                      {product.images && product.images.length > 0 ? (
                        product.images.map((img, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => setSelectedImageIdx(idx)}
                            className={`w-16 h-16 rounded border p-1 cursor-pointer hover:border-primary transition-all shrink-0 ${idx === selectedImageIdx ? 'border-primary border-2' : 'border-border'}`}
                          >
                            <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover rounded-sm" />
                          </div>
                        ))
                      ) : (
                        [1, 2, 3, 4].map((i, idx) => (
                          <div 
                            key={i} 
                            onClick={() => setSelectedImageIdx(idx)}
                            className={`w-16 h-16 rounded border p-1 cursor-pointer hover:border-primary transition-all shrink-0 ${idx === selectedImageIdx ? 'border-primary border-2' : 'border-border'}`}
                          >
                            <div className="w-full h-full bg-muted/20 flex items-center justify-center text-xl rounded-sm">{product.image}</div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Main Image View */}
                    <div className="flex-1 order-1 md:order-2 border border-border/50 rounded-sm relative group overflow-hidden bg-white flex items-center justify-center">
                      <motion.div
                        key={`${id}-${selectedImageIdx}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full h-full flex items-center justify-center aspect-[4/5] md:aspect-square cursor-zoom-in"
                      >
                        {product.images && product.images.length > 0 ? (
                           <img src={product.images[selectedImageIdx]} alt={product.name} className="w-full h-full object-cover rounded-sm transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                           <span className="text-[10rem] md:text-[12rem] drop-shadow-2xl transform transition-transform duration-500 group-hover:scale-110">{product.image}</span>
                        )}
                      </motion.div>

                      {/* Share & Wishlist Overlay */}
                      <div className="absolute top-4 right-4 flex flex-col gap-3">
                        <button onClick={handleWishlist} className={`p-4 rounded-full shadow-2xl border border-border/20 transition-all duration-300 hover:scale-110 active:scale-95 ${wishlisted ? 'bg-destructive text-white shadow-destructive/30' : 'bg-white/90 backdrop-blur-sm text-muted-foreground hover:text-destructive hover:bg-white'}`}>
                          <Heart className={`w-6 h-6 ${wishlisted ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Verified Badge - Top Left position for maximum visibility */}
                      <div className="absolute top-4 left-4 z-20 bg-success/90 backdrop-blur text-white px-3 py-1.5 rounded-sm text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xl">
                        <ShieldCheck className="w-4 h-4" /> 100% ASSURED ASSET
                      </div>
                    </div>
                  </div>

                  {/* Desktop Buttons - Aligned under the main image + thumbnails */}
                  <div className="hidden lg:flex gap-4">
                    <Link to={`/inquiry/${product.id}`} className="flex-1">
                      <Button variant="hero" className="w-full h-14 rounded-sm font-black text-xs uppercase tracking-widest bg-[#fb641b] hover:bg-[#fb641b]/90 border-none shadow-lg hover:translate-y-[-2px] transition-all flex items-center justify-center">
                        <Send className="w-5 h-5 mr-2" /> BUY / INQUIRE NOW
                      </Button>
                    </Link>
                    <Button onClick={handleStartChat} variant="outline" className="h-14 rounded-sm font-black text-xs uppercase tracking-widest border-2 hover:bg-primary/5 hover:text-primary transition-all flex items-center justify-center">
                        <Zap className="w-5 h-5 mr-2" /> CHAT WITH SELLER
                    </Button>
                  </div>
                </div>
              </div>

              {/* Product Info Column */}
              <div className="lg:col-span-7 xl:col-span-7">
                {/* Stats Bar - At the very top */}
                <div className="flex items-center justify-end gap-5 pb-4 mb-4 border-b border-border/40">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                      <Eye className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-foreground leading-none">{product.views || 0}</span>
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Views</span>
                    </div>
                  </div>
                  <div className="w-px h-5 bg-border/40" />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-destructive/5 flex items-center justify-center">
                      <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'text-destructive fill-destructive' : 'text-muted-foreground/40'}`} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-foreground leading-none">{wishlistCount}</span>
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Likes</span>
                    </div>
                  </div>
                  <div className="w-px h-5 bg-border/40" />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/5 flex items-center justify-center">
                      <Share2 className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-foreground leading-none">{product.shares || 0}</span>
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Shares</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1 mb-4">
                  <span className="text-primary font-black text-xs uppercase tracking-[0.2em]">{product.category}</span>
                  <h1 className="text-xl lg:text-3xl font-black text-foreground leading-tight tracking-tight">{product.name} - Premium Industrial Node</h1>

                  {seller && (
                    <div className="flex items-center gap-2 mt-1">
                      <Link to={`/seller/${seller.id}`} className="text-primary font-black text-sm hover:underline flex items-center gap-1.5 uppercase tracking-wide">
                        {seller.name} Hub
                        <BadgeCheck className="w-4 h-4 text-emerald-500" />
                      </Link>
                      <span className="text-muted-foreground/30 text-lg">|</span>
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Verified Zenze Vendor</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1 bg-success text-white px-2 py-0.5 rounded-sm text-xs font-bold leading-none">
                      {avgRating} <Star className="w-3 h-3 fill-current" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{reviews.length} Ratings & {reviews.length} Reviews</span>
                    <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                    <span className="flex items-center gap-1 text-sm font-black text-primary italic uppercase tracking-tighter">
                      <ShieldCheck className="w-4 h-4" /> TRADETRUST Verified
                    </span>
                  </div>
                </div>

                {/* Price Section */}
                <div className="flex flex-col gap-1 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl lg:text-4xl font-bold">{product.price}</span>
                    <span className="text-base text-muted-foreground line-through opacity-60">₹{parseInt(product.price.replace(/[^0-9]/g, "")) ? (parseInt(product.price.replace(/[^0-9]/g, "")) * 1.25).toLocaleString() : "45,000"}</span>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <Button variant="outline" size="icon" className={`rounded-xl h-12 w-12 border-2 transition-all duration-300 ${wishlisted ? 'border-destructive bg-destructive/10 text-destructive scale-105' : 'border-border hover:border-destructive hover:text-destructive'}`} onClick={handleWishlist}>
                      <Heart className={`w-6 h-6 ${wishlisted ? "fill-current" : ""}`} />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-xl h-12 w-12 border-2 border-border hover:border-primary hover:text-primary transition-all duration-300" onClick={handleShare}>
                      <Share2 className="w-6 h-6" />
                    </Button>
                  </div>
                  <span className="text-success font-bold text-lg">25% off</span>
                  <p className="text-xs font-medium text-muted-foreground">+ ₹99 Secured Packing Fee</p>
                </div>

                {/* Offers Section */}
                {product.offers && product.offers.length > 0 && (
                  <div className="bg-white border rounded-sm p-4 mb-8 space-y-3 shadow-sm">
                    <p className="font-bold text-sm uppercase">Available offers</p>
                    <div className="flex flex-col gap-2">
                      {product.offers.map((offer, i) => (
                        <div key={i} className="flex gap-2 text-sm">
                          <div className="text-success mt-1 flex-shrink-0"><ShieldCheck className="w-4 h-4 fill-current" /></div>
                          <p className="text-foreground/80 leading-relaxed font-medium">{offer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Delivery & Warranty Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10 py-6 border-y border-border/50">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Truck className="w-5 h-5" />
                      <span className="text-xs font-black uppercase tracking-widest leading-none opacity-60">Shipping</span>
                    </div>
                    <p className="text-sm font-black">{product.shipping || "Fast Global Deployment"}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Award className="w-5 h-5" />
                      <span className="text-xs font-black uppercase tracking-widest leading-none opacity-60">Warranty</span>
                    </div>
                    <p className="text-sm font-black">{product.warranty || "12 Month Coverage"}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <ShieldCheck className="w-5 h-5" />
                      <span className="text-xs font-black uppercase tracking-widest leading-none opacity-60">Security</span>
                    </div>
                    <p className="text-sm font-black">{product.security || "Trade-Escrow Protection"}</p>
                  </div>
                </div>

                {/* Tabs / Detailed Sections */}
                <div className="mt-8">
                  <Tabs defaultValue="product" className="w-full">
                    <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b border-border/60 rounded-none gap-8 overflow-x-auto no-scrollbar pb-px mb-8">
                      <TabsTrigger value="seller-contact" className="px-0 py-4 h-auto bg-transparent border-none rounded-none text-muted-foreground font-black text-xs uppercase tracking-widest data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary transition-all">
                        Company & Contact
                      </TabsTrigger>
                      <TabsTrigger value="seller-about" className="px-0 py-4 h-auto bg-transparent border-none rounded-none text-muted-foreground font-black text-xs uppercase tracking-widest data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary transition-all">
                        About Company
                      </TabsTrigger>
                      <TabsTrigger value="product" className="px-0 py-4 h-auto bg-transparent border-none rounded-none text-muted-foreground font-black text-xs uppercase tracking-widest data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary transition-all">
                        Product Specifications
                      </TabsTrigger>
                    </TabsList>

                    {/* Tab 1: Company & Contact */}
                    <TabsContent value="seller-contact" className="mt-0 focus-visible:outline-none">
                      {seller ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                          <div className="bg-white dark:bg-card border border-border/60 rounded-sm p-8 shadow-sm">
                            <div className="flex items-center gap-5 mb-8">
                              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-3xl shrink-0 uppercase border border-primary/20">
                                {seller.name.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-xl md:text-2xl font-black text-foreground flex flex-wrap items-center gap-2 mb-1">
                                  {seller.name}
                                  {seller.verified && <BadgeCheck className="w-5 h-5 text-emerald-500 shrink-0" />}
                                </h3>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Authorized Enterprise Node</p>
                              </div>
                            </div>

                            <div className="space-y-5">
                              <div className="flex items-center gap-4 text-foreground/80">
                                <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0"><Store className="w-5 h-5" /></div>
                                <div>
                                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-50 mb-0.5">Sourcing Sector</p>
                                  <p className="text-sm font-bold">{seller.category || "General Industry"}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-foreground/80">
                                <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0"><MapPin className="w-5 h-5" /></div>
                                <div>
                                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-50 mb-0.5">Global Presence</p>
                                  <p className="text-sm font-bold">{seller.location || "Multiple Regions"}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-foreground/80">
                                <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0"><Calendar className="w-5 h-5" /></div>
                                <div>
                                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-50 mb-0.5">Operating Since</p>
                                  <p className="text-sm font-bold">{new Date(seller.createdAt).getFullYear()}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-card border border-border/60 rounded-sm p-8 shadow-sm">
                            <h4 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 opacity-60">
                              <ShieldCheck className="w-4 h-4 text-success" /> Verified Communication
                            </h4>
                            <div className="space-y-4">
                              <div className="p-4 rounded-xl bg-muted/30 border border-transparent">
                                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 opacity-50">Enterprise Email</p>
                                <p className="text-sm font-bold text-primary">{seller.email}</p>
                              </div>
                              <div className="p-4 rounded-xl bg-muted/30 border border-transparent">
                                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 opacity-50">Authorized Hotline</p>
                                <p className="text-sm font-bold">{seller.phone || "+91 90000 00000"}</p>
                              </div>
                              {seller.website && (
                                <div className="p-4 rounded-xl bg-muted/30 border border-transparent">
                                  <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 opacity-50">Official Gateway</p>
                                  <p className="text-sm font-bold text-primary truncate">{seller.website}</p>
                                </div>
                              )}
                              <Link to={`/seller/${seller.id}`} className="block pt-2">
                                <Button className="w-full rounded-xl h-12 font-black text-xs uppercase tracking-[0.2em] gradient-primary shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all transition-transform">
                                  Enter Seller Hub
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-12 text-center border-2 border-dashed border-border rounded-xl">
                          <Store className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-40">System Node for this seller is currently offline</p>
                        </div>
                      )}
                    </TabsContent>

                    {/* Tab 2: About Company */}
                    <TabsContent value="seller-about" className="mt-0 focus-visible:outline-none">
                      <div className="bg-white dark:bg-card border border-border/60 rounded-sm p-8 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex flex-col gap-6">
                          <div>
                            <h4 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-primary">
                              <Store className="w-5 h-5" /> Corporate Overview
                            </h4>
                            <p className="text-sm font-medium leading-loose text-foreground/70 text-justify">
                              {seller?.name} is a leading authorized node in the {seller?.category} sector. Committed to excellence and high-fidelity sourcing, they provide strategic assets to global enterprises through the Zenzetrade Network.
                              With advanced manufacturing capabilities and a verified supply chain, they maintain a Gold Standard verification status within the hub.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pt-6 border-t border-border/30">
                            <div>
                              <h5 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em] mb-3">Enterprise Core Focus</h5>
                              <ul className="space-y-2">
                                {["Quality Assurance Node", "Technical Specification Control", "Direct Distribution Hub", "Integrated Logistics Protocol"].map(t => (
                                  <li key={t} className="flex items-center gap-2 text-sm font-bold text-foreground/80">
                                    <div className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
                                    {t}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
                              <h5 className="text-[10px] font-black uppercase text-primary tracking-[0.3em] mb-3">Verification Metadata</h5>
                              <div className="flex items-center gap-3 mb-2">
                                <ShieldCheck className="w-5 h-5 text-success" />
                                <span className="text-sm font-black uppercase text-foreground">Global Registry Status: ACTIVE</span>
                              </div>
                              <p className="text-[11px] font-bold text-muted-foreground leading-relaxed uppercase tracking-tighter italic">
                                * This seller node has successfully passed the Q2 2026 Zenze Protocol technical audit.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Tab 3: Product Specifications */}
                    <TabsContent value="product" className="mt-0 focus-visible:outline-none">
                      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {product.highlights && product.highlights.length > 0 && (
                          <section className="bg-white dark:bg-card border border-border/60 rounded-sm p-8 shadow-sm">
                            <h3 className="font-bold text-lg border-b pb-3 mb-6 flex items-center gap-2">
                              <Box className="w-5 h-5 text-primary" /> Product Highlights
                            </h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                              {product.highlights.map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                  <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />
                                  </div>
                                  <span className="text-sm font-medium opacity-80 leading-relaxed text-foreground">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </section>
                        )}

                        <section className="bg-white dark:bg-card border border-border/60 rounded-sm p-8 shadow-sm">
                          <h3 className="font-bold text-lg border-b pb-3 mb-6 flex items-center gap-2">
                            <Info className="w-5 h-5 text-primary" /> Technical Description
                          </h3>
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="text-sm font-medium leading-loose text-foreground/70">
                              {product.description}
                            </p>

                            {/* Dynamic Specifications Grid */}
                            {product.specifications && Object.keys(product.specifications).length > 0 && (
                              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(product.specifications).map(([key, val]) => (
                                  <div key={key} className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-70">{key}</span>
                                    <span className="text-sm font-black text-foreground">{val}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-4 rounded-xl bg-muted/30">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-50">Model Registry</p>
                                <p className="text-sm font-bold">ZT-NODE-{product.id.toUpperCase().slice(0, 8)}-2024</p>
                              </div>
                              <div className="p-4 rounded-xl bg-muted/30">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-50">Source Origin</p>
                                <p className="text-sm font-bold uppercase">{seller?.location || "Proprietary Hub"}</p>
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>
                    </TabsContent>

                  </Tabs>

                  {/* Global Reviews Section - Now Standalone */}
                  <div className="mt-12 bg-white dark:bg-card border border-border/60 rounded-sm p-8 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-center justify-between border-b pb-6 mb-10 gap-4">
                      <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-1">
                          {isUsingFallback ? "Community Validation Hub" : "Public Feedback Hub"}
                        </p>
                        <h3 className="text-xl font-black flex items-center gap-2 uppercase tracking-tighter">
                          <MessageSquare className="w-5 h-5 text-primary" />
                          {isUsingFallback ? "Global Market Stream" : "Verified Reviews & Ratings"}
                        </h3>
                      </div>
                      <button
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="h-10 px-8 rounded-lg border-2 border-primary/20 text-primary font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm active:scale-95"
                      >
                        Transmit Validation signal
                      </button>
                    </div>

                    <AnimatePresence>
                      {showReviewForm && (
                        <motion.form
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          onSubmit={handleReview}
                          className="bg-muted min-h-0 overflow-hidden mb-12 rounded-2xl border border-border/50 shadow-inner"
                        >
                          <div className="p-8 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                              <span className="text-xs font-black uppercase tracking-[0.3em] opacity-60">System Rating Check:</span>
                              <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(s => (
                                  <button key={s} type="button" onClick={() => setReviewRating(s)} className={`transition-all transform hover:scale-110 active:scale-95 ${s <= reviewRating ? 'text-accent' : 'text-muted-foreground/30'}`}>
                                    <Star className={`w-8 h-8 ${s <= reviewRating ? "fill-current" : ""}`} />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="relative">
                              <textarea
                                value={reviewComment}
                                onChange={e => setReviewComment(e.target.value)}
                                placeholder="Enter technical feedback or buyer validation notes..."
                                className="w-full p-6 border-2 border-border/50 rounded-2xl bg-white/50 backdrop-blur-sm min-h-[160px] focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-sm font-medium transition-all"
                              />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                              <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)} className="px-8 h-12 rounded-xl font-black text-[10px] uppercase tracking-widest">
                                CANCEL SIGNAL
                              </Button>
                              <Button className="px-10 h-12 rounded-xl font-black text-[10px] uppercase tracking-widest gradient-primary border-none shadow-xl shadow-primary/20">
                                STATION TRANSMIT
                              </Button>
                            </div>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>

                    <div className="bg-muted/30 dark:bg-card/50 border border-border/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-10 mb-8 sm:mb-12 shadow-inner">
                      <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-10 lg:gap-20">
                        {/* Primary Metric Node */}
                        <div className="w-full md:w-auto flex flex-col items-center justify-center bg-white dark:bg-card border border-border/60 rounded-2xl sm:rounded-3xl p-6 sm:px-12 sm:py-10 shadow-xl shadow-black/5 shrink-0">
                          <p className="text-[10px] sm:text-[11px] font-black text-primary uppercase tracking-[0.25em] sm:tracking-[0.4em] mb-3 sm:mb-4 opacity-80">Global Rating</p>
                          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2">
                            <span className="text-5xl sm:text-7xl font-black text-foreground tabular-nums leading-none tracking-tight">{avgRating}</span>
                            <div className="flex flex-col items-start justify-center">
                              <Star className="w-6 h-6 sm:w-8 sm:h-8 text-accent fill-current drop-shadow-md" />
                              <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase opacity-60 mt-0.5 tracking-wider whitespace-nowrap">Out of 5</span>
                            </div>
                          </div>
                          <div className="flex gap-1.5 mb-4 sm:mb-6 mt-1 sm:mt-2">
                            {[1, 2, 3, 4, 5].map(i => (
                              <Star key={i} className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i <= Math.round(Number(avgRating)) ? 'text-accent fill-current' : 'text-muted-foreground/20'}`} />
                            ))}
                          </div>
                          <div className="px-4 py-1.5 sm:px-6 sm:py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20">
                            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest whitespace-nowrap">{displayReviews.length} Validated Signals</p>
                          </div>
                        </div>

                        {/* Performance Distribution Track */}
                        <div className="flex-1 w-full flex flex-col justify-center gap-3 sm:gap-4">
                          <div className="flex items-center justify-between mb-1 sm:mb-2">
                            <p className="text-[10px] sm:text-[11px] font-black text-muted-foreground uppercase tracking-wider sm:tracking-[0.4em] opacity-70 italic">Validation Distribution Index</p>
                            <div className="h-px flex-1 bg-border/40 mx-4 hidden lg:block" />
                          </div>
                          {[5, 4, 3, 2, 1].map((star) => {
                            const count = displayReviews.filter(r => r.rating === star).length;
                            const percentage = displayReviews.length > 0 ? (count / displayReviews.length) * 100 : 0;
                            return (
                              <div key={star} className="flex items-center gap-2.5 sm:gap-6 group">
                                <div className="flex items-center gap-1 w-14 sm:w-18 shrink-0">
                                  <span className="text-xs font-black text-foreground uppercase tabular-nums">{star}</span>
                                  <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground/40 fill-current" />
                                  <span className="text-[8px] sm:text-[9px] font-black text-muted-foreground uppercase opacity-50 ml-0.5 tracking-wider">RANK</span>
                                </div>
                                <div className="flex-1 h-2.5 sm:h-3.5 bg-muted rounded-full overflow-hidden shadow-inner border border-black/5 relative group-hover:scale-[1.01] transition-transform">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    className={`h-full rounded-full ${star >= 4 ? 'gradient-success shadow-lg' : star === 3 ? 'bg-accent' : 'bg-destructive/60'}`}
                                  />
                                </div>
                                <span className="text-[11px] sm:text-xs font-bold sm:font-black text-muted-foreground w-10 sm:w-12 text-right tabular-nums tracking-tight">{percentage.toFixed(0)}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div
                      className="relative group/slider px-0 sm:px-4 md:px-12"
                      onMouseEnter={() => setIsSliderHovered(true)}
                      onMouseLeave={() => setIsSliderHovered(false)}
                    >
                      {displayReviews.length === 0 ? (
                        <div className="py-24 text-center border-2 border-dashed border-border/40 rounded-3xl group hover:border-primary/20 transition-colors mx-4">
                          <MessageSquare className="w-16 h-16 text-muted-foreground/10 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                          <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.5em] opacity-30">No System Feed available for this Asset node</p>
                        </div>
                      ) : (
                        <div className="relative group/slider-container">
                          <div
                            ref={setReviewSliderRef}
                            className={`flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth pb-4 sm:pb-8 pt-2 sm:pt-4 ${displayReviews.length <= 1 ? 'justify-center' : 'px-4 md:px-[20%]'}`}
                          >
                            {displayReviews.map((r, idx) => (
                              <motion.div
                                key={r.id}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                className="w-[calc(100vw-32px)] sm:w-[450px] md:w-[480px] shrink-0 bg-white dark:bg-card border-2 border-border/10 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-10 snap-center hover:border-primary/30 transition-all duration-500 group/card relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.08)]"
                              >
                                <div className="absolute top-0 right-0 p-10 opacity-[0.03] -z-10 group-hover/card:scale-110 group-hover/card:opacity-10 transition-all duration-700">
                                  <Quote className="w-40 h-40 text-primary" />
                                </div>

                                <div className="flex items-start gap-3.5 sm:gap-5 mb-4 sm:mb-8">
                                  <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-primary-foreground text-white flex items-center justify-center text-lg sm:text-2xl font-black shrink-0 shadow-lg sm:shadow-xl shadow-primary/20 group-hover/card:scale-110 transition-transform duration-500">
                                    {r.userName.charAt(0)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                                      <span className="font-black text-sm sm:text-base text-foreground uppercase tracking-tight truncate">{r.userName}</span>
                                      <div className="flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[11px] sm:text-xs font-black shadow-md shadow-emerald-500/20 uppercase tabular-nums">
                                        {r.rating.toFixed(1)} <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-[0.15em] italic whitespace-nowrap truncate">Verified Hub Partner</span>
                                    </div>
                                  </div>
                                  <span className="hidden sm:block text-[11px] text-muted-foreground/40 uppercase tracking-widest font-black tabular-nums">{new Date(r.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                                </div>

                                <div className="relative mb-5 sm:mb-8">
                                  <span className="absolute -top-3 -left-1 text-2xl sm:text-4xl text-primary/10 font-serif">"</span>
                                  <p className="text-sm sm:text-base font-medium text-foreground/80 leading-relaxed italic line-clamp-4 relative z-10 pl-3 sm:pl-4 border-l-2 sm:border-l-4 border-primary/10 group-hover/card:border-primary/20 transition-all duration-500">
                                    {r.comment}
                                  </p>
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-4 sm:pt-6 border-t border-border/40">
                                  <button className="flex items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider sm:tracking-[0.25em] text-muted-foreground/60 hover:text-primary transition-all duration-300 active:scale-95 group/help">
                                    <ThumbsUp className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 group-hover/help:-translate-y-0.5 transition-transform" /> HELPFUL?
                                  </button>
                                  <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(i => (
                                      <Star key={i} className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-500 ${i <= r.rating ? 'text-accent fill-current drop-shadow-[0_0_8px_rgba(255,193,7,0.4)]' : 'text-muted-foreground/10'}`} />
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>

                          {/* Navigation Overlays - Desktop Only */}
                          {displayReviews.length > 1 && (
                            <div className="hidden sm:flex absolute inset-y-0 -left-4 -right-4 md:-left-12 md:-right-12 pointer-events-none items-center justify-between z-40">
                              <button
                                onClick={() => {
                                  if (reviewSliderRef) {
                                    const scrollAmount = reviewSliderRef.clientWidth > 600 ? 500 : reviewSliderRef.clientWidth;
                                    reviewSliderRef.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                                  }
                                }}
                                className="pointer-events-auto w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/95 dark:bg-card/95 backdrop-blur-xl border border-primary/10 shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-500 group/btn"
                                aria-label="Previous review"
                              >
                                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 group-hover/btn:-translate-x-1 transition-transform" />
                              </button>
                              <button
                                onClick={() => {
                                  if (reviewSliderRef) {
                                    const scrollAmount = reviewSliderRef.clientWidth > 600 ? 500 : reviewSliderRef.clientWidth;
                                    reviewSliderRef.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                                  }
                                }}
                                className="pointer-events-auto w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/95 dark:bg-card/95 backdrop-blur-xl border border-primary/10 shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-500 group/btn"
                                aria-label="Next review"
                              >
                                <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover/btn:translate-x-1 transition-transform" />
                              </button>
                            </div>
                          )}

                          {/* Pagination - Dots & Mobile Controls */}
                          {displayReviews.length > 1 && (
                            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-8">
                              <button
                                onClick={() => {
                                  if (reviewSliderRef) {
                                    const scrollAmount = reviewSliderRef.clientWidth > 600 ? 500 : reviewSliderRef.clientWidth;
                                    reviewSliderRef.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                                  }
                                }}
                                className="sm:hidden w-8 h-8 rounded-full bg-white dark:bg-card border border-border shadow-md flex items-center justify-center text-foreground hover:text-primary active:scale-90 transition-all"
                                aria-label="Previous review"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>

                              <div className="flex items-center gap-2">
                                {displayReviews.map((_, i) => (
                                  <button
                                    key={i}
                                    onClick={() => {
                                      if (reviewSliderRef) {
                                        const scrollWidth = reviewSliderRef.scrollWidth - reviewSliderRef.clientWidth;
                                        const scrollAmount = reviewSliderRef.clientWidth > 600 ? 500 : reviewSliderRef.clientWidth;
                                        reviewSliderRef.scrollTo({
                                          left: Math.min(i * scrollAmount, scrollWidth),
                                          behavior: 'smooth'
                                        });
                                      }
                                    }}
                                    className={`transition-all duration-500 rounded-full ${activeSlideIndex === i
                                      ? "w-8 sm:w-10 h-2 bg-primary shadow-md shadow-primary/20"
                                      : "w-2 h-2 bg-muted-foreground/20 hover:bg-muted-foreground/40"
                                      }`}
                                    aria-label={`Go to slide ${i + 1}`}
                                  />
                                ))}
                              </div>

                              <button
                                onClick={() => {
                                  if (reviewSliderRef) {
                                    const scrollAmount = reviewSliderRef.clientWidth > 600 ? 500 : reviewSliderRef.clientWidth;
                                    reviewSliderRef.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                                  }
                                }}
                                className="sm:hidden w-8 h-8 rounded-full bg-white dark:bg-card border border-border shadow-md flex items-center justify-center text-foreground hover:text-primary active:scale-90 transition-all"
                                aria-label="Next review"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="mt-16 bg-white dark:bg-card border-t border-border/10 pt-12 pb-16 px-4 sm:px-6 lg:px-8">
              <div className="max-w-screen-xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-1">Discover More</p>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">Products Related to This Item</h3>
                  </div>
                  <Link to="/products" className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:gap-3 transition-all border border-primary/20 px-4 py-2 rounded-full hover:bg-primary/5">
                    SEE ALL <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Mobile Floating Action */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-2.5 sm:p-3 bg-card/95 backdrop-blur-xl border-t border-border/50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 max-w-full">
            <Button onClick={handleStartChat} variant="outline" className="h-11 sm:h-12 rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest border-2 hover:bg-primary/5 hover:text-primary active:scale-95 transition-all flex items-center justify-center shadow-sm">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 shrink-0" /> CHAT SELLER
            </Button>
            <Link to={`/inquiry/${product.id}`} className="w-full">
              <Button variant="hero" className="w-full h-11 sm:h-12 rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest bg-[#fb641b] hover:bg-[#fb641b]/90 border-none shadow-md active:scale-95 transition-all flex items-center justify-center">
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 shrink-0" /> INQUIRE NOW
              </Button>
            </Link>
          </div>
        </div>
      </div>
      {product && (
        <ProductShareDialog
          isOpen={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
          product={product}
          onShareComplete={() => setProduct({ ...product, shares: (product.shares || 0) + 1 })}
        />
      )}
    </Layout>
  );
}
