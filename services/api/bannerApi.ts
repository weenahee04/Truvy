// =====================================================
// US PRIME - Banner API Client Service
// Frontend API integration layer
// =====================================================

import {
  Banner,
  BannerPosition,
  CreateBannerRequest,
  UpdateBannerRequest,
  GetBannersQuery,
  GetBannersResponse,
  ApiResponse,
  BannerSizeSpec
} from '../../backend/types/banner.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// =====================================================
// 1. HTTP CLIENT HELPERS
// =====================================================

async function getAuthToken(): Promise<string | null> {
  // Get token from your auth system (Supabase, localStorage, etc.)
  const token = localStorage.getItem('auth_token');
  return token;
}

async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getAuthToken();
  
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {})
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Don't set Content-Type for FormData (let browser set it with boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers
  });
}

// =====================================================
// 2. BANNER API METHODS
// =====================================================

export const bannerApi = {
  /**
   * Get all banners with optional filters
   */
  async getAll(query?: GetBannersQuery): Promise<GetBannersResponse> {
    const params = new URLSearchParams();
    
    if (query?.position) params.append('position', query.position);
    if (query?.is_active !== undefined) params.append('is_active', String(query.is_active));
    if (query?.page) params.append('page', String(query.page));
    if (query?.limit) params.append('limit', String(query.limit));
    if (query?.sort_by) params.append('sort_by', query.sort_by);
    if (query?.sort_order) params.append('sort_order', query.sort_order);
    
    const queryString = params.toString();
    const url = `/admin/banners${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetchWithAuth(url);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch banners');
    }
    
    return response.json();
  },
  
  /**
   * Get a single banner by ID
   */
  async getById(id: string): Promise<ApiResponse<Banner> & { size_spec: BannerSizeSpec }> {
    const response = await fetchWithAuth(`/admin/banners/${id}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch banner');
    }
    
    return response.json();
  },
  
  /**
   * Create a new banner with image upload
   */
  async create(
    data: CreateBannerRequest,
    imageFile: File
  ): Promise<ApiResponse<Banner>> {
    const formData = new FormData();
    
    // Add image file
    formData.append('image', imageFile);
    
    // Add other fields
    formData.append('name', data.name);
    formData.append('position', data.position);
    
    if (data.description) formData.append('description', data.description);
    if (data.link_url) formData.append('link_url', data.link_url);
    if (data.link_type) formData.append('link_type', data.link_type);
    if (data.open_in_new_tab !== undefined) formData.append('open_in_new_tab', String(data.open_in_new_tab));
    if (data.alt_text) formData.append('alt_text', data.alt_text);
    if (data.is_active !== undefined) formData.append('is_active', String(data.is_active));
    if (data.sort_order !== undefined) formData.append('sort_order', String(data.sort_order));
    if (data.start_date) formData.append('start_date', data.start_date);
    if (data.end_date) formData.append('end_date', data.end_date);
    
    const response = await fetchWithAuth('/admin/banners', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.message || error.message || 'Failed to create banner');
    }
    
    return response.json();
  },
  
  /**
   * Update an existing banner
   */
  async update(
    id: string,
    data: UpdateBannerRequest,
    imageFile?: File
  ): Promise<ApiResponse<Banner>> {
    const formData = new FormData();
    
    // Add image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    // Add other fields
    if (data.name) formData.append('name', data.name);
    if (data.description !== undefined) formData.append('description', data.description || '');
    if (data.link_url !== undefined) formData.append('link_url', data.link_url || '');
    if (data.link_type) formData.append('link_type', data.link_type);
    if (data.open_in_new_tab !== undefined) formData.append('open_in_new_tab', String(data.open_in_new_tab));
    if (data.alt_text !== undefined) formData.append('alt_text', data.alt_text || '');
    if (data.is_active !== undefined) formData.append('is_active', String(data.is_active));
    if (data.sort_order !== undefined) formData.append('sort_order', String(data.sort_order));
    if (data.start_date !== undefined) formData.append('start_date', data.start_date || '');
    if (data.end_date !== undefined) formData.append('end_date', data.end_date || '');
    
    const response = await fetchWithAuth(`/admin/banners/${id}`, {
      method: 'PUT',
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.message || error.message || 'Failed to update banner');
    }
    
    return response.json();
  },
  
  /**
   * Delete a banner
   */
  async delete(id: string, permanent: boolean = false): Promise<ApiResponse<{ id: string }>> {
    const url = `/admin/banners/${id}${permanent ? '?permanent=true' : ''}`;
    
    const response = await fetchWithAuth(url, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete banner');
    }
    
    return response.json();
  },
  
  /**
   * Toggle banner active status
   */
  async toggle(id: string): Promise<ApiResponse<Banner>> {
    const response = await fetchWithAuth(`/admin/banners/${id}/toggle`, {
      method: 'PATCH'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to toggle banner');
    }
    
    return response.json();
  },
  
  /**
   * Reorder banners in a position
   */
  async reorder(
    position: BannerPosition,
    bannerIds: string[]
  ): Promise<ApiResponse<{ position: BannerPosition; banner_ids: string[] }>> {
    const response = await fetchWithAuth('/admin/banners/reorder', {
      method: 'PATCH',
      body: JSON.stringify({ position, banner_ids: bannerIds })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reorder banners');
    }
    
    return response.json();
  },
  
  /**
   * Get all size specifications
   */
  async getSizeSpecs(): Promise<ApiResponse<BannerSizeSpec[]>> {
    const response = await fetchWithAuth('/admin/banners/size-specs');
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch size specs');
    }
    
    return response.json();
  }
};

// =====================================================
// 3. HELPER HOOKS (React Query style)
// =====================================================

// If you're using React Query, you can create hooks like this:
/*
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useBanners(query?: GetBannersQuery) {
  return useQuery({
    queryKey: ['banners', query],
    queryFn: () => bannerApi.getAll(query)
  });
}

export function useBanner(id: string) {
  return useQuery({
    queryKey: ['banner', id],
    queryFn: () => bannerApi.getById(id),
    enabled: !!id
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ data, file }: { data: CreateBannerRequest; file: File }) =>
      bannerApi.create(data, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    }
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data, file }: { id: string; data: UpdateBannerRequest; file?: File }) =>
      bannerApi.update(id, data, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      queryClient.invalidateQueries({ queryKey: ['banner', variables.id] });
    }
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, permanent }: { id: string; permanent?: boolean }) =>
      bannerApi.delete(id, permanent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    }
  });
}

export function useToggleBanner() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => bannerApi.toggle(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      queryClient.invalidateQueries({ queryKey: ['banner', id] });
    }
  });
}
*/
