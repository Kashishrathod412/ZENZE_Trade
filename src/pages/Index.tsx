import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FeaturedSellers from "@/components/home/FeaturedSellers";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import CTABanner from "@/components/home/CTABanner";

const Index = () => (
  <Layout>
    <HeroSection />
    <CategoryGrid />
    <FeaturedProducts />
    <FeaturedSellers />
    <HowItWorks />
    <Testimonials />
    <CTABanner />
  </Layout>
);

export default Index;
