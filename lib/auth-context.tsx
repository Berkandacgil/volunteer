"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { UserProfile, UserRole } from "./types";
import { loginWithEmail, registerWithEmail, logoutUser, onAuthChange } from "./firebase/auth";
import { createUserProfile, getUserProfile, updateUserProfile as updateUserProfileInDB } from "./firebase/firestore";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, displayName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Firebase'den kullanıcı profili çek
        let profile = await getUserProfile(firebaseUser.uid);
        if (!profile) {
          // Profil yoksa oluştur (ilk giriş)
          profile = {
            id: firebaseUser.uid,
            email: firebaseUser.email || "",
            displayName: firebaseUser.displayName || "Kullanıcı",
            photoURL: firebaseUser.photoURL || undefined,
            role: "user",
            joinedAt: new Date(),
            projectsJoined: [],
            projectsCreated: [],
          };
          await createUserProfile(profile);
        }
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      return { success: true };
    } catch (error: any) {
      const code = error?.code;
      let message = "Giriş başarısız";
      if (code === "auth/user-not-found") message = "Kullanıcı bulunamadı";
      else if (code === "auth/wrong-password") message = "Geçersiz şifre";
      else if (code === "auth/invalid-email") message = "Geçersiz e-posta adresi";
      else if (code === "auth/invalid-credential") message = "E-posta veya şifre hatalı";
      else if (code === "auth/too-many-requests") message = "Çok fazla deneme yaptınız, lütfen bekleyin";
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      const credential = await registerWithEmail(email, password, displayName);
      // Firestore'da kullanıcı profili oluştur
      const newProfile: UserProfile = {
        id: credential.user.uid,
        email,
        displayName,
        role: "user",
        joinedAt: new Date(),
        projectsJoined: [],
        projectsCreated: [],
      };
      await createUserProfile(newProfile);
      setUser(newProfile);
      return { success: true };
    } catch (error: any) {
      const code = error?.code;
      let message = "Kayıt başarısız";
      if (code === "auth/email-already-in-use") message = "Bu e-posta zaten kayıtlı";
      else if (code === "auth/weak-password") message = "Şifre çok zayıf (en az 6 karakter)";
      else if (code === "auth/invalid-email") message = "Geçersiz e-posta adresi";
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (user) {
      await updateUserProfileInDB(user.id, data);
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
