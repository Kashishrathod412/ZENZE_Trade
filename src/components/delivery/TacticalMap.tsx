import { motion } from "framer-motion";
import { MapPin, Navigation, Compass, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface TacticalMapProps {
  pickup?: string;
  drop?: string;
  drivers?: { id: string; name: string; lat: number; lng: number; status: string }[];
  isLive?: boolean;
}

export default function TacticalMap({ pickup, drop, drivers, isLive }: TacticalMapProps) {
  const [viewMode, setViewMode] = useState<"tactical" | "live">("tactical");

  return (
    <div className="relative w-full h-full min-h-[300px] bg-[#0b0b12] rounded-3xl sm:rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl group/map">
      
      {viewMode === "tactical" ? (
        <>
          {/* Google Maps Style Grid Background */}
          <div className="absolute inset-0 opacity-20" style={{ 
            backgroundImage: `radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)`,
            backgroundSize: '32px 32px' 
          }} />

          {/* Simulated Map Terrain */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-primary/5" />
          
          {/* Rotating Real-Time Radar Sweep Beam */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-25">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="w-[200%] h-[200%] origin-center bg-[conic-gradient(from_0deg_at_50%_50%,rgba(59,130,246,0.15)_0deg,transparent_60deg,transparent_360deg)] rounded-full"
            />
          </div>

          {/* Route Line (for Driver Mission) */}
          {pickup && drop && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <motion.path
                d="M 150 400 Q 400 250 650 150"
                fill="transparent"
                stroke="url(#routeGradient)"
                strokeWidth="4"
                strokeDasharray="10, 10"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          )}

          {/* Pins and Nodes */}
          <div className="absolute inset-0 p-6 sm:p-12">
            {pickup && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute top-[380px] left-[130px] flex flex-col items-center gap-2 group"
              >
                <div className="px-3 py-1.5 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest rounded-lg shadow-xl shadow-emerald-500/20 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Pickup Node
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-500 shadow-2xl shadow-emerald-500/40 relative">
                  <MapPin className="w-5 h-5" />
                  <div className="absolute -inset-2 bg-emerald-500/20 rounded-full animate-ping pointer-events-none" />
                </div>
              </motion.div>
            )}

            {drop && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute top-[130px] left-[630px] flex flex-col items-center gap-2 group"
              >
                <div className="px-3 py-1.5 bg-primary text-white text-[8px] font-black uppercase tracking-widest rounded-lg shadow-xl shadow-primary/20 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Drop Location
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-primary shadow-2xl shadow-primary/40 relative">
                  <Navigation className="w-5 h-5" />
                  <div className="absolute -inset-2 bg-primary/20 rounded-full animate-ping pointer-events-none" />
                </div>
              </motion.div>
            )}

            {/* Live Drivers (Admin View) */}
            {drivers?.map((driver, i) => (
              <motion.div
                key={driver.id}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  x: [0, Math.random() * 25 - 12, 0],
                  y: [0, Math.random() * 25 - 12, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{ top: `${20 + i * 15}%`, left: `${30 + i * 20}%` }}
                className="absolute flex flex-col items-center gap-2 group"
              >
                <div className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 text-white text-[7px] font-black uppercase tracking-widest rounded-lg opacity-90 group-hover:opacity-100 transition-opacity shadow-lg">
                  {driver.name}
                </div>
                <div className={`w-8 h-8 rounded-2xl border flex items-center justify-center shadow-2xl transition-all group-hover:scale-125 relative ${
                  driver.status === 'online' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 'bg-primary/20 border-primary text-primary'
                }`}>
                  <Zap className="w-4 h-4 fill-current" />
                  <div className={`absolute -inset-2 rounded-2xl animate-ping opacity-30 pointer-events-none ${
                    driver.status === 'online' ? 'bg-emerald-500/30' : 'bg-primary/30'
                  }`} />
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div className="absolute inset-0 w-full h-full grayscale-[0.8] brightness-[0.8] contrast-[1.2] opacity-90">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyA_NOT_A_REAL_KEY&q=${encodeURIComponent(drop || pickup || 'New Delhi, India')}&zoom=14`}
            allowFullScreen
          />
          {/* Overlay to keep the dashboard look */}
          <div className="absolute inset-0 pointer-events-none bg-primary/5 mix-blend-overlay" />
        </div>
      )}

      {/* Map HUD UI */}
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 flex flex-col gap-2.5 sm:gap-4 z-20 max-w-[calc(100%-2rem)]">
        <div className="p-3 sm:p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl shadow-2xl">
          <div className="flex items-center gap-2.5 sm:gap-3 mb-1.5 sm:mb-2">
            <div className={`w-2 h-2 rounded-full animate-pulse shrink-0 ${viewMode === 'live' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
            <p className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-wider sm:tracking-widest truncate">
              {viewMode === 'live' ? 'Live Satellite Mode' : 'Tactical Link Active'}
            </p>
          </div>
          <p className="text-[7px] sm:text-[8px] font-bold text-white/40 uppercase tracking-widest truncate">
            {viewMode === 'live' ? 'REAL_TIME_INTEL' : 'V4.2_GEO_SYNC'}
          </p>
        </div>
        
        <button 
          onClick={() => setViewMode(viewMode === 'tactical' ? 'live' : 'tactical')}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest border transition-all self-start ${
            viewMode === 'live' 
              ? 'bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/30' 
              : 'bg-white/10 border-white/10 text-white/60 hover:bg-white/20'
          }`}
        >
          {viewMode === 'live' ? 'Switch to Tactical' : 'Activate Live Map'}
        </button>
      </div>

      <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 flex gap-2 sm:gap-3 z-20">
        <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center hover:bg-primary transition-all shadow-xl">
          <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center hover:bg-primary transition-all font-black text-[10px] sm:text-xs shadow-xl">
          {viewMode === 'live' ? '3D' : '2D'}
        </button>
      </div>

      {/* Decorative Overlay */}
      <div className="absolute inset-0 pointer-events-none border-[16px] border-black/10 rounded-[2.5rem]" />
    </div>
  );
}
