import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const client = new Anthropic();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Fracture Analysis API is running' });
});

// Main analysis endpoint
app.post('/api/analyze-fracture', async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    if (!process.env.CLAUDE_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const prompt = `You are a bone fracture classification AI. Analyze this X-ray image and classify the fracture type.

The 10 possible fracture types are:
1. Avulsion fracture
2. Comminuted fracture
3. Fracture Dislocation
4. Greenstick fracture
5. Hairline Fracture
6. Impacted fracture
7. Longitudinal fracture
8. Oblique fracture
9. Pathological fracture
10. Spiral Fracture

IMPORTANT: You must respond with ONLY valid JSON, no markdown, no explanation. Use this exact format:
{
  "top1": "exact fracture name from the list above",
  "confidence": 0.XX,
  "top5": [
    {"name": "fracture name", "probability": 0.XX},
    {"name": "fracture name", "probability": 0.XX},
    {"name": "fracture name", "probability": 0.XX},
    {"name": "fracture name", "probability": 0.XX},
    {"name": "fracture name", "probability": 0.XX}
  ],
  "bbox": {
    "x": 0.XX,
    "y": 0.XX,
    "w": 0.XX,
    "h": 0.XX
  },
  "reasoning": "brief one-sentence reason"
}

bbox values are fractions 0-1 of image dimensions (x=left, y=top, w=width, h=height) indicating where the fracture is most visible.`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: image,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    });

    // Extract JSON from response
    const rawText = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('');

    const cleanJson = rawText.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleanJson);

    res.json(result);
  } catch (error) {
    console.error('Error analyzing fracture:', error);

    if (error instanceof SyntaxError) {
      return res.status(400).json({ 
        error: 'Failed to parse AI response',
        details: error.message 
      });
    }

    res.status(500).json({ 
      error: 'Analysis failed',
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    details: err instanceof Error ? err.message : 'Unknown error'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Fracture Analysis API running on port ${PORT}`);
  console.log(`📍 Health check: GET http://localhost:${PORT}/health`);
  console.log(`🔍 Analysis endpoint: POST http://localhost:${PORT}/api/analyze-fracture`);
});
