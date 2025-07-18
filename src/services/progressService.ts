import { apiClient } from '../lib/api';

// Progress types
export interface ProgressPhoto {
  id: string;
  user_id: string;
  image_url: string;
  thumbnail_url?: string;
  photo_type: 'front' | 'side' | 'back' | 'other';
  taken_at: string;
  notes?: string;
  weight_at_time?: number;
  body_fat_percentage?: number;
}

export interface BodyMeasurement {
  id: string;
  user_id: string;
  measured_at: string;
  weight?: number;
  body_fat_percentage?: number;
  muscle_mass?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  bicep_left?: number;
  bicep_right?: number;
  thigh_left?: number;
  thigh_right?: number;
  notes?: string;
}

export interface UserGoal {
  id: string;
  user_id: string;
  goal_type: 'weight_loss' | 'weight_gain' | 'muscle_gain' | 'strength' | 'endurance' | 'custom';
  title: string;
  description?: string;
  target_value?: number;
  target_unit?: string;
  current_value?: number;
  target_date?: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  created_at: string;
  completed_at?: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_type: string;
  title: string;
  description: string;
  icon?: string;
  earned_at: string;
  metadata?: Record<string, any>;
}

// Progress service
export const progressService = {
  // Progress Photos
  getProgressPhotos: (): Promise<ProgressPhoto[]> => {
    return apiClient.get('/progress/photos');
  },

  uploadProgressPhoto: async (
    file: File,
    photoType: ProgressPhoto['photo_type'],
    notes?: string,
    weight?: number
  ): Promise<ProgressPhoto> => {
    // First upload the file
    const uploadResult = await apiClient.uploadFile(file, 'progress-photos', 'progress');
    
    // Then create the progress photo record
    return apiClient.post('/progress/photos', {
      image_url: uploadResult.data.publicUrl,
      thumbnail_url: uploadResult.data.publicUrl, // Could be processed separately
      photo_type: photoType,
      taken_at: new Date().toISOString(),
      notes,
      weight_at_time: weight,
    });
  },

  deleteProgressPhoto: (id: string): Promise<{ success: boolean }> => {
    return apiClient.delete(`/progress/photos?id=${id}`);
  },

  // Body Measurements
  getBodyMeasurements: (): Promise<BodyMeasurement[]> => {
    return apiClient.get('/progress/measurements');
  },

  addBodyMeasurement: (measurement: Omit<BodyMeasurement, 'id' | 'user_id'>): Promise<BodyMeasurement> => {
    return apiClient.post('/progress/measurements', measurement);
  },

  updateBodyMeasurement: (id: string, measurement: Partial<BodyMeasurement>): Promise<BodyMeasurement> => {
    return apiClient.put(`/progress/measurements?id=${id}`, measurement);
  },

  // Goals
  getGoals: (status?: UserGoal['status']): Promise<UserGoal[]> => {
    const params = status ? `?status=${status}` : '';
    return apiClient.get(`/progress/goals${params}`);
  },

  createGoal: (goal: Omit<UserGoal, 'id' | 'user_id' | 'created_at'>): Promise<UserGoal> => {
    return apiClient.post('/progress/goals', goal);
  },

  updateGoal: (id: string, goal: Partial<UserGoal>): Promise<UserGoal> => {
    return apiClient.put(`/progress/goals?id=${id}`, goal);
  },

  completeGoal: (id: string): Promise<UserGoal> => {
    return progressService.updateGoal(id, {
      status: 'completed',
      completed_at: new Date().toISOString(),
    });
  },

  deleteGoal: (id: string): Promise<{ success: boolean }> => {
    return apiClient.delete(`/progress/goals?id=${id}`);
  },

  // Achievements
  getAchievements: (): Promise<Achievement[]> => {
    return apiClient.get('/progress/achievements');
  },

  // Analytics helpers
  getWeightTrend: (days: number = 30): Promise<Array<{ date: string; weight: number }>> => {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000));
    
    return progressService.getBodyMeasurements().then(measurements => 
      measurements
        .filter(m => m.weight && new Date(m.measured_at) >= startDate)
        .map(m => ({
          date: m.measured_at.split('T')[0],
          weight: m.weight!,
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
    );
  },

  getProgressSummary: async (): Promise<{
    totalPhotos: number;
    latestWeight?: number;
    weightChange?: number;
    activeGoals: number;
    completedGoals: number;
    achievements: number;
  }> => {
    const [photos, measurements, goals, achievements] = await Promise.all([
      progressService.getProgressPhotos(),
      progressService.getBodyMeasurements(),
      progressService.getGoals(),
      progressService.getAchievements(),
    ]);

    const weightMeasurements = measurements
      .filter(m => m.weight)
      .sort((a, b) => new Date(b.measured_at).getTime() - new Date(a.measured_at).getTime());

    const latestWeight = weightMeasurements[0]?.weight;
    const previousWeight = weightMeasurements[1]?.weight;
    const weightChange = latestWeight && previousWeight ? latestWeight - previousWeight : undefined;

    return {
      totalPhotos: photos.length,
      latestWeight,
      weightChange,
      activeGoals: goals.filter(g => g.status === 'active').length,
      completedGoals: goals.filter(g => g.status === 'completed').length,
      achievements: achievements.length,
    };
  },
};