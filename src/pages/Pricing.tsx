import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap, ShieldCheck, Sparkles, ArrowRight, X, Gift, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { PaymentModal, type PaymentPlan } from "@/components/payment/PaymentModal";

import { plans } from "@/config/plans";

export default function Pricing() {
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
  const [planOffers, setPlanOffers] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost/market-connect-hub-main/api/get_plan_offers.php")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPlanOffers(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const displayPlans = plans.map(p => {
    const offer = planOffers.find(o => o.plan_name === p.name);
    
    let planData = { ...p, isOfferActive: false, isMonthlyOfferActive: false, originalYearlyPrice: p.yearlyPrice, originalMonthlyPrice: p.monthlyPrice };
    
    if (offer) {
      if (offer.original_yearly_price > 0) planData.originalYearlyPrice = Number(offer.original_yearly_price);
      if (offer.original_monthly_price > 0) planData.originalMonthlyPrice = Number(offer.original_monthly_price);
      
      // Override the base yearly/monthly price with original prices so that calculations use the DB values when NO offer is active
      if (offer.original_yearly_price > 0) planData.yearlyPrice = Number(offer.original_yearly_price);
      if (offer.original_monthly_price > 0) planData.monthlyPrice = Number(offer.original_monthly_price);

      if (offer.is_active) {
        planData.isOfferActive = true;
        planData.yearlyPrice = Number(offer.offer_price);
      }
      if (offer.is_monthly_active) {
        planData.isMonthlyOfferActive = true;
        planData.monthlyPrice = Number(offer.monthly_offer_price) > 0 ? Number(offer.monthly_offer_price) : planData.monthlyPrice;
      }
    }
    return planData;
  });

  const handlePurchase = (plan: typeof plans[0] & { isOfferActive?: boolean, isMonthlyOfferActive?: boolean, originalYearlyPrice?: number, originalMonthlyPrice?: number }) => {
    if (!user) {
      toast.error("Please login to purchase a plan");
      navigate("/login");
      return;
    }

    if (user.role !== "seller") {
      toast.error("Only registered sellers can subscribe to business plans");
      return;
    }

    const price = isAnnual ? plan.yearlyPrice : plan.monthlyPrice;

    setSelectedPlan({
      id: plan.name.toLowerCase().replace(" ", "-"),
      name: plan.name,
      price: price,
      billingCycle: isAnnual ? "yearly" : "monthly",
      desc: plan.desc,
      features: plan.features.map(f => f.text)
    });
    setPaymentModalOpen(true);
  };

  return (
    <Layout>
      <section className="py-24 md:py-32 bg-gradient-to-br from-[#F8F5FF] to-white relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent rounded-full blur-[120px]" />
        </div>

        <div className="container-wide relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6 border border-primary/20"
            >
              <Sparkles className="w-3.5 h-3.5" /> Elite Business Plans
            </motion.div>
            <h1 className="font-heading text-[40px] md:text-[56px] font-[700] leading-tight text-foreground mb-6">
              Choose the Plan That <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#A855F7]">Fits You</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed font-medium">
              Choose a strategic partnership plan to scale your manufacturing or distribution network across India and beyond.
            </p>
          </div>

          {/* Pricing Switcher */}
          <div className="flex flex-col justify-center items-center mb-16">
            <div className="flex justify-center items-center gap-4">
              <span className={`text-sm font-black transition-colors ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative w-16 h-8 rounded-full bg-muted border border-border p-1 transition-colors hover:border-primary/50 shadow-inner"
              >
                <motion.div
                  animate={{ x: isAnnual ? 32 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-6 h-6 rounded-full gradient-primary shadow-lg"
                />
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-black transition-colors ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>Yearly</span>
                <span className="bg-[#7C3AED]/10 text-[#7C3AED] px-3 py-1 rounded-full text-[10px] font-[800] uppercase tracking-wider border border-[#7C3AED]/20 shadow-sm">
                  Save 20%
                </span>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8 flex flex-col items-center gap-1"
            >
              <span className="text-[10px] font-[800] uppercase tracking-[0.2em] text-[#6B7280]">Scroll down for more plans</span>
              <ChevronDown className="w-4 h-4 animate-bounce text-[#6B7280] mt-1" />
            </motion.div>
          </div>

          <div className="flex flex-wrap justify-center items-stretch gap-[40px] max-w-[1400px] mx-auto px-4">
            {displayPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`w-full md:w-[calc(50%-20px)] lg:w-[calc(33.333%-27px)] max-w-[380px] relative rounded-[32px] flex flex-col transition-all duration-300 ${
                  plan.popular 
                    ? "bg-gradient-to-b from-[#F3E8FF] via-white to-white border-[3px] border-[#A855F7] shadow-[0_20px_40px_-15px_rgba(168,85,247,0.4)] scale-[1.03] z-10" 
                    : "bg-gradient-to-b from-[#E9D5FF]/40 via-white to-white border border-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_50px_rgba(0,0,0,0.1)] hover:-translate-y-2 z-0"
                }`}
              >
                {plan.popular && (
                  <div className="bg-[#A855F7] text-white text-center py-2 text-xs font-bold rounded-t-[28px] -mt-[1px] w-full tracking-wide">
                    Most Popular
                  </div>
                )}

                <div className={`px-8 pt-8 pb-6 flex flex-col ${plan.popular ? 'pt-6' : ''}`}>
                  <h3 className="text-xl font-medium text-black mb-4">
                    {plan.name}
                  </h3>

                  <div className="mb-2">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={isAnnual ? 'annual' : 'monthly'}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-[48px] font-bold text-black tracking-tight leading-none flex items-center gap-3 flex-wrap"
                      >
                        {isAnnual 
                          ? (plan.yearlyPrice === 0 ? "Free" : formatPrice(plan.yearlyPrice))
                          : (plan.monthlyPrice === 0 ? "Free" : formatPrice(plan.monthlyPrice))
                        }
                        {isAnnual && plan.isOfferActive && (
                           <span className="text-xl text-gray-400 line-through font-medium">
                             {formatPrice(plan.originalYearlyPrice!)}
                           </span>
                        )}
                        {!isAnnual && plan.isMonthlyOfferActive && plan.originalMonthlyPrice! > plan.monthlyPrice && (
                           <span className="text-xl text-gray-400 line-through font-medium">
                             {formatPrice(plan.originalMonthlyPrice!)}
                           </span>
                        )}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  
                  <p className="text-[11px] text-gray-400 font-medium mb-6">
                    {isAnnual && plan.yearlyPrice > 0 
                      ? (plan.isOfferActive ? "Special One-Time Yearly Offer" : `Billed annually (Save ${formatPrice((plan.originalMonthlyPrice || plan.monthlyPrice) * 12 - plan.yearlyPrice)})`)
                      : (!isAnnual && plan.isMonthlyOfferActive ? "Special Monthly Offer + Local Taxes" : (plan.monthlyPrice === 0 ? "Free forever" : "one-time payment + Local Taxes"))}
                  </p>

                  <Button 
                    size="lg" 
                    onClick={() => handlePurchase(plan)}
                    className={`group relative w-full h-[46px] rounded-xl font-medium text-[13px] transition-all duration-500 overflow-hidden shadow-md ${
                      plan.popular 
                        ? "bg-gradient-to-r from-[#D946EF] via-[#A855F7] to-[#9333EA] text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]" 
                        : "bg-gradient-to-r from-zinc-700 to-black text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                    }`}
                  >
                    {!plan.popular && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#D946EF] via-[#A855F7] to-[#9333EA] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-2 w-full h-full">
                      {plan.cta} <ArrowRight className="w-3.5 h-3.5 -rotate-45 opacity-80" />
                    </span>
                  </Button>
                </div>

                <div className="px-8 pb-8 pt-6 border-t border-gray-100 flex-1 flex flex-col bg-white rounded-b-[32px]">
                  <ul className="space-y-[14px]">
                    {plan.features.map(f => (
                      <li key={f.text} className={`flex items-start gap-3 text-[13px] font-medium ${f.icon === 'cross' ? 'text-gray-400' : 'text-black'}`}>
                        <div className="mt-[2px] flex-shrink-0 flex items-center justify-center">
                          {f.icon === 'cross' && <X className="w-3.5 h-3.5 text-gray-300" />}
                          {f.icon === 'star' && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
                          {f.icon === 'gift' && <Gift className="w-3.5 h-3.5 text-[#A855F7]" />}
                          {f.icon === 'check' && <Check className="w-3.5 h-3.5 text-black" />}
                        </div>
                        {f.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-24 text-center">
            <div className="inline-block p-8 rounded-[2rem] bg-muted/20 border border-border/50 backdrop-blur-sm">
              <p className="text-muted-foreground text-sm font-black flex flex-col md:flex-row items-center justify-center gap-3">
                <span>Need a custom enterprise solution for high-volume manufacturing?</span>
                <Link to="/contact" className="text-primary hover:underline underline-offset-8 decoration-4 flex items-center gap-2">
                  Connect with our strategists <ArrowRight className="w-4 h-4" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Razorpay & Multi-Method Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        plan={selectedPlan}
        user={user}
        onPaymentSuccess={(receipt) => {
          // Keep receipt visible briefly before redirecting
          setTimeout(() => {
            navigate("/seller/dashboard");
          }, 3000);
        }}
      />
    </Layout>
  );
}


