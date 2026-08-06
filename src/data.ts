/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, BlogPost } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'drynest-container',
    name: 'DryNest Portable Drying Container',
    price: 39.99,
    description: 'The premier portable drying container designed to quickly dry wet gym gear, swim trunks, and microclimate apparel on the go.',
    category: 'device',
    image: '', // Image will be input later
    specs: {
      'Dimensions': '14.5" Height x 8.2" Diameter',
      'Weight': '2.1 lbs (Empty)',
      'Battery Life': 'Up to 4 Hours of continuous fan operation',
      'Charging': 'USB-C Fast Charging (15W)',
      'Heat settings': 'Fan Airflow Only (No Heat Element)',
      'Fan speeds': 'Low, Medium, High'
    },
    rating: 4.8,
    reviews: [
      { id: '1', user: 'Marcus K.', rating: 5, comment: 'Saves me from carrying wet soccer shorts in my gym backpack. Best purchase this year.', date: '2026-06-15' },
      { id: '2', user: 'Elena R.', rating: 4, comment: 'Excellent build quality, though I wish I bought the heated version for wet winter gear.', date: '2026-06-28' }
    ],
    stock: 250
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: '1',
    title: 'How to Prevent Bacteria & Odors in Sports Gear',
    category: 'Athlete Tips',
    summary: 'Leaving wet clothing in dark bags is a recipe for bacterial bloom. Learn how airflow inhibits mold and odors.',
    content: 'Sports gear left inside standard gym duffels or plastic bags experiences what biologists call "bacterial explosion." High humidity, warmth, and sweat form an incubator for Staph and Micrococcus, generating that stubborn "perma-funk" smell. DryNest was specifically designed to arrest this process immediately. By maintaining constant engineered airflow, the humidity is dragged below 40% where mold spores cannot thrive, letting athletes go straight from training to dinner without ruining their premium apparel.',
    date: '2026-06-20',
    author: 'Dr. Sarah Jenkins (Sports Science)',
    readTime: '4 min'
  },
  {
    id: '2',
    title: 'The Art of Light Packing: Swimmers Edition',
    category: 'Travel',
    summary: 'Wet swimsuits and heavy towels can quadruple luggage weight. Learn how portable drying changes everything.',
    content: 'Traveling light is an art, but swimmers have long had it rough. Packing wet towels and bikinis means carrying several pounds of stagnant water weight. Swimmers often resort to tying wet gear to backpacks. A portable smart container like DryNest allows you to pack wet suits directly inside, drying them on the plane or train commute back. It reduces clutter, saves weight, and keeps other garments completely dry and protected.',
    date: '2026-07-01',
    author: 'Elena Rostova (Olympic Coach)',
    readTime: '3 min'
  },
  {
    id: '3',
    title: 'OTA Firmware v2.1: Intelligent Pulse Drying',
    category: 'Product Updates',
    summary: 'Our latest firmware optimizes battery life by 35% through smart pulsed heating cycles. Here is how to update.',
    content: 'We are thrilled to announce DryNest OS firmware v2.1. In this release, our software team integrated a new machine learning algorithm: "Intelligent Pulse Drying." Instead of powering the ceramic heater consistently (which draws heavy battery), the heater now pulses in a sinusoidal curve. This maintains exact thermodynamic efficiency while extending battery runtime by up to 35%. Pro and Plus users can update their devices with a single tap in the connected mobile app dashboard over Bluetooth BLE.',
    date: '2026-07-04',
    author: 'Chief of Software Engineering',
    readTime: '5 min'
  }
];

export const FAQS = [
  {
    question: 'How does DryNest dry clothes without a full tumble dryer?',
    answer: 'DryNest uses High-Efficiency air velocity. Fresh air is forced in through the base vents and accelerated over the hanging garments, stripping moisture away. Moist air is evacuated immediately. Optional gentle heating (up to 45°C/113°F) mimics line-drying in warm sunshine, bypassing the wear-and-tear of heavy spinning.'
  },
  {
    question: 'Is it safe to leave wet gear in DryNest inside a backpack?',
    answer: 'Yes! DryNest is completely sealed on the sides. Fresh intake and moist exhaust are routed via engineered directional channels. It is double-walled and thermally insulated, meaning heat and moisture do not escape into your backpack or duffel bag.'
  },
  {
    question: 'How long does a typical drying cycle take?',
    answer: 'A standard polyester gym shirt takes 30-40 minutes in Turbo mode. A heavy cotton beach towel takes about 60-80 minutes in Max Dry mode. You can use the AI Dry Assistant to optimize the time based on your exact fabric.'
  },
  {
    question: 'Does the device emit strong noise or vibration?',
    answer: 'No. DryNest uses dual-bearing brushless motors modeled after high-end drone prop engines, keeping operations under 42dB (the volume of a soft whisper). In Silent Mode, it stays under 32dB.'
  },
  {
    question: 'Can I carry DryNest on a commercial flight?',
    answer: 'Absolutely. DryNest uses standard lithium-ion batteries that fall well below the FAA 100Wh restriction threshold. It is fully certified for carry-on luggage.'
  }
];

export const COMPARISON_COLUMNS = ['Feature', 'DryNest Portable Container', 'Standard Air-Drying', 'Traditional Dryer'];

export const COMPARISON_DATA = [
  { feature: 'Price', basic: '$39.99', plus: 'Free', pro: '$300+' },
  { feature: 'Drying Speed', basic: '30-40 mins', plus: '12-24 hours', pro: '45-60 mins' },
  { feature: 'Portability', basic: 'Fits in Backpack', plus: 'N/A (Stationary)', pro: 'Stationary Heavy Appliance' },
  { feature: 'Energy Usage', basic: 'Ultra-low (Lithium Core)', plus: 'Zero', pro: 'Extremely High (1500W+)' },
  { feature: 'Odors Blocked', basic: 'Yes (Activated Carbon Filter)', plus: 'No', pro: 'Partial' },
  { feature: 'Fabric Wear & Tear', basic: 'None (Gentle Constant Airflow)', plus: 'None', pro: 'High (Severe friction & tumbling)' }
];
