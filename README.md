# 🌍 Earth Online: SYSTEM LOG

> *Authentication Verified. Welcome back, Player.*

![Zeabur Deployment](https://zeabur.com/button.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/System-ONLINE-green)
![Security](https://img.shields.io/badge/Encryption-AES256-lock)

**Earth Online: System Log** is a gamified personal dashboard and diary application designed with a diegetic "Cyberpunk / Survival" interface. It turns mundane daily logging into a high-stakes mission report, tracking your "vital signs" (stats), archiving your memory fragments, and calculating your "Frame" (time alive) in the game of life.

---

## 🏆 Hackathon Submission
**Event:** 2026 New Year Challenge - 5 Projects United Hackathon
**Track:** Track 2 (Creative / Deployment)
**Platform:** Zeabur

This project is a submission for **Track 2**, demonstrating the power of **Zeabur** for full-stack application deployment. We leverage Zeabur's seamless containerization, managed MongoDB service, and GitHub CI/CD integration to host a complex, secure, and persistent application with zero DevOps overhead.

---

## 📸 System Interface

> *Visual logs corrupted. Please run locally to view the HUD.* (Add screenshots here)

---

## 🧬 Key Features

### 1. Immersive "Earth Online" HUD
- **Bios Boot Sequence**: A nostalgic, sci-fi boot-up animation every time you log in.
- **Diegetic UI**: Interactive elements that feel like a futuristic operating system, complete with typewriter text effects and CRT scanlines.
- **HUD Stats**: Real-time visualization of your "Player Stats" (Health, Mood, Energy) tracked alongside your logs.

### 2. Gamified Life Logging
- **Rich Log Categories**: Record your life events as:
  - **System**: Maintenance and routine checks.
  - **Life Event**: Major milestones and achievements (Main Quest).
  - **Daily Task**: Side quests and routine operations.
  - **Challenge**: Combat logs for struggles and conflicts.
  - **Environment**: Weather and world events.
- **Frame Calculation**: Automatically calculates your "Current Frame" based on your birth date, treating time as a precise render cycle.

### 3. Enterprise-Grade Security
- **AES-256 Encryption**: All sensitive log content is encrypted at rest using AES-256 before being stored in the database. Only the player with the correct access rights can decrypt and view the logs.
- **JWT Authentication**: Secure, stateless authentication flow protecting the uplink.

### 4. Modern Tech Stack
- **Frontend**: React 18, Vite, TailwindCSS (Custom Design System).
- **Backend**: NestJS (Scalable Node.js framework).
- **Database**: MongoDB (Persistent world state).

---

## ☁️ Deployed on Zeabur

This project is fully optimized for **Zeabur**'s ecosystem:

1. **Serverless Containers**: Frontend and Backend are automatically detected and deployed as serverless containers.
2. **Managed Database**: Utilizes Zeabur's one-click MongoDB service for data persistence.
3. **CI/CD Pipeline**: 
   - Code is pushed to GitHub.
   - Zeabur automatically triggers a build.
   - New "System Versions" are deployed live within seconds.

---

## 🚀 Getting Started

### One-Click Deployment

You can deploy your own instance of Earth Online System Log directly to Zeabur:

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates/URL_TO_YOUR_REPO)

### Local Development

**Prerequisites:**
- Node.js (v18+)
- MongoDB (Local or Atlas)

**1. Clone the Uplink**
```bash
git clone https://github.com/your-username/earth-online-system-log.git
cd earth-online-system-log
```

**2. Backend Setup**
```bash
cd backend
npm install
# Create .env file
echo "MONGO_URI=mongodb://localhost:27017/earth-online" > .env
echo "JWT_SECRET=your_super_secret_key" >> .env
echo "ENCRYPTION_KEY=your_32_byte_hex_key" >> .env
npm run start:dev
```

**3. Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

**4. Access the System**
Open `http://localhost:5173` (or your configured port) to initialize the interface.

---

## 🗺️ Roadmap

- [ ] **AI Core Injection**: Integrate `Mem0` for semantic memory retrieval.
- [ ] **Multi-Player Sync**: Allow "Co-op" missions with other players.
- [ ] **Mobile Uplink**: PWA support for field operations.

---

## 🤝 Contributing

Transmission lines are open. PRs are welcome.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewModule`)
3. Commit your Changes (`git commit -m 'feat: Add NewModule'`)
4. Push to the Branch (`git push origin feature/NewModule`)
5. Open a Pull Request

---

*System Log End. Connection Terminated.*
