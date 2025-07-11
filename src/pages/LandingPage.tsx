import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Activity, 
  Smartphone, 
  BarChart3, 
  Target, 
  Users, 
  Zap, 
  Heart,
  Droplets,
  Dumbbell,
  Apple,
  Camera,
  TrendingUp,
  Shield,
  Globe,
  Github,
  Mail,
  ChevronRight,
  Star,
  Play,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const motivationalQuotes = [
  "Track. Nourish. Thrive.",
  "Your fitness journey starts here.",
  "Transform your body, transform your life.",
  "Every healthy choice is a step toward a better you.",
  "Stronger today than yesterday."
];

const features = [
  {
    icon: Apple,
    title: "Smart Nutrition Tracking",
    description: "Log meals with our extensive food database and barcode scanner",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Camera,
    title: "Barcode Scanner",
    description: "Instantly log food by scanning product barcodes",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Droplets,
    title: "Hydration Tracking",
    description: "Monitor daily water intake and stay properly hydrated",
    color: "from-cyan-500 to-blue-500"
  },
  {
    icon: Dumbbell,
    title: "Workout Tracking",
    description: "Pre-built templates, real-time timers, and progress monitoring",
    color: "from-red-500 to-orange-500"
  },
  {
    icon: TrendingUp,
    title: "Progress Analytics",
    description: "Visualize your fitness journey with detailed charts and insights",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Target,
    title: "Goal Setting",
    description: "Set and track personalized fitness and nutrition goals",
    color: "from-orange-500 to-red-500"
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Fitness Enthusiast",
    content: "The Fit Species has completely transformed how I approach fitness. The workout tracking is incredible!",
    rating: 5
  },
  {
    name: "Mike Chen",
    role: "Personal Trainer",
    content: "I recommend this app to all my clients. The nutrition tracking and barcode scanner are game-changers.",
    rating: 5
  },
  {
    name: "Emma Davis",
    role: "Busy Professional",
    content: "Finally, an app that makes healthy living simple. The daily tips keep me motivated!",
    rating: 5
  }
];

const howItWorksSteps = [
  {
    step: 1,
    title: "Set Your Goals",
    description: "Tell us about your fitness goals and preferences",
    icon: Target
  },
  {
    step: 2,
    title: "Track Everything",
    description: "Log meals, workouts, and hydration with ease",
    icon: Activity
  },
  {
    step: 3,
    title: "See Progress",
    description: "Watch your transformation with detailed analytics",
    icon: TrendingUp
  }
];

export default function LandingPage() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = prefersReducedMotion ? {} : {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = prefersReducedMotion ? {} : {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 via-sky-50 to-cyan-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 w-full z-50 glass-effect border-b border-white/20 dark:border-neutral-700/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="p-2 bg-gradient-to-br from-mint-500 to-sky-500 rounded-2xl shadow-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-mint-600 to-sky-600 bg-clip-text text-transparent">
                The Fit Species
              </span>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-neutral-600 hover:text-mint-600 transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="text-neutral-600 hover:text-mint-600 transition-colors font-medium">How It Works</a>
              <a href="#testimonials" className="text-neutral-600 hover:text-mint-600 transition-colors font-medium">Reviews</a>
              <a href="#contact" className="text-neutral-600 hover:text-mint-600 transition-colors font-medium">Contact</a>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-neutral-600 hover:text-mint-600 transition-colors font-medium"
              >
                Sign In
              </Link>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-mint-500 to-sky-500 text-white px-6 py-2 rounded-xl hover:from-mint-600 hover:to-sky-600 transition-all font-medium shadow-lg hover:shadow-xl"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <div className="flex justify-center mb-8">
                <motion.div 
                  className="relative"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="p-8 bg-gradient-to-br from-mint-500 to-sky-500 rounded-3xl shadow-2xl">
                    <Activity className="h-16 w-16 text-white" />
                  </div>
                  <motion.div 
                    className="absolute -top-2 -right-2"
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 15, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="h-8 w-8 text-yellow-400" />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-neutral-900 dark:text-white mb-6"
            >
              <span className="bg-gradient-to-r from-mint-600 to-sky-600 bg-clip-text text-transparent">
                The Fit Species
              </span>
            </motion.h1>
            
            <motion.div 
              variants={itemVariants}
              className="h-16 mb-8"
            >
              <motion.p 
                key={currentQuote}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-2xl sm:text-3xl text-neutral-600 dark:text-neutral-300 font-medium"
              >
                {motivationalQuotes[currentQuote]}
              </motion.p>
            </motion.div>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl text-neutral-600 dark:text-neutral-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Your complete wellness companion for tracking nutrition, workouts, hydration, and achieving your fitness goals. 
              Join thousands who've transformed their lives with our comprehensive platform.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-mint-500 to-sky-500 text-white px-12 py-4 rounded-2xl hover:from-mint-600 hover:to-sky-600 transition-all font-bold text-lg shadow-2xl hover:shadow-3xl flex items-center space-x-3"
                >
                  <span>Start Your Journey</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
              
              <motion.button 
                className="flex items-center space-x-3 text-neutral-600 hover:text-mint-600 transition-colors font-medium text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="p-3 bg-white/80 rounded-full shadow-lg">
                  <Play className="h-6 w-6" />
                </div>
                <span>Watch Demo</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-neutral-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
              Everything You Need to <span className="bg-gradient-to-r from-mint-600 to-sky-600 bg-clip-text text-transparent">Succeed</span>
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
              Comprehensive tools designed to support every aspect of your wellness journey
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                  className="group p-8 glass-effect rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-neutral-700/30"
                >
                  <motion.div 
                    className={`p-4 bg-gradient-to-br ${feature.color} rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 mb-6 w-fit`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4 group-hover:text-mint-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
              How It <span className="bg-gradient-to-r from-mint-600 to-sky-600 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
              Get started in three simple steps
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {howItWorksSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center relative"
                >
                  <motion.div 
                    className="relative mb-6"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-mint-500 to-sky-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {step.step}
                    </div>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {step.description}
                  </p>
                  {index < howItWorksSteps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-full w-full">
                      <motion.div 
                        className="w-full h-0.5 bg-gradient-to-r from-mint-300 to-sky-300"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-neutral-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
                Designed for <span className="bg-gradient-to-r from-mint-600 to-sky-600 bg-clip-text text-transparent">Mobile-First</span> Experience
              </h2>
              <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed">
                Access your wellness data anywhere, anytime. Our responsive design ensures a seamless experience across all devices.
              </p>
              
              <div className="space-y-6">
                {[
                  "Real-time nutrition tracking",
                  "Instant barcode food scanning",
                  "Comprehensive progress analytics",
                  "Daily motivation and tips"
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <span className="text-lg font-medium text-neutral-700 dark:text-neutral-300">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="relative z-10"
                animate={prefersReducedMotion ? {} : { 
                  y: [0, -10, 0],
                  rotate: [0, 2, 0]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="bg-gradient-to-br from-mint-500 to-sky-500 p-8 rounded-3xl shadow-2xl">
                  <div className="bg-white rounded-2xl p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-mint-400 to-sky-500 rounded-full flex items-center justify-center">
                        <Activity className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-neutral-900">Today's Progress</h4>
                        <p className="text-neutral-600 text-sm">Keep up the great work!</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Calories</span>
                        <span className="font-bold">1,847 / 2,200</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <motion.div 
                          className="bg-gradient-to-r from-mint-400 to-sky-500 h-2 rounded-full"
                          initial={prefersReducedMotion ? { width: "80%" } : { width: 0 }}
                          whileInView={prefersReducedMotion ? {} : { width: "80%" }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-br from-mint-200/20 to-sky-200/20 rounded-3xl blur-xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
              Loved by <span className="bg-gradient-to-r from-mint-600 to-sky-600 bg-clip-text text-transparent">Thousands</span>
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300">
              See what our community has to say about their transformation
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="p-8 glass-effect rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-neutral-700/30"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-bold text-neutral-900 dark:text-white">{testimonial.name}</p>
                  <p className="text-neutral-500 dark:text-neutral-400">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-neutral-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            className="glass-effect rounded-3xl p-12 shadow-2xl border border-white/20 dark:border-neutral-700/30"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
              Ready to Transform Your <span className="bg-gradient-to-r from-mint-600 to-sky-600 bg-clip-text text-transparent">Life?</span>
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-8">
              Join thousands of users who've already started their wellness journey with The Fit Species
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-mint-500 to-sky-500 text-white px-12 py-4 rounded-2xl hover:from-mint-600 hover:to-sky-600 transition-all font-bold text-lg shadow-2xl hover:shadow-3xl flex items-center justify-center space-x-3"
                >
                  <span>Start Free Today</span>
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="border-2 border-mint-200 dark:border-mint-700 text-mint-600 dark:text-mint-400 px-12 py-4 rounded-2xl hover:bg-mint-50 dark:hover:bg-mint-900/20 transition-all font-bold text-lg"
                >
                  Sign In
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <motion.div 
                className="flex items-center space-x-3 mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="p-3 bg-gradient-to-br from-mint-500 to-sky-500 rounded-2xl shadow-lg">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <span className="text-2xl font-bold">The Fit Species</span>
              </motion.div>
              <p className="text-neutral-300 mb-6 leading-relaxed max-w-md">
                Empowering your wellness journey with comprehensive tracking, personalized insights, and community support.
              </p>
              <div className="flex items-center space-x-4">
                <motion.a 
                  href="https://github.com" 
                  className="p-3 bg-neutral-800 rounded-xl hover:bg-neutral-700 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Github className="h-6 w-6" />
                </motion.a>
                <motion.a 
                  href="mailto:hello@thefitspecies.com" 
                  className="p-3 bg-neutral-800 rounded-xl hover:bg-neutral-700 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Mail className="h-6 w-6" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="p-3 bg-neutral-800 rounded-xl hover:bg-neutral-700 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Globe className="h-6 w-6" />
                </motion.a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Product</h4>
              <ul className="space-y-2 text-neutral-300">
                <li><a href="#features" className="hover:text-mint-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-mint-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-mint-400 transition-colors">API</a></li>
                <li><a href="#" className="hover:text-mint-400 transition-colors">Mobile App</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Support</h4>
              <ul className="space-y-2 text-neutral-300">
                <li><a href="#" className="hover:text-mint-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-mint-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-mint-400 transition-colors">Terms of Service</a></li>
                <li><a href="#contact" className="hover:text-mint-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <motion.div 
            className="border-t border-neutral-800 mt-12 pt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-neutral-400">
              © 2024 The Fit Species. All rights reserved. Built with ❤️ for your wellness journey.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}