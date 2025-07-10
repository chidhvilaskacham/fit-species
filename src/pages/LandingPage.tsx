import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  "Every rep counts, every meal matters.",
  "Stronger today than yesterday."
];

const features = [
  {
    icon: Dumbbell,
    title: "Workout Tracking",
    description: "Pre-built templates, real-time timers, and progress monitoring",
    color: "from-red-500 to-orange-500"
  },
  {
    icon: Apple,
    title: "Nutrition Logging",
    description: "Track meals, calories, and macros with our extensive food database",
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

export default function LandingPage() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect border-b border-white/20 dark:border-neutral-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                The Fit Species
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-neutral-600 hover:text-orange-600 transition-colors font-medium">Features</a>
              <a href="#testimonials" className="text-neutral-600 hover:text-orange-600 transition-colors font-medium">Reviews</a>
              <a href="#contact" className="text-neutral-600 hover:text-orange-600 transition-colors font-medium">Contact</a>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-neutral-600 hover:text-orange-600 transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="p-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl shadow-2xl animate-glow">
                    <Activity className="h-16 w-16 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="h-8 w-8 text-yellow-400 animate-bounce" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-neutral-900 dark:text-white mb-6">
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  The Fit Species
                </span>
              </h1>
              
              <div className="h-16 mb-8">
                <p className="text-2xl sm:text-3xl text-neutral-600 dark:text-neutral-300 font-medium transition-all duration-500">
                  {motivationalQuotes[currentQuote]}
                </p>
              </div>
              
              <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Your complete wellness companion for tracking workouts, nutrition, hydration, and achieving your fitness goals. 
                Join thousands who've transformed their lives with our comprehensive platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-12 py-4 rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 flex items-center space-x-3"
                >
                  <span>Start Your Journey</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                
                <button className="flex items-center space-x-3 text-neutral-600 hover:text-orange-600 transition-colors font-medium text-lg">
                  <div className="p-3 bg-white/80 rounded-full shadow-lg">
                    <Play className="h-6 w-6" />
                  </div>
                  <span>Watch Demo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-neutral-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
              Everything You Need to <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Succeed</span>
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
              Comprehensive tools designed to support every aspect of your wellness journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-8 glass-effect rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-white/20 dark:border-neutral-700/30"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`p-4 bg-gradient-to-br ${feature.color} rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 mb-6 w-fit`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4 group-hover:text-orange-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
                Designed for <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Mobile-First</span> Experience
              </h2>
              <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed">
                Access your fitness data anywhere, anytime. Our responsive design ensures a seamless experience across all devices.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-lg font-medium text-neutral-700 dark:text-neutral-300">Real-time workout tracking</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-lg font-medium text-neutral-700 dark:text-neutral-300">Instant barcode food scanning</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-lg font-medium text-neutral-700 dark:text-neutral-300">Comprehensive progress analytics</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 p-8 rounded-3xl shadow-2xl">
                  <div className="bg-white rounded-2xl p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
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
                        <div className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full w-4/5"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-200/20 to-red-200/20 rounded-3xl blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-neutral-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
              Loved by <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Thousands</span>
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300">
              See what our community has to say about their transformation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-8 glass-effect rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20 dark:border-neutral-700/30"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-bold text-neutral-900 dark:text-white">{testimonial.name}</p>
                  <p className="text-neutral-500 dark:text-neutral-400">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-effect rounded-3xl p-12 shadow-2xl border border-white/20 dark:border-neutral-700/30">
            <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
              Ready to Transform Your <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Life?</span>
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-8">
              Join thousands of users who've already started their fitness journey with The Fit Species
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/signup"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-12 py-4 rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center space-x-3"
              >
                <span>Start Free Today</span>
                <ChevronRight className="h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="border-2 border-orange-200 dark:border-orange-700 text-orange-600 dark:text-orange-400 px-12 py-4 rounded-2xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all font-bold text-lg"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <span className="text-2xl font-bold">The Fit Species</span>
              </div>
              <p className="text-neutral-300 mb-6 leading-relaxed max-w-md">
                Empowering your fitness journey with comprehensive tracking, personalized insights, and community support.
              </p>
              <div className="flex items-center space-x-4">
                <a href="https://github.com" className="p-3 bg-neutral-800 rounded-xl hover:bg-neutral-700 transition-colors">
                  <Github className="h-6 w-6" />
                </a>
                <a href="mailto:hello@thefitspecies.com" className="p-3 bg-neutral-800 rounded-xl hover:bg-neutral-700 transition-colors">
                  <Mail className="h-6 w-6" />
                </a>
                <a href="#" className="p-3 bg-neutral-800 rounded-xl hover:bg-neutral-700 transition-colors">
                  <Globe className="h-6 w-6" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Product</h4>
              <ul className="space-y-2 text-neutral-300">
                <li><a href="#features" className="hover:text-orange-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">API</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Mobile App</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Support</h4>
              <ul className="space-y-2 text-neutral-300">
                <li><a href="#" className="hover:text-orange-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a></li>
                <li><a href="#contact" className="hover:text-orange-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-800 mt-12 pt-8 text-center">
            <p className="text-neutral-400">
              © 2024 The Fit Species. All rights reserved. Built with ❤️ for your wellness journey.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}