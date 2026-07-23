import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Star, MapPin, Package, Award, ArrowRight, Store, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const sellers = [
  { id: 1, name: "Bharat Heavy Machines", type: "Manufacturer", location: "Ahmedabad, Gujarat", rating: 4.9, products: 245, verified: true, joinedYear: '2015', code: 'BH' },
  { id: 2, name: "Surat Textiles Corp", type: "Manufacturer", location: "Surat, Gujarat", rating: 4.7, products: 580, verified: true, joinedYear: '2018', code: 'ST' },
  { id: 3, name: "Green Agri Solutions", type: "Supplier", location: "Pune, Maharashtra", rating: 4.5, products: 120, verified: true, joinedYear: '2019', code: 'GA' },
  { id: 4, name: "Bright Electronics Hub", type: "Trader", location: "Delhi NCR", rating: 4.8, products: 320, verified: true, joinedYear: '2021', code: 'BE' },
  { id: 5, name: "Apex Steel Industries", type: "Manufacturer", location: "Ludhiana, Punjab", rating: 4.6, products: 190, verified: true, joinedYear: '2016', code: 'AS' },
  { id: 6, name: "Kolkata Jute Mills", type: "Manufacturer", location: "Kolkata, WB", rating: 4.4, products: 85, verified: false, joinedYear: '2020', code: 'KJ' },
  { id: 7, name: "Neo Pharma Labs", type: "Supplier", location: "Hyderabad, Telangana", rating: 4.9, products: 450, verified: true, joinedYear: '2014', code: 'NP' },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 110,
    }
  }
};

export default function FeaturedSellers() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Desktop Drag Scroll State
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragDistance = useRef(0);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth * 0.8;
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragDistance.current = 0;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.classList.add('cursor-grabbing');
      scrollContainerRef.current.classList.remove('snap-x'); // Smooth dragging
      startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
      scrollLeft.current = scrollContainerRef.current.scrollLeft;
    }
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.classList.remove('cursor-grabbing');
      scrollContainerRef.current.classList.add('snap-x');
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.classList.remove('cursor-grabbing');
      scrollContainerRef.current.classList.add('snap-x');
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current);
    dragDistance.current = Math.max(dragDistance.current, Math.abs(walk));
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk * 1.5;
  };

  return (
    <section className="py-24 bg-surface-elevated relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-wide relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 text-center md:text-left">
          <div className="max-w-2xl mx-auto md:mx-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center justify-center gap-2 px-4 py-1.5 mb-6 text-xs font-black uppercase tracking-[0.2em] text-accent bg-accent/5 rounded-full border border-accent/10"
            >
              <Award className="w-3.5 h-3.5" />
              Top Sellers Network
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-heading text-4xl md:text-5xl font-black text-foreground mb-4 leading-tight"
            >
              Partner with <span className="text-gradient">Elite Enterprises</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg"
            >
              Connect directly with India's most trusted, verified manufacturers and wholesale suppliers.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center md:justify-end shrink-0 gap-3"
          >
            {/* Desktop Carousel Navigation */}
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                onClick={() => scroll('left')}
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                onClick={() => scroll('right')}
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            <Link to="/products?view=businesses">
              <Button variant="outline" className="rounded-2xl px-6 sm:px-8 h-12 font-black text-xs uppercase tracking-widest group border-2 border-border hover:border-primary hover:bg-primary/5 hover:text-primary transition-all duration-300">
                View All <span className="hidden sm:inline ml-1">Suppliers</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Sellers Animated Carousel */}
        <motion.div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="flex overflow-x-auto gap-6 pb-12 pt-4 px-4 -mx-4 md:px-0 md:mx-0 snap-x snap-mandatory cursor-grab [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        >
          {sellers.map((seller, i) => {
            const sellerCode = seller.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            return (
              <motion.div
                key={seller.id}
                variants={cardVariants}
                className="relative flex-none w-[280px] sm:w-[310px] snap-start pb-8"
              >
                <Link
                  to={`/seller/${seller.id}`}
                  onClick={(e) => {
                    if (dragDistance.current > 10) e.preventDefault();
                  }}
                  className="group flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 block relative"
                >
                  {/* Header Cover Area */}
                  <div className="h-24 bg-gradient-to-t from-primary/10 via-primary/5 to-transparent relative overflow-hidden p-4">
                    <Store className="absolute -bottom-4 -left-4 w-28 h-28 text-primary/5 -rotate-12 pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6" />

                    <div className="absolute top-4 right-4 z-20">
                      <span className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-black uppercase tracking-[0.1em] border border-success/20 flex items-center gap-1.5 backdrop-blur-md">
                        <ShieldCheck className="w-3 h-3" /> VERIFIED
                      </span>
                    </div>
                  </div>

                  {/* Overlapping Avatar */}
                  <div className="flex justify-center -mt-10 relative z-10 block pointer-events-none">
                    <div className="w-20 h-20 rounded-full border-[4px] border-card bg-primary flex items-center justify-center text-white font-heading font-black text-2xl shadow-md group-hover:scale-105 transition-transform duration-500">
                      {sellerCode}
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="pt-3 pb-0 flex flex-col flex-1 text-center relative z-10 bg-card overflow-hidden">
                    {/* Store Name & Verification */}
                    <div className="mb-4 px-4">
                      <div className="flex items-center justify-center gap-1.5 mb-2">
                        <h3 className="font-heading font-black text-xl leading-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {seller.name}
                        </h3>
                      </div>
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-black uppercase tracking-widest border border-border">
                        {seller.type || 'Industrial Partner'}
                      </span>
                    </div>

                    {/* Location & Sector */}
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground font-medium mb-6 px-4">
                      <div className="flex items-center justify-center gap-1.5 text-foreground font-bold">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="truncate max-w-[90%]">{seller.location.split(',')[0]}</span>
                      </div>
                      <div className="text-xs uppercase tracking-[0.15em] opacity-60 font-black mt-0.5">
                        Sector: Industrial & Machinery
                      </div>
                    </div>

                    <div className="flex-1" />

                    {/* Stats Footer Row */}
                    <div className="grid grid-cols-2 divide-x divide-border/50 border-t border-border/50 pt-5 mt-auto bg-muted/20 group-hover:bg-primary/5 transition-colors pb-5 relative z-0">
                      {/* Rating Stat */}
                      <div className="flex flex-col items-center justify-center gap-1">
                        <div className="flex items-center gap-1 text-xl font-black text-foreground tabular-nums">
                          {seller.rating} <Star className="w-4 h-4 fill-accent text-accent mb-0.5" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-80">
                          Rating
                        </span>
                      </div>

                      {/* Product Count Stat */}
                      <div className="flex flex-col items-center justify-center gap-1">
                        <div className="flex items-center gap-1 text-xl font-black text-foreground tabular-nums">
                          {seller.products} <Package className="w-4 h-4 text-primary mb-0.5" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-80">
                          Products
                        </span>
                      </div>
                    </div>

                    {/* Animated Bottom Strip */}
                    <div className="h-1.5 w-full bg-primary absolute bottom-0 inset-x-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-10" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
