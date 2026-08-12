import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy-key' });

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Drynest Server is running' });
});

app.get('/api/devices/telemetry', (req, res) => {
  res.json([
    { deviceId: 'DRY-01', status: 'active', powerUsage: '1.2kW', runtime: '142h' },
    { deviceId: 'DRY-02', status: 'maintenance_needed', powerUsage: '1.5kW', runtime: '400h' }
  ]);
});

app.post('/api/diagnostics/ai', async (req, res) => {
  try {
    const { errorCode, deviceContext } = req.body;
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

app.post('/api/maintenance/schedule', (req, res) => {
  const { deviceId, issue } = req.body;
  res.json({
    ticketId: `TICKET-${Math.floor(Math.random() * 10000)}`,
    deviceId,
    status: 'scheduled',
    message: `Maintenance scheduled for ${deviceId} regarding ${issue}`
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
