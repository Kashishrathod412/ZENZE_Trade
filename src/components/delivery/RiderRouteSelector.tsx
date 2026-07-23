import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Clock, Zap, CheckCircle, X, Heart, ArrowRight, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ZONES = [
  { id: "all",     name: "All Areas",     color: "#8b5cf6", surge: null,  count: 0 },
  { id: "north",   name: "North Zone",    color: "#6366f1", surge: 1.3,   count: 8 },
  { id: "central", name: "Central Hub",   color: "#ef4444", surge: 1.8,   count: 14 },
  { id: "east",    name: "East Zone",     color: "#f59e0b", surge: 1.5,   count: 11 },
  { id: "west",    name: "West Zone",     color: "#3b82f6", surge: 1.1,   count: 6  },
  { id: "south",   name: "South Zone",    color: "#10b981", surge: null,   count: 5 },
];

const PINS = [
  { id:"p1",  x:80,  y:55,  zone:"north",   amount:320, km:3.2, est:"12 min", from:"Rohini Sec 7",      to:"Pitampura Metro"  },
  { id:"p2",  x:210, y:38,  zone:"north",   amount:450, km:5.1, est:"18 min", from:"Model Town",        to:"GTB Nagar"        },
  { id:"p3",  x:330, y:68,  zone:"north",   amount:280, km:2.8, est:"10 min", from:"Shalimar Bagh",     to:"Ashok Vihar"      },
  { id:"p4",  x:55,  y:155, zone:"west",    amount:380, km:4.2, est:"15 min", from:"Janakpuri",         to:"Dwarka Sec 6"     },
  { id:"p5",  x:148, y:138, zone:"central", amount:520, km:6.5, est:"22 min", from:"Connaught Place",   to:"Lajpat Nagar"     },
  { id:"p6",  x:205, y:152, zone:"central", amount:680, km:8.0, est:"28 min", from:"Rajiv Chowk",       to:"Nehru Place"      },
  { id:"p7",  x:255, y:128, zone:"central", amount:420, km:5.0, est:"17 min", from:"India Gate",        to:"Vasant Kunj"      },
  { id:"p8",  x:345, y:148, zone:"east",    amount:350, km:4.5, est:"16 min", from:"Laxmi Nagar",       to:"Preet Vihar"      },
  { id:"p9",  x:365, y:205, zone:"east",    amount:490, km:6.0, est:"21 min", from:"Shahdara",          to:"Dilshad Garden"   },
  { id:"p10", x:78,  y:238, zone:"south",   amount:390, km:4.8, est:"17 min", from:"Saket",             to:"Hauz Khas"        },
  { id:"p11", x:205, y:248, zone:"south",   amount:310, km:3.5, est:"13 min", from:"Green Park",        to:"IIT Delhi Gate"   },
  { id:"p12", x:308, y:255, zone:"south",   amount:470, km:5.7, est:"20 min", from:"Okhla NSIC",        to:"Jasola Vihar"     },
];

interface Props { isOnline: boolean; }

export default function RiderRouteSelector({ isOnline }: Props) {
  const [selectedZone, setSelectedZone] = useState("all");
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visiblePins = PINS.filter(p => {
    if (dismissed.has(p.id)) return false;
    return selectedZone === "all" || p.zone === selectedZone;
  });

  const pinData = PINS.find(p => p.id === selectedPin);
  const zoneObj = ZONES.find(z => z.id === selectedZone);

  const totalEarnings = visiblePins.reduce((s, p) => s + p.amount, 0);

  const accept = (id: string) => {
    setDismissed(prev => new Set([...prev, id]));
    setSelectedPin(null);
    toast.success("🎯 Delivery Accepted! Navigate to pickup point.");
  };

  const decline = (id: string) => {
    setDismissed(prev => new Set([...prev, id]));
    setSelectedPin(null);
    toast("Request skipped.");
  };

  const onPinClick = (id: string) => {
    if (!isOnline) { toast.error("Go Online first to see delivery requests."); return; }
    setSelectedPin(prev => prev === id ? null : id);
  };

  return (
    <div className="flex flex-col gap-4 w-full">

      {/* ── Zone Chips ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {ZONES.map(z => (
          <button
            key={z.id}
            onClick={() => setSelectedZone(z.id)}
            style={selectedZone === z.id ? { backgroundColor: z.color, boxShadow: `0 4px 16px ${z.color}50` } : {}}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
              selectedZone === z.id
                ? "text-white border-transparent"
                : "bg-white dark:bg-card border-border text-muted-foreground hover:border-primary/30"
            }`}
          >
            {z.name}
            {z.id !== "all" && (
              <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-black ${selectedZone === z.id ? "bg-white/25 text-white" : "bg-muted text-muted-foreground"}`}>
                {z.count}
              </span>
            )}
            {z.surge && z.id !== "all" && (
              <span className={`flex items-center gap-0.5 text-[8px] font-black ${selectedZone === z.id ? "text-yellow-200" : "text-amber-500"}`}>
                <Zap className="w-2.5 h-2.5" />{z.surge}x
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Stats Bar ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Live Requests", val: visiblePins.length, color: "text-primary" },
          { label: "Potential Earn", val: `₹${totalEarnings}`, color: "text-emerald-500" },
          { label: "Surge Zone", val: zoneObj?.surge ? `${zoneObj.surge}x` : "Normal", color: "text-amber-500" },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-card border border-border rounded-2xl p-4 text-center shadow-sm">
            <p className={`text-lg font-black tracking-tight ${s.color}`}>{s.val}</p>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Interactive Map ── */}
      <div className="relative bg-[#12131f] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl"
           style={{ minHeight: 340 }}>
        <svg viewBox="0 0 420 300" className="w-full" style={{ display: "block" }}>

          {/* Background */}
          <rect width="420" height="300" fill="#12131f" />

          {/* Zone colour overlays */}
          <rect x="0"   y="0"   width="420" height="100" fill="#6366f108" />
          <rect x="0"   y="200" width="420" height="100" fill="#10b98108" />
          <rect x="0"   y="100" width="140" height="100" fill="#3b82f608" />
          <rect x="280" y="100" width="140" height="100" fill="#f59e0b08" />
          <rect x="140" y="100" width="140" height="100" fill="#ef444408" />

          {/* Selected zone highlight */}
          {selectedZone === "north"   && <rect x="0"   y="0"   width="420" height="100" fill="#6366f118" stroke="#6366f140" strokeWidth="1" />}
          {selectedZone === "south"   && <rect x="0"   y="200" width="420" height="100" fill="#10b98118" stroke="#10b98140" strokeWidth="1" />}
          {selectedZone === "west"    && <rect x="0"   y="100" width="140" height="100" fill="#3b82f618" stroke="#3b82f640" strokeWidth="1" />}
          {selectedZone === "east"    && <rect x="280" y="100" width="140" height="100" fill="#f59e0b18" stroke="#f59e0b40" strokeWidth="1" />}
          {selectedZone === "central" && <rect x="140" y="100" width="140" height="100" fill="#ef444418" stroke="#ef444440" strokeWidth="1" />}

          {/* Zone labels */}
          <text x="210" y="22"  textAnchor="middle" fill="#6366f160" fontSize="7" fontWeight="900" letterSpacing="3">NORTH ZONE</text>
          <text x="210" y="288" textAnchor="middle" fill="#10b98160" fontSize="7" fontWeight="900" letterSpacing="3">SOUTH ZONE</text>
          <text x="22"  y="153" textAnchor="middle" fill="#3b82f660" fontSize="6" fontWeight="900" letterSpacing="2">WEST</text>
          <text x="400" y="153" textAnchor="middle" fill="#f59e0b60" fontSize="6" fontWeight="900" letterSpacing="2">EAST</text>
          <text x="210" y="155" textAnchor="middle" fill="#ef444460" fontSize="6" fontWeight="900" letterSpacing="2">CENTRAL</text>

          {/* Major road grid */}
          <line x1="0" y1="100" x2="420" y2="100" stroke="#ffffff10" strokeWidth="5" />
          <line x1="0" y1="200" x2="420" y2="200" stroke="#ffffff10" strokeWidth="5" />
          <line x1="0" y1="150" x2="420" y2="150" stroke="#ffffff07" strokeWidth="2.5" />
          <line x1="0" y1="50"  x2="420" y2="50"  stroke="#ffffff06" strokeWidth="2" />
          <line x1="0" y1="250" x2="420" y2="250" stroke="#ffffff06" strokeWidth="2" />
          <line x1="140" y1="0" x2="140" y2="300" stroke="#ffffff10" strokeWidth="5" />
          <line x1="280" y1="0" x2="280" y2="300" stroke="#ffffff10" strokeWidth="5" />
          <line x1="70"  y1="0" x2="70"  y2="300" stroke="#ffffff06" strokeWidth="2" />
          <line x1="210" y1="0" x2="210" y2="300" stroke="#ffffff06" strokeWidth="2" />
          <line x1="350" y1="0" x2="350" y2="300" stroke="#ffffff06" strokeWidth="2" />
          {/* Diagonals */}
          <line x1="0"   y1="100" x2="140" y2="0"   stroke="#ffffff05" strokeWidth="1.5" />
          <line x1="280" y1="0"   x2="420" y2="100" stroke="#ffffff05" strokeWidth="1.5" />
          <line x1="0"   y1="200" x2="140" y2="300" stroke="#ffffff05" strokeWidth="1.5" />
          <line x1="280" y1="300" x2="420" y2="200" stroke="#ffffff05" strokeWidth="1.5" />
          <line x1="140" y1="100" x2="280" y2="200" stroke="#ffffff04" strokeWidth="1" />
          <line x1="140" y1="200" x2="280" y2="100" stroke="#ffffff04" strokeWidth="1" />
          {/* Road dots at intersections */}
          {[[140,100],[280,100],[140,200],[280,200],[70,100],[210,100],[350,100],[70,200],[210,200],[350,200]].map(([cx,cy],i) => (
            <circle key={i} cx={cx} cy={cy} r="3.5" fill="#ffffff15" />
          ))}

          {/* My Location pin */}
          <circle cx="210" cy="150" r="16" fill="#3b82f620" />
          <circle cx="210" cy="150" r="9"  fill="#3b82f6" />
          <circle cx="210" cy="150" r="4"  fill="white" />
          <text x="210" y="130" textAnchor="middle" fill="#3b82f6" fontSize="7" fontWeight="bold">YOU</text>

          {/* Delivery request pins */}
          {visiblePins.map((p) => {
            const z   = ZONES.find(z => z.id === p.zone)!;
            const sel = selectedPin === p.id;
            return (
              <g key={p.id} onClick={() => onPinClick(p.id)} style={{ cursor: "pointer" }}>
                {/* pulse ring 1 */}
                <circle cx={p.x} cy={p.y} r="18" fill="none" stroke={z.color} strokeWidth="1.5" opacity="0.4">
                  <animate attributeName="r"     values="12;22;12"  dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                </circle>
                {/* badge bg */}
                <circle cx={p.x} cy={p.y} r={sel ? 13 : 10} fill={z.color} />
                {/* heart symbol */}
                <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={sel ? 11 : 9} fill="white">♥</text>
                {/* amount label */}
                <rect x={p.x + 11} y={p.y - 22} width="38" height="14" rx="7" fill="white" opacity="0.92" />
                <text x={p.x + 30} y={p.y - 12} textAnchor="middle" fontSize="7" fill="#12131f" fontWeight="900">₹{p.amount}</text>
              </g>
            );
          })}

          {/* Offline overlay */}
          {!isOnline && (
            <>
              <rect width="420" height="300" fill="#00000085" />
              <rect x="130" y="118" width="160" height="64" rx="16" fill="#1a1b2e" />
              <text x="210" y="145" textAnchor="middle" fill="white"      fontSize="13" fontWeight="900">GO ONLINE</text>
              <text x="210" y="168" textAnchor="middle" fill="#ffffff60"  fontSize="8"  fontWeight="700">to see live delivery requests</text>
            </>
          )}
        </svg>

        {/* Floating live count */}
        <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/15 text-center">
          <p className="text-2xl font-black text-white leading-none">{visiblePins.length}</p>
          <p className="text-[8px] font-black text-white/60 uppercase tracking-widest mt-0.5">Requests</p>
        </div>

        {/* Surge badge */}
        {zoneObj?.surge && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-amber-500/90 backdrop-blur-md rounded-xl px-3 py-2 shadow-lg">
            <Zap className="w-3 h-3 text-white" />
            <span className="text-[9px] font-black text-white uppercase tracking-widest">{zoneObj.surge}x Surge</span>
          </div>
        )}
      </div>

      {/* ── Request List (below map, scrollable) ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-foreground uppercase tracking-tight flex items-center gap-2">
            <Route className="w-4 h-4 text-primary" />
            Delivery Requests {selectedZone !== "all" && `· ${zoneObj?.name}`}
          </h3>
          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
            {visiblePins.length} available
          </span>
        </div>

        {visiblePins.length === 0 && (
          <div className="py-16 rounded-[2rem] border-2 border-dashed border-border bg-muted/20 text-center">
            <MapPin className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-50">
              No requests in this area
            </p>
          </div>
        )}

        {visiblePins.map((p) => {
          const z   = ZONES.find(z => z.id === p.zone)!;
          const sel = selectedPin === p.id;
          return (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -30 }}
              onClick={() => onPinClick(p.id)}
              className={`rounded-[1.75rem] border-2 transition-all cursor-pointer overflow-hidden ${
                sel
                  ? "border-primary shadow-xl shadow-primary/15 bg-primary/5"
                  : "border-border bg-white dark:bg-card hover:border-primary/40 hover:shadow-md"
              }`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between p-5 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: `${z.color}20` }}>
                    <Heart className="w-4 h-4" style={{ color: z.color }} fill={z.color} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ backgroundColor: `${z.color}20`, color: z.color }}>
                        {z.name}
                      </span>
                      {z.surge && (
                        <span className="text-[9px] font-black text-amber-500 flex items-center gap-0.5">
                          <Zap className="w-2.5 h-2.5" />{z.surge}x
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{p.km} km away</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-foreground tracking-tight">₹{p.amount}</p>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Est. Payout</p>
                </div>
              </div>

              {/* Route line */}
              <div className="px-5 pb-3 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-[11px] font-bold text-foreground truncate">{p.from}</p>
                </div>
                <div className="ml-2.5 w-0.5 h-3 bg-gradient-to-b from-emerald-500 to-primary rounded-full" />
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-2.5 h-2.5 text-primary" />
                  </div>
                  <p className="text-[11px] font-bold text-foreground truncate">{p.to}</p>
                </div>
              </div>

              {/* Bottom row */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-border/50 bg-muted/20">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Navigation className="w-3 h-3 text-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{p.km} KM</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{p.est}</span>
                  </div>
                </div>
                <AnimatePresence>
                  {sel && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); decline(p.id); }}
                        className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-95"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); accept(p.id); }}
                        className="h-9 px-5 rounded-xl gradient-primary text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Accept
                      </button>
                    </motion.div>
                  )}
                  {!sel && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
