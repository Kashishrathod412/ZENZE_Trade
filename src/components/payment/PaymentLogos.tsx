import React from "react";

// Google Pay Logo
export const GooglePayIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <div className={`inline-flex items-center justify-center shrink-0 rounded-lg bg-white p-1 shadow-sm border border-black/5 overflow-hidden ${className}`}>
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <path fill="#4285F4" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
      <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
      <path fill="#FBBC05" d="M24 44c5.2 0 9.9-2 13.4-5.3l-6.2-5.1C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.4 16.2 44 24 44z"/>
      <path fill="#EA4335" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.1c-.4.4 6.6-4.8 6.6-14.7 0-1.3-.1-2.7-.4-3.9z"/>
    </svg>
  </div>
);

// PhonePe Logo
export const PhonePeIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <div className={`inline-flex items-center justify-center shrink-0 rounded-lg bg-[#5F259F] p-1 shadow-sm border border-[#4a1c7c] overflow-hidden ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="48" fill="#5F259F" />
      <path
        d="M58 22H42c-2.2 0-4 1.8-4 4v48c0 2.2 1.8 4 4 4h4c1.1 0 2-.9 2-2V58h10c11 0 20-9 20-20s-9-16-20-16zm0 24H48V30h10c6.6 0 12 5.4 12 12s-5.4 12-12 12z"
        fill="#FFFFFF"
      />
      <path
        d="M34 50h8v8h-8z"
        fill="#00D09C"
      />
    </svg>
  </div>
);

// Paytm Logo
export const PaytmIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <div className={`inline-flex items-center justify-center shrink-0 rounded-lg bg-[#002970] p-1 shadow-sm border border-[#001d52] overflow-hidden ${className}`}>
    <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <text x="5" y="28" fill="#00BAF2" fontFamily="sans-serif" fontWeight="900" fontSize="24" letterSpacing="-1">
        Pay<tspan fill="#FFFFFF">tm</tspan>
      </text>
    </svg>
  </div>
);

// BHIM UPI Logo
export const BhimIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <div className={`inline-flex items-center justify-center shrink-0 rounded-lg bg-white p-1 shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <path d="M15 80L45 15H75L45 80H15Z" fill="#00796B" />
      <path d="M45 80L75 15H85L55 80H45Z" fill="#FF6F00" />
      <text x="18" y="94" fill="#004D40" fontFamily="sans-serif" fontWeight="900" fontSize="16">BHIM</text>
    </svg>
  </div>
);

// CRED Logo
export const CredIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <div className={`inline-flex items-center justify-center shrink-0 rounded-lg bg-[#121212] p-1 shadow-sm border border-white/10 overflow-hidden ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect width="100" height="100" rx="20" fill="#121212"/>
      <path d="M30 25H70V37H42V63H70V75H30V25Z" fill="#FFFFFF"/>
      <rect x="52" y="45" width="18" height="18" fill="#FFFFFF"/>
    </svg>
  </div>
);

// Amazon Pay Logo
export const AmazonPayIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <div className={`inline-flex items-center justify-center shrink-0 rounded-lg bg-[#232F3E] p-1 shadow-sm border border-black/20 overflow-hidden ${className}`}>
    <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <text x="6" y="26" fill="#FFFFFF" fontFamily="sans-serif" fontWeight="900" fontSize="20">
        amazon
      </text>
      <text x="60" y="26" fill="#FF9900" fontFamily="sans-serif" fontWeight="900" fontSize="16">
        pay
      </text>
      <path d="M10 36 C 30 46, 60 46, 75 36" stroke="#FF9900" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M72 32 L 78 37 L 70 41 Z" fill="#FF9900"/>
    </svg>
  </div>
);

// WhatsApp Pay Logo
export const WhatsAppPayIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <div className={`inline-flex items-center justify-center shrink-0 rounded-lg bg-[#25D366] p-1 shadow-sm border border-[#1ebd59] overflow-hidden ${className}`}>
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="#FFFFFF">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  </div>
);

// MobiKwik Logo
export const MobikwikIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <div className={`inline-flex items-center justify-center shrink-0 rounded-lg bg-[#0070BA] p-1 shadow-sm border border-[#005c99] overflow-hidden ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="46" fill="#0070BA" />
      <path d="M22 68V32L38 52L54 32V68H44V48L38 56L32 48V68H22Z" fill="#E6007E"/>
      <path d="M60 68V32H70V68H60Z" fill="#FFFFFF"/>
      <path d="M74 48L84 32H94L82 50L94 68H84L76 56V68H68V32H76V48Z" fill="#FFFFFF"/>
    </svg>
  </div>
);

// Visa Logo
export const VisaIcon: React.FC<{ className?: string }> = ({ className = "w-9 h-6" }) => (
  <div className={`inline-flex items-center justify-center shrink-0 rounded-md bg-white p-1 shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <svg viewBox="0 0 100 32" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <path d="M38 3L25 31H17L10 9C9 7 8 6 6 5C4 4 1 3 0 3L1 1H15C19 1 20 4 20 6L24 23L31 3H38Z" fill="#1A1F71"/>
      <path d="M53 3L44 31H37L46 3H53Z" fill="#1A1F71"/>
      <path d="M72 13C72 9 67 8 63 7C58 6 56 5 56 4C56 3 58 2 62 2C66 2 70 3 73 5L75 1C71 0 66 0 62 0C52 0 47 5 47 10C47 16 54 18 58 20C62 21 64 22 64 24C64 26 61 27 57 27C51 27 46 25 43 23L41 28C45 30 51 31 56 31C67 31 72 26 72 21V13Z" fill="#1A1F71"/>
      <path d="M92 3H84C81 3 79 4 78 7L66 31H75L77 25H88L89 31H97L92 3ZM80 19L84 9L86 19H80Z" fill="#1A1F71"/>
      <path d="M10 9L6 5C4 4 1 3 0 3L1 1H15C19 1 20 4 20 6L14 17L10 9Z" fill="#F7B600"/>
    </svg>
  </div>
);

// Mastercard Logo
export const MastercardIcon: React.FC<{ className?: string }> = ({ className = "w-9 h-6" }) => (
  <div className={`inline-flex items-center justify-center shrink-0 rounded-md bg-[#18181B] p-1 shadow-sm border border-white/10 overflow-hidden ${className}`}>
    <svg viewBox="0 0 100 60" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <circle cx="36" cy="30" r="24" fill="#EB001B"/>
      <circle cx="64" cy="30" r="24" fill="#F79E1B"/>
      <path d="M50 14.5C55.5 18.5 59 23.8 59 30C59 36.2 55.5 41.5 50 45.5C44.5 41.5 41 36.2 41 30C41 23.8 44.5 18.5 50 14.5Z" fill="#FF5F00"/>
    </svg>
  </div>
);

// RuPay Logo
export const RupayIcon: React.FC<{ className?: string }> = ({ className = "w-9 h-6" }) => (
  <div className={`inline-flex items-center justify-center shrink-0 rounded-md bg-white p-1 shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <svg viewBox="0 0 100 36" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <text x="2" y="27" fill="#092873" fontFamily="sans-serif" fontWeight="900" fontSize="26" fontStyle="italic">
        RuPay
      </text>
      <path d="M78 8L96 8L88 28L70 28Z" fill="#F47920"/>
      <path d="M86 8L100 8L92 28L78 28Z" fill="#00A651"/>
    </svg>
  </div>
);

// American Express (Amex) Logo
export const AmexIcon: React.FC<{ className?: string }> = ({ className = "w-9 h-6" }) => (
  <div className={`inline-flex items-center justify-center shrink-0 rounded-md bg-[#006FCF] p-1 shadow-sm border border-[#0055a5] overflow-hidden ${className}`}>
    <svg viewBox="0 0 100 60" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <rect width="100" height="60" rx="6" fill="#006FCF"/>
      <text x="6" y="38" fill="#FFFFFF" fontFamily="sans-serif" fontWeight="900" fontSize="24" letterSpacing="1">
        AMEX
      </text>
    </svg>
  </div>
);

// State Bank of India (SBI) Logo
export const SbiIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <div className={`inline-flex items-center justify-center shrink-0 rounded-lg bg-[#280071] p-1 shadow-sm border border-[#1e0054] overflow-hidden ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="46" fill="#00A5DF"/>
      <circle cx="50" cy="42" r="16" fill="#FFFFFF"/>
      <rect x="44" y="42" width="12" height="46" fill="#FFFFFF"/>
    </svg>
  </div>
);

// HDFC Bank Logo
export const HdfcIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <div className={`inline-flex items-center justify-center shrink-0 rounded-lg bg-white p-1 shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect width="100" height="100" rx="10" fill="#004C8F"/>
      <rect x="15" y="15" width="70" height="70" fill="#FFFFFF"/>
      <rect x="30" y="30" width="40" height="40" fill="#ED232A"/>
      <rect x="42" y="15" width="16" height="70" fill="#004C8F"/>
      <rect x="15" y="42" width="70" height="16" fill="#004C8F"/>
      <rect x="42" y="42" width="16" height="16" fill="#004C8F"/>
    </svg>
  </div>
);

// ICICI Bank Logo
export const IciciIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <div className={`inline-flex items-center justify-center shrink-0 rounded-lg bg-[#B02A30] p-1 shadow-sm border border-[#8c1e23] overflow-hidden ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="46" fill="#B02A30"/>
      <path d="M38 25C44 20 56 20 62 25C68 30 70 38 68 46C65 58 48 68 44 76C44 76 56 70 64 62" stroke="#F58220" strokeWidth="10" strokeLinecap="round" fill="none"/>
      <circle cx="50" cy="38" r="7" fill="#FFFFFF"/>
    </svg>
  </div>
);

// Axis Bank Logo
export const AxisIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <div className={`inline-flex items-center justify-center shrink-0 rounded-lg bg-[#97144D] p-1 shadow-sm border border-[#7a0f3d] overflow-hidden ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <polygon points="50,15 15,85 85,85" fill="#97144D"/>
      <polygon points="50,22 25,78 75,78" fill="#FFFFFF"/>
      <polygon points="50,38 36,70 64,70" fill="#97144D"/>
    </svg>
  </div>
);

// Kotak Mahindra Bank Logo
export const KotakIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <div className={`inline-flex items-center justify-center shrink-0 rounded-lg bg-[#ED1C24] p-1 shadow-sm border border-[#c4131a] overflow-hidden ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="46" fill="#ED1C24"/>
      <path d="M32 50C32 40 40 32 50 50C60 68 68 60 68 50C68 40 60 32 50 50C40 68 32 60 32 50Z" stroke="#003366" strokeWidth="8" fill="none"/>
      <path d="M50 50C42 36 34 42 34 50C34 58 42 64 50 50Z" fill="#FFFFFF"/>
    </svg>
  </div>
);

// Punjab National Bank (PNB) Logo
export const PnbIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <div className={`inline-flex items-center justify-center shrink-0 rounded-lg bg-[#A20A3A] p-1 shadow-sm border border-[#80072d] overflow-hidden ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect width="100" height="100" rx="12" fill="#A20A3A"/>
      <circle cx="50" cy="50" r="36" fill="#F8B133"/>
      <circle cx="50" cy="50" r="24" fill="#A20A3A"/>
      <rect x="44" y="26" width="12" height="48" fill="#F8B133"/>
    </svg>
  </div>
);

// Razorpay Official Glyph
export const RazorpayGlyph: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={`fill-current ${className}`}>
    <path d="M14.076 2.002L6.155 13.064h5.275L8.528 22.002l10.158-12.062h-5.492l.882-7.938z" fill="#0C2340"/>
    <path d="M14.076 2.002L8.528 22.002l10.158-12.062h-5.492l.882-7.938z" fill="#3395FF"/>
  </svg>
);

// UPI Official Badge
export const UpiBadge: React.FC<{ className?: string }> = ({ className = "h-5" }) => (
  <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white dark:bg-card border border-border shadow-xs ${className}`}>
    <svg viewBox="0 0 80 30" className="h-4 w-auto">
      <path d="M10 5L25 5L15 25L0 25Z" fill="#097939"/>
      <path d="M22 5L37 5L27 25L12 25Z" fill="#E76A00"/>
      <text x="35" y="22" fill="#1C3F60" fontFamily="sans-serif" fontWeight="900" fontSize="16">UPI</text>
    </svg>
  </div>
);
