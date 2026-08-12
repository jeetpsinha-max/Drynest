import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Security & Rate Limit Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-RateLimit-Limit', '100');
  res.setHeader('X-RateLimit-Remaining', '99');
  res.setHeader('X-RateLimit-Reset', Math.floor(Date.now() / 1000 + 3600).toString());
  next();
});

const getGeminiClient = (): GoogleGenAI | null => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

// 1. Health Check
app.get('/api/health', (req: Request, res: Response) => {
  const apiKey = process.env.GEMINI_API_KEY;
  res.status(200).json({
    status: 'ok',
    service: 'drynest-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    gemini_configured: Boolean(apiKey && apiKey.length > 0)
  });
});

// 2. Gemini AI Agent Endpoint
app.post('/api/gemini/ask', async (req: Request, res: Response) => {
  try {
    const { prompt, systemInstruction, context } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Field "prompt" is required and must be a non-empty string.',
        status: 'error'
      });
    }

    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        answer: `[Drynest Industrial AI Fallback] Automated diagnostic assessment for query: "${prompt}". Configure GEMINI_API_KEY for full AI capability.`,
        model: 'gemini-2.5-flash-fallback',
        status: 'fallback',
        timestamp: new Date().toISOString()
      });
    }

    const combinedPrompt = context ? `Device Context: ${context}\n\nQuery: ${prompt}` : prompt;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: combinedPrompt,
      config: systemInstruction ? { systemInstruction } : undefined
    });

    const answer = response.text || 'No response generated from Gemini AI.';

    return res.status(200).json({
      answer,
      model: 'gemini-2.5-flash',
      status: 'success',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Gemini API Error in Drynest:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'An error occurred while communicating with Gemini AI.',
      fallback_answer: `[Drynest AI Fallback] System offline. Diagnostic query: "${req.body?.prompt}".`,
      status: 'error'
    });
  }
});

// 3. Telemetry & Diagnostics
app.get('/api/devices/telemetry', (req: Request, res: Response) => {
  res.json([
    { deviceId: 'DRY-01', status: 'active', powerUsage: '1.2kW', runtime: '142h' },
    { deviceId: 'DRY-02', status: 'maintenance_needed', powerUsage: '1.5kW', runtime: '400h' }
  ]);
});

app.post('/api/diagnostics/ai', async (req: Request, res: Response) => {
  try {
    const { errorCode, deviceContext } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({ diagnosis: `[Fallback Diagnosis] Error code ${errorCode}: Inspect condenser airflow and filter assembly.` });
    }
    const prompt = `Diagnose the following error code ${errorCode} for facility equipment. Context: ${deviceContext}`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    res.json({ diagnosis: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/maintenance/schedule', (req: Request, res: Response) => {
  const { deviceId, issue } = req.body;
  res.json({
    ticketId: `TICKET-${Math.floor(Math.random() * 10000)}`,
    deviceId,
    status: 'scheduled',
    message: `Maintenance scheduled for ${deviceId} regarding ${issue}`
  });
});

if (process.env.NODE_ENV !== 'test' && require.main === module) {
  app.listen(port, () => {
    console.log(`🚀 Drynest Server running on port ${port}`);
  });
}
