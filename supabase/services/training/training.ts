import {
    ExerciseTemplate,
    FITNESS_EXPERIENCE_LEVELS,
    FITNESS_GOALS,
    FitnessUser,
    WeeklyWorkoutPlan,
} from "../../../common/index.ts";

export const createWeeklyTrainingSchedule = (
    userData: FitnessUser,
): WeeklyWorkoutPlan[] => {
    const days: WeeklyWorkoutPlan["day"][] = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
    ];

    const schedule: WeeklyWorkoutPlan[] = [];
    const totalWorkoutDays = Math.min(
        userData.trainDaysPerWeek + userData.cardioDaysPerWeek,
        7,
    );

    // Define workout patterns based on total workout days
    const workoutPatterns = {
        1: [0], // Mon
        2: [0, 2], // Mon, Wed
        3: [0, 2, 4], // Mon, Wed, Fri
        4: [0, 1, 3, 5], // Mon, Tue, Thu, Sat
        5: [0, 1, 2, 4, 5], // Mon-Wed, Fri-Sat
        6: [0, 1, 2, 3, 4, 5], // Mon-Sat
        7: [0, 1, 2, 3, 4, 5, 6], // Every day
    };

    const workoutDayIndices =
        workoutPatterns[totalWorkoutDays as keyof typeof workoutPatterns] ||
        workoutPatterns[3];

    days.forEach((day, index) => {
        const isWorkoutDay = workoutDayIndices.includes(index);
        schedule.push({
            day,
            workout: generateExercises(
                userData.fitnessLevel as FITNESS_EXPERIENCE_LEVELS,
                userData.goal,
                isWorkoutDay,
            ),
        });
    });

    return schedule;
};

const generateExercises = (
    fitnessLevel: FITNESS_EXPERIENCE_LEVELS,
    goal: FITNESS_GOALS,
    isWorkoutDay: boolean,
): ExerciseTemplate[] | undefined => {
    if (!isWorkoutDay) {
        return undefined;
    }

    const exerciseDatabase = {
        [FITNESS_GOALS.FAT_LOSS]: {
            [FITNESS_EXPERIENCE_LEVELS.BEGINNER]: [
                {
                    name: "Bodyweight Squats",
                    type: "strength" as const,
                    sets: 3,
                    reps: 15,
                    restTime: 45,
                    instructions: [
                        "Stand with feet shoulder-width apart",
                        "Lower down as if sitting in a chair",
                        "Keep chest up and knees behind toes",
                        "Return to starting position quickly",
                    ],
                    modifications: {
                        beginner: "Use a chair for support",
                        advanced: "Add jump at the top",
                    },
                },
                {
                    name: "Modified Push-ups",
                    type: "strength" as const,
                    sets: 3,
                    reps: 12,
                    restTime: 45,
                    instructions: [
                        "Start in plank position (knees down if needed)",
                        "Lower chest to ground",
                        "Push back up quickly",
                    ],
                    modifications: {
                        beginner: "Do on knees or against wall",
                        advanced: "Full push-ups with faster tempo",
                    },
                },
                {
                    name: "High Knees",
                    type: "cardio" as const,
                    sets: 3,
                    duration: 30,
                    restTime: 30,
                    instructions: [
                        "Run in place lifting knees high",
                        "Keep core engaged",
                        "Maintain quick tempo",
                    ],
                    modifications: {
                        beginner: "March in place",
                        advanced: "Increase speed and knee height",
                    },
                },
            ],
            [FITNESS_EXPERIENCE_LEVELS.INTERMEDIATE]: [
                {
                    name: "Jump Squats",
                    type: "strength" as const,
                    sets: 4,
                    reps: 12,
                    restTime: 60,
                    instructions: [
                        "Squat down with control",
                        "Explode up into a jump",
                        "Land softly and immediately squat again",
                    ],
                    modifications: {
                        beginner: "Regular squats",
                        advanced: "Add weight or increase reps",
                    },
                },
                {
                    name: "Burpees",
                    type: "strength" as const,
                    sets: 3,
                    reps: 8,
                    restTime: 60,
                    instructions: [
                        "Squat down and place hands on floor",
                        "Jump back to plank",
                        "Do push-up",
                        "Jump forward and up",
                    ],
                    modifications: {
                        beginner: "Step back instead of jump",
                        advanced: "Add tuck jump at the end",
                    },
                },
            ],
            [FITNESS_EXPERIENCE_LEVELS.ADVANCED]: [
                {
                    name: "Weighted Jump Squats",
                    type: "strength" as const,
                    sets: 5,
                    reps: 10,
                    restTime: 90,
                    instructions: [
                        "Hold dumbbells at shoulders",
                        "Squat down with control",
                        "Explode up into a jump",
                        "Land softly",
                    ],
                    modifications: {
                        beginner: "Use lighter weight",
                        advanced: "Increase weight or add pause",
                    },
                },
            ],
        },
        [FITNESS_GOALS.MUSCLE_GROWTH]: {
            [FITNESS_EXPERIENCE_LEVELS.BEGINNER]: [
                {
                    name: "Bodyweight Squats",
                    type: "strength" as const,
                    sets: 3,
                    reps: 12,
                    restTime: 90,
                    instructions: [
                        "Stand with feet shoulder-width apart",
                        "Lower down slowly (3 seconds)",
                        "Keep chest up and knees behind toes",
                        "Return to starting position",
                    ],
                    modifications: {
                        beginner: "Use a chair for support",
                        advanced: "Add weight or single leg",
                    },
                },
                {
                    name: "Push-ups",
                    type: "strength" as const,
                    sets: 3,
                    reps: 8,
                    restTime: 90,
                    instructions: [
                        "Start in plank position",
                        "Lower chest to ground slowly",
                        "Push back up with control",
                    ],
                    modifications: {
                        beginner: "Do on knees or against wall",
                        advanced: "Elevate feet or add weight",
                    },
                },
                {
                    name: "Plank Hold",
                    type: "strength" as const,
                    sets: 3,
                    duration: 45,
                    restTime: 90,
                    instructions: [
                        "Hold plank position",
                        "Keep body straight",
                        "Engage core and breathe steadily",
                    ],
                    modifications: {
                        beginner: "On knees or shorter duration",
                        advanced: "Add leg lifts or weight",
                    },
                },
            ],
            [FITNESS_EXPERIENCE_LEVELS.INTERMEDIATE]: [
                {
                    name: "Goblet Squats",
                    type: "strength" as const,
                    sets: 4,
                    reps: 10,
                    restTime: 120,
                    instructions: [
                        "Hold weight at chest",
                        "Squat down keeping chest up",
                        "Drive through heels to stand",
                        "Focus on muscle contraction",
                    ],
                    modifications: {
                        beginner: "Use lighter weight",
                        advanced: "Add pause at bottom or heavier weight",
                    },
                },
                {
                    name: "Dumbbell Rows",
                    type: "strength" as const,
                    sets: 4,
                    reps: 10,
                    restTime: 120,
                    instructions: [
                        "Hinge at hips",
                        "Pull weight to ribs with control",
                        "Squeeze shoulder blades",
                        "Lower slowly",
                    ],
                    modifications: {
                        beginner: "Use resistance band",
                        advanced: "Single arm variation or heavier weight",
                    },
                },
            ],
            [FITNESS_EXPERIENCE_LEVELS.ADVANCED]: [
                {
                    name: "Barbell Squats",
                    type: "strength" as const,
                    sets: 5,
                    reps: 6,
                    restTime: 180,
                    instructions: [
                        "Position bar on upper back",
                        "Squat down with control",
                        "Drive through heels",
                        "Focus on progressive overload",
                    ],
                    modifications: {
                        beginner: "Use lighter weight",
                        advanced: "Add pause, tempo, or increase weight",
                    },
                },
            ],
        },
    };

    return exerciseDatabase[goal][fitnessLevel];
};
