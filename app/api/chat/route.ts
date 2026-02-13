import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { getSystemPrompt } from '@/lib/system-prompt';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, mode = 'chat' } = await req.json();

    const result = streamText({
      model: anthropic('claude-sonnet-4-5-20250929'),
      system: getSystemPrompt(mode),
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
