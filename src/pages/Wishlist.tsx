import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Star, ShieldCheck, MapPin, Trash2 } from "lucide-react";
import { getProducts, getUserWishlist, toggleWishlist } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Wishlist() {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState(() => user ? getUserWishlist(user.id) : []);
  const products = getProducts().filter(p => wishlistIds.includes(p.id));

  const handleRemove = (productId: string) => {
    if (!user) return;
    toggleWishlist(user.id, productId);
    setWishlistIds(getUserWishlist(user.id));
  };

  if (!user) {
    return (
      <Layout>
        <div className="container-wide py-20 text-center">
          <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Your Wishlist</h1>
          <p className="text-muted-foreground mb-6">Please login to view your wishlist</p>
          <Link to="/login"><Button variant="hero">Login</Button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-wide py-8">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">My Wishlist ({products.length})</h1>
        {products.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-heading font-semibold text-foreground text-lg mb-2">Your wishlist is empty</h3>
            <p className="text-sm text-muted-foreground mb-4">Browse products and add your favorites</p>
            <Link to="/products"><Button variant="outline">Browse Products</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <AnimatePresence>
              {products.map(product => (
                <motion.div key={product.id} layout exit={{ opacity: 0, scale: 0.9 }} className="relative group">
                  <Link to={`/products/${product.id}`} className="block rounded-xl border border-border bg-card overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                    <div className="aspect-[4/3] bg-muted flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-300">
                      {product.image}
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-primary font-medium">{product.category}</span>
                      <h3 className="font-heading font-semibold text-foreground text-sm line-clamp-2 mt-1 group-hover:text-primary transition-colors">{product.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Star className="w-3 h-3 fill-accent text-accent" />
                        {product.verified && <span className="flex items-center gap-0.5 text-success ml-1"><ShieldCheck className="w-3 h-3" /></span>}
                      </div>
                      <p className="text-lg font-bold text-foreground mt-2">{product.price}</p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" /> {product.sellerName} · {product.location}
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-card border border-border text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </Layout>
  );
}
