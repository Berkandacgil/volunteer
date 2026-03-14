"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Upload,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { useProjects } from "@/lib/projects-context";
import type { ProjectCategory, ProjectStatus } from "@/lib/types";
import { categoryLabels } from "@/lib/types";

const categories: { value: ProjectCategory; label: string }[] = [
  { value: "cevre", label: "Çevre" },
  { value: "egitim", label: "Eğitim" },
  { value: "sosyal", label: "Sosyal Yardım" },
  { value: "saglik", label: "Sağlık" },
  { value: "hayvan", label: "Hayvan Hakları" },
  { value: "yasli", label: "Yaşlı Bakımı" },
];

export default function CreateProjectPage() {
  const { user, isAdmin } = useAuth();
  const { createProject } = useProjects();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    category: "cevre" as ProjectCategory,
    location: "",
    startDate: "",
    endDate: "",
    maxVolunteers: 20,
    imageUrl: "/images/volunteer-1.jpg",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Giriş Yapmalısınız
          </h1>
          <p className="text-muted-foreground mb-6">
            Proje oluşturmak için giriş yapmanız gerekmektedir.
          </p>
          <Button asChild>
            <Link href="/auth/giris">Giriş Yap</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const project = await createProject({
        title: formData.title,
        shortDescription: formData.shortDescription,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        maxVolunteers: formData.maxVolunteers,
        imageUrl: formData.imageUrl,
        status: "active" as ProjectStatus,
        createdBy: user.id,
      });

      router.push(`/proje/${project.id}`);
    } catch {
      setError("Proje oluşturulurken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxVolunteers" ? parseInt(value) || 0 : value,
    }));
  };

  const predefinedImages = [
    "/images/volunteer-1.jpg",
    "/images/volunteer-2.jpg",
    "/images/volunteer-3.jpg",
    "/images/volunteer-4.jpg",
    "/images/project-elderly.jpg",
    "/images/project-animal.jpg",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Yeni Proje Oluştur
              </h1>
              <p className="text-sm text-muted-foreground">
                Gönüllülük projesi oluşturun ve topluma katkı sağlayın
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-lg">
              {error}
            </div>
          )}

          {/* Image Selection */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              Proje Görseli
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {predefinedImages.map((img) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, imageUrl: img }))}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    formData.imageUrl === img
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <img
                    src={img}
                    alt="Proje görseli"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Firebase bağlandığında kendi görselinizi yükleyebilirsiniz
            </p>
          </div>

          {/* Basic Info */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Temel Bilgiler
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-foreground">
                  Proje Başlığı *
                </label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Örn: Yeşil Gelecek Ağaçlandırma Projesi"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="shortDescription" className="text-sm font-medium text-foreground">
                  Kısa Açıklama *
                </label>
                <Input
                  id="shortDescription"
                  name="shortDescription"
                  placeholder="Projenin kısa özeti (max 100 karakter)"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  maxLength={100}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-foreground">
                  Detaylı Açıklama *
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Projenin amacı, hedefleri ve nasıl katkı sağlanacağını detaylı anlatın..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium text-foreground">
                  Kategori *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full h-12 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location & Date */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Konum ve Tarih
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  Konum *
                </label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Örn: İstanbul, Beykoz"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="maxVolunteers" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  Maksimum Gönüllü *
                </label>
                <Input
                  id="maxVolunteers"
                  name="maxVolunteers"
                  type="number"
                  min={1}
                  max={1000}
                  value={formData.maxVolunteers}
                  onChange={handleChange}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  Başlangıç Tarihi *
                </label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  Bitiş Tarihi (Opsiyonel)
                </label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="h-12"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-4">
            <Button variant="outline" type="button" asChild>
              <Link href="/">İptal</Link>
            </Button>
            <Button type="submit" disabled={isLoading} className="min-w-[150px]">
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Oluşturuluyor...
                </>
              ) : (
                "Projeyi Oluştur"
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
