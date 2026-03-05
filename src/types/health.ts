export type HealthEvent = {
  id: string;
  type: "surgery" | "medication" | "rehabilitation" | "document" | "spa";
  title: string;
  date: string;
  description?: string;
  location?: string;
  doctor?: string;
};

export type UserProfile = {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
};

export type AdminUserOverview = {
  username: string;
  email: string;
  event_count: number;
};

export type DocumentRecord = {
  id: string;
  title: string;
  file: string;
  medical_event: string | null;
};
