import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Link2, Share2 } from "lucide-react";
import { toast } from "sonner";
import { incrementShares } from "@/lib/storage";

// SVG for WhatsApp as it's not in Lucide by default in some versions or needs special handling
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

interface ProductShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: { id: string; name: string };
  onShareComplete?: () => void;
}

export function ProductShareDialog({ isOpen, onClose, product, onShareComplete }: ProductShareDialogProps) {
  if (!product) return null;

  const productUrl = `${window.location.origin}/products/${product.id}`;
  const shareText = `Check out this ${product.name} on MarketConnect Hub!`;

  const handlePlatformShare = (platform: string) => {
    let url = "";
    switch (platform) {
      case "whatsapp":
        url = `https://wa.me/?text=${encodeURIComponent(shareText + " " + productUrl)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(productUrl)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(productUrl);
        toast.success("Link copied to clipboard!");
        finishShare();
        return;
    }

    if (url) {
      window.open(url, "_blank", "width=600,height=400");
      finishShare();
    }
  };

  const finishShare = () => {
    incrementShares(product.id);
    if (onShareComplete) onShareComplete();
    onClose();
  };

  const platforms = [
    { id: "whatsapp", name: "WhatsApp", icon: WhatsAppIcon, color: "hover:bg-green-500 hover:text-white text-green-500 border-green-200" },
    { id: "facebook", name: "Facebook", icon: Facebook, color: "hover:bg-blue-600 hover:text-white text-blue-600 border-blue-200" },
    { id: "twitter", name: "X", icon: Twitter, color: "hover:bg-black hover:text-white text-black border-gray-200" },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "hover:bg-blue-700 hover:text-white text-blue-700 border-blue-200" },
    { id: "copy", name: "Copy Link", icon: Link2, color: "hover:bg-primary hover:text-white text-primary border-primary/20" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-primary/10 shadow-2xl">
        <DialogHeader className="space-y-3 pb-4 border-b border-border/50">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-1">
            <Share2 className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-black text-center font-heading">Share Product</DialogTitle>
          <DialogDescription className="text-center font-medium">
            Spread the word about {product.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-6">
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePlatformShare(p.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border bg-card transition-all duration-300 group hover:scale-105 active:scale-95 ${p.color}`}
            >
              <p.icon className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-black uppercase tracking-tight">{p.name}</span>
            </button>
          ))}
        </div>

        <div className="pt-2">
          <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold opacity-50">
            Link: {productUrl.substring(0, 30)}...
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
