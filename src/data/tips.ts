export const nutritionTips = [
  "Start your day with a protein-rich breakfast to boost metabolism and reduce cravings.",
  "Drink a glass of water before each meal to help with portion control and hydration.",
  "Include colorful vegetables in every meal for maximum nutrient density.",
  "Eat slowly and mindfully to improve digestion and recognize fullness cues.",
  "Plan your meals ahead to avoid impulsive food choices.",
  "Choose whole grains over refined grains for sustained energy.",
  "Include healthy fats like avocados, nuts, and olive oil in your diet.",
  "Aim for 5-7 servings of fruits and vegetables daily.",
  "Don't skip meals - it can lead to overeating later.",
  "Read nutrition labels to make informed food choices.",
  "Cook more meals at home to control ingredients and portions.",
  "Stay hydrated - sometimes thirst is mistaken for hunger.",
  "Include lean protein sources in every meal to maintain muscle mass.",
  "Limit processed foods and focus on whole, natural ingredients.",
  "Practice portion control by using smaller plates and bowls.",
  "Eat a variety of foods to ensure you get all essential nutrients.",
  "Time your carbohydrate intake around your workouts for optimal energy.",
  "Include probiotic foods like yogurt and kefir for gut health.",
  "Don't eliminate entire food groups unless medically necessary.",
  "Listen to your body's hunger and fullness signals.",
];

export const motivationalQuotes = [
  "You are what you do, not what you say you'll do.",
  "Progress, not perfection, is the goal.",
  "Every healthy choice is a step toward a better you.",
  "Your body can do it. It's your mind you need to convince.",
  "Consistency beats perfection every time.",
  "Small changes lead to big results.",
  "Invest in yourself - you're worth it.",
  "The best time to start was yesterday. The second best time is now.",
  "Your health is an investment, not an expense.",
  "Believe in yourself and all that you are capable of achieving.",
  "Success is the sum of small efforts repeated daily.",
  "You don't have to be perfect, just consistent.",
  "Every workout, every healthy meal, every good choice matters.",
  "Your future self will thank you for the choices you make today.",
  "Strength doesn't come from what you can do, but from overcoming what you thought you couldn't.",
  "The only bad workout is the one that didn't happen.",
  "Your body is your temple. Keep it pure and clean for the soul to reside in.",
  "Health is not about the weight you lose, but about the life you gain.",
  "Take care of your body. It's the only place you have to live.",
  "A healthy outside starts from the inside.",
  "Fitness is not about being better than someone else. It's about being better than you used to be.",
  "The groundwork for all happiness is good health.",
  "Your health account is your most important asset.",
  "Make yourself a priority. At the end of the day, you're your longest commitment.",
  "The first wealth is health.",
];

export const getDailyTip = (): string => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return nutritionTips[dayOfYear % nutritionTips.length];
};

export const getDailyQuote = (): string => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return motivationalQuotes[dayOfYear % motivationalQuotes.length];
};