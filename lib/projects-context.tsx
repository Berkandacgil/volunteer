"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import type { Project, ProjectUpdate, ProjectCategory } from "./types";
import { useAuth } from "./auth-context";
import * as firestoreService from "./firebase/firestore";

interface ProjectsContextType {
  projects: Project[];
  updates: ProjectUpdate[];
  loading: boolean;
  getProject: (id: string) => Project | undefined;
  getProjectsByCategory: (category: ProjectCategory) => Project[];
  getLatestUpdates: (limit?: number) => ProjectUpdate[];
  createProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt" | "participants" | "likes" | "updates" | "currentVolunteers">) => Promise<Project>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  joinProject: (projectId: string) => Promise<void>;
  leaveProject: (projectId: string) => Promise<void>;
  likeProject: (projectId: string) => Promise<void>;
  unlikeProject: (projectId: string) => Promise<void>;
  addProjectUpdate: (update: Omit<ProjectUpdate, "id" | "createdAt">) => Promise<void>;
  searchProjects: (query: string) => Project[];
  refreshProjects: () => Promise<void>;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Firestore'dan projeleri ve güncellemeleri çek
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [projectsData, updatesData] = await Promise.all([
        firestoreService.getAllProjects(),
        firestoreService.getProjectUpdates(undefined, 20),
      ]);
      setProjects(projectsData);
      setUpdates(updatesData);
    } catch (error) {
      console.error("Veriler yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshProjects = async () => {
    await fetchData();
  };

  const getProject = useCallback(
    (id: string) => projects.find((p) => p.id === id),
    [projects]
  );

  const getProjectsByCategory = useCallback(
    (category: ProjectCategory) => projects.filter((p) => p.category === category),
    [projects]
  );

  const getLatestUpdates = useCallback(
    (limit = 5) =>
      [...updates]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit),
    [updates]
  );

  const createProject = async (
    projectData: Omit<Project, "id" | "createdAt" | "updatedAt" | "participants" | "likes" | "updates" | "currentVolunteers">
  ): Promise<Project> => {
    if (!user) throw new Error("Giriş yapmalısınız");

    const newProject = await firestoreService.createProject(projectData);
    setProjects((prev) => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = async (id: string, data: Partial<Project>) => {
    await firestoreService.updateProject(id, data);
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...data, updatedAt: new Date() } : p
      )
    );
  };

  const deleteProject = async (id: string) => {
    await firestoreService.deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setUpdates((prev) => prev.filter((u) => u.projectId !== id));
  };

  const joinProject = async (projectId: string) => {
    if (!user) throw new Error("Giriş yapmalısınız");

    await firestoreService.joinProject(projectId, user.id);
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId && !p.participants.includes(user.id)) {
          return {
            ...p,
            participants: [...p.participants, user.id],
            currentVolunteers: p.currentVolunteers + 1,
          };
        }
        return p;
      })
    );
  };

  const leaveProject = async (projectId: string) => {
    if (!user) throw new Error("Giriş yapmalısınız");

    await firestoreService.leaveProject(projectId, user.id);
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId && p.participants.includes(user.id)) {
          return {
            ...p,
            participants: p.participants.filter((id) => id !== user.id),
            currentVolunteers: Math.max(0, p.currentVolunteers - 1),
          };
        }
        return p;
      })
    );
  };

  const likeProject = async (projectId: string) => {
    if (!user) throw new Error("Giriş yapmalısınız");

    await firestoreService.likeProject(projectId, user.id);
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId && !p.likes.includes(user.id)) {
          return { ...p, likes: [...p.likes, user.id] };
        }
        return p;
      })
    );
  };

  const unlikeProject = async (projectId: string) => {
    if (!user) throw new Error("Giriş yapmalısınız");

    await firestoreService.unlikeProject(projectId, user.id);
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId && p.likes.includes(user.id)) {
          return { ...p, likes: p.likes.filter((id) => id !== user.id) };
        }
        return p;
      })
    );
  };

  const addProjectUpdate = async (
    updateData: Omit<ProjectUpdate, "id" | "createdAt">
  ) => {
    if (!user) throw new Error("Giriş yapmalısınız");

    const newUpdate = await firestoreService.addProjectUpdate(updateData);
    setUpdates((prev) => [newUpdate, ...prev]);
  };

  const searchProjects = useCallback(
    (query: string) => {
      const lowerQuery = query.toLowerCase();
      return projects.filter(
        (p) =>
          p.title.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery) ||
          p.location.toLowerCase().includes(lowerQuery)
      );
    },
    [projects]
  );

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        updates,
        loading,
        getProject,
        getProjectsByCategory,
        getLatestUpdates,
        createProject,
        updateProject,
        deleteProject,
        joinProject,
        leaveProject,
        likeProject,
        unlikeProject,
        addProjectUpdate,
        searchProjects,
        refreshProjects,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
}
