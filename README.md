# Fit Species 💪 – Complete Fitness & Nutrition Platform

**Fit Species** is a modern, mobile-responsive fitness platform designed to help users track workouts, monitor nutrition, manage hydration, and achieve their fitness goals through a comprehensive dashboard.

🔗 **Live App**: [https://thefitspecies.netlify.app](https://thefitspecies.netlify.app)

---

## 🚀 Features

- 🔐 **Authentication**
  - Secure Signup, Login, and Forgot Password flows

- 🏋️ **Workout Tracking**
  - Pre-built workout templates (Strength, HIIT, Flexibility)
  - Real-time workout timer and set tracking
  - Exercise progress monitoring
  - Workout history and analytics

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
  - Fitness milestone tracking
  - View completion streaks (coming soon)

- 🧠 **Planned Features**
  - Advanced workout builder
  - Personal trainer matching
  - Community challenges
  - Wearable device integration
  - Export to CSV/JSON

---

## 🧪 Tech Stack

- **Frontend**: React, Tailwind CSS  
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: Context API  
- **Routing**: React Router DOM  
- **Authentication**: Supabase Auth with email/password
- **Charts**: Recharts for data visualization
- **Deployment**: Netlify

---

## 🛠️ Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/fit-species.git
cd fit-species
npm install
npm run dev
```
Open http://localhost:5173 in your browser.


📁 Folder Structure
```bash
src/
├── components/
│   └── Layout, MealSection, NutritionChart, LoadingSpinner, etc.
├── pages/
│   └── Login, Signup, Dashboard, Workouts, Progress, Settings, etc.
├── context/
│   └── AuthContext, FoodContext, ThemeContext
├── data/
│   └── commonFoods.ts
├── utils/
├── assets/
└── App.tsx
```

✅ To-Do (Roadmap)
```
 Advanced workout builder
 Personal trainer booking system
 Community features and challenges
 Wearable device integration (Fitbit, Apple Watch)
 Social sharing and progress photos
 Data export (CSV / JSON / PDF)
 Mobile app development
```
