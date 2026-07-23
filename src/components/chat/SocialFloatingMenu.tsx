import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Facebook, Linkedin, Instagram, Youtube, X, AtSign } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLocation } from "react-router-dom";

const socialLinks = [
  { icon: Youtube, color: "bg-[#FF0000]", label: "YouTube", x: -115, y: 0 },
  { icon: Instagram, color: "bg-[#E4405F]", label: "Instagram", x: -110, y: -75 },
  { icon: Linkedin, color: "bg-[#0A66C2]", label: "LinkedIn", x: -85, y: -140 },
  { icon: Facebook, color: "bg-[#1877F2]", label: "Facebook", x: -40, y: -190 },
  { icon: AtSign, color: "bg-[#000000]", label: "Threads", x: 10, y: -220 },
];

export default function SocialFloatingMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="fixed bottom-[116px] right-8 z-[5100]">
      <TooltipProvider>
        <div className="relative flex items-center justify-center">
          <AnimatePresence>
            {isOpen && (
              <>
                {socialLinks.map((social, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1, 
                      x: social.x, 
                      y: social.y 
                    }}
                    exit={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 30, 
                      delay: index * 0.04 
                    }}
                    className="absolute"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.a
                          href="#"
                          whileHover={{ scale: 1.25, rotate: 12 }}
                          whileTap={{ scale: 0.9 }}
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-[0_20px_40px_-5px_rgba(0,0,0,0.5)] border-2 border-white/20 transition-all ${social.color}`}
                        >
                          <social.icon className="w-5.5 h-5.5" />
                        </motion.a>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="bg-white dark:bg-zinc-900 font-black text-[10px] uppercase tracking-widest border-none shadow-2xl">
                        {social.label}
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-[1.5rem] flex items-center justify-center shadow-[0_25px_60px_-10px_rgba(0,0,0,0.5)] transition-all duration-500 z-10 ${
              isOpen 
                ? "bg-rose-500 text-white" 
                : "bg-white dark:bg-[#0f0f12] text-foreground border border-white/10"
            }`}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <X className="w-7 h-7 sm:w-8 sm:h-8" />
                </motion.div>
              ) : (
                <motion.div key="share" initial={{ scale: 0, rotate: 90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: -90 }}>
                  <Share2 className="w-7 h-7 sm:w-8 sm:h-8" />
                </motion.div>
              )}
            </AnimatePresence>
            {!isOpen && (
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute inset-0 rounded-[1.5rem] bg-primary/40 -z-10"
              />
            )}
          </motion.button>
        </div>
      </TooltipProvider>
    </div>
  );
}
