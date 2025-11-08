import { Router } from 'express';
import fetch from 'node-fetch';

export const chatWithDataRouter = Router();

// Regular (non-streaming) endpoint
chatWithDataRouter.post('/', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required' });
    }

    const vannaApiUrl = process.env.VANNA_API_BASE_URL || 'http://localhost:8000';
    
    const response = await fetch(`${vannaApiUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        const errorText = await response.text();
        errorData = { detail: errorText || 'Unknown error' };
      }
      console.error('Vanna AI error:', errorData);
      const errorMessage = errorData.detail || errorData.error || 'Failed to process query';
      console.error('Full error response:', JSON.stringify(errorData, null, 2));
      return res.status(response.status).json({ 
        error: errorMessage,
        details: errorData,
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error in chat-with-data:', error);
    res.status(500).json({ error: 'Failed to process chat query' });
  }
});

// Streaming endpoint
chatWithDataRouter.post('/stream', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required' });
    }

    const vannaApiUrl = process.env.VANNA_API_BASE_URL || 'http://localhost:8000';
    
    // Set headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
    
    const response = await fetch(`${vannaApiUrl}/api/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      res.write(`data: ${JSON.stringify({ type: 'error', message: errorText || 'Failed to connect to Vanna AI' })}\n\n`);
      res.end();
      return;
    }

    // Pipe the stream from Vanna AI to the client
    if (response.body) {
      // Convert node-fetch ReadableStream to Node.js stream
      const nodeStream = response.body as any;
      
      nodeStream.on('data', (chunk: Buffer) => {
        res.write(chunk);
      });
      
      nodeStream.on('end', () => {
        res.end();
      });
      
      nodeStream.on('error', (err: Error) => {
        console.error('Stream error:', err);
        res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`);
        res.end();
      });
      
      return; // Don't call res.end() here, let the stream handle it
    }
    
    res.end();
  } catch (error: any) {
    console.error('Error in chat-with-data stream:', error);
    res.write(`data: ${JSON.stringify({ type: 'error', message: error.message || 'Failed to process chat query' })}\n\n`);
    res.end();
  }
});
