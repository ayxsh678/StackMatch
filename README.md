# 🧠 AI Skill Gap Analyzer

An AI-powered career intelligence tool that analyzes your current skills and maps the exact gaps standing between you and your dream role.

![AI Skill Gap Analyzer](https://img.shields.io/badge/Powered%20by-Groq%20LLaMA%203.3-00e5ff?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-MIT-7c3aed?style=for-the-badge)

---

## ✨ Features

- **Readiness Score** — Get a 0–100 score showing how ready you are for your target role
- **Skill Breakdown** — Animated bars comparing your current vs target skill levels
- **Radar Chart** — Visual overview of your entire skill profile at a glance
- **Top Strengths & Critical Gaps** — Know exactly what to highlight and what to fix
- **3-Phase Learning Roadmap** — Actionable steps for 0–3, 3–6, and 6–12 months
- **Salary Impact Estimate** — Understand the financial value of closing your skill gaps
- **12 Role Options** — Frontend, Backend, ML Engineer, DevOps, Product Manager, and more

---

## 🚀 Live Demo

👉 [View Live App](https://skill-gap-analyzer-delta.vercel.app)

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | Frontend UI |
| Groq API | AI inference engine |
| LLaMA 3.3 70B | Language model for analysis |
| CSS-in-JS | Styling |
| GitHub Pages | Deployment |

---

## 📦 Getting Started

### Prerequisites
- Node.js v16+
- A free [Groq API key](https://console.groq.com)

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/skill-gap-analyzer.git
cd skill-gap-analyzer

# Install dependencies
npm install

# Start the development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Adding your API Key

Open `src/SkillGapAnalyzer.jsx` and find line 226. Replace the API key with your own Groq key:

```js
"Authorization": "Bearer YOUR_GROQ_API_KEY_HERE"
```

Get your free key at [console.groq.com](https://console.groq.com).

---

## 🚢 Deployment

Deploy to GitHub Pages with one command:

```bash
npm run deploy
```

Make sure your `package.json` has:

```json
"homepage": "https://yourusername.github.io/skill-gap-analyzer",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

---

## 🎯 How to Use

1. Select your **Target Role** (e.g. ML Engineer, Frontend Engineer)
2. Choose your **Target Level** (Junior → Director)
3. Describe your **Current Skills & Experience**
4. Optionally add years of experience and career goals
5. Click **Analyze My Skill Gaps**
6. Get your full AI-powered career report in seconds!

---

## 📁 Project Structure

```
my-skill-app/
├── public/
│   └── index.html
├── src/
│   ├── App.js               # Root component
│   ├── SkillGapAnalyzer.jsx # Main app component
│   └── index.js             # Entry point
├── package.json
└── README.md
```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 📄 License

MIT © [Ayush Verma](https://github.com/ayxsh678)

---

## 🙏 Acknowledgements

- [Groq](https://groq.com) for the blazing fast free API
- [Meta LLaMA](https://llama.meta.com) for the language model
- Built with ❤️ using React
