import { useState, useCallback } from 'react';
import { supabase } from '../supabase';

/**
 * Custom hook for Supabase operations
 */
export const useSupabase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch history by ID
   */
  const fetchHistoryById = useCallback(async (id) => {
    if (!id) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('histories')
        .select()
        .eq('id', id)
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching history:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch all histories
   */
  const fetchHistories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('histories')
        .select()
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching histories:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Save history
   */
  const saveHistory = useCallback(async (historyData) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error: supabaseError } = await supabase
        .from('histories')
        .insert(historyData);

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error saving history:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete history
   */
  const deleteHistory = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error: supabaseError } = await supabase
        .from('histories')
        .delete()
        .match({ id });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error deleting history:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchHistoryById,
    fetchHistories,
    saveHistory,
    deleteHistory,
  };
}; 