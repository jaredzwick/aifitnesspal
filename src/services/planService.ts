import { apiClient } from "../lib/api";
import { FitnessUser, PersonalizedPlan } from "../../common";

export const planService = {
    generatePlan: (
        userData: Partial<FitnessUser>,
    ): Promise<PersonalizedPlan> => {
        return apiClient.post(`/plan-recommendation`, userData, {}, {
            anon: true,
        });
    },
};
