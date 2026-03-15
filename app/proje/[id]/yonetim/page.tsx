"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  Mail,
  MapPin,
  Calendar,
  Shield,
  UserMinus,
  Loader2,
  AlertCircle,
  Settings,
  Heart,
  Eye,
  Trash2,
  Edit,
  Plus,
  User,
  Phone,
  ImagePlus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { useProjects } from "@/lib/projects-context";
import { getUserProfiles } from "@/lib/firebase/firestore";
import { uploadUpdateImage } from "@/lib/firebase/storage";
import { categoryLabels, statusLabels } from "@/lib/types";
import type { UserProfile, ProjectStatus } from "@/lib/types";

interface ManagePageProps {
  params: Promise<{ id: string }>;
}

export default function ManageProjectPage({ params }: ManagePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const { getProject, leaveProject, deleteProject, updateProject, addProjectUpdate } = useProjects();
  const project = getProject(id);

  const [participants, setParticipants] = useState<UserProfile[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(true);
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"participants" | "settings" | "update">("participants");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Status güncelleme
  const [newStatus, setNewStatus] = useState<ProjectStatus | "">(project?.status || "");

  // Güncelleme ekleme
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");
  const [isAddingUpdate, setIsAddingUpdate] = useState(false);
  const [updateImageFile, setUpdateImageFile] = useState<File | null>(null);
  const [updateImagePreview, setUpdateImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    async function fetchParticipants() {
      if (!project || project.participants.length === 0) {
        setParticipants([]);
        setLoadingParticipants(false);
        return;
      }
      try {
        const profiles = await getUserProfiles(project.participants);
        setParticipants(profiles);
      } catch (error) {
        console.error("Katılımcılar yüklenirken hata:", error);
      } finally {
        setLoadingParticipants(false);
      }
    }
    fetchParticipants();
  }, [project]);

  // Yetki kontrolü
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Giriş Yapmalısınız</h1>
          <Button asChild><Link href="/auth/giris">Giriş Yap</Link></Button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Proje Bulunamadı</h1>
          <Button asChild><Link href="/">Ana Sayfaya Dön</Link></Button>
        </div>
      </div>
    );
  }

  const isOwner = project.createdBy === user.id;
  if (!isOwner && !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Yetkiniz Yok</h1>
          <p className="text-muted-foreground mb-6">Bu projeyi yönetme yetkiniz bulunmuyor.</p>
          <Button asChild><Link href={`/proje/${id}`}>Projeye Dön</Link></Button>
        </div>
      </div>
    );
  }

  const filteredParticipants = participants.filter((p) =>
    p.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveParticipant = async (userId: string) => {
    setRemovingUserId(userId);
    try {
      await leaveProject(id);
      setParticipants((prev) => prev.filter((p) => p.id !== userId));
    } catch (error) {
      console.error("Katılımcı çıkarılırken hata:", error);
    } finally {
      setRemovingUserId(null);
    }
  };

  const handleDeleteProject = async () => {
    setIsDeleting(true);
    try {
      await deleteProject(id);
      router.push("/");
    } catch (error) {
      console.error("Proje silinirken hata:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async () => {
    if (!newStatus || newStatus === project.status) return;
    try {
      await updateProject(id, { status: newStatus });
    } catch (error) {
      console.error("Durum güncellenirken hata:", error);
    }
  };

  const handleUpdateImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      return;
    }
    setUpdateImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setUpdateImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeUpdateImage = () => {
    setUpdateImageFile(null);
    setUpdateImagePreview(null);
  };

  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateTitle.trim() || !updateDescription.trim()) return;
    setIsAddingUpdate(true);
    try {
      let imageUrl: string | undefined;
      if (updateImageFile) {
        setIsUploadingImage(true);
        imageUrl = await uploadUpdateImage(updateImageFile);
        setIsUploadingImage(false);
      }
      await addProjectUpdate({
        projectId: id,
        title: updateTitle,
        description: updateDescription,
        imageUrl,
        createdBy: user.id,
      });
      setUpdateTitle("");
      setUpdateDescription("");
      setUpdateImageFile(null);
      setUpdateImagePreview(null);
    } catch (error) {
      console.error("Güncelleme eklenirken hata:", error);
    } finally {
      setIsAddingUpdate(false);
      setIsUploadingImage(false);
    }
  };

  const progress = (project.currentVolunteers / project.maxVolunteers) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/proje/${id}`}>
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">Proje Yönetimi</h1>
                <p className="text-sm text-muted-foreground">{project.title}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/proje/${id}`}>
                <Eye className="w-4 h-4 mr-2" />
                Projeyi Gör
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Özet Kartları */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <Users className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{project.currentVolunteers}</p>
            <p className="text-xs text-muted-foreground">Katılımcı</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <Heart className="w-6 h-6 text-destructive mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{project.likes.length}</p>
            <p className="text-xs text-muted-foreground">Beğeni</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <Users className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{project.maxVolunteers}</p>
            <p className="text-xs text-muted-foreground">Maks. Gönüllü</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-1 ${
              project.status === "active" ? "bg-primary/10 text-primary" :
              project.status === "completed" ? "bg-muted text-muted-foreground" :
              project.status === "upcoming" ? "bg-accent/20 text-accent-foreground" :
              "bg-destructive/10 text-destructive"
            }`}>
              {statusLabels[project.status]}
            </div>
            <p className="text-xs text-muted-foreground">Durum</p>
          </div>
        </div>

        {/* Doluluk Barı */}
        <div className="bg-card rounded-xl p-4 border border-border mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Doluluk Oranı</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-secondary rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab("participants")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
              activeTab === "participants"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="w-4 h-4" />
            Katılımcılar ({project.currentVolunteers})
          </button>
          <button
            onClick={() => setActiveTab("update")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
              activeTab === "update"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Plus className="w-4 h-4" />
            Güncelleme Ekle
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
              activeTab === "settings"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Settings className="w-4 h-4" />
            Ayarlar
          </button>
        </div>

        {/* Tab İçerikleri */}

        {/* KATILIMCILAR */}
        {activeTab === "participants" && (
          <div className="bg-card rounded-xl border border-border">
            <div className="p-4 border-b border-border">
              <Input
                placeholder="Katılımcı ara (isim veya e-posta)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10"
              />
            </div>

            {loadingParticipants ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredParticipants.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">
                  {searchQuery ? "Aramanızla eşleşen katılımcı yok" : "Henüz katılımcı yok"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {!searchQuery && "Proje paylaşıldıkça katılımcılar burada görünecek."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredParticipants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        {participant.photoURL ? (
                          <img
                            src={participant.photoURL}
                            alt={participant.displayName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-bold text-primary-foreground">
                            {participant.displayName.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground text-sm">
                            {participant.displayName}
                          </h4>
                          {participant.role === "admin" && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-medium">
                              <Shield className="w-2.5 h-2.5" />
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            {participant.email}
                          </span>
                          {participant.phone && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              {participant.phone}
                            </span>
                          )}
                          {participant.location && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {participant.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemoveParticipant(participant.id)}
                      disabled={removingUserId === participant.id}
                    >
                      {removingUserId === participant.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <UserMinus className="w-4 h-4 mr-1" />
                          Çıkar
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="p-4 border-t border-border bg-secondary/30">
              <p className="text-xs text-muted-foreground text-center">
                Toplam {filteredParticipants.length} katılımcı gösteriliyor
              </p>
            </div>
          </div>
        )}

        {/* GÜNCELLEME EKLE */}
        {activeTab === "update" && (
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Proje Güncellemesi Ekle</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Katılımcıları ve takipçileri projenin gidişatı hakkında bilgilendirin.
            </p>
            <form onSubmit={handleAddUpdate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Başlık *</label>
                <Input
                  placeholder="Örn: 500. Fidanımızı Diktik!"
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Açıklama *</label>
                <textarea
                  placeholder="Güncelleme detaylarını yazın..."
                  value={updateDescription}
                  onChange={(e) => setUpdateDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              {/* Fotoğraf Yükleme */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Fotoğraf (Opsiyonel)</label>
                {updateImagePreview ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                    <img
                      src={updateImagePreview}
                      alt="Önizleme"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeUpdateImage}
                      className="absolute top-2 right-2 bg-background/80 hover:bg-background text-foreground rounded-full p-1.5 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-secondary/50 transition-colors">
                    <ImagePlus className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Fotoğraf yüklemek için tıklayın
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      JPEG, PNG, WebP veya GIF (maks. 5MB)
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleUpdateImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <Button type="submit" disabled={isAddingUpdate}>
                {isAddingUpdate ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {isUploadingImage ? "Fotoğraf yükleniyor..." : "Ekleniyor..."}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Güncelleme Ekle
                  </>
                )}
              </Button>
            </form>
          </div>
        )}

        {/* AYARLAR */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            {/* Durum Değiştir */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Proje Durumu</h3>
              <div className="flex items-center gap-3">
                <select
                  value={newStatus || project.status}
                  onChange={(e) => setNewStatus(e.target.value as ProjectStatus)}
                  className="flex-1 h-12 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="active">Aktif</option>
                  <option value="upcoming">Yaklaşan</option>
                  <option value="completed">Tamamlandı</option>
                  <option value="cancelled">İptal Edildi</option>
                </select>
                <Button onClick={handleStatusChange} disabled={!newStatus || newStatus === project.status}>
                  Güncelle
                </Button>
              </div>
            </div>

            {/* Proje Bilgileri */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Proje Bilgileri</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Kategori:</span>
                  <span className="ml-2 font-medium text-foreground">{categoryLabels[project.category]}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Konum:</span>
                  <span className="ml-2 font-medium text-foreground">{project.location}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Başlangıç:</span>
                  <span className="ml-2 font-medium text-foreground">
                    {new Date(project.startDate).toLocaleDateString("tr-TR")}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Oluşturulma:</span>
                  <span className="ml-2 font-medium text-foreground">
                    {new Date(project.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </div>
              </div>
            </div>

            {/* Tehlikeli Bölge */}
            <div className="bg-card rounded-xl border border-destructive/30 p-6">
              <h3 className="text-lg font-semibold text-destructive mb-2">Tehlikeli Bölge</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Bu işlem geri alınamaz. Proje ve tüm güncellemeleri kalıcı olarak silinecektir.
              </p>
              {showDeleteConfirm ? (
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium text-destructive">Emin misiniz?</p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteProject}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-2" />
                    )}
                    Evet, Sil
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    İptal
                  </Button>
                </div>
              ) : (
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Projeyi Sil
                </Button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
