# Drynest 🏭

[![CI Pipeline](https://github.com/user/Drynest/actions/workflows/ci.yml/badge.svg)](https://github.com/user/Drynest/actions)
![Gemini AI Powered](https://img.shields.io/badge/Gemini_AI-Powered-8E44AD?style=for-the-badge&logo=google&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)

Drynest is an intelligent industrial equipment monitoring, telemetry analysis, and maintenance scheduling platform powered by `@google/genai` and Gemini 2.5 Flash.

---

## 🏗️ System Architecture

```mermaid
graph TD
    Client[React + Motion Frontend] -->|REST / JSON| ExpressServer[Express Backend - server.ts]
    ExpressServer -->|Security & Rate Limiting| Security[CORS & Header Middleware]
    Security -->|Endpoints| Routes[API Routes]
    Routes -->|/api/health| HealthCheck[Health Check Monitor]
    Routes -->|/api/gemini/ask| GeminiAsk[Gemini AI Agent]
    Routes -->|/api/devices/telemetry| Telemetry[Device Telemetry Service]
    GeminiAsk -->|@google/genai| GoogleGemini[Google Gemini 2.5 Flash]
    GeminiAsk -.->|Fallback Engine| Fallback[Simulated Industrial Diagnostic]
```

---

## ✨ Features

- **Industrial Diagnostic Agent**: Specialized `/api/gemini/ask` for analyzing equipment error codes and telemetry anomalies.
- **Real-Time Device Telemetry**: Endpoint `/api/devices/telemetry` tracking power usage, status, and runtime hours.
- **Automated Maintenance Scheduler**: Ticket generation endpoint for facility technicians.
- **Security Hardened**: Built-in CORS headers and rate-limiting headers.
- **Vitest Unit Test Suite**: Comprehensive testing in `tests/api.test.ts`.
- **CI/CD Automation**: GitHub Actions pipeline for continuous integration.

---

## 🔑 Environment Variables

```env
PORT=3001
GEMINI_API_KEY=your_google_gemini_api_key_here
```

| Variable | Required | Description | Default |
| :--- | :--- | :--- | :--- |
| `PORT` | No | Express server port | `3001` |
| `GEMINI_API_KEY` | Recommended | Google Gemini API key | `""` (Fallback active) |

---

## 📡 API Documentation

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Response**:
```json
{
  "status": "ok",
  "service": "drynest-backend",
  "version": "1.0.0",
  "timestamp": "2026-08-12T12:00:00.000Z",
  "gemini_configured": true
}
```

### 2. Gemini AI Ask Endpoint
- **Endpoint**: `POST /api/gemini/ask`
- **Request Body**:
```json
{
  "prompt": "Analyze cause of high pressure alarm on Dryer-02",
  "context": "Error E-402, Power 1.5kW, Runtime 400h"
}
```

---

## ⚡ Quick Start

```bash
npm install
npm run dev
npm test
npm run build
```
