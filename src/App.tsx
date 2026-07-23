import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { useEffect } from "react";

// Scroll Restoration Node
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Floating Components Node
function FloatingComponents() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) {
    return null;
  }
  return (
    <>
      <SocialFloatingMenu />
      <ChatBox />
      <GlobalAdBanner />
    </>
  );
}

// Pages
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import SellerDashboard from "./pages/SellerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import AdminPanel from "./pages/AdminPanel";
import AdminLogin from "./pages/AdminLogin";
import SellerProfile from "./pages/SellerProfile";
import BuyerProfile from "./pages/BuyerProfile";
import AboutPage from "./pages/AboutPage";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Categories from "./pages/Categories";
import Wishlist from "./pages/Wishlist";
import Pricing from "./pages/Pricing";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import Inquiry from "./pages/Inquiry";
import DeliveryPage from "./pages/DeliveryPage";
import CareersPage from "@/pages/CareersPortal";
import ChatBox from "@/components/chat/ChatBox";
import SocialFloatingMenu from "@/components/chat/SocialFloatingMenu";
import GlobalAdBanner from "@/components/ads/GlobalAdBanner";
import { seedDatabase } from "./lib/seed-data";

try {
  seedDatabase();
} catch (error) {
  console.error("Critical: Seed Node Failure", error);
}

const queryClient = new QueryClient();

function App() {


  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CurrencyProvider>
          <TooltipProvider>
            <Toaster position="top-center" richColors />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Login />} />
                <Route path="/seller/register" element={<Login />} />
                <Route path="/seller/dashboard" element={<SellerDashboard />} />
                <Route path="/seller/:id" element={<SellerProfile />} />
                <Route path="/buyer-profile/:id" element={<BuyerProfile />} />
                <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/inquiry" element={<Inquiry />} />
                <Route path="/inquiry/:productId" element={<Inquiry />} />
                <Route path="/delivery" element={<DeliveryPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/dilevry" element={<DeliveryPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <FloatingComponents />
            </BrowserRouter>
          </TooltipProvider>
        </CurrencyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
