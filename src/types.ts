/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'device' | 'accessory';
  image: string;
  specs: Record<string, string>;
  rating: number;
  reviews: Review[];
  stock: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  date: string;
  author: string;
  readTime: string;
}

export interface SupportTicket {
  id: string;
  name: string;
  email: string;
  category: string;
  description: string;
  status: 'Open' | 'Pending' | 'Resolved';
  date: string;
  replies?: Array<{
    id: string;
    sender: 'user' | 'agent' | 'system';
    message: string;
    date: string;
  }>;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  name: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
  date: string;
}

export interface DeviceState {
  isConnected: boolean; // Bluetooth connected state
  isPowerOn: boolean;
  fanSpeed: 'OFF' | 'LOW' | 'MEDIUM' | 'HIGH' | 'TURBO';
  heatLevel: 'OFF' | 'LOW' | 'MEDIUM' | 'HIGH';
  mode: 'Eco' | 'Normal' | 'Quick Dry' | 'Max Dry' | 'Quiet';
  batteryLevel: number;
  temperature: number; // in °C
  moisturePercent: number; // 0 to 100
  timerMinutes: number; // minutes remaining (0 means inactive)
  selectedTimer: number | 'custom' | 'none';
  firmwareVersion: string;
  isCharging: boolean;
  deviceName: string;
  diagnostics: {
    fanOk: boolean;
    heaterOk: boolean;
    sensorsOk: boolean;
    filterOk: boolean;
  };
}

export interface SavedCard {
  id: string;
  cardNumber: string;
  cardName: string;
  expiry: string;
}

export interface SavedAddress {
  id: string;
  name: string;
  street: string;
  city: string;
  zip: string;
  phone: string;
}
