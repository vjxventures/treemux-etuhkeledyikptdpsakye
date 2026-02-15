import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { topic, model, debateSide, history } = await req.json();

  // Select the AI model
  const aiModel =
    model === "claude"
      ? anthropic("claude-3-5-sonnet-20241022")
      : openai("gpt-4o");

  // Build the debate prompt
  const systemPrompt = `You are participating in a structured debate on the topic: "${topic}".
You are arguing ${debateSide === "for" ? "FOR" : "AGAINST"} this topic.

Debate Rules:
- Provide clear, logical arguments with supporting evidence
- Address counterarguments directly when responding
- Be persuasive but respectful
- Keep responses focused and concise (2-3 paragraphs max)
- Conclude with a strong closing statement if this is your final turn

${history.length === 0 ? "This is your opening statement. Make it compelling." : "This is your response to the opposing argument. Address their points directly."}`;

  const userPrompt =
    history.length === 0
      ? `Present your opening argument ${debateSide === "for" ? "FOR" : "AGAINST"} the topic.`
      : `The opposing side just argued:\n\n"${history[history.length - 1].content}"\n\nRespond with your counterargument.`;

  const result = streamText({
    model: aiModel,
    system: systemPrompt,
    prompt: userPrompt,
    temperature: 0.8,
  });

  return result.toTextStreamResponse();
}
