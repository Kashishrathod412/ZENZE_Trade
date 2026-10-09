export const plans = [
  {
    name: "Starter",
    level: 1,
    monthlyPrice: 49,
    yearlyPrice: 499,
    desc: "Perfect for testing the waters",
    features: [
      { text: "Products: 5–10", icon: "check" },
      { text: "Limited leads", icon: "check" },
      { text: "No verification", icon: "cross" },
      { text: "1 Month Free", icon: "gift" }
    ],
    cta: "Join Network",
    popular: false,
  },
  {
    name: "Basic",
    level: 2,
    monthlyPrice: 99,
    yearlyPrice: 999,
    desc: "Good for growing businesses",
    features: [
      { text: "Products: 10–50", icon: "check" },
      { text: "More visibility", icon: "check" },
      { text: "Verification paid (₹199/year)", icon: "cross" },
      { text: "1 Month Free", icon: "gift" }
    ],
    cta: "Get Basic",
    popular: false,
  },
  {
    name: "Premium",
    level: 3,
    monthlyPrice: 299,
    yearlyPrice: 3000,
    desc: "Priority features and leads",
    features: [
      { text: "Products: 50–100", icon: "check" },
      { text: "Priority leads", icon: "check" },
      { text: "Featured listing", icon: "check" },
      { text: "Verification optional", icon: "cross" },
      { text: "1 Month Free", icon: "gift" }
    ],
    cta: "Go Premium",
    popular: false,
  },
  {
    name: "Advanced",
    level: 4,
    monthlyPrice: 499,
    yearlyPrice: 5000,
    desc: "Top tier positioning",
    features: [
      { text: "Products: 100–300", icon: "check" },
      { text: "Top ranking", icon: "check" },
      { text: "Homepage feature", icon: "check" },
      { text: "Premium badge", icon: "star" },
      { text: "FREE Verification", icon: "check" },
      { text: "1 Month Free", icon: "gift" }
    ],
    cta: "Go Advanced",
    popular: true,
  },
  {
    name: "Enterprise",
    level: 5,
    monthlyPrice: 999,
    yearlyPrice: 9999,
    desc: "Maximum reach and support",
    features: [
      { text: "Unlimited products", icon: "check" },
      { text: "Maximum visibility", icon: "check" },
      { text: "Top homepage placement", icon: "check" },
      { text: "Dedicated support", icon: "check" },
      { text: "Premium branding", icon: "star" },
      { text: "FREE Verification", icon: "check" }
    ],
    cta: "Contact Sales",
    popular: false,
  },
];
