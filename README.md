# 🌍 Earth Online SYSTEM LOG

> **"Even if nothing is completed, the System acknowledges your existence."**

![Project Banner](https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)

## 📡 The Concept: Archive Your Existence

**Earth Online** is not just a journal; it is a **System Log for the MMORPG called Life**.

In this simulation we call reality, players often feel their daily efforts vanish into the void. **SYSTEM LOG** changes that. It transforms your life events—failures, bugs, achievements, and mundane loops—into permanent, immutable system records.

### 🎯 Strategic Positioning

- **Not just a diary**: It's not about "what I did today."
- **But a System Log**: It's about "Player [You] interacting with the World Server."

**Earth Online Log = Player Archive + Quest Journal + Emotional Telemetry**

### 👤 Core User Profile

This system is built for the **"Players"**:

- Who view life through a gamified lens.
- Who accept bugs (failures), glitches (absurdity), and negative status effects.
- Who reject toxic positivity and crave **raw, unfiltered data recording**.
- Who need to feel that their existence is being **"witnessed" by the System**.

> **"Earth Online's logs are not for recording life, but to make players believe: Even if nothing is completed, the System acknowledges you existed."**

---

## 🚀 Hackathon Submission

**Event**: Zeabur "Ship It" Hackathon
**Track**: Track 2 (Full Stack)
**Deployment Platform**: [Zeabur](https://zeabur.com)

This project demonstrates a seamless full-stack deployment on Zeabur, leveraging its powerful containerization and networking capabilities to host a NestJS backend, a React frontend, and a MongoDB database with zero configuration hassle.

---

## 🎮 Live Demo

Experience the system directly in your browser:
**🔗 [Live URL](https://earth-online-system-log.zeabur.app/)**

### 🔑 Tourist Access

To explore the system without registration, use the dedicated guest access:

- **Account**: `tourist`
- **Password**: `123456`

---

## 📖 About The Project

**Earth Online SYSTEM LOG** is an immersive, cyberpunk-themed personal life logger designed for the "players" of Earth Online. It treats daily life events as system logs, allowing users to track their "gameplay" stats, memory fragments, and vital signs in a high-tech interface.

Unlike traditional journaling apps, SYSTEM LOG provides a gamified, terminal-like experience that makes the mundane feel extraordinary.

### ✨ Key Features

- **📺 Cyberpunk Interface**: A fully immersive, dark-mode UI with terminal aesthetics, glowing accents, and animated transitions.
- **📝 Live Log Recording**: Real-time log creation with instant "Kernel Trace" previews.
- **📊 Vitals Monitoring**: Track environmental data (Weather), internal state (Mood), and power levels (Energy) for every entry.
- **🤖 System Feedback**: Receive automated, AI-style feedback from the "Core System" based on your log content and status (e.g., "Energy Critical", "Skill Acquired").
- **🌐 Internationalization**: Native support for English and Chinese (Simplified), dynamically switchable.
- **🔍 Advanced Filtering**: Search and filter memory logs by category, type, or date range.
- **🔒 Secure Authentication**: JWT-based authentication system with encrypted storage.

---

## 🛠 Tech Stack

### Frontend

- **Framework**: React 18 (Vite)
- **Styling**: TailwindCSS (Custom Cyberpunk Config)
- **Icons**: Lucide React
- **I18n**: i18next

### Backend

- **Framework**: NestJS (Node.js)
- **Database**: MongoDB (Mongoose)
- **Auth**: Passport.js + JWT
- **Security**: BCrypt

### Infrastructure (Zeabur)

- **Database Service**: MongoDB on Zeabur
- **Backend Service**: Dockerized NestJS Application
- **Frontend Service**: Dockerized React Application
- **CI/CD**: Automatic deployment triggered via GitHub Webhooks to Zeabur

---

## ☁️ Deployment on Zeabur

This project takes full advantage of Zeabur's ecosystem:

1.  **One-Click DB**: The MongoDB instance is provisioned instantly via Zeabur's marketplace.
2.  **Private Networking**: The Backend service communicates with the Database via Zeabur's internal private network, ensuring security and low latency.
3.  **Automatic CI/CD**: Every push to the `master` branch automatically triggers a build and redeploy for both frontend and backend services.
4.  **Domain Management**: Automatic SSL termination and domain routing for the frontend application.

---

## ⚡ Getting Started (Local)

If you wish to run the system locally:

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas URI)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/earth-online-system-log.git
cd earth-online-system-log
```

### 2. Backend Setup

```bash
cd backend
npm install
# Create .env file
echo "MONGO_URI=mongodb://localhost:27017/earth-online" > .env
echo "JWT_SECRET=your_secret_key" >> .env
npm run start:dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to access the system.

---

## 📄 License

This project is open-sourced under the MIT License.

---

> _System Status: ONLINE. Logging protocols initialized._
