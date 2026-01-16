# 🌍 Earth Online: SYSTEM LOG
> *Authentication Verified. Welcome back, Player.*

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Zeabur](https://zeabur.com/button.svg)
![Status](https://img.shields.io/badge/System-ONLINE-green)

**Earth Online: System Log** is a gamified personal dashboard and diary application designed with a diegetic "Cyberpunk / Survival" interface. It turns mundane daily logging into a high-stakes mission report, tracking your "vital signs" (stats) and archiving your memory fragments.

Built for the **Memu x Zeabur Hackathon 2026**.

---

## 📸 System Preview

*(Add screenshots here)*

## 🛸 Hackathon Track: Zeabur & Memu

This project participates in **Track 2**, focusing on:
- **Seamless Deployment**: Fully optimized for **Zeabur**'s serverless container platform.
- **Data Persistence**: MongoDB integration for persistent world-state storage.
- **Future AI Integration**: Architecture ready for **Mem0** memory layer injection (see Roadmap).

## 🛠️ Tech Stack

### Frontend (The HUD)
- **Framework**: React + Vite
- **Styling**: TailwindCSS (Custom "System" Design System)
- **UX**: Diegetic Interface, Typewriter effects, Bios Boot sequence

### Backend (The Core)
- **Runtime**: NestJS (Node.js)
- **Database**: MongoDB (via Mongoose)
- **Auth**: JWT-based secure uplink

---

## 🚀 One-Click Deployment

Deploy the entire Earth Online stack to Zeabur with a single click:

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates/URL_TO_YOUR_REPO)

*(Note: After forking, replace the URL above with your repository URL)*

### Manual Deployment

1. **Clone the Uplink**
   ```bash
   git clone https://github.com/your-username/earth-online-system-log.git
   ```

2. **Configure Environment**
   Zeabur will automatically detect the `frontend` and `backend` directories.
   - **Backend**: Requires a MongoDB Service.
   - **Variables**:
     - `MONGO_URI`: Connection string to your MongoDB.
     - `JWT_SECRET`: Secure key for session tokens.

---

## 🧬 Features

- **生物识别启动 (Bios Boot)**: Immersive startup sequence.
- **状态追踪 (Vitals Monitoring)**: Visual representation of HP (Health/Energy), MP (Mental/Mood), and XP (Experience).
- **记忆归档 (Log Archival)**: Categorized logging (Skill, Dream, Combat, etc.) with gamified rewards.
- **系统反馈 (System Feedback)**: Interactive system responses to your inputs.

## 🗺️ Roadmap (Mem0 Integration)

- [ ] **Phase 1**: Integrate `mem0` SDK to store user logs as vector embeddings.
- [ ] **Phase 2**: Replace static "System Feedback" with LLM-generated insights based on long-term user history.
- [ ] **Phase 3**: "Echoes" - The system proactively reminds you of past similar events.

---

## 🤝 Contributing

Transmission lines are open. PRs are welcome.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

*System Log End. Connection Terminated.*
