# DebateAI Arena 🎭

Watch AI models battle it out in real-time debates! Claude 3.5 Sonnet vs GPT-4o - who will win?

## Features

- 🔥 Real-time streaming debates between Claude and GPT-4o
- 🎯 Custom debate topics or choose from examples
- 🗳️ Vote for the winner after each debate
- 💬 Watch arguments unfold live with streaming responses
- 🎨 Beautiful, modern UI with smooth animations

## How It Works

1. **Choose a Topic**: Enter any debate topic or select from examples
2. **Watch Live**: AI models stream their arguments in real-time
3. **Vote Winner**: Decide which AI made the best argument

## Tech Stack

- **Next.js 16** - React framework with App Router
- **Vercel AI SDK** - Multi-model AI streaming
- **shadcn/ui** - Beautiful UI components
- **Tailwind CSS** - Modern styling
- **TypeScript** - Type safety

## Getting Started

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.local.example .env.local
# Add your ANTHROPIC_API_KEY and OPENAI_API_KEY

# Run development server
bun dev

# Build for production
bun run build
```

## Debate Flow

1. Claude 3.5 Sonnet argues **FOR** the topic
2. GPT-4o argues **AGAINST** the topic
3. They take turns presenting arguments (3 turns each)
4. You vote for the winner!

## Example Topics

- AI will create more jobs than it destroys
- Remote work is better than office work
- Social media does more harm than good
- Universal Basic Income should be implemented globally
- Space exploration should be prioritized over ocean exploration

## Built for TreeHacks 2026

This project showcases the power of multi-model AI orchestration, demonstrating how different AI models can engage in structured debates with real-time streaming.
