import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Search, Menu, X, ShoppingCart, ChevronDown, Heart, User, LogOut, LayoutDashboard,
  Factory, Cpu, Laptop, Gamepad2, Trophy, Smartphone, Shirt, Home,
  PenTool, Briefcase, Car, FlaskConical, Wheat, HardHat, HeartPulse,
  Dog, Truck, Gift, Shield, Scissors, Settings, Nut, Pipette,
  Sun, Construction, Brush, ShoppingBag, Wind, Layers, Waves,
  Wrench, Utensils, Presentation, Palmtree, Printer, Zap, Globe, Sparkles,
  BookOpen, ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fuzzyMatch } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { getUserWishlist, getProducts, getUsers, type Product } from "@/lib/storage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const allCategories = [
  { name: "Industrial & Machinery", icon: Factory },
  { name: "Electrical & Electronics", icon: Cpu },
  { name: "Computers & IT Products", icon: Laptop },
  { name: "Gaming & Accessories", icon: Gamepad2 },
  { name: "Sports & Fitness", icon: Trophy },
  { name: "Consumer Electronics", icon: Smartphone },
  { name: "Clothing & Fashion", icon: Shirt },
  { name: "Home, Kitchen & Furniture", icon: Home },
  { name: "Stationery & Office Supplies", icon: PenTool },
  { name: "Office & Commercial Equipment", icon: Briefcase },
  { name: "Automobile & Parts", icon: Car },
  { name: "Chemicals & Raw Materials", icon: FlaskConical },
  { name: "Agriculture & Farming", icon: Wheat },
  { name: "Construction & Building Materials", icon: HardHat },
  { name: "Beauty & Personal Care", icon: HeartPulse },
  { name: "Pets & Animal Supplies", icon: Dog },
  { name: "Packaging & Logistics", icon: Truck },
  { name: "Toys, Gifts & Baby Products", icon: Gift },
  { name: "Safety & Security", icon: Shield },
  { name: "Textile & Fabric Industry", icon: Scissors },
  { name: "Manufacturing & Production Equipment", icon: Settings },
  { name: "Fasteners & Hardware Components", icon: Nut },
  { name: "Pumps, Pipes & Fittings", icon: Pipette },
  { name: "Renewable Energy & Solar", icon: Sun },
  { name: "Industrial Safety & PPE", icon: Construction },
  { name: "Cleaning & Maintenance Equipment", icon: Brush },
  { name: "Bags, Packaging & Storage", icon: ShoppingBag },
  { name: "HVAC & Cooling Systems", icon: Wind },
  { name: "Tiles, Marble & Stone", icon: Layers },
  { name: "Plastic & Rubber Products", icon: Waves },
  { name: "Repair & Maintenance Tools", icon: Wrench },
  { name: "Hospitality & Restaurant Equipment", icon: Utensils },
  { name: "Event & Exhibition Equipment", icon: Presentation },
  { name: "Handicrafts & Handmade Products", icon: Palmtree },
  { name: "Printing Consumables & Office Tech", icon: Printer },
  { name: "Tech Gadgets", icon: Zap }
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [headerQuery, setHeaderQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [sellerSuggestions, setSellerSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { symbol, currency, isIndia, loading } = useCurrency();

  useEffect(() => {
    if (headerQuery.trim().length > 1) {
      const allProducts = getProducts();
      const allSellers = getUsers().filter(u => u.role === "seller");

      const filtered = allProducts.filter(p =>
        fuzzyMatch(p.name, headerQuery) ||
        fuzzyMatch(p.category, headerQuery) ||
        fuzzyMatch(p.sellerName, headerQuery) ||
        fuzzyMatch(p.location, headerQuery) ||
        fuzzyMatch(p.sellerType, headerQuery)
      ).slice(0, 4);

      const filteredSellers = allSellers.filter(s =>
        fuzzyMatch(s.name, headerQuery) ||
        fuzzyMatch(s.category, headerQuery) ||
        fuzzyMatch(s.location, headerQuery) ||
        fuzzyMatch(s.sellerType, headerQuery)
      ).slice(0, 3);

      setSuggestions(filtered);
      setSellerSuggestions(filteredSellers);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setSellerSuggestions([]);
      setShowSuggestions(false);
    }
  }, [headerQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const wishlistCount = user ? getUserWishlist(user.id).length : 0;

  const handleHeaderSearch = () => {
    if (headerQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(headerQuery.trim())}`);
      setHeaderQuery("");
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border transition-all duration-300">
      {/* Top bar */}
      <div className="bg-primary py-1">
        <div className="container-wide flex items-center justify-between text-[11px] font-semibold text-primary-foreground/90 tracking-wide uppercase">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-bold"><Globe className="w-3 h-3" /> India's Elite B2B & B2C Network</span>
            <span className="opacity-60 hidden md:inline-block">/</span>
            <span className="hidden md:flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[9.5px] text-white font-bold opacity-80">LIVE: 12,408 SUPPLIERS ONLINE</span>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-6">
              {user && (
                <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-wider border transition-all ${
                  isIndia
                    ? 'bg-orange-500/10 border-orange-500/20 text-orange-200'
                    : 'bg-blue-500/10 border-blue-500/20 text-blue-200'
                }`}>
                  <span>{isIndia ? '🇮🇳' : '🌍'}</span>
                  <span>{symbol} {currency}</span>
                  {loading && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
                </div>
              )}
            <Link to="/pricing" className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white hover:text-accent transition-all group">
              <Zap className="w-3 h-3 text-accent group-hover:scale-110 transition-transform" />
              Pricing
            </Link>
            <Link to="/seller/register" className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-white transition-all bg-white/20 px-3 py-1 rounded-full border border-white/20 hover:bg-white/30 hover:border-white/40 group shadow-md">
              <Globe className="w-3 h-3 text-white group-hover:rotate-12 transition-transform" />
              Sell on ZenzeTrade
            </Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container-wide flex items-center justify-between h-14 py-2 gap-2 sm:gap-6">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group relative min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl gradient-primary flex flex-shrink-0 items-center justify-center shadow-md group-hover:scale-105 transition-all duration-500 overflow-hidden relative">
            <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors" />
            <span className="text-white font-heading font-black text-sm sm:text-base tracking-tighter z-10">ZT</span>
          </div>
          <div className="flex flex-col gap-0 min-w-0">
            <div className="flex items-baseline gap-1 min-w-0">
              <span className="font-heading font-extrabold text-sm sm:text-lg text-foreground tracking-tighter leading-none group-hover:text-primary transition-colors truncate">Zenze Trade</span>
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
            </div>
            <span className="text-[7px] sm:text-[9.5px] font-bold text-muted-foreground uppercase tracking-[0.2em] sm:tracking-[0.3em] leading-none mt-0.5 truncate">Industrial Elite</span>
          </div>
        </Link>

        {/* Elite Search Component */}
        <div className="hidden lg:flex flex-1 max-w-xl mx-auto px-4 relative" ref={searchRef}>
          <div className="flex w-full items-center rounded-xl border border-border overflow-hidden bg-muted/30 focus-within:bg-background focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-500 group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />

            <div className="px-4 flex items-center text-muted-foreground group-focus-within:text-primary relative z-10 transition-colors shrink-0">
              <Search className="w-4 h-4" />
            </div>

            <input
              type="text"
              value={headerQuery}
              onChange={e => setHeaderQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleHeaderSearch()}
              onFocus={() => headerQuery.length > 1 && setShowSuggestions(true)}
              placeholder="Sourcing Elite Industrial & Consumer Products..."
              className="flex-1 min-w-0 py-2.5 pr-20 text-xs bg-transparent outline-none text-foreground placeholder:text-muted-foreground/60 font-bold uppercase tracking-wider relative z-10"
            />

            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 flex items-center">
              <button
                onClick={handleHeaderSearch}
                className="px-4 h-7 gradient-primary text-white rounded-lg font-bold text-[9px] tracking-wider uppercase shadow-md hover:scale-[1.02] active:scale-95 transition-all"
              >
                Search
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showSuggestions && (suggestions.length > 0 || sellerSuggestions.length > 0) && (
              <motion.div
                key="search-suggestions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-4 right-4 mt-2 bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[100] max-h-[85vh] overflow-y-auto custom-scrollbar"
              >
                <div className="p-2 space-y-4">
                  {/* Assets Section */}
                  {suggestions.length > 0 && (
                    <div>
                      <div className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary border-b border-border/30 mb-2 flex items-center justify-between">
                        <span>Industrial Assets</span>
                        <span className="text-[9px] text-muted-foreground/60">{suggestions.length} Nodes</span>
                      </div>
                      <div className="space-y-1">
                        {suggestions.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => {
                              navigate(`/products/${product.id}`);
                              setShowSuggestions(false);
                              setHeaderQuery("");
                            }}
                            className="w-full flex items-center gap-4 p-3 hover:bg-muted/50 rounded-2xl transition-all group text-left"
                          >
                            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-inner">
                              {product.image}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-black uppercase tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
                                {product.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-0.5 min-w-0">
                                <span className="text-xs font-bold text-primary shrink-0">{product.price}</span>
                                <span className="text-xs text-muted-foreground uppercase tracking-widest truncate opacity-80">• {product.sellerType || 'Partner'} in {product.location}</span>
                              </div>
                            </div>
                            <Zap className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-all shrink-0 pr-2" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sellers Section */}
                  {sellerSuggestions.length > 0 && (
                    <div>
                      <div className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-success border-b border-border/30 mb-2 flex items-center justify-between">
                        <span>Industrial Nodes</span>
                        <span className="text-[9px] text-muted-foreground/60">{sellerSuggestions.length} Entities</span>
                      </div>
                      <div className="space-y-1">
                        {sellerSuggestions.map((seller) => (
                          <button
                            key={seller.id}
                            onClick={() => {
                              navigate(`/seller/${seller.id}`);
                              setShowSuggestions(false);
                              setHeaderQuery("");
                            }}
                            className="w-full flex items-center gap-4 p-3 hover:bg-success/5 rounded-2xl transition-all group text-left border border-transparent hover:border-success/20"
                          >
                            <div className="w-12 h-12 rounded-xl bg-success text-white flex items-center justify-center text-sm font-black group-hover:scale-110 transition-transform shadow-lg shadow-success/10">
                              {seller.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-black uppercase tracking-tight text-foreground group-hover:text-success transition-colors truncate flex items-center gap-2">
                                {seller.name}
                                <ShieldCheck className="w-3.5 h-3.5 text-success" />
                              </h4>
                              <div className="flex items-center gap-2 mt-0.5 min-w-0">
                                <span className="text-xs font-black text-success uppercase tracking-[0.2em] px-2 py-0.5 bg-success/10 rounded-md border border-success/20">
                                  {seller.sellerType || 'Manufacturer'}
                                </span>
                                <span className="text-xs text-muted-foreground uppercase tracking-widest truncate opacity-80">• {seller.location || 'Global Hub'}</span>
                              </div>
                            </div>
                            <Globe className="w-4 h-4 text-success opacity-0 group-hover:opacity-100 transition-all shrink-0 pr-2" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleHeaderSearch}
                    className="w-full p-4 text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-2xl transition-all border-t border-border/50 flex items-center justify-center gap-2"
                  >
                    View Comprehensive Results for "{headerQuery}" <Zap className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Search Trigger (Mobile only since desktop has bar) */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-300"
          >
            <Search className="w-4.5 h-4.5" />
          </button>

          {/* Desktop & Mobile Wishlist Node */}
          <Link 
            to="/wishlist" 
            className="p-2 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-destructive relative transition-all duration-300 group/wishlist active:scale-90"
            title="My Wishlist"
          >
            <div className="absolute inset-0 bg-destructive/5 rounded-xl opacity-0 group-hover/wishlist:opacity-100 transition-opacity" />
            <Heart className="w-5 h-5 transition-all duration-300 group-hover/wishlist:scale-110" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-white text-[9px] flex items-center justify-center font-bold border border-background shadow-md shadow-destructive/20 animate-in zoom-in duration-300">
                {wishlistCount}
              </span>
            )}
          </Link>

          {user ? (
            <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className="relative group p-0.5 rounded-lg transition-all duration-500 hover:scale-105 outline-none"
                  title="Account Menu"
                >
                  <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold border-2 border-white/20 shadow-lg relative z-10 overflow-hidden transition-all ${
                    user.role === "admin" ? "bg-slate-900 border-primary/40 group-hover:border-primary" : "gradient-primary group-hover:border-primary/50"
                  }`}>
                    <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors" />
                    {user.role === "admin" ? <ShieldCheck className="w-4 h-4 text-primary" /> : user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-background z-20 shadow-md group-hover:scale-110 transition-transform ${
                    user.role === 'admin' ? 'bg-primary' : 'bg-success'
                  }`} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl border-border bg-card/95 backdrop-blur-xl shadow-2xl p-2 z-[100]">
                <div className="flex flex-col space-y-1 p-2 mb-2 border-b border-border/50">
                  <p className="text-sm font-black truncate">{user.name}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{user.role}</p>
                </div>
                <DropdownMenuItem 
                  onClick={() => {
                    setUserMenuOpen(false);
                    if (user.role === "admin") navigate("/admin");
                    else navigate(user.role === "seller" ? "/seller/dashboard" : "/buyer/dashboard");
                  }}
                  className="rounded-xl cursor-pointer text-xs font-bold p-3 focus:bg-primary/5 focus:text-primary transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 bg-border/50" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="rounded-xl cursor-pointer text-xs font-bold p-3 text-rose-500 focus:bg-rose-500/10 focus:text-rose-600 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login" className="hidden sm:block">
              <button
                className="gradient-primary text-white font-extrabold uppercase tracking-[0.15em] text-[10px] px-5 h-8 rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
              >
                Login
              </button>
            </Link>
          )}

          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-xl bg-muted text-foreground transition-all duration-300">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Categories Dropdown Bar */}
      <div className="hidden lg:block border-t border-border bg-muted/20">
        <div className="container-wide flex items-center justify-between py-1.5 gap-2 xl:gap-6">
          <div className="flex items-center gap-2 xl:gap-4 min-w-0 flex-1">
            <button 
              onClick={() => setCatOpen(!catOpen)}
              className="flex items-center gap-1.5 xl:gap-2 px-3.5 xl:px-4 py-1.5 text-[10px] font-extrabold tracking-wider text-white gradient-primary rounded-lg border border-primary/30 hover:scale-[1.02] active:scale-95 transition-all duration-300 group shadow-md relative overflow-hidden shrink-0"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex flex-col gap-[2px] relative z-10">
                <div className="w-3 h-0.5 bg-white rounded-full" />
                <div className="w-2 h-0.5 bg-white/70 rounded-full" />
                <div className="w-1 h-0.5 bg-white/40 rounded-full" />
              </div>
              <span className="relative z-10">All Categories</span>
              <ChevronDown className={`w-2.5 h-2.5 relative z-10 opacity-80 transition-all duration-300 ${catOpen ? 'rotate-180 opacity-100' : 'rotate-0'}`} />
            </button>

            {/* Elite Navigation Links */}
            <div className="flex flex-1 items-center justify-evenly flex-wrap gap-1 xl:gap-2 min-w-0 px-2 xl:px-4">
              {[
                { to: "/products?sort=trending", label: "Trending", icon: Zap, iconClass: "text-accent" },
                { to: "/products?sort=newest", label: "New Arrivals", dot: true },
                { to: "/categories", label: "Top Categories", icon: Layers, iconClass: "text-primary/60" },
                { to: "/contact", label: "Contact Us", icon: Sparkles, iconClass: "text-primary/60" },
              ].map((link, idx) => (
                <Link
                  key={idx}
                  to={link.to}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full transition-all duration-300 group shrink-0 whitespace-nowrap"
                >
                  {link.icon && <link.icon className={`w-3 h-3 ${link.iconClass} group-hover:scale-110 transition-transform`} />}
                  {link.dot && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center shrink-0">
            <Link
              to="/inquiry"
              className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-accent flex items-center gap-1.5 px-3.5 xl:px-5 py-1.5 rounded-lg border border-accent/20 bg-accent/5 hover:bg-accent hover:text-white transition-all duration-300 group shadow-md active:scale-95 whitespace-nowrap"
            >
              <Sparkles className="w-3 h-3 text-accent group-hover:text-white group-hover:scale-110 group-hover:rotate-12 transition-all shrink-0" />
              <span className="hidden xl:inline">Request for Quote</span>
              <span className="xl:hidden">RFQ</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Immersive Full-Screen Categories Mega Menu */}
      <AnimatePresence>
        {catOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <div
              className="absolute top-full left-0 right-0 w-screen h-[200vh] bg-black/20 backdrop-blur-sm z-[998]"
              onClick={() => setCatOpen(false)}
            />

            {/* Viewport Popover Card */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full left-0 right-0 w-full bg-card border-b border-border shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] z-[999] overflow-hidden rounded-b-[2rem]"
            >
              <div className="container-wide py-5 px-6">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left Column: 4-Column Categories Grid (75% Width) */}
                  <div className="flex-1 lg:max-w-[75%] border-r border-border/40 pr-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Layers className="w-4 h-4 text-primary" />
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                        Industrial Segments
                      </h3>
                      <span className="text-[9px] text-muted-foreground/60 font-bold uppercase tracking-wider">
                        • 36 active nodes
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-x-6 gap-y-1">
                      {allCategories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <Link
                            key={cat.name}
                            to={`/products?category=${encodeURIComponent(cat.name)}`}
                            onClick={() => setCatOpen(false)}
                            className="flex items-center gap-2 py-1 px-2.5 rounded-lg hover:bg-muted transition-all text-left group"
                          >
                            <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center shrink-0">
                              <Icon className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                            </div>
                            <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wide text-muted-foreground group-hover:text-foreground transition-colors leading-tight truncate">
                              {cat.name}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Elite Brands Grid & RFQ Mini-Banner (25% Width) */}
                  <div className="w-full lg:max-w-[25%] flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-accent">
                          Elite Brands
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                        {[
                          "Bharat Machines",
                          "Surat Textiles Co",
                          "Green Agri Solutions",
                          "Bright Electronics",
                          "Tata Steel Traders",
                          "MedPharma Ltd",
                          "L&T Engineering",
                          "JSW Steel"
                        ].map((brand) => (
                          <Link
                            key={brand}
                            to={`/products?q=${encodeURIComponent(brand)}`}
                            onClick={() => setCatOpen(false)}
                            className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-muted transition-all group text-left"
                          >
                            <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-muted-foreground group-hover:text-accent transition-colors truncate">
                              {brand}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 ml-1" />
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* RFQ Mini-Banner Card */}
                    <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-violet-600/5 p-4 flex flex-col gap-2 mt-2">
                      <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent">
                        Custom RFQ Sourcing
                      </span>
                      <h4 className="text-[11px] font-black uppercase tracking-tight text-foreground leading-snug">
                        Need tailored custom quotes?
                      </h4>
                      <p className="text-[9.5px] text-muted-foreground font-medium leading-relaxed">
                        Broadcast your spec requirements live to verified matching sellers in 60 seconds.
                      </p>
                      <Link
                        to="/inquiry"
                        onClick={() => setCatOpen(false)}
                        className="mt-1 flex items-center justify-center gap-1.5 py-1.5 w-full bg-accent hover:bg-accent/90 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md transition-all active:scale-95"
                      >
                        <Sparkles className="w-3 h-3" /> Get Custom Quotes
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile search */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-visible border-t border-border bg-card relative" ref={mobileSearchRef}>
            <div className="container-wide py-4 px-4">
              <div className="flex rounded-2xl border border-border bg-muted/50 p-1 relative overflow-hidden">
                <input
                  type="text"
                  value={headerQuery}
                  onChange={e => setHeaderQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleHeaderSearch()}
                  onFocus={() => headerQuery.length > 1 && setShowSuggestions(true)}
                  placeholder="Search products..."
                  className="flex-1 min-w-0 px-4 py-2.5 text-sm bg-transparent outline-none"
                />
                <button onClick={handleHeaderSearch} className="px-5 gradient-primary text-white rounded-xl font-bold shrink-0"><Search className="w-4 h-4" /></button>
              </div>

              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-4 right-4 mt-2 bg-card border border-border rounded-2xl shadow-2xl z-[100] overflow-hidden"
                  >
                    <div className="p-2">
                      {suggestions.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => {
                            navigate(`/products/${product.id}`);
                            setShowSuggestions(false);
                            setSearchOpen(false);
                            setHeaderQuery("");
                          }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-xl transition-all text-left"
                        >
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl shrink-0">
                            {product.image}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-foreground truncate">{product.name}</h4>
                            <p className="text-xs text-primary font-bold">{product.price}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute top-full inset-x-0 h-[100dvh] z-40 bg-card overflow-y-auto pb-40 lg:hidden border-t border-border shadow-2xl"
          >
            <nav className="container-wide py-6 flex flex-col gap-6 px-6">
              {/* Dynamic Currency Selector */}
              <div className="flex items-center justify-between bg-muted/30 p-4 rounded-2xl border border-border/50">
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Market Node</span>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                  isIndia
                    ? 'bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-200'
                    : 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-200'
                }`}>
                  <span>{isIndia ? '🇮🇳' : '🌍'}</span>
                  <span>{symbol} {currency}</span>
                  {loading && <span className="w-2 h-2 rounded-full bg-current animate-pulse" />}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Market Explore</h3>
                <div className="grid grid-cols-1 gap-2">
                  <Link to="/products?sort=trending" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-4 text-sm font-bold text-foreground bg-muted/50 rounded-2xl hover:bg-primary/10 hover:text-primary transition-colors group">
                    <Zap className="w-5 h-5 text-accent animate-pulse" /> Trending Products
                  </Link>
                  <Link to="/products?sort=newest" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-4 text-sm font-bold text-foreground bg-muted/50 rounded-2xl hover:bg-primary/10 hover:text-primary transition-colors group">
                    <div className="w-5 h-5 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-primary animate-pulse" /></div> New Arrivals
                  </Link>
                  <Link to="/categories" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-4 text-sm font-bold text-foreground bg-muted/50 rounded-2xl hover:bg-primary/10 hover:text-primary transition-colors group">
                    <Layers className="w-5 h-5 text-primary" /> Top Categories
                  </Link>
                  <Link to="/pricing" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-4 text-sm font-bold text-foreground bg-muted/50 rounded-2xl hover:bg-primary/10 hover:text-primary transition-colors group">
                    <Zap className="w-5 h-5 text-accent" /> Premium Pricing
                  </Link>
                  <Link to="/seller/register" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-4 text-sm font-bold text-foreground bg-muted/50 rounded-2xl hover:bg-primary/10 hover:text-primary transition-colors group">
                    <Globe className="w-5 h-5 text-primary" /> Sell on ZenzeTrade
                  </Link>
                  <Link to="/contact" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-4 text-sm font-bold text-foreground bg-muted/50 rounded-2xl hover:bg-primary/10 hover:text-primary transition-colors group">
                    <Sparkles className="w-5 h-5 text-primary animate-pulse" /> Contact Us
                  </Link>
                  <Link to="/blog" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-4 text-sm font-bold text-foreground bg-muted/50 rounded-2xl hover:bg-primary/10 hover:text-primary transition-colors group">
                    <BookOpen className="w-5 h-5 text-primary" /> Industry Blog
                  </Link>
                </div>
              </div>

              <div className="h-px bg-border my-2" />

              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Industrial Categories</h3>
                <div className="grid grid-cols-2 gap-2">
                  {allCategories.slice(0, 10).map(cat => (
                    <Link
                      key={cat.name}
                      to={`/products?category=${encodeURIComponent(cat.name)}`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 p-3 text-sm font-medium text-foreground bg-muted/50 rounded-2xl hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      <cat.icon className="w-4 h-4 text-primary" />
                      <span className="truncate">{cat.name}</span>
                    </Link>
                  ))}
                  <Link to="/categories" onClick={() => setMobileOpen(false)} className="col-span-2 text-center py-3 text-sm font-bold text-primary hover:bg-primary/5 rounded-2xl border border-dashed border-primary/30">
                    View All Explore
                  </Link>
                </div>
              </div>

              <div className="h-px bg-border" />

              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Account & More</h3>

                <Link
                  to="/inquiry"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2.5 py-3 px-4 text-xs font-black text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-xl hover:opacity-95 transition-all shadow-md shadow-amber-500/20 active:scale-98 tracking-wider uppercase mb-2"
                >
                  <Sparkles className="w-4 h-4 text-white" /> REQUEST FOR QUOTE
                </Link>

                {user ? (
                  <div className="flex flex-col gap-2">
                    <div className="p-4 bg-muted/30 rounded-2xl flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg border-2 border-white/20">
                        <div className="w-full h-full gradient-primary flex items-center justify-center text-white font-black text-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-foreground tracking-tight">{user.name}</span>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">Verified {user.role === 'admin' ? 'Command Node' : 'Market Node'}</span>
                      </div>
                    </div>

                    {user.role === "admin" && (
                      <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-4 p-4 text-sm font-black text-primary hover:bg-primary/5 bg-primary/5 border border-primary/20 rounded-2xl transition-all">
                        <ShieldCheck className="w-5 h-5 text-primary" /> ADMIN PANEL
                      </Link>
                    )}
                    {user.role === "seller" && (
                      <Link to="/seller/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-4 p-4 text-sm font-black text-foreground hover:bg-muted bg-muted/20 rounded-2xl transition-all">
                        <LayoutDashboard className="w-5 h-5 text-primary" /> DASHBOARD
                      </Link>
                    )}
                    <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center gap-4 p-4 text-sm font-black text-foreground hover:bg-muted bg-muted/20 rounded-2xl transition-all">
                      <Heart className="w-5 h-5 text-accent" /> MY WISHLIST
                    </Link>

                    {/* For Admin, show login options too */}
                    {user.role === "admin" && (
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center p-4 text-[10px] font-black uppercase tracking-widest text-foreground bg-muted hover:bg-muted/80 rounded-2xl transition-all">User Login</Link>
                        <Link to="/register" onClick={() => setMobileOpen(false)} className="flex items-center justify-center p-4 text-[10px] font-black uppercase tracking-widest text-white gradient-primary rounded-2xl shadow-xl">Join Now</Link>
                      </div>
                    )}

                    <button
                      onClick={() => { handleLogout(); setMobileOpen(false); }}
                      className="flex items-center gap-4 p-4 text-sm font-black text-destructive hover:bg-destructive/10 bg-destructive/5 rounded-2xl transition-all text-left mt-2"
                    >
                      <LogOut className="w-5 h-5" /> SIGN OUT
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center p-5 text-xs font-black uppercase tracking-widest text-foreground bg-muted hover:bg-muted/80 rounded-[2rem] transition-all">Login</Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="flex items-center justify-center p-5 text-xs font-black uppercase tracking-widest text-white gradient-primary rounded-[2rem] shadow-xl hover:scale-105 active:scale-95 transition-all">Join Now</Link>
                  </div>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
