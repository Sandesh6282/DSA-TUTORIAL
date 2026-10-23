# DSA AI Tutor

An interactive, AI-powered Data Structures and Algorithms (DSA) learning assistant built with Next.js 15, React 19, Tailwind CSS, Monaco Editor, and Google Gemini 1.5 Pro.

---

## 🌟 Features

- **Interactive Lessons**: Comprehensive concept explanations with live examples.
- **In-Browser Code Editor**: Embedded Monaco Editor (VS Code engine) for testing DSA code in real time.
- **Knowledge Quizzes**: Interactive multiple-choice quizzes with instant feedback and score tracking.
- **AI Tutor Chatbot**: Intelligent Q&A assistant powered by Google Gemini 1.5 Pro via a secure server-side API route.
- **Gamified Progress Tracking**: Unlocks topics progressively as you learn and saves your progress in local storage.

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/postcss`
- **Animations & Icons**: [Framer Motion](https://www.framer.com/motion/) & [Lucide React](https://lucide.dev/)
- **Code Editor**: [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react)
- **AI Integration**: [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) (Google Gemini 1.5 Pro)

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.18.0 or later (Node 20 LTS recommended)
- **npm**: v9 or later

### 2. Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env.local
```

Open `.env.local` and add your Google Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
> **Note**: You can obtain a free API key from [Google AI Studio](https://aistudio.google.com/).
> If no API key is configured, the application will still run and the chatbot will display a prompt explaining how to configure it.

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with Turbopack |
| `npm run build` | Compiles the production build, checks types, and validates ESLint |
| `npm run start` | Runs the compiled production server locally |
| `npm run lint` | Runs Next.js ESLint checks |

---

## 🚀 Deploying to Vercel

1. Push this repository to GitHub/GitLab/Bitbucket.
2. In the [Vercel Dashboard](https://vercel.com/dashboard), click **"Add New Project"** and import the repository.
3. Vercel will automatically detect the **Next.js** framework.
4. Under **Environment Variables**, add:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: *Your Google Gemini API Key*
5. Click **Deploy**.
