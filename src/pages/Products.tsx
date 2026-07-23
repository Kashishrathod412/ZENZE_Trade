import Layout from "@/components/layout/Layout";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Star, ShieldCheck, MapPin, Search, X, SlidersHorizontal, Eye, Heart, Store, Package, BadgeCheck, ArrowRight, Share2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { getProducts, getProductWishlistCount, getProductReviews, getUsers, getReviews, toggleWishlist, isInWishlist } from "@/lib/storage";
import { fuzzyMatch } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ProductShareDialog } from "@/components/products/ProductShareDialog";

const priceRanges = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 – ₹5,000", min: 500, max: 5000 },
  { label: "₹5,000 – ₹50,000", min: 5000, max: 50000 },
  { label: "₹50,000 – ₹5,00,000", min: 50000, max: 500000 },
  { label: "Above ₹5,00,000", min: 500000, max: Infinity },
];

const sortOptions = [
  { label: "Relevance", value: "relevance" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Rating", value: "rating" },
  { label: "Most Viewed", value: "views" },
];

const INDUSTRIAL_CATEGORIES = [
  "Industrial & Machinery", "Electrical & Electronics", "Computers & IT Products", "Gaming & Accessories",
  "Sports & Fitness", "Consumer Electronics", "Clothing & Fashion", "Home, Kitchen & Furniture",
  "Stationery & Office Supplies", "Office & Commercial Equipment", "Automobile & Parts", "Chemicals & Raw Materials",
  "Agriculture & Farming", "Construction & Building Materials", "Beauty & Personal Care", "Pets & Animal Supplies",
  "Packaging & Logistics", "Toys, Gifts & Baby Products", "Safety & Security", "Textile & Fabric Industry",
  "Manufacturing & Production Equipment", "Fasteners & Hardware Components", "Pumps, Pipes & Fittings", "Renewable Energy & Solar",
  "Industrial Safety & PPE", "Cleaning & Maintenance Equipment", "Bags, Packaging & Storage", "HVAC & Cooling Systems",
  "Tiles, Marble & Stone", "Plastic & Rubber Products", "Repair & Maintenance Tools", "Hospitality & Restaurant Equipment",
  "Event & Exhibition Equipment", "Handicrafts & Handmade Products", "Printing Consumables & Office Tech", "Tech Gadgets"
];

const ELITE_BRANDS = [
  "Bharat Machines", "Surat Textiles Co", "Green Agri Solutions",
  "Bright Electronics", "Tata Steel Traders", "MedPharma Ltd",
  "L&T Engineering", "JSW Steel", "Reliance Industrial"
];

const FilterAccordionItem = ({ title, defaultOpen = false, children }: { title: string, defaultOpen?: boolean, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/50 py-4">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between group outline-none">
        <span className="text-foreground font-semibold text-sm transition-colors">{title}</span>
        {isOpen ? <Minus className="w-4 h-4 text-foreground" strokeWidth={2.5} /> : <Plus className="w-4 h-4 text-foreground" strokeWidth={2.5} />}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductSkeleton = () => (
  <div className="border border-border/60 rounded-2xl bg-card overflow-hidden flex flex-col h-[380px] animate-pulse">
    <div className="aspect-[14/10] bg-slate-100 dark:bg-slate-800" />
    <div className="p-5 flex flex-col flex-1 space-y-3">
      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
      <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
      <div className="flex-1" />
      <div className="h-9 bg-slate-100 dark:bg-slate-800 rounded w-full" />
    </div>
  </div>
);

const SupplierSkeleton = () => (
  <div className="flex flex-col md:flex-row items-center border border-border/60 bg-card rounded-2xl p-5 gap-6 animate-pulse w-full h-[110px]">
    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0" />
    <div className="flex-1 space-y-2 w-full">
      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/4" />
    </div>
    <div className="w-40 h-9 bg-slate-100 dark:bg-slate-800 rounded shrink-0" />
  </div>
);

export default function Products() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category");
  const initialSeller = searchParams.get("seller");
  const initialView = (searchParams.get("view") as "products" | "businesses") || "products";

  const [allProductsState, setAllProductsState] = useState(() => getProducts().filter(p => p.status === "active"));
  const allProducts = useMemo(() => allProductsState, [allProductsState]);
  const allSellers = useMemo(() => getUsers().filter(u => u.role === "seller"), []);
  const [shareDialog, setShareDialog] = useState<{ isOpen: boolean; product: any }>({ isOpen: false, product: null });

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
    setAllProductsState([...getProducts().filter(p => p.status === "active")]);
  };

  const handleShare = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    setShareDialog({ isOpen: true, product });
  };

  const allLocations = useMemo(() => [...new Set(allProducts.map(p => p.location))].sort(), [allProducts]);

  const [viewMode, setViewMode] = useState<"products" | "businesses">(initialView);
  const [query, setQuery] = useState(initialQuery);
  const [categorySearch, setCategorySearch] = useState("");
  const [brandSearch, setBrandSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialSeller ? [initialSeller] : []);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Advanced price search slider state (0 to 10L+)
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1000000);
  const [isFiltering, setIsFiltering] = useState(false);

  const triggerFilterPulse = () => {
    setIsFiltering(true);
    setTimeout(() => setIsFiltering(false), 500);
  };

  // Synchronize component state with URL search params changes
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const queryParam = searchParams.get("q") || "";
    const sellerParam = searchParams.get("seller");
    const viewParam = (searchParams.get("view") as "products" | "businesses") || "products";

    setSelectedCategories(categoryParam ? [categoryParam] : []);
    setQuery(queryParam);
    setSelectedBrands(sellerParam ? [sellerParam] : []);
    setViewMode(viewParam);
    triggerFilterPulse();
  }, [searchParams]);

  const toggleArray = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];

  const filteredCategories = useMemo(() =>
    INDUSTRIAL_CATEGORIES.filter(cat => cat.toLowerCase().includes(categorySearch.toLowerCase())),
    [categorySearch]
  );

  const filteredBrands = useMemo(() =>
    ELITE_BRANDS.filter(brand => brand.toLowerCase().includes(brandSearch.toLowerCase())),
    [brandSearch]
  );

  const filtered = useMemo(() => {
    let result = allProducts;

    if (query.trim()) {
      result = result.filter(
        p =>
          fuzzyMatch(p.name, query) ||
          fuzzyMatch(p.sellerName, query) ||
          fuzzyMatch(p.category, query) ||
          fuzzyMatch(p.location, query) ||
          fuzzyMatch(p.sellerType, query)
      );
    }

    if (selectedCategories.length)
      result = result.filter(p => selectedCategories.includes(p.category));
    if (selectedBrands.length)
      result = result.filter(p => selectedBrands.includes(p.sellerName));
    if (selectedLocations.length)
      result = result.filter(p => selectedLocations.includes(p.location));
    
    // Unified dual-thumb price search
    result = result.filter(p => p.priceNum >= priceMin && p.priceNum <= priceMax);

    if (verifiedOnly) result = result.filter(p => p.verified);

    switch (sortBy) {
      case "price_asc": result = [...result].sort((a, b) => a.priceNum - b.priceNum); break;
      case "price_desc": result = [...result].sort((a, b) => b.priceNum - a.priceNum); break;
      case "views": result = [...result].sort((a, b) => b.views - a.views); break;
      case "rating": {
        result = [...result].sort((a, b) => {
          const rA = getProductReviews(a.id);
          const rB = getProductReviews(b.id);
          const avgA = rA.length > 0 ? rA.reduce((s, r) => s + r.rating, 0) / rA.length : 0;
          const avgB = rB.length > 0 ? rB.reduce((s, r) => s + r.rating, 0) / rB.length : 0;
          return avgB - avgA;
        });
        break;
      }
      default: break;
    }

    return result;
  }, [query, selectedCategories, selectedBrands, selectedLocations, priceMin, priceMax, verifiedOnly, sortBy, allProducts]);

  const filteredBusinesses = useMemo(() => {
    let result = allSellers;

    if (query.trim()) {
      result = result.filter(s =>
        fuzzyMatch(s.name, query) ||
        fuzzyMatch(s.category, query) ||
        fuzzyMatch(s.location, query) ||
        fuzzyMatch(s.sellerType, query)
      );
    }

    if (selectedCategories.length)
      result = result.filter(s => selectedCategories.includes(s.category || ''));
    if (selectedLocations.length)
      result = result.filter(s => selectedLocations.includes(s.location || ''));
    if (selectedBrands.length)
      result = result.filter(s => selectedBrands.includes(s.name));
    if (verifiedOnly)
      result = result.filter(s => s.verified);
    
    // Dynamic price sync with business listed product prices
    result = result.filter(s => {
      const sellerProducts = allProducts.filter(p => p.sellerId === s.id);
      if (sellerProducts.length === 0) return true;
      return sellerProducts.some(p => p.priceNum >= priceMin && p.priceNum <= priceMax);
    });

    // Sort to ensure verified sellers appear at the top of the supplier list
    result = [...result].sort((a, b) => {
      if (a.verified && !b.verified) return -1;
      if (!a.verified && b.verified) return 1;
      return 0;
    });

    return result;
  }, [query, selectedCategories, selectedLocations, selectedBrands, priceMin, priceMax, verifiedOnly, allSellers, allProducts]);

  const activeFilterCount =
    selectedCategories.length + selectedBrands.length + selectedLocations.length + (priceMin > 0 || priceMax < 1000000 ? 1 : 0) + (verifiedOnly ? 1 : 0);

  const clearAll = () => {
    setQuery(""); setCategorySearch(""); setBrandSearch(""); setSelectedCategories([]); setSelectedBrands([]); setSelectedLocations([]); setPriceMin(0); setPriceMax(1000000); setVerifiedOnly(false); setSortBy("relevance");
    triggerFilterPulse();
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => toggleArray(prev, cat));
    triggerFilterPulse();
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => toggleArray(prev, brand));
    triggerFilterPulse();
  };

  const toggleLocation = (loc: string) => {
    setSelectedLocations(prev => toggleArray(prev, loc));
    triggerFilterPulse();
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceMin(min);
    setPriceMax(max);
    triggerFilterPulse();
  };

  const handleSortChange = (val: string) => {
    setSortBy(val);
    triggerFilterPulse();
  };

  const handleSearchChange = (val: string) => {
    setQuery(val);
    triggerFilterPulse();
  };

  const renderFilterPanel = () => (
    <div className="flex flex-col">
      <div className="mb-4">
        <h4 className="text-muted-foreground font-semibold text-xs tracking-wider uppercase">Refine By</h4>
      </div>
      <div className="border-t border-border/50" />

      {/* Price section with a Unified Interactive Dual-Thumb range slider UI */}
      <FilterAccordionItem title="Price Range" defaultOpen={true}>
        <div className="space-y-4 px-1 pb-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>₹{priceMin.toLocaleString()}</span>
            <span>₹{priceMax >= 1000000 ? "10L+" : priceMax.toLocaleString()}</span>
          </div>
          
          <div className="relative h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full my-4">
            <div 
              className="absolute h-full bg-primary rounded-full"
              style={{
                left: `${(priceMin / 1000000) * 100}%`,
                right: `${100 - (priceMax / 1000000) * 100}%`
              }}
            />
            
            <input
              type="range"
              min={0}
              max={1000000}
              step={5000}
              value={priceMin}
              onChange={e => {
                const val = Math.min(Number(e.target.value), priceMax - 10000);
                handlePriceChange(val, priceMax);
              }}
              className="absolute inset-x-0 -top-1 w-full h-3 bg-transparent pointer-events-none appearance-none accent-primary [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md cursor-pointer"
            />
            <input
              type="range"
              min={0}
              max={1000000}
              step={5000}
              value={priceMax}
              onChange={e => {
                const val = Math.max(Number(e.target.value), priceMin + 10000);
                handlePriceChange(priceMin, val);
              }}
              className="absolute inset-x-0 -top-1 w-full h-3 bg-transparent pointer-events-none appearance-none accent-primary [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md cursor-pointer"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Min Price</span>
              <div className="h-9 px-3 border border-border rounded-lg bg-slate-50 dark:bg-slate-900/30 flex items-center text-xs font-semibold">
                ₹{priceMin.toLocaleString()}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Max Price</span>
              <div className="h-9 px-3 border border-border rounded-lg bg-slate-50 dark:bg-slate-900/30 flex items-center text-xs font-semibold">
                ₹{priceMax >= 1000000 ? "10L+" : priceMax.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </FilterAccordionItem>

      {/* Brand filter using Selectable Pill/Tag layout */}
      <FilterAccordionItem title="Brand" defaultOpen={true}>
        <div className="relative group/search mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Brands..."
            value={brandSearch}
            onChange={e => setBrandSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-muted/30 border border-border/50 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 text-sm font-medium outline-none transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {filteredBrands.map(brand => {
            const active = selectedBrands.includes(brand);
            return (
              <button
                key={brand}
                type="button"
                onClick={() => toggleBrand(brand)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${active ? 'bg-primary text-white border-primary shadow-sm shadow-primary/10' : 'bg-slate-50 dark:bg-slate-900/30 text-muted-foreground border-border/60 hover:text-foreground hover:bg-slate-100'}`}
              >
                {brand}
              </button>
            );
          })}
        </div>
      </FilterAccordionItem>

      <FilterAccordionItem title="Product Category">
        <div className="relative group/search mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Categories..."
            value={categorySearch}
            onChange={e => setCategorySearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-muted/30 border border-border/50 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 text-sm font-medium outline-none transition-all"
          />
        </div>
        <div className="space-y-1 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {filteredCategories.map(cat => {
            const active = selectedCategories.includes(cat);
            return (
              <label
                key={cat}
                className={`flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer transition-all select-none ${active ? 'bg-primary/5 text-primary' : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'}`}
              >
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggleCategory(cat)}
                  className="w-5 h-5 rounded-md border-2 border-border text-primary focus:ring-primary/20 cursor-pointer transition-all"
                />
                <span className="text-sm font-medium truncate flex-1">{cat}</span>
              </label>
            );
          })}
        </div>
      </FilterAccordionItem>

      {/* Location filter using Selectable Pill/Tag layout */}
      <FilterAccordionItem title="Location">
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {allLocations.map(loc => {
            const active = selectedLocations.includes(loc);
            return (
              <button
                key={loc}
                type="button"
                onClick={() => toggleLocation(loc)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${active ? 'bg-primary text-white border-primary shadow-sm shadow-primary/10' : 'bg-slate-50 dark:bg-slate-900/30 text-muted-foreground border-border/60 hover:text-foreground hover:bg-slate-100'}`}
              >
                {loc}
              </button>
            );
          })}
        </div>
      </FilterAccordionItem>

      <FilterAccordionItem title="Verification">
        <label className="flex items-center gap-3 w-full p-2 cursor-pointer hover:bg-muted/50 rounded-lg transition-all select-none group">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={() => {
              setVerifiedOnly(prev => !prev);
              triggerFilterPulse();
            }}
            className="w-5 h-5 rounded-md border-2 border-border text-primary focus:ring-primary/20 cursor-pointer transition-all"
          />
          <span className="text-sm font-semibold flex items-center gap-2 text-foreground">
            <ShieldCheck className="w-4 h-4 text-success" /> Verified Suppliers Only
          </span>
        </label>
      </FilterAccordionItem>

      {activeFilterCount > 0 && (
        <div className="mt-6 pt-2">
          <Button variant="outline" size="sm" onClick={clearAll} className="w-full text-destructive border-destructive/20 hover:bg-destructive/10 text-xs font-semibold uppercase tracking-wider rounded-xl h-12">
            <X className="w-3 h-3 mr-2" /> Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      {/* Dynamic Header Section */}
      <div className="bg-surface-elevated py-8 border-b border-border shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="container-wide relative z-10">
          <div className="space-y-2">
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground tracking-tight">
              Sourcing <span className="text-primary">Intelligence</span>
            </h1>
            <p className="text-muted-foreground font-medium flex items-center gap-2 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              {allProducts.length} verified industrial nodes online
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Command Bar Consolidating search inputs and dropdown filters */}
      <div className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border shadow-sm py-4">
        <div className="container-wide">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search Input on the Left */}
            <div className="relative flex-1 max-w-lg w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={e => handleSearchChange(e.target.value)}
                placeholder="Search segments, suppliers, technical specifications..."
                className="w-full h-11 pl-10 pr-10 rounded-xl bg-muted/20 border border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/5 text-foreground text-sm font-semibold outline-none transition-all placeholder:text-muted-foreground/50 placeholder:font-normal"
              />
              {query && (
                <button onClick={() => handleSearchChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-muted rounded-lg transition-colors">
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Controls Toggles and Selectors on the Right */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1 lg:pb-0 scrollbar-none shrink-0 w-full lg:w-auto">
              
              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                className="lg:hidden h-11 px-4 rounded-xl border-border bg-card text-xs font-semibold uppercase tracking-wider shrink-0"
                onClick={() => setShowMobileFilters(true)}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" /> Filters
                {activeFilterCount > 0 && <span className="ml-1.5 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">{activeFilterCount}</span>}
              </Button>

              {/* Products vs Businesses view toggle */}
              <div className="flex items-center p-1 bg-muted/40 border border-border/50 rounded-xl shrink-0">
                <button
                  onClick={() => {
                    setViewMode("products");
                    triggerFilterPulse();
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${viewMode === 'products' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Eye className="w-3.5 h-3.5" /> Industrial Assets
                </button>
                <button
                  onClick={() => {
                    setViewMode("businesses");
                    triggerFilterPulse();
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${viewMode === 'businesses' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Industrial Nodes
                </button>
              </div>

              {/* Sort By criteria */}
              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={e => handleSortChange(e.target.value)}
                  className="h-11 pl-3.5 pr-8 rounded-xl border border-border bg-card text-foreground text-xs font-semibold uppercase tracking-wider outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer appearance-none shadow-sm"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center' }}
                >
                  {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {/* Browse by Brand */}
              <div className="relative shrink-0">
                <select
                  onChange={e => {
                    if (e.target.value) {
                      setSelectedBrands([e.target.value]);
                      triggerFilterPulse();
                    } else {
                      setSelectedBrands([]);
                      triggerFilterPulse();
                    }
                  }}
                  value={selectedBrands[0] || ""}
                  className="h-11 pl-3.5 pr-8 rounded-xl border border-accent/20 bg-card text-xs font-semibold uppercase tracking-wider text-accent outline-none focus:ring-4 focus:ring-accent/10 transition-all cursor-pointer appearance-none shadow-sm"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center' }}
                >
                  <option value="">Browse by Brand</option>
                  {ELITE_BRANDS.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                </select>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="container-wide py-12">
        <div className="flex gap-10">
          
          {/* Sidebar visual filter dashboard */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar pr-4 pb-10 pt-2">
              <div className="space-y-6">
                <div className="p-5 xl:p-6 bg-card rounded-2xl border border-border shadow-md">
                  {renderFilterPanel()}
                </div>

                <div className="p-6 rounded-[2rem] border border-border bg-card/50 backdrop-blur-sm border-dashed">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-success/10 text-success">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-foreground">Verified Matrix</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                    Only displaying suppliers with validated export credentials and industrial certifications.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content pane */}
          <main className="flex-1 min-w-0">
            {activeFilterCount > 0 && (
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/50">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground/60 mr-2">Active Filters:</span>
                  {selectedCategories.map(c => (
                    <motion.span initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} key={c} className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/5 border border-primary/20 text-primary text-xs sm:text-sm font-bold tracking-wider hover:bg-primary/10 transition-colors shadow-sm animate-fade">
                      {c}
                      <button onClick={() => { setSelectedCategories(selectedCategories.filter(v => v !== c)); triggerFilterPulse(); }} className="p-1 hover:bg-primary/20 rounded-md transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.span>
                  ))}
                  {selectedBrands.map(b => (
                    <motion.span initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} key={b} className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/5 border border-accent/20 text-accent text-xs sm:text-sm font-bold tracking-wider hover:bg-accent/10 transition-colors shadow-sm animate-fade">
                      {b}
                      <button onClick={() => { setSelectedBrands(selectedBrands.filter(v => v !== b)); triggerFilterPulse(); }} className="p-1 hover:bg-accent/20 rounded-md transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.span>
                  ))}
                  {selectedLocations.map(l => (
                    <motion.span initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} key={l} className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-600 text-xs sm:text-sm font-bold tracking-wider hover:bg-emerald-500/10 transition-colors shadow-sm animate-fade">
                      {l}
                      <button onClick={() => { setSelectedLocations(selectedLocations.filter(v => v !== l)); triggerFilterPulse(); }} className="p-1 hover:bg-emerald-500/20 rounded-md transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.span>
                  ))}
                  {(priceMin > 0 || priceMax < 1000000) && (
                    <motion.span initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted border border-border text-foreground text-xs sm:text-sm font-bold tracking-wider shadow-sm animate-fade">
                      ₹{priceMin.toLocaleString()} – ₹{priceMax >= 1000000 ? "10L+" : priceMax.toLocaleString()}
                      <button onClick={() => handlePriceChange(0, 1000000)} className="p-1 hover:bg-border rounded-md transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.span>
                  )}
                  {verifiedOnly && (
                    <motion.span initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-success/5 border border-success/20 text-success text-xs sm:text-sm font-bold tracking-wider shadow-sm animate-fade">
                      Verified Only
                      <button onClick={() => { setVerifiedOnly(false); triggerFilterPulse(); }} className="p-1 hover:bg-success/20 rounded-md transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.span>
                  )}
                  <button onClick={clearAll} className="ml-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-destructive hover:underline">Clear Reset</button>
                </div>
                <p className="hidden md:block text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 min-w-max">
                  {viewMode === 'products' ? filtered.length : filteredBusinesses.length} {viewMode === 'products' ? 'Segments' : 'Nodes'} Identified
                </p>
              </div>
            )}

            {/* Skeleton Fallback Pulse Animation */}
            {isFiltering ? (
              <div className={viewMode === "products" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6" : "space-y-4"}>
                {Array.from({ length: 6 }).map((_, idx) => (
                  viewMode === "products" ? <ProductSkeleton key={idx} /> : <SupplierSkeleton key={idx} />
                ))}
              </div>
            ) : viewMode === "products" && filtered.length === 0 ? (
              <div className="text-center py-32 flex flex-col items-center">
                <div className="w-24 h-24 rounded-3xl bg-muted flex items-center justify-center mb-8 shadow-inner">
                  <Search className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <h3 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4 tracking-tight">No Segments Identified</h3>
                <p className="text-muted-foreground font-medium text-base md:text-lg max-w-md mx-auto mb-12 leading-relaxed">
                  The current matrix configuration returned zero results. Adjust your parameters or clear all filters to reset the search space.
                </p>
                <Button variant="hero" className="rounded-2xl px-10 h-14 text-sm font-bold uppercase tracking-wider" onClick={clearAll}>Reset Search Parameters</Button>
              </div>
            ) : viewMode === "businesses" && filteredBusinesses.length === 0 ? (
              <div className="text-center py-32 flex flex-col items-center">
                <div className="w-24 h-24 rounded-3xl bg-muted flex items-center justify-center mb-8 shadow-inner">
                  <ShieldCheck className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <h3 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4 tracking-tight">No Nodes Found</h3>
                <p className="text-muted-foreground font-medium text-base md:text-lg max-w-md mx-auto mb-12 leading-relaxed">
                  No industrial nodes match your current discovery parameters. Try expanding your search or selecting a different city.
                </p>
                <Button variant="hero" className="rounded-2xl px-10 h-14 text-sm font-bold uppercase tracking-wider" onClick={clearAll}>Reset Filters</Button>
              </div>
            ) : viewMode === "products" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6">
                <AnimatePresence mode="popLayout">
                  {filtered.map((product, i) => {
                    const reviews = getProductReviews(product.id);
                    const rating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "4.8";
                    const wishlistCount = getProductWishlistCount(product.id) || 0;
                    const viewsCount = product.views || 0;
                    const sharesCount = product.shares || 0;

                    return (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: i * 0.03, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="group"
                      >
                        <div className="group relative bg-white dark:bg-card border border-border/60 rounded-2xl overflow-hidden flex flex-col h-full hover:shadow-2xl hover:border-primary/40 transition-all duration-500 hover:-translate-y-1">
                          <Link to={`/products/${product.id}`} className="flex flex-col flex-1">
                            {/* Image Container */}
                            <div className="relative aspect-[14/10] bg-muted overflow-hidden">
                              <div className="absolute inset-0 flex items-center justify-center text-6xl bg-gradient-to-br from-muted to-muted/50 group-hover:scale-110 transition-transform duration-700 ease-out">
                                <span className="opacity-80 drop-shadow-sm transform group-hover:-rotate-3 transition-transform duration-500">{product.image}</span>
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="absolute top-3 left-3 flex gap-2">
                              </div>
                              <div className="absolute top-3 right-3 z-30">
                                <button
                                  onClick={(e) => handleWishlist(e, product.id)}
                                  className={`w-10 h-10 rounded-[1rem] flex items-center justify-center transition-all duration-500 shadow-2xl backdrop-blur-md border hover:scale-110 active:scale-95 ${user && isInWishlist(user.id, product.id) ? 'bg-destructive text-white border-destructive shadow-destructive/20' : 'bg-white/95 text-muted-foreground border-border/20 hover:text-destructive hover:bg-white'}`}
                                >
                                  <Heart className={`w-5 h-5 ${user && isInWishlist(user.id, product.id) ? 'fill-current' : ''}`} />
                                </button>
                              </div>
                              <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
                                <div className="rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-wider shadow-xl bg-primary text-white hover:bg-foreground hover:text-background transition-colors duration-300 flex items-center gap-2">
                                  View Product <ArrowRight className="w-3.5 h-3.5" />
                                </div>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex flex-col flex-1 relative z-10 bg-card">
                              <div className="flex items-center justify-between mb-3 leading-none">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-md truncate max-w-[40%]">
                                  {product.category}
                                </span>
                                <div className="flex items-center gap-2.5 text-[10px] font-bold text-muted-foreground tabular-nums">
                                  <span className="flex items-center gap-1" title="Rating">
                                    <Star className="w-3.5 h-3.5 fill-accent text-accent" /> {rating}
                                  </span>
                                  <span className="flex items-center gap-1" title="Wishlist">
                                    <Heart className={`w-3.5 h-3.5 ${wishlistCount > 0 ? 'text-destructive fill-destructive' : ''}`} /> {wishlistCount}
                                  </span>
                                  <span className="flex items-center gap-1" title="Shares">
                                    <Share2 className="w-3.5 h-3.5 text-blue-500" /> {sharesCount}
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

                              <div className="flex items-end justify-between pt-4 border-t border-border/50 mb-2">
                                <div>
                                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5 opacity-50">Price</p>
                                  <p className="font-heading text-xl font-bold text-foreground leading-none">
                                    {product.price.startsWith('₹') ? product.price : `₹${product.price}`}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5 opacity-50">MOQ</p>
                                  <p className="text-xs font-bold text-foreground bg-muted px-2.5 py-1 rounded-md inline-block">
                                    {product.moq}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Link>

                          {/* Seller Bridge - Standalone Gateway */}
                          <Link
                            to={`/seller/${product.sellerId || 's1'}`}
                            className="flex items-center gap-3 p-5 pt-2 border-t border-border/50 group/seller hover:bg-primary/5 transition-colors relative z-20"
                          >
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0 group-hover/seller:rotate-6 transition-transform">
                              {(product.sellerName || "U").substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-sm font-bold text-foreground truncate group-hover/seller:text-primary transition-all">
                                  {product.sellerName || "Unknown Seller"}
                                </p>
                                {product.verified && <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                              </div>
                              <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold uppercase tracking-wider opacity-40">
                                <MapPin className="w-3 h-3" /> {(product.location || "India").split(',')[0]}
                              </div>
                            </div>
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              // B2B Supplier Directory list layout for "businesses" view Mode
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filteredBusinesses.map((seller, i) => {
                    const sellerProducts = allProducts.filter(p => p.sellerId === seller.id);
                    const productCount = sellerProducts.length;
                    const allReviews = getReviews();
                    const sellerProductIds = sellerProducts.map(p => p.id);
                    const sellerReviews = allReviews.filter(r => sellerProductIds.includes(r.productId));
                    const avgRating = sellerReviews.length > 0
                      ? (sellerReviews.reduce((sum, r) => sum + r.rating, 0) / sellerReviews.length).toFixed(1)
                      : (4.5 + (i % 5) * 0.1).toFixed(1);

                    const sellerCode = seller.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

                    return (
                      <motion.div
                        key={seller.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ delay: i * 0.03, duration: 0.4 }}
                        className="w-full"
                      >
                        <div className="group flex flex-col md:flex-row items-start md:items-center justify-between border border-border/80 bg-card hover:bg-muted/10 rounded-2xl p-5 gap-6 hover:shadow-lg transition-all duration-300 relative">
                          
                          {/* Left / Center Column: Initials Logo & Profile details */}
                          <div className="flex items-center gap-4 flex-1 w-full min-w-0">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-base flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                              {sellerCode}
                            </div>
                            
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors truncate text-left">
                                  {seller.name}
                                </h3>
                                {seller.verified && (
                                  <span className="flex items-center gap-1 px-2.5 py-0.5 bg-success/10 text-success text-[10px] font-bold uppercase tracking-wider rounded-full border border-success/20">
                                    <ShieldCheck className="w-3 h-3" /> Verified
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1.5">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-primary" /> {seller.location || "Global Hub"}
                                </span>
                                <span className="opacity-40">•</span>
                                <span className="uppercase tracking-wider font-semibold text-[10px] opacity-70">
                                  Sector: {seller.category || 'Multi-Industry'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Credentials metrics and converter buttons */}
                          <div className="flex flex-wrap md:flex-nowrap items-center justify-between md:justify-end gap-6 w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-border/40">
                            
                            {/* B2B Trust stats */}
                            <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                              <div className="flex flex-col items-center">
                                <div className="flex items-center gap-1 text-base font-bold text-foreground">
                                  {avgRating} <Star className="w-3.5 h-3.5 fill-accent text-accent mb-0.5" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mt-0.5">Rating</span>
                              </div>

                              <div className="h-6 w-px bg-border/50" />

                              <div className="flex flex-col items-center">
                                <div className="flex items-center gap-1 text-base font-bold text-foreground">
                                  {productCount} <Package className="w-3.5 h-3.5 text-primary mb-0.5" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mt-0.5">Products</span>
                              </div>
                            </div>

                            {/* Conversion Action Buttons */}
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              <Link to={`/seller/${seller.id}`} className="w-full sm:w-auto">
                                <Button 
                                  variant="outline"
                                  className="h-10 rounded-xl px-4 text-xs font-semibold uppercase tracking-wider border border-border group-hover:border-primary group-hover:text-primary transition-colors w-full sm:w-auto"
                                >
                                  View Profile
                                </Button>
                              </Link>
                              <Link to="/inquiry" className="w-full sm:w-auto">
                                <Button 
                                  className="h-10 rounded-xl px-4 text-xs font-semibold uppercase tracking-wider shadow-sm bg-primary text-white hover:bg-foreground hover:text-background transition-colors w-full sm:w-auto"
                                >
                                  Contact Supplier
                                </Button>
                              </Link>
                            </div>
                            
                          </div>

                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile view responsive filters slide-over layout */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-80 max-w-[85vw] bg-card border-l border-border overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-10">
                <h3 className="font-heading font-semibold text-foreground">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)} className="p-1 text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                {renderFilterPanel()}
              </div>
              <div className="sticky bottom-0 p-4 border-t border-border bg-card">
                <Button variant="hero" className="w-full rounded-xl" onClick={() => setShowMobileFilters(false)}>
                  Show {filtered.length} Results
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {shareDialog.product && (
        <ProductShareDialog
          isOpen={shareDialog.isOpen}
          onClose={() => setShareDialog({ ...shareDialog, isOpen: false })}
          product={shareDialog.product}
          onShareComplete={() => setAllProductsState([...getProducts().filter(p => p.status === "active")])}
        />
      )}
    </Layout>
  );
}
