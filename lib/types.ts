export type UserRole = "user" | "admin";

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  bio?: string;
  location?: string;
  phone?: string;
  joinedAt: Date;
  projectsJoined: string[];
  projectsCreated: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: ProjectCategory;
  imageUrl: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  status: ProjectStatus;
  maxVolunteers: number;
  currentVolunteers: number;
  participants: string[];
  likes: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  updates: ProjectUpdate[];
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: Date;
  createdBy: string;
}

export type ProjectCategory =
  | "cevre"
  | "egitim"
  | "sosyal"
  | "saglik"
  | "hayvan"
  | "yasli";

export type ProjectStatus = "active" | "completed" | "upcoming" | "cancelled";

export const categoryLabels: Record<ProjectCategory, string> = {
  cevre: "Çevre",
  egitim: "Eğitim",
  sosyal: "Sosyal Yardım",
  saglik: "Sağlık",
  hayvan: "Hayvan Hakları",
  yasli: "Yaşlı Bakımı",
};

export const statusLabels: Record<ProjectStatus, string> = {
  active: "Aktif",
  completed: "Tamamlandı",
  upcoming: "Yaklaşan",
  cancelled: "İptal Edildi",
};
