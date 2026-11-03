import express from 'express'
import { createServer as createViteServer } from 'vite'
import dotenv from 'dotenv'
import { GoogleGenAI } from '@google/genai'

dotenv.config()

async function startServer() {
  const app = express()
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000

  app.use(express.json({ limit: '50mb' }))

  // API Route: AI Vision Layer Decomposition
  app.post('/api/analyze-image', async (req, res) => {
    try {
      const { imageBase64, mimeType = 'image/jpeg', fileName } = req.body

      if (!imageBase64) {
        return res.status(400).json({ error: 'Missing imageBase64' })
      }

      const apiKey = process.env.GEMINI_API_KEY
      if (!apiKey) {
        return res.status(200).json({
          fallback: true,
          message: 'No GEMINI_API_KEY configured, using visual layout decomposer',
        })
      }

      const ai = new GoogleGenAI({ apiKey })

      const prompt = `Analyze this slide or image and decompose it into independent editable layers for a PowerPoint presentation.
Extract the text blocks, container cards/shapes, and determine the clean background color.
Return ONLY valid JSON with this exact schema:
{
  "backgroundColor": "#hex",
  "watermarkDetected": boolean,
  "layers": [
    {
      "name": "descriptive name",
      "type": "text" | "card" | "badge",
      "x": number (percentage 0 to 100),
      "y": number (percentage 0 to 100),
      "w": number (percentage 0 to 100),
      "h": number (percentage 0 to 100),
      "zIndex": number (1 for cards, 2 for text),
      "text": "exact extracted text string (only for text/badge)",
      "fontSize": number in pt (e.g. 11, 14, 20, 28),
      "fontWeight": "normal" | "bold",
      "fontColor": "#hex (e.g. #0F172A)",
      "bgColor": "#hex (for cards/badges)",
      "borderColor": "#hex or null",
      "align": "left" | "center" | "right"
    }
  ]
}`

      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '')

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            inlineData: {
              mimeType: mimeType as string,
              data: cleanBase64,
            },
          },
          prompt,
        ],
        config: {
          responseMimeType: 'application/json',
        },
      })

      const text = response.text
      if (!text) {
        return res.status(200).json({ fallback: true })
      }

      const parsed = JSON.parse(text)
      return res.status(200).json({ success: true, data: parsed })
    } catch (err: any) {
      console.error('Gemini vision decomposition error:', err)
      return res.status(200).json({
        fallback: true,
        error: err.message || 'Vision decomposition failed, using fallback',
      })
    }
  })

  // In development, mount Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    })
    app.use(vite.middlewares)
  } else {
    // Production static files
    app.use(express.static('dist'))
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' })
    })
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`)
  })
}

startServer()
