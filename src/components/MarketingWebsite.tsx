/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Wind, 
  Flame, 
  Battery, 
  Star, 
  ArrowRight, 
  Check, 
  Search, 
  ShoppingBag, 
  Heart, 
  ChevronRight, 
  MapPin, 
  Phone, 
  Mail, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Layers, 
  Cpu, 
  Sparkles,
  HelpCircle,
  Clock,
  Trash2,
  Calendar,
  Send,
  Sliders,
  CheckCircle,
  AlertTriangle,
  X
} from 'lucide-react';
import { Product, CartItem, Order, SupportTicket, Review } from '../types';
import { INITIAL_PRODUCTS, INITIAL_BLOGS, FAQS, COMPARISON_COLUMNS, COMPARISON_DATA } from '../data';

interface MarketingWebsiteProps {
  activeWebTab: string;
  setActiveWebTab: (tab: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  wishlist: string[];
  setWishlist: React.Dispatch<React.SetStateAction<string[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  supportTickets: SupportTicket[];
  setSupportTickets: React.Dispatch<React.SetStateAction<SupportTicket[]>>;
  reviews: Record<string, Review[]>;
  setReviews: React.Dispatch<React.SetStateAction<Record<string, Review[]>>>;
  addToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
  deviceState: any;
}

export default function MarketingWebsite({
  activeWebTab,
  setActiveWebTab,
  selectedProductId,
  setSelectedProductId,
  cart,
  setCart,
  wishlist,
  setWishlist,
  orders,
  setOrders,
  supportTickets,
  setSupportTickets,
  reviews,
  setReviews,
  addToast,
  deviceState
}: MarketingWebsiteProps) {
  
  // Shop & Checkout States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'device' | 'accessory'>('all');
  const [sortOrder, setSortOrder] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'payment' | 'success'>('cart');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // value from 0 to 1
  const [newsletterEmail, setNewsletterEmail] = useState('');
  
  // Checkout Form States
  const [shippingForm, setShippingForm] = useState({
    name: 'Jeet Sinha',
    email: 'JeetPSinha@gmail.com',
    address: '100 Pine Street, Floor 15',
    city: 'San Francisco',
    zip: '94111',
    phone: '(415) 555-0199',
    method: 'standard' // standard or express
  });
  
  const [paymentForm, setPaymentForm] = useState({
    cardName: 'Jeet P Sinha',
    cardNumber: '•••• •••• •••• 4242',
    expiry: '12/29',
    cvv: '123'
  });

  // Animated Walkthrough selected step
  const [activeWalkthroughStep, setActiveWalkthroughStep] = useState(1);
  
  // Animated Airflow Demo Speed
  const [demoFanSpeed, setDemoFanSpeed] = useState<'OFF' | 'LOW' | 'MEDIUM' | 'TURBO'>('MEDIUM');
  const [demoHeater, setDemoHeater] = useState(true);

  // Video Demo States
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Contact / Ticket Form States
  const [contactForm, setContactForm] = useState({
    name: 'Jeet Sinha',
    email: 'JeetPSinha@gmail.com',
    category: 'Warranty & Returns',
    description: ''
  });

  // Blog Details state
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  // Write Product Review State
  const [newReview, setNewReview] = useState({
    user: 'Jeet Sinha',
    rating: 5,
    comment: ''
  });

  // 360 Degree Product View Frame Index
  const [productAngleIndex, setProductAngleIndex] = useState(0);

  // Diagnostics state
  const [diagnosticRunState, setDiagnosticRunState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [diagnosticProgress, setDiagnosticProgress] = useState(0);

  // Helper lists of products & reviews from context
  const products = useMemo(() => {
    return INITIAL_PRODUCTS.map(p => {
      const productReviews = reviews[p.id] || p.reviews;
      const averageRating = productReviews.length > 0 
        ? parseFloat((productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length).toFixed(1))
        : p.rating;
      return {
        ...p,
        reviews: productReviews,
        rating: averageRating
      };
    });
  }, [reviews]);

  // Selected Product Detail
  const selectedProduct = useMemo(() => {
    return products.find(p => p.id === selectedProductId) || products[0];
  }, [products, selectedProductId]);

  // Filtering Products for Shop
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortOrder === 'price-asc') return a.price - b.price;
        if (sortOrder === 'price-desc') return b.price - a.price;
        if (sortOrder === 'rating') return b.rating - a.rating;
        return 0; // default
      });
  }, [products, categoryFilter, searchQuery, sortOrder]);

  // Cart totals calculation
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    return subtotal * appliedDiscount;
  }, [subtotal, appliedDiscount]);

  const tax = useMemo(() => {
    return (subtotal - discountAmount) * 0.085; // 8.5% CA sales tax
  }, [subtotal, discountAmount]);

  const shippingCost = useMemo(() => {
    if (subtotal === 0) return 0;
    if (shippingForm.method === 'express') return 25;
    return subtotal > 150 ? 0 : 12; // free shipping over $150
  }, [subtotal, shippingForm.method]);

  const total = useMemo(() => {
    return subtotal - discountAmount + tax + shippingCost;
  }, [subtotal, discountAmount, tax, shippingCost]);

  // Functions
  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id: product.id, product, quantity: 1 }];
    });
    addToast(`"${product.name}" added to shopping cart!`, 'success');
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    addToast('Item removed from cart.', 'info');
  };

  const toggleWishlist = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlist(prev => {
      if (prev.includes(id)) {
        addToast('Removed from wishlist.', 'info');
        return prev.filter(item => item !== id);
      } else {
        addToast('Added to wishlist!', 'success');
        return [...prev, id];
      }
    });
  };

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'DRY20') {
      setAppliedDiscount(0.20);
      addToast('Promo code "DRY20" applied! 20% Discount active.', 'success');
    } else if (couponCode.toUpperCase() === 'LAUNCH50') {
      setAppliedDiscount(0.50);
      addToast('Promo code "LAUNCH50" applied! 50% Early Bird Discount.', 'success');
    } else {
      addToast('Invalid promo code.', 'warning');
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkoutStep === 'shipping') {
      setCheckoutStep('payment');
    } else if (checkoutStep === 'payment') {
      const newOrder: Order = {
        id: 'DN-' + Math.floor(100000 + Math.random() * 900000),
        items: [...cart],
        subtotal,
        discount: discountAmount,
        tax,
        shipping: shippingCost,
        total,
        name: shippingForm.name,
        email: shippingForm.email,
        address: shippingForm.address,
        city: shippingForm.city,
        zip: shippingForm.zip,
        status: 'Processing',
        date: new Date().toISOString().split('T')[0]
      };
      setOrders(prev => [newOrder, ...prev]);
      setCart([]);
      setCheckoutStep('success');
      addToast('Order successfully processed! DryNest is on the way.', 'success');
    }
  };

  const handleSupportTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.description) return;
    
    const newTicket: SupportTicket = {
      id: 'TCK-' + Math.floor(1000 + Math.random() * 9000),
      name: contactForm.name,
      email: contactForm.email,
      category: contactForm.category,
      description: contactForm.description,
      status: 'Open',
      date: new Date().toISOString().split('T')[0],
      replies: [
        {
          id: 'initial',
          sender: 'system',
          message: `Your ticket has been opened under our queue. We will check device telemetry and reply to this portal.`,
          date: new Date().toISOString()
        }
      ]
    };
    setSupportTickets(prev => [newTicket, ...prev]);
    setContactForm(prev => ({ ...prev, description: '' }));
    addToast('Support ticket registered! You can view response in Admin.', 'success');
  };

  const handleProductReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return;

    const reviewObj: Review = {
      id: 'REV-' + Date.now(),
      user: newReview.user,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews(prev => {
      const current = prev[selectedProduct.id] || selectedProduct.reviews;
      return {
        ...prev,
        [selectedProduct.id]: [reviewObj, ...current]
      };
    });

    setNewReview(prev => ({ ...prev, comment: '', rating: 5 }));
    addToast('Review published. Thank you for your feedback!', 'success');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterEmail('');
    addToast('Thank you! You are on our VIP list for product launches.', 'success');
  };

  const runDiagnostics = () => {
    setDiagnosticRunState('running');
    setDiagnosticProgress(0);
    const interval = setInterval(() => {
      setDiagnosticProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDiagnosticRunState('completed');
          addToast('Diagnostics complete. No severe thermal issues found.', 'success');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="w-full relative" id="marketing-web">
      {/* Dynamic Airflow particles visual helper */}
      <style>{`
        @keyframes driftUp {
          0% { transform: translateY(40px) scale(0.6); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-120px) scale(1.2); opacity: 0; }
        }
        .particle-slow { animation: driftUp 4s infinite linear; }
        .particle-med { animation: driftUp 2s infinite linear; }
        .particle-fast { animation: driftUp 0.8s infinite linear; }
      `}</style>

      {/* Local Sub navigation */}
      <div className="bg-slate-950/65 backdrop-blur-md sticky top-14 z-20 border-b border-slate-900/60 flex items-center justify-between px-6 py-3 scroll-smooth">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-teal-400 rounded-full animate-pulse"></span>
          <span className="text-xs uppercase tracking-widest text-slate-400 font-bold font-mono">Store Front</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 md:gap-4 overflow-x-auto text-xs md:text-sm text-slate-400 font-semibold max-w-full">
          {[
            { id: 'home', label: 'Home' },
            { id: 'shop', label: 'Shop Nest' },
            { id: 'how-it-works', label: 'How It Works' },
            { id: 'about', label: 'Technology' },
            { id: 'blog', label: 'Insight Blog' },
            { id: 'support', label: 'Support Center' },
            { id: 'contact', label: 'Contact HQ' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveWebTab(tab.id);
                setSelectedProductId(null);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                (activeWebTab === tab.id || (tab.id === 'shop' && activeWebTab === 'product-detail'))
                  ? 'bg-slate-900 text-teal-400 font-bold border border-slate-800' 
                  : 'hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-teal-500/10 cursor-pointer"
        >
          <ShoppingBag size={14} />
          <span>Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
        </button>
      </div>

      {/* 1. HOME VIEW */}
      {activeWebTab === 'home' && (
        <div className="text-slate-100 font-sans" id="home-view">
          {/* Hero Section */}
          <section className="relative min-h-[80vh] flex flex-col justify-center items-center text-center px-6 py-20 bg-[radial-gradient(ellipse_at_top,rgba(16,37,66,0.3),rgba(3,7,18,0))]">
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
            <div className="max-w-4xl mx-auto space-y-6">
              <span className="text-[10px] uppercase tracking-widest text-teal-400 font-mono font-bold bg-teal-500/10 px-3.5 py-1.5 rounded-full border border-teal-500/20">
                💨 DryNest Airflow Ecosystem
              </span>
              <h1 className="text-5xl md:text-8xl font-black font-sans leading-tight tracking-tighter text-white">
                Never Pack <br />
                <span className="bg-gradient-to-r from-teal-400 via-blue-400 to-amber-400 bg-clip-text text-transparent">Wet Again.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                DryNest is the world's smartest portable drying container. Put wet towels, swimsuits, or active gear inside and arrive home with dry, fresh garments.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                <button
                  onClick={() => setActiveWebTab('shop')}
                  className="w-full sm:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-teal-500/10 hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  Shop Now <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => setActiveWebTab('how-it-works')}
                  className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm transition-all border border-slate-800 hover:-translate-y-0.5 cursor-pointer"
                >
                  How It Works
                </button>
              </div>
            </div>

            {/* Simulated interactive 3D Model showcase container */}
            <div className="w-full max-w-xl mt-16 p-6 bg-slate-950/40 rounded-3xl border border-slate-900 shadow-2xl relative">
              <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest text-center mb-4">
                Interactive Thermodynamic Showcase
              </h3>

              {/* Live physics particle block */}
              <div className="relative h-64 bg-slate-950 border border-slate-900 rounded-2xl overflow-hidden flex items-center justify-center">
                
                {/* Visual Air Flow Particles */}
                {demoFanSpeed !== 'OFF' && (
                  <div className="absolute inset-0 flex justify-between px-16 pointer-events-none">
                    {[1, 2, 3, 4, 5].map(idx => (
                      <div
                        key={idx}
                        className={`w-1 bg-gradient-to-t ${demoHeater ? 'from-amber-400 to-transparent' : 'from-teal-400 to-transparent'} rounded-full`}
                        style={{
                          height: '24px',
                          animationDelay: `${idx * 0.4}s`,
                          position: 'relative',
                          left: `${idx * 8}%`
                        }}
                        ref={(el) => {
                          if (el) {
                            el.className = `w-1 bg-gradient-to-t ${demoHeater ? 'from-amber-500' : 'from-teal-400'} rounded-full ${
                              demoFanSpeed === 'LOW' ? 'particle-slow' : demoFanSpeed === 'MEDIUM' ? 'particle-med' : 'particle-fast'
                            }`;
                          }
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Simulated Wireframe render */}
                <div className="relative w-28 h-48 border-2 border-dashed border-teal-500/20 rounded-2xl flex flex-col items-center justify-between p-3">
                  <div className={`w-20 h-8 rounded border border-teal-500/40 bg-slate-900/80 flex items-center justify-center text-[10px] font-mono text-teal-400 ${demoFanSpeed !== 'OFF' ? 'animate-pulse' : ''}`}>
                    <Wind size={12} className={demoFanSpeed !== 'OFF' ? 'animate-spin' : ''} /> {demoFanSpeed}
                  </div>
                  
                  <span className="text-[10px] text-slate-500 font-mono">HEAT: {demoHeater ? 'ENABLED' : 'OFF'}</span>
                  
                  <div className="w-20 h-6 border border-slate-800 bg-slate-900 rounded flex justify-center items-center text-[8px] font-mono text-slate-500">
                    INTAKE VENTS
                  </div>
                </div>
              </div>

              {/* Demo controllers */}
              <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-mono">
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col gap-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Fan Speed</span>
                  <div className="flex gap-1 mt-1">
                    {(['OFF', 'LOW', 'MEDIUM', 'TURBO'] as const).map(speed => (
                      <button
                        key={speed}
                        onClick={() => setDemoFanSpeed(speed)}
                        className={`flex-1 py-1 rounded text-[10px] font-bold ${demoFanSpeed === speed ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700'}`}
                      >
                        {speed}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">PTC Heating Core</span>
                  <button
                    onClick={() => setDemoHeater(!demoHeater)}
                    className={`w-full py-1.5 mt-1 rounded text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                      demoHeater ? 'bg-orange-500 text-white' : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    <Flame size={12} /> {demoHeater ? 'Heater Engaged (45°C)' : 'Airflow Fan Only'}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Value Prop Bento cards */}
          <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                Built For Travel, Engineered For Sweat.
              </h2>
              <p className="text-slate-400">
                Never stuff stagnant swimsuits back in your daily canvas bags. DryNest starts drying clothes active-cycle the minute they go in.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Wind,
                  title: 'Cyclone Airflow Fan',
                  color: 'text-teal-400 bg-teal-500/10',
                  desc: 'High-speed turbine motor delivers up to 45 CFM of air directly over wet garments, stripping ambient humidity instantly.'
                },
                {
                  icon: Flame,
                  title: 'PTC Intelligent Heating',
                  color: 'text-orange-400 bg-orange-500/10',
                  desc: 'Self-regulating ceramic loops heat air up to 45°C/113°F, accelerating molecular evaporation without harming elastic synthetic threads.'
                },
                {
                  icon: Layers,
                  title: 'Activated Carbon Scent Filters',
                  color: 'text-amber-400 bg-amber-500/10',
                  desc: 'Air passes through a high-efficiency charcoal filter, neutralizing musty odours and trapping lint before air vents out.'
                }
              ].map((card, i) => (
                <div key={i} className="bg-slate-900/40 p-8 rounded-3xl border border-slate-900 hover:border-slate-800 transition-all group hover:-translate-y-1">
                  <div className={`p-4 rounded-2xl w-max ${card.color} mb-6`}>
                    <card.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-teal-400 transition-colors">{card.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Premium Compare Chart section */}
          <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900 bg-slate-950/40 rounded-3xl border border-slate-900 my-12">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-[10px] uppercase tracking-widest text-teal-400 font-mono font-bold">Compare Models</span>
              <h2 className="text-3xl md:text-5xl font-black text-white mt-2">Which DryNest is for you?</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    {COMPARISON_COLUMNS.map((col, idx) => (
                      <th key={idx} className={`p-4 font-bold ${idx === 0 ? 'text-slate-400 font-mono uppercase text-xs' : 'text-white'}`}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_DATA.map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-900/60 hover:bg-slate-900/20">
                      <td className="p-4 font-medium text-slate-300 font-semibold">{row.feature}</td>
                      <td className="p-4 text-slate-400">{row.basic}</td>
                      <td className="p-4 text-slate-400">{row.plus}</td>
                      <td className="p-4 text-teal-300 font-semibold">{row.pro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setActiveWebTab('shop')}
                className="text-xs font-bold text-teal-400 hover:text-white flex items-center gap-1 transition-all group"
              >
                Go to the Shop <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </section>

          {/* Testimonial Section */}
          <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Loved by Athletes & Swimmers</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  quote: "After water polo practice, my swimsuit used to smell moldy before I even drove back. Now, I put it inside DryNest, plug it in, and it's dry and fresh by the time I open my locker.",
                  user: "Elena R.",
                  title: "Collegiate Water Polo"
                },
                {
                  quote: "DryNest Pro handles my soccer pinnies and thick athletic socks flawlessly. The AI optimization calculates dry times to the minute. Simply incredible engineering.",
                  user: "Marcus K.",
                  title: "Premier Club Football"
                },
                {
                  quote: "We use it for our weekend travel with the kids. No more soggy trash bags in the trunk. It feels solid like a Yeti and works like a Dyson.",
                  user: "Dr. Sarah J.",
                  title: "Parent of 3 Swimmers"
                }
              ].map((test, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-900/20 border border-slate-900">
                  <div className="flex text-amber-400 gap-0.5 mb-4">
                    {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-slate-400 text-sm italic mb-6">"{test.quote}"</p>
                  <div>
                    <h4 className="text-white font-bold text-sm">{test.user}</h4>
                    <span className="text-[11px] text-slate-500 font-medium">{test.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Interactive FAQs list */}
          <section className="max-w-4xl mx-auto px-6 py-20 border-t border-slate-900">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="border border-slate-900 bg-slate-950/20 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full flex justify-between items-center p-5 text-left text-sm font-semibold text-white hover:text-teal-400 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronRight size={16} className={`transition-transform duration-300 ${expandedFaq === idx ? 'rotate-90 text-teal-400' : 'text-slate-500'}`} />
                  </button>
                  {expandedFaq === idx && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-900 bg-slate-950/60">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Newsletter section */}
          <section className="max-w-5xl mx-auto px-6 py-16 mb-20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-3xl border border-slate-850 text-center relative overflow-hidden">
            <div className="relative z-10 max-w-xl mx-auto space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold text-white">Join the Smart Travel Revolution</h3>
              <p className="text-slate-400 text-xs">
                Subscribe to receive early firmware release notifications, dry-tech research papers, and exclusive community discounts.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md mx-auto pt-4">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-teal-500 transition-all font-mono"
                />
                <button
                  type="submit"
                  className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-6 py-3 rounded-xl text-xs font-bold font-sans transition-all active:scale-95 cursor-pointer"
                >
                  Join List
                </button>
              </form>
            </div>
          </section>
        </div>
      )}

      {/* 2. SHOP VIEW */}
      {activeWebTab === 'shop' && (
        <div className="max-w-7xl mx-auto px-6 py-12" id="shop-view">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-slate-900">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white">DryNest Hardware Store</h1>
              <p className="text-xs text-slate-400 mt-1">Acquire state-of-the-art portable dry cores and ballistic travel straps.</p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-initial min-w-[180px]">
                <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-teal-500 font-semibold"
              >
                <option value="all">All Categories</option>
                <option value="device">Active Containers</option>
                <option value="accessory">Tactical Accessories</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-teal-500 font-semibold"
              >
                <option value="default">Sort: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredProducts.map(prod => {
              const inWish = wishlist.includes(prod.id);
              return (
                <div
                  key={prod.id}
                  onClick={() => {
                    setSelectedProductId(prod.id);
                    setActiveWebTab('product-detail');
                  }}
                  className="bg-slate-900/30 border border-slate-900 rounded-3xl overflow-hidden group hover:border-slate-800 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative overflow-hidden aspect-video bg-slate-950">
                    {prod.image ? (
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 text-center border-b border-slate-900 group-hover:from-slate-850/80 group-hover:to-slate-900 transition-colors">
                        <ShoppingBag size={32} className="text-teal-500/40 mb-2 group-hover:text-teal-400/60 transition-colors" />
                        <span className="text-xs font-mono text-slate-400 font-bold tracking-wider uppercase">Product Image Coming Soon</span>
                        <span className="text-[10px] text-slate-500 mt-1">Ready for custom assets</span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 flex gap-1.5">
                      <button
                        onClick={(e) => toggleWishlist(prod.id, e)}
                        className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
                          inWish 
                            ? 'bg-rose-500/20 border-rose-500 text-rose-400' 
                            : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Heart size={14} fill={inWish ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors">
                          {prod.name}
                        </h3>
                        <span className="text-lg font-mono font-bold text-teal-400">
                          ${prod.price}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-amber-400 text-xs mb-3">
                        <Star size={12} fill="currentColor" />
                        <span className="font-semibold text-slate-300">{prod.rating}</span>
                        <span className="text-slate-500 text-[10px]">({prod.reviews.length} reviews)</span>
                      </div>

                      <p className="text-slate-400 text-xs leading-relaxed mb-6 line-clamp-2">
                        {prod.description}
                      </p>
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(prod, e)}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all border border-slate-800 hover:border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag size={14} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. PRODUCT DETAIL VIEW */}
      {activeWebTab === 'product-detail' && (
        <div className="max-w-7xl mx-auto px-6 py-12" id="product-detail-view">
          <button
            onClick={() => setActiveWebTab('shop')}
            className="text-slate-500 hover:text-teal-400 text-xs font-semibold mb-8 flex items-center gap-1 transition-all"
          >
            ← Back to Hardware Store
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            
            {/* Left Column: Interactive 360 Product Rotator / Images */}
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 relative flex flex-col items-center justify-center overflow-hidden">
                <span className="absolute top-4 left-4 text-[9px] font-mono text-slate-500 uppercase tracking-widest bg-slate-900 px-2 py-1 rounded">
                  Drag / Click controls for 360° View
                </span>
                {selectedProduct.image ? (
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full max-h-[350px] object-cover rounded-2xl border border-slate-900/60 shadow-2xl transition-all duration-300"
                    style={{ transform: `rotate(${productAngleIndex * 60}deg)` }}
                  />
                ) : (
                  <div 
                    className="w-full min-h-[300px] bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 text-center rounded-2xl border border-slate-900 shadow-2xl transition-all duration-300"
                    style={{ transform: `rotate(${productAngleIndex * 60}deg)` }}
                  >
                    <ShoppingBag size={48} className="text-teal-500/40 mb-3 animate-pulse" />
                    <span className="text-sm font-mono text-slate-300 font-bold tracking-wider uppercase">Bespoke Container Image coming soon</span>
                    <span className="text-xs text-slate-500 mt-2">Rendered in high-fidelity 360° virtual space</span>
                  </div>
                )}
                
                {/* 360 Degree Rotator controls */}
                <div className="flex gap-2 mt-6">
                  {[0, 1, 2, 3, 4, 5].map(idx => (
                    <button
                      key={idx}
                      onClick={() => setProductAngleIndex(idx)}
                      className={`w-3 h-3 rounded-full transition-all ${productAngleIndex === idx ? 'bg-teal-400 scale-125' : 'bg-slate-800 hover:bg-slate-700'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Exploded diagram specification detail block */}
              <div className="bg-slate-900/10 border border-slate-900 rounded-3xl p-6">
                <h3 className="text-sm font-mono text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Sliders size={14} className="text-teal-400" /> Internal Architecture
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-900/60">
                    <span className="text-teal-400 block font-bold">Brushless Core</span>
                    <span className="text-slate-400 text-[11px] mt-1 block">Low-bearing rotor fan pushes forced airflow.</span>
                  </div>
                  <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-900/60">
                    <span className="text-orange-400 block font-bold">PTC Ceramax</span>
                    <span className="text-slate-400 text-[11px] mt-1 block">Automated ceramic loop maintains precise thermal regulation.</span>
                  </div>
                  <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-900/60">
                    <span className="text-amber-400 block font-bold">Carbon Shield</span>
                    <span className="text-slate-400 text-[11px] mt-1 block">Triple weave activated charcoal blocks mold and bacteria.</span>
                  </div>
                  <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-900/60">
                    <span className="text-blue-400 block font-bold">PD Smart Cell</span>
                    <span className="text-slate-400 text-[11px] mt-1 block">USB-C Power Delivery charges core in under an hour.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Checkout details & Specifications */}
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white">{selectedProduct.name}</h1>
                <p className="text-xs text-slate-500 mt-1 uppercase font-mono tracking-wider">SKU: DN-00{selectedProduct.id}</p>
                
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-2xl font-mono font-bold text-teal-400">${selectedProduct.price}</span>
                  <div className="flex items-center gap-1 text-amber-400 text-sm">
                    <Star size={14} fill="currentColor" />
                    <span className="font-semibold text-slate-300">{selectedProduct.rating}</span>
                    <span className="text-slate-500 text-xs">({selectedProduct.reviews.length} reviews)</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Purchase action */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleAddToCart(selectedProduct)}
                  className="flex-1 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-2xl text-sm transition-all shadow-xl shadow-teal-500/10 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag size={16} />
                  Add to Cart
                </button>
                <button
                  onClick={() => toggleWishlist(selectedProduct.id)}
                  className={`px-6 py-4 rounded-2xl border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    wishlist.includes(selectedProduct.id)
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Heart size={16} fill={wishlist.includes(selectedProduct.id) ? "currentColor" : "none"} />
                  <span>Wishlist</span>
                </button>
              </div>

              {/* Technical Spec sheet list */}
              <div>
                <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest border-b border-slate-900 pb-2 mb-4 font-bold">
                  Technical Specifications
                </h3>
                <div className="space-y-2 text-xs">
                  {Object.entries(selectedProduct.specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-slate-950">
                      <span className="text-slate-500 font-medium">{key}</span>
                      <span className="text-slate-300 font-bold text-right font-mono">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Reviews section */}
          <div className="border-t border-slate-900 pt-12">
            <h2 className="text-2xl font-bold text-white mb-8">Customer Feedback</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Write a review form */}
              <div className="bg-slate-950/40 border border-slate-900 rounded-3xl p-6 self-start">
                <h3 className="text-lg font-bold text-white mb-4">Write a Review</h3>
                <form onSubmit={handleProductReviewSubmit} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">Display Name</label>
                    <input
                      type="text"
                      required
                      value={newReview.user}
                      onChange={(e) => setNewReview(prev => ({ ...prev, user: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(stars => (
                        <button
                          key={stars}
                          type="button"
                          onClick={() => setNewReview(prev => ({ ...prev, rating: stars }))}
                          className="text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star size={18} fill={newReview.rating >= stars ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">Your review</label>
                    <textarea
                      required
                      rows={4}
                      value={newReview.comment}
                      onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                      placeholder="Share your drying experiences..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Publish Review
                  </button>
                </form>
              </div>

              {/* Reviews lists */}
              <div className="lg:col-span-2 space-y-4">
                {selectedProduct.reviews.length === 0 ? (
                  <p className="text-slate-500 text-xs italic">No reviews yet for this accessory. Be the first to write one!</p>
                ) : (
                  selectedProduct.reviews.map(rev => (
                    <div key={rev.id} className="p-5 bg-slate-900/20 border border-slate-900 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-200">{rev.user}</span>
                        <span className="text-slate-500 font-mono">{rev.date}</span>
                      </div>
                      <div className="flex text-amber-400 gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} size={11} fill={rev.rating >= s ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. HOW IT WORKS VIEW */}
      {activeWebTab === 'how-it-works' && (
        <div className="max-w-5xl mx-auto px-6 py-12" id="how-it-works-view">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-[10px] uppercase tracking-widest text-teal-400 font-mono font-bold">Process Loop</span>
            <h1 className="text-4xl font-black text-white">How DryNest Works</h1>
            <p className="text-slate-400 text-sm">
              Four simple steps to dry sports apparel completely while travelling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            
            {/* Step Selection Accordions */}
            <div className="space-y-4">
              {[
                { step: 1, title: 'Insert wet clothing', desc: 'Squeeze extra water out, place your wet swimwear or gym towels inside DryNest main double-walled polymer container.' },
                { step: 2, title: 'Secure sealing lid', desc: 'Thread the brushless power lid on securely. The airtight gasket locks standard ambient wetness inside.' },
                { step: 3, title: 'Adjust settings', desc: 'Choose between standard low, medium, or high fan speed settings directly on the device container to control gentle air circulation.' },
                { step: 4, title: 'Arrive home dry', desc: 'By the time you get home, open the DryNest to find fresh, fully-dried garments ready for use!' }
              ].map(item => (
                <button
                  key={item.step}
                  onClick={() => setActiveWalkthroughStep(item.step)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all flex gap-4 ${
                    activeWalkthroughStep === item.step
                      ? 'bg-slate-900 border-slate-800 text-white shadow-xl'
                      : 'bg-slate-950/20 border-slate-950 text-slate-400 hover:bg-slate-900/10'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full font-mono text-xs font-bold flex items-center justify-center shrink-0 border ${
                    activeWalkthroughStep === item.step ? 'bg-teal-500 text-slate-950 border-teal-400' : 'bg-slate-900 border-slate-800'
                  }`}>
                    {item.step}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm">{item.title}</h3>
                    {activeWalkthroughStep === item.step && (
                      <p className="text-slate-400 text-xs leading-relaxed mt-2">{item.desc}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Simulated hardware representation panel */}
            <div className="bg-slate-950 border border-slate-900 rounded-3xl p-8 relative flex flex-col items-center justify-center min-h-[400px]">
              <div className="absolute inset-0 bg-grid-white/[0.01] pointer-events-none" />
              
              <span className="text-xs uppercase tracking-widest text-teal-400 font-mono font-bold mb-6">
                Step {activeWalkthroughStep} Demonstration
              </span>

              {/* Graphic container */}
              <div className="w-40 h-60 border-2 border-slate-850 bg-slate-900/40 rounded-3xl p-4 flex flex-col items-center justify-between shadow-2xl">
                {activeWalkthroughStep === 1 && (
                  <div className="flex-1 flex flex-col items-center justify-center animate-bounce">
                    👕 <span className="text-[10px] font-mono text-slate-400 mt-2">INSERT CLOTHES</span>
                  </div>
                )}
                {activeWalkthroughStep === 2 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    🔒 <span className="text-[10px] font-mono text-teal-400 mt-2">LID THREAD LOCK</span>
                  </div>
                )}
                {activeWalkthroughStep === 3 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center gap-1">
                    💨 <span className="text-[10px] font-mono text-slate-400">LOW / MED / HIGH</span>
                    ⚡ <span className="text-[10px] font-mono text-teal-400 font-bold">FAN ACTIVE</span>
                  </div>
                )}
                {activeWalkthroughStep === 4 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center animate-pulse">
                    ✨ <span className="text-[10px] font-mono text-teal-400 mt-2 font-bold font-sans">FULLY DRIED</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 5. ABOUT VIEW */}
      {activeWebTab === 'about' && (
        <div className="max-w-4xl mx-auto px-6 py-12" id="about-view">
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-[10px] uppercase tracking-widest text-teal-400 font-mono font-bold">Our Philosophy</span>
              <h1 className="text-4xl font-black text-white mt-2">The DryNest Core Story</h1>
              <p className="text-slate-400 text-sm mt-2">Engineering comfort and microclimate technology for active explorers.</p>
            </div>

            <div className="prose prose-invert max-w-none text-slate-300 text-xs leading-relaxed space-y-6">
              <p>
                Founded in San Francisco by sports engineering enthusiasts and mechanical research developers, **DryNest** set out to solve a ubiquitous problem: the soggy backpack. Millions of swimmers, runners, soccer players, and beachgoers commute daily with moist, foul-smelling fabrics stuffed into tight compartments. Standard methods lead to bacterial bloom, ruin high-end synthetic fibers, and generate strong odors.
              </p>
              <p>
                By building complex airflow thermodynamic models, our engineers developed a portable cylindrical container that replicates the efficiency of open line-drying within a completely sealed microclimate. No water leaks out, no heat escapes into your bag, and brushless turbine technology stays below 42dB.
              </p>
            </div>

            {/* Key technology pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div className="bg-slate-900/20 border border-slate-900 p-6 rounded-2xl">
                <h4 className="text-white font-bold text-sm mb-2">Sustainable Materials</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Our double-walled tubes are constructed from 75% recycled polycarbonate, reducing carbon foot-print while surviving rugged drops.
                </p>
              </div>
              <div className="bg-slate-900/20 border border-slate-900 p-6 rounded-2xl">
                <h4 className="text-white font-bold text-sm mb-2">PTC Ceramax loops</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Advanced Positive Temperature Coefficient ceramic coils regulate thermals up to 45°C, ensuring high-power safety and zero fire hazard.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. BLOG VIEW */}
      {activeWebTab === 'blog' && (
        <div className="max-w-5xl mx-auto px-6 py-12" id="blog-view">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-[10px] uppercase tracking-widest text-teal-400 font-mono font-bold">Insights</span>
            <h1 className="text-4xl font-black text-white mt-2">The DryNest Publication</h1>
          </div>

          {/* Blogs list */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {INITIAL_BLOGS.map(blog => (
              <div
                key={blog.id}
                onClick={() => setSelectedBlogId(blog.id)}
                className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 hover:border-slate-800 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">
                    {blog.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-3 mb-2 hover:text-teal-400 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                    {blog.summary}
                  </p>
                </div>

                <div className="border-t border-slate-950 mt-6 pt-4 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                  <span>{blog.date}</span>
                  <span>{blog.readTime} read</span>
                </div>
              </div>
            ))}
          </div>

          {/* Blog Details Modal Popup */}
          {selectedBlogId && (() => {
            const currentBlog = INITIAL_BLOGS.find(b => b.id === selectedBlogId);
            if (!currentBlog) return null;
            return (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full text-white relative shadow-2xl max-h-[85vh] overflow-y-auto">
                  <button
                    onClick={() => setSelectedBlogId(null)}
                    className="absolute top-4 right-4 p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white cursor-pointer"
                  >
                    Close ×
                  </button>
                  <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold block mb-2">{currentBlog.category}</span>
                  <h2 className="text-xl md:text-2xl font-black mb-4">{currentBlog.title}</h2>
                  <div className="flex gap-4 text-xs font-mono text-slate-500 mb-6">
                    <span>By {currentBlog.author}</span>
                    <span>•</span>
                    <span>{currentBlog.date}</span>
                  </div>
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed whitespace-pre-line">
                    {currentBlog.content}
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 7. CONTACT VIEW */}
      {activeWebTab === 'contact' && (
        <div className="max-w-5xl mx-auto px-6 py-12" id="contact-view">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left side info & Contact Form */}
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-black text-white">Contact HQ</h1>
                <p className="text-slate-400 text-xs mt-1">Get in touch with our commercial partnership or tech team.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-bold">Headquarters</h4>
                    <span className="text-slate-400">100 Pine Street, Floor 15, San Francisco, CA 94111</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-bold">Voice Helpline</h4>
                    <span className="text-slate-400">(415) 555-0199</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-bold">Electronic Mail</h4>
                    <span className="text-slate-400">support@drynest.tech</span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={(e) => { e.preventDefault(); addToast('Message received! We will follow up soon.', 'success'); }} className="space-y-4 bg-slate-950/40 border border-slate-900 p-6 rounded-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono text-slate-500 block mb-1">Display Name</label>
                    <input
                      type="text"
                      required
                      defaultValue="Jeet Sinha"
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-500 block mb-1">Email</label>
                    <input
                      type="email"
                      required
                      defaultValue="JeetPSinha@gmail.com"
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-500 block mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Type your inquiry here..."
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Submit Inquiry
                </button>
              </form>
            </div>

            {/* Right side: Stylized CSS Vector Map */}
            <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Simulated map position</span>
                <h3 className="text-lg font-bold text-white mt-1">San Francisco, California</h3>
              </div>

              {/* Vector representation of San Francisco grid layout */}
              <div className="h-64 bg-slate-950 border border-slate-900/60 rounded-2xl relative overflow-hidden flex items-center justify-center my-6">
                {/* Simulated Street grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(34,193,195,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,193,195,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />
                
                {/* Diagonal freeway */}
                <div className="absolute top-10 left-0 right-0 h-4 bg-slate-900/80 -rotate-12 border-y border-slate-800" />
                
                {/* Bay water */}
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/10 rounded-tl-full border-t border-l border-blue-500/15" />

                {/* HQ Pointer mark */}
                <div className="relative flex flex-col items-center">
                  <div className="w-4 h-4 bg-teal-500 border-2 border-slate-950 rounded-full animate-ping absolute" />
                  <MapPin size={24} className="text-teal-400 z-10" />
                  <span className="text-[9px] font-mono text-slate-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 mt-1 select-none z-10 font-bold">
                    DryNest HQ
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-900/20 border border-slate-900/60 rounded-xl text-xs text-slate-400 font-mono">
                💡 Located block away from Transamerica Pyramid. Visitor hours: Monday-Friday 10:00AM - 5:00PM.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 8. SUPPORT TAB (Help Ticket Registration & Diagnostics) */}
      {activeWebTab === 'support' && (
        <div className="max-w-5xl mx-auto px-6 py-12" id="support-view">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Ticket registration */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-black text-white">Support Center</h1>
                <p className="text-slate-400 text-xs mt-1">Submit warranty tickets, firmware debugging logs, or inquire about returns.</p>
              </div>

              <form onSubmit={handleSupportTicketSubmit} className="space-y-4 bg-slate-950/40 border border-slate-900 p-6 rounded-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono text-slate-500 block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-500 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-500 block mb-1">Topic / Category</label>
                  <select
                    value={contactForm.category}
                    onChange={(e) => setContactForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="Warranty Claim">Warranty Claim (1-Year Coverage)</option>
                    <option value="Bluetooth BLE Error">Bluetooth BLE Connection Issue</option>
                    <option value="Returns & Refunds">Returns & Refund Request</option>
                    <option value="Firmware Diagnostic Report">Firmware Diagnostic Alert report</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-500 block mb-1">Describe issue or requested return</label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.description}
                    onChange={(e) => setContactForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what occurred, or paste device settings..."
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  File Support Ticket
                </button>
              </form>
            </div>

            {/* Smart Diagnostics panel */}
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Connected telemetry testing</span>
                <h3 className="text-lg font-bold text-white mt-1">Smart Diagnostics Hub</h3>
                <p className="text-slate-400 text-xs mt-1">
                  Runs calibration analysis on active paired bluetooth container hardware.
                </p>

                {/* Status card showing pairing sync */}
                <div className="my-6 p-4 bg-slate-900/60 rounded-xl border border-slate-850/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${deviceState.isConnected ? 'bg-teal-400' : 'bg-rose-500'}`} />
                    <span className="text-xs font-mono font-bold">{deviceState.deviceName}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {deviceState.isConnected ? 'BLE BROADCAST STABLE' : 'DISCONNECTED'}
                  </span>
                </div>

                {diagnosticRunState === 'idle' && (
                  <button
                    onClick={runDiagnostics}
                    disabled={!deviceState.isConnected}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs rounded-xl transition-all border border-slate-800 disabled:opacity-40"
                  >
                    {!deviceState.isConnected ? 'Connect Bluetooth First' : 'Begin Hardware Diagnostic Test'}
                  </button>
                )}

                {diagnosticRunState === 'running' && (
                  <div className="space-y-2">
                    <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div className="h-full bg-teal-400 transition-all duration-200" style={{ width: `${diagnosticProgress}%` }} />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 block text-center">Testing sensors, heating loops, duty cycles... {diagnosticProgress}%</span>
                  </div>
                )}

                {diagnosticRunState === 'completed' && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono text-teal-400 font-bold uppercase">Test Completed successfully:</h4>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                      <div className="flex justify-between p-2 bg-slate-900/60 rounded border border-slate-850">
                        <span>Fan motor:</span>
                        <span className={deviceState.diagnostics.fanOk ? 'text-teal-400' : 'text-rose-400'}>{deviceState.diagnostics.fanOk ? 'OK' : 'ERROR'}</span>
                      </div>
                      <div className="flex justify-between p-2 bg-slate-900/60 rounded border border-slate-850">
                        <span>Heater Core:</span>
                        <span className={deviceState.diagnostics.heaterOk ? 'text-teal-400' : 'text-rose-400'}>{deviceState.diagnostics.heaterOk ? 'OK' : 'ERROR'}</span>
                      </div>
                      <div className="flex justify-between p-2 bg-slate-900/60 rounded border border-slate-850">
                        <span>Thermals:</span>
                        <span className={deviceState.diagnostics.sensorsOk ? 'text-teal-400' : 'text-rose-400'}>{deviceState.diagnostics.sensorsOk ? 'OK' : 'FAIL'}</span>
                      </div>
                      <div className="flex justify-between p-2 bg-slate-900/60 rounded border border-slate-850">
                        <span>Carbon Mesh:</span>
                        <span className={deviceState.diagnostics.filterOk ? 'text-teal-400' : 'text-rose-400'}>{deviceState.diagnostics.filterOk ? 'OK' : 'WARN'}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setDiagnosticRunState('idle')}
                      className="w-full py-2 bg-slate-900 text-slate-400 hover:text-white text-xs rounded-xl"
                    >
                      Clear Diagnostics report
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SHOPPING CART OVERLAY DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-slate-900 border-l border-slate-800 text-white w-full max-w-md h-full flex flex-col justify-between p-6 overflow-y-auto">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ShoppingBag size={18} /> Shopping Cart
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {checkoutStep === 'cart' && (
                <div className="space-y-4 py-4">
                  {cart.length === 0 ? (
                    <p className="text-slate-500 text-center py-10 text-xs italic">Your shopping cart is completely empty.</p>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="flex gap-4 p-3 bg-slate-950/40 rounded-xl border border-slate-900">
                        {item.product.image ? (
                          <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg shrink-0" />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center rounded-lg shrink-0 border border-slate-900 text-teal-400">
                            <ShoppingBag size={16} />
                          </div>
                        )}
                        <div className="flex-1 text-xs">
                          <h4 className="font-bold text-slate-100">{item.product.name}</h4>
                          <span className="text-teal-400 font-mono mt-1 block">${item.product.price} × {item.quantity}</span>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => {
                                setCart(prev => prev.map(c => c.id === item.id ? { ...c, quantity: Math.max(1, c.quantity - 1) } : c));
                              }}
                              className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-850 hover:bg-slate-800"
                            >
                              -
                            </button>
                            <span className="font-mono">{item.quantity}</span>
                            <button
                              onClick={() => {
                                setCart(prev => prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
                              }}
                              className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-850 hover:bg-slate-800"
                            >
                              +
                            </button>
                            <button
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="ml-auto text-rose-400 hover:text-rose-300"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Shipping Checkout details form */}
              {checkoutStep === 'shipping' && (
                <form id="shipping-form" onSubmit={handleCheckoutSubmit} className="space-y-4 py-4 text-xs">
                  <h3 className="font-bold text-white uppercase tracking-wider text-[11px] mb-2">1. Shipping Logistics</h3>
                  <div>
                    <label className="text-[10px] font-mono text-slate-500">Contact Name</label>
                    <input
                      type="text"
                      required
                      value={shippingForm.name}
                      onChange={(e) => setShippingForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-500">Email Address</label>
                    <input
                      type="email"
                      required
                      value={shippingForm.email}
                      onChange={(e) => setShippingForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-500">Delivery Address</label>
                    <input
                      type="text"
                      required
                      value={shippingForm.address}
                      onChange={(e) => setShippingForm(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-white mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono text-slate-500">City</label>
                      <input
                        type="text"
                        required
                        value={shippingForm.city}
                        onChange={(e) => setShippingForm(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-white mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-500">Postal Zip Code</label>
                      <input
                        type="text"
                        required
                        value={shippingForm.zip}
                        onChange={(e) => setShippingForm(prev => ({ ...prev, zip: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-white mt-1 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-500 block mb-1">Shipping Class</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setShippingForm(prev => ({ ...prev, method: 'standard' }))}
                        className={`p-2 rounded-xl text-center font-bold border transition-all ${shippingForm.method === 'standard' ? 'bg-teal-500 text-slate-950 border-teal-400' : 'bg-slate-950 border-slate-800'}`}
                      >
                        Ground (Free &gt;$150)
                      </button>
                      <button
                        type="button"
                        onClick={() => setShippingForm(prev => ({ ...prev, method: 'express' }))}
                        className={`p-2 rounded-xl text-center font-bold border transition-all ${shippingForm.method === 'express' ? 'bg-teal-500 text-slate-950 border-teal-400' : 'bg-slate-950 border-slate-800'}`}
                      >
                        Express Overnight (+$25)
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Payment details form */}
              {checkoutStep === 'payment' && (
                <form id="payment-form" onSubmit={handleCheckoutSubmit} className="space-y-4 py-4 text-xs">
                  <h3 className="font-bold text-white uppercase tracking-wider text-[11px] mb-2">2. Secure Stripe payment</h3>
                  <div>
                    <label className="text-[10px] font-mono text-slate-500">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      value={paymentForm.cardName}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, cardName: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-500 font-bold flex items-center gap-1">
                      Card Number <span className="text-[9px] font-semibold font-sans bg-teal-500/10 text-teal-400 px-1 py-0.5 rounded">STRIPE SECURE</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={paymentForm.cardNumber}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, cardNumber: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-white mt-1 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono text-slate-500">Expiry MM/YY</label>
                      <input
                        type="text"
                        required
                        value={paymentForm.expiry}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, expiry: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-white mt-1 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-500">Security CVV</label>
                      <input
                        type="password"
                        required
                        value={paymentForm.cvv}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, cvv: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-white mt-1 font-mono"
                      />
                    </div>
                  </div>
                </form>
              )}

              {checkoutStep === 'success' && (
                <div className="text-center py-12 space-y-4">
                  <span className="text-4xl block">🎉</span>
                  <h3 className="text-lg font-bold text-white">Purchase Confirmed!</h3>
                  <p className="text-slate-400 text-xs">
                    Your order has been compiled. You can review and update order statuses in our Admin Console dashboard.
                  </p>
                  <button
                    onClick={() => {
                      setCheckoutStep('cart');
                      setIsCartOpen(false);
                    }}
                    className="px-6 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs hover:bg-slate-900"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Calculations & Checkout action buttons */}
            {checkoutStep !== 'success' && cart.length > 0 && (
              <div className="border-t border-slate-800 pt-4 space-y-4 text-xs font-mono">
                {checkoutStep === 'cart' && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon: DRY20"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-white text-xs"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-xl text-xs font-bold"
                    >
                      Apply
                    </button>
                  </div>
                )}

                <div className="space-y-1.5 text-slate-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-slate-200">${subtotal.toFixed(2)}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount ({(appliedDiscount * 100).toFixed(0)}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax (8.5%)</span>
                    <span className="text-slate-200">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Shipping</span>
                    <span className="text-slate-200">
                      {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-white text-sm font-bold pt-1.5 border-t border-slate-950">
                    <span className="font-sans">Grand Total</span>
                    <span className="text-teal-400 font-mono">${total.toFixed(2)}</span>
                  </div>
                </div>

                {checkoutStep === 'cart' && (
                  <button
                    onClick={() => setCheckoutStep('shipping')}
                    className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl font-sans text-center transition-all cursor-pointer"
                  >
                    Proceed to Shipping
                  </button>
                )}

                {checkoutStep === 'shipping' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCheckoutStep('cart')}
                      className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl font-sans"
                    >
                      Back
                    </button>
                    <button
                      form="shipping-form"
                      type="submit"
                      onClick={(e) => {
                        // Triggers form submit manually since it's outside the element
                        const form = document.getElementById('shipping-form') as HTMLFormElement;
                        if (form) {
                          if (form.checkValidity()) {
                            e.preventDefault();
                            setCheckoutStep('payment');
                          }
                        }
                      }}
                      className="flex-1 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl font-sans cursor-pointer"
                    >
                      Continue to Payment
                    </button>
                  </div>
                )}

                {checkoutStep === 'payment' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCheckoutStep('shipping')}
                      className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl font-sans"
                    >
                      Back
                    </button>
                    <button
                      form="payment-form"
                      type="submit"
                      onClick={(e) => {
                        const form = document.getElementById('payment-form') as HTMLFormElement;
                        if (form) {
                          if (form.checkValidity()) {
                            e.preventDefault();
                            // Call submit
                            handleCheckoutSubmit(e);
                          }
                        }
                      }}
                      className="flex-1 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl font-sans cursor-pointer"
                    >
                      Authorize & Pay ${total.toFixed(2)}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
