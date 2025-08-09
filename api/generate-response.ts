import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { z } from 'zod';

// Configuración máxima para funciones serverless de Vercel
export const maxDuration = 60;


export default async function handler(request: Request) {
    // Solo permitir POST requests
    if (request.method !== 'POST') {
        return new Response('Method not allowed', {
            status: 405,
            headers: { 'Allow': 'POST' }
        });
    }

    try {
        // Validar que existe la API key
        const openaiApiKey = process.env.OPENAI_API_KEY;
        if (!openaiApiKey) {
            console.error('OPENAI_API_KEY environment variable is not set');
            return new Response('Server configuration error', { status: 500 });
        }

        // Parsear y validar el body del request
        const { messages }: { messages: UIMessage[] } = await request.json();


        // Generar respuesta usando Vercel AI SDK
        const result = streamText({
            model: openai("gpt-3.5-turbo"),
            messages: convertToModelMessages(messages)
        });

        // Retornar la respuesta como stream
        return result.toUIMessageStreamResponse();

    } catch (error) {
        console.error('Error generating character response:', error);

        // Manejo específico de errores de validación
        if (error instanceof z.ZodError) {
            return new Response(
                JSON.stringify({
                    error: 'Invalid request data',
                    details: error.errors
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Error genérico del servidor
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}
