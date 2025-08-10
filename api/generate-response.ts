import { openai } from '@ai-sdk/openai';
import { ModelMessage, streamText } from 'ai';
import { VercelRequest, VercelResponse } from '@vercel/node';

// Configuración máxima para funciones serverless de Vercel
export const config = {
  runtime: 'nodejs',
  maxDuration: 180
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


    // Generar respuesta usando Vercel AI SDK
    const result = streamText({
      model: openai("gpt-3.5-turbo"),
      messages: messages as ModelMessage[]
    });

    // Retornar la respuesta como stream
    return result.text;

  } catch (error) {
    console.error('💥 Error generating character response:', error);

    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}