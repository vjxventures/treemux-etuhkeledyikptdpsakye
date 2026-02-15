# CodeMentor Live

AI-Powered Pair Programming Assistant that provides real-time code analysis, suggestions, and explanations.

## Features

- **Smart Code Analysis**: AI-powered code review with bug detection and optimization suggestions
- **Multi-Modal Support**: Analyze code from text input or screenshots
- **Real-Time Streaming**: Get instant feedback as the AI analyzes your code
- **Two Modes**:
  - **Suggestions**: Proactive bug detection, performance tips, and refactoring recommendations
  - **Explain**: Educational explanations of what code does and how it works

## Getting Started

1. Install dependencies:
```bash
bun install
```

2. Set up environment variables in `.env.local`:
```bash
ANTHROPIC_API_KEY=your_key_here
```

3. Run the development server:
```bash
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Usage

1. Paste your code into the text area or upload a screenshot
2. Select the programming language
3. Choose between "Suggestions" or "Explain" mode
4. Click "Analyze Code" to get AI-powered insights

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Vercel AI SDK
- Anthropic Claude (Sonnet 3.5)

## Deploy

Deploy to Vercel with environment variables configured.
