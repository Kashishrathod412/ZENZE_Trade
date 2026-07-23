import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAds, getProducts, getOrCreateChatRoom, type Ad, type Product } from "@/lib/storage";
import { X, ExternalLink, Sparkles, MessageSquare, SkipForward } from "lucide-react";
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
        }, 3000); // Hide or skip after 3 seconds
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
    const room = getOrCreateChatRoom(user.id, ad.sellerId, {
      type: "ad",
      id: ad.id,
      title: ad.headline || "Ad Inquiry"
    });
    navigate(user.role === 'buyer' ? '/buyer/dashboard' : '/seller/dashboard');
  };

  if (!isVisible || activeAds.length === 0) return null;

  const currentAd = activeAds[currentIndex];
  const adProduct = currentAd.productId ? getProducts().find(p => p.id === currentAd.productId) : null;

  return (
    <AnimatePresence mode="wait">
      {isVisible && activeAds.length > 0 && (
        <motion.div
          key="ad-banner"
          initial={{ y: 50, opacity: 0, scale: 0.9, x: 20 }}
          animate={{ y: 0, opacity: 1, scale: 1, x: 0 }}
          exit={{ y: 50, opacity: 0, scale: 0.9, x: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-[220px] right-4 md:right-8 z-[6000] w-[calc(100%-2rem)] xs:w-[380px] md:w-[440px] pointer-events-auto"
        >
          <div className="relative group bg-white/90 dark:bg-black/90 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 hover:scale-[1.02]">
            {/* Animated 'Video' Background */}
            <div className="absolute inset-0 z-0">
              <motion.div
                animate={{
                  background: [
                    "radial-gradient(circle at 0% 0%, rgba(124,58,237,0.15) 0%, transparent 50%)",
                    "radial-gradient(circle at 100% 100%, rgba(124,58,237,0.15) 0%, transparent 50%)",
                    "radial-gradient(circle at 0% 100%, rgba(124,58,237,0.15) 0%, transparent 50%)",
                    "radial-gradient(circle at 100% 0%, rgba(124,58,237,0.15) 0%, transparent 50%)"
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05]" />
            </div>

            {/* Top Bar with Live Indicator */}
            <div className="relative z-10 px-4 py-2 bg-black/5 dark:bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-500">Live Trade Feed</span>
              </div>
              <div className="flex items-center gap-3">
                {activeAds.length > 1 && (
                  <button onClick={handleSkip} className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                    Skip <SkipForward className="w-3 h-3" />
                  </button>
                )}
                <button onClick={() => setIsVisible(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Content Area & Actions */}
            <motion.div 
              key={`content-${currentIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 p-4 pt-0 flex flex-col gap-4"
            >
              {(currentAd as any).videoUrl ? (
                <div className="relative w-full overflow-hidden rounded-2xl shadow-lg border border-border/20 bg-black mt-2">
                  <video src={(currentAd as any).videoUrl} autoPlay muted playsInline onEnded={handleSkip} className="w-full h-[240px] object-cover opacity-80" />
                  
                  {/* Dark gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

                  {/* Thumbnail, Text & Actions Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-3 items-end z-10">
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-white/10 flex items-center justify-center text-2xl shadow-2xl backdrop-blur-md border border-white/20 overflow-hidden">
                      {adProduct ? adProduct.image : "🚀"}
                    </div>
                    <div className="flex-1 min-w-0 pb-0.5">
                      <h4 className="text-[13px] font-black uppercase tracking-tight text-white line-clamp-1 mb-1 drop-shadow-md">
                        {currentAd.headline || "Zenze Premium Partner"}
                      </h4>
                      <p className="text-[10px] text-white/90 font-medium line-clamp-2 leading-snug drop-shadow-md">
                        {currentAd.message || "Global trade synchronization active. Connect for industrial procurement mission."}
                      </p>
                    </div>

                    {/* Icon-only Actions */}
                    <div className="flex items-center gap-2 shrink-0 pb-0.5">
                      <Button
                        onClick={() => handleStartChat(currentAd)}
                        className="w-9 h-9 p-0 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all shadow-lg"
                        title="Instant Chat"
                      >
                        <MessageSquare className="w-4 h-4 text-white" />
                      </Button>
                      <Link to={currentAd.productId ? `/products/${currentAd.productId}` : '/products'} className="shrink-0" title="View Specs">
                        <Button className="w-9 h-9 p-0 rounded-xl bg-primary hover:bg-primary/90 text-white flex items-center justify-center shadow-xl shadow-primary/30 hover:translate-y-[-2px] transition-all">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex gap-4 mt-2">
                    <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-4xl shadow-xl group-hover:rotate-3 transition-transform duration-500 overflow-hidden">
                      {adProduct ? adProduct.image : "🚀"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[14px] font-black uppercase tracking-tight text-foreground line-clamp-1 mb-1">
                        {currentAd.headline || "Zenze Premium Partner"}
                      </h4>
                      <p className="text-[11px] text-muted-foreground font-medium line-clamp-2 leading-relaxed opacity-90">
                        {currentAd.message || "Global trade synchronization active. Connect for industrial procurement mission."}
                      </p>
                    </div>
                  </div>

                  {/* Tactical Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleStartChat(currentAd)}
                      className="flex-1 h-10 rounded-xl bg-white dark:bg-white/5 border border-white/10 hover:bg-white/10 text-foreground font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-primary" /> Instant Chat
                    </Button>
                    <Link to={currentAd.productId ? `/products/${currentAd.productId}` : '/products'} className="flex-1">
                      <Button className="w-full h-10 rounded-xl gradient-primary text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:translate-y-[-2px] transition-all">
                        View Specs <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </motion.div>

            {/* Interactive Progress Bar */}
            {!(currentAd as any).videoUrl && (
              <div className="absolute bottom-0 left-0 h-0.5 bg-primary/30 w-full overflow-hidden">
                <motion.div
                  key={`progress-${currentIndex}`}
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 3, ease: "linear" }}
                  className="w-full h-full gradient-primary"
                />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
