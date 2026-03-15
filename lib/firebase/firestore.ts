import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { db } from "./config";
import type { UserProfile, Project, ProjectUpdate, ProjectCategory } from "../types";

// ==================== HELPERS ====================

const projectConverter = {
  toFirestore(project: Omit<Project, "id">) {
    return {
      ...project,
      startDate: Timestamp.fromDate(new Date(project.startDate)),
      endDate: project.endDate ? Timestamp.fromDate(new Date(project.endDate)) : null,
      createdAt: Timestamp.fromDate(new Date(project.createdAt)),
      updatedAt: serverTimestamp(),
    };
  },
  fromFirestore(snapshot: any): Project {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      title: data.title,
      description: data.description,
      shortDescription: data.shortDescription,
      category: data.category,
      imageUrl: data.imageUrl,
      location: data.location,
      startDate: data.startDate?.toDate?.() ?? new Date(data.startDate),
      endDate: data.endDate?.toDate?.() ?? (data.endDate ? new Date(data.endDate) : undefined),
      status: data.status,
      maxVolunteers: data.maxVolunteers,
      currentVolunteers: data.currentVolunteers ?? 0,
      participants: data.participants ?? [],
      likes: data.likes ?? [],
      createdBy: data.createdBy,
      createdAt: data.createdAt?.toDate?.() ?? new Date(data.createdAt),
      updatedAt: data.updatedAt?.toDate?.() ?? new Date(data.updatedAt),
      updates: data.updates ?? [],
    };
  },
};

// ==================== USER PROFILE ====================

export async function createUserProfile(profile: UserProfile): Promise<void> {
  await setDoc(doc(db, "users", profile.id), {
    ...profile,
    joinedAt: Timestamp.fromDate(new Date(profile.joinedAt)),
  });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    ...data,
    id: snap.id,
    joinedAt: data.joinedAt?.toDate?.() ?? new Date(data.joinedAt),
  } as UserProfile;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  const { id, joinedAt, ...rest } = data as any;
  await updateDoc(doc(db, "users", uid), rest);
}

export async function getUserProfiles(uids: string[]): Promise<UserProfile[]> {
  if (uids.length === 0) return [];
  const profiles: UserProfile[] = [];
  // Firestore 'in' query max 30 eleman destekler, chunk'layalım
  const chunks = [];
  for (let i = 0; i < uids.length; i += 30) {
    chunks.push(uids.slice(i, i + 30));
  }
  for (const chunk of chunks) {
    const q = query(collection(db, "users"), where("__name__", "in", chunk));
    const snapshot = await getDocs(q);
    snapshot.docs.forEach((d) => {
      const data = d.data();
      profiles.push({
        ...data,
        id: d.id,
        joinedAt: data.joinedAt?.toDate?.() ?? new Date(data.joinedAt),
      } as UserProfile);
    });
  }
  return profiles;
}

// ==================== PROJECTS ====================

export async function getAllProjects(): Promise<Project[]> {
  const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => projectConverter.fromFirestore(doc));
}

export async function getProjectById(id: string): Promise<Project | null> {
  const snap = await getDoc(doc(db, "projects", id));
  if (!snap.exists()) return null;
  return projectConverter.fromFirestore(snap);
}

export async function getProjectsByCategory(category: ProjectCategory): Promise<Project[]> {
  const q = query(
    collection(db, "projects"),
    where("category", "==", category),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => projectConverter.fromFirestore(doc));
}

export async function createProject(
  project: Omit<Project, "id" | "createdAt" | "updatedAt" | "participants" | "likes" | "updates" | "currentVolunteers">
): Promise<Project> {
  const docRef = doc(collection(db, "projects"));
  const now = new Date();
  const newProject: Omit<Project, "id"> = {
    ...project,
    participants: [],
    likes: [],
    updates: [],
    currentVolunteers: 0,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(docRef, projectConverter.toFirestore(newProject));

  return { ...newProject, id: docRef.id };
}

export async function updateProject(
  id: string,
  data: Partial<Project>
): Promise<void> {
  const { id: _, createdAt, ...rest } = data as any;
  const updateData: any = { ...rest, updatedAt: serverTimestamp() };

  if (rest.startDate) updateData.startDate = Timestamp.fromDate(new Date(rest.startDate));
  if (rest.endDate) updateData.endDate = Timestamp.fromDate(new Date(rest.endDate));

  await updateDoc(doc(db, "projects", id), updateData);
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, "projects", id));
  // İlgili güncellemeleri de sil
  const q = query(collection(db, "projectUpdates"), where("projectId", "==", id));
  const snapshot = await getDocs(q);
  const deletePromises = snapshot.docs.map((d) => deleteDoc(d.ref));
  await Promise.all(deletePromises);
}

// ==================== JOIN / LEAVE ====================

export async function joinProject(projectId: string, userId: string): Promise<void> {
  const ref = doc(db, "projects", projectId);
  await updateDoc(ref, {
    participants: arrayUnion(userId),
    currentVolunteers: increment(1),
    updatedAt: serverTimestamp(),
  });
}

export async function leaveProject(projectId: string, userId: string): Promise<void> {
  const ref = doc(db, "projects", projectId);
  await updateDoc(ref, {
    participants: arrayRemove(userId),
    currentVolunteers: increment(-1),
    updatedAt: serverTimestamp(),
  });
}

// ==================== LIKE / UNLIKE ====================

export async function likeProject(projectId: string, userId: string): Promise<void> {
  const ref = doc(db, "projects", projectId);
  await updateDoc(ref, {
    likes: arrayUnion(userId),
    updatedAt: serverTimestamp(),
  });
}

export async function unlikeProject(projectId: string, userId: string): Promise<void> {
  const ref = doc(db, "projects", projectId);
  await updateDoc(ref, {
    likes: arrayRemove(userId),
    updatedAt: serverTimestamp(),
  });
}

// ==================== PROJECT UPDATES ====================

export async function getProjectUpdates(projectId?: string, limitCount = 10): Promise<ProjectUpdate[]> {
  let q;
  if (projectId) {
    q = query(
      collection(db, "projectUpdates"),
      where("projectId", "==", projectId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
  } else {
    q = query(
      collection(db, "projectUpdates"),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      projectId: data.projectId,
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      createdAt: data.createdAt?.toDate?.() ?? new Date(data.createdAt),
      createdBy: data.createdBy,
    } as ProjectUpdate;
  });
}

export async function addProjectUpdate(
  update: Omit<ProjectUpdate, "id" | "createdAt">
): Promise<ProjectUpdate> {
  const docRef = doc(collection(db, "projectUpdates"));
  const now = new Date();

  await setDoc(docRef, {
    ...update,
    createdAt: Timestamp.fromDate(now),
  });

  return { ...update, id: docRef.id, createdAt: now };
}
