// Base API URL - this should come from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Helper for making API requests
export async function fetchAPI<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Default options
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  // Get auth token from storage (if available)
  const token = localStorage.getItem('auth_token');
  if (token) {
    defaultOptions.headers = {
      ...defaultOptions.headers,
      'Authorization': `Bearer ${token}`,
    };
  }
  
  // Merge options
  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, fetchOptions);
    
    // Handle error responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `API request failed: ${response.status} ${response.statusText}`
      );
    }
    
    // Parse response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Token endpoints
export const tokensAPI = {
  getAll: () => fetchAPI<{ data: any[] }>('/tokens'),
  
  getById: (id: string) => fetchAPI<{ data: any }>(`/tokens/${id}`),
  
  create: (tokenData: any) => fetchAPI<{ data: any }>('/tokens', {
    method: 'POST',
    body: JSON.stringify(tokenData),
  }),
  
  update: (id: string, updates: any) => fetchAPI<{ data: any }>(`/tokens/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  }),
  
  delete: (id: string) => fetchAPI<{ success: boolean }>(`/tokens/${id}`, {
    method: 'DELETE',
  }),
};

// Relationship endpoints
export const relationshipsAPI = {
  getAll: (tokenId?: string) => {
    const queryParams = tokenId ? `?tokenId=${tokenId}` : '';
    return fetchAPI<{ data: any[] }>(`/relationships${queryParams}`);
  },
  
  create: (relationshipData: any) => fetchAPI<{ data: any }>('/relationships', {
    method: 'POST',
    body: JSON.stringify(relationshipData),
  }),
  
  update: (id: string, updates: any) => fetchAPI<{ data: any }>(`/relationships/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  }),
  
  delete: (id: string) => fetchAPI<{ success: boolean }>(`/relationships/${id}`, {
    method: 'DELETE',
  }),
};
