/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DeviceState, CartItem, Order, SupportTicket, Review } from './types';
import { INITIAL_PRODUCTS } from './data';
import HardwareSimulator from './components/HardwareSimulator';
import MarketingWebsite from './components/MarketingWebsite';
import NotificationToast, { ToastMessage } from './components/NotificationToast';
import { 
  Globe, 
  Smartphone, 
  Database, 
  Sliders, 
  Wind, 
  Sparkles, 
  X,
  ChevronRight,
  Menu
} from 'lucide-react';

export default function App() {
  // Shared Hardware Bluetooth Companion State
  const [deviceState, setDeviceState] = useState<DeviceState>({
    isConnected: true,
    isPowerOn: false,
    fanSpeed: 'OFF',
    heatLevel: 'OFF',
    mode: 'Normal',
    batteryLevel: 80,
    temperature: 24,
    moisturePercent: 85,
    timerMinutes: 0,
    selectedTimer: 'none',
    firmwareVersion: 'v2.1.0',
    isCharging: false,
    deviceName: 'DryNest-X9',
    diagnostics: {
      fanOk: true,
      heaterOk: true,
      sensorsOk: true,
      filterOk: true
    }
  });

  // Global E-Commerce & Account States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'DN-921441',
      items: [
        { id: 'drynest-container', product: INITIAL_PRODUCTS[0], quantity: 1 }
      ],
      subtotal: 39.99,
      discount: 0,
      tax: 3.40,
      shipping: 0,
      total: 43.39,
      name: 'Marcus K.',
      email: 'marcus.k@swimmers.net',
      address: '852 Ocean View Blvd',
      city: 'Monterey',
      zip: '93940',
      status: 'Shipped',
      date: '2026-07-05'
    },
    {
      id: 'DN-845129',
      items: [
        { id: 'drynest-container', product: INITIAL_PRODUCTS[0], quantity: 2 }
      ],
      subtotal: 79.98,
      discount: 10.00,
      tax: 5.95,
      shipping: 0,
      total: 75.93,
      name: 'Elena Rostova',
      email: 'elena@swimfast.org',
      address: '42 Beacon Hill',
      city: 'Boston',
      zip: '02108',
      status: 'Processing',
      date: '2026-07-06'
    }
  ]);

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([
    {
      id: 'TCK-8212',
      name: 'Elena Rostova',
      email: 'elena@swimfast.org',
      category: 'Bluetooth BLE Error',
      description: 'Companion App loses BLE connection when DryNest goes into Turbo mode inside steel lockers.',
      status: 'Open',
      date: '2026-07-06',
      replies: [
        { id: 'rep-initial', sender: 'user', message: 'It happens only when the lid is tightly threaded in steel lockers.', date: '2026-07-06T10:00:00Z' }
      ]
    },
    {
      id: 'TCK-5512',
      name: 'Coach Miller',
      email: 'miller@seahawks.edu',
      category: 'Warranty Claim',
      description: 'The USB-C port is slightly loose after 11 months of rigorous collegiate swimming pool travel.',
      status: 'Resolved',
      date: '2026-06-15',
      replies: [
        { id: 'rep-init', sender: 'user', message: 'Need instructions on how to ship back for standard warranty core replacements.', date: '2026-06-15T08:00:00Z' },
        { id: 'rep-admin', sender: 'agent', message: 'Warranty replacement approved. A tactical shipping label was dispatched to miller@seahawks.edu.', date: '2026-06-16T12:00:00Z' }
      ]
    }
  ]);

  // Product reviews database state
  const [reviews, setReviews] = useState<Record<string, Review[]>>({});

  // Navigation states for sub-components
  const [activeWebTab, setActiveWebTab] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Global Notification Toast State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isSimOpenOnMobile, setIsSimOpenOnMobile] = useState(false);

  const addToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-teal-500 selection:text-slate-950 font-sans" id="drynest-app">
      
      {/* 1. STICKY DUAL BRAND HEADER */}
      <header className="bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-900 px-6 py-4 flex items-center justify-between">
        
        {/* Brand Emblem */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-500/10 to-blue-500/10 rounded-xl border border-teal-500/25 flex items-center justify-center relative shadow-md shadow-teal-500/5">
            <Wind size={20} className="text-teal-400 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
          </div>
          <div>
            <span className="font-black font-sans tracking-tighter text-white text-lg flex items-center gap-1">
              DryNest <span className="text-[10px] uppercase font-bold tracking-widest text-teal-400 font-mono bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/25">v2.1</span>
            </span>
            <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-wider font-bold">Warm. Compress. Go.</span>
          </div>
        </div>

        {/* Status indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/40 px-3 py-1.5 rounded-full border border-slate-900">
          <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
          <span>Ecosystem Connected</span>
        </div>

        {/* Floating Simulator Toggle for Mobile / Smaller screens */}
        <button
          onClick={() => setIsSimOpenOnMobile(!isSimOpenOnMobile)}
          className="lg:hidden p-2.5 bg-slate-900 border border-slate-800 text-teal-400 hover:text-white rounded-xl transition-all font-mono text-xs font-semibold flex items-center gap-1 cursor-pointer"
        >
          <Sliders size={14} />
          <span>Device</span>
        </button>
      </header>

      {/* 2. MAIN LAYOUT CONTAINER */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        
        {/* Left Column (Main Active Domain) */}
        <div className="lg:col-span-8 bg-slate-950 rounded-[32px] border border-slate-900/80 min-h-[75vh] shadow-xl relative overflow-hidden flex flex-col">
          <MarketingWebsite
            activeWebTab={activeWebTab}
            setActiveWebTab={setActiveWebTab}
            selectedProductId={selectedProductId}
            setSelectedProductId={setSelectedProductId}
            cart={cart}
            setCart={setCart}
            wishlist={wishlist}
            setWishlist={setWishlist}
            orders={orders}
            setOrders={setOrders}
            supportTickets={supportTickets}
            setSupportTickets={setSupportTickets}
            reviews={reviews}
            setReviews={setReviews}
            addToast={addToast}
            deviceState={deviceState}
          />
        </div>

        {/* Right Column (Concurrently Connected Physical Simulator on Desktop) */}
        <div className="hidden lg:block lg:col-span-4 sticky top-36">
          <HardwareSimulator
            deviceState={deviceState}
            setDeviceState={setDeviceState}
          />
        </div>

        {/* Small screen mobile device simulator sidebar sheet */}
        {isSimOpenOnMobile && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 lg:hidden p-6 flex justify-center items-center">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 relative">
              <button
                onClick={() => setIsSimOpenOnMobile(false)}
                className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X size={16} />
              </button>
              <div className="mt-4">
                <HardwareSimulator
                  deviceState={deviceState}
                  setDeviceState={setDeviceState}
                />
              </div>
            </div>
          </div>
        )}

      </main>

      {/* 3. CONCISE ECOSYSTEM FOOTER */}
      <footer className="border-t border-slate-900 py-8 px-6 text-center text-slate-500 text-xs font-mono select-none" id="global-footer">
        <p>© 2026 DryNest Laboratories Inc. Built-in microclimate technology. Patented US-94212-A.</p>
        <span className="text-[10px] text-slate-600 block mt-1.5 uppercase font-bold tracking-widest">Designed like Dyson. Programmed with Gemini.</span>
      </footer>

      {/* Global Toast Overlay Notifications */}
      <NotificationToast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
