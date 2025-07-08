import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Clock, Flame, Target, Trophy, Dumbbell, Timer, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConnected } from '../lib/supabase';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface WorkoutSession {
  id: string;
  user_id: string;
  workout_type: string;
  duration_minutes: number;
  calories_burned: number;
  exercises: Exercise[];
  date: string;
  created_at: string;
}

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration_seconds?: number;
  rest_seconds: number;
}

const workoutTemplates = [
  {
    name: 'Upper Body Strength',
    type: 'strength',
    duration: 45,
    exercises: [
      { name: 'Push-ups', sets: 3, reps: 12, rest_seconds: 60 },
      { name: 'Pull-ups', sets: 3, reps: 8, rest_seconds: 90 },
      { name: 'Dumbbell Press', sets: 3, reps: 10, weight: 25, rest_seconds: 90 },
      { name: 'Rows', sets: 3, reps: 12, weight: 20, rest_seconds: 60 },
      { name: 'Shoulder Press', sets: 3, reps: 10, weight: 15, rest_seconds: 60 },
    ],
    icon: '💪',
    color: 'from-red-500 to-orange-500'
  },
  {
    name: 'HIIT Cardio',
    type: 'cardio',
    duration: 30,
    exercises: [
      { name: 'Burpees', sets: 4, reps: 10, rest_seconds: 30 },
      { name: 'Mountain Climbers', sets: 4, duration_seconds: 30, rest_seconds: 30 },
      { name: 'Jump Squats', sets: 4, reps: 15, rest_seconds: 30 },
      { name: 'High Knees', sets: 4, duration_seconds: 30, rest_seconds: 30 },
      { name: 'Plank', sets: 3, duration_seconds: 45, rest_seconds: 60 },
    ],
    icon: '🔥',
    color: 'from-orange-500 to-red-500'
  },
  {
    name: 'Lower Body Power',
    type: 'strength',
    duration: 50,
    exercises: [
      { name: 'Squats', sets: 4, reps: 12, weight: 30, rest_seconds: 90 },
      { name: 'Deadlifts', sets: 4, reps: 8, weight: 40, rest_seconds: 120 },
      { name: 'Lunges', sets: 3, reps: 10, rest_seconds: 60 },
      { name: 'Calf Raises', sets: 3, reps: 15, weight: 20, rest_seconds: 45 },
      { name: 'Leg Press', sets: 3, reps: 12, weight: 50, rest_seconds: 90 },
    ],
    icon: '🦵',
    color: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Core & Flexibility',
    type: 'flexibility',
    duration: 25,
    exercises: [
      { name: 'Plank', sets: 3, duration_seconds: 60, rest_seconds: 30 },
      { name: 'Russian Twists', sets: 3, reps: 20, rest_seconds: 30 },
      { name: 'Bicycle Crunches', sets: 3, reps: 15, rest_seconds: 30 },
      { name: 'Cat-Cow Stretch', sets: 2, duration_seconds: 60, rest_seconds: 15 },
      { name: 'Child\'s Pose', sets: 1, duration_seconds: 120, rest_seconds: 0 },
    ],
    icon: '🧘',
    color: 'from-green-500 to-teal-500'
  }
];

export default function Workouts() {
  const { userProfile } = useAuth();
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<any>(null);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile && isSupabaseConnected) {
      fetchWorkoutSessions();
    }
  }, [userProfile]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const fetchWorkoutSessions = async () => {
    if (!userProfile || !isSupabaseConnected) return;

    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching workout sessions:', error);
      } else {
        setWorkoutSessions(data || []);
      }
    } catch (error) {
      console.error('Error fetching workout sessions:', error);
    }
    setLoading(false);
  };

  const startWorkout = (template: any) => {
    setActiveWorkout({
      ...template,
      startTime: Date.now(),
      completedExercises: []
    });
    setCurrentExercise(0);
    setCurrentSet(1);
    setTimer(0);
    setIsTimerRunning(true);
    toast.success(`Started ${template.name} workout!`);
  };

  const completeSet = () => {
    if (!activeWorkout) return;

    const exercise = activeWorkout.exercises[currentExercise];
    if (currentSet < exercise.sets) {
      setCurrentSet(prev => prev + 1);
      setIsResting(true);
      toast.success(`Set ${currentSet} completed! Rest for ${exercise.rest_seconds}s`);
      
      // Auto-advance after rest period
      setTimeout(() => {
        setIsResting(false);
      }, exercise.rest_seconds * 1000);
    } else {
      // Move to next exercise
      if (currentExercise < activeWorkout.exercises.length - 1) {
        setCurrentExercise(prev => prev + 1);
        setCurrentSet(1);
        setIsResting(false);
        toast.success(`${exercise.name} completed! Moving to next exercise.`);
      } else {
        // Workout complete
        completeWorkout();
      }
    }
  };

  const completeWorkout = async () => {
    if (!activeWorkout || !userProfile || !isSupabaseConnected) return;

    const duration = Math.round(timer / 60);
    const estimatedCalories = Math.round(duration * 8); // Rough estimate

    try {
      const { error } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: userProfile.id,
          workout_type: activeWorkout.type,
          duration_minutes: duration,
          calories_burned: estimatedCalories,
          exercises: activeWorkout.exercises,
          date: format(new Date(), 'yyyy-MM-dd'),
        });

      if (error) throw error;

      toast.success(`Workout completed! ${duration} minutes, ~${estimatedCalories} calories burned`);
      setActiveWorkout(null);
      setIsTimerRunning(false);
      setTimer(0);
      await fetchWorkoutSessions();
    } catch (error) {
      console.error('Error saving workout:', error);
      toast.error('Failed to save workout session');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-red-50/30 to-pink-50/30 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 text-4xl opacity-10 animate-float" style={{ animationDelay: '0s' }}>💪</div>
        <div className="absolute top-40 right-32 text-3xl opacity-15 animate-float" style={{ animationDelay: '2s' }}>🔥</div>
        <div className="absolute bottom-32 left-32 text-5xl opacity-8 animate-float" style={{ animationDelay: '4s' }}>🏋️</div>
        <div className="absolute bottom-20 right-20 text-3xl opacity-12 animate-float" style={{ animationDelay: '1s' }}>⚡</div>
        <div className="absolute top-1/2 left-1/3 text-4xl opacity-10 animate-float" style={{ animationDelay: '3s' }}>🎯</div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Workouts 💪
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Choose your workout and start training
          </p>
        </div>

        {/* Active Workout */}
        {activeWorkout && (
          <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100/50 dark:border-gray-700/50 mb-8 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className={`p-4 bg-gradient-to-br ${activeWorkout.color} rounded-2xl shadow-lg`}>
                  <span className="text-2xl">{activeWorkout.icon}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{activeWorkout.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">Exercise {currentExercise + 1} of {activeWorkout.exercises.length}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-orange-600">{formatTime(timer)}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Time</p>
              </div>
            </div>

            {/* Current Exercise */}
            <div className="bg-gradient-to-r from-orange-50/80 to-red-50/80 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {activeWorkout.exercises[currentExercise].name}
                </h3>
                <div className="flex items-center space-x-4">
                  <span className="bg-white/80 dark:bg-gray-700/80 px-3 py-1 rounded-full text-sm font-medium">
                    Set {currentSet} of {activeWorkout.exercises[currentExercise].sets}
                  </span>
                  {isResting && (
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                      Resting...
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {activeWorkout.exercises[currentExercise].reps && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{activeWorkout.exercises[currentExercise].reps}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Reps</div>
                  </div>
                )}
                {activeWorkout.exercises[currentExercise].duration_seconds && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{activeWorkout.exercises[currentExercise].duration_seconds}s</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
                  </div>
                )}
                {activeWorkout.exercises[currentExercise].weight && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{activeWorkout.exercises[currentExercise].weight}lbs</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Weight</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{activeWorkout.exercises[currentExercise].rest_seconds}s</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Rest</div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={completeSet}
                  disabled={isResting}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 px-6 rounded-xl hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isResting ? 'Resting...' : 'Complete Set'}
                </button>
                <button
                  onClick={() => {
                    setActiveWorkout(null);
                    setIsTimerRunning(false);
                    setTimer(0);
                  }}
                  className="px-6 py-3 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                >
                  End Workout
                </button>
              </div>
            </div>

            {/* Exercise Progress */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeWorkout.exercises.map((exercise: Exercise, index: number) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    index === currentExercise
                      ? 'border-orange-500 bg-orange-50/80 dark:bg-orange-900/20'
                      : index < currentExercise
                      ? 'border-green-500 bg-green-50/80 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-600 bg-gray-50/80 dark:bg-gray-700/80'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {index < currentExercise ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : index === currentExercise ? (
                      <Play className="h-5 w-5 text-orange-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400" />
                    )}
                    <span className="font-medium text-sm">{exercise.name}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {exercise.sets} sets × {exercise.reps || `${exercise.duration_seconds}s`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Workout Templates */}
        {!activeWorkout && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {workoutTemplates.map((template, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-3xl shadow-xl p-6 border border-gray-100/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-4 bg-gradient-to-br ${template.color} rounded-2xl shadow-lg`}>
                      <span className="text-2xl">{template.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{template.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 capitalize">{template.type} • {template.duration} min</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Exercises:</h4>
                  <div className="space-y-2">
                    {template.exercises.slice(0, 3).map((exercise: Exercise, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">{exercise.name}</span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {exercise.sets} × {exercise.reps || `${exercise.duration_seconds}s`}
                        </span>
                      </div>
                    ))}
                    {template.exercises.length > 3 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        +{template.exercises.length - 3} more exercises
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => startWorkout(template)}
                  className={`w-full bg-gradient-to-r ${template.color} text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold transform hover:-translate-y-0.5 flex items-center justify-center space-x-2`}
                >
                  <Play className="h-4 w-4" />
                  <span>Start Workout</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Recent Workouts */}
        {!activeWorkout && (
          <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-3xl shadow-xl p-6 border border-gray-100/50 dark:border-gray-700/50 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              Recent Workouts
            </h2>

            {workoutSessions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 opacity-20">🏋️</div>
                <p className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">No workouts completed yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Start your first workout above!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {workoutSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-700/80 dark:to-gray-800/80 rounded-xl border border-gray-200/50 dark:border-gray-600/50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                        <Dumbbell className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                          {session.workout_type} Workout
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {format(new Date(session.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Timer className="h-4 w-4 text-gray-500" />
                          <span>{session.duration_minutes} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Flame className="h-4 w-4 text-orange-500" />
                          <span>{session.calories_burned} cal</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}