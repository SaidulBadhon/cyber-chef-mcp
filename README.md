# Neon Terminal - AI Chat Application

A modern AI chat interface with a **black + neon green hacker-style** theme. Switch between multiple AI models (OpenAI, Anthropic, Gemini) and stream responses in real-time.

![Neon Terminal](./app/public/terminal.svg)

## Features

- �� **Hacker-style UI** - Black + neon green theme with terminal aesthetics
- 🤖 **Multi-model support** - Switch between OpenAI, Anthropic, and Gemini
- ⚡ **Real-time streaming** - See AI responses as they're generated
- 💾 **Chat history** - Sessions persisted in MongoDB
- 🎯 **Model per message** - See which model generated each response

## Tech Stack

### Frontend
- Vite + React + TypeScript
- TailwindCSS
- shadcn/ui components
- Vercel AI SDK (streaming)

### Backend
- Bun runtime
- Hono web framework
- MongoDB with Mongoose
- Vercel AI SDK (AI providers)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas connection string
- API keys for at least one AI provider:
  - [OpenAI API Key](https://platform.openai.com/)
  - [Anthropic API Key](https://console.anthropic.com/)
  - [Google AI (Gemini) API Key](https://ai.google.dev/)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd neon-terminal
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```
   MONGODB_URI=mongodb://localhost:27017/neon-terminal
   OPENAI_API_KEY=your-openai-key
   ANTHROPIC_API_KEY=your-anthropic-key
   GEMINI_API_KEY=your-gemini-key
   ```

3. **Install backend dependencies**
   ```bash
   cd api
   bun install
   ```

4. **Install frontend dependencies**
   ```bash
   cd ../app
   bun install
   ```

### Running the Application

1. **Start the backend** (from the `api` directory)
   ```bash
   cd api
   bun run dev
   ```
   The API will be available at `http://localhost:3001`

2. **Start the frontend** (from the `app` directory in a new terminal)
   ```bash
   cd app
   bun run dev
   ```
   The app will be available at `http://localhost:5173`

3. **Open your browser** and navigate to `http://localhost:5173`

## Project Structure

```
├── api/                    # Backend (Bun + Hono)
│   ├── src/
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── services/       # AI service abstraction
│   │   ├── types/          # TypeScript types
│   │   └── index.ts        # Entry point
│   └── package.json
│
├── app/                    # Frontend (Vite + React)
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   └── ...         # App components
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilities
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   └── package.json
│
├── .env.example            # Environment variables template
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/models` | Get available AI models |
| GET | `/api/sessions` | Get all chat sessions |
| GET | `/api/sessions/:id` | Get session with messages |
| DELETE | `/api/sessions/:id` | Delete a session |
| POST | `/api/chat/stream` | Stream chat response |

## Available Models

- **OpenAI**: GPT-4.1, GPT-4o
- **Anthropic**: Claude Sonnet 4, Claude 3.5 Sonnet
- **Gemini**: 1.5 Pro, 2.0 Flash

## License

MIT
