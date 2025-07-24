import {
    FITNESS_GOALS,
    FitnessUser,
    MealPlanTemplate,
    MealSuggestion,
    NutritionRegimen,
} from "../../../common/index.ts";

export const generateNutritionRegimen = (
    userData: FitnessUser,
): NutritionRegimen => {
    const dailyCalorieTarget = calculateDailyCalories(userData);
    const macroTargets = calculateMacroTargets(
        dailyCalorieTarget,
        userData.goal,
    );
    const mealPlan = generateMealPlan(dailyCalorieTarget, macroTargets);

    return {
        dailyCalorieTarget,
        macroTargets,
        mealPlan,
        hydrationTarget: calculateHydrationTarget(userData.weight || 70),
        supplements: recommendSupplements(
            userData.goal,
            userData.dietaryRestrictions,
        ),
    };
};

const calculateDailyCalories = (userData: FitnessUser): number => {
    const weight = userData.weight || 70;
    const height = userData.height || 170;
    const age = userData.age || 30;
    const gender = userData.gender || "male";
    const activityLevel = "moderately_active";
    const primaryGoal = userData.goal;

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr: number;
    if (gender === "male") {
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
        extremely_active: 1.9,
    };

    const tdee = bmr *
        (activityMultipliers[
            activityLevel as keyof typeof activityMultipliers
        ] || activityMultipliers.moderately_active);

    // Adjust for goals
    const goalAdjustments = {
        fat_loss: -500, // 500 calorie deficit
        muscle_building: +300, // 300 calorie surplus
        maintenance: 0,
        strength: +200,
        endurance: +100,
    };

    return Math.round(
        tdee +
            (goalAdjustments[primaryGoal as keyof typeof goalAdjustments] || 0),
    );
};

const calculateMacroTargets = (calories: number, primaryGoal: string) => {
    const macroRatios = {
        fat_loss: { protein: 0.35, carbs: 0.35, fat: 0.30 },
        muscle_building: { protein: 0.30, carbs: 0.45, fat: 0.25 },
        maintenance: { protein: 0.25, carbs: 0.45, fat: 0.30 },
        strength: { protein: 0.30, carbs: 0.40, fat: 0.30 },
        endurance: { protein: 0.20, carbs: 0.55, fat: 0.25 },
    };

    const ratios = macroRatios[primaryGoal as keyof typeof macroRatios] ||
        macroRatios.maintenance;

    return {
        protein: Math.round((calories * ratios.protein) / 4), // 4 calories per gram
        carbs: Math.round((calories * ratios.carbs) / 4),
        fat: Math.round((calories * ratios.fat) / 9), // 9 calories per gram
        proteinPercentage: Math.round(ratios.protein * 100),
        carbsPercentage: Math.round(ratios.carbs * 100),
        fatPercentage: Math.round(ratios.fat * 100),
    };
};

const generateMealPlan = (
    dailyCalories: number,
    macroTargets: any,
): MealPlanTemplate[] => {
    const mealDistribution = {
        breakfast: 0.25,
        lunch: 0.35,
        dinner: 0.30,
        snack: 0.10,
    };

    return Object.entries(mealDistribution).map(([mealType, percentage]) => ({
        mealType: mealType as "breakfast" | "lunch" | "dinner" | "snack",
        targetCalories: Math.round(dailyCalories * percentage),
        targetMacros: {
            protein: Math.round(macroTargets.protein * percentage),
            carbs: Math.round(macroTargets.carbs * percentage),
            fat: Math.round(macroTargets.fat * percentage),
        },
        suggestions: getMealSuggestions(
            mealType,
            Math.round(dailyCalories * percentage),
        ),
    }));
};

const getMealSuggestions = (
    mealType: string,
    targetCalories: number,
): MealSuggestion[] => {
    const mealDatabase = {
        breakfast: [
            {
                name: "Protein Oatmeal Bowl",
                ingredients: [
                    "Oats",
                    "Protein powder",
                    "Berries",
                    "Almond butter",
                ],
                calories: 350,
                macros: { protein: 25, carbs: 45, fat: 8 },
                prepTime: 10,
                difficulty: "easy" as const,
            },
            {
                name: "Veggie Scramble",
                ingredients: ["Eggs", "Spinach", "Tomatoes", "Cheese"],
                calories: 300,
                macros: { protein: 20, carbs: 8, fat: 18 },
                prepTime: 15,
                difficulty: "medium" as const,
            },
        ],
        lunch: [
            {
                name: "Grilled Chicken Salad",
                ingredients: [
                    "Chicken breast",
                    "Mixed greens",
                    "Quinoa",
                    "Olive oil dressing",
                ],
                calories: 450,
                macros: { protein: 35, carbs: 30, fat: 15 },
                prepTime: 20,
                difficulty: "medium" as const,
            },
            {
                name: "Turkey Wrap",
                ingredients: [
                    "Whole wheat tortilla",
                    "Turkey",
                    "Avocado",
                    "Vegetables",
                ],
                calories: 400,
                macros: { protein: 25, carbs: 35, fat: 18 },
                prepTime: 10,
                difficulty: "easy" as const,
            },
        ],
        dinner: [
            {
                name: "Salmon with Sweet Potato",
                ingredients: [
                    "Salmon fillet",
                    "Sweet potato",
                    "Broccoli",
                    "Olive oil",
                ],
                calories: 500,
                macros: { protein: 35, carbs: 40, fat: 20 },
                prepTime: 30,
                difficulty: "medium" as const,
            },
            {
                name: "Lean Beef Stir-fry",
                ingredients: [
                    "Lean beef",
                    "Mixed vegetables",
                    "Brown rice",
                    "Soy sauce",
                ],
                calories: 480,
                macros: { protein: 30, carbs: 45, fat: 15 },
                prepTime: 25,
                difficulty: "medium" as const,
            },
        ],
        snack: [
            {
                name: "Greek Yogurt with Nuts",
                ingredients: ["Greek yogurt", "Mixed nuts", "Honey"],
                calories: 200,
                macros: { protein: 15, carbs: 12, fat: 10 },
                prepTime: 5,
                difficulty: "easy" as const,
            },
            {
                name: "Apple with Peanut Butter",
                ingredients: ["Apple", "Natural peanut butter"],
                calories: 180,
                macros: { protein: 6, carbs: 20, fat: 8 },
                prepTime: 2,
                difficulty: "easy" as const,
            },
        ],
    };

    return mealDatabase[mealType as keyof typeof mealDatabase] || [];
};

const calculateHydrationTarget = (weight: number): number => {
    // Basic formula: 35ml per kg of body weight, minimum 2L
    return Math.max(2, Math.round((weight * 35) / 1000 * 10) / 10);
};

const recommendSupplements = (
    primaryGoal: string,
    dietaryRestrictions: string[],
): string[] => {
    const baseSupplements = ["Multivitamin", "Omega-3"];

    const goalSupplements = {
        [FITNESS_GOALS.FAT_LOSS]: ["Green tea extract", "L-Carnitine"],
        [FITNESS_GOALS.MUSCLE_GROWTH]: ["Whey protein", "Creatine", "BCAAs"],
    };

    const supplements = [
        ...baseSupplements,
        ...(goalSupplements[primaryGoal as keyof typeof goalSupplements] || []),
    ];

    // Filter based on dietary restrictions
    if (
        dietaryRestrictions.includes("vegan") ||
        dietaryRestrictions.includes("vegetarian")
    ) {
        return supplements.filter((sup) => sup !== "Whey protein").concat([
            "Plant protein",
        ]);
    }

    return supplements;
};
