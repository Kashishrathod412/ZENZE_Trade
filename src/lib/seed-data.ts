import { saveProducts, saveUsers, saveReviews, saveJobs, saveAds, getAds, getUsers, getProducts, isSeeded, markSeeded, type Product, type User, type Review, type Job, type Ad } from "./storage";

const seedUsers: User[] = [
  { 
    id: "seller-1", 
    name: "Bharat Machines", 
    email: "bharat@demo.com", 
    password: "demo123", 
    role: "seller", 
    sellerType: "manufacturer", 
    location: "Ahmedabad", 
    category: "Industrial & Machinery", 
    phone: "+91 98765 43210", 
    createdAt: "2024-01-15", 
    website: "https://bharatmachines.com", 
    socialLinks: { linkedin: "bharat-machines", instagram: "bharat.machines", facebook: "bharatmachines", youtube: "bharatmachines" },
    subscription: { planId: "premium", planName: "Elite Enterprise", status: "active", startDate: "2024-01-01", endDate: "2027-12-31", billingCycle: "yearly", pricePaid: 49999 }
  },
  { 
    id: "seller-2", 
    name: "Surat Textiles Co.", 
    email: "surat@demo.com", 
    password: "demo123", 
    role: "seller", 
    sellerType: "manufacturer", 
    location: "Surat", 
    category: "Textile & Fabric Industry", 
    phone: "+91 97654 32100", 
    createdAt: "2024-02-10", 
    website: "https://surattextiles.co", 
    socialLinks: { instagram: "surat.textiles", facebook: "surattextiles", linkedin: "surat-textiles-co" },
    subscription: { planId: "professional", planName: "Professional Growth", status: "active", startDate: "2024-01-01", endDate: "2027-12-31", billingCycle: "yearly", pricePaid: 19999 }
  },
  { 
    id: "seller-3", 
    name: "Green Agri Solutions", 
    email: "green@demo.com", 
    password: "demo123", 
    role: "seller", 
    sellerType: "supplier", 
    location: "Pune", 
    category: "Agriculture & Farming", 
    phone: "+91 96543 21000", 
    createdAt: "2024-03-05", 
    socialLinks: { twitter: "greenagri", linkedin: "green-agri-solutions", youtube: "greenagrichannel" },
    subscription: { planId: "starter", planName: "Startup Hub", status: "active", startDate: "2024-01-01", endDate: "2027-12-31", billingCycle: "yearly", pricePaid: 0 }
  },
  { id: "seller-4", name: "Bright Electronics", email: "bright@demo.com", password: "demo123", role: "seller", sellerType: "manufacturer", location: "Delhi", category: "Electrical & Electronics", phone: "+91 95432 10000", createdAt: "2024-01-20", subscription: { planId: "professional", planName: "Professional Growth", status: "active", startDate: "2024-01-01", endDate: "2027-12-31", billingCycle: "yearly", pricePaid: 19999 } },
  { id: "seller-5", name: "Tata Steel Traders", email: "tata@demo.com", password: "demo123", role: "seller", sellerType: "trader", location: "Mumbai", category: "Construction & Building Materials", phone: "+91 94321 00000", createdAt: "2024-04-01", subscription: { planId: "starter", planName: "Startup Hub", status: "active", startDate: "2024-01-01", endDate: "2027-12-31", billingCycle: "yearly", pricePaid: 0 } },
  { id: "seller-6", name: "MedPharma Ltd", email: "med@demo.com", password: "demo123", role: "seller", sellerType: "manufacturer", location: "Hyderabad", category: "Beauty & Personal Care", phone: "+91 93210 00000", createdAt: "2024-02-15", subscription: { planId: "professional", planName: "Professional Growth", status: "active", startDate: "2024-01-01", endDate: "2027-12-31", billingCycle: "yearly", pricePaid: 19999 } },
  { id: "seller-7", name: "PackRight India", email: "pack@demo.com", password: "demo123", role: "seller", sellerType: "supplier", location: "Chennai", category: "Packaging & Logistics", phone: "+91 92100 00000", createdAt: "2024-05-10", subscription: { planId: "starter", planName: "Startup Hub", status: "active", startDate: "2024-01-01", endDate: "2027-12-31", billingCycle: "yearly", pricePaid: 0 } },
  { id: "seller-8", name: "SunPower Systems", email: "sun@demo.com", password: "demo123", role: "seller", sellerType: "manufacturer", location: "Jaipur", category: "Electrical & Electronics", phone: "+91 91000 00000", createdAt: "2024-03-20", subscription: { planId: "premium", planName: "Elite Enterprise", status: "active", startDate: "2024-01-01", endDate: "2027-12-31", billingCycle: "yearly", pricePaid: 49999 } },
  { id: "seller-9", name: "IndoPress Mfg", email: "indo@demo.com", password: "demo123", role: "seller", sellerType: "manufacturer", location: "Coimbatore", category: "Industrial & Machinery", phone: "+91 90000 00001", createdAt: "2024-06-01", subscription: { planId: "professional", planName: "Professional Growth", status: "active", startDate: "2024-01-01", endDate: "2027-12-31", billingCycle: "yearly", pricePaid: 19999 } },
  { id: "seller-10", name: "SpiceLand Exports", email: "spice@demo.com", password: "demo123", role: "seller", sellerType: "trader", location: "Ernakulam", category: "Agriculture & Farming", phone: "+91 89000 00002", createdAt: "2024-04-15", subscription: { planId: "starter", planName: "Startup Hub", status: "active", startDate: "2024-01-01", endDate: "2027-12-31", billingCycle: "yearly", pricePaid: 0 } },
  { id: "seller-11", name: "PolyPlast India", email: "poly@demo.com", password: "demo123", role: "seller", sellerType: "manufacturer", location: "Vadodara", category: "Chemicals & Raw Materials", phone: "+91 88000 00003", createdAt: "2024-07-01", subscription: { planId: "professional", planName: "Professional Growth", status: "active", startDate: "2024-01-01", endDate: "2027-12-31", billingCycle: "yearly", pricePaid: 19999 } },
  { id: "seller-12", name: "SafeGuard Equip", email: "safe@demo.com", password: "demo123", role: "seller", sellerType: "supplier", location: "Ludhiana", category: "Construction & Building Materials", phone: "+91 87000 00004", createdAt: "2024-05-20", subscription: { planId: "starter", planName: "Startup Hub", status: "active", startDate: "2024-01-01", endDate: "2027-12-31", billingCycle: "yearly", pricePaid: 0 } },
  { id: "seller-premium", name: "Zenze Premium Hub", email: "premium@zenze.tech", password: "demo123", role: "seller", sellerType: "manufacturer", location: "Global Hub", category: "Industrial & Consumer Elite", phone: "+91 80000 00000", createdAt: "2024-01-01", website: "https://zenze.tech", socialLinks: { linkedin: "zenze-tech", instagram: "zenze.tech", facebook: "zenzetech", youtube: "zenzetech", threads: "zenzetech", twitter: "zenzetech" }, subscription: { planId: "premium", planName: "Elite Enterprise", status: "active", startDate: "2024-01-01", endDate: "2027-12-31", billingCycle: "yearly", pricePaid: 49999 } },
  { id: "buyer-1", name: "Rahul Mehta", email: "buyer@demo.com", password: "demo123", role: "buyer", createdAt: "2024-06-15" },
  { id: "admin-1", name: "Zenze Admin", email: "admin@zenze.tech", password: "admin", role: "admin", createdAt: "2024-01-01" },
];

const seedProducts: Product[] = [
  { id: "p-premium", name: "Elite Industrial Bridge Protocol", category: "Industrial & Consumer Elite", priceNum: 999999, price: "₹9,99,999", moq: "1 Node", description: "The ultimate industrial bridge protocol for elite enterprises. Includes global verification and social node synchronization.", image: "🛰️", sellerId: "seller-premium", sellerName: "Zenze Premium Hub", sellerType: "manufacturer", location: "Global Hub", verified: true, views: 9999, shares: 0, status: "active", createdAt: "2024-01-01" },
  { id: "p1", name: "Industrial CNC Machine", category: "Industrial & Machinery", priceNum: 450000, price: "₹4,50,000", moq: "1 Unit", description: "High-precision Industrial CNC Machine designed for heavy-duty manufacturing operations. Features advanced servo motors, rigid cast iron bed, and an intuitive control panel.", image: "🏭", sellerId: "seller-1", sellerName: "Bharat Machines", sellerType: "manufacturer", location: "Ahmedabad", verified: true, views: 1240, shares: 0, status: "active", createdAt: "2024-06-01" },
  { id: "p2", name: "Cotton Fabric Roll (50m)", category: "Textile & Fabric Industry", priceNum: 2500, price: "₹2,500", moq: "100 Rolls", description: "Premium quality cotton fabric roll, 50 meters length. Suitable for garment manufacturing and home textiles.", image: "🧵", sellerId: "seller-2", sellerName: "Surat Textiles Co.", sellerType: "manufacturer", location: "Surat", verified: true, views: 890, shares: 0, status: "active", createdAt: "2024-06-05" },
  { id: "p3", name: "Organic Fertilizer 50kg", category: "Agriculture & Farming", priceNum: 800, price: "₹800", moq: "50 Bags", description: "100% organic fertilizer for all crop types. Rich in nitrogen and phosphorus.", image: "🌿", sellerId: "seller-3", sellerName: "Green Agri Solutions", sellerType: "supplier", location: "Pune", verified: false, views: 650, shares: 0, status: "active", createdAt: "2024-06-10" },
  { id: "p4", name: "LED Panel Light 40W", category: "Electrical & Electronics", priceNum: 350, price: "₹350", moq: "200 Units", description: "Energy-efficient 40W LED panel light with 5-year warranty. Cool white 6500K.", image: "💡", sellerId: "seller-4", sellerName: "Bright Electronics", sellerType: "manufacturer", location: "Delhi", verified: true, views: 1100, shares: 0, status: "active", createdAt: "2024-06-15" },
  { id: "p5", name: "Stainless Steel Pipes", category: "Construction & Building Materials", priceNum: 1200, price: "₹1,200/meter", moq: "500 meters", description: "Grade 304 stainless steel pipes for industrial and construction applications.", image: "🔧", sellerId: "seller-5", sellerName: "Tata Steel Traders", sellerType: "trader", location: "Mumbai", verified: true, views: 980, shares: 0, status: "active", createdAt: "2024-06-20" },
  { id: "p6", name: "Pharmaceutical Capsules", category: "Beauty & Personal Care", priceNum: 5, price: "₹5/unit", moq: "10,000 units", description: "Empty gelatin capsules size 0, suitable for pharmaceutical and nutraceutical use.", image: "💊", sellerId: "seller-6", sellerName: "MedPharma Ltd", sellerType: "manufacturer", location: "Hyderabad", verified: true, views: 760, shares: 0, status: "active", createdAt: "2024-06-25" },
  { id: "p7", name: "Corrugated Boxes", category: "Packaging & Logistics", priceNum: 15, price: "₹15/piece", moq: "1000 pcs", description: "3-ply corrugated boxes 12x10x8 inches. Ideal for e-commerce packaging.", image: "📦", sellerId: "seller-7", sellerName: "PackRight India", sellerType: "supplier", location: "Chennai", verified: false, views: 540, shares: 0, status: "active", createdAt: "2024-07-01" },
  { id: "p8", name: "Solar Panel 400W Mono", category: "Electrical & Electronics", priceNum: 18000, price: "₹18,000", moq: "10 Units", description: "400W monocrystalline solar panel with 25-year performance warranty.", image: "☀️", sellerId: "seller-8", sellerName: "SunPower Systems", sellerType: "manufacturer", location: "Jaipur", verified: true, views: 1320, shares: 0, status: "active", createdAt: "2024-07-05" },
  { id: "p9", name: "Hydraulic Press 100T", category: "Industrial & Machinery", priceNum: 850000, price: "₹8,50,000", moq: "1 Unit", description: "100-ton hydraulic press for metal forming, forging, and deep drawing.", image: "⚙️", sellerId: "seller-9", sellerName: "IndoPress Mfg", sellerType: "manufacturer", location: "Coimbatore", verified: true, views: 670, shares: 0, status: "active", createdAt: "2024-07-10" },
  { id: "p10", name: "Organic Turmeric Powder", category: "Agriculture & Farming", priceNum: 220, price: "₹220/kg", moq: "500 kg", description: "Premium organic turmeric powder with high curcumin content. Export quality.", image: "🌾", sellerId: "seller-10", sellerName: "SpiceLand Exports", sellerType: "trader", location: "Ernakulam", verified: true, views: 890, shares: 0, status: "active", createdAt: "2024-07-15" },
  { id: "p11", name: "HDPE Granules", category: "Chemicals & Raw Materials", priceNum: 95, price: "₹95/kg", moq: "1000 kg", description: "High-density polyethylene granules for blow molding and injection molding.", image: "🧪", sellerId: "seller-11", sellerName: "PolyPlast India", sellerType: "manufacturer", location: "Vadodara", verified: false, views: 430, shares: 0, status: "active", createdAt: "2024-07-20" },
  { id: "p12", name: "Safety Helmets (ISI)", category: "Construction & Building Materials", priceNum: 180, price: "₹180/piece", moq: "500 pcs", description: "ISI certified safety helmets with ratchet suspension. Meets IS 2925 standards.", image: "⛑️", sellerId: "seller-12", sellerName: "SafeGuard Equip", sellerType: "supplier", location: "Ludhiana", verified: true, views: 560, shares: 0, status: "active", createdAt: "2024-07-25" },
];

const seedReviews: Review[] = [
  { id: "r1", productId: "p1", userId: "buyer-1", userName: "Rahul M.", rating: 5, comment: "Excellent machine, very precise and reliable. Great support from seller.", createdAt: "2024-07-01" },
  { id: "r2", productId: "p1", userId: "buyer-2", userName: "Amit K.", rating: 4, comment: "Good quality CNC machine. Delivery was on time.", createdAt: "2024-07-15" },
  { id: "r3", productId: "p2", userId: "buyer-1", userName: "Rahul M.", rating: 5, comment: "Premium quality fabric. Will order again.", createdAt: "2024-07-10" },
  { id: "r4", productId: "p4", userId: "buyer-1", userName: "Rahul M.", rating: 4, comment: "Good LED panels, energy efficient.", createdAt: "2024-07-20" },
  { id: "r5", productId: "p5", userId: "buyer-1", userName: "Rahul M.", rating: 5, comment: "Excellent quality steel pipes.", createdAt: "2024-07-25" },
  { id: "r6", productId: "p8", userId: "buyer-1", userName: "Rahul M.", rating: 5, comment: "Great solar panels, high efficiency.", createdAt: "2024-08-01" },
];

const seedJobs: Job[] = [
  { id: "j1", title: "Senior Logistics Strategist", department: "Operations", location: "Dubai Hub / Remote", type: "Full-time", salary: "₹18L - ₹24L", description: "Design and implement high-efficiency extraction protocols for global trade routes.", requirements: ["8+ Years Logistics", "Global Supply Chain Exp", "Crisis Management Skills"], status: "open", createdAt: new Date().toISOString() },
  { id: "j2", title: "Lead UX Architect", department: "Product", location: "Global / Remote", type: "Full-time", salary: "₹25L - ₹35L", description: "Architecting the world's most sophisticated B2B industrial interfaces.", requirements: ["Figma Mastery", "System Design Experience", "5+ Years UI/UX"], status: "open", createdAt: new Date().toISOString() },
  { id: "j3", title: "Backend Systems Engineer", department: "Engineering", location: "Bangalore Node / Remote", type: "Full-time", salary: "₹22L - ₹30L", description: "Scale our real-time node synchronization and storage infrastructure.", requirements: ["Node.js Expert", "Cloud Infrastructure", "Distributed Systems"], status: "open", createdAt: new Date().toISOString() },
  { id: "j4", title: "Growth Operations Manager", department: "Marketing", location: "Global / Remote", type: "Full-time", salary: "₹15L - ₹20L", description: "Scale the ZenzeTrade network presence across new industrial sectors.", requirements: ["Data-driven Growth", "B2B Marketing", "Market Analysis"], status: "open", createdAt: new Date().toISOString() },
];

const seedAds: Ad[] = [
  { id: "ad-1", sellerId: "seller-premium", type: "daily", headline: "Elite Enterprise Protocol", message: "Connect with the world's most sophisticated B2B network.", status: "active", verificationStatus: "approved", reach: 12400, clicks: 890, duration: 30, totalCost: 49999, createdAt: new Date().toISOString() },
  { id: "ad-2", sellerId: "seller-1", productId: "p1", type: "package", headline: "Industrial CNC Machine Sale", message: "Get 15% off on high-precision CNC machines this month.", status: "active", verificationStatus: "approved", reach: 8500, clicks: 420, duration: 15, totalCost: 25000, createdAt: new Date().toISOString() },
];

export function seedDatabase() {
  if (!isSeeded() || getProducts().length === 0) {
    saveUsers(seedUsers);
    saveProducts(seedProducts);
    saveReviews(seedReviews);
    saveJobs(seedJobs);
    saveAds(seedAds);
    markSeeded();
  }

  // Force absolute sync for demo sellers to ensure social icons appear
  const currentUsers = getUsers();
  const demoSellers = ["seller-1", "seller-2", "seller-3", "seller-premium"];
  let updated = false;
  const latestUsers = currentUsers.map(u => {
    if (demoSellers.includes(u.id)) {
      const seed = seedUsers.find(su => su.id === u.id);
      if (seed && (u.website !== seed.website || JSON.stringify(u.socialLinks) !== JSON.stringify(seed.socialLinks) || JSON.stringify(u.subscription) !== JSON.stringify(seed.subscription))) {
        updated = true;
        return { ...u, socialLinks: seed.socialLinks, website: seed.website, subscription: seed.subscription };
      }
    }
    return u;
  });
  if (updated) {
    saveUsers(latestUsers);
  }

  // Force sync ads if none exist to ensure banner visibility
  if (getAds().length === 0) {
    saveAds(seedAds);
  }
}
