# Bone Fracture Classification API

AI-powered X-ray image analysis system for bone fracture detection and classification.

## 📋 Setup Instructions

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Configure Environment

Create a `.env` file in the root directory:
```env
CLAUDE_API_KEY=sk-ant-your-api-key-here
PORT=3000
```

To get your Anthropic API key:
1. Visit https://console.anthropic.com
2. Sign in or create an account
3. Navigate to API Keys section
4. Generate a new API key
5. Copy and paste it into `.env`

### 3️⃣ Run Locally

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:3000`

---

## 🚀 Deployment Options

### **Option 1: Vercel (Recommended - Free & Easy)**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variable
vercel env add CLAUDE_API_KEY
# Enter your API key

# Deploy to production
vercel --prod
```

After deployment, update `fracture_classifier.html`:
```javascript
// Change from:
const response = await fetch('/api/analyze-fracture', {

// To:
const response = await fetch('https://your-project-name.vercel.app/api/analyze-fracture', {
```

### **Option 2: Railway (Free $5/month credits)**

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select this repository
4. Add environment variable `CLAUDE_API_KEY`
5. Deploy

### **Option 3: Render (Free tier available)**

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Set Build Command: `npm install`
5. Set Start Command: `npm start`
6. Add environment variable `CLAUDE_API_KEY`
7. Deploy

### **Option 4: Docker (Advanced)**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t fracture-api .
docker run -e CLAUDE_API_KEY=sk-ant-... -p 3000:3000 fracture-api
```

---

## 📡 API Reference

### Health Check
```bash
GET /health
```

Response:
```json
{
  "status": "ok",
  "message": "Fracture Analysis API is running"
}
```

### Analyze Fracture
```bash
POST /api/analyze-fracture
Content-Type: application/json

{
  "image": "base64_encoded_image_data"
}
```

Response:
```json
{
  "top1": "Spiral Fracture",
  "confidence": 0.92,
  "top5": [
    {"name": "Spiral Fracture", "probability": 0.92},
    {"name": "Oblique fracture", "probability": 0.05},
    {"name": "Comminuted fracture", "probability": 0.02},
    {"name": "Hairline Fracture", "probability": 0.01},
    {"name": "Avulsion fracture", "probability": 0.00}
  ],
  "bbox": {
    "x": 0.25,
    "y": 0.30,
    "w": 0.40,
    "h": 0.35
  },
  "reasoning": "Clear spiral pattern visible on tibia with torsional force characteristic"
}
```

---

## 🔒 Security

- ✅ API key stored securely in environment variables
- ✅ CORS enabled for frontend access
- ✅ Input validation for image data
- ✅ Error handling without exposing sensitive info
- ✅ Rate limiting recommended for production

---

## 🐛 Troubleshooting

### "CLAUDE_API_KEY not configured"
- Check `.env` file exists and contains valid key
- Restart the server

### "CORS error" on frontend
- Ensure your frontend URL is allowed in deployment settings
- Update `fracture_classifier.html` with correct API endpoint

### "Image too large"
- API accepts up to 50MB base64 encoded images
- Compress/resize images on frontend if needed

---

## 📊 Architecture

```
┌─────────────────────────┐
│  fracture_classifier.html│
│    (Frontend - Client)   │
└────────────┬────────────┘
             │ POST /api/analyze-fracture
             ↓
┌─────────────────────────┐
│    server.mjs (Backend) │
│     Express.js Server   │
└────────────┬────────────┘
             │ API Call
             ↓
┌─────────────────────────┐
│  Claude AI (Anthropic)  │
│  Vision + Classification│
└─────────────────────────┘
```

---

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `CLAUDE_API_KEY` | Anthropic API key | `sk-ant-...` |
| `PORT` | Server port (optional) | `3000` |

---

## 📄 License

MIT © 2026 LAN ZIHAO

---

## ❓ Support

For issues or questions:
1. Check the troubleshooting section
2. Review API response errors
3. Check server logs for details

---

**Last Updated:** 2026-05-27
