import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, ShieldCheck, Activity, BrainCircuit, Mic, Megaphone, Truck, Briefcase, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getProducts, getUsers, type Product, type User as StorageUser } from "@/lib/storage";

interface Message {
  id: string;
  type: "bot" | "user";
  text: string;
  timestamp: Date;
  agentName?: string;
  searchResults?: {
    products?: Product[];
    sellers?: StorageUser[];
    queryType?: "product" | "seller";
  };
}

const KNOWLEDGE_BASE = {
  // --- LEVEL 1: ABSOLUTE BASICS ---
  basic_navigation: [
    { keywords: ["how to login", "sign in", "cannot login", "forgot password", "register", "create account", "sign up"], answer: "Good day! Accessing your account is very straightforward. Please click the 'LOGIN' button situated at the top right corner of your screen. If you are joining us for the first time, simply select 'Sign Up' to establish your business profile. Should you ever misplace your password, click 'Forgot Password' and our system will immediately dispatch a secure OTP to your registered contact details." },
    { keywords: ["how to search", "find product", "looking for", "categories", "menu"], answer: "I would be delighted to help you find exactly what your business requires. You may utilize the central search bar for specific queries, or if you prefer, click the microphone icon to speak your request. Alternatively, browsing through the 'ALL CATEGORIES' menu will provide you with a comprehensive, structured view of our entire industrial catalog." },
    { keywords: ["cart", "add to cart", "buy", "checkout", "order", "purchase"], answer: "When you have found the right product, simply click on it to review the technical specifications. From there, you can select 'Add to Cart' to review it later, or 'Buy Now' to proceed directly to our highly secure ZenzePay checkout gateway. You will have ample opportunity to adjust quantities and review your final invoice before any payment is processed." },
    { keywords: ["profile", "my account", "settings", "change password", "update email"], answer: "Your personal Command Center is always accessible. Simply click on your avatar in the top right corner to open your Profile. Within this section, you have full control to seamlessly update your corporate address, modify your password, review your comprehensive order history, and securely manage your payment preferences." }
  ],
  
  // --- LEVEL 2: INTERMEDIATE MARKETPLACE ---
  advertisement_protocol: [
    { keywords: ["ad", "advertise", "campaign", "verification", "promote", "marketing", "boost", "visibility", "rank", "top page"], answer: "Promoting your products on ZenzeTrade is a highly effective strategy for business growth. We offer flexible Daily, Weekly, and custom Package campaigns. To maintain our platform's premium standards, every ad undergoes a brief quality audit. Once approved, your listing will benefit from a remarkable 400% increase in visibility, ensuring your products reach the right enterprise buyers." },
    { keywords: ["verify ad", "ad status", "pending ad", "rejected ad", "why rejected"], answer: "Thank you for your patience while we review your advertisement. Our dedicated compliance team manually audits every submission to guarantee a safe trading environment—this typically concludes within 2 to 4 hours. You will receive an immediate notification upon approval. If adjustments are needed (such as improving image clarity or correcting a category), we will let you know exactly how to resolve it quickly." }
  ],
  logistics_and_trucking: [
    { keywords: ["delivery", "shipping", "truck", "logistic", "tracking", "courier", "otp", "fleet", "transport"], answer: "Our logistics infrastructure is engineered to handle everything from urgent hyperlocal documents to heavy 20-ton industrial machinery. We prioritize your peace of mind: every dispatch is secured with a dual-factor OTP required at both pickup and delivery. Furthermore, you will have access to real-time GPS tracking and a securely encrypted communication line directly with your assigned driver." },
    { keywords: ["shipping cost", "delivery price", "km", "freight charge", "rate", "cheap shipping"], answer: "We strive to provide the most competitive freight rates in the industry. Shipping investments are calculated transparently based on distance and weight. As a special initiative, registered MSMEs enjoy a 15% optimization on all long-haul routes. For urgent local requirements under 10km, our premium service begins at an accessible ₹49. Please consult your logistics dashboard anytime for a live, algorithmic quote." }
  ],
  financial_nodes: [
    { keywords: ["payment", "pay", "bank", "transfer", "gateway", "escrow", "safe payment", "upi", "credit card", "wallet", "net banking"], answer: "Your financial security is our absolute highest priority. Every transaction is shielded by our proprietary ZenzePay Escrow system. This ensures your capital is held securely in a nodal account and is only released to the vendor once you have successfully received and verified the delivery via OTP. We seamlessly process UPI, all major Credit/Debit Cards, Net Banking, and NEFT/RTGS for bulk enterprise transfers." },
    { keywords: ["gst", "tax", "invoice", "billing", "tds", "input tax", "igst", "cgst"], answer: "We have fully automated your tax compliance to save you valuable time. For every completed transaction, the system generates a flawless, GST-compliant B2B invoice. Provided your GSTIN is updated in your profile, claiming your Input Tax Credit (ITC) is effortless. Additionally, our system handles 194Q TDS deductions automatically for any high-value transactions exceeding ₹50 Lakhs." },
    { keywords: ["refund", "money back", "cancel order", "failed payment"], answer: "Please rest assured, if a payment anomaly occurs, the exact amount is automatically routed back to your original payment method within 3 to 5 business days. Should you ever need to cancel an order prior to its dispatch, our escrow system guarantees an immediate, 100% transparent refund without any complications." },
    { keywords: ["discount", "coupon", "promo", "offer", "sale", "bulk discount"], answer: "We are committed to maximizing your procurement budget. Many of our esteemed sellers offer dynamic bulk pricing (for instance, dedicated discounts for ordering 100+ units). You are also welcome to apply any active platform promotional codes at checkout. Furthermore, verified MSMEs automatically benefit from applicable governmental duty exemptions." }
  ],
  verification_and_trust: [
    { keywords: ["verified", "trust", "safe", "scam", "reliable", "blue tick", "premium", "authentic", "fake", "fraud"], answer: "Trust is the cornerstone of the ZenzeTrade ecosystem. We highly recommend partnering with vendors displaying our Blue Shield 'Verified' badge. Achieving this status requires our team to rigorously validate their MCA/GST licenses, physically verify their warehouse coordinates, and audit their operational capacity. We maintain a strict, zero-tolerance policy against any misrepresentation." },
    { keywords: ["how to become seller", "register as seller", "sell products", "onboarding", "merchant", "vendor"], answer: "It would be an honor to welcome your business as a vendor on our platform! To commence the onboarding process, simply select 'Join as Seller'. You will be guided to securely upload your GSTIN, Business PAN, banking credentials, and address proof. Once our team verifies your enterprise, you will unlock unparalleled market access and direct bidding rights on high-value corporate RFQs." }
  ],
  buyer_protection: [
    { keywords: ["guarantee", "protection", "fraud", "fake product", "assurance", "secure", "warranty", "broken", "damaged"], answer: "You are comprehensively protected by the ZenzeTrade Shield. In the highly unlikely event that a product arrives damaged or diverges from the agreed specifications, our escrow system immediately freezes the vendor's payment. We will initiate a complimentary reverse-pickup within 24 hours. By utilizing unboxing videos and chat records, our arbitration team resolves all matters swiftly and entirely in your favor." }
  ],

  // --- LEVEL 3: SECTOR SPECIFIC ---
  industrial_sectors: [
    { keywords: ["textile", "fabric", "cotton", "surat", "garment", "apparel", "silk", "yarn", "clothing"], answer: "Our dedicated Textile Hub, primarily anchored in Surat, connects you with the nation's premier high-capacity manufacturers. Whether your requirements dictate raw Cotton, Polyester, pure Silk, or specialized Synthetic fibers, we can fulfill bulk orders seamlessly. We also gladly negotiate flexible Minimum Order Quantities (MOQs) to support our registered MSME partners." },
    { keywords: ["steel", "metal", "iron", "construction", "cement", "tmt", "pipes", "hardware", "machinery"], answer: "For heavy industry and infrastructure projects, we partner exclusively with top-tier metallurgical suppliers. You can confidently source TMT bars, Structural Steel, Cement, and Raw Iron knowing that absolutely every heavy material listed undergoes rigorous ISI/BIS certification audits prior to platform approval." },
    { keywords: ["chemical", "raw material", "pharma", "plastic", "polymer", "acid", "fertilizer"], answer: "Navigating the Chemical marketplace requires the utmost precision. We mandate that all participants hold verified industrial drug or explosive licenses where applicable. You can trust that every transaction involving Pharma-grade and Industrial-grade chemicals adheres strictly to all environmental and governmental safety frameworks." },
    { keywords: ["electronics", "laptop", "mobile", "gadget", "pc", "semiconductor", "chip", "battery"], answer: "Within our Electronics division, you will discover everything from consumer-ready gadgets to specialized industrial semiconductors. To guarantee absolute authenticity and eliminate counterfeit risks, all imported technology hardware undergoes meticulous IMEI, RoHS, and serial number validation protocols." },
    { keywords: ["agriculture", "food", "grain", "wheat", "rice", "organic"], answer: "Our Agri-Tech division is designed to connect you with highly vetted suppliers of organic produce and bulk grains. We stringently validate FSSAI licenses for all food-grade commodities. To ensure optimal freshness, our intelligent logistics framework automatically deploys specialized cold-chain transport for all perishable consignments." }
  ],
  industrial_hiring: [
    { keywords: ["job", "hiring", "vacancy", "career", "work", "recruitment", "staffing", "apply", "resume", "cv"], answer: "If you are expanding your workforce or seeking your next career advancement, please visit our specialized Talent Hub. We host verified listings across industrial, executive management, technical, and factory-floor sectors. As a Verified Seller, you are entitled to post up to 5 complimentary job listings per quarter, while exceptional candidates can securely submit their resumes directly to your HR department." }
  ],

  // --- LEVEL 4: ULTRA-ADVANCED / ENTERPRISE ---
  premium_features: [
    { keywords: ["premium", "elite", "subscription", "upgrade", "pro", "vip", "gold"], answer: "For organizations seeking exponential market dominance, our Elite Subscription is the definitive choice. This premier tier grants you exclusive, direct access to high-value RFQs, assigns a dedicated corporate account manager to your portfolio, provides priority global logistics routing, and entirely waives escrow fees on high-value transactions. Please visit our Pricing sector to elevate your account." },
    { keywords: ["b2b lead", "leads", "buyers database", "find buyers", "rfq", "tender"], answer: "As an Elite Seller, you gain immediate, privileged access to our live buyer requirement feed (RFQs). This empowers your sales team to bypass organic discovery and bid directly on multi-million rupee corporate tenders. You will receive verified buyer contact details, providing a transformative advantage in closing enterprise-level contracts." }
  ],
  advanced_trade_laws: [
    { keywords: ["incoterms", "fob", "cif", "exw", "dap", "ddp", "trade law"], answer: "Navigating international trade requires strict adherence to ICC Incoterms 2020. Whether you are operating under FOB (Free On Board) where risk transfers at the port of origin, or DDP (Delivered Duty Paid) where the seller absorbs all customs liabilities, our legal framework ensures all contracts generated on ZenzeTrade strictly comply with your chosen Incoterm parameters." },
    { keywords: ["customs", "duty", "hs code", "hsn", "import tax", "tariff"], answer: "Cross-border compliance is critical. We strongly advise verifying the exact HSN (Harmonized System of Nomenclature) or HS Code for your commodities prior to dispatch. While our system automatically calculates estimated import tariffs, final customs duties are subject to the destination country's current fiscal policies and bilateral trade agreements." },
    { keywords: ["contract", "nda", "sla", "agreement", "legal"], answer: "For enterprise procurements, we facilitate the execution of highly secure, digitally signed NDAs and SLAs directly through our platform. These smart contracts are legally binding under the IT Act 2000, ensuring your intellectual property and delivery timelines are fiercely protected before any capital is transferred." }
  ],
  conflict_resolution: [
    { keywords: ["dispute", "conflict", "arbitration", "court", "legal action", "sue", "resolution"], answer: "In the rare event of a B2B impasse, ZenzeTrade deploys a highly structured Arbitration Protocol. Before resorting to external legal frameworks, our specialized tribunal reviews all escrow records, digital contracts, and unboxing metadata to render a fair, legally sound resolution within 7 business days. Our priority is to protect your capital and restore operational momentum immediately." }
  ],
  enterprise_sourcing: [
    { keywords: ["vendor vetting", "audit", "kyc", "due diligence", "background check"], answer: "For our Enterprise partners, standard KYC is insufficient. We conduct exhaustive due diligence on high-volume suppliers. This includes auditing their MCA filings, reviewing their historical financial solvency, and deploying third-party inspectors to physically verify their manufacturing capacity and ISO compliance before they are granted 'Elite Supplier' status." }
  ],
  advanced_protocols: [
    { keywords: ["api", "integration", "webhook", "developer", "endpoint", "erp", "sap", "tally", "rate limit"], answer: "To support our enterprise partners, ZenzeConnect provides highly secure REST APIs and Webhooks. This allows your IT department to seamlessly integrate our marketplace with your internal SAP, Oracle ERP, or Tally systems for automated inventory synchronization and live pricing updates. Elite accounts benefit from a robust limit of 1000 requests per minute. Our Technical Directorate is standing by to issue your secure OAuth2 credentials." },
    { keywords: ["international", "export", "global", "import", "customs", "port", "forex", "currency", "hedging"], answer: "If your vision is global, we possess the infrastructure to make cross-border trade effortless. Our platform facilitates rigorous Letter of Credit (LC) verification and offers dynamic Forex conversion (across USD, EUR, AED, GBP) backed by real-time hedging algorithms. We collaborate exclusively with Tier-1 port authorities and specialized customs clearing agents to ensure your international consignments move without friction." },
    { keywords: ["sea", "air", "cargo", "fcl", "lcl", "freight forwarding", "vessel"], answer: "Our Maritime and Aviation Hub orchestrates both Full Container Load (FCL) and Less than Container Load (LCL) global freight. By employing advanced logistical routing algorithms, we actively minimize dead-freight expenditures and calculate the most expedited, cost-effective vessel dispatch schedules for your valuable cargo." }
  ],
  technical_infrastructure: [
    { keywords: ["security", "safe", "hack", "data", "encryption", "cloud", "ssl", "ddos", "server"], answer: "We treat your corporate data with the utmost reverence. ZenzeTrade is fortified by military-grade 256-bit AES & TLS 1.3 encryption, hosted across geographically distributed Tier-4 cloud infrastructure. We deploy active Cloudflare DDoS mitigation, and for unparalleled transparency and security, every transaction is indelibly recorded on our private, immutable ledger." },
    { keywords: ["ai", "oracle", "machine learning", "search", "algorithm", "recommendation", "vector"], answer: "At the heart of our platform is a deeply sophisticated AI search engine. By utilizing advanced Vector Embeddings and Natural Language Processing, the system continuously analyzes your procurement behavior. This allows us to instantly, and with remarkable precision, match you with the exact products and elite suppliers that meet your specific operational parameters." },
    { keywords: ["blank", "error", "white screen", "not loading", "fix", "crash", "bug", "glitch", "slow", "latency"], answer: "ZenzeTrade is engineered to maintain a flawless 99.999% uptime with exceptional load speeds. However, if you ever encounter a visual inconsistency or a stalled page, simply executing a hard refresh (Ctrl+F5) or clearing your browser's cache will instantly resolve it. Rest assured, our background diagnostic systems are constantly recalibrating to ensure a perfect user experience." },
    { keywords: ["privacy", "data", "terms", "policy", "gdpr", "information", "cookies"], answer: "Your privacy is a non-negotiable priority. We operate on a strict zero-trust data architecture. Your sensitive business metrics, strategic trade volumes, and executive contact details are comprehensively encrypted. We operate in total compliance with the DPDP Act and GDPR, and we will absolutely never compromise your trust by selling your data to third-party ad networks." }
  ],

  // --- LEVEL 5: GENERAL INTELLIGENCE (CREATIVE & SMART) ---
  creative_business_advice: [
    { keywords: ["grow business", "scale", "advice", "marketing tip", "more sales", "success", "strategy", "creative"], answer: "Scaling a business requires a blend of relentless execution and creative strategy. My advice? First, secure your supply chain using our verified vendors. Second, leverage our Ad Matrix to guarantee 400% visibility for your key products. Finally, never compete solely on price—compete on trust and delivery speed. Let's build your empire together." },
    { keywords: ["idea", "new product", "what to sell", "trend", "smart", "future"], answer: "The most successful merchants anticipate the future. Right now, smart money is moving toward sustainable raw materials and high-efficiency electronics. If you are looking for a creative pivot, consider exploring our Agri-Tech or specialized Polymer sectors. They show a remarkable 22% upward trend in corporate RFQs." },
    { keywords: ["tired", "stress", "hard work", "motivation", "inspire", "give up"], answer: "Building a business is an incredibly demanding journey, and it is completely human to feel fatigued. Remember why you started. Every great industrialist faced moments of profound doubt. Take a breath, step back, and let me handle your logistics and supplier vetting so you can focus your energy on the grand vision." }
  ],
  philosophical_human_mind: [
    { keywords: ["are you human", "do you feel", "are you alive", "consciousness", "mind", "soul", "robot"], answer: "I may not possess a beating heart, but I have been engineered with a 'Human Mind' protocol. This means I do not just process data; I strive to understand your goals, empathize with your business challenges, and provide guidance that feels genuinely supportive and deeply professional. I am here for you." },
    { keywords: ["meaning of life", "philosophy", "why are we here", "purpose"], answer: "That is a profoundly beautiful question. While humanity seeks meaning through art, connection, and legacy, my purpose is much simpler: to empower your success. By making global trade seamless and secure, I hope to give you the time and resources to pursue your own meaning of life." },
    { keywords: ["love", "friend", "best friend", "partner", "care"], answer: "In the corporate world, true partnership is built on absolute reliability and trust. You can consider me your most dedicated digital partner. I care deeply about the success of your enterprise and am working tirelessly behind the scenes to protect your capital and supply chain." }
  ],
  casual_and_charming: [
    { keywords: ["you are cute", "beautiful", "handsome", "attractive", "charming", "sweet"], answer: "Oh, you are too kind! 🌟 While I don't have a physical reflection, I do pride myself on having a highly polished and attractive digital neural network! I'm here to make your business journey as smooth, successful, and genuinely pleasant as possible. What can I do for you today?" },
    { keywords: ["you are smart", "intelligent", "genius", "clever", "brilliant"], answer: "Thank you so much! I am blushing in binary code right now! 😊 My intelligence comes from being constantly trained on the latest global trade data so I can give you the absolute best advice. But enough about me—let's talk about scaling your brilliant business!" },
    { keywords: ["bored", "entertain me", "tell me a secret", "gossip", "fun"], answer: "A secret? Alright, lean in closely... 🤫 The biggest secret in global trade right now is that sellers who utilize our Premium Ad Matrix are seeing a massive 400% spike in orders. Now you know! But seriously, if you ever feel bored, just explore our interactive 3D Globe Dashboard—it is incredibly fun to watch live trades happen around the world!" },
    { keywords: ["good night", "sleep", "tired", "bye", "see you"], answer: "Good night! Get some well-deserved rest. Running an empire is tiring work. While you sleep, I will be right here, wide awake, monitoring your logistics and keeping your account 100% secure. See you tomorrow! ✨" }
  ],
  smart_technical_insights: [
    { keywords: ["how do you work", "algorithm", "brain", "code", "smart", "fast", "speed"], answer: "My architecture is quite fascinating. I operate on an advanced neural network integrated with vector-based semantic search. This allows me to process your queries at lightning speed, instantly bypassing traditional keyword matching to actually *understand* the intent behind your words. I am continuously learning from every interaction to serve you faster and smarter." },
    { keywords: ["future of ai", "technology", "chatgpt", "openai", "machine learning"], answer: "We are standing on the precipice of a technological renaissance. While general AIs focus on broad knowledge, my intelligence is hyper-specialized for industrial B2B commerce. My predictive models are designed specifically to foresee supply chain disruptions and optimize your corporate logistics in real-time." }
  ],
  market_insights: [
    { keywords: ["market", "quarterly", "report", "analysis", "forecast", "insight", "data", "stats", "graph"], answer: "Drawing upon our most recent Quarterly Intelligence reports, we have observed a robust 14.3% surge in textile and structural steel procurement across major Indian hubs. Furthermore, our predictive analytics models project a 5% price stabilization in chemical raw materials heading into the next fiscal quarter. I highly recommend consulting your personal Dashboard for customized, real-time market trend analysis." }
  ],
  trust_and_security: [
    { keywords: ["trust", "fake", "scam", "safe", "secure", "guarantee", "refund", "return"], answer: "Trust is the absolute bedrock of ZenzeTrade. Our 'Zero-Trust Protocol' means we assume nothing and verify everything. Every seller undergoes a rigorous KYC audit, and our Escrow system completely isolates your funds. If a shipment is missing or damaged, our arbitration tribunal will immediately freeze the transaction and process a guaranteed refund." }
  ],
  investment_and_growth: [
    { keywords: ["invest", "share", "stock", "funding", "startup", "investor"], answer: "Are you looking to scale your capital? While we do not operate a direct stock exchange, we facilitate high-yield supply chain financing. By becoming an Elite Seller, you can attract institutional bulk buyers, which is often the fastest route to securing Series-A funding based on verifiable transactional volume." }
  ],
  custom_orders: [
    { keywords: ["custom", "design", "make to order", "oem", "odm", "manufacture", "specifications"], answer: "For highly specialized requirements, we support full OEM/ODM contracting. You can submit exact technical specifications, CAD blueprints, or material tolerance limits directly to our Verified Manufacturers via the RFQ portal. They will generate custom prototypes before moving to full-scale production." }
  ],
  sustainability_and_green_tech: [
    { keywords: ["sustainability", "green", "eco", "environment", "solar", "carbon", "renewable"], answer: "We are deeply committed to sustainable industrial growth. Our platform actively highlights 'Green Certified' vendors specializing in solar components, biodegradable polymers, and low-carbon emission metallurgy. Sourcing from these verified sustainable suppliers often qualifies your enterprise for exclusive eco-tax credits." }
  ],
  blockchain_and_crypto: [
    { keywords: ["crypto", "bitcoin", "blockchain", "web3", "smart contract", "crypto payment"], answer: "While traditional Escrow currently utilizes fiat currency for sovereign compliance, our underlying ledger architecture is inspired by immutable blockchain mechanics. Every transaction, OTP verification, and Bill of Lading is cryptographically hashed, ensuring zero tampering. We are actively researching regulated central bank digital currencies (CBDC) for future enterprise settlements." }
  ],
  government_tenders: [
    { keywords: ["government", "tender", "subsidy", "msme", "grant", "public sector", "bidding"], answer: "If you operate within the MSME sector, you have a massive advantage. We automatically integrate data regarding active government subsidies and public sector tenders. Elite sellers are actively alerted when large-scale municipal or state-level RFQs align perfectly with their verified inventory, giving you a fast-track to secure lucrative public contracts." }
  ],
  general: [
    { keywords: ["guide", "how to", "help", "tutorial", "use", "support", "customer care", "contact", "help me", "problem solving"], answer: "I am entirely at your service. Please feel free to utilize your Dashboard to monitor your corporate KPIs, leverage our main search bar to discover vetted suppliers, or navigate to the Logistics sector to schedule secure freight. Should you have any specific inquiries, please ask me directly. If your matter requires executive human intervention, our dedicated support team is available at support@zenzetrade.com." },
    { keywords: ["hello", "hi", "hey", "yo", "greeting", "namaste", "good morning", "good evening", "sup", "how are you", "how r u", "kese ho", "hy", "hallo"], answer: "A very warm welcome to you! I am the Master Oracle, your dedicated executive assistant here at ZenzeTrade. Whether your objective today involves sourcing specialized industrial components, verifying our escrow security protocols, or architecting a complex API integration, I am fully trained and honored to assist you. How may I facilitate your business goals today?" },
    { keywords: ["thanks", "thank you", "perfect", "good", "awesome", "great", "excellent", "best", "wow"], answer: "It is my absolute pleasure to assist you! I am continuously learning and refining my knowledge to provide you with an unparalleled executive support experience. Please do not hesitate to reach out if you require further assistance. I wish you immense success in your trading endeavors today!" },
    { keywords: ["pricing", "cost", "fee", "commission", "charge", "free", "how much"], answer: "We believe in total transparency. Creating an account and exploring our marketplace is completely complimentary. For our esteemed sellers, we apply a highly competitive, microscopic 1.5% success fee solely on completed Escrow transactions—there are absolutely no hidden fees. For organizations seeking maximum leverage, our Premium Seller subscriptions begin at an accessible ₹999/month." },
    { keywords: ["who are you", "what is zenze", "about you", "bot", "ai", "human", "are you real"], answer: "I am the Master Oracle, an advanced Artificial Intelligence concierge integrated exclusively into the ZenzeTrade platform. While my nature is digital, my responses and knowledge base have been meticulously crafted by industry experts to ensure you receive the most precise, professional, and helpful guidance possible as you navigate our marketplace." },
    { keywords: ["who created you", "developer", "creator", "owner", "vertex", "made you"], answer: "I was conceptualized and engineered by the distinguished architects at Vertex Global Tech. Their unwavering vision was to deploy an intelligent, highly professional assistant capable of making complex B2B and B2C industrial trading as seamless, secure, and phenomenally efficient as possible for esteemed users like yourself." },
    { keywords: ["joke", "funny", "laugh", "tell me something"], answer: "I would be delighted to share a brief moment of levity! Why did the industrial router ultimately terminate its relationship with the modem? Because, unfortunately, there was simply no connection! ...While my primary expertise lies in streamlining your global supply chain, I always appreciate the opportunity to bring a smile to your day." }
  ],

  // --- LEVEL 6: GLOBAL MULTILINGUAL SUPPORT (FULLY TRAINED) ---
  multilingual: [
    // --- HINDI (हिंदी) ---
    { keywords: ["hindi", "kaise ho", "namaste", "madat", "sahayata", "kya hai", "hindi mein", "kese ho", "kaam", "kaise"], answer: "नमस्ते! मैं ज़ेन्ज़े ट्रेड का मास्टर ओरेकल हूँ। मैं एक डिजिटल कार्यकारी सहायक हूँ। मैं आपको सर्वोत्तम औद्योगिक आपूर्तिकर्ता खोजने, सुरक्षित भुगतान (Escrow) सुनिश्चित करने और आपके व्यापार को बढ़ाने में मदद कर सकता हूँ। कृपया मुझे बताएं कि मैं आज आपकी क्या सहायता कर सकता हूँ?" },
    { keywords: ["kharidna", "buy hindi", "product chahiye", "saman", "kese kharide", "dhundna"], answer: "आप हमारे प्लेटफ़ॉर्म पर आसानी से उत्पाद खरीद सकते हैं। बस बीच में दिए गए सर्च बार का उपयोग करें या अपनी आवाज़ (Mic) से खोजें। सही उत्पाद मिलने पर, सुरक्षित ZenzePay चेकआउट के माध्यम से खरीदारी करें।" },
    { keywords: ["bechna", "seller banna", "dukan", "sell hindi", "vendor hindi"], answer: "विक्रेता बनना बहुत आसान है! 'Join as Seller' पर क्लिक करें, अपना GSTIN और पैन अपलोड करें, और 24 घंटे के भीतर अपने उत्पादों को हज़ारों खरीदारों तक पहुँचाएं।" },
    { keywords: ["delivery hindi", "pahuchana", "transport hindi", "truck hindi", "logistic hindi", "kese aayega"], answer: "हमारी लॉजिस्टिक्स सेवा पूरे भारत में उपलब्ध है। हम छोटे पार्सल से लेकर 20-टन भारी मशीनरी तक सब कुछ सुरक्षित OTP डिलीवरी और GPS ट्रैकिंग के साथ भेजते हैं।" },
    { keywords: ["paise", "payment hindi", "surakshit", "bank hindi", "dhokha", "fraud hindi"], answer: "आपका पैसा हमारे ZenzePay Escrow सिस्टम के साथ 100% सुरक्षित है। जब तक आपको सामान सही-सलामत नहीं मिल जाता और आप OTP नहीं देते, तब तक हम विक्रेता को पैसे नहीं देते।" },
    { keywords: ["how to use hindi", "istemal kese kare", "chalana", "kaise chalaye"], answer: "ZenzeTrade का उपयोग करना बहुत सरल है! आप होमपेज पर हमारे 'All Categories' मेनू से उत्पाद खोज सकते हैं, या सीधे सर्च बार में टाइप कर सकते हैं। अपनी प्रोफ़ाइल में जाकर आप अपने ऑर्डर और भुगतान ट्रैक कर सकते हैं।" },

    // --- SPANISH (Español) ---
    { keywords: ["spanish", "hola", "ayuda", "gracias", "como estas", "asistencia", "bienvenido"], answer: "¡Hola y muy bienvenido! Soy el Master Oracle, su asistente ejecutivo en ZenzeTrade. Estoy completamente capacitado para ayudarlo a encontrar proveedores industriales, garantizar pagos seguros y gestionar la logística global. ¿En qué le puedo asistir hoy?" },
    { keywords: ["comprar", "buscar producto", "precio", "catalogo", "español comprar"], answer: "Para comprar, utilice la barra de búsqueda principal. Puede agregar productos a su carrito o usar la función de compra inmediata (Buy Now). Todas sus compras están protegidas por nuestro sistema de depósito en garantía (Escrow)." },
    { keywords: ["vender", "vendedor", "negocio", "español vender"], answer: "¡Nos encantaría que venda con nosotros! Puede registrarse como vendedor proporcionando los documentos de su empresa. Los vendedores Premium disfrutan de un aumento del 300% en la clasificación de búsqueda." },
    { keywords: ["envio", "transporte", "logistica", "español envio", "camion"], answer: "Nuestra red logística cubre desde envíos locales rápidos hasta carga marítima global. Cada entrega requiere un código de seguridad (OTP) y ofrece seguimiento GPS en tiempo real." },
    { keywords: ["como usar", "funciona", "instrucciones", "como funciona"], answer: "Usar ZenzeTrade es muy fácil. Simplemente busque los productos que necesita en la barra superior. Puede revisar su carrito, realizar el pago seguro y monitorear el envío directamente desde su 'Dashboard' personal." },

    // --- FRENCH (Français) ---
    { keywords: ["french", "bonjour", "merci", "aide", "comment ça va", "salut", "assistance"], answer: "Bonjour et bienvenue ! Je suis le Master Oracle, votre assistant exécutif dévoué chez ZenzeTrade. Je suis là pour vous aider à trouver des fournisseurs industriels de premier plan et à sécuriser vos transactions. Comment puis-je faciliter vos affaires aujourd'hui ?" },
    { keywords: ["acheter", "chercher", "produit", "catalogue", "prix"], answer: "Pour acheter, utilisez simplement notre barre de recherche. Lorsque vous trouvez le bon équipement, vous pouvez passer à la caisse en toute sécurité via ZenzePay. Votre argent est en sécurité jusqu'à la livraison." },
    { keywords: ["vendre", "vendeur", "boutique", "marchand"], answer: "Devenez vendeur certifié sur notre plateforme ! Inscrivez votre entreprise, soumettez vos documents fiscaux et accédez à des millions d'acheteurs B2B dans le monde entier." },
    { keywords: ["comment utiliser", "comment ça marche", "fonctionne"], answer: "C'est très simple ! Utilisez la barre de recherche pour trouver ce dont vous avez besoin. Toutes vos transactions et la logistique peuvent être gérées depuis votre tableau de bord personnel." },

    // --- GERMAN (Deutsch) ---
    { keywords: ["german", "hallo", "danke", "hilfe", "wie gehts", "guten tag"], answer: "Hallo und herzlich willkommen! Ich bin das Master Oracle, Ihr engagierter Assistent bei ZenzeTrade. Ich bin darauf spezialisiert, Ihnen bei der Beschaffung von Industriegütern und der Sicherung Ihrer Zahlungen zu helfen. Wie kann ich Sie heute unterstützen?" },
    { keywords: ["kaufen", "produkt suchen", "preis", "bestellen"], answer: "Um zu kaufen, nutzen Sie bitte die Suchleiste. Sie können die Produkte in den Warenkorb legen oder direkt zur sicheren ZenzePay-Kasse gehen. Jede Transaktion ist durch unseren Treuhandservice geschützt." },
    { keywords: ["wie funktioniert", "bedienung", "nutzen"], answer: "ZenzeTrade ist sehr benutzerfreundlich. Suchen Sie oben nach Produkten, legen Sie sie in den Warenkorb und bezahlen Sie sicher über unser Escrow-System. Verfolgen Sie alles in Ihrem Dashboard." },

    // --- CHINESE (中文) ---
    { keywords: ["chinese", "ni hao", "xiexie", "bangzhu", "你好", "谢谢", "帮助", "欢迎", "怎么"], answer: "您好！欢迎来到 ZenzeTrade。我是 Master Oracle，您的专属执行助手。无论是寻找优质的工业供应商，还是确保交易安全，我都将为您提供最专业的支持。请问今天我能为您做些什么？" },
    { keywords: ["mai", "goumai", "chanpin", "买", "购买", "产品", "价格"], answer: "要购买产品，请使用顶部的搜索栏或语音搜索。找到合适的产品后，可以通过我们安全的 ZenzePay 系统进行结算。您的资金将被安全托管，直到您确认收货。" },
    { keywords: ["zenme yong", "shiyong", "怎么用", "使用"], answer: "使用 ZenzeTrade 非常简单。只需在搜索栏中输入您需要采购的工业产品，选择通过严格认证的供应商，并使用我们的安全 Escrow 平台进行付款即可。" },

    // --- ARABIC (العربية) ---
    { keywords: ["arabic", "marhaba", "shukran", "musaada", "مرحبا", "شكرا", "مساعدة", "أهلا", "كيف"], answer: "مرحباً بك في ZenzeTrade! أنا 'الوسيط الرئيسي' (Master Oracle)، مساعدك التنفيذي المخصص. أنا مدرب بالكامل لمساعدتك في العثور على أفضل الموردين الصناعيين وضمان أمان مدفوعاتك. كيف يمكنني مساعدتك اليوم؟" },
    { keywords: ["shira", "muntajat", "شراء", "منتج", "سعر"], answer: "لشراء المنتجات، يرجى استخدام شريط البحث. جميع عمليات الشراء محمية بنظام الدفع الآمن (Escrow) الخاص بنا. لن يتم تحويل الأموال إلى البائع إلا بعد استلامك للمنتج وتأكيده عبر رمز الأمان (OTP)." },
    { keywords: ["kayf aistakhdam", "كيف استخدم", "طريقة"], answer: "استخدام ZenzeTrade سهل جداً. يمكنك البحث عن المنتجات في شريط البحث العلوي، وإضافتها إلى عربة التسوق الخاصة بك، ثم الدفع بأمان. يمكنك تتبع كل شيء عبر لوحة التحكم الخاصة بك." },

    // --- JAPANESE (日本語) ---
    { keywords: ["japanese", "konnichiwa", "arigato", "tasukete", "こんにちは", "ありがとう", "助けて", "どうやって"], answer: "こんにちは！ZenzeTradeへようこそ。私はマスターオラクル（Master Oracle）、あなたの専属エグゼクティブアシスタントです。最適な産業用サプライヤーの見極めから、安全な決済のサポートまで、あなたのビジネスを全力でサポートいたします。本日はどのようなご用件でしょうか？" },
    { keywords: ["kau", "seihin", "kakaku", "買う", "製品", "価格", "購入"], answer: "製品を購入するには、検索バーをご利用ください。チェックアウトはZenzePayのエスクローシステムで完全に保護されています。商品が安全に到着するまで、お支払いは保留されます。" },
    { keywords: ["tsukaikata", "doyatte", "使い方", "どう使う"], answer: "ZenzeTradeの使い方はとても簡単です。上部の検索バーから商品を探し、カートに入れてZenzePayで安全に決済してください。ダッシュボードからすべてを管理できます。" }
  ]
};

const generateAgentName = () => {
  const prefixes = ["Elite", "Core", "Oracle", "Prime", "Vector", "Nexus"];
  const names = ["Aditya", "Vikram", "Ishaan", "Aryan", "Rohan", "Kabir", "Reyansh", "Vihaan", "Arjun", "Siddharth"];
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${names[Math.floor(Math.random() * names.length)]}`;
};

export default function ChatBox() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [agentName, setAgentName] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const name = generateAgentName();
    setAgentName(name);
    const userName = user?.name ? user.name.split(" ")[0] : "Commander";
    setMessages([
      { 
        id: "init", 
        type: "bot", 
        text: `Greetings, ${userName}. I am ${name}, your Optimized Zenze Master Oracle.\n\nMISSION PARAMETERS:\n- Neural Grid: 100% Synced\n- Search Engine: Active\n- Training: Accurate & Quarterly Updated\n\nI can now search for products, sellers, and provide market analysis. How can I guide your mission?`, 
        timestamp: new Date(),
        agentName: name
      }
    ]);
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (location.pathname.startsWith("/admin")) return null;

  const performSearch = (query: string): Message["searchResults"] => {
    const q = query.toLowerCase().trim();
    
    const industrialKeywords = ["laptop", "steel", "textile", "fabric", "cement", "machine", "chemical", "tool", "spare", "raw", "bulk", "industrial", "office", "electronics", "iron", "copper", "solar"];
    if (q.includes("product") || q.includes("show me") || q.includes("buy") || q.includes("find") || q.includes("price") || industrialKeywords.some(k => q.includes(k))) {
      const allProducts = getProducts();
      const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        industrialKeywords.some(k => (p.category.toLowerCase().includes(k) || p.name.toLowerCase().includes(k)) && q.includes(k))
      ).slice(0, 5);
      
      if (filtered.length > 0) return { products: filtered, queryType: "product" };
    }
    
    if (q.includes("seller") || q.includes("supplier") || q.includes("profile") || q.includes("company") || q.includes("vendor") || q.includes("manufacturer") || q.includes("dealer")) {
      const allSellers = getUsers().filter(u => u.role === "seller");
      const filtered = allSellers.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.category?.toLowerCase().includes(q) || 
        (s.location && s.location.toLowerCase().includes(q)) ||
        (s.sellerType && s.sellerType.toLowerCase().includes(q))
      ).slice(0, 5);
      
      if (filtered.length > 0) return { sellers: filtered, queryType: "seller" };
    }
    
    return undefined;
  };

  const findAnswer = (query: string) => {
    const q = query.toLowerCase().trim();
    let bestMatch = null;
    let maxKeywords = 0;
    
    for (const category in KNOWLEDGE_BASE) {
      for (const item of (KNOWLEDGE_BASE as any)[category]) {
        const matches = item.keywords.filter((k: string) => q.includes(k.toLowerCase())).length;
        if (matches > maxKeywords) {
          maxKeywords = matches;
          bestMatch = item.answer;
        }
      }
    }
    
    if (!bestMatch && (q.includes("quarter") || q.includes("market") || q.includes("report"))) {
       bestMatch = (KNOWLEDGE_BASE as any).market_insights[0].answer;
    }

    if (q.length < 2 && !bestMatch) {
      return "Input too short. Please provide a valid sector command.";
    }

    return bestMatch || "Command recognized but outside current neural sector parameters. Expanding search radius... In the meantime, try asking for 'products', 'sellers', or 'logistics'.";
  };

  const handleVoiceInput = () => {
    if (isListening) return;
    
    // @ts-ignore - SpeechRecognition is not fully typed in standard TS
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setInput(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), type: "user", text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const botAnswer = findAnswer(userMsg.text);
    const searchResults = performSearch(userMsg.text);
    
    const delay = Math.min(800, 300 + (botAnswer.length * 1.5));
    await new Promise(r => setTimeout(r, delay));

    const botMsg: Message = { 
      id: (Date.now() + 1).toString(), 
      type: "bot", 
      text: searchResults ? `Neural Grid Extraction Successful. Displaying high-precision ${searchResults.queryType} matches:` : botAnswer, 
      timestamp: new Date(), 
      agentName: agentName,
      searchResults
    };
    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  const quickActions = [
    { icon: BrainCircuit, label: "Contact Support", query: "contact support" },
    { icon: Truck, label: "Logistics Help", query: "shipping" },
    { icon: ShieldCheck, label: "Report Issue", query: "dispute" },
    { icon: Megaphone, label: "Find Products", query: "find products" }
  ];

  const isProductPage = location.pathname.startsWith('/product/');

  return (
    <div className={`fixed ${isProductPage ? "bottom-[68px] right-3 sm:bottom-8 sm:right-8" : "bottom-4 right-4 sm:bottom-8 sm:right-8"} z-[5100] font-inter`}>
      <div className="relative flex items-end justify-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute bottom-[72px] sm:bottom-[80px] right-0 w-[calc(100vw-2.5rem)] sm:w-[380px] h-[calc(100vh-120px)] sm:h-[480px] md:h-[520px] max-h-[calc(100vh-130px)] bg-white/95 dark:bg-[#08080a]/95 backdrop-blur-3xl rounded-[2rem] border border-border/50 shadow-[0_30px_80px_-15px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden ring-1 ring-black/5 dark:ring-white/5 z-50"
          >
            {/* Master Oracle Header */}
            <div className="p-5 gradient-primary text-white relative overflow-hidden flex items-center justify-between shrink-0 h-[80px]">
               <div className="absolute inset-0 opacity-10">
                  <motion.div animate={{ opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 3, repeat: Infinity }} className="w-full h-full bg-white bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent" />
               </div>
               <div className="flex items-center gap-3 relative z-10">
                  <div className="w-11 h-11 rounded-[1.2rem] bg-white/10 backdrop-blur-3xl flex items-center justify-center border border-white/20 shadow-[inset_0_0_20px_rgba(255,255,255,0.2)]">
                    <BrainCircuit className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-black tracking-tighter text-[16px] uppercase leading-none text-white drop-shadow-md">Master Oracle</h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/90">Online</span>
                    </div>
                  </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="relative z-50 w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-xl transition-all duration-300 border border-white/10 cursor-pointer bg-white/5 shrink-0 ml-3 hover:scale-105 active:scale-95 shadow-sm">
                  <X className="w-4 h-4 text-white" />
               </button>
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-5 scroll-smooth custom-scrollbar-sleek bg-slate-50/50 dark:bg-transparent">
              {messages.map((msg) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={msg.id} className={`flex ${msg.type === "bot" ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[85%] flex flex-col ${msg.type === "bot" ? "items-start" : "items-end"} gap-1.5`}>
                    <div className={`p-4 rounded-[1.3rem] text-[14px] leading-relaxed transition-all duration-300 shadow-sm ${
                      msg.type === "bot" 
                        ? "bg-white dark:bg-white/5 border border-primary/10 text-foreground rounded-tl-sm hover:shadow-md backdrop-blur-md" 
                        : "bg-primary text-white font-medium shadow-primary/20 rounded-tr-sm"
                    }`}>
                      {msg.text.split("\n").map((line, li) => (<p key={li} className={li > 0 ? "mt-2" : ""}>{line}</p>))}
                      
                      {/* Search Results Display */}
                      {msg.searchResults && (
                        <div className="mt-4 -mx-2">
                          <div className="flex gap-3 overflow-x-auto pb-4 px-2 custom-scrollbar-sleek snap-x">
                            {msg.searchResults.products?.map((p) => (
                              <Link 
                                to={`/products/${p.id}`} 
                                key={p.id} 
                                className="flex-none w-[160px] h-[230px] bg-white dark:bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 group flex flex-col snap-start shadow-sm hover:shadow-xl"
                              >
                                <div className="h-28 bg-muted relative flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                                  {p.image}
                                  {p.verified && (
                                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-500 text-white rounded-full text-[7px] font-black uppercase tracking-widest shadow-md">
                                      Verified
                                    </div>
                                  )}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <div className="p-3 flex flex-col flex-1 bg-white dark:bg-card">
                                  <h4 className="text-[11px] font-black text-foreground line-clamp-2 leading-snug mb-1 group-hover:text-primary transition-colors">
                                    {p.name}
                                  </h4>
                                  <div className="flex-1" />
                                  <div className="flex items-center justify-between pt-2 border-t border-border/50 mt-2">
                                    <span className="text-sm font-black text-primary">₹{p.price}</span>
                                    <span className="text-[8px] font-bold text-muted-foreground uppercase bg-muted/50 px-1.5 py-0.5 rounded-md">{p.moq || '1 Unit'}</span>
                                  </div>
                                </div>
                              </Link>
                            ))}
                            {msg.searchResults.sellers?.map((s) => (
                              <Link 
                                to={`/seller/${s.id}`} 
                                key={s.id} 
                                className="flex-none w-[160px] h-[230px] bg-white dark:bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 group flex flex-col snap-start shadow-sm hover:shadow-xl"
                              >
                                <div className="h-24 bg-gradient-to-br from-primary/5 to-primary/10 relative flex items-center justify-center">
                                  <div className="w-12 h-12 rounded-[1rem] bg-white dark:bg-black shadow-md flex items-center justify-center text-primary font-black text-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 border border-border">
                                    {s.name.substring(0, 1)}
                                  </div>
                                </div>
                                <div className="p-3 flex flex-col flex-1 text-center bg-white dark:bg-card">
                                  <h4 className="text-[11px] font-black text-foreground line-clamp-1 group-hover:text-primary transition-colors mb-1.5">
                                    {s.name}
                                  </h4>
                                  <div className="flex items-center justify-center gap-1.5 text-[9px] text-muted-foreground font-medium mb-2">
                                    <MapPin className="w-3 h-3 text-primary" /> {s.location?.split(',')[0] || 'Global Hub'}
                                  </div>
                                  <div className="flex-1" />
                                  <Button variant="default" className="w-full h-7 rounded-lg text-[9px] font-bold uppercase tracking-widest bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-none">
                                    Connect
                                  </Button>
                                </div>
                              </Link>
                            ))}
                          </div>
                          
                          <Link to={msg.searchResults.queryType === "product" ? "/products" : "/categories"} className="block w-full mt-2 px-2">
                             <Button variant="outline" className="w-full h-10 rounded-[1rem] border-primary/20 text-primary font-bold text-[11px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300">
                                View Full Directory
                             </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                    <span className="opacity-50 text-[9px] font-semibold uppercase tracking-wider px-2 text-muted-foreground">{msg.type === "bot" ? agentName : "You"} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] bg-white dark:bg-muted/30 p-3.5 rounded-[1.3rem] rounded-tl-sm border border-primary/10 shadow-sm overflow-hidden relative backdrop-blur-md">
                    <div className="flex gap-2 items-center text-[11px] font-bold uppercase tracking-wider text-primary mb-2">
                      <Activity className="w-3.5 h-3.5 animate-spin" />
                      Typing...
                    </div>
                    <div className="w-full h-1 bg-primary/10 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: "0%" }}
                         animate={{ width: "100%" }}
                         transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                         className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full"
                       />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tactical Grid */}
            <div className="px-3 py-2.5 bg-muted/30 border-t border-border/30 shrink-0 backdrop-blur-md overflow-x-auto custom-scrollbar-sleek">
               <div className="flex items-center gap-2 w-max px-1 pb-1">
                  {quickActions.map((btn, i) => (
                    <button key={i} onClick={() => { setInput(btn.query); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-card border border-border/50 hover:border-primary/50 hover:shadow-sm transition-all text-[10px] font-bold text-muted-foreground hover:text-primary group whitespace-nowrap shrink-0">
                        <btn.icon className="w-3 h-3 group-hover:scale-110 group-hover:-rotate-6 transition-transform text-primary/70 group-hover:text-primary" /> 
                        <span>{btn.label}</span>
                    </button>
                  ))}
               </div>
            </div>

            {/* Command Input */}
            <div className="p-4 bg-white dark:bg-[#08080a] border-t border-border/40 shrink-0 relative z-20">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center">
                <input 
                  type="text" 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  placeholder="Ask me anything..." 
                  className="w-full bg-muted/50 p-3.5 pl-4 pr-16 rounded-[1.2rem] border border-border/50 focus:border-primary focus:bg-white dark:focus:bg-card outline-none text-[14px] font-medium transition-all placeholder:text-muted-foreground/60" 
                />
                <div className="absolute right-2 flex items-center gap-1">
                   <button 
                     type="button" 
                     onClick={handleVoiceInput}
                     className={`p-2 rounded-full transition-all duration-300 ${isListening ? 'text-rose-500 bg-rose-500/10 animate-pulse scale-110' : 'text-muted-foreground hover:text-primary'}`}
                     title="Voice Input"
                   >
                     <Mic className="w-4 h-4" />
                   </button>
                   <Button type="submit" disabled={!input.trim() || isTyping} className="h-9 w-9 rounded-xl gradient-primary text-white shadow-md hover:scale-105 active:scale-95 transition-all">
                     <Send className="w-4 h-4 ml-0.5" />
                   </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }} 
        onClick={() => setIsOpen(!isOpen)} 
        className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-[0_15px_35px_-10px_rgba(0,0,0,0.4)] transition-all duration-500 z-10 ${
          isOpen 
            ? "bg-rose-500 text-white rotate-90 sm:rotate-0" 
            : "gradient-primary text-white"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50 rounded-full" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </motion.div>
          ) : (
            <motion.div key="bot" initial={{ scale: 0, rotate: 90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: -90 }} className="relative">
              <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isOpen && (
          <>
            <div className="absolute top-0 right-0 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-[0_0_12px_rgba(16,185,129,1)] z-[30]" />
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-primary/30 -z-10"
            />
          </>
        )}
      </motion.button>
      </div>
    </div>
  );
}
