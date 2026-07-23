// localStorage helpers for marketplace data

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  country?: string;
  role: "buyer" | "seller" | "admin" | "delivery";
  sellerType?: string;
  category?: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    threads?: string;
    linkedin?: string;
    youtube?: string;
    twitter?: string;
  };
  location?: string;
  sector?: string;
  verified?: boolean;
  documents?: {
    gst?: { name: string; url: string };
    pan?: { name: string; url: string };
  };
  deliveryDetails?: {
    type: "individual" | "company" | "fleet";
    vehicleType: "bike" | "car" | "van" | "truck";
    vehicleNumber: string;
    status: "online" | "offline" | "busy";
    earnings: number;
    completedDeliveries: number;
    cancelledDeliveries: number;
    rating: number;
    verificationStatus: "pending" | "approved" | "rejected";
    docs?: {
      profilePhoto: string;
      govtId: string;
      license: string;
    };
  };
  deliveryPricing?: {
    basePrice: number;
    pricePerKm: number;
    waitChargePerMin: number;
    bikeWeightLimit: number;
  };
  createdAt: string;
  subscription?: PlanSubscription;
}

export interface PlanSubscription {
  planId: string;
  planName: string;
  startDate: string;
  endDate: string;
  status: "active" | "expired";
  billingCycle: "monthly" | "yearly";
  pricePaid: number;
}

export interface Delivery {
  id: string;
  orderId: string;
  partnerId: string;
  customerName: string;
  deliveryAddress: string;
  pickupAddress: string;
  status: "pending" | "accepted" | "arrived_pickup" | "picked_up" | "arrived_drop" | "completed" | "delivered" | "cancelled";
  estimatedTime: string;
  amount: number;
  pickupOtp?: string;
  dropOtp?: string;
  sellerId?: string;
  receiverPhone?: string;
  scheduledTime?: string;
  partnerName?: string;
  partnerPhone?: string;
  isRated?: boolean;
  rating?: number;
  weight?: number;
  distance?: number;
  waitingTime?: number;
  waitingCharges?: number;
  vehicleType?: "bike" | "car" | "van" | "truck";
  arrivalTimePickup?: string;
  arrivalTimeDrop?: string;
  callRecordings?: Array<{ type: "audio" | "text", url: string, timestamp: string }>;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  priceNum: number;
  price: string;
  moq: string;
  description: string;
  image: string;
  images?: string[];
  sellerId: string;
  sellerName: string;
  sellerType: string;
  location: string;
  verified: boolean;
  views: number;
  shares: number;
  status: "active" | "draft";
  specifications?: Record<string, string>;
  offers?: string[];
  highlights?: string[];
  shipping?: string;
  warranty?: string;
  security?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId?: string;
  sellerId?: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  buyerId?: string;
  productName: string;
  productId?: string;
  description: string;
  quantity: string;
  sellerId?: string;
  sellerName?: string;
  status: "new" | "contacted" | "closed";
  createdAt: string;
  updatedAt?: string;
  isRead?: boolean;
}

export interface WishlistItem {
  userId: string;
  productId: string;
}

export interface Ad {
  id: string;
  sellerId: string;
  type: "daily" | "package";
  productId?: string; // Optional if ad is for a specific product
  productName?: string;
  packageName?: string;
  dailyBudget?: number;
  duration: number; // in days
  totalCost: number;
  status: "active" | "scheduled" | "completed";
  verificationStatus: "pending" | "approved" | "rejected";
  reach: number;
  clicks: number;
  headline?: string;
  message?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatRoom {
  id: string;
  participantIds: string[]; // [buyerId, sellerId]
  lastMessage?: string;
  lastTimestamp?: string;
  contextType?: "product" | "ad" | "general";
  contextId?: string;
  contextTitle?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "ad_reply" | "chat" | "system";
  isRead: boolean;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  salary: string;
  description: string;
  requirements: string[];
  status: "open" | "closed";
  createdAt: string;
}

const KEYS = {
  users: "th_users",
  currentUser: "th_current_user",
  products: "th_products",
  reviews: "th_reviews",
  inquiries: "th_inquiries",
  wishlist: "th_wishlist",
  ads: "th_ads",
  deliveries: "zenzetrade_deliveries",
  logisticsLock: "zenzetrade_logistics_lock",
  jobs: "zenzetrade_jobs",
  seeded: "zenzetrade_seeded",
  chatRooms: "zenzetrade_chat_rooms",
  chatMessages: "zenzetrade_chat_messages",
  notifications: "zenzetrade_notifications"
};

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function set(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Storage Matrix Failure: set", error);
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      alert("System Error: Local Storage Quota Exceeded. Please try uploading smaller images or removing old assets.");
    }
  }
}

// Users
export const getUsers = (): User[] => {
  try {
    return get(KEYS.users, []);
  } catch (error) {
    console.error("Storage Matrix Failure: getUsers", error);
    return [];
  }
};
export const saveUsers = (u: User[]) => set(KEYS.users, u);
export const getCurrentUser = (): User | null => {
  try {
    const raw = sessionStorage.getItem(KEYS.currentUser);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setCurrentUser = (u: User | null) => {
  try {
    if (u) {
      sessionStorage.setItem(KEYS.currentUser, JSON.stringify(u));
    } else {
      sessionStorage.removeItem(KEYS.currentUser);
    }
  } catch (error) {
    console.error("Storage Matrix Failure: setCurrentUser", error);
  }
};

export const getUserAddresses = (userId: string) => {
  return [
    { id: "addr_1", name: "Principal Plant", addr: "45, Industrial Estate, Phase II, Vatva, Ahmedabad, Gujarat - 382445", type: "Billing / Shipping", badge: "Primary" },
    { id: "addr_2", name: "Secondary Hub", addr: "Plot No. 12, GIDC, Lodhika, Metoda, Rajkot, Gujarat - 360021", type: "Shipping Only", badge: "Logistics" }
  ];
};

export function isSubscriptionActive(user?: User | null): boolean {
  if (!user) return false;
  if (user.role !== "seller") return true; // Non-sellers don't need subscriptions
  if (!user.subscription) return true; // No subscription = Free tier = active
  if (user.subscription.status === "expired") return false;
  
  const now = new Date();
  const endDate = new Date(user.subscription.endDate);
  return now <= endDate;
}

export function updateSubscription(userId: string, sub: PlanSubscription): { success: boolean; user?: User } {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) return { success: false };
  
  const updatedUser = { ...users[index], subscription: sub };
  users[index] = updatedUser;
  saveUsers(users);
  
  const current = getCurrentUser();
  if (current && current.id === userId) {
    setCurrentUser(updatedUser);
  }
  
  return { success: true, user: updatedUser };
}

export function registerUser(data: Omit<User, "id" | "createdAt">): { success: boolean; error?: string; user?: User } {
  const users = getUsers();
  if (users.find(u => u.email === data.email)) return { success: false, error: "Email already registered" };
  const user: User = { ...data, id: generateUUID(), createdAt: new Date().toISOString() };
  saveUsers([...users, user]);
  setCurrentUser(user);
  return { success: true, user };
}

export function loginUser(email: string, password: string): { success: boolean; error?: string; user?: User } {
  const user = getUsers().find(u => u.email === email && u.password === password);
  if (!user) return { success: false, error: "Invalid email or password" };
  setCurrentUser(user);
  return { success: true, user };
}

export function updateUserProfile(data: User): { success: boolean; error?: string; user?: User } {
  const users = getUsers();
  const index = users.findIndex(u => u.id === data.id);

  if (index === -1) {
    return { success: false, error: "User node not found in sector" };
  }

  // Check if email changed and is already taken
  if (data.email !== users[index].email) {
    if (users.some((u, i) => i !== index && u.email === data.email)) {
      return { success: false, error: "Email already active in another node" };
    }
  }

  const updatedUsers = [...users];
  updatedUsers[index] = { ...data };
  saveUsers(updatedUsers);

  // If updating current user, sync session
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === data.id) {
    setCurrentUser(data);
  }

  // Silently sync with MySQL database
  fetch("http://localhost/api/update_user.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).catch(err => console.error("Failed to sync profile to MySQL:", err));

  return { success: true, user: data };
}

export function logoutUser() {
  sessionStorage.removeItem(KEYS.currentUser);
}

// Products
export const getProducts = (): Product[] => {
  try {
    const allProducts = get<Product[]>(KEYS.products, []);
    const allUsers = getUsers();
    
    return allProducts.filter(p => {
      const seller = allUsers.find(u => u.id === p.sellerId);
      // If it's a seller product, it must have an active subscription
      if (seller && seller.role === "seller") {
        return isSubscriptionActive(seller);
      }
      return true; // Keep other products
    });
  } catch (error) {
    console.error("Storage Matrix Failure: getProducts", error);
    return [];
  }
};

export const getAllProductsRaw = (): Product[] => get(KEYS.products, []); // For admin use
export const saveProducts = (p: Product[]) => set(KEYS.products, p);

export function addProduct(data: Omit<Product, "id" | "views" | "shares" | "createdAt">): Product | null {
  const products = getAllProductsRaw();
  const product: Product = { ...data, id: generateUUID(), views: 0, shares: 0, createdAt: new Date().toISOString() };
  try {
    localStorage.setItem(KEYS.products, JSON.stringify([...products, product]));
    return product;
  } catch (error) {
    console.error("Storage Matrix Failure: addProduct", error);
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      alert("System Error: Local Storage Quota Exceeded. Please try uploading smaller images or removing old assets.");
    }
    return null;
  }
}

export function updateProduct(id: string, data: Partial<Product>) {
  const products = getAllProductsRaw().map(p => (p.id === id ? { ...p, ...data } : p));
  saveProducts(products);
}

export function deleteProduct(id: string) {
  saveProducts(getAllProductsRaw().filter(p => p.id !== id));
}

export function incrementViews(id: string) {
  const products = getAllProductsRaw();
  const p = products.find(x => x.id === id);
  if (p) {
    p.views = (p.views || 0) + 1;
    saveProducts(products);
  }
}

export function incrementShares(id: string) {
  const products = getAllProductsRaw();
  const p = products.find(x => x.id === id);
  if (p) {
    p.shares = (p.shares || 0) + 1;
    saveProducts(products);
  }
}

// Reviews
export const getReviews = (): Review[] => get(KEYS.reviews, []);
export const saveReviews = (r: Review[]) => set(KEYS.reviews, r);

export function addReview(data: Omit<Review, "id" | "createdAt">): Review {
  const reviews = getReviews();
  const review: Review = { ...data, id: generateUUID(), createdAt: new Date().toISOString() };
  saveReviews([...reviews, review]);
  return review;
}

export function getProductReviews(productId: string): Review[] {
  return getReviews().filter(r => r.productId === productId);
}

export function getSellerReviews(sellerId: string): Review[] {
  return getReviews().filter(r => r.sellerId === sellerId);
}

// Inquiries
export const getInquiries = (): Inquiry[] => get(KEYS.inquiries, []);
export const saveInquiries = (i: Inquiry[]) => set(KEYS.inquiries, i);

export function addInquiry(data: Omit<Inquiry, "id" | "status" | "createdAt">): Inquiry {
  const inquiries = getInquiries();
  const inquiry: Inquiry = { ...data, id: generateUUID(), status: "new", createdAt: new Date().toISOString() };
  saveInquiries([...inquiries, inquiry]);
  return inquiry;
}

export function updateInquiryStatus(id: string, status: Inquiry["status"]) {
  const inquiries = getInquiries().map(i => (i.id === id ? { ...i, status } : i));
  saveInquiries(inquiries);
}

export function markInquiriesAsRead(userId: string) {
  const inquiries = getInquiries().map(i => {
    if (i.buyerId === userId || i.sellerId === userId || i.buyerEmail === userId) {
      return { ...i, isRead: true };
    }
    return i;
  });
  saveInquiries(inquiries);
}

// Wishlist
export const getWishlist = (): WishlistItem[] => get(KEYS.wishlist, []);
export const saveWishlist = (w: WishlistItem[]) => set(KEYS.wishlist, w);

export function toggleWishlist(userId: string, productId: string): boolean {
  const list = getWishlist();
  const exists = list.find(w => w.userId === userId && w.productId === productId);
  if (exists) {
    saveWishlist(list.filter(w => !(w.userId === userId && w.productId === productId)));
    return false; // removed
  }
  saveWishlist([...list, { userId, productId }]);
  return true; // added
}

export function removeFromWishlist(userId: string, productId: string) {
  const list = getWishlist();
  saveWishlist(list.filter(w => !(w.userId === userId && w.productId === productId)));
}

export function isInWishlist(userId: string, productId: string): boolean {
  return getWishlist().some(w => w.userId === userId && w.productId === productId);
}

export function getUserWishlist(userId: string): string[] {
  return getWishlist().filter(w => w.userId === userId).map(w => w.productId);
}

export function getProductWishlistCount(productId: string): number {
  return getWishlist().filter(w => w.productId === productId).length;
}

// Ads
export const getAds = (): Ad[] => {
  try {
    return get(KEYS.ads, []);
  } catch (error) {
    console.error("Storage Matrix Failure: getAds", error);
    return [];
  }
};
export const saveAds = (a: Ad[]) => set(KEYS.ads, a);

export function addAd(data: Omit<Ad, "id" | "reach" | "clicks" | "createdAt" | "verificationStatus">): Ad {
  const ads = getAds();
  const ad: Ad = {
    ...data,
    id: generateUUID(),
    verificationStatus: "pending",
    reach: Math.floor(Math.random() * 500),
    clicks: Math.floor(Math.random() * 50),
    createdAt: new Date().toISOString()
  };
  saveAds([...ads, ad]);
  return ad;
}

export function updateAd(id: string, data: Partial<Ad>) {
  const ads = getAds().map(a => (a.id === id ? { ...a, ...data } : a));
  saveAds(ads);
}

export function approveAd(id: string) {
  updateAd(id, { verificationStatus: "approved", status: "active" });
}

export function rejectAd(id: string) {
  updateAd(id, { verificationStatus: "rejected", status: "completed" });
}

export function deleteAd(id: string) {
  saveAds(getAds().filter(a => a.id !== id));
}

// Deliveries
export const getDeliveries = (): Delivery[] => get(KEYS.deliveries, []);
export const saveDeliveries = (d: Delivery[]) => set(KEYS.deliveries, d);

export function addDelivery(data: Omit<Delivery, "id" | "createdAt">): Delivery {
  const deliveries = getDeliveries();
  const delivery: Delivery = { ...data, id: generateUUID(), createdAt: new Date().toISOString() };
  saveDeliveries([...deliveries, delivery]);
  return delivery;
}

export function updateDeliveryStatus(id: string, status: Delivery["status"]) {
  const user = getCurrentUser();
  const deliveries = getDeliveries().map(d => {
    if (d.id === id) {
      const updated = { ...d, status };
      if (status === "accepted" && user) {
        updated.partnerId = user.id;
        updated.partnerName = user.name;
        updated.partnerPhone = user.email;
      }
      return updated;
    }
    return d;
  });
  saveDeliveries(deliveries);
}

// Logistics Lock
export const isLogisticsLocked = (): boolean => get(KEYS.logisticsLock, true); // Default to locked
export const setLogisticsLock = (locked: boolean) => set(KEYS.logisticsLock, locked);

// Jobs
export const getJobs = (): Job[] => get(KEYS.jobs, []);
export const saveJobs = (j: Job[]) => set(KEYS.jobs, j);

export function addJob(data: Omit<Job, "id" | "createdAt">): Job {
  const jobs = getJobs();
  const job: Job = { ...data, id: generateUUID(), createdAt: new Date().toISOString() };
  saveJobs([...jobs, job]);
  return job;
}

export function updateJob(id: string, data: Partial<Job>) {
  const jobs = getJobs().map(j => (j.id === id ? { ...j, ...data } : j));
  saveJobs(jobs);
}

export function deleteJob(id: string) {
  saveJobs(getJobs().filter(j => j.id !== id));
}

// Seeding check
export const isSeeded = (): boolean => get(KEYS.seeded, false);
export const markSeeded = () => set(KEYS.seeded, true);

// Chat System
export const getChatRooms = (): ChatRoom[] => get(KEYS.chatRooms, []);
export const saveChatRooms = (rooms: ChatRoom[]) => set(KEYS.chatRooms, rooms);

export const getChatMessages = (): ChatMessage[] => get(KEYS.chatMessages, []);
export const saveChatMessages = (msgs: ChatMessage[]) => set(KEYS.chatMessages, msgs);

export function getOrCreateChatRoom(p1: string, p2: string, context?: { type: string, id: string, title: string }): ChatRoom {
  const rooms = getChatRooms();
  let room = rooms.find(r => r.participantIds.includes(p1) && r.participantIds.includes(p2));
  
  if (!room) {
    room = {
      id: generateUUID(),
      participantIds: [p1, p2],
      contextType: context?.type as any,
      contextId: context?.id,
      contextTitle: context?.title
    };
    saveChatRooms([...rooms, room]);
  }
  return room;
}

export function sendChatMessage(roomId: string, senderId: string, text: string): ChatMessage {
  const msgs = getChatMessages();
  const msg: ChatMessage = {
    id: generateUUID(),
    roomId,
    senderId,
    text,
    timestamp: new Date().toISOString(),
    isRead: false
  };
  saveChatMessages([...msgs, msg]);
  
  const rooms = getChatRooms().map(r => r.id === roomId ? { ...r, lastMessage: text, lastTimestamp: msg.timestamp } : r);
  saveChatRooms(rooms);
  
  return msg;
}

// Notifications
export const getNotifications = (userId: string): Notification[] => 
  get(KEYS.notifications, []).filter((n: Notification) => n.userId === userId);

export function addNotification(userId: string, title: string, message: string, type: Notification["type"] = "system") {
  const all = get(KEYS.notifications, []);
  const note: Notification = {
    id: generateUUID(),
    userId,
    title,
    message,
    type,
    isRead: false,
    createdAt: new Date().toISOString()
  };
  set(KEYS.notifications, [note, ...all]);
}

export function markNotificationsRead(userId: string) {
  const all = get(KEYS.notifications, []).map((n: Notification) => 
    n.userId === userId ? { ...n, isRead: true } : n
  );
  set(KEYS.notifications, all);
}

export function markRoomMessagesAsRead(roomId: string, userId: string) {
  const msgs = getChatMessages();
  let changed = false;
  const newMsgs = msgs.map(m => {
    if (m.roomId === roomId && m.senderId !== userId && !m.isRead) {
      changed = true;
      return { ...m, isRead: true };
    }
    return m;
  });
  if (changed) {
    saveChatMessages(newMsgs);
  }
}
