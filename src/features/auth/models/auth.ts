// src/models/auth.ts
export interface Profile {
  id: string;
  directus_token: string;
  updated_at: string;
  created_at: string;
  directus_user_id: string;
  plan: string | null;
  company_id: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  profile: Profile;
}

export interface AuthState {
  profile: Profile | null;
  isAuthenticated: () => boolean;
  setAuth: (profile: Profile) => void;
  clearAuth: () => void;
  getDirectusToken: () => string | null;
  getCompanyId: () => string | null;
}
