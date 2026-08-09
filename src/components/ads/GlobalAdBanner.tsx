import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAds, getProducts, getOrCreateChatRoom, type Ad } from "@/lib/storage";
import { X, ExternalLink, MessageSquare, SkipForward, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function GlobalAdBanner() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeAds, setActiveAds] = useState<Ad[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const fetchAds = async () => {
      let rawAds: Ad[] = [];
      try {
        const res = await fetch("http://localhost/api/get_ads.php");
        if (res.ok) {
          rawAds = await res.json();
        } else {
          throw new Error("Failed to fetch");
        }
      } catch (err) {
        rawAds = getAds();
      }

      const today = new Date().toISOString().split('T')[0];
      let trackingData = JSON.parse(localStorage.getItem('zenze_ad_tracking') || '{"date":"","totalViews":0,"counts":{}}');
      if (trackingData.date !== today) {
        trackingData = { date: today, totalViews: 0, counts: {} };
        localStorage.setItem('zenze_ad_tracking', JSON.stringify(trackingData));
      }

      // Enforce 100 views per user daily limit for testing
      if (trackingData.totalViews >= 100) {
        setActiveAds([]);
        setIsVisible(false);
        return;
      }

      // Filter active, approved
      let validAds = rawAds.filter(a => 
        a.status === "active" && 
        a.verificationStatus === "approved"
      );

      // Shuffle the ads randomly each time
      validAds = validAds.sort(() => Math.random() - 0.5);

      setActiveAds(validAds);
    };

    const majorPaths = ['/', '/dashboard', '/products', '/buyer/dashboard', '/seller/dashboard'];
    if (majorPaths.includes(location.pathname)) {
      fetchAds();
      setIsVisible(true);
      setCurrentIndex(0);
    }
  }, [location.pathname]);

  const displayedAdId = activeAds[currentIndex]?.id;

  useEffect(() => {
    if (displayedAdId && isVisible) {
      const today = new Date().toISOString().split('T')[0];
      let trackingData = JSON.parse(localStorage.getItem('zenze_ad_tracking') || '{"date":"","totalViews":0,"counts":{}}');
      if (trackingData.date !== today) {
        trackingData = { date: today, totalViews: 0, counts: {} };
      }
      trackingData.totalViews = (trackingData.totalViews || 0) + 1;
      trackingData.counts[displayedAdId] = (trackingData.counts[displayedAdId] || 0) + 1;
      localStorage.setItem('zenze_ad_tracking', JSON.stringify(trackingData));
    }
  }, [displayedAdId, isVisible]);

  const handleSkip = () => {
    if (currentIndex < activeAds.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    if (activeAds.length > 0) {
      const currentAd = activeAds[currentIndex];
      if (currentAd && !(currentAd as any).videoUrl) {
        const timer = setTimeout(() => {
          handleSkip();
        }, 4000); // 4 seconds per ad
        return () => clearTimeout(timer);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, activeAds.length]);

  const handleStartChat = (ad: Ad) => {
    if (!user) {
      toast.error("Please login to contact the advertiser");
      navigate("/login");
      return;
    }
    getOrCreateChatRoom(user.id, ad.sellerId, {
      type: "ad",
      id: ad.id,
      title: ad.headline || "Ad Inquiry"
    });
    navigate(user.role === 'buyer' ? '/buyer/dashboard' : '/seller/dashboard');
  };

  if (!isVisible || activeAds.length === 0) return null;

  const currentAd = activeAds[currentIndex];
  const adProduct = currentAd.productId ? getProducts().find(p => p.id === currentAd.productId) : null;

  const isProductPage = location.pathname.startsWith('/product/') || location.pathname.startsWith('/products/');

  return (
    <AnimatePresence mode="wait">
      {isVisible && activeAds.length > 0 && (
        <motion.div
          key={isMinimized ? "ad-minimized" : `ad-expanded-${currentIndex}`}
          initial={{ y: 30, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 30, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className={
            isMinimized
              ? `fixed ${isProductPage ? "bottom-[72px]" : "bottom-3"} left-3 z-[4000] pointer-events-auto`
              : `fixed ${isProductPage ? "bottom-[72px]" : "bottom-3"} left-3 right-[72px] sm:right-auto sm:left-6 sm:bottom-6 sm:w-[380px] md:w-[410px] z-[4000] pointer-events-auto`
          }
        >
          {isMinimized ? (
            /* Minimized Sleek Pill Badge */
            <div
              onClick={() => setIsMinimized(false)}
              className="group flex items-center gap-2 px-3 py-1.5 sm:py-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-primary/30 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.25)] cursor-pointer hover:scale-105 transition-all"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span className="text-sm sm:text-base leading-none shrink-0">{adProduct ? adProduct.image : "🚀"}</span>
              <div className="flex flex-col min-w-0">
                <span className="text-[9.5px] sm:text-[10px] font-black uppercase tracking-tight text-foreground max-w-[110px] sm:max-w-[130px] truncate leading-tight">
                  {currentAd.headline || "Promoted Feed"}
                </span>
                <span className="text-[7.5px] sm:text-[8px] font-bold uppercase tracking-widest text-primary leading-tight">
                  Live Trade Feed
                </span>
              </div>
              <ChevronUp className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors ml-0.5 shrink-0" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVisible(false);
                }}
                className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors ml-0.5 shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            /* Full Banner Card - Optimized for Mobile & Desktop */
            <div className="relative group bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border border-border/80 dark:border-white/15 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.35)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden transition-all duration-300">
              {/* Animated Glowing Gradient Background */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <motion.div
                  animate={{
                    background: [
                      "radial-gradient(circle at 0% 0%, rgba(124,58,237,0.12) 0%, transparent 50%)",
                      "radial-gradient(circle at 100% 100%, rgba(124,58,237,0.12) 0%, transparent 50%)",
                      "radial-gradient(circle at 0% 100%, rgba(124,58,237,0.12) 0%, transparent 50%)",
                      "radial-gradient(circle at 100% 0%, rgba(124,58,237,0.12) 0%, transparent 50%)"
                    ]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                />
              </div>

              {/* Slim Header Bar */}
              <div className="relative z-10 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-black/[0.03] dark:bg-white/[0.03] border-b border-border/40 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.12em] sm:tracking-[0.2em] text-rose-500 truncate">
                    Live Trade Feed
                  </span>
                  {activeAds.length > 1 && (
                    <span className="text-[8px] sm:text-[9px] font-bold text-muted-foreground opacity-60 shrink-0">
                      ({currentIndex + 1}/{activeAds.length})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                  {activeAds.length > 1 && (
                    <button
                      onClick={handleSkip}
                      className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-muted-foreground hover:text-foreground flex items-center gap-0.5 transition-colors px-1 py-0.5"
                      title="Skip to next ad"
                    >
                      Skip <SkipForward className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    title="Minimize"
                  >
                    <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsVisible(false)}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    title="Close"
                  >
                    <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="relative z-10 p-2 sm:p-2.5 md:p-4">
                {(currentAd as any).videoUrl ? (
                  /* Video Ad View */
                  <div>
                    {/* Mobile Video Compact View */}
                    <div className="md:hidden flex items-center gap-2">
                      <div className="relative w-12 h-10 shrink-0 rounded-lg overflow-hidden bg-black shadow-md border border-border/30">
                        <video
                          src={(currentAd as any).videoUrl}
                          autoPlay
                          muted
                          playsInline
                          onEnded={handleSkip}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-black uppercase tracking-tight text-foreground truncate leading-tight">
                          {currentAd.headline || "Zenze Premium Partner"}
                        </h4>
                        <p className="text-[9px] text-muted-foreground truncate leading-tight mt-0.5">
                          {currentAd.message || "Global trade synchronization active."}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleStartChat(currentAd)}
                          className="h-7 w-7 p-0 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground"
                          title="Instant Chat"
                        >
                          <MessageSquare className="w-3 h-3 text-primary" />
                        </Button>
                        <Link to={currentAd.productId ? `/products/${currentAd.productId}` : '/products'}>
                          <Button
                            size="sm"
                            className="h-7 px-2 rounded-lg gradient-primary text-white font-black text-[9px] uppercase tracking-wider flex items-center gap-0.5 shadow-md shadow-primary/20"
                          >
                            Specs <ExternalLink className="w-2.5 h-2.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Desktop Video Full View */}
                    <div className="hidden md:block relative w-full overflow-hidden rounded-2xl shadow-lg border border-border/20 bg-black">
                      <video
                        src={(currentAd as any).videoUrl}
                        autoPlay
                        muted
                        playsInline
                        onEnded={handleSkip}
                        className="w-full h-[180px] object-cover opacity-85"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 flex gap-2.5 items-end z-10">
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-white/10 flex items-center justify-center text-xl shadow-xl backdrop-blur-md border border-white/20 overflow-hidden">
                          {adProduct ? adProduct.image : "🚀"}
                        </div>
                        <div className="flex-1 min-w-0 pb-0.5">
                          <h4 className="text-[12px] font-black uppercase tracking-tight text-white line-clamp-1 drop-shadow">
                            {currentAd.headline || "Zenze Premium Partner"}
                          </h4>
                          <p className="text-[10px] text-white/80 font-medium line-clamp-1 leading-snug drop-shadow">
                            {currentAd.message || "Global trade synchronization active."}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Button
                            size="sm"
                            onClick={() => handleStartChat(currentAd)}
                            className="h-8 w-8 p-0 rounded-lg bg-white/15 backdrop-blur-sm border border-white/20 hover:bg-white/30 text-white"
                            title="Instant Chat"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-white" />
                          </Button>
                          <Link to={currentAd.productId ? `/products/${currentAd.productId}` : '/products'}>
                            <Button
                              size="sm"
                              className="h-8 px-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-primary/30"
                            >
                              Specs <ExternalLink className="w-3 h-3" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Standard Non-Video Ad View */
                  <div>
                    {/* Mobile Compact Horizontal Row */}
                    <div className="md:hidden flex items-center gap-2">
                      <div className="w-9 h-9 shrink-0 rounded-lg bg-gradient-to-br from-primary/15 to-accent/15 border border-primary/20 flex items-center justify-center text-xl shadow-sm overflow-hidden">
                        {adProduct ? adProduct.image : "🚀"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-black uppercase tracking-tight text-foreground truncate leading-tight">
                          {currentAd.headline || "Zenze Premium Partner"}
                        </h4>
                        <p className="text-[9px] text-muted-foreground truncate leading-tight mt-0.5">
                          {currentAd.message || "Global trade synchronization active."}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleStartChat(currentAd)}
                          className="h-7 w-7 p-0 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground"
                          title="Instant Chat"
                        >
                          <MessageSquare className="w-3 h-3 text-primary" />
                        </Button>
                        <Link to={currentAd.productId ? `/products/${currentAd.productId}` : '/products'}>
                          <Button
                            size="sm"
                            className="h-7 px-2 rounded-lg gradient-primary text-white font-black text-[9px] uppercase tracking-wider flex items-center gap-0.5 shadow-md shadow-primary/20"
                          >
                            Specs <ExternalLink className="w-2.5 h-2.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Desktop Rich Layout */}
                    <div className="hidden md:flex flex-col gap-3">
                      <div className="flex gap-3.5 items-center">
                        <div className="w-13 h-13 shrink-0 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-3xl shadow-md border border-primary/10 overflow-hidden">
                          {adProduct ? adProduct.image : "🚀"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[13px] font-black uppercase tracking-tight text-foreground line-clamp-1">
                            {currentAd.headline || "Zenze Premium Partner"}
                          </h4>
                          <p className="text-[11px] text-muted-foreground font-medium line-clamp-2 leading-relaxed opacity-90 mt-0.5">
                            {currentAd.message || "Global trade synchronization active. Connect for industrial procurement mission."}
                          </p>
                        </div>
                      </div>

                      {/* Desktop Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          onClick={() => handleStartChat(currentAd)}
                          className="flex-1 h-9 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-primary" /> Instant Chat
                        </Button>
                        <Link to={currentAd.productId ? `/products/${currentAd.productId}` : '/products'} className="flex-1">
                          <Button className="w-full h-9 rounded-xl gradient-primary text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-lg shadow-primary/20 hover:translate-y-[-1px] transition-all">
                            View Specs <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Progress Bar */}
              {!(currentAd as any).videoUrl && (
                <div className="absolute bottom-0 left-0 h-0.5 bg-primary/20 w-full overflow-hidden">
                  <motion.div
                    key={`progress-${currentIndex}`}
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 4, ease: "linear" }}
                    className="w-full h-full gradient-primary"
                  />
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

