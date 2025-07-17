import { useState, useEffect } from 'react';
import { User as FitnessUser } from '../types';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<FitnessUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      setProfile(null);
      setLoading(false);
      setError(null);
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    setError(null);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .limit(1);

      if (error) {
        console.error('Error loading profile:', error);
        setError('Failed to load your profile. Please try refreshing the page.');
      } else if (data && data.length > 0) {
        const profileData = data[0];
        setProfile({
          id: profileData.user_id,
          name: profileData.name,
          email: user.email || '',
          age: profileData.age,
          height: profileData.height,
          weight: profileData.weight,
          fitnessLevel: profileData.fitness_level,
          goals: profileData.goals || [],
          preferences: {
            workoutTypes: profileData.workout_types || [],
            dietaryRestrictions: profileData.dietary_restrictions || [],
            availableTime: profileData.available_time || 30,
          },
          onboardingComplete: profileData.onboarding_complete || false,
        });
      }
    } catch (error) {
      console.error('Unexpected error loading profile:', error);
      setError('An unexpected error occurred while loading your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (profileData: Partial<FitnessUser>) => {
    if (!user) return { error: 'No user logged in' };

    setError(null);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          name: profileData.name,
          age: profileData.age,
          height: profileData.height,
          weight: profileData.weight,
          fitness_level: profileData.fitnessLevel,
          goals: profileData.goals,
          workout_types: profileData.preferences?.workoutTypes,
          dietary_restrictions: profileData.preferences?.dietaryRestrictions,
          available_time: profileData.preferences?.availableTime,
          onboarding_complete: profileData.onboardingComplete,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving profile:', error);
        setError('Failed to save your profile. Please try again.');
        return { error: error.message };
      }

      // Update local state
      setProfile(prev => prev ? { ...prev, ...profileData } : null);
      return { error: null };
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('An unexpected error occurred while saving your profile. Please try again.');
      return { error: 'Failed to save profile' };
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    profile,
    loading,
    error,
    clearError,
    saveProfile,
    refreshProfile: loadProfile,
  };
};