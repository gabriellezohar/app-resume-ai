# app-resume-ai

**AI-powered resume builder** — React frontend + Node/Express backend with OpenAI integration.

**Live Frontend:** [https://app-resume-ai.vercel.app](https://app-resume-ai.vercel.app)  
**Live API (health):** [https://app-resume-ai.onrender.com/api/ping](https://app-resume-ai.onrender.com/api/ping)


## Features
- Generate ATS-friendly resume JSON from user input  
- Enforces a strict JSON schema (no invented or reordered data)  
- Optional PDF-to-text parsing (implemented, currently disabled)  
- Secure CORS configuration for approved origins  

## Tech Stack
- **Frontend:** React (Create React App)  
- **Backend:** Node.js + Express  
- **AI:** OpenAI API  
- **Deployment:** Frontend on **Vercel**, Backend on **Render**

## Project Structure

/ (React app: src, public, package.json)
/ server (Express API: index.js, package.json)


## API Endpoints
- **GET `/api/ping`** — Health check → returns `{ ok: true, time }`  
- **POST `/api/generate`** — Creates an AI-enhanced resume JSON from the provided input
Example request:
curl -X POST https://app-resume-ai.onrender.com/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "create",
    "payload": {
      "fullName": "Gabrielle Zohar",
      "role": "Full-Stack Developer",
      "skills": ["React", "Node"],
      "experiences": [
        { "role": "Developer", "company": "Dorix", "dates": "2023–2025", "details": "Built core features" }
      ]
    }
  }'

## Local Development
### Backend
cd server
npm install
npm start

### Frontend
npm install
npm start

## Deployment
### Backend (Render)
- Root Directory: server
- Build Command: npm i
- Start Command: npm start
- Environment Variables:
- OPENAI_API_KEY=...

### Frontend (Vercel)
- Root Directory: (project root)
- Build Command: npm run build
- Output Directory: build
- Environment Variable:
- REACT_APP_BACKEND_URL=https://app-resume-ai.onrender.com

## License
MIT