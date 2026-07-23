import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Home, ArrowLeft, Package, Ghost, Compass } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const NotFound = () => {
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const floatingIcons = [
    { icon: Package, x: -100, y: -150, delay: 0 },
    { icon: Search, x: 120, y: -120, delay: 0.2 },
    { icon: Compass, x: -150, y: 100, delay: 0.4 },
    { icon: Ghost, x: 100, y: 150, delay: 0.6 },
  ];

  return (
    <div className="min-h-screen font-body flex flex-col bg-background selection:bg-primary/20">
      <Header />

      <main className="flex-1 relative flex items-center justify-center py-20 px-4">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              x: [0, 40, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              x: [0, -40, 0],
              y: [0, 50, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[150px]"
          />
        </div>

        {/* Floating Abstract Elements */}
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 0.3,
              scale: 1,
              y: [item.y, item.y - 20, item.y],
              x: item.x
            }}
            transition={{
              delay: item.delay,
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute hidden md:block"
          >
            <item.icon className="w-12 h-12 text-primary" />
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-2xl w-full"
        >
          {/* Main Glass Card */}
          <div className="glass-card p-8 md:p-12 text-center relative overflow-hidden group">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="relative inline-block mb-6"
            >
              <h1 className="text-8xl md:text-9xl font-black text-gradient leading-none tracking-tighter">404</h1>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -top-4 -right-4"
              >
                <Ghost className="w-12 h-12 text-accent animate-pulse" />
              </motion.div>
            </motion.div>

            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4 tracking-tight">
              Oops! You've drifted out <br />
              <span className="text-primary italic">of the marketplace.</span>
            </h2>

            <p className="mb-10 text-muted-foreground text-lg md:text-xl font-medium max-w-lg mx-auto leading-relaxed">
              The page you are looking for might have been moved, deleted, or never existed in our trade network.
            </p>

            {/* Creative Search Bar */}
            <div className="relative max-w-md mx-auto mb-10 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-25 group-focus-within:opacity-75 transition duration-1000"></div>
              <div className="relative flex items-center bg-background rounded-xl border border-border overflow-hidden">
                <Search className="ml-4 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Can't find it? Search here..."
                  className="w-full bg-transparent border-none py-4 px-4 outline-none text-foreground font-medium"
                  value={searchValue}
                  onKeyDown={(e) => e.key === 'Enter' && window.location.assign(`/products?q=${searchValue}`)}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <Button
                  onClick={() => window.location.assign(`/products?q=${searchValue}`)}
                  className="mr-2 rounded-lg gradient-primary h-10"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto rounded-xl px-8 h-14 font-bold border-2 hover:bg-muted transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" /> Go Back
              </Button>
              <Link to="/" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-xl gradient-primary text-white h-14 px-10 font-bold tracking-wide flex items-center gap-2 shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                >
                  <Home className="w-5 h-5" /> Back to Home
                </Button>
              </Link>
            </div>

            {/* Popular Links */}
            <div className="mt-12 pt-8 border-t border-border/50">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6">
                Popular Trading Hubs
              </p>
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                {["Featured Products", "Global Categories", "Seller Hub", "Special Deals"].map((link) => (
                  <Link
                    key={link}
                    to={link === "Featured Products" ? "/products" : link === "Global Categories" ? "/categories" : link === "Seller Hub" ? "/seller/dashboard" : "/pricing"}
                    className="text-foreground/60 font-semibold hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent scale-0 group-hover:scale-100 transition-transform" />
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;

