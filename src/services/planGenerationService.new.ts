import {
    FitnessUser,
    PersonalizedPlan,
    TrainingRegimen,
    NutritionRegimen,
    WeeklyWorkoutPlan,
    WorkoutTemplate,
    ExerciseTemplate,
    MealPlanTemplate,
    MealSuggestion
} from '../types';

interface PlanGenerationOptions {
    trainDaysPerWeek?: number;
    cardioDaysPerWeek?: number;
    workoutDuration?: number;
}

export const generatePersonalizedPlan = (
    userData: Partial<FitnessUser>, 
    options: PlanGenerationOptions = {}
): PersonalizedPlan => {
    const trainingRegimen = generateTrainingRegimen(userData, options);
    const nutritionRegimen = generateNutritionRegimen(userData);

    return {
        trainingRegimen,
        nutritionRegimen,
        createdAt: new Date(),
        lastUpdated: new Date()
    };
};

const generateTrainingRegimen = (
    userData: Partial<FitnessUser>, 
    options: PlanGenerationOptions
): TrainingRegimen => {
    const trainDays = options.trainDaysPerWeek || 3;
    const cardioDays = options.cardioDaysPerWeek || 2;
    const duration = options.workoutDuration || 45;
    const fitnessLevel = userData.fitnessLevel || 'beginner';
    const primaryGoal = userData.primaryGoal || 'maintenance';

    const weeklySchedule = createWeeklySchedule(trainDays, cardioDays, duration, fitnessLevel, primaryGoal);
    const estimatedCaloriesBurned = calculateWeeklyCaloriesBurn(weeklySchedule);

    return {
        weeklySchedule,
        progressionPlan: {
            phase: fitnessLevel === 'beginner' ? 'foundation' :
                fitnessLevel === 'intermediate' ? 'development' : 'advanced',
            duration: 8, // 8-week phases
            nextPhase: fitnessLevel === 'beginner' ? 'development' :
                fitnessLevel === 'intermediate' ? 'advanced' : undefined
        },
        restDays: 7 - (trainDays + cardioDays),
        estimatedCaloriesBurned
    };
};

const createWeeklySchedule = (
    trainDays: number,
    cardioDays: number,
    duration: number,
    fitnessLevel: string,
    primaryGoal: string
): WeeklyWorkoutPlan[] => {
    const days: WeeklyWorkoutPlan['day'][] = [
        'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
    ];

    const schedule: WeeklyWorkoutPlan[] = [];
    const totalWorkoutDays = Math.min(trainDays + cardioDays, 7);

    // Define workout patterns based on total workout days
    const workoutPatterns = {
        3: [0, 2, 4], // Mon, Wed, Fri
        4: [0, 1, 3, 5], // Mon, Tue, Thu, Sat
        5: [0, 1, 2, 4, 5], // Mon-Wed, Fri-Sat
        6: [0, 1, 2, 3, 4, 5], // Mon-Sat
        7: [0, 1, 2, 3, 4, 5, 6] // Every day
    };

    const workoutDayIndices = workoutPatterns[totalWorkoutDays as keyof typeof workoutPatterns] || workoutPatterns[3];

    days.forEach((day, index) => {
        const isWorkoutDay = workoutDayIndices.includes(index);
        const isCardioDay = isWorkoutDay && index % 2 === 1 && cardioDays > 0; // Alternate days for cardio

        schedule.push({
            day,
            workout: isWorkoutDay ? generateWorkoutTemplate(day, duration, fitnessLevel, primaryGoal, isCardioDay) : undefined,
            isRestDay: !isWorkoutDay
        });
    });

    return schedule;
};

const generateWorkoutTemplate = (
    day: string,
    duration: number,
    fitnessLevel: string,
    primaryGoal: string,
    isCardioDay: boolean = false
): WorkoutTemplate => {
    const workoutTypes = getWorkoutTypeForDay(day, primaryGoal, isCardioDay);
    const exercises = generateExercises(workoutTypes.type, fitnessLevel, duration);

    return {
        name: workoutTypes.name,
        type: workoutTypes.type,
        duration,
        targetMuscleGroups: workoutTypes.muscleGroups,
        exercises,
        estimatedCalories: estimateCaloriesBurned(duration, workoutTypes.type, fitnessLevel)
    };
};

const getWorkoutTypeForDay = (day: string, primaryGoal: string, isCardioDay: boolean = false) => {
    if (isCardioDay) {
        return {
            name: 'Cardio Session',
            type: 'cardio' as const,
            muscleGroups: ['cardiovascular']
        };
    }

    const goalBasedWorkouts = {
        fat_loss: {
            patterns: [
                { name: 'HIIT Cardio', type: 'hiit' as const, muscleGroups: ['full body'] },
                { name: 'Upper Body Strength', type: 'strength' as const, muscleGroups: ['chest', 'back', 'shoulders', 'arms'] },
                { name: 'Lower Body Strength', type: 'strength' as const, muscleGroups: ['legs', 'glutes'] },
                { name: 'Full Body Circuit', type: 'mixed' as const, muscleGroups: ['full body'] }
            ]
        },
        muscle_building: {
            patterns: [
                { name: 'Push Day', type: 'strength' as const, muscleGroups: ['chest', 'shoulders', 'triceps'] },
                { name: 'Pull Day', type: 'strength' as const, muscleGroups: ['back', 'biceps'] },
                { name: 'Leg Day', type: 'strength' as const, muscleGroups: ['legs', 'glutes'] },
                { name: 'Upper Body', type: 'strength' as const, muscleGroups: ['chest', 'back', 'shoulders', 'arms'] }
            ]
        },
        strength: {
            patterns: [
                { name: 'Compound Movements', type: 'strength' as const, muscleGroups: ['full body'] },
                { name: 'Upper Body Power', type: 'strength' as const, muscleGroups: ['chest', 'back', 'shoulders'] },
                { name: 'Lower Body Power', type: 'strength' as const, muscleGroups: ['legs', 'glutes'] }
            ]
        },
        maintenance: {
            patterns: [
                { name: 'Full Body Workout', type: 'mixed' as const, muscleGroups: ['full body'] },
                { name: 'Upper Body', type: 'strength' as const, muscleGroups: ['chest', 'back', 'shoulders', 'arms'] },
                { name: 'Lower Body', type: 'strength' as const, muscleGroups: ['legs', 'glutes'] }
            ]
        },
        endurance: {
            patterns: [
                { name: 'Cardio Training', type: 'cardio' as const, muscleGroups: ['cardiovascular'] },
                { name: 'Circuit Training', type: 'mixed' as const, muscleGroups: ['full body'] },
                { name: 'Endurance Strength', type: 'strength' as const, muscleGroups: ['full body'] }
            ]
        }
    };

    const patterns = goalBasedWorkouts[primaryGoal as keyof typeof goalBasedWorkouts]?.patterns ||
        goalBasedWorkouts.maintenance.patterns;

    const dayIndex = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].indexOf(day);
    return patterns[dayIndex % patterns.length];
};

const generateExercises = (
    workoutType: string,
    fitnessLevel: string,
    duration: number
): ExerciseTemplate[] => {
    const exerciseDatabase = {
        strength: {
            beginner: [
                {
                    name: 'Bodyweight Squats',
                    type: 'strength' as const,
                    sets: 3,
                    reps: 12,
                    restTime: 60,
                    instructions: ['Stand with feet shoulder-width apart', 'Lower down as if sitting in a chair', 'Keep chest up and knees behind toes', 'Return to starting position'],
                    modifications: { beginner: 'Use a chair for support', advanced: 'Add jump at the top' }
                },
                {
                    name: 'Push-ups',
                    type: 'strength' as const,
                    sets: 3,
                    reps: 10,
                    restTime: 60,
                    instructions: ['Start in plank position', 'Lower chest to ground', 'Push back up to starting position'],
                    modifications: { beginner: 'Do on knees or against wall', advanced: 'Elevate feet or add clap' }
                },
                {
                    name: 'Plank',
                    type: 'strength' as const,
                    sets: 3,
                    duration: 30,
                    restTime: 60,
                    instructions: ['Hold plank position', 'Keep body straight', 'Engage core'],
                    modifications: { beginner: 'On knees', advanced: 'Add leg lifts' }
                }
            ],
            intermediate: [
                {
                    name: 'Goblet Squats',
                    type: 'strength' as const,
                    sets: 4,
                    reps: 15,
                    restTime: 90,
                    instructions: ['Hold weight at chest', 'Squat down keeping chest up', 'Drive through heels to stand'],
                    modifications: { beginner: 'Use lighter weight', advanced: 'Add pause at bottom' }
                },
                {
                    name: 'Dumbbell Rows',
                    type: 'strength' as const,
                    sets: 4,
                    reps: 12,
                    restTime: 90,
                    instructions: ['Hinge at hips', 'Pull weight to ribs', 'Squeeze shoulder blades'],
                    modifications: { beginner: 'Use resistance band', advanced: 'Single arm variation' }
                }
            ],
            advanced: [
                {
                    name: 'Barbell Squats',
                    type: 'strength' as const,
                    sets: 5,
                    reps: 8,
                    restTime: 120,
                    instructions: ['Position bar on upper back', 'Squat down with control', 'Drive through heels'],
                    modifications: { beginner: 'Use lighter weight', advanced: 'Add pause or tempo' }
                }
            ]
        },
        cardio: {
            beginner: [
                {
                    name: 'Walking',
                    type: 'cardio' as const,
                    duration: 20,
                    restTime: 0,
                    instructions: ['Maintain steady pace', 'Focus on breathing', 'Keep good posture'],
                    modifications: { beginner: 'Start with 10 minutes', advanced: 'Add incline or intervals' }
                }
            ],
            intermediate: [
                {
                    name: 'Jogging',
                    type: 'cardio' as const,
                    duration: 25,
                    restTime: 0,
                    instructions: ['Maintain comfortable pace', 'Land on midfoot', 'Keep arms relaxed'],
                    modifications: { beginner: 'Walk/jog intervals', advanced: 'Increase pace or distance' }
                }
            ],
            advanced: [
                {
                    name: 'Running',
                    type: 'cardio' as const,
                    duration: 30,
                    restTime: 0,
                    instructions: ['Maintain target pace', 'Focus on form', 'Control breathing'],
                    modifications: { beginner: 'Reduce pace', advanced: 'Add intervals or hills' }
                }
            ]
        },
        hiit: {
            beginner: [
                {
                    name: 'Jumping Jacks',
                    type: 'cardio' as const,
                    sets: 4,
                    duration: 30,
                    restTime: 30,
                    instructions: ['Jump feet apart while raising arms', 'Jump back to starting position'],
                    modifications: { beginner: 'Step side to side', advanced: 'Increase speed' }
                },
                {
                    name: 'Mountain Climbers',
                    type: 'cardio' as const,
                    sets: 4,
                    duration: 30,
                    restTime: 30,
                    instructions: ['Start in plank', 'Alternate bringing knees to chest', 'Keep hips level'],
                    modifications: { beginner: 'Slow tempo', advanced: 'Faster tempo' }
                }
            ],
            intermediate: [
                {
                    name: 'Burpees',
                    type: 'mixed' as const,
                    sets: 4,
                    reps: 10,
                    restTime: 45,
                    instructions: ['Squat down and place hands on floor', 'Jump back to plank', 'Do push-up', 'Jump forward and up'],
                    modifications: { beginner: 'Step back instead of jump', advanced: 'Add tuck jump' }
                }
            ],
            advanced: [
                {
                    name: 'Box Jumps',
                    type: 'plyometric' as const,
                    sets: 5,
                    reps: 8,
                    restTime: 60,
                    instructions: ['Stand in front of box', 'Jump up with both feet', 'Land softly', 'Step down'],
                    modifications: { beginner: 'Use lower box', advanced: 'Increase height or add weight' }
                }
            ]
        },
        mixed: {
            beginner: [
                {
                    name: 'Bodyweight Circuit',
                    type: 'mixed' as const,
                    sets: 3,
                    duration: 45,
                    restTime: 60,
                    instructions: ['Perform each exercise for 30 seconds', 'Rest 15 seconds between exercises', 'Complete full circuit'],
                    modifications: { beginner: 'Reduce work time', advanced: 'Increase work time or add weight' }
                }
            ],
            intermediate: [
                {
                    name: 'Functional Circuit',
                    type: 'mixed' as const,
                    sets: 4,
                    duration: 50,
                    restTime: 90,
                    instructions: ['Mix strength and cardio movements', 'Focus on form over speed', 'Maintain intensity'],
                    modifications: { beginner: 'Longer rest periods', advanced: 'Shorter rest or higher intensity' }
                }
            ],
            advanced: [
                {
                    name: 'Athletic Circuit',
                    type: 'mixed' as const,
                    sets: 5,
                    duration: 60,
                    restTime: 120,
                    instructions: ['High-intensity compound movements', 'Explosive movements', 'Minimal rest between exercises'],
                    modifications: { beginner: 'Reduce intensity', advanced: 'Add plyometric elements' }
                }
            ]
        }
    };

    const workoutTypeExercises = exerciseDatabase[workoutType as keyof typeof exerciseDatabase];
    const levelExercises = workoutTypeExercises?.[fitnessLevel as keyof typeof workoutTypeExercises] || 
                          exerciseDatabase.strength.beginner;

    // Calculate number of exercises based on duration
    const exercisesNeeded = Math.min(Math.floor(duration / 10), levelExercises.length);
    return levelExercises.slice(0, exercisesNeeded);
};

const estimateCaloriesBurned = (duration: number, workoutType: string, fitnessLevel: string): number => {
    const baseCaloriesPerMinute = {
        strength: 6,
        cardio: 8,
        hiit: 10,
        flexibility: 3,
        mixed: 7,
        plyometric: 9
    };

    const levelMultiplier = {
        beginner: 0.8,
        intermediate: 1.0,
        advanced: 1.2
    };

    const base = baseCaloriesPerMinute[workoutType as keyof typeof baseCaloriesPerMinute] || 6;
    const multiplier = levelMultiplier[fitnessLevel as keyof typeof levelMultiplier] || 1.0;

    return Math.round(duration * base * multiplier);
};

const calculateWeeklyCaloriesBurn = (schedule: WeeklyWorkoutPlan[]): number => {
    return schedule.reduce((total, day) => {
        return total + (day.workout?.estimatedCalories || 0);
    }, 0);
};

const generateNutritionRegimen = (userData: Partial<FitnessUser>): NutritionRegimen => {
    const dailyCalorieTarget = calculateDailyCalories(userData);
    const macroTargets = calculateMacroTargets(dailyCalorieTarget, userData.primaryGoal || 'maintenance');
    const mealPlan = generateMealPlan(dailyCalorieTarget, macroTargets);

    return {
        dailyCalorieTarget,
        macroTargets,
        mealPlan,
        hydrationTarget: calculateHydrationTarget(userData.weight || 70),
        supplements: recommendSupplements(userData.primaryGoal || 'maintenance', userData.dietaryRestrictions || [])
    };
};

const calculateDailyCalories = (userData: Partial<FitnessUser>): number => {
    const weight = userData.weight || 70;
    const height = userData.height || 170;
    const age = userData.age || 30;
    const gender = userData.gender || 'male';
    const activityLevel = userData.activityLevel || 'moderately_active';
    const primaryGoal = userData.primaryGoal || 'maintenance';

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr: number;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Activity level multipliers
    const activityMultipliers = {
        sedentary: 1.2,
        lightly_active: 1.375,
        moderately_active: 1.55,
        very_active: 1.725,
        extremely_active: 1.9
    };

    const tdee = bmr * (activityMultipliers[activityLevel as keyof typeof activityMultipliers] || activityMultipliers.moderately_active);

    // Adjust for goals
    const goalAdjustments = {
        fat_loss: -500, // 500 calorie deficit
        muscle_building: +300, // 300 calorie surplus
        maintenance: 0,
        strength: +200,
        endurance: +100
    };

    return Math.round(tdee + (goalAdjustments[primaryGoal as keyof typeof goalAdjustments] || 0));
};

const calculateMacroTargets = (calories: number, primaryGoal: string) => {
    const macroRatios = {
        fat_loss: { protein: 0.35, carbs: 0.35, fat: 0.30 },
        muscle_building: { protein: 0.30, carbs: 0.45, fat: 0.25 },
        maintenance: { protein: 0.25, carbs: 0.45, fat: 0.30 },
        strength: { protein: 0.30, carbs: 0.40, fat: 0.30 },
        endurance: { protein: 0.20, carbs: 0.55, fat: 0.25 }
    };

    const ratios = macroRatios[primaryGoal as keyof typeof macroRatios] || macroRatios.maintenance;

    return {
        protein: Math.round((calories * ratios.protein) / 4), // 4 calories per gram
        carbs: Math.round((calories * ratios.carbs) / 4),
        fat: Math.round((calories * ratios.fat) / 9), // 9 calories per gram
        proteinPercentage: Math.round(ratios.protein * 100),
        carbsPercentage: Math.round(ratios.carbs * 100),
        fatPercentage: Math.round(ratios.fat * 100)
    };
};

const generateMealPlan = (dailyCalories: number, macroTargets: any): MealPlanTemplate[] => {
    const mealDistribution = {
        breakfast: 0.25,
        lunch: 0.35,
        dinner: 0.30,
        snack: 0.10
    };

    return Object.entries(mealDistribution).map(([mealType, percentage]) => ({
        mealType: mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
        targetCalories: Math.round(dailyCalories * percentage),
        targetMacros: {
            protein: Math.round(macroTargets.protein * percentage),
            carbs: Math.round(macroTargets.carbs * percentage),
            fat: Math.round(macroTargets.fat * percentage)
        },
        suggestions: getMealSuggestions(mealType, Math.round(dailyCalories * percentage))
    }));
};

const getMealSuggestions = (mealType: string, targetCalories: number): MealSuggestion[] => {
    const mealDatabase = {
        breakfast: [
            {
                name: 'Protein Oatmeal Bowl',
                ingredients: ['Oats', 'Protein powder', 'Berries', 'Almond butter'],
                calories: 350,
                macros: { protein: 25, carbs: 45, fat: 8 },
                prepTime: 10,
                difficulty: 'easy' as const
            },
            {
                name: 'Veggie Scramble',
                ingredients: ['Eggs', 'Spinach', 'Tomatoes', 'Cheese'],
                calories: 300,
                macros: { protein: 20, carbs: 8, fat: 18 },
                prepTime: 15,
                difficulty: 'medium' as const
            }
        ],
        lunch: [
            {
                name: 'Grilled Chicken Salad',
                ingredients: ['Chicken breast', 'Mixed greens', 'Quinoa', 'Olive oil dressing'],
                calories: 450,
                macros: { protein: 35, carbs: 30, fat: 15 },
                prepTime: 20,
                difficulty: 'medium' as const
            },
            {
                name: 'Turkey Wrap',
                ingredients: ['Whole wheat tortilla', 'Turkey', 'Avocado', 'Vegetables'],
                calories: 400,
                macros: { protein: 25, carbs: 35, fat: 18 },
                prepTime: 10,
                difficulty: 'easy' as const
            }
        ],
        dinner: [
            {
                name: 'Salmon with Sweet Potato',
                ingredients: ['Salmon fillet', 'Sweet potato', 'Broccoli', 'Olive oil'],
                calories: 500,
                macros: { protein: 35, carbs: 40, fat: 20 },
                prepTime: 30,
                difficulty: 'medium' as const
            },
            {
                name: 'Lean Beef Stir-fry',
                ingredients: ['Lean beef', 'Mixed vegetables', 'Brown rice', 'Soy sauce'],
                calories: 480,
                macros: { protein: 30, carbs: 45, fat: 15 },
                prepTime: 25,
                difficulty: 'medium' as const
            }
        ],
        snack: [
            {
                name: 'Greek Yogurt with Nuts',
                ingredients: ['Greek yogurt', 'Mixed nuts', 'Honey'],
                calories: 200,
                macros: { protein: 15, carbs: 12, fat: 10 },
                prepTime: 5,
                difficulty: 'easy' as const
            },
            {
                name: 'Apple with Peanut Butter',
                ingredients: ['Apple', 'Natural peanut butter'],
                calories: 180,
                macros: { protein: 6, carbs: 20, fat: 8 },
                prepTime: 2,
                difficulty: 'easy' as const
            }
        ]
    };

    return mealDatabase[mealType as keyof typeof mealDatabase] || [];
};

const calculateHydrationTarget = (weight: number): number => {
    // Basic formula: 35ml per kg of body weight, minimum 2L
    return Math.max(2, Math.round((weight * 35) / 1000 * 10) / 10);
};

const recommendSupplements = (primaryGoal: string, dietaryRestrictions: string[]): string[] => {
    const baseSupplements = ['Multivitamin', 'Omega-3'];

    const goalSupplements = {
        fat_loss: ['Green tea extract', 'L-Carnitine'],
        muscle_building: ['Whey protein', 'Creatine', 'BCAAs'],
        strength: ['Creatine', 'Beta-alanine'],
        endurance: ['Electrolytes', 'Iron'],
        maintenance: []
    };

    const supplements = [...baseSupplements, ...(goalSupplements[primaryGoal as keyof typeof goalSupplements] || [])];

    // Filter based on dietary restrictions
    if (dietaryRestrictions.includes('vegan') || dietaryRestrictions.includes('vegetarian')) {
        return supplements.filter(sup => sup !== 'Whey protein').concat(['Plant protein']);
    }

    return supplements;
};
