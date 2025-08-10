import { openai } from '@ai-sdk/openai';
import { generateText, ModelMessage } from 'ai';
import { VercelRequest, VercelResponse } from '@vercel/node';

// Configuración máxima para funciones serverless de Vercel
export const config = {
  runtime: 'nodejs',
  maxDuration: 10
};


export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Solo permitir POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validar que existe la API key
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY environment variable is not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Parsear y validar el body del request
    const { messages } = req.body;

    // LOG: Ver los mensajes recibidos
    console.log('💬 Messages received:', JSON.stringify(messages, null, 2));
    console.log('💬 Messages count:', messages?.length || 0);

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.log('❌ Messages validation failed');
      return res.status(400).json({
        error: 'Invalid request data',
        details: 'Messages array is required and cannot be empty'
      });
    }


    // Configurar headers para CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');


    // Generar respuesta usando Vercel AI SDK
    const result = await generateText({
      model: openai("gpt-3.5-turbo"),
      messages: messages as ModelMessage[],
      temperature: 0.7,
      maxOutputTokens: 1024
    });

    // Retornar la respuesta como stream
    return res.status(200).json({
      response: result.text
    });

  } catch (error) {
    console.error('💥 Error generating character response:', error);

    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}