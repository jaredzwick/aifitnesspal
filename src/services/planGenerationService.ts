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
    const primaryGoal = userData.goal || 'maintenance'

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

    // Define workout patterns based on days per week
    const workoutPatterns = {
        3: [0, 2, 4], // Mon, Wed, Fri
        4: [0, 1, 3, 5], // Mon, Tue, Thu, Sat
        5: [0, 1, 2, 4, 5], // Mon-Wed, Fri-Sat
        6: [0, 1, 2, 3, 4, 5], // Mon-Sat
        7: [0, 1, 2, 3, 4, 5, 6] // Every day
    };

    const workoutDayIndices = workoutPatterns[trainDays as keyof typeof workoutPatterns] || workoutPatterns[3];

    days.forEach((day, index) => {
        const isWorkoutDay = workoutDayIndices.includes(index);

        schedule.push({
            day,
            workout: isWorkoutDay ? generateWorkoutTemplate(day, duration, fitnessLevel, primaryGoal) : undefined,
            isRestDay: !isWorkoutDay
        });
    });

    return schedule;
}

const generateWorkoutTemplate = (
    day: string,
    duration: number,
    fitnessLevel: string,
    primaryGoal: string
): WorkoutTemplate => {
    const workoutTypes = getWorkoutTypeForDay(day, primaryGoal);
    const exercises = generateExercises(workoutTypes.type, fitnessLevel, primaryGoal, duration);

    return {
        name: workoutTypes.name,
        type: workoutTypes.type,
        duration,
        targetMuscleGroups: workoutTypes.muscleGroups,
        exercises,
        estimatedCalories: estimateCaloriesBurned(duration, workoutTypes.type, fitnessLevel)
    };
}

const getWorkoutTypeForDay = (day: string, primaryGoal: string) => {
    const goalBasedWorkouts = {
        fat_loss: {
            patterns: [
                { name: 'HIIT Cardio', type: 'hiit' as const, muscleGroups: ['full body'] },
                { name: 'Upper Body Strength', type: 'strength' as const, muscleGroups: ['chest', 'back', 'shoulders', 'arms'] },
                { name: 'Lower Body Strength', type: 'strength' as const, muscleGroups: ['legs', 'glutes'] },
                { name: 'Cardio Blast', type: 'cardio' as const, muscleGroups: ['cardiovascular'] }
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
        }
    };

    const patterns = goalBasedWorkouts[primaryGoal as keyof typeof goalBasedWorkouts]?.patterns ||
        goalBasedWorkouts.muscle_building.patterns;

    const dayIndex = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].indexOf(day);
    return patterns[dayIndex % patterns.length];
}

const generateExercises = (
    workoutType: string,
    fitnessLevel: string,
    primaryGoal: string,
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
                },
                {
                    name: 'Lunges',
                    type: 'strength' as const,
                    sets: 3,
                    reps: 10,
                    restTime: 60,
                    instructions: ['Step forward into lunge position', 'Lower back knee toward ground', 'Push back to starting position', 'Alternate legs'],
                    modifications: { beginner: 'Hold onto wall for balance', advanced: 'Add weights or jump' }
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
                },
                {
                    name: 'Bulgarian Split Squats',
                    type: 'strength' as const,
                    sets: 3,
                    reps: 12,
                    restTime: 90,
                    instructions: ['Place rear foot on bench', 'Lower into lunge position', 'Drive through front heel to return'],
                    modifications: { beginner: 'Use bodyweight only', advanced: 'Hold dumbbells' }
                },
                {
                    name: 'Pike Push-ups',
                    type: 'strength' as const,
                    sets: 3,
                    reps: 8,
                    restTime: 90,
                    instructions: ['Start in downward dog position', 'Lower head toward ground', 'Push back up'],
                    modifications: { beginner: 'Elevate hands on box', advanced: 'Elevate feet' }
                }
            ],
            advanced: [
                {
                    name: 'Pistol Squats',
                    type: 'strength' as const,
                    sets: 4,
                    reps: 8,
                    restTime: 120,
                    instructions: ['Stand on one leg', 'Lower down while extending other leg', 'Drive through heel to return'],
                    modifications: { beginner: 'Use assistance or box', advanced: 'Add weight' }
                },
                {
                    name: 'Handstand Push-ups',
                    type: 'strength' as const,
                    sets: 4,
                    reps: 6,
                    restTime: 120,
                    instructions: ['Get into handstand against wall', 'Lower head toward ground', 'Push back up'],
                    modifications: { beginner: 'Pike push-ups', advanced: 'Freestanding handstand' }
                },
                {
                    name: 'Weighted Pull-ups',
                    type: 'strength' as const,
                    sets: 4,
                    reps: 8,
                    restTime: 120,
                    instructions: ['Hang from pull-up bar with weight', 'Pull up until chin over bar', 'Lower with control'],
                    modifications: { beginner: 'Assisted pull-ups', advanced: 'Increase weight' }
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
                },
                {
                    name: 'Stationary Marching',
                    type: 'cardio' as const,
                    duration: 10,
                    restTime: 60,
                    instructions: ['March in place', 'Lift knees high', 'Swing arms naturally'],
                    modifications: { beginner: 'Lower knee lifts', advanced: 'Add arm movements' }
                }
            ],
            intermediate: [
                {
                    name: 'Jogging',
                    type: 'cardio' as const,
                    duration: 25,
                    restTime: 0,
                    instructions: ['Maintain steady jogging pace', 'Land on midfoot', 'Keep relaxed form'],
                    modifications: { beginner: 'Walk-jog intervals', advanced: 'Increase pace' }
                },
                {
                    name: 'Cycling',
                    type: 'cardio' as const,
                    duration: 30,
                    restTime: 0,
                    instructions: ['Maintain steady cycling pace', 'Keep core engaged', 'Adjust resistance as needed'],
                    modifications: { beginner: 'Lower resistance', advanced: 'Add intervals' }
                }
            ],
            advanced: [
                {
                    name: 'Running',
                    type: 'cardio' as const,
                    duration: 35,
                    restTime: 0,
                    instructions: ['Maintain running pace', 'Focus on breathing rhythm', 'Keep efficient form'],
                    modifications: { beginner: 'Reduce pace', advanced: 'Add sprint intervals' }
                },
                {
                    name: 'Rowing',
                    type: 'cardio' as const,
                    duration: 30,
                    restTime: 0,
                    instructions: ['Drive with legs first', 'Pull handle to chest', 'Control the return'],
                    modifications: { beginner: 'Lower resistance', advanced: 'Increase stroke rate' }
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
                },
                {
                    name: 'High Knees',
                    type: 'cardio' as const,
                    sets: 4,
                    duration: 30,
                    restTime: 30,
                    instructions: ['Run in place', 'Lift knees to hip level', 'Pump arms'],
                    modifications: { beginner: 'Lower knee lifts', advanced: 'Faster pace' }
                }
            ],
            intermediate: [
                {
                    name: 'Burpees',
                    type: 'cardio' as const,
                    sets: 5,
                    duration: 45,
                    restTime: 45,
                    instructions: ['Drop to squat', 'Jump back to plank', 'Do push-up', 'Jump forward', 'Jump up'],
                    modifications: { beginner: 'Step back instead of jump', advanced: 'Add tuck jump' }
                },
                {
                    name: 'Jump Squats',
                    type: 'cardio' as const,
                    sets: 5,
                    duration: 45,
                    restTime: 45,
                    instructions: ['Squat down', 'Explode up into jump', 'Land softly', 'Immediately squat again'],
                    modifications: { beginner: 'Regular squats', advanced: 'Add 180-degree turn' }
                },
                {
                    name: 'Battle Ropes',
                    type: 'cardio' as const,
                    sets: 5,
                    duration: 45,
                    restTime: 45,
                    instructions: ['Hold rope ends', 'Create waves alternating arms', 'Keep core tight'],
                    modifications: { beginner: 'Lighter ropes or shorter duration', advanced: 'Spiral patterns' }
                }
            ],
            advanced: [
                {
                    name: 'Plyometric Push-ups',
                    type: 'cardio' as const,
                    sets: 6,
                    duration: 60,
                    restTime: 60,
                    instructions: ['Explosive push-up', 'Hands leave ground', 'Land softly', 'Immediately repeat'],
                    modifications: { beginner: 'Regular push-ups', advanced: 'Clapping push-ups' }
                },
                {
                    name: 'Box Jump Burpees',
                    type: 'cardio' as const,
                    sets: 6,
                    duration: 60,
                    restTime: 60,
                    instructions: ['Perform burpee', 'Jump onto box', 'Step down', 'Repeat'],
                    modifications: { beginner: 'Step up instead of jump', advanced: 'Higher box' }
                },
                {
                    name: 'Thruster Complex',
                    type: 'cardio' as const,
                    sets: 6,
                    duration: 60,
                    restTime: 60,
                    instructions: ['Squat with weights', 'Press overhead as you stand', 'Lower weights', 'Repeat'],
                    modifications: { beginner: 'Lighter weights', advanced: 'Heavier weights or faster tempo' }
                }
            ]
        }
    };

    // Get exercises for the specified workout type and fitness level
    const workoutExercises = exerciseDatabase[workoutType as keyof typeof exerciseDatabase];
    if (!workoutExercises) {
        // Fallback to strength exercises if workout type not found
        return exerciseDatabase.strength.beginner.slice(0, 3);
    }

    const levelExercises = workoutExercises[fitnessLevel as keyof typeof workoutExercises];
    if (!levelExercises) {
        // Fallback to beginner if fitness level not found
        const fallbackLevel = workoutExercises.beginner || Object.values(workoutExercises)[0];
        return fallbackLevel.slice(0, 3);
    }

    // Calculate number of exercises based on duration
    // Assume each exercise takes about 8-12 minutes including rest
    const exerciseCount = Math.min(
        Math.max(2, Math.floor(duration / 10)), // At least 2, max based on duration
        levelExercises.length // Don't exceed available exercises
    );

    // Select exercises based on primary goal
    let selectedExercises = [...levelExercises];

    // Shuffle exercises to add variety
    for (let i = selectedExercises.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [selectedExercises[i], selectedExercises[j]] = [selectedExercises[j], selectedExercises[i]];
    }

    // Return the selected number of exercises
    return selectedExercises.slice(0, exerciseCount);
}


const estimateCaloriesBurned = (duration: number, workoutType: string, fitnessLevel: string): number => {
    const baseCaloriesPerMinute = {
        strength: 6,
        cardio: 8,
        hiit: 10,
        flexibility: 3,
        mixed: 7
    };

    const levelMultiplier = {
        beginner: 0.8,
        intermediate: 1.0,
        advanced: 1.2
    };

    const base = baseCaloriesPerMinute[workoutType as keyof typeof baseCaloriesPerMinute] || 6;
    const multiplier = levelMultiplier[fitnessLevel as keyof typeof levelMultiplier] || 1.0;

    return Math.round(duration * base * multiplier);
}

const calculateWeeklyCaloriesBurn = (schedule: WeeklyWorkoutPlan[]): number => {
    return schedule.reduce((total, day) => {
        return total + (day.workout?.estimatedCalories || 0);
    }, 0);
}

const generateNutritionRegimen = (userData: Partial<FitnessUser>): NutritionRegimen => {
    const dailyCalorieTarget = calculateDailyCalories(userData);
    const macroTargets = calculateMacroTargets(dailyCalorieTarget, userData.goal || 'maintenance');
    const mealPlan = generateMealPlan(dailyCalorieTarget, macroTargets);

    return {
        dailyCalorieTarget,
        macroTargets,
        mealPlan,
        hydrationTarget: calculateHydrationTarget(userData.weight || 70),
        supplements: recommendSupplements(userData.goal || 'maintenance', userData.dietaryRestrictions || [])
    };
}

const calculateDailyCalories = (userData: Partial<FitnessUser>): number => {
    const weight = userData.weight || 70;
    const height = userData.height || 170;
    const age = userData.age || 30;
    const gender = userData.gender || 'male';
    const primaryGoal = userData.goal || 'maintenance';

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr: number;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }


    // Adjust for goals
    const goalAdjustments = {
        fat_loss: -500, // 500 calorie deficit
        muscle_building: +300, // 300 calorie surplus
        maintenance: 0,
    };

    return Math.round(bmr + goalAdjustments[primaryGoal as keyof typeof goalAdjustments]);
}

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
}

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
}

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
}

const calculateHydrationTarget = (weight: number): number => {
    // Basic formula: 35ml per kg of body weight, minimum 2L
    return Math.max(2, Math.round((weight * 35) / 1000 * 10) / 10);
}

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
}
