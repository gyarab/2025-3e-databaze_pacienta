import type { AdminUserOverview, HealthEvent, UserProfile } from "@/types/health";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api";
const ACCESS_TOKEN_KEY = "medicare_access_token";

export const getToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(ACCESS_TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(ACCESS_TOKEN_KEY);

export type PatientProfile = {
  date_of_birth?: string | null;
  phone_number?: string;
  emergency_contact?: string;
  insurance_provider?: string;
  height_cm?: number | null;
  weight_kg?: number | null;
  national_id?: string;
  consent_to_data_processing?: boolean;
};

const toErrorMessage = (data: unknown): string => {
  if (!data) return "Požadavek selhal";
  if (typeof data === "string") return data;
  if (typeof data !== "object") return "Požadavek selhal";

  const payload = data as Record<string, unknown>;
  if (typeof payload.detail === "string") return payload.detail;

  const fieldErrors = Object.entries(payload)
    .map(([field, value]) => {
      if (Array.isArray(value)) return `${field}: ${value.join(", ")}`;
      if (typeof value === "string") return `${field}: ${value}`;
const toErrorMessage = (data: unknown): string => {
  if (!data) {
    return "Požadavek selhal";
  }

  if (typeof data === "string") {
    return data;
  }

  if (typeof data !== "object") {
    return "Požadavek selhal";
  }

  const payload = data as Record<string, unknown>;
  if (typeof payload.detail === "string") {
    return payload.detail;
  }

  const fieldErrors = Object.entries(payload)
    .map(([field, value]) => {
      if (Array.isArray(value)) {
        return `${field}: ${value.join(", ")}`;
      }
      if (typeof value === "string") {
        return `${field}: ${value}`;
      }
      return null;
    })
    .filter(Boolean) as string[];

  return fieldErrors[0] ?? "Požadavek selhal";
};

async function apiRequest<T>(path: string, options: RequestInit = {}, useAuth = true): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (useAuth) {
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-Type", "application/json");

  if (useAuth) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(toErrorMessage(data));
  }
  return response.status === 204 ? ({} as T) : response.json();
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail ?? "Požadavek selhal");
  }
  return response.json();
}

export const login = async (username: string, password: string) => {
  const data = await apiRequest<{ access: string; refresh: string }>(
    "/users/token/",
    { method: "POST", body: JSON.stringify({ username, password }) },
    {
      method: "POST",
      body: JSON.stringify({ username, password }),
    },
    false,
  );
  setToken(data.access);
};

export const register = async (username: string, email: string, password: string) => {
  await apiRequest("/users/register/", { method: "POST", body: JSON.stringify({ username, email, password }) }, false);
  await apiRequest(
    "/users/register/",
    {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    },
    false,
  );
  await apiRequest("/users/register/", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  }, false);
};

export const getMe = () => apiRequest<UserProfile>("/users/me/");
export const getEvents = () => apiRequest<HealthEvent[]>("/records/events/");
export const createEvent = (event: Omit<HealthEvent, "id">) =>
  apiRequest<HealthEvent>("/records/events/", { method: "POST", body: JSON.stringify(event) });
export const updateEvent = (id: string, event: Omit<HealthEvent, "id">) =>
  apiRequest<HealthEvent>(`/records/events/${id}/`, { method: "PUT", body: JSON.stringify(event) });

export const uploadDocument = async (title: string, file: File, medicalEventId?: string) => {
  const form = new FormData();
  form.append("title", title);
  form.append("file", file);
  if (medicalEventId) form.append("medical_event_id", medicalEventId);
  return apiRequest("/documents/", { method: "POST", body: form });
};

export const getProfile = () => apiRequest<PatientProfile>("/users/profile/");
export const updateProfile = (data: PatientProfile) => apiRequest<PatientProfile>("/users/profile/", { method: "PATCH", body: JSON.stringify(data) });
export const changePassword = (oldPassword: string, newPassword: string) =>
  apiRequest<{ detail: string }>("/users/change-password/", {
    method: "POST",
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
  });

  apiRequest<HealthEvent>("/records/events/", {
    method: "POST",
    body: JSON.stringify(event),
  });
export const getAdminOverview = () => apiRequest<AdminUserOverview[]>("/users/admin-overview/");
