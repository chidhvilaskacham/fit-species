## fit-species
# The Fit Species 🥗 – Smart Nutrition & Wellness Tracker

**The Fit Species** is a modern, mobile-responsive web app designed to help users monitor their daily nutrition, hydration, and health goals through a streamlined dashboard.

🔗 **Live App**: [https://thefitspecies.netlify.app](https://thefitspecies.netlify.app)

---

## 🚀 Features

- 🔐 **Authentication**
  - Secure Signup, Login, and Forgot Password flows

- 🍽️ **Meal Logging**
  - Add food to Breakfast, Lunch, Dinner, and Snacks
  - Track calories and macronutrients (Protein, Carbs, Fat)

- 📊 **Nutrition Summary**
  - Daily calorie goal tracking
  - Visual macro breakdown (g and %)

- 💧 **Hydration Tracker**
  - Log daily water intake
  - Monitor against hydration goals

- 📈 **Progress Tracking**
  - Weight log with trend charts
  - Daily/weekly performance insights

- 🎯 **Goal Setting**
  - Custom calorie and weight goals
  - View completion streaks (coming soon)

- 🧠 **Planned Features**
  - Barcode scanner
  - Food inventory search
  - AI food image detection
  - Export to CSV/JSON

---

## 🧪 Tech Stack

- **Frontend**: React, Tailwind CSS  
- **State Management**: Context API  
- **Routing**: React Router DOM  
- **Authentication**: Form validation + localStorage mock  
- **Deployment**: Netlify

---

## 🖼️ Screenshots

> _[Add screenshots to the `/screenshots/` folder and link them here]_

- ![Login Page](./screenshots/login.png)
- ![Dashboard](./screenshots/dashboard.png)
- ![Progress Page](./screenshots/progress.png)

---

## 🛠️ Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/the-fit-species.git
cd the-fit-species
npm install
npm run dev
```
Open http://localhost:5173 in your browser.


📁 Folder Structure
```bash
src/
├── components/
│   └── Header, Card, MealInput, HydrationTracker, etc.
├── pages/
│   └── Login, Signup, Dashboard, Progress
├── context/
│   └── AuthContext.js, AppContext.js
├── utils/
├── assets/
└── App.jsx
```

✅ To-Do (Roadmap)
```
 Barcode scanning input
 AI food image recognition
 Food inventory integration
 Google sign-in
 Data export (CSV / JSON / PDF)
 Backend (Supabase/Firebase/Express)
```
