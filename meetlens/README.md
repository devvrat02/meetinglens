# MeetLens

MeetLens is a lightweight Chrome extension MVP for live meeting translation and AI-powered technical word explanations. It uses a local Ollama backend, a small Qwen model, and a simple fallback demo mode so it still works when browser speech recognition or AI is unavailable.

## Features

- Live transcript
- Translation to Hindi or Spanish
- Clickable technical word definitions
- Local AI with Ollama
- Demo mode for hackathon reliability
- Google Meet-compatible extension flow

## Requirements

- Node.js 18+
- npm
- Chrome or Chromium
- Ollama installed locally

## Step 1: Install Ollama

Install Ollama on your machine from the official installer, then start the local service.

```bash
ollama --version
```

If Ollama is installed correctly, it should print a version number.

## Step 2: Pull the local model

This project uses a lightweight model so it runs well on a developer laptop.

```bash
ollama pull qwen3:0.6b
```

You can verify that it is downloaded by running:

```bash
ollama list
```

## Step 3: Install backend dependencies

From the project root:

```bash
cd meetlens/server
npm install
```

## Step 4: Start the backend

Run the Node.js backend:

```bash
cd meetlens/server
npm run dev
```

The backend listens on port `8080` by default.

The backend listens on:

```text
http://localhost:8080
```

The health endpoint should respond:

```bash
curl http://localhost:8080/health
```

To use a different port, set `PORT` before starting the server. Update `backendUrl` in `extension/src/services/api.ts` to match it, then rebuild the extension.

Expected response:

```json
{"status":"ok"}
```

## Step 5: Install extension dependencies

Open a new terminal and run:

```bash
cd meetlens/extension
npm install
```

## Step 6: Build the extension

```bash
cd meetlens/extension
npm run build
```

This creates the unpackable Chrome extension bundle in:

```text
meetlens/extension/dist
```

## Step 7: Load the extension in Chrome

1. Open Chrome.
2. Go to `chrome://extensions`.
3. Turn on Developer mode.
4. Click `Load unpacked`.
5. Select the folder:

```text
meetlens/extension/dist
```

## Step 8: Open the extension and test Demo Mode

1. Open the MeetLens extension popup.
2. Click `Demo Mode`.
3. Confirm the demo transcript appears.
4. Select `Hindi` from the language dropdown.
5. Wait for translation to update.
6. Click words like `inference`, `latency`, `deployment`, or `architecture`.
7. Confirm the definition panel shows details.

## Step 9: Use Google Meet (optional live demo)

1. Open a Google Meet call.
2. Open the MeetLens extension popup.
3. Use `Start Listening` if browser speech recognition is available.
4. If speech recognition is unavailable, keep using `Demo Mode`.
5. Select a language and confirm the UI remains responsive.

## Step 10: Run production/server commands

Server commands:

```bash
cd meetlens/server
npm run dev
npm run build
npm start
```

Extension commands:

```bash
cd meetlens/extension
npm run dev
npm run build
```

## Troubleshooting

### Ollama is not running

Start Ollama locally, then retry:

```bash
ollama pull qwen3:0.6b
```

### Backend cannot connect to Ollama

Make sure Ollama is running on:

```text
http://localhost:11434
```

### Extension does not load

Rebuild it and reload the unpacked extension:

```bash
cd meetlens/extension
npm run build
```

## Important note

The project is designed to work even if Ollama or browser speech recognition is unavailable. In those cases, the app falls back to demo data and friendly error messages instead of crashing.
