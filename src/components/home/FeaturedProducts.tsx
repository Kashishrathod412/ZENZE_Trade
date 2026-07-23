import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Star, ShieldCheck, MapPin, BadgeCheck, Zap, ArrowRight, Eye, Heart, TrendingUp, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getProducts, getProductReviews, getProductWishlistCount, getUsers, toggleWishlist, isInWishlist, incrementShares } from "@/lib/storage";
import { ProductShareDialog } from "@/components/products/ProductShareDialog";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 110,
    }
  }
};

export default function FeaturedProducts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState(() => getProducts().filter(p => p.status === "active").slice(0, 8));
  const [shareDialog, setShareDialog] = useState<{ isOpen: boolean; product: any }>({ isOpen: false, product: null });

  // Deterministically precompute review count fallback mapping to obey React Rules of Hooks
  const reviewCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((product) => {
      const reviews = getProductReviews(product.id);
      if (reviews.length > 0) {
        counts[product.id] = reviews.length;
      } else {
        let hash = 0;
        for (let idx = 0; idx < product.id.length; idx++) {
          hash = product.id.charCodeAt(idx) + ((hash << 5) - hash);
        }
        counts[product.id] = Math.abs(hash % 450) + 50;
      }
    });
    return counts;
  }, [products]);

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
    // Trigger re-render to update counts and icons
    setProducts([...getProducts().filter(p => p.status === "active").slice(0, 8)]);
  };

  const handleShare = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    setShareDialog({ isOpen: true, product });
  };

  return (
    <section className="py-24 bg-surface-elevated relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-wide relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-semibold uppercase tracking-wider text-accent bg-accent/5 rounded-full border border-accent/10"
            >
              <TrendingUp className="w-3 h-3" />
              Featured Products
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight"
            >
              Discover Top <span className="text-gradient">Trending Products</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg"
            >
              Source high-quality products from India's most trusted and verified B2B suppliers.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/products">
              <Button variant="outline" className="rounded-2xl px-8 h-12 font-semibold text-xs uppercase tracking-wider group border-2 border-border hover:border-primary hover:bg-primary/5 hover:text-primary transition-all duration-300">
                View All Products
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Product Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8"
        >
          {products.map((product, i) => {
            const seller = getUsers().find(u => u.id === product.sellerId);
            const isVerified = product.verified;
            const reviews = getProductReviews(product.id);
            const rating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "4.8"; // Default fallback for visuals
            const reviewCount = reviewCounts[product.id];
            const wishlistCount = getProductWishlistCount(product.id) || 0;
            const viewsCount = product.views || 0;
            const sharesCount = product.shares || 0;

            return (
              <motion.div
                key={product.id}
                variants={cardVariants}
                className="relative"
              >
                  <div className="group relative bg-white dark:bg-card border border-border/60 rounded-2xl overflow-hidden flex flex-col h-full hover:shadow-xl hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1">
                    <Link to={`/products/${product.id}`} className="flex flex-col flex-1">
                      {/* Image Container */}
                      <div className="relative aspect-[14/10] bg-muted overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center text-6xl bg-gradient-to-br from-muted to-muted/50 group-hover:scale-105 transition-transform duration-700 ease-out">
                          <span className="opacity-80 drop-shadow-sm transform group-hover:-rotate-2 transition-transform duration-500">{product.image}</span>
                        </div>
                        <div className="absolute top-3 left-3">
                        </div>
                        <div className="absolute top-3 right-3 z-30">
                          <button 
                            onClick={(e) => handleWishlist(e, product.id)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-xl backdrop-blur-md border hover:scale-110 active:scale-95 ${user && isInWishlist(user.id, product.id) ? 'bg-destructive text-white border-destructive shadow-destructive/20' : 'bg-white/90 text-muted-foreground border-border/20 hover:text-destructive hover:bg-white'}`}
                          >
                            <Heart className={`w-5 h-5 ${user && isInWishlist(user.id, product.id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                        {/* Clean, full-width View Details button that translates up on hover */}
                        <div className="absolute inset-x-0 bottom-0 h-12 bg-primary/95 text-white flex items-center justify-center text-xs font-semibold uppercase tracking-wider translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10 shadow-lg">
                          View Details
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-5 flex flex-col flex-1 relative z-10 bg-card">
                        <div className="flex items-center justify-between mb-3 leading-none">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-md truncate max-w-[50%]">
                            {product.category}
                          </span>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground tabular-nums">
                            <span className="flex items-center gap-1" title="Rating">
                              <Star className="w-3.5 h-3.5 fill-accent text-accent" /> {rating}
                            </span>
                            <span className="flex items-center gap-1" title="Wishlist">
                              <Heart className={`w-3.5 h-3.5 ${wishlistCount > 0 ? 'text-destructive fill-destructive' : ''}`} /> {wishlistCount}
                            </span>
                            <span className="flex items-center gap-1" title="Shares">
                              <Share2 className="w-3.5 h-3.5 text-primary/70" /> {sharesCount}
                            </span>
                            <span className="flex items-center gap-1" title="Views">
                              <Eye className="w-3.5 h-3.5" /> {viewsCount}
                            </span>
                          </div>
                        </div>

                        <h3 className="font-heading font-bold text-base text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors mb-4">
                          {product.name}
                        </h3>

                        <div className="flex-1" />

                        <div className="flex items-end justify-between pt-1 mb-4">
                          <div>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5 opacity-50">Price</p>
                            <p className="font-heading text-xl font-bold text-foreground leading-none">
                              {product.price.startsWith('₹') ? product.price : `₹${product.price}`}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5 opacity-50">MOQ</p>
                            <p className="text-[10px] font-bold text-foreground bg-muted px-2.5 py-1 rounded-full inline-block">
                              {product.moq}
                            </p>
                          </div>
                        </div>

                        {/* Seller Info Footer */}
                        <div className="pt-4 border-t border-border/50 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold shrink-0 uppercase tracking-widest">
                            {(product.sellerName || seller?.name || "U").substring(0, 2)}
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-foreground truncate">
                                {product.sellerName || seller?.name || "Unknown Seller"}
                              </span>
                              {isVerified && <BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0" />}
                            </div>
                            <div className="flex items-center gap-1 text-[9px] text-muted-foreground font-bold mt-0.5 uppercase tracking-wider">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{product.location || seller?.location || "Unknown Location"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {shareDialog.product && (
        <ProductShareDialog
          isOpen={shareDialog.isOpen}
          onClose={() => setShareDialog({ ...shareDialog, isOpen: false })}
          product={shareDialog.product}
          onShareComplete={() => setProducts([...getProducts().filter(p => p.status === "active").slice(0, 8)])}
        />
      )}
    </section>
  );
}
