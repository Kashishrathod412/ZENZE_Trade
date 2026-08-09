import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  QrCode,
  AlertCircle,
  Copy,
  Check,
  Receipt,
  Download,
  ExternalLink,
  ChevronRight,
  Clock,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  launchRazorpaySDK,
  type RazorpayOrderResponse,
} from "@/lib/razorpay";
import { savePaymentTransaction, updateSubscription, type User } from "@/lib/storage";
import {
  GooglePayIcon,
  PhonePeIcon,
  PaytmIcon,
  BhimIcon,
  CredIcon,
  AmazonPayIcon,
  WhatsAppPayIcon,
  MobikwikIcon,
  VisaIcon,
  MastercardIcon,
  RupayIcon,
  AmexIcon,
  SbiIcon,
  HdfcIcon,
  IciciIcon,
  AxisIcon,
  KotakIcon,
  PnbIcon,
  RazorpayGlyph,
  UpiBadge,
} from "./PaymentLogos";

export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  features?: string[];
  desc?: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PaymentPlan | null;
  user: User | null;
  onPaymentSuccess: (receipt: any) => void;
}

type PaymentMethodType = "upi" | "card" | "netbanking" | "wallet";

const popularBanks = [
  { id: "sbi", name: "State Bank of India", code: "SBIN", color: "#280071", LogoComponent: SbiIcon },
  { id: "hdfc", name: "HDFC Bank", code: "HDFC", color: "#004c8f", LogoComponent: HdfcIcon },
  { id: "icici", name: "ICICI Bank", code: "ICIC", color: "#b02a30", LogoComponent: IciciIcon },
  { id: "axis", name: "Axis Bank", code: "UTIB", color: "#97144d", LogoComponent: AxisIcon },
  { id: "kotak", name: "Kotak Mahindra", code: "KKBK", color: "#e61c24", LogoComponent: KotakIcon },
  { id: "pnb", name: "Punjab National Bank", code: "PUNB", color: "#a20a3a", LogoComponent: PnbIcon },
];

const upiApps = [
  { id: "gpay", name: "Google Pay", LogoComponent: GooglePayIcon, handle: "okaxis", color: "#4285F4" },
  { id: "phonepe", name: "PhonePe", LogoComponent: PhonePeIcon, handle: "ybl", color: "#5f259f" },
  { id: "paytm", name: "Paytm UPI", LogoComponent: PaytmIcon, handle: "paytm", color: "#00b9f5" },
  { id: "bhim", name: "BHIM UPI", LogoComponent: BhimIcon, handle: "upi", color: "#008080" },
  { id: "cred", name: "CRED UPI", LogoComponent: CredIcon, handle: "cred", color: "#111111" },
  { id: "amazon_pay", name: "Amazon Pay", LogoComponent: AmazonPayIcon, handle: "apl", color: "#FF9900" },
  { id: "whatsapp", name: "WhatsApp Pay", LogoComponent: WhatsAppPayIcon, handle: "wa", color: "#25D366" },
];

const popularWallets = [
  { id: "paytm_wallet", name: "Paytm Wallet", LogoComponent: PaytmIcon, balance: "₹1,450.00" },
  { id: "phonepe_wallet", name: "PhonePe Wallet", LogoComponent: PhonePeIcon, balance: "₹890.00" },
  { id: "amazon_pay", name: "Amazon Pay", LogoComponent: AmazonPayIcon, balance: "₹2,100.00" },
  { id: "mobikwik", name: "MobiKwik", LogoComponent: MobikwikIcon, balance: "₹520.00" },
];

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  plan,
  user,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>("upi");
  const [upiOption, setUpiOption] = useState<"id" | "qr" | "app">("id");
  const [upiId, setUpiId] = useState("");
  const [selectedUpiApp, setSelectedUpiApp] = useState("gpay");

  // Card details
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState(user?.name || "");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [saveCard, setSaveCard] = useState(true);

  // Bank & Wallet selection
  const [selectedBank, setSelectedBank] = useState("sbi");
  const [selectedWallet, setSelectedWallet] = useState("paytm_wallet");

  // Processing & Verification States
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<"checkout" | "otp" | "success">("checkout");
  const [otpValue, setOtpValue] = useState("");
  const [otpTimer, setOtpTimer] = useState(45);
  const [paymentReceipt, setPaymentReceipt] = useState<any>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [activeOrder, setActiveOrder] = useState<RazorpayOrderResponse | null>(null);

  // Reset state on modal open and aggressive cleanup on unmount
  useEffect(() => {
    if (isOpen && plan) {
      setStep("checkout");
      setIsProcessing(false);
      setOtpValue("");
      setPaymentReceipt(null);
      if (user?.name && !cardName) {
        setCardName(user.name);
      }
    }

    // Aggressive cleanup on unmount to prevent ANY frozen screens
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.pointerEvents = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.pointerEvents = "";
      document.body.classList.remove("razorpay-active");
      const rzpContainer = document.querySelector(".razorpay-container");
      if (rzpContainer) rzpContainer.remove();
    };
  }, [isOpen, plan]);

  // OTP Countdown timer
  useEffect(() => {
    let interval: any;
    if (step === "otp" && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, otpTimer]);

  // Processing safety watchdog timer to prevent UI lockup
  useEffect(() => {
    let timeout: any;
    if (isProcessing) {
      timeout = setTimeout(() => {
        setIsProcessing(false);
      }, 8000);
    }
    return () => clearTimeout(timeout);
  }, [isProcessing]);

  if (!isOpen || !plan) return null;

  // Calculate pricing breakdown
  const baseAmount = plan.price;
  const gstAmount = Math.round(baseAmount * 0.18);
  const totalAmount = baseAmount + gstAmount;

  // Detect Card Brand with Logo Component
  const getCardBrand = (num: string) => {
    const clean = num.replace(/\s+/g, "");
    if (/^4/.test(clean)) return { name: "Visa", LogoComponent: VisaIcon, color: "#1A1F71" };
    if (/^5[1-5]/.test(clean)) return { name: "Mastercard", LogoComponent: MastercardIcon, color: "#EB001B" };
    if (/^(60|65|81|82)/.test(clean)) return { name: "RuPay", LogoComponent: RupayIcon, color: "#097939" };
    if (/^3[47]/.test(clean)) return { name: "Amex", LogoComponent: AmexIcon, color: "#006FCF" };
    return { name: "Card", LogoComponent: null, color: "#6366F1" };
  };

  const formatCardInput = (val: string) => {
    const clean = val.replace(/\D/g, "").substring(0, 16);
    const parts = clean.match(/.{1,4}/g);
    return parts ? parts.join(" ") : clean;
  };

  const formatExpiryInput = (val: string) => {
    const clean = val.replace(/\D/g, "").substring(0, 4);
    if (clean.length >= 3) {
      return `${clean.substring(0, 2)}/${clean.substring(2)}`;
    }
    return clean;
  };

  // Launch official Razorpay standard popup
  const handleLaunchOfficialRazorpay = async () => {
    if (!user) {
      toast.error("Please log in to continue with checkout");
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    try {
      const order = await createRazorpayOrder({
        amount: totalAmount,
        currency: "INR",
        planId: plan.id,
        planName: plan.name,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        billingCycle: plan.billingCycle,
      });

      setActiveOrder(order);

      const launched = await launchRazorpaySDK(
        order,
        {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        async (rzpSuccess) => {
          // Verify payment on backend
          try {
            const verifyResult = await verifyRazorpayPayment({
              razorpay_order_id: rzpSuccess.razorpay_order_id,
              razorpay_payment_id: rzpSuccess.razorpay_payment_id,
              razorpay_signature: rzpSuccess.razorpay_signature,
              userId: user.id,
              userName: user.name,
              userEmail: user.email,
              planId: plan.id,
              planName: plan.name,
              amount: totalAmount,
              billingCycle: plan.billingCycle,
              paymentMethod: "Razorpay Standard SDK",
            });

            if (verifyResult.success) {
              handleCompleteSuccess(
                rzpSuccess.razorpay_payment_id,
                rzpSuccess.razorpay_order_id,
                "Razorpay Standard Gateway"
              );
            } else {
              toast.error(verifyResult.error || "Payment verification failed");
              setIsProcessing(false);
            }
          } catch (verErr: any) {
            toast.error(verErr.message || "Payment verification encountered an error");
            setIsProcessing(false);
          }
        },
        (error) => {
          // Failure callback
          toast.error(error?.description || "Payment failed or was cancelled by user");
          setIsProcessing(false);
        },
        () => {
          // Dismiss callback
          setIsProcessing(false);
        }
      );

      if (!launched) {
        setIsProcessing(false);
        toast.error("Razorpay API key is missing. Please configure it in .env");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to initialize payment gateway");
      setIsProcessing(false);
    }
  };

  // Trigger simulated interactive checkout
  const handleProcessDirectPayment = async () => {
    if (!user) {
      toast.error("Please log in to complete subscription");
      setIsProcessing(false);
      return;
    }

    // Validation
    if (selectedMethod === "upi") {
      if (upiOption === "id") {
        if (!upiId || !upiId.includes("@")) {
          // Auto-fill a valid demo handle if empty to ensure smooth testing
          const defaultHandle = `${user.email ? user.email.split("@")[0] : "merchant"}@okhdfcbank`;
          setUpiId(defaultHandle);
          toast.info(`Using UPI ID: ${defaultHandle}`);
        }
      }
    } else if (selectedMethod === "card") {
      const cleanNum = cardNumber.replace(/\s+/g, "");
      if (cleanNum.length < 15) {
        toast.error("Please enter a valid 16-digit Card Number");
        setIsProcessing(false);
        return;
      }
      if (!cardExpiry || cardExpiry.length < 5) {
        toast.error("Please enter Card Expiry in MM/YY format (e.g. 12/28)");
        setIsProcessing(false);
        return;
      }
      if (!cardCvv || cardCvv.length < 3) {
        toast.error("Please enter a valid 3-digit CVV");
        setIsProcessing(false);
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Create Order
      const order = await createRazorpayOrder({
        amount: totalAmount,
        currency: "INR",
        planId: plan.id,
        planName: plan.name,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        billingCycle: plan.billingCycle,
      });
      setActiveOrder(order);

      setTimeout(() => {
        setIsProcessing(false);
        if (selectedMethod === "card" || selectedMethod === "netbanking") {
          // Show simulated Bank 3D Secure OTP step
          setStep("otp");
          setOtpTimer(45);
        } else {
          // UPI / Wallet direct confirmation
          const paymentId = "pay_" + Math.random().toString(36).substring(2, 14).toUpperCase();
          handleCompleteSuccess(paymentId, order.order_id, selectedMethod.toUpperCase());
        }
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "Payment processing failed. Please try again.");
      setIsProcessing(false);
    }
  };

  // Verify OTP for Card/Netbanking
  const handleVerifyOtp = async () => {
    if (!otpValue || otpValue.length < 4) {
      toast.error("Please enter the 6-digit OTP sent to your registered mobile");
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    const paymentId = "pay_" + Math.random().toString(36).substring(2, 14).toUpperCase();
    const orderId = activeOrder?.order_id || "order_" + Math.random().toString(36).substring(2, 12);

    try {
      setTimeout(async () => {
        const methodLabel = selectedMethod === "card" ? "Credit/Debit Card" : "Net Banking";
        await handleCompleteSuccess(paymentId, orderId, methodLabel);
      }, 1200);
    } catch (err: any) {
      toast.error("OTP verification failed");
      setIsProcessing(false);
    }
  };

  // Finalize successful payment
  const handleCompleteSuccess = async (paymentId: string, orderId: string, method: string) => {
    if (!user || !plan) return;

    // Verify & update backend API
    const verifyRes = await verifyRazorpayPayment({
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      planId: plan.id,
      planName: plan.name,
      amount: totalAmount,
      billingCycle: plan.billingCycle,
      paymentMethod: method,
    });

    // Save to local storage
    const receiptData = {
      id: "rcpt_" + Math.random().toString(36).substring(2, 10).toUpperCase(),
      paymentId,
      orderId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      planId: plan.id,
      planName: plan.name,
      amount: totalAmount,
      baseAmount,
      gstAmount,
      currency: "INR",
      paymentMethod: method,
      billingCycle: plan.billingCycle,
      status: "success" as const,
      createdAt: new Date().toISOString(),
      validUntil: verifyRes.subscription?.endDate || new Date(Date.now() + 365 * 86400000).toISOString().split("T")[0],
    };

    savePaymentTransaction(receiptData);

    // Update current active user subscription
    updateSubscription(user.id, {
      planId: plan.id,
      planName: plan.name,
      status: "active",
      startDate: new Date().toISOString().split("T")[0],
      endDate: receiptData.validUntil,
      billingCycle: plan.billingCycle,
      pricePaid: totalAmount,
      paymentId,
      orderId,
      paymentMethod: method,
      verifiedAt: new Date().toISOString(),
    });

    setPaymentReceipt(receiptData);
    setIsProcessing(false);
    setStep("success");
    toast.success(`🎉 Subscription to ${plan.name} activated successfully!`);
    onPaymentSuccess(receiptData);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl bg-white dark:bg-card border-t sm:border border-border/80 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] sm:max-h-[90vh] flex flex-col my-0 sm:my-auto"
      >
        {/* Header Ribbon */}
        <div className="shrink-0 bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#A855F7] text-white p-3.5 sm:p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-lg sm:text-xl shadow-inner shrink-0">
                ⚡
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] sm:text-[10px] font-black tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded-full border border-white/20">
                    Razorpay Gateway
                  </span>
                  <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-black uppercase text-emerald-300">
                    <ShieldCheck className="w-3 h-3" /> 256-Bit SSL
                  </span>
                </div>
                <h2 className="text-base sm:text-xl font-black tracking-tight mt-0.5 truncate">
                  {step === "success" ? "Payment Successful" : `Upgrade to ${plan.name}`}
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={isProcessing}
              className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors active:scale-90 shrink-0 ml-2"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* STEP 1: CHECKOUT SCREEN */}
        {step === "checkout" && (
          <div className="flex-1 overflow-y-auto overscroll-contain p-3.5 sm:p-6 space-y-3.5 sm:space-y-5">
            {/* Price Summary Card */}
            <div className="bg-muted/40 dark:bg-muted/20 border border-border/60 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  Selected Subscription
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <h3 className="text-sm sm:text-base font-black text-foreground truncate">{plan.name} Plan</h3>
                  <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 shrink-0">
                    {plan.billingCycle}
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Billed {plan.billingCycle} • Cancel anytime</p>
              </div>

              <div className="text-right shrink-0">
                <div className="flex items-baseline justify-end gap-1.5">
                  <span className="text-[11px] text-muted-foreground line-through">
                    ₹{baseAmount + 100}
                  </span>
                  <span className="text-lg sm:text-2xl font-black text-primary">₹{totalAmount}</span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground font-semibold">
                  (₹{baseAmount} + ₹{gstAmount} GST 18%)
                </p>
              </div>
            </div>

            {/* Official Razorpay Fast SDK Trigger Button */}
            <div className="relative">
              <Button
                type="button"
                onClick={handleLaunchOfficialRazorpay}
                disabled={isProcessing}
                className="w-full h-11 sm:h-12 rounded-xl bg-gradient-to-r from-[#0C2340] to-[#1D4ED8] hover:from-[#081726] hover:to-[#1E40AF] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md flex items-center justify-center gap-2 border border-blue-400/30 active:scale-[0.98] transition-all"
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded flex items-center justify-center p-0.5 shadow-xs shrink-0">
                  <RazorpayGlyph className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                </div>
                <span className="truncate">Launch Razorpay 1-Click Checkout</span>
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5 shrink-0" />
              </Button>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[9px] sm:text-[10px] font-bold text-muted-foreground opacity-75 mt-4 sm:mt-5 pb-2">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-500" /> PCI-DSS Level 1
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" /> Razorpay Verified
                </span>
                <span className="hidden sm:inline">•</span>
                <span>Instant Activation</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SIMULATED BANK 3D SECURE OTP SCREEN */}
        {step === "otp" && (
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-8 space-y-4 sm:space-y-6 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto text-xl sm:text-2xl shadow-inner">
              📱
            </div>
            <div className="space-y-1">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 rounded-full">
                3D Secure Verification
              </span>
              <h3 className="text-lg sm:text-xl font-black text-foreground pt-1 sm:pt-2">Enter Bank OTP</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                A 6-digit one-time password has been sent to your registered mobile number ending in •••• 8910 for ₹{totalAmount}.
              </p>
            </div>

            <div className="max-w-xs mx-auto space-y-3 sm:space-y-4">
              <Input
                type="text"
                placeholder="1 2 3 4 5 6"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, "").substring(0, 6))}
                maxLength={6}
                className="h-12 sm:h-14 text-center text-xl sm:text-2xl font-mono font-bold tracking-[0.4em] sm:tracking-[0.5em] rounded-2xl border-2 border-primary/30 focus:border-primary"
                autoFocus
              />

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOtpValue("123456")}
                className="text-[10px] sm:text-[11px] font-black text-primary border-primary/30 hover:bg-primary/5 rounded-lg"
              >
                ⚡ Auto-Fill Test OTP (123456)
              </Button>
            </div>

            <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2">
              <Button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isProcessing}
                className="w-full h-11 sm:h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Verifying with Bank...</span>
                  </div>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>CONFIRM PAYMENT (₹{totalAmount})</span>
                  </>
                )}
              </Button>

              <p className="text-[10px] sm:text-[11px] text-muted-foreground font-medium">
                Resend OTP in <span className="font-bold text-foreground font-mono">{otpTimer}s</span>
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS RECEIPT SCREEN */}
        {step === "success" && paymentReceipt && (
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-8 space-y-4 sm:space-y-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20"
            >
              <Check className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3]" />
            </motion.div>

            <div className="space-y-1">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Payment Authorized & Verified
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-foreground pt-1">Welcome to {plan.name}!</h3>
              <p className="text-xs text-muted-foreground">
                Your industrial trading node is now upgraded with all premium privileges.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-muted/30 border border-border/70 rounded-2xl p-3.5 sm:p-5 text-left space-y-2.5 sm:space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <span className="text-muted-foreground uppercase text-[9px] sm:text-[10px]">Payment ID:</span>
                <span className="font-bold text-foreground text-[10px] sm:text-[11px] truncate max-w-[180px]">{paymentReceipt.paymentId}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <span className="text-muted-foreground uppercase text-[9px] sm:text-[10px]">Order ID:</span>
                <span className="font-bold text-foreground text-[10px] sm:text-[11px] truncate max-w-[180px]">{paymentReceipt.orderId}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <span className="text-muted-foreground uppercase text-[9px] sm:text-[10px]">Payment Method:</span>
                <span className="font-bold text-primary text-[10px] sm:text-[11px]">{paymentReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <span className="text-muted-foreground uppercase text-[9px] sm:text-[10px]">Valid Until:</span>
                <span className="font-bold text-foreground text-[10px] sm:text-[11px]">
                  {new Date(paymentReceipt.validUntil).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 font-bold text-sm">
                <span className="text-foreground uppercase text-xs">Total Paid:</span>
                <span className="text-emerald-600 dark:text-emerald-400">₹{paymentReceipt.amount}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-1 sm:pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  window.print();
                }}
                className="flex-1 h-10 sm:h-11 rounded-xl text-xs font-bold uppercase tracking-wider border-2"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" /> Download Invoice
              </Button>
              <Button
                type="button"
                onClick={onClose}
                className="flex-1 h-10 sm:h-11 rounded-xl bg-primary text-white font-black text-xs uppercase tracking-wider shadow-md hover:opacity-90"
              >
                Go to Seller Hub <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
export default PaymentModal;
