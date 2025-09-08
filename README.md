MCA e-Consultation Analysis Tool 🇮🇳
An AI-powered web application designed to analyze public feedback on draft legislations for the Ministry of Corporate Affairs (MoCA). This tool provides deep, actionable insights from thousands of comments, saving countless hours of manual work and enabling data-driven policy making.

✨ Key Features
This tool goes beyond simple analysis and provides a multi-layered intelligence report:

🧠 Advanced Sentiment Analysis
Overall Sentiment: Get a high-level overview (Positive vs. Negative %) of the public mood.

Aspect-Based Sentiment: Understand sentiment for specific topics like "Cost" or "Timeline".

Emotion Analysis: Uncover the emotions (Anger, Fear, Joy) behind the comments for deeper context.

Contradiction Detector: Automatically finds high-value comments with mixed opinions.

📄 Intelligent Summarization
Executive Summary: An AI-generated summary of the entire feedback.

Thematic Summaries: Get summaries for each specific topic identified in the comments.

Notable Summaries: Auto-summaries for the longest, most detailed comments.

📊 Interactive Visualizations
Dynamic Word Clouds: Explore keywords with sentiment-based color coding (Overall, Positive, Negative views).

Insight Graph: A unique node-based graph that visualizes the complex relationships between Stakeholders, Topics, and their Sentiments.

Stakeholder Analysis: Identifies feedback patterns from different groups like 'Business Owners', 'Lawyers', etc.

💻 Modern UI/UX
Clean, professional interface inspired by official government portals.

Full Light & Dark Mode support.

One-click PDF report generation for any analysis tab.

🛠️ Tech Stack
Frontend: React, Vite, Tailwind CSS, Recharts, React Flow, Framer Motion

Backend: Python, Flask

AI/ML: Hugging Face Transformers, NLTK

🚀 Getting Started (for Windows)
Follow these instructions to set up and run the project on your local machine.

Prerequisites
Make sure you have the following software installed:

Node.js (v18 or higher)

Python (v3.9 or higher)

Git

Installation & Setup
Important: You will need two separate terminals (like Command Prompt or PowerShell) open at the same time: one for the Backend and one for the Frontend.

1. Clone the Repository
First, open a terminal and clone the project from GitHub.

```
git clone https://github.com/AkshatSharma555/mca-analyzer.git
cd mca-analyzer
```
2. Backend Setup (Terminal 1)
Navigate to Backend Directory:

```
cd backend
```
Create Python Virtual Environment:
```
python -m venv venv
```
Activate Virtual Environment:

```
venv\Scripts\activate
```
(You should see (venv) at the start of your terminal prompt now.)

Install Python Packages:

```
pip install -r requirements.txt
```
Create Environment File:

Create a new file named .env inside the backend folder.

Open the .env file and add the following line to run the full analysis:

DEV_MODE=False

Run the Backend Server:

```
python run.py
```

Your backend server should now be running on http://127.0.0.1:5000. Keep this terminal running.

3. Frontend Setup (Terminal 2)
Open a new, second terminal and navigate to the project's root folder (mca-analyzer).

Navigate to Frontend Directory:
```
cd frontend
```
Install Node.js Packages:
```
npm install
```
Run the Frontend Server:
```
npm run dev
```
Your terminal will show you a URL, usually http://localhost:5173.

4. You're All Set! 🎉
Open your web browser and go to the frontend URL (e.g., http://localhost:5173). The application should be running. Remember, both the backend and frontend terminals must remain open.
