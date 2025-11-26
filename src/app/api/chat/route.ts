/**
 * MERIDIAN LIVING - Chat API Route
 * 
 * Server-side logic for AI interactions.
 * Handles streaming, tool calling, and context injection.
 */

import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import { getTemporalContext } from "@/lib/ai/context";
import { tools } from "@/lib/ai/tools";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  // Check for API key first
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error("[AI] OPENAI_API_KEY is not configured");
    return new Response(
      JSON.stringify({
        error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const body = await req.json();
    const { messages } = body as { messages: Array<{ role: string; content: string }> };

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid request: messages array required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate fresh temporal context for this request
    const temporalContext = getTemporalContext();

    // Build system prompt with injected context
    const systemPrompt = buildSystemPrompt({
      residentName: "Carlos Mendoza", // TODO: Get from auth
      unit: "12B",
      temporalContext,
    });

    console.log("[AI] Processing request with", messages.length, "messages");

    // Stream the response with tool support
    const result = await streamText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      messages,
      tools,
      maxSteps: 5,
      temperature: 0.7,
      onFinish: ({ usage }) => {
        console.log("[AI] Request completed", {
          promptTokens: usage.promptTokens,
          completionTokens: usage.completionTokens,
        });
      },
    });

    // Return the streaming response
    return result.toDataStreamResponse();
    
  } catch (error) {
    // Log the full error for debugging
    console.error("[AI] Error processing request:", error);
    
    // Provide more specific error messages
    let errorMessage = "Error processing your request. Please try again.";
    
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        errorMessage = "Invalid OpenAI API key. Please check your .env.local file.";
      } else if (error.message.includes("rate limit")) {
        errorMessage = "Rate limit exceeded. Please wait a moment and try again.";
      } else if (error.message.includes("model")) {
        errorMessage = "Model not available. Please check your OpenAI account.";
      } else {
        // Include actual error in dev
        errorMessage = `Error: ${error.message}`;
      }
    }
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
