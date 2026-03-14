"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  MapPin,
  Calendar,
  Heart,
  Settings,
  LogOut,
  Shield,
  Edit,
  Save,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { useProjects } from "@/lib/projects-context";

export default function ProfilePage() {
  const { user, isAdmin, logout, updateProfile } = useAuth();
  const { projects } = useProjects();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({
    displayName: user?.displayName || "",
    bio: user?.bio || "",
    location: user?.location || "",
    phone: user?.phone || "",
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Giriş Yapmalısınız
          </h1>
          <p className="text-muted-foreground mb-6">
            Profil sayfasını görüntülemek için giriş yapmanız gerekmektedir.
          </p>
          <Button asChild>
            <Link href="/auth/giris">Giriş Yap</Link>
          </Button>
        </div>
      </div>
    );
  }

  const joinedProjects = projects.filter((p) =>
    p.participants.includes(user.id)
  );
  const createdProjects = projects.filter((p) => p.createdBy === user.id);
  const likedProjects = projects.filter((p) => p.likes.includes(user.id));

  const handleSave = async () => {
    setIsSaving(true);
    await updateProfile(editData);
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <h1 className="text-xl font-bold text-foreground">Profilim</h1>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Card */}
        <div className="bg-card rounded-xl border border-border overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-primary/20 to-accent/20" />
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center border-4 border-card">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-primary-foreground">
                    {user.displayName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-foreground">
                    {user.displayName}
                  </h2>
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      <Shield className="w-3 h-3" />
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    İptal
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Düzenle
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Edit Form or Info */}
            {isEditing ? (
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Profili Düzenle
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Ad Soyad
                    </label>
                    <Input
                      value={editData.displayName}
                      onChange={(e) =>
                        setEditData({ ...editData, displayName: e.target.value })
                      }
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Hakkımda
                    </label>
                    <textarea
                      value={editData.bio}
                      onChange={(e) =>
                        setEditData({ ...editData, bio: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder="Kendinizden bahsedin..."
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Konum
                      </label>
                      <Input
                        value={editData.location}
                        onChange={(e) =>
                          setEditData({ ...editData, location: e.target.value })
                        }
                        placeholder="Örn: İstanbul"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Telefon
                      </label>
                      <Input
                        value={editData.phone}
                        onChange={(e) =>
                          setEditData({ ...editData, phone: e.target.value })
                        }
                        placeholder="05XX XXX XX XX"
                        className="h-12"
                      />
                    </div>
                  </div>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Kaydet
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Hakkımda
                </h3>
                <p className="text-muted-foreground mb-6">
                  {user.bio || "Henüz bir açıklama eklenmemiş."}
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Konum</p>
                      <p className="text-sm font-medium text-foreground">
                        {user.location || "Belirtilmemiş"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Katılım Tarihi</p>
                      <p className="text-sm font-medium text-foreground">
                        {new Date(user.joinedAt).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Joined Projects */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Katıldığım Projeler ({joinedProjects.length})
              </h3>
              {joinedProjects.length > 0 ? (
                <div className="space-y-3">
                  {joinedProjects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/proje/${project.id}`}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-foreground">
                          {project.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {project.location}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Henüz bir projeye katılmadınız.
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                İstatistikler
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Katıldığı Projeler</span>
                  <span className="font-semibold text-foreground">
                    {joinedProjects.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Oluşturduğu Projeler</span>
                  <span className="font-semibold text-foreground">
                    {createdProjects.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Beğendiği Projeler</span>
                  <span className="font-semibold text-foreground">
                    {likedProjects.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Hızlı İşlemler
              </h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/proje/olustur">
                    <Heart className="w-4 h-4 mr-2" />
                    Proje Oluştur
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Ayarlar
                </Button>
                {isAdmin && (
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/admin">
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Paneli
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Role Badge */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Hesap Türü
              </h3>
              <div
                className={`flex items-center gap-3 p-4 rounded-lg ${
                  isAdmin ? "bg-primary/10" : "bg-secondary"
                }`}
              >
                {isAdmin ? (
                  <Shield className="w-8 h-8 text-primary" />
                ) : (
                  <User className="w-8 h-8 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium text-foreground">
                    {isAdmin ? "Yönetici" : "Gönüllü"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isAdmin
                      ? "Tüm yetkilere sahipsiniz"
                      : "Projelere katılabilirsiniz"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
