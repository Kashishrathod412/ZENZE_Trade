import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";

// ── Country → Currency map (worldwide) ──────────────────────────────────────
const COUNTRY_CURRENCY: Record<string, { code: string; symbol: string; flag: string; decimals: number }> = {
  IN: { code: "INR", symbol: "₹",    flag: "🇮🇳", decimals: 0 },
  US: { code: "USD", symbol: "$",    flag: "🇺🇸", decimals: 2 },
  CA: { code: "CAD", symbol: "C$",   flag: "🇨🇦", decimals: 2 },
  GB: { code: "GBP", symbol: "£",    flag: "🇬🇧", decimals: 2 },
  AU: { code: "AUD", symbol: "A$",   flag: "🇦🇺", decimals: 2 },
  NZ: { code: "NZD", symbol: "NZ$",  flag: "🇳🇿", decimals: 2 },
  DE: { code: "EUR", symbol: "€",    flag: "🇩🇪", decimals: 2 },
  FR: { code: "EUR", symbol: "€",    flag: "🇫🇷", decimals: 2 },
  IT: { code: "EUR", symbol: "€",    flag: "🇮🇹", decimals: 2 },
  ES: { code: "EUR", symbol: "€",    flag: "🇪🇸", decimals: 2 },
  NL: { code: "EUR", symbol: "€",    flag: "🇳🇱", decimals: 2 },
  PT: { code: "EUR", symbol: "€",    flag: "🇵🇹", decimals: 2 },
  BE: { code: "EUR", symbol: "€",    flag: "🇧🇪", decimals: 2 },
  AT: { code: "EUR", symbol: "€",    flag: "🇦🇹", decimals: 2 },
  CH: { code: "CHF", symbol: "Fr",   flag: "🇨🇭", decimals: 2 },
  SE: { code: "SEK", symbol: "kr",   flag: "🇸🇪", decimals: 2 },
  NO: { code: "NOK", symbol: "kr",   flag: "🇳🇴", decimals: 2 },
  DK: { code: "DKK", symbol: "kr",   flag: "🇩🇰", decimals: 2 },
  JP: { code: "JPY", symbol: "¥",    flag: "🇯🇵", decimals: 0 },
  CN: { code: "CNY", symbol: "¥",    flag: "🇨🇳", decimals: 2 },
  KR: { code: "KRW", symbol: "₩",    flag: "🇰🇷", decimals: 0 },
  SG: { code: "SGD", symbol: "S$",   flag: "🇸🇬", decimals: 2 },
  HK: { code: "HKD", symbol: "HK$",  flag: "🇭🇰", decimals: 2 },
  MY: { code: "MYR", symbol: "RM",   flag: "🇲🇾", decimals: 2 },
  TH: { code: "THB", symbol: "฿",    flag: "🇹🇭", decimals: 2 },
  ID: { code: "IDR", symbol: "Rp",   flag: "🇮🇩", decimals: 0 },
  PH: { code: "PHP", symbol: "₱",    flag: "🇵🇭", decimals: 2 },
  VN: { code: "VND", symbol: "₫",    flag: "🇻🇳", decimals: 0 },
  TW: { code: "TWD", symbol: "NT$",  flag: "🇹🇼", decimals: 2 },
  AE: { code: "AED", symbol: "د.إ",  flag: "🇦🇪", decimals: 2 },
  SA: { code: "SAR", symbol: "﷼",    flag: "🇸🇦", decimals: 2 },
  QA: { code: "QAR", symbol: "﷼",    flag: "🇶🇦", decimals: 2 },
  KW: { code: "KWD", symbol: "د.ك",  flag: "🇰🇼", decimals: 3 },
  BH: { code: "BHD", symbol: "BD",   flag: "🇧🇭", decimals: 3 },
  OM: { code: "OMR", symbol: "ر.ع.", flag: "🇴🇲", decimals: 3 },
  IL: { code: "ILS", symbol: "₪",    flag: "🇮🇱", decimals: 2 },
  TR: { code: "TRY", symbol: "₺",    flag: "🇹🇷", decimals: 2 },
  ZA: { code: "ZAR", symbol: "R",    flag: "🇿🇦", decimals: 2 },
  NG: { code: "NGN", symbol: "₦",    flag: "🇳🇬", decimals: 2 },
  KE: { code: "KES", symbol: "KSh",  flag: "🇰🇪", decimals: 2 },
  EG: { code: "EGP", symbol: "E£",   flag: "🇪🇬", decimals: 2 },
  GH: { code: "GHS", symbol: "₵",    flag: "🇬🇭", decimals: 2 },
  BR: { code: "BRL", symbol: "R$",   flag: "🇧🇷", decimals: 2 },
  MX: { code: "MXN", symbol: "MX$",  flag: "🇲🇽", decimals: 2 },
  AR: { code: "ARS", symbol: "$",    flag: "🇦🇷", decimals: 2 },
  CL: { code: "CLP", symbol: "$",    flag: "🇨🇱", decimals: 0 },
  CO: { code: "COP", symbol: "$",    flag: "🇨🇴", decimals: 0 },
  PK: { code: "PKR", symbol: "₨",    flag: "🇵🇰", decimals: 0 },
  BD: { code: "BDT", symbol: "৳",    flag: "🇧🇩", decimals: 2 },
  LK: { code: "LKR", symbol: "Rs",   flag: "🇱🇰", decimals: 2 },
  NP: { code: "NPR", symbol: "Rs",   flag: "🇳🇵", decimals: 2 },
  MM: { code: "MMK", symbol: "K",    flag: "🇲🇲", decimals: 0 },
  PL: { code: "PLN", symbol: "zł",   flag: "🇵🇱", decimals: 2 },
  CZ: { code: "CZK", symbol: "Kč",   flag: "🇨🇿", decimals: 2 },
  HU: { code: "HUF", symbol: "Ft",   flag: "🇭🇺", decimals: 0 },
  RO: { code: "RON", symbol: "lei",  flag: "🇷🇴", decimals: 2 },
  RU: { code: "RUB", symbol: "₽",    flag: "🇷🇺", decimals: 2 },
  UA: { code: "UAH", symbol: "₴",    flag: "🇺🇦", decimals: 2 },
};

const DEFAULT_CURRENCY = { code: "USD", symbol: "$", flag: "🌍", decimals: 2 };

// ── Cache helpers ─────────────────────────────────────────────────────────────
const COUNTRY_CACHE_KEY = "zenze_ip_country";
const RATE_CACHE_KEY    = "zenze_rates_inr";
const COUNTRY_TTL = 24 * 60 * 60 * 1000; // 24 hours
const RATE_TTL    = 60 * 60 * 1000;       // 1 hour

function getCached<T>(key: string, ttl: number): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { value, ts } = JSON.parse(raw);
    if (Date.now() - ts > ttl) return null;
    return value as T;
  } catch { return null; }
}

function setCached(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify({ value, ts: Date.now() }));
  } catch {}
}

async function detectCountry(): Promise<string> {
  const cached = getCached<string>(COUNTRY_CACHE_KEY, COUNTRY_TTL);
  if (cached) return cached;
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    const code: string = data?.country_code ?? "IN";
    setCached(COUNTRY_CACHE_KEY, code);
    return code;
  } catch { return "IN"; }
}

async function fetchRates(): Promise<Record<string, number>> {
  const cached = getCached<Record<string, number>>(RATE_CACHE_KEY, RATE_TTL);
  if (cached) return cached;
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/INR");
    const data = await res.json();
    const rates: Record<string, number> = data?.rates ?? {};
    setCached(RATE_CACHE_KEY, rates);
    return rates;
  } catch { return { USD: 0.012 }; }
}

// ── Context types ─────────────────────────────────────────────────────────────
interface CurrencyContextType {
  currency: string;
  symbol: string;
  flag: string;
  countryCode: string;
  isIndia: boolean;
  formatPrice: (inrAmount: number) => string;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "INR",
  symbol: "₹",
  flag: "🇮🇳",
  countryCode: "IN",
  isIndia: true,
  formatPrice: (n) => `₹${Math.round(n).toLocaleString("en-IN")}`,
  loading: false,
});

// ── Provider ──────────────────────────────────────────────────────────────────
export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [countryCode, setCountryCode] = useState<string>("IN");
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      setLoading(true);
      // 1. Determine country
      let country: string;
      if (user?.country) {
        country = user.country;
      } else {
        country = await detectCountry();
      }
      if (cancelled) return;
      setCountryCode(country);

      // 2. Fetch exchange rates (skip if India — no conversion needed)
      const currInfo = COUNTRY_CURRENCY[country] ?? DEFAULT_CURRENCY;
      if (currInfo.code !== "INR") {
        const r = await fetchRates();
        if (!cancelled) setRates(r);
      }
      if (!cancelled) setLoading(false);
    }
    init();
    return () => { cancelled = true; };
  }, [user?.country]);

  const currInfo = COUNTRY_CURRENCY[countryCode] ?? DEFAULT_CURRENCY;
  const isIndia = currInfo.code === "INR";

  const formatPrice = (inrAmount: number): string => {
    if (isIndia) {
      return `₹${Math.round(inrAmount).toLocaleString("en-IN")}`;
    }
    const rate = rates[currInfo.code] ?? 0.012;
    const converted = inrAmount * rate;
    const formatted = currInfo.decimals === 0
      ? Math.round(converted).toLocaleString()
      : converted.toFixed(currInfo.decimals);
    return `${currInfo.symbol}${formatted}`;
  };

  return (
    <CurrencyContext.Provider value={{
      currency: currInfo.code,
      symbol: currInfo.symbol,
      flag: currInfo.flag,
      countryCode,
      isIndia,
      formatPrice,
      loading,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
