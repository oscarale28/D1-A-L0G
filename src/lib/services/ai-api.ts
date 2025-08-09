import type { Message } from '../types';

export interface ChatAPIRequest {
    messages: Array<{
        role: 'user' | 'assistant' | 'system';
        content: string;
    }>;
    characterPrompt: string;
    model?: string;
}

export interface ChatAPIResponse {
    success: boolean;
    response?: string;
    error?: string;
}

/**
 * Formatea los mensajes para la API
 */
const formatMessagesForAPI = (messages: Message[], userId: string) => {
    return messages
        .slice(-10) // Tomar solo los últimos 10 mensajes para contexto
        .map((msg) => ({
            role: msg.senderId === userId ? 'user' as const : 'assistant' as const,
            content: msg.text
        }));
};

/**
 * Procesa una línea del stream de datos
 */
const processStreamLine = (line: string): string => {
    if (!line.startsWith('0:')) {
        return '';
    }

    try {
        const jsonStr = line.substring(2);
        const data = JSON.parse(jsonStr);
        return data.type === 'text-delta' && data.textDelta ? data.textDelta : '';
    } catch {
        // Línea no válida, retornar string vacío
        return '';
    }
};

/**
 * Lee y procesa el stream de respuesta
 */
const readResponseStream = async (response: Response): Promise<string> => {
    if (!response.body) {
        throw new Error('No response body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
                fullResponse += processStreamLine(line);
            }
        }
    } finally {
        reader.releaseLock();
    }

    return fullResponse.trim();
};

/**
 * Genera una respuesta del personaje usando la API de Vercel
 */
export const generateCharacterResponse = async (
    messages: Message[],
    characterPrompt: string,
    userId: string
): Promise<string> => {
    try {
        const formattedMessages = formatMessagesForAPI(messages, userId);
        const baseUrl = "https://d1-a-l0g.vercel.app";

        const requestBody: ChatAPIRequest = {
            messages: formattedMessages,
            characterPrompt,
            model: 'gpt-3.5-turbo'
        };

        const response = await fetch(`${baseUrl}/api/generate-response`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(`API Error: ${response.status} - ${errorData.error || 'Unknown error'}`);
        }

        const fullResponse = await readResponseStream(response);

        if (!fullResponse) {
            throw new Error('Empty response from API');
        }

        return fullResponse;

    } catch (error) {
        console.error('Error generating character response:', error);

        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Network error: Could not connect to the AI service');
        }

        throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
};

/**
 * Función de fallback para generar una respuesta simple cuando la API falla
 */
export const generateFallbackResponse = (characterName: string): string => {
    const fallbackResponses = [
        `*${characterName} seems to be having trouble with the communication system...*`,
        `*The connection to ${characterName} is unstable. Please try again.*`,
        `*${characterName} is temporarily unavailable. The message has been received.*`,
        `*Technical difficulties detected. ${characterName} will respond when the connection is restored.*`
    ];

    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
};
