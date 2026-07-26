// hooks/useOrganization.ts
'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Organization, OrganizationApplication, OrganizationDashboard } from '@/types/organization';

export function useOrganization() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Submit application
  const submitApplication = useCallback(async (data: Partial<OrganizationApplication>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: application, error } = await supabase
        .from('organization_applications')
        .insert({
          user_id: data.userId,
          organization_name: data.organizationName,
          type: data.type,
          description: data.description,
          phone: data.phone,
          email: data.email,
          website: data.website,
          location: data.location,
          lat: data.coordinates?.lat,
          lng: data.coordinates?.lng,
        })
        .select()
        .single();

      if (error) throw error;

      return application;
    } catch (err: any) {
      setError(err.message || 'Failed to submit application. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get organization by user ID
  const getOrganizationByUser = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to load organization');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get application status by user ID
  const getApplicationStatus = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('organization_applications')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to load application');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create organization (after approval)
  const createOrganization = useCallback(async (data: Partial<Organization>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: organization, error } = await supabase
        .from('organizations')
        .insert({
          user_id: data.userId,
          name: data.name,
          type: data.type,
          description: data.description,
          phone: data.phone,
          whatsapp: data.whatsapp,
          email: data.email,
          website: data.website,
          lat: data.coordinates?.lat,
          lng: data.coordinates?.lng,
          logo_url: data.logo,
          cover_image_url: data.coverImage,
          verified: false,
          status: 'approved',
        })
        .select()
        .single();

      if (error) throw error;

      return organization;
    } catch (err: any) {
      setError(err.message || 'Failed to create organization');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update organization
  const updateOrganization = useCallback(async (id: string, data: Partial<Organization>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: organization, error } = await supabase
        .from('organizations')
        .update({
          name: data.name,
          type: data.type,
          description: data.description,
          phone: data.phone,
          whatsapp: data.whatsapp,
          email: data.email,
          website: data.website,
          lat: data.coordinates?.lat,
          lng: data.coordinates?.lng,
          logo_url: data.logo,
          cover_image_url: data.coverImage,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return organization;
    } catch (err: any) {
      setError(err.message || 'Failed to update organization');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get organization dashboard
  const getDashboard = useCallback(async (orgId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', orgId)
        .single();

      if (orgError) throw orgError;

      // Get analytics (mock for now - will use real analytics table later)
      const { data: views } = await supabase
        .from('analytics')
        .select('count')
        .eq('experience_id', orgId)
        .eq('type', 'view');

      const { data: saves } = await supabase
        .from('saved_experiences')
        .select('count')
        .eq('experience_id', orgId);

      const dashboard: OrganizationDashboard = {
        organization: org,
        stats: {
          totalViews: views?.length || 0,
          totalSaves: saves?.length || 0,
          totalShares: 0,
          totalExperiences: 0,
          totalPlaces: 0,
          recentActivity: [],
        },
      };

      return dashboard;
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    submitApplication,
    getOrganizationByUser,
    getApplicationStatus,
    createOrganization,
    updateOrganization,
    getDashboard,
  };
}