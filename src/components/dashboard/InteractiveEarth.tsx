import { motion } from "framer-motion";
import { Activity, Globe as GlobeIcon, Zap } from "lucide-react";
import { useState } from "react";

interface CityData {
  name: string;
  count: string;
}

interface StateData {
  name: string;
  val: string;
  count: string;
  color: string;
  cities?: CityData[];
}

interface CountryData {
  name: string;
  flag: string;
  stat: string;
  states: StateData[];
  x: number; // 0-100%
  y: number; // 0-100%
}

interface InteractiveEarthProps {
  onSelectCountry: (country: CountryData) => void;
}

/**
 * FINAL SURGICAL CALIBRATION FOR THE ROTATING EARTH
 * Mapped specifically to the high-visibility map landmasses
 */
const mockCountries: CountryData[] = [
  { 
    name: "USA", 
    flag: "🇺🇸", 
    stat: "2.1k INQUIRIES",
    x: 21, // Shifted West to hit North America center
    y: 33, // Shifted South to hit continental USA
    states: [{ name: "California", val: "96%", count: "2,100", color: "#3b82f6", cities: [{ name: "LA", count: "890" }] }]
  },
  { 
    name: "Germany", 
    flag: "🇩🇪", 
    stat: "850 INQUIRIES",
    x: 50.5, // Shifted to hit Central Europe precisely
    y: 19,   // Shifted North to hit Germany landmass
    states: [{ name: "Bavaria", val: "93%", count: "850", color: "#3b82f6", cities: [{ name: "Munich", count: "420" }] }]
  },
  { 
    name: "UAE", 
    flag: "🇦🇪", 
    stat: "3.4k INQUIRIES",
    x: 60.5, // Shifted West to hit the Arabian Peninsula
    y: 34,   // Shifted North to hit the UAE region
    states: [{ name: "Dubai", val: "97%", count: "3,400", color: "#3b82f6", cities: [{ name: "Downtown", count: "1,200" }] }]
  },
  { 
    name: "India", 
    flag: "🇮🇳", 
    stat: "1.2k INQUIRIES",
    x: 71.5, // Shifted East to hit the center of India
    y: 36,   // Shifted significantly North to hit the landmass
    states: [{ name: "Maharashtra", val: "94%", count: "1,240", color: "#3b82f6", cities: [{ name: "Mumbai", count: "450" }] }]
  }
];

export default function InteractiveEarth({ onSelectCountry }: InteractiveEarthProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <div className="w-full h-full flex items-center justify-center relative bg-[#010106] overflow-hidden rounded-[2.5rem] sm:rounded-[3rem] p-4 lg:p-8">
      {/* High-Fidelity Deep Space Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_80%)]" />
      <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      
      {/* Photo-Realistic 3D Earth System */}
      <div className="relative w-full max-w-[600px] aspect-square flex items-center justify-center group/globe">
        
        {/* Atmospheric Glow Layer */}
        <div className="absolute inset-[-12%] rounded-full bg-blue-500/20 blur-[90px] animate-pulse pointer-events-none" />
        <div className="absolute inset-0 rounded-full shadow-[0_0_120px_rgba(37,99,235,0.5),inset_0_0_150px_rgba(37,99,235,0.7)] z-20 pointer-events-none border border-blue-400/20" />
        
        {/* Sphere Body */}
        <div className="w-full h-full rounded-full bg-[#051125] relative overflow-hidden flex items-center justify-center shadow-2xl border border-white/10">
          
          {/* Synchronized Surgical Rotation Layer */}
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 85, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 h-full w-[200%] flex pointer-events-none z-10"
          >
            {/* World Surface Map */}
            <div 
              className="h-full w-full flex opacity-90"
              style={{
                backgroundImage: `url("https://upload.wikimedia.org/wikipedia/commons/4/41/Simple_world_map.svg")`,
                backgroundRepeat: 'repeat-x',
                backgroundSize: '50% 100%',
                filter: 'invert(1) brightness(1.6) contrast(1.1) saturate(1.2) drop-shadow(0 0 4px rgba(59,130,246,0.4))'
              }}
            />

            {/* Accurately Pited Geospatial Nodes */}
            <div className="absolute top-0 left-0 h-full w-full flex">
               {[0, 1].map((i) => (
                 <div key={i} className="relative h-full w-1/2">
                    {mockCountries.map((country) => (
                      <div
                        key={`${country.name}-${i}`}
                        style={{ 
                          position: 'absolute', 
                          left: `${country.x}%`, 
                          top: `${country.y}%`,
                          transform: 'translate(-50%, -50%)',
                          pointerEvents: 'auto'
                        }}
                      >
                        <button
                          onClick={() => onSelectCountry(country)}
                          onMouseEnter={() => setHoveredNode(country.name)}
                          onMouseLeave={() => setHoveredNode(null)}
                          className="relative flex items-center justify-center p-8 group/node"
                        >
                          {/* Active Node Pulse */}
                          <div className="w-3 h-3 rounded-full bg-white border-2 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,1)] transition-all duration-300 group-hover/node:scale-150">
                             <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-80" />
                          </div>
                          
                          {/* Premium HUD Label */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-5 pointer-events-none transition-all duration-300 opacity-0 group-hover/node:opacity-100 group-hover/node:-translate-y-3">
                             <div className="bg-black/95 backdrop-blur-3xl border border-white/20 px-6 py-3 rounded-[2.5rem] whitespace-nowrap shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
                                <div className="flex flex-col items-center leading-none">
                                   <span className="text-[14px] font-black text-white uppercase tracking-wider mb-1.5">{country.name}</span>
                                   <div className="flex items-center gap-2 px-2.5 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                                      <Activity className="w-3 h-3 text-blue-400" />
                                      <span className="text-[11px] font-black text-blue-400 tracking-tight">{country.stat}</span>
                                   </div>
                                </div>
                             </div>
                             <div className="w-[1.5px] h-6 bg-gradient-to-b from-blue-400/60 to-transparent mx-auto" />
                          </div>
                        </button>
                      </div>
                    ))}
                 </div>
               ))}
            </div>
          </motion.div>

          {/* Cinematic Lighting & Shading */}
          <div className="absolute inset-0 z-30 pointer-events-none bg-[radial-gradient(circle_at_35%_35%,transparent_40%,rgba(0,0,0,0.7)_95%)]" />
          <div className="absolute inset-0 z-30 pointer-events-none shadow-[inset_0_0_120px_rgba(37,99,235,0.6)]" />
          <div className="absolute inset-0 z-30 pointer-events-none bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
        </div>
      </div>

      {/* Operation HUD Overlays */}
      <div className="absolute bottom-6 sm:bottom-10 right-6 sm:right-10 flex items-center gap-6 sm:gap-10 bg-black/60 backdrop-blur-3xl border border-white/10 px-8 sm:px-14 py-4 sm:py-8 rounded-[3.5rem] shadow-2xl z-40">
         <div className="text-right">
            <p className="text-[10px] sm:text-[12px] font-black text-blue-400 uppercase tracking-[0.5em] mb-2 sm:mb-2.5 whitespace-nowrap">Global_Intel_Stream</p>
            <div className="flex items-center justify-end gap-3 sm:gap-4">
               <span className="text-3xl sm:text-5xl font-black text-white tracking-tighter tabular-nums">98.2%</span>
               <div className="flex gap-1 sm:gap-2">
                  {[1,2,3].map(i => <div key={i} className="w-1.5 sm:w-2 h-4 sm:h-6 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: `${i*0.2}s` }} />)}
               </div>
            </div>
         </div>
         <div className="hidden sm:block w-px h-20 bg-white/20" />
         <Zap className="hidden sm:block w-14 h-14 text-blue-500 animate-pulse fill-blue-500/10" />
      </div>
    </div>
  );
}
