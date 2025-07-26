import { apiClient } from "../lib/api";

// Nutrition service
export const nutritionService = {
  // Get nutrition entries
  searchFoods: (query: string): Promise<any[]> => {
    return apiClient.get(`/search-food?query=${encodeURIComponent(query)}`);
  },
  autoCompleteFoods: (query: string): Promise<any[]> => {
    return apiClient.get(
      `/food-auto-complete?query=${encodeURIComponent(query)}`,
    );
  },
};
