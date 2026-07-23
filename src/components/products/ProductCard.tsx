import React from "react";
import { Link } from "react-router-dom";
import { Star, ShieldCheck, MapPin, Heart, Eye, Share2, BadgeCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { getProductReviews, getProductWishlistCount } from "@/lib/storage";
import { useCurrency } from "@/contexts/CurrencyContext";

interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  price: string;
  priceNum?: number;
  moq?: string;
  verified?: boolean;
  sellerName?: string;
  sellerId?: string;
  location?: string;
  views?: number;
  shares?: number;
  status?: string;
  [key: string]: any;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const reviews = getProductReviews(product.id);
  const { formatPrice } = useCurrency();
  const rating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "4.8";
  const wishlistCount = getProductWishlistCount(product.id) || 0;
  const viewsCount = product.views || 0;
  const sharesCount = product.shares || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <div className="relative bg-white dark:bg-card border border-border/60 rounded-2xl overflow-hidden flex flex-col h-full hover:shadow-2xl hover:border-primary/40 transition-all duration-500 hover:-translate-y-1">
        <Link to={`/products/${product.id}`} className="flex flex-col flex-1">
          {/* Image */}
          <div className="relative aspect-[14/10] bg-muted overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-6xl bg-gradient-to-br from-muted to-muted/50 group-hover:scale-110 transition-transform duration-700 ease-out">
              <span className="opacity-80 drop-shadow-sm transform group-hover:-rotate-3 transition-transform duration-500">
                {product.image}
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Verified Badge */}
            <div className="absolute top-3 left-3 flex gap-2">
              {product.verified && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-success/90 backdrop-blur-md text-white rounded-full text-xs font-black uppercase tracking-wider shadow-lg">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </div>
              )}
            </div>

            {/* Hover CTA */}
            <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
              <div className="rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-widest shadow-xl bg-primary text-white flex items-center gap-2">
                View Product <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1 relative z-10 bg-card">
            <div className="flex items-center justify-between mb-3 leading-none">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-md truncate max-w-[50%]">
                {product.category}
              </span>
              <div className="flex items-center gap-2.5 text-[10px] font-bold text-muted-foreground tabular-nums">
                <span className="flex items-center gap-1" title="Rating">
                  <Star className="w-3.5 h-3.5 fill-accent text-accent" /> {rating}
                </span>
                <span className="flex items-center gap-1" title="Wishlist">
                  <Heart className={`w-3.5 h-3.5 ${wishlistCount > 0 ? 'text-destructive fill-destructive' : ''}`} /> {wishlistCount}
                </span>
                <span className="flex items-center gap-1" title="Views">
                  <Eye className="w-3.5 h-3.5" /> {viewsCount}
                </span>
              </div>
            </div>

            <h3 className="font-heading font-black text-base text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors mb-4">
              {product.name}
            </h3>

            <div className="flex-1" />

            <div className="flex items-end justify-between pt-4 border-t border-border/50">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-0.5 opacity-50">Price</p>
                <p className="font-heading text-xl font-black text-foreground leading-none">
                  {product.priceNum ? formatPrice(product.priceNum) : (product.price?.startsWith('₹') ? product.price : `₹${product.price}`)}
                </p>
              </div>
              {product.moq && (
                <div className="text-right">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-0.5 opacity-50">MOQ</p>
                  <p className="text-xs font-black text-foreground bg-muted px-2.5 py-1 rounded-md inline-block">
                    {product.moq}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Link>

        {/* Seller Footer */}
        <Link
          to={`/seller/${product.sellerId || 's1'}`}
          className="flex items-center gap-3 p-4 pt-2 border-t border-border/50 hover:bg-primary/5 transition-colors relative z-20"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-sm shrink-0 group-hover:rotate-6 transition-transform">
            {(product.sellerName || "U").substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-foreground truncate hover:text-primary transition-all">
                {product.sellerName || "Unknown Seller"}
              </p>
              {product.verified && <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-40">
              <MapPin className="w-3 h-3" /> {(product.location || "India").split(',')[0]}
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;
