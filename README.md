# VC Intelligence MVP

This project is a minimum viable product for a Venture Capital intelligence platform. It allows users to browse a list of target companies and use AI to automatically enrich their profiles by scraping public websites and extracting structured insights.

## Project Architecture

- **Frontend**: React (JavaScript) + Vite + Tailwind CSS
- **Backend**: FastAPI (Python) + `BeautifulSoup4` + `google-genai`
- **Data Pattern**: The frontend only fetches data. All scraping and AI API calls are securely performed server-side on the backend.

## Prerequisites
- Python (v3.10+)
- A Gemini API Key from Google AI Studio

---

## 1. Backend Setup

The backend serves the API on `http://localhost:8000`.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables. Create a `.env` file in the `backend/` directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
5. Run the FastAPI development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *You can view the interactive API docs at http://localhost:8000/docs.*

---

## 2. Frontend Setup

The frontend runs locally, typically on `http://localhost:5173`.

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local URL provided by Vite to view the React application.

## End-to-End Test Plan
1. Open the frontend.
2. Select any company from the Target Companies dashboard, or use the "New Target" button to add a custom company to your pipeline.
3. On the Company Profile page, click **"Run AI Due Diligence"**.
4. The frontend will call `POST /enrich` on the backend, which will scrape the target URL to extract text, the site's favicon, and banner image.
5. The backend runs the text through the Gemini 2.5 Flash model and securely returns a structured summary, keywords, and detected signals without exposing the API key on the client.
6. To clean up your pipeline, click the trash icon on the main table row or on the company profile header to delete a target.

---

## Deployment Guide

This project is configured to be deployed with **Render** (Backend) and **Vercel** (Frontend).

### 1. Deploy the Backend (Render)
1. Push your repository to GitHub.
2. Create a **New Web Service** on Render.
3. Configure settings:
   - **Root Directory**: `backend`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `bash start.sh`
4. Add the `GEMINI_API_KEY` to your environment variables on Render.
5. Deploy and copy the live Render URL.

### 2. Deploy the Frontend (Vercel)
1. In Vercel, create a **New Project** and import your GitHub repository.
2. Configure settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite (should be auto-detected)
3. Add the `VITE_API_URL` to your environment variables on Vercel. **Set this to your live Render backend URL** (without a trailing slash, e.g., `https://vc-backend.onrender.com`).
4. Deploy the project. The frontend will automatically route requests to your hosted backend.
