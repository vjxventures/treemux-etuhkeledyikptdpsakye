import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { code, language, screenshot, mode } = await req.json();

  const systemPrompt = mode === 'explain'
    ? `You are an expert programming mentor. Analyze the provided code and explain:
- What the code does (high-level overview)
- How it works (key logic and patterns)
- Potential issues or bugs
- Best practices and improvements
- Educational insights for learning

Be concise but thorough. Use markdown formatting.`
    : `You are a proactive pair programming assistant. Analyze the code and provide:
- Bug detection and potential issues
- Performance optimization suggestions
- Code quality improvements
- Security concerns
- Refactoring recommendations

Be specific and actionable. Focus on what matters most.`;

  let userMessage = '';

  if (screenshot) {
    userMessage = `Analyzing code from screenshot. Language: ${language || 'auto-detect'}

${code ? `Additional context:\n\`\`\`\n${code}\n\`\`\`` : ''}

Please analyze this code thoroughly.`;
  } else {
    userMessage = `Language: ${language || 'unknown'}

\`\`\`${language || ''}
${code}
\`\`\`

Please analyze this code.`;
  }

  const messages = screenshot
    ? [
        {
          role: 'user' as const,
          content: [
            { type: 'text' as const, text: userMessage },
            {
              type: 'image' as const,
              image: screenshot // base64 data URL
            }
          ]
        }
      ]
    : [
        {
          role: 'user' as const,
          content: userMessage
        }
      ];

  const result = streamText({
    model: anthropic('claude-3-5-sonnet-20241022'),
    system: systemPrompt,
    messages,
    temperature: 0.7,
  });

  return result.toTextStreamResponse();
}
