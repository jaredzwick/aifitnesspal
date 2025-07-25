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
    let workoutDayCounter = 0;
    days.forEach((day, index) => {
        const isWorkoutDay = workoutDayIndices.includes(index);
        schedule.push({
            day,
            workout: generateExercises(
                userData.fitnessLevel as FITNESS_EXPERIENCE_LEVELS,
                userData.goal,
                isWorkoutDay,
                workoutDayCounter,
            ),
        });
        if (isWorkoutDay) {
            workoutDayCounter++;
        }
    });

    return schedule;
};

const generateExercises = (
    fitnessLevel: FITNESS_EXPERIENCE_LEVELS,
    goal: FITNESS_GOALS,
    isWorkoutDay: boolean,
    count: number,
): ExerciseTemplate[] | undefined => {
    if (!isWorkoutDay) {
        return undefined;
    }

    const exerciseDatabase = {
        [FITNESS_GOALS.FAT_LOSS]: {
            [FITNESS_EXPERIENCE_LEVELS.BEGINNER]: [
                // Day 0: Full Body HIIT
                [
                    {
                        name: "Bodyweight Squats",
                        type: "strength" as const,
                        numberOfSets: 3,
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
                        numberOfSets: 3,
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
                        numberOfSets: 3,
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
                // Day 1: Upper Body Cardio
                [
                    {
                        name: "Arm Circles",
                        type: "cardio" as const,
                        numberOfSets: 3,
                        duration: 30,
                        restTime: 30,
                        instructions: [
                            "Extend arms to sides",
                            "Make small circles forward",
                            "Switch to backward circles",
                        ],
                        modifications: {
                            beginner: "Smaller circles, slower pace",
                            advanced: "Larger circles, faster pace",
                        },
                    },
                    {
                        name: "Wall Push-ups",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 15,
                        restTime: 45,
                        instructions: [
                            "Stand arm's length from wall",
                            "Place hands on wall shoulder-width apart",
                            "Push away from wall quickly",
                        ],
                        modifications: {
                            beginner: "Stand closer to wall",
                            advanced: "Step further from wall",
                        },
                    },
                    {
                        name: "Jumping Jacks",
                        type: "cardio" as const,
                        numberOfSets: 3,
                        duration: 30,
                        restTime: 30,
                        instructions: [
                            "Jump feet apart while raising arms",
                            "Jump back to starting position",
                            "Maintain steady rhythm",
                        ],
                        modifications: {
                            beginner: "Step out instead of jumping",
                            advanced: "Increase speed and intensity",
                        },
                    },
                ],
                // Day 2: Lower Body HIIT
                [
                    {
                        name: "Glute Bridges",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 15,
                        restTime: 45,
                        instructions: [
                            "Lie on back with knees bent",
                            "Lift hips up squeezing glutes",
                            "Lower with control",
                        ],
                        modifications: {
                            beginner: "Hold for shorter time",
                            advanced: "Single leg or add weight",
                        },
                    },
                    {
                        name: "Lunges",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 12,
                        restTime: 45,
                        instructions: [
                            "Step forward into lunge",
                            "Lower back knee toward ground",
                            "Push back to starting position",
                        ],
                        modifications: {
                            beginner: "Use wall for balance",
                            advanced: "Add jump between legs",
                        },
                    },
                    {
                        name: "Calf Raises",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 20,
                        restTime: 30,
                        instructions: [
                            "Stand on balls of feet",
                            "Raise up as high as possible",
                            "Lower with control",
                        ],
                        modifications: {
                            beginner: "Hold wall for balance",
                            advanced: "Single leg or add weight",
                        },
                    },
                ],
                // Day 3: Core Cardio
                [
                    {
                        name: "Modified Plank",
                        type: "strength" as const,
                        numberOfSets: 3,
                        duration: 30,
                        restTime: 45,
                        instructions: [
                            "Hold plank position on knees",
                            "Keep body straight from knees to head",
                            "Breathe steadily",
                        ],
                        modifications: {
                            beginner: "Shorter duration",
                            advanced: "Full plank position",
                        },
                    },
                    {
                        name: "Mountain Climbers",
                        type: "cardio" as const,
                        numberOfSets: 3,
                        duration: 30,
                        restTime: 45,
                        instructions: [
                            "Start in plank position",
                            "Alternate bringing knees to chest",
                            "Keep core engaged",
                        ],
                        modifications: {
                            beginner: "Slower pace, step instead of jump",
                            advanced: "Faster pace, higher knees",
                        },
                    },
                    {
                        name: "Dead Bug",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 10,
                        restTime: 45,
                        instructions: [
                            "Lie on back, arms up, knees bent",
                            "Lower opposite arm and leg",
                            "Return to start and switch sides",
                        ],
                        modifications: {
                            beginner: "Move one limb at a time",
                            advanced: "Add resistance band",
                        },
                    },
                ],
                // Day 4: Full Body Circuit
                [
                    {
                        name: "Squat to Stand",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 12,
                        restTime: 45,
                        instructions: [
                            "Sit in chair, stand up without using hands",
                            "Lower back down with control",
                            "Keep chest up throughout",
                        ],
                        modifications: {
                            beginner: "Use hands for assistance",
                            advanced: "Add weight or single leg",
                        },
                    },
                    {
                        name: "Knee Push-ups",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 10,
                        restTime: 45,
                        instructions: [
                            "Start on knees in modified plank",
                            "Lower chest to ground",
                            "Push back up",
                        ],
                        modifications: {
                            beginner: "Hands on elevated surface",
                            advanced: "Full push-ups",
                        },
                    },
                    {
                        name: "Standing Marches",
                        type: "cardio" as const,
                        numberOfSets: 3,
                        duration: 30,
                        restTime: 30,
                        instructions: [
                            "March in place lifting knees",
                            "Swing arms naturally",
                            "Maintain steady pace",
                        ],
                        modifications: {
                            beginner: "Lower knee lifts",
                            advanced: "Higher knees, faster pace",
                        },
                    },
                ],
                // Day 5: Active Recovery
                [
                    {
                        name: "Gentle Stretching",
                        type: "flexibility" as const,
                        numberOfSets: 1,
                        duration: 300,
                        restTime: 0,
                        instructions: [
                            "Hold each stretch for 30 seconds",
                            "Focus on major muscle groups",
                            "Breathe deeply and relax",
                        ],
                        modifications: {
                            beginner: "Shorter holds, less intensity",
                            advanced: "Longer holds, deeper stretches",
                        },
                    },
                    {
                        name: "Walking",
                        type: "cardio" as const,
                        numberOfSets: 1,
                        duration: 900,
                        restTime: 0,
                        instructions: [
                            "Walk at comfortable pace",
                            "Focus on breathing",
                            "Enjoy the movement",
                        ],
                        modifications: {
                            beginner: "Shorter duration, slower pace",
                            advanced: "Longer duration, varied terrain",
                        },
                    },
                ],
                // Day 6: Flexibility & Mobility
                [
                    {
                        name: "Cat-Cow Stretch",
                        type: "flexibility" as const,
                        numberOfSets: 3,
                        reps: 10,
                        restTime: 30,
                        instructions: [
                            "Start on hands and knees",
                            "Arch back looking up (cow)",
                            "Round back looking down (cat)",
                        ],
                        modifications: {
                            beginner: "Smaller range of motion",
                            advanced: "Hold positions longer",
                        },
                    },
                    {
                        name: "Shoulder Rolls",
                        type: "flexibility" as const,
                        numberOfSets: 3,
                        reps: 10,
                        restTime: 30,
                        instructions: [
                            "Roll shoulders forward in circles",
                            "Reverse direction",
                            "Keep movements smooth",
                        ],
                        modifications: {
                            beginner: "Smaller circles",
                            advanced: "Larger, more deliberate movements",
                        },
                    },
                    {
                        name: "Hip Circles",
                        type: "flexibility" as const,
                        numberOfSets: 3,
                        reps: 10,
                        restTime: 30,
                        instructions: [
                            "Stand with hands on hips",
                            "Make circles with hips",
                            "Switch directions",
                        ],
                        modifications: {
                            beginner: "Smaller circles, use wall for balance",
                            advanced: "Larger circles, add leg lifts",
                        },
                    },
                ],
            ],
            [FITNESS_EXPERIENCE_LEVELS.INTERMEDIATE]: [
                // Day 0: Full Body HIIT
                [
                    {
                        name: "Jump Squats",
                        type: "strength" as const,
                        numberOfSets: 4,
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
                        numberOfSets: 3,
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
                    {
                        name: "High Intensity Intervals",
                        type: "cardio" as const,
                        numberOfSets: 4,
                        duration: 45,
                        restTime: 45,
                        instructions: [
                            "Alternate between high knees and butt kicks",
                            "Go all out for work period",
                            "Rest completely between sets",
                        ],
                        modifications: {
                            beginner: "Reduce intensity",
                            advanced: "Increase work time, decrease rest",
                        },
                    },
                ],
                // Day 1: Upper Body Power
                [
                    {
                        name: "Push-up Variations",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 10,
                        restTime: 60,
                        instructions: [
                            "Alternate between regular, wide, and diamond push-ups",
                            "Maintain proper form",
                            "Control both up and down phases",
                        ],
                        modifications: {
                            beginner: "Do on knees",
                            advanced: "Add clap or archer push-ups",
                        },
                    },
                    {
                        name: "Pike Push-ups",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 8,
                        restTime: 60,
                        instructions: [
                            "Start in downward dog position",
                            "Lower head toward hands",
                            "Push back up",
                        ],
                        modifications: {
                            beginner: "Elevate hands on platform",
                            advanced: "Elevate feet",
                        },
                    },
                    {
                        name: "Battle Rope Simulation",
                        type: "cardio" as const,
                        numberOfSets: 4,
                        duration: 30,
                        restTime: 45,
                        instructions: [
                            "Simulate battle rope waves with arms",
                            "Keep core engaged",
                            "Maintain high intensity",
                        ],
                        modifications: {
                            beginner: "Slower waves, shorter duration",
                            advanced: "Faster waves, add squats",
                        },
                    },
                ],
                // Day 2: Lower Body Power
                [
                    {
                        name: "Single Leg Squats",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 8,
                        restTime: 75,
                        instructions: [
                            "Stand on one leg",
                            "Lower down as far as possible",
                            "Push back up with control",
                        ],
                        modifications: {
                            beginner: "Use chair for balance",
                            advanced: "Add weight or jump",
                        },
                    },
                    {
                        name: "Plyometric Lunges",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 12,
                        restTime: 60,
                        instructions: [
                            "Start in lunge position",
                            "Jump and switch legs in air",
                            "Land in lunge on opposite side",
                        ],
                        modifications: {
                            beginner: "Step instead of jump",
                            advanced: "Add weight or increase speed",
                        },
                    },
                    {
                        name: "Box Jumps (or Step-ups)",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 10,
                        restTime: 75,
                        instructions: [
                            "Jump onto stable surface",
                            "Land softly with bent knees",
                            "Step down with control",
                        ],
                        modifications: {
                            beginner: "Step up instead of jump",
                            advanced: "Higher surface or add weight",
                        },
                    },
                ],
                // Day 3: Core Power
                [
                    {
                        name: "Plank to Push-up",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 10,
                        restTime: 60,
                        instructions: [
                            "Start in forearm plank",
                            "Push up to full plank one arm at a time",
                            "Return to forearm plank",
                        ],
                        modifications: {
                            beginner: "Do on knees",
                            advanced: "Add leg lifts",
                        },
                    },
                    {
                        name: "Russian Twists",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 20,
                        restTime: 45,
                        instructions: [
                            "Sit with knees bent, lean back slightly",
                            "Rotate torso side to side",
                            "Keep core engaged throughout",
                        ],
                        modifications: {
                            beginner: "Keep feet on ground",
                            advanced: "Lift feet, add weight",
                        },
                    },
                    {
                        name: "Bicycle Crunches",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 20,
                        restTime: 45,
                        instructions: [
                            "Lie on back, hands behind head",
                            "Bring opposite elbow to knee",
                            "Alternate sides in cycling motion",
                        ],
                        modifications: {
                            beginner: "Slower pace, smaller range",
                            advanced: "Faster pace, hold positions",
                        },
                    },
                ],
                // Day 4: Circuit Training
                [
                    {
                        name: "Squat Thrusts",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 12,
                        restTime: 45,
                        instructions: [
                            "Squat down, place hands on floor",
                            "Jump feet back to plank",
                            "Jump feet forward, stand up",
                        ],
                        modifications: {
                            beginner: "Step instead of jump",
                            advanced: "Add push-up in plank position",
                        },
                    },
                    {
                        name: "Dips (Chair/Bench)",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 10,
                        restTime: 60,
                        instructions: [
                            "Sit on edge of chair, hands beside hips",
                            "Lower body by bending elbows",
                            "Push back up",
                        ],
                        modifications: {
                            beginner: "Keep feet closer, less range",
                            advanced: "Extend legs further, add weight",
                        },
                    },
                    {
                        name: "Sprint Intervals",
                        type: "cardio" as const,
                        numberOfSets: 5,
                        duration: 30,
                        restTime: 60,
                        instructions: [
                            "Run in place at maximum effort",
                            "Pump arms vigorously",
                            "Rest completely between intervals",
                        ],
                        modifications: {
                            beginner: "Reduce intensity and duration",
                            advanced: "Increase duration, decrease rest",
                        },
                    },
                ],
                // Day 5: Active Recovery
                [
                    {
                        name: "Dynamic Stretching",
                        type: "flexibility" as const,
                        numberOfSets: 1,
                        duration: 600,
                        restTime: 0,
                        instructions: [
                            "Perform leg swings, arm circles, hip circles",
                            "Keep movements controlled",
                            "Focus on mobility",
                        ],
                        modifications: {
                            beginner: "Smaller range of motion",
                            advanced: "Larger range, add resistance",
                        },
                    },
                    {
                        name: "Light Cardio",
                        type: "cardio" as const,
                        numberOfSets: 1,
                        duration: 1200,
                        restTime: 0,
                        instructions: [
                            "Light jogging in place or walking",
                            "Keep heart rate moderate",
                            "Focus on recovery",
                        ],
                        modifications: {
                            beginner: "Walking pace only",
                            advanced: "Add brief intensity bursts",
                        },
                    },
                ],
                // Day 6: Flexibility & Core
                [
                    {
                        name: "Yoga Flow",
                        type: "flexibility" as const,
                        numberOfSets: 3,
                        duration: 120,
                        restTime: 30,
                        instructions: [
                            "Flow through downward dog, cobra, child's pose",
                            "Hold each position for 30 seconds",
                            "Focus on breathing",
                        ],
                        modifications: {
                            beginner: "Hold positions shorter",
                            advanced: "Add warrior poses",
                        },
                    },
                    {
                        name: "Core Stability",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 15,
                        restTime: 45,
                        instructions: [
                            "Alternate between bird dog and side plank",
                            "Focus on stability and control",
                            "Breathe steadily",
                        ],
                        modifications: {
                            beginner: "Shorter holds, modified positions",
                            advanced: "Add resistance or instability",
                        },
                    },
                ],
            ],
            [FITNESS_EXPERIENCE_LEVELS.ADVANCED]: [
                // Day 0: High-Intensity Full Body
                [
                    {
                        name: "Weighted Jump Squats",
                        type: "strength" as const,
                        numberOfSets: 5,
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
                    {
                        name: "Burpee Box Jumps",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 8,
                        restTime: 90,
                        instructions: [
                            "Perform burpee",
                            "Jump onto box/platform",
                            "Step down with control",
                            "Repeat immediately",
                        ],
                        modifications: {
                            beginner: "Lower box, step up instead of jump",
                            advanced: "Higher box, add weight vest",
                        },
                    },
                    {
                        name: "Tabata Intervals",
                        type: "cardio" as const,
                        numberOfSets: 8,
                        duration: 20,
                        restTime: 10,
                        instructions: [
                            "20 seconds all-out effort",
                            "10 seconds rest",
                            "Alternate between mountain climbers and jump squats",
                        ],
                        modifications: {
                            beginner: "Reduce intensity",
                            advanced: "Add resistance or complexity",
                        },
                    },
                ],
                // Day 1: Upper Body Explosive
                [
                    {
                        name: "Clapping Push-ups",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 8,
                        restTime: 90,
                        instructions: [
                            "Explode up from push-up",
                            "Clap hands in air",
                            "Land with control",
                            "Immediately go into next rep",
                        ],
                        modifications: {
                            beginner: "Regular explosive push-ups",
                            advanced: "Multiple claps or weighted vest",
                        },
                    },
                    {
                        name: "Handstand Push-ups",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 5,
                        restTime: 120,
                        instructions: [
                            "Kick up to handstand against wall",
                            "Lower head toward ground",
                            "Press back up",
                        ],
                        modifications: {
                            beginner: "Pike push-ups with feet elevated",
                            advanced: "Freestanding handstand push-ups",
                        },
                    },
                    {
                        name: "Battle Rope HIIT",
                        type: "cardio" as const,
                        numberOfSets: 6,
                        duration: 30,
                        restTime: 30,
                        instructions: [
                            "Maximum intensity waves",
                            "Alternate wave patterns",
                            "Keep core braced",
                        ],
                        modifications: {
                            beginner: "Lighter ropes, longer rest",
                            advanced: "Heavier ropes, add squats",
                        },
                    },
                ],
                // Day 2: Lower Body Power
                [
                    {
                        name: "Pistol Squats",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 6,
                        restTime: 120,
                        instructions: [
                            "Stand on one leg",
                            "Lower to full squat on single leg",
                            "Drive up explosively",
                            "Maintain balance throughout",
                        ],
                        modifications: {
                            beginner: "Assisted with TRX or box",
                            advanced: "Add weight or jump",
                        },
                    },
                    {
                        name: "Depth Jumps",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 6,
                        restTime: 120,
                        instructions: [
                            "Step off box",
                            "Land and immediately jump up",
                            "Focus on minimal ground contact time",
                            "Land softly",
                        ],
                        modifications: {
                            beginner: "Lower box height",
                            advanced: "Higher box or add weight",
                        },
                    },
                    {
                        name: "Single Leg Bounds",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 10,
                        restTime: 90,
                        instructions: [
                            "Hop forward on one leg",
                            "Focus on distance and height",
                            "Land with control",
                            "Switch legs each set",
                        ],
                        modifications: {
                            beginner: "Shorter bounds, more control",
                            advanced: "Longer bounds, add resistance",
                        },
                    },
                ],
                // Day 3: Core Power
                [
                    {
                        name: "Weighted Russian Twists",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 20,
                        restTime: 60,
                        instructions: [
                            "Hold weight plate or medicine ball",
                            "Rotate explosively side to side",
                            "Keep feet elevated",
                            "Control the weight throughout",
                        ],
                        modifications: {
                            beginner: "Lighter weight, feet down",
                            advanced: "Heavier weight, faster tempo",
                        },
                    },
                    {
                        name: "Dragon Flags",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 8,
                        restTime: 120,
                        instructions: [
                            "Lie on bench, grab behind head",
                            "Lift entire body up straight",
                            "Lower with control",
                            "Keep body rigid",
                        ],
                        modifications: {
                            beginner: "Bent knee version",
                            advanced: "Add weight or slower tempo",
                        },
                    },
                    {
                        name: "Plank Up-Downs",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 15,
                        restTime: 60,
                        instructions: [
                            "Start in forearm plank",
                            "Push up to full plank one arm at a time",
                            "Return to forearm plank",
                            "Alternate leading arm",
                        ],
                        modifications: {
                            beginner: "Slower tempo, on knees",
                            advanced: "Add weight vest or leg lifts",
                        },
                    },
                ],
                // Day 4: Metabolic Circuit
                [
                    {
                        name: "Thrusters",
                        type: "strength" as const,
                        numberOfSets: 5,
                        reps: 12,
                        restTime: 60,
                        instructions: [
                            "Hold weights at shoulders",
                            "Squat down",
                            "Drive up and press overhead",
                            "Lower weights and repeat",
                        ],
                        modifications: {
                            beginner: "Lighter weight, separate movements",
                            advanced: "Heavier weight, faster tempo",
                        },
                    },
                    {
                        name: "Man Makers",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 8,
                        restTime: 90,
                        instructions: [
                            "Start with dumbbells in hands",
                            "Burpee with push-up",
                            "Row each arm in plank",
                            "Jump up and press overhead",
                        ],
                        modifications: {
                            beginner: "Break into separate movements",
                            advanced:
                                "Heavier weights, no rest between components",
                        },
                    },
                    {
                        name: "Kettlebell Swings",
                        type: "cardio" as const,
                        numberOfSets: 5,
                        reps: 20,
                        restTime: 45,
                        instructions: [
                            "Hip hinge movement",
                            "Explosive hip drive",
                            "Swing to eye level",
                            "Control the descent",
                        ],
                        modifications: {
                            beginner: "Lighter weight, focus on form",
                            advanced: "Heavier weight, single arm",
                        },
                    },
                ],
                // Day 5: Active Recovery
                [
                    {
                        name: "Advanced Mobility Flow",
                        type: "flexibility" as const,
                        numberOfSets: 1,
                        duration: 900,
                        restTime: 0,
                        instructions: [
                            "Complex movement patterns",
                            "Deep stretches with movement",
                            "Focus on problem areas",
                        ],
                        modifications: {
                            beginner: "Simpler movements, longer holds",
                            advanced: "Add resistance or instability",
                        },
                    },
                    {
                        name: "Recovery Cardio",
                        type: "cardio" as const,
                        numberOfSets: 1,
                        duration: 1800,
                        restTime: 0,
                        instructions: [
                            "Low intensity steady state",
                            "Focus on breathing",
                            "Promote blood flow",
                        ],
                        modifications: {
                            beginner: "Shorter duration",
                            advanced: "Add brief tempo changes",
                        },
                    },
                ],
                // Day 6: Power & Flexibility
                [
                    {
                        name: "Power Yoga Flow",
                        type: "flexibility" as const,
                        numberOfSets: 4,
                        duration: 180,
                        restTime: 60,
                        instructions: [
                            "Dynamic yoga sequence",
                            "Hold challenging poses",
                            "Flow between positions",
                            "Focus on strength and flexibility",
                        ],
                        modifications: {
                            beginner: "Hold poses shorter, simpler sequence",
                            advanced: "Add arm balances and inversions",
                        },
                    },
                    {
                        name: "Explosive Core Finisher",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 12,
                        restTime: 60,
                        instructions: [
                            "Medicine ball slams",
                            "Explosive sit-ups",
                            "V-ups with twist",
                            "Maximum intensity",
                        ],
                        modifications: {
                            beginner: "Lighter ball, controlled movements",
                            advanced: "Heavier ball, faster tempo",
                        },
                    },
                ],
            ],
        },
        [FITNESS_GOALS.MUSCLE_GROWTH]: {
            [FITNESS_EXPERIENCE_LEVELS.BEGINNER]: [
                // Day 0: Upper Body Push
                [
                    {
                        name: "Push-ups",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 8,
                        restTime: 90,
                        instructions: [
                            "Start in plank position",
                            "Lower chest to ground slowly (3 seconds)",
                            "Push back up with control (2 seconds)",
                            "Focus on muscle tension",
                        ],
                        modifications: {
                            beginner: "Do on knees or against wall",
                            advanced: "Elevate feet or add weight",
                        },
                    },
                    {
                        name: "Pike Push-ups",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 6,
                        restTime: 90,
                        instructions: [
                            "Start in downward dog position",
                            "Lower head toward hands slowly",
                            "Push back up with control",
                            "Feel the shoulder burn",
                        ],
                        modifications: {
                            beginner: "Hands on elevated surface",
                            advanced: "Feet on elevated surface",
                        },
                    },
                    {
                        name: "Tricep Dips",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 8,
                        restTime: 90,
                        instructions: [
                            "Sit on edge of chair, hands beside hips",
                            "Lower body slowly (3 seconds)",
                            "Push back up focusing on triceps",
                        ],
                        modifications: {
                            beginner: "Keep feet closer to body",
                            advanced: "Extend legs further out",
                        },
                    },
                ],
                // Day 1: Lower Body
                [
                    {
                        name: "Bodyweight Squats",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 12,
                        restTime: 90,
                        instructions: [
                            "Stand with feet shoulder-width apart",
                            "Lower down slowly (3 seconds)",
                            "Keep chest up and knees behind toes",
                            "Drive up through heels (2 seconds)",
                        ],
                        modifications: {
                            beginner: "Use a chair for support",
                            advanced: "Add weight or single leg",
                        },
                    },
                    {
                        name: "Lunges",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 10,
                        restTime: 90,
                        instructions: [
                            "Step forward into lunge position",
                            "Lower back knee slowly",
                            "Push back to starting position",
                            "Feel the quad and glute engagement",
                        ],
                        modifications: {
                            beginner: "Use wall for balance",
                            advanced: "Add weight or reverse lunges",
                        },
                    },
                    {
                        name: "Glute Bridges",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 15,
                        restTime: 90,
                        instructions: [
                            "Lie on back with knees bent",
                            "Lift hips up squeezing glutes",
                            "Hold for 2 seconds at top",
                            "Lower with control",
                        ],
                        modifications: {
                            beginner: "Shorter hold time",
                            advanced: "Single leg or add weight",
                        },
                    },
                ],
                // Day 2: Upper Body Pull
                [
                    {
                        name: "Inverted Rows",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 8,
                        restTime: 90,
                        instructions: [
                            "Lie under table or use resistance band",
                            "Pull chest toward hands",
                            "Squeeze shoulder blades together",
                            "Lower with control",
                        ],
                        modifications: {
                            beginner: "Use resistance band or higher angle",
                            advanced: "Lower angle or add weight",
                        },
                    },
                    {
                        name: "Superman",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 12,
                        restTime: 90,
                        instructions: [
                            "Lie face down on floor",
                            "Lift chest and legs simultaneously",
                            "Hold for 2 seconds",
                            "Lower with control",
                        ],
                        modifications: {
                            beginner: "Lift chest only",
                            advanced: "Hold longer or add arm movements",
                        },
                    },
                    {
                        name: "Reverse Fly",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 12,
                        restTime: 90,
                        instructions: [
                            "Bend forward at hips",
                            "Lift arms out to sides",
                            "Squeeze shoulder blades",
                            "Control the movement",
                        ],
                        modifications: {
                            beginner: "Use lighter resistance or no weight",
                            advanced: "Add resistance band or weights",
                        },
                    },
                ],
                // Day 3: Full Body
                [
                    {
                        name: "Squat to Press",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 10,
                        restTime: 90,
                        instructions: [
                            "Hold light weights at shoulders",
                            "Squat down slowly",
                            "Stand up and press weights overhead",
                            "Control both movements",
                        ],
                        modifications: {
                            beginner: "No weights, just body movement",
                            advanced: "Heavier weights or single arm",
                        },
                    },
                    {
                        name: "Modified Burpee",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 6,
                        restTime: 90,
                        instructions: [
                            "Squat down, place hands on floor",
                            "Step back to plank (don't jump)",
                            "Step forward and stand up",
                            "Focus on controlled movement",
                        ],
                        modifications: {
                            beginner: "Remove the plank step",
                            advanced: "Add push-up or jump",
                        },
                    },
                    {
                        name: "Plank Hold",
                        type: "strength" as const,
                        numberOfSets: 3,
                        duration: 45,
                        restTime: 90,
                        instructions: [
                            "Hold plank position",
                            "Keep body straight from head to heels",
                            "Engage core and breathe steadily",
                            "Focus on maintaining form",
                        ],
                        modifications: {
                            beginner: "On knees or shorter duration",
                            advanced: "Add leg lifts or weight",
                        },
                    },
                ],
                // Day 4: Arms & Shoulders
                [
                    {
                        name: "Wall Handstand",
                        type: "strength" as const,
                        numberOfSets: 3,
                        duration: 30,
                        restTime: 90,
                        instructions: [
                            "Place hands on floor, feet on wall",
                            "Walk feet up wall to comfortable height",
                            "Hold position",
                            "Build shoulder strength",
                        ],
                        modifications: {
                            beginner: "Keep feet lower on wall",
                            advanced: "Walk feet higher or add push-ups",
                        },
                    },
                    {
                        name: "Arm Circles",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 15,
                        restTime: 60,
                        instructions: [
                            "Extend arms to sides",
                            "Make controlled circles",
                            "Forward then backward",
                            "Feel the shoulder burn",
                        ],
                        modifications: {
                            beginner: "Smaller circles, shorter duration",
                            advanced: "Larger circles or add light weights",
                        },
                    },
                    {
                        name: "Isometric Bicep Hold",
                        type: "strength" as const,
                        numberOfSets: 3,
                        duration: 30,
                        restTime: 90,
                        instructions: [
                            "Bend elbows to 90 degrees",
                            "Hold position without moving",
                            "Feel the bicep tension",
                            "Breathe steadily",
                        ],
                        modifications: {
                            beginner: "Shorter hold time",
                            advanced: "Add resistance or longer hold",
                        },
                    },
                ],
                // Day 5: Active Recovery
                [
                    {
                        name: "Gentle Movement Flow",
                        type: "flexibility" as const,
                        numberOfSets: 1,
                        duration: 600,
                        restTime: 0,
                        instructions: [
                            "Light stretching and mobility work",
                            "Focus on areas worked this week",
                            "Move slowly and mindfully",
                            "Promote recovery",
                        ],
                        modifications: {
                            beginner: "Very gentle movements",
                            advanced:
                                "Add light resistance or deeper stretches",
                        },
                    },
                    {
                        name: "Recovery Walk",
                        type: "cardio" as const,
                        numberOfSets: 1,
                        duration: 900,
                        restTime: 0,
                        instructions: [
                            "Easy-paced walking",
                            "Focus on breathing",
                            "Enjoy the movement",
                            "Aid muscle recovery",
                        ],
                        modifications: {
                            beginner: "Shorter duration",
                            advanced: "Longer duration or varied terrain",
                        },
                    },
                ],
                // Day 6: Flexibility & Core
                [
                    {
                        name: "Basic Yoga Flow",
                        type: "flexibility" as const,
                        numberOfSets: 3,
                        duration: 120,
                        restTime: 30,
                        instructions: [
                            "Child's pose to downward dog",
                            "Cobra to child's pose",
                            "Hold each position for 30 seconds",
                            "Focus on breathing",
                        ],
                        modifications: {
                            beginner: "Shorter holds, simpler positions",
                            advanced: "Add warrior poses or longer holds",
                        },
                    },
                    {
                        name: "Dead Bug",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 10,
                        restTime: 60,
                        instructions: [
                            "Lie on back, arms up, knees bent",
                            "Lower opposite arm and leg slowly",
                            "Return to start and switch sides",
                            "Keep core engaged",
                        ],
                        modifications: {
                            beginner: "Move one limb at a time",
                            advanced: "Add resistance band or hold longer",
                        },
                    },
                    {
                        name: "Cat-Cow Stretch",
                        type: "flexibility" as const,
                        numberOfSets: 3,
                        reps: 10,
                        restTime: 30,
                        instructions: [
                            "Start on hands and knees",
                            "Arch back looking up (cow)",
                            "Round back looking down (cat)",
                            "Move slowly and controlled",
                        ],
                        modifications: {
                            beginner: "Smaller range of motion",
                            advanced: "Hold positions longer or add side bends",
                        },
                    },
                ],
            ],
            [FITNESS_EXPERIENCE_LEVELS.INTERMEDIATE]: [
                // Day 0: Upper Body Push (Chest, Shoulders, Triceps)
                [
                    {
                        name: "Dumbbell Bench Press",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 8,
                        restTime: 120,
                        instructions: [
                            "Lie on bench with dumbbells at chest level",
                            "Press weights up with control",
                            "Lower slowly for 3 seconds",
                            "Focus on chest contraction",
                        ],
                        modifications: {
                            beginner: "Use lighter weights or incline bench",
                            advanced: "Heavier weights or add pause at bottom",
                        },
                    },
                    {
                        name: "Overhead Dumbbell Press",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 10,
                        restTime: 90,
                        instructions: [
                            "Sit or stand with dumbbells at shoulder height",
                            "Press weights overhead",
                            "Lower with control",
                            "Keep core engaged",
                        ],
                        modifications: {
                            beginner: "Seated variation for stability",
                            advanced: "Standing or single arm variation",
                        },
                    },
                    {
                        name: "Dumbbell Tricep Extensions",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 12,
                        restTime: 90,
                        instructions: [
                            "Lie on bench holding dumbbell overhead",
                            "Lower weight behind head by bending elbows",
                            "Extend back to start position",
                            "Keep upper arms stationary",
                        ],
                        modifications: {
                            beginner:
                                "Use lighter weight or two-handed version",
                            advanced: "Single arm or heavier weight",
                        },
                    },
                    {
                        name: "Dumbbell Flyes",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 12,
                        restTime: 90,
                        instructions: [
                            "Lie on bench with arms extended",
                            "Lower weights in wide arc",
                            "Feel stretch in chest",
                            "Bring weights together above chest",
                        ],
                        modifications: {
                            beginner: "Lighter weights or incline angle",
                            advanced: "Decline angle or heavier weights",
                        },
                    },
                ],
                // Day 1: Lower Body (Quads, Glutes, Hamstrings)
                [
                    {
                        name: "Barbell Squats",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 8,
                        restTime: 150,
                        instructions: [
                            "Position barbell on upper back",
                            "Squat down keeping chest up",
                            "Drive through heels to stand",
                            "Focus on depth and control",
                        ],
                        modifications: {
                            beginner: "Goblet squats or lighter weight",
                            advanced: "Front squats or pause squats",
                        },
                    },
                    {
                        name: "Romanian Deadlifts",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 10,
                        restTime: 120,
                        instructions: [
                            "Hold barbell with overhand grip",
                            "Hinge at hips, lower weight",
                            "Feel stretch in hamstrings",
                            "Drive hips forward to return",
                        ],
                        modifications: {
                            beginner: "Dumbbells or lighter weight",
                            advanced: "Single leg or deficit position",
                        },
                    },
                    {
                        name: "Dumbbell Lunges",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 12,
                        restTime: 90,
                        instructions: [
                            "Hold dumbbells at sides",
                            "Step forward into lunge",
                            "Lower back knee toward ground",
                            "Push back to starting position",
                        ],
                        modifications: {
                            beginner: "Bodyweight or lighter dumbbells",
                            advanced: "Walking lunges or heavier weight",
                        },
                    },
                    {
                        name: "Calf Raises",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 15,
                        restTime: 60,
                        instructions: [
                            "Hold dumbbells or use calf raise machine",
                            "Rise up on balls of feet",
                            "Hold peak contraction",
                            "Lower with control",
                        ],
                        modifications: {
                            beginner: "Bodyweight only",
                            advanced: "Single leg or heavier weight",
                        },
                    },
                ],
                // Day 2: Upper Body Pull (Back, Biceps)
                [
                    {
                        name: "Barbell Rows",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 8,
                        restTime: 120,
                        instructions: [
                            "Hinge at hips holding barbell",
                            "Pull bar to lower chest",
                            "Squeeze shoulder blades together",
                            "Lower with control",
                        ],
                        modifications: {
                            beginner: "Dumbbell rows or lighter weight",
                            advanced: "Pendlay rows or heavier weight",
                        },
                    },
                    {
                        name: "Lat Pulldowns",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 10,
                        restTime: 90,
                        instructions: [
                            "Sit at lat pulldown machine",
                            "Pull bar down to upper chest",
                            "Squeeze lats at bottom",
                            "Control the weight up",
                        ],
                        modifications: {
                            beginner: "Assisted pull-ups or resistance band",
                            advanced: "Weighted pull-ups",
                        },
                    },
                    {
                        name: "Dumbbell Bicep Curls",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 12,
                        restTime: 90,
                        instructions: [
                            "Hold dumbbells at sides",
                            "Curl weights up with control",
                            "Squeeze biceps at top",
                            "Lower slowly",
                        ],
                        modifications: {
                            beginner: "Lighter weights or hammer curls",
                            advanced: "Alternating or concentration curls",
                        },
                    },
                    {
                        name: "Face Pulls",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 15,
                        restTime: 60,
                        instructions: [
                            "Use cable machine or resistance band",
                            "Pull handles to face level",
                            "Squeeze rear delts",
                            "Control the return",
                        ],
                        modifications: {
                            beginner: "Resistance band or lighter weight",
                            advanced: "Heavier weight or single arm",
                        },
                    },
                ],
                // Day 3: Push/Pull Combination
                [
                    {
                        name: "Dumbbell Thrusters",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 10,
                        restTime: 120,
                        instructions: [
                            "Hold dumbbells at shoulder height",
                            "Squat down keeping chest up",
                            "Drive up and press weights overhead",
                            "Combine movements fluidly",
                        ],
                        modifications: {
                            beginner: "Lighter weights or separate movements",
                            advanced: "Heavier weights or single arm",
                        },
                    },
                    {
                        name: "Renegade Rows",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 8,
                        restTime: 120,
                        instructions: [
                            "Start in plank position holding dumbbells",
                            "Row one dumbbell to ribs",
                            "Keep hips stable",
                            "Alternate arms",
                        ],
                        modifications: {
                            beginner: "Lighter weights or knees down",
                            advanced: "Heavier weights or add push-up",
                        },
                    },
                    {
                        name: "Dumbbell Step-ups",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 12,
                        restTime: 90,
                        instructions: [
                            "Hold dumbbells, step onto bench",
                            "Drive through heel of stepping leg",
                            "Step down with control",
                            "Alternate legs",
                        ],
                        modifications: {
                            beginner: "Lower step or bodyweight",
                            advanced: "Higher step or heavier weights",
                        },
                    },
                ],
                // Day 4: Arms & Shoulders Focus
                [
                    {
                        name: "Barbell Curls",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 10,
                        restTime: 90,
                        instructions: [
                            "Hold barbell with underhand grip",
                            "Curl bar up keeping elbows stationary",
                            "Squeeze biceps at top",
                            "Lower with control",
                        ],
                        modifications: {
                            beginner: "EZ-bar or lighter weight",
                            advanced: "21s or cheat curls",
                        },
                    },
                    {
                        name: "Close-Grip Bench Press",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 8,
                        restTime: 120,
                        instructions: [
                            "Lie on bench with narrow grip",
                            "Lower bar to chest",
                            "Press up focusing on triceps",
                            "Keep elbows close to body",
                        ],
                        modifications: {
                            beginner: "Dumbbell press or lighter weight",
                            advanced: "Heavier weight or tempo variation",
                        },
                    },
                    {
                        name: "Lateral Raises",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 12,
                        restTime: 60,
                        instructions: [
                            "Hold dumbbells at sides",
                            "Raise arms out to shoulder height",
                            "Control the movement",
                            "Lower slowly",
                        ],
                        modifications: {
                            beginner: "Lighter weights or resistance band",
                            advanced: "Heavier weights or drop sets",
                        },
                    },
                    {
                        name: "Dips",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 10,
                        restTime: 90,
                        instructions: [
                            "Use dip bars or chair",
                            "Lower body by bending elbows",
                            "Press back up",
                            "Keep body upright",
                        ],
                        modifications: {
                            beginner: "Assisted dips or chair dips",
                            advanced: "Weighted dips",
                        },
                    },
                ],
                // Day 5: Full Body Power
                [
                    {
                        name: "Deadlifts",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 6,
                        restTime: 150,
                        instructions: [
                            "Stand with barbell over mid-foot",
                            "Hinge at hips and grab bar",
                            "Drive through heels to stand",
                            "Keep bar close to body",
                        ],
                        modifications: {
                            beginner: "Trap bar or lighter weight",
                            advanced: "Sumo deadlifts or deficit pulls",
                        },
                    },
                    {
                        name: "Dumbbell Clean and Press",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 8,
                        restTime: 120,
                        instructions: [
                            "Start with dumbbells at sides",
                            "Clean to shoulders in one motion",
                            "Press overhead",
                            "Lower with control",
                        ],
                        modifications: {
                            beginner: "Separate the movements",
                            advanced: "Heavier weights or single arm",
                        },
                    },
                    {
                        name: "Farmer's Walks",
                        type: "strength" as const,
                        numberOfSets: 3,
                        duration: 45,
                        restTime: 90,
                        instructions: [
                            "Hold heavy dumbbells at sides",
                            "Walk with good posture",
                            "Keep core engaged",
                            "Maintain grip throughout",
                        ],
                        modifications: {
                            beginner: "Lighter weights or shorter distance",
                            advanced: "Heavier weights or uneven loading",
                        },
                    },
                ],
                // Day 6: Active Recovery & Mobility
                [
                    {
                        name: "Light Dumbbell Complex",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 10,
                        restTime: 60,
                        instructions: [
                            "Use light dumbbells",
                            "Perform squats, rows, and presses",
                            "Focus on movement quality",
                            "Keep intensity low",
                        ],
                        modifications: {
                            beginner: "Even lighter weights",
                            advanced: "Add more complex movements",
                        },
                    },
                    {
                        name: "Resistance Band Stretches",
                        type: "flexibility" as const,
                        numberOfSets: 2,
                        duration: 300,
                        restTime: 60,
                        instructions: [
                            "Use resistance band for assisted stretches",
                            "Focus on tight areas",
                            "Hold stretches for 30-60 seconds",
                            "Breathe deeply",
                        ],
                        modifications: {
                            beginner: "Lighter resistance or shorter holds",
                            advanced: "Deeper stretches or PNF techniques",
                        },
                    },
                    {
                        name: "Foam Rolling",
                        type: "flexibility" as const,
                        numberOfSets: 1,
                        duration: 600,
                        restTime: 0,
                        instructions: [
                            "Roll major muscle groups",
                            "Spend extra time on tight spots",
                            "Apply moderate pressure",
                            "Promote recovery",
                        ],
                        modifications: {
                            beginner: "Lighter pressure or tennis ball",
                            advanced: "Lacrosse ball or deeper pressure",
                        },
                    },
                ],
            ],
            [FITNESS_EXPERIENCE_LEVELS.ADVANCED]: [
                // Day 0: Heavy Compound Push (Chest, Shoulders, Triceps)
                [
                    {
                        name: "Barbell Bench Press",
                        type: "strength" as const,
                        numberOfSets: 5,
                        reps: 5,
                        restTime: 180,
                        instructions: [
                            "Heavy barbell bench press",
                            "Lower bar to chest with control",
                            "Drive through feet and press up",
                            "Focus on progressive overload",
                        ],
                        modifications: {
                            beginner: "Lighter weight or dumbbell press",
                            advanced: "Pause reps or chains/bands",
                        },
                    },
                    {
                        name: "Weighted Dips",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 6,
                        restTime: 150,
                        instructions: [
                            "Add weight belt or hold dumbbell",
                            "Lower body with control",
                            "Press up explosively",
                            "Keep torso upright",
                        ],
                        modifications: {
                            beginner: "Bodyweight dips or assisted",
                            advanced: "More weight or ring dips",
                        },
                    },
                    {
                        name: "Overhead Barbell Press",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 6,
                        restTime: 150,
                        instructions: [
                            "Press barbell from shoulder height",
                            "Drive through legs and core",
                            "Press overhead with control",
                            "Lower to starting position",
                        ],
                        modifications: {
                            beginner: "Seated press or dumbbells",
                            advanced: "Push press or behind neck press",
                        },
                    },
                    {
                        name: "Close-Grip Barbell Press",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 8,
                        restTime: 120,
                        instructions: [
                            "Narrow grip on barbell",
                            "Lower to chest focusing on triceps",
                            "Press up with tricep emphasis",
                            "Keep elbows close to body",
                        ],
                        modifications: {
                            beginner: "Dumbbell press or lighter weight",
                            advanced: "Floor press or tempo variation",
                        },
                    },
                    {
                        name: "Heavy Dumbbell Flyes",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 10,
                        restTime: 90,
                        instructions: [
                            "Heavy dumbbells in wide arc motion",
                            "Feel deep stretch in chest",
                            "Control the weight throughout",
                            "Focus on muscle tension",
                        ],
                        modifications: {
                            beginner: "Lighter weights or cable flyes",
                            advanced: "Decline angle or heavier weights",
                        },
                    },
                ],
                // Day 1: Heavy Compound Pull (Back, Biceps)
                [
                    {
                        name: "Weighted Pull-ups",
                        type: "strength" as const,
                        numberOfSets: 5,
                        reps: 5,
                        restTime: 180,
                        instructions: [
                            "Add significant weight with belt",
                            "Full range of motion",
                            "Control the negative phase",
                            "Focus on lat engagement",
                        ],
                        modifications: {
                            beginner: "Assisted pull-ups or lat pulldowns",
                            advanced: "More weight or L-sit pull-ups",
                        },
                    },
                    {
                        name: "Barbell Rows (Pendlay)",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 6,
                        restTime: 150,
                        instructions: [
                            "Barbell starts on floor each rep",
                            "Explosive pull to lower chest",
                            "Squeeze shoulder blades hard",
                            "Return bar to floor with control",
                        ],
                        modifications: {
                            beginner: "Bent-over rows or T-bar rows",
                            advanced: "Heavier weight or deficit position",
                        },
                    },
                    {
                        name: "Heavy Dumbbell Rows",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 8,
                        restTime: 120,
                        instructions: [
                            "Single arm with heavy dumbbell",
                            "Full stretch at bottom",
                            "Pull to hip with control",
                            "Focus on lat and rhomboid activation",
                        ],
                        modifications: {
                            beginner: "Two-arm dumbbell rows",
                            advanced: "Kroc rows or heavier weight",
                        },
                    },
                    {
                        name: "Barbell Curls (Heavy)",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 6,
                        restTime: 120,
                        instructions: [
                            "Heavy barbell with strict form",
                            "Curl up with bicep focus",
                            "Control the negative",
                            "No momentum or swinging",
                        ],
                        modifications: {
                            beginner: "EZ-bar or lighter weight",
                            advanced: "Cheat curls or 21s",
                        },
                    },
                    {
                        name: "Shrugs (Barbell)",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 12,
                        restTime: 90,
                        instructions: [
                            "Heavy barbell or dumbbells",
                            "Shrug shoulders up and back",
                            "Hold peak contraction",
                            "Lower with control",
                        ],
                        modifications: {
                            beginner: "Lighter weight or dumbbell shrugs",
                            advanced: "Behind-the-back or trap bar shrugs",
                        },
                    },
                ],
                // Day 2: Heavy Lower Body Power
                [
                    {
                        name: "Barbell Back Squats (Heavy)",
                        type: "strength" as const,
                        numberOfSets: 5,
                        reps: 5,
                        restTime: 180,
                        instructions: [
                            "Heavy barbell on upper back",
                            "Deep squat below parallel",
                            "Drive through heels explosively",
                            "Focus on progressive overload",
                        ],
                        modifications: {
                            beginner: "Front squats or lighter weight",
                            advanced: "Pause squats or box squats",
                        },
                    },
                    {
                        name: "Conventional Deadlifts",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 5,
                        restTime: 180,
                        instructions: [
                            "Heavy barbell from floor",
                            "Hip hinge movement pattern",
                            "Drive through heels to lockout",
                            "Keep bar close to body",
                        ],
                        modifications: {
                            beginner: "Trap bar or Romanian deadlifts",
                            advanced: "Deficit deadlifts or sumo stance",
                        },
                    },
                    {
                        name: "Bulgarian Split Squats (Weighted)",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 8,
                        restTime: 120,
                        instructions: [
                            "Heavy dumbbells or barbell",
                            "Rear foot elevated on bench",
                            "Lower into deep lunge",
                            "Drive through front heel",
                        ],
                        modifications: {
                            beginner: "Bodyweight or lighter dumbbells",
                            advanced: "Barbell on back or deficit position",
                        },
                    },
                    {
                        name: "Walking Lunges (Heavy)",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 12,
                        restTime: 120,
                        instructions: [
                            "Heavy dumbbells or barbell",
                            "Step forward into lunge",
                            "Alternate legs walking forward",
                            "Maintain upright torso",
                        ],
                        modifications: {
                            beginner: "Stationary lunges or lighter weight",
                            advanced: "Overhead walking lunges",
                        },
                    },
                    {
                        name: "Barbell Hip Thrusts",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 10,
                        restTime: 90,
                        instructions: [
                            "Heavy barbell across hips",
                            "Shoulders on bench",
                            "Drive hips up squeezing glutes",
                            "Hold peak contraction",
                        ],
                        modifications: {
                            beginner: "Bodyweight or dumbbell version",
                            advanced: "Single leg or pause reps",
                        },
                    },
                ],
                // Day 3: Advanced Upper Body Hypertrophy
                [
                    {
                        name: "Incline Barbell Press",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 8,
                        restTime: 150,
                        instructions: [
                            "Incline bench at 30-45 degrees",
                            "Heavy barbell press",
                            "Focus on upper chest development",
                            "Control the negative phase",
                        ],
                        modifications: {
                            beginner: "Dumbbell incline press",
                            advanced: "Pause reps or chains",
                        },
                    },
                    {
                        name: "T-Bar Rows",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 8,
                        restTime: 120,
                        instructions: [
                            "Heavy T-bar or landmine setup",
                            "Pull to lower chest",
                            "Squeeze shoulder blades",
                            "Control the stretch",
                        ],
                        modifications: {
                            beginner: "Chest-supported rows",
                            advanced: "Free-standing or heavier weight",
                        },
                    },
                    {
                        name: "Dumbbell Shoulder Press (Heavy)",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 8,
                        restTime: 120,
                        instructions: [
                            "Heavy dumbbells from shoulder height",
                            "Press up with control",
                            "Full range of motion",
                            "Focus on deltoid activation",
                        ],
                        modifications: {
                            beginner: "Seated variation or lighter weight",
                            advanced: "Single arm or Arnold press",
                        },
                    },
                    {
                        name: "Weighted Tricep Dips",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 10,
                        restTime: 90,
                        instructions: [
                            "Heavy weight plate or dumbbell",
                            "Deep dip focusing on triceps",
                            "Press up explosively",
                            "Control the descent",
                        ],
                        modifications: {
                            beginner: "Bodyweight or assisted dips",
                            advanced: "Ring dips or more weight",
                        },
                    },
                ],
                // Day 4: Power and Olympic Movements
                [
                    {
                        name: "Power Cleans",
                        type: "strength" as const,
                        numberOfSets: 5,
                        reps: 3,
                        restTime: 180,
                        instructions: [
                            "Explosive pull from floor",
                            "Catch barbell at shoulders",
                            "Full hip extension",
                            "Focus on speed and power",
                        ],
                        modifications: {
                            beginner: "Hang cleans or dumbbell cleans",
                            advanced: "Full cleans or clean and jerk",
                        },
                    },
                    {
                        name: "Front Squats (Heavy)",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 6,
                        restTime: 150,
                        instructions: [
                            "Barbell in front rack position",
                            "Deep squat with upright torso",
                            "Drive up through heels",
                            "Maintain front rack position",
                        ],
                        modifications: {
                            beginner: "Goblet squats or cross-arm grip",
                            advanced: "Pause front squats or heavier weight",
                        },
                    },
                    {
                        name: "Push Press",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 5,
                        restTime: 150,
                        instructions: [
                            "Slight knee bend and drive",
                            "Press barbell overhead explosively",
                            "Use leg drive to assist press",
                            "Lock out overhead",
                        ],
                        modifications: {
                            beginner: "Strict press or dumbbell version",
                            advanced: "Jerk or heavier weight",
                        },
                    },
                    {
                        name: "Barbell Rows (Explosive)",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 6,
                        restTime: 120,
                        instructions: [
                            "Explosive pull to lower chest",
                            "Focus on speed of contraction",
                            "Control the negative",
                            "Reset between reps",
                        ],
                        modifications: {
                            beginner: "Regular tempo rows",
                            advanced: "Heavier weight or deficit position",
                        },
                    },
                    {
                        name: "Farmer's Walk (Heavy)",
                        type: "strength" as const,
                        numberOfSets: 3,
                        duration: 60,
                        restTime: 120,
                        instructions: [
                            "Extremely heavy dumbbells or farmers handles",
                            "Walk with perfect posture",
                            "Grip and core challenge",
                            "Maintain speed throughout",
                        ],
                        modifications: {
                            beginner: "Lighter weight or shorter distance",
                            advanced: "Uneven loading or obstacles",
                        },
                    },
                ],
                // Day 5: Advanced Bodyweight + Weight
                [
                    {
                        name: "Weighted Pistol Squats",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 5,
                        restTime: 150,
                        instructions: [
                            "Hold dumbbell or weight plate",
                            "Single leg squat to full depth",
                            "Control throughout range",
                            "Alternate legs each set",
                        ],
                        modifications: {
                            beginner: "Assisted pistol squats",
                            advanced: "Heavier weight or deficit",
                        },
                    },
                    {
                        name: "Muscle-ups (Weighted)",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 3,
                        restTime: 180,
                        instructions: [
                            "Add weight belt or vest",
                            "Pull up and transition over bar",
                            "Control both phases",
                            "Full range of motion",
                        ],
                        modifications: {
                            beginner: "Assisted muscle-ups",
                            advanced: "More weight or ring muscle-ups",
                        },
                    },
                    {
                        name: "Handstand Push-ups (Weighted)",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 5,
                        restTime: 180,
                        instructions: [
                            "Add weight vest or ankle weights",
                            "Full handstand position",
                            "Lower head to ground",
                            "Press back up with control",
                        ],
                        modifications: {
                            beginner: "Wall-assisted handstand push-ups",
                            advanced: "Freestanding or more weight",
                        },
                    },
                    {
                        name: "Weighted Chin-ups",
                        type: "strength" as const,
                        numberOfSets: 4,
                        reps: 6,
                        restTime: 150,
                        instructions: [
                            "Underhand grip with added weight",
                            "Full range of motion",
                            "Focus on bicep and lat engagement",
                            "Control the negative",
                        ],
                        modifications: {
                            beginner: "Assisted chin-ups",
                            advanced: "More weight or L-sit chin-ups",
                        },
                    },
                ],
                // Day 6: Recovery and Accessory Work
                [
                    {
                        name: "Light Barbell Complex",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 8,
                        restTime: 90,
                        instructions: [
                            "Light barbell (40-50% max)",
                            "Combine squats, rows, presses",
                            "Focus on movement quality",
                            "Promote blood flow and recovery",
                        ],
                        modifications: {
                            beginner: "Even lighter weight or dumbbells",
                            advanced: "Add more complex movements",
                        },
                    },
                    {
                        name: "Dumbbell Accessory Circuit",
                        type: "strength" as const,
                        numberOfSets: 3,
                        reps: 12,
                        restTime: 60,
                        instructions: [
                            "Light dumbbells for high reps",
                            "Lateral raises, rear delts, curls",
                            "Focus on muscle activation",
                            "Pump and recovery work",
                        ],
                        modifications: {
                            beginner: "Lighter weights or resistance bands",
                            advanced: "Add drop sets or supersets",
                        },
                    },
                    {
                        name: "Advanced Stretching",
                        type: "flexibility" as const,
                        numberOfSets: 2,
                        duration: 600,
                        restTime: 60,
                        instructions: [
                            "Deep stretches for all major groups",
                            "Hold stretches for 60+ seconds",
                            "Focus on problem areas",
                            "Use PNF techniques",
                        ],
                        modifications: {
                            beginner: "Shorter holds or basic stretches",
                            advanced: "Weighted stretches or deeper positions",
                        },
                    },
                    {
                        name: "Mobility and Activation",
                        type: "flexibility" as const,
                        numberOfSets: 1,
                        duration: 900,
                        restTime: 0,
                        instructions: [
                            "Dynamic movements and activation",
                            "Focus on movement patterns",
                            "Prepare body for next week",
                            "Address any restrictions",
                        ],
                        modifications: {
                            beginner: "Basic mobility routine",
                            advanced: "Complex movement patterns",
                        },
                    },
                ],
            ],
        },
    };

    return exerciseDatabase[goal][fitnessLevel][count];
};
