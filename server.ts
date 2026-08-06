/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini Client to prevent server crashes if the API key is not configured on boot
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in the environment variables.');
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AI Drying Assistant Optimization API
app.post('/api/gemini/optimize', async (req, res) => {
  try {
    const { item, wetness, outdoorTemp, humidity, travelTime, bagType, fabricType } = req.body;
    
    if (!item) {
      return res.status(400).json({ error: 'Item description is required' });
    }

    const client = getGeminiClient();
    
    const prompt = `
      You are the DryNest Intelligent Drying Optimizer Core.
      The user is drying: "${item}" (Fabric: ${fabricType || 'auto-detect'}, Wetness Level: ${wetness || 'medium'}).
      Environmental stats: Outdoor Temp: ${outdoorTemp || '22'}°C, Humidity: ${humidity || '50'}%, Travel time: ${travelTime || '45'} minutes, Bag Type: ${bagType || 'Standard gym backpack'}.
      
      Recommend the optimal drying parameters for our DryNest smart portable drying container:
      1. Fan speed: Choose exactly one of 'OFF', 'LOW', 'MEDIUM', 'HIGH', 'TURBO'.
      2. Heat level: Choose exactly one of 'OFF', 'LOW', 'MEDIUM', 'HIGH'.
      3. Estimated time to dry: Integer in minutes.
      4. Battery usage prediction: Percentage from 0 to 100.
      5. Optimization explanation: Clear, scannable advice.
      6. Energy saving mode advice: Yes or No.
      7. Fabric care note: 1-sentence warnings or advice for this fabric type.
    `;

    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are the embedded AI Drying Optimization assistant inside the DryNest mobile companion application. Keep your response in structured JSON matching the schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fanSpeed: { type: Type.STRING, description: 'OFF, LOW, MEDIUM, HIGH, or TURBO' },
            heatLevel: { type: Type.STRING, description: 'OFF, LOW, MEDIUM, or HIGH' },
            estimatedTimeMinutes: { type: Type.INTEGER, description: 'Estimated time in minutes to complete drying' },
            batteryUsagePercent: { type: Type.INTEGER, description: 'Estimated battery capacity consumed by this operation (0-100)' },
            explanation: { type: Type.STRING, description: 'Detailed drying plan and rationale' },
            energySavingMode: { type: Type.STRING, description: 'Advice for battery preservation (Yes/No)' },
            fabricCareAdvice: { type: Type.STRING, description: 'Specific material warning or care advice' }
          },
          required: ['fanSpeed', 'heatLevel', 'estimatedTimeMinutes', 'batteryUsagePercent', 'explanation', 'energySavingMode', 'fabricCareAdvice']
        }
      }
    });

    const text = response.text || '{}';
    const parsedData = JSON.parse(text.trim());
    return res.json(parsedData);
  } catch (err: any) {
    console.error('AI Optimize Error:', err);
    // Provide an elegant simulated fallback response if the Gemini API key is missing or errors
    return res.json({
      fanSpeed: 'HIGH',
      heatLevel: 'MEDIUM',
      estimatedTimeMinutes: 40,
      batteryUsagePercent: 25,
      explanation: 'System utilizing DryNest standard flow profile: High-efficiency airflow with mild thermal induction provides highly consistent drying while keeping fabrics fully safe. (Simulated Response: ' + err.message + ')',
      energySavingMode: 'Yes',
      fabricCareAdvice: 'DryNest handles active synthetic and athletic fabrics with gentle thermodynamic cycles to prevent micro-fiber breakdown.'
    });
  }
});

// AI Customer Support Chatbot API
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, chatHistory } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const client = getGeminiClient();

    // Prepare contents with chat history for context
    const contents: any[] = [];
    if (chatHistory && Array.isArray(chatHistory)) {
      chatHistory.forEach((msg: any) => {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    const systemInstruction = `
      You are nesting AI, the official customer support specialist and hardware technician for DryNest smart drying containers.
      DryNest product info:
      - It is a portable cylinder container that actively dries wet athletic clothing, swimwear, and towels while travelling in a backpack.
      - Uses brushless fan motors at the base to push air up, and dual venting ports at the lid to exhaust wet air.
      - DryNest Plus and Pro feature built-in low-power ceramic heating elements to accelerate drying.
      - Has a built-in Bluetooth chip to connect with our iOS and Android companion app.
      - Charging is USB-C (Supports 15W to 45W depending on version).
      - Models: Basic ($129), Plus ($179), Pro ($249).
      - Support tickets can be registered under accounts, and purchases are done securely.
      
      Your personality: Warm, smart, precise, and tech-forward. Keep answers under 3 sentences unless troubleshooting a specific diagnostic issue. Do not speak about yourself as general AI, speak as DryNest's dedicated assistant.
    `;

    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return res.json({ text: response.text });
  } catch (err: any) {
    console.error('AI Chat Error:', err);
    // Dynamic simulated support fallback
    const lowerMsg = req.body.message.toLowerCase();
    let reply = "Hello! I am Nesting, your DryNest companion. I am currently running in offline simulation mode, but I can guide you through using our smart container! How can I help you today?";
    if (lowerMsg.includes('battery') || lowerMsg.includes('charge')) {
      reply = "DryNest containers feature high-density Lithium-ion cells. DryNest Plus gets up to 6 hours on fan-only mode, while Pro gets up to 10 hours. You can quick-charge using any USB-C Power Delivery block!";
    } else if (lowerMsg.includes('heat') || lowerMsg.includes('temperature')) {
      reply = "DryNest uses ultra-safe self-regulating PTC ceramic heaters. Temperature is monitored in real-time up to 45°C (113°F) to accelerate drying while preserving sensitive athletic fabrics.";
    } else if (lowerMsg.includes('error') || lowerMsg.includes('fault') || lowerMsg.includes('warning')) {
      reply = "If your DryNest app displays a diagnostic alert, make sure the intake fan is clear of lint and the air exhaust lid is securely threaded. You can trigger a calibration diagnostics pass in the Settings panel.";
    } else if (lowerMsg.includes('price') || lowerMsg.includes('buy') || lowerMsg.includes('shop')) {
      reply = "Our lineup starts with the DryNest Basic at $129, up to our flagship DryNest Pro at $249, featuring automated moisture detection. Head over to our Shop tab to check them out!";
    }
    
    return res.json({ text: reply + ' (Simulated offline support)' });
  }
});

// Setup development and production serving pipelines
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DryNest Ecosystem Server successfully launched on port ${PORT}`);
  });
}

startServer();
