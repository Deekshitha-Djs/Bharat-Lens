# 🇮🇳 BharatLens

**BharatLens** is an AI-powered legal awareness platform designed to help users understand their rights in real-world situations.
It combines an interactive UI, a cinematic intro experience, and backend logic to deliver an engaging and informative tool.
It is available in kannada, english and hindi.
---

## ✨ Features

* 🎬 **Cinematic Intro Experience**
  Immersive entry animation before accessing the app

* ⚖️ **Legal Awareness Interface**
  Simple UI to explore rights and scenarios

* 🧠 **Backend Support**
  Node.js-powered backend for handling logic and APIs

* 🔍 **AI Assistance (Planned/Integrated)**
  Helps users understand legal rights in different situations

---

## 📁 Project Structure

```
Bharat-Lens/
│
├── backend/        # Node.js server
├── frontend/       # UI (HTML / React / Vite)
├── functions/      # Firebase / cloud functions (if used)
│
├── cinematic_intro.html   # Entry animation
├── bharatlens_demo.html   # Main UI
├── ui_mockups.html        # UI previews
├── README.md
```

---

## ⚙️ Setup & Run Locally

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Deekshitha-Djs/Bharat-Lens.git
cd Bharat-Lens
```

---

### 2️⃣ Start Backend

```bash
cd backend
npm install
node server.js
```

Server will run on:

```
http://localhost:5000
```

---

### 3️⃣ Open Frontend

Open in browser:

```
cinematic_intro.html
```

👉 This will:

* Play intro animation
* Redirect to main UI

---

## ⚠️ Important Notes

* Do **not upload**:

  * `node_modules/`
  * `.env` files

* Install dependencies using:

```bash
npm install
```

---

## 🚀 Future Improvements

* 🌐 Deploy as a live web app
* 🤖 Enhance AI legal assistance
* 📱 Mobile responsiveness
* 🔐 Authentication system

---

## 👩‍💻 Author

**Deekshitha J**
GitHub: https://github.com/Deekshitha-Djs

---

## 📜 License

This project is for educational and development purposes.
