import { motion } from "framer-motion";
import { Activity, Globe as GlobeIcon, Zap } from "lucide-react";
import { useState } from "react";

interface StateData {
  name: string;
  val: string;
  count: string;
  color: string;
}

interface CountryData {
  name: string;
  flag: string;
  stat: string;
  states: StateData[];
  x: number; // 0-100%
  y: number; // 0-100%
}

interface Globe3DProps {
  onSelectCountry: (country: CountryData) => void;
}

/**
 * FINAL SURGICAL CALIBRATION FOR ADMIN GROWTH TRACKING
 * Anchored specifically to the world map landmasses
 */
const mockCountries: CountryData[] = [
  { 
    name: "USA", 
    flag: "🇺🇸", 
    stat: "1.2k REGISTERED",
    x: 21,
    y: 33,
    states: [{ name: "California", val: "96%", count: "2,100", color: "#3b82f6" }]
  },
  { 
    name: "Germany", 
    flag: "🇩🇪", 
    stat: "420 REGISTERED",
    x: 50.5,
    y: 19,
    states: [{ name: "Bavaria", val: "93%", count: "890", color: "#3b82f6" }]
  },
  { 
    name: "UAE", 
    flag: "🇦🇪", 
    stat: "850 REGISTERED",
    x: 60.5,
    y: 34,
    states: [{ name: "Dubai", val: "97%", count: "3,400", color: "#3b82f6" }]
  },
  { 
    name: "India", 
    flag: "🇮🇳", 
    stat: "3.4k REGISTERED",
    x: 71.5,
    y: 36,
    states: [{ name: "Maharashtra", val: "94%", count: "1,240", color: "#3b82f6" }]
  }
];

export default function Globe3D({ onSelectCountry }: Globe3DProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <div className="w-full h-full flex items-center justify-center relative bg-[#010106] overflow-hidden rounded-[3rem] p-8">
      {/* High-Fidelity Space Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12)_0%,transparent_80%)]" />
      <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      
      {/* Photo-Realistic Responsive 3D Globe */}
      <div className="relative w-full max-w-[560px] aspect-square flex items-center justify-center group/globe scale-110">
        
        {/* Atmospheric Glow Halo */}
        <div className="absolute inset-[-15%] rounded-full bg-blue-500/20 blur-[100px] animate-pulse pointer-events-none" />
        <div className="absolute inset-0 rounded-full shadow-[0_0_120px_rgba(37,99,235,0.5),inset_0_0_150px_rgba(37,99,235,0.7)] z-20 pointer-events-none border border-blue-400/20" />
        
        {/* Sphere Core */}
        <div className="w-full h-full rounded-full bg-[#051125] relative overflow-hidden flex items-center justify-center shadow-2xl border border-white/10">
          
          {/* Synchronized Real Rotation System */}
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
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

            {/* Accurately Pited Admin Intel Nodes */}
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
                          <div className="w-2.5 h-2.5 rounded-full bg-white border-2 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,1)] transition-all duration-300 group-hover/node:scale-150">
                             <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-80" />
                          </div>
                          
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-5 pointer-events-none transition-all duration-300 opacity-0 group-hover/node:opacity-100 group-hover/node:-translate-y-3">
                             <div className="bg-[#051125]/95 backdrop-blur-3xl border border-white/20 px-6 py-3 rounded-full whitespace-nowrap shadow-2xl">
                                <div className="flex flex-col items-center leading-none">
                                   <span className="text-[14px] font-black text-white uppercase tracking-wider mb-1.5">{country.name}</span>
                                   <span className="text-[11px] font-black text-blue-400">{country.stat}</span>
                                </div>
                             </div>
                          </div>
                        </button>
                      </div>
                    ))}
                 </div>
               ))}
            </div>
          </motion.div>

          {/* Cinematic Shading & Depth */}
          <div className="absolute inset-0 z-30 pointer-events-none bg-[radial-gradient(circle_at_35%_35%,transparent_45%,rgba(0,0,0,0.7)_100%)]" />
          <div className="absolute inset-0 z-30 pointer-events-none shadow-[inset_0_0_120px_rgba(37,99,235,0.6)]" />
          <div className="absolute inset-0 z-30 pointer-events-none bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
        </div>
      </div>


    </div>
  );
}
