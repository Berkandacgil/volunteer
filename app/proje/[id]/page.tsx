"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Heart,
  Share2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Loader2,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useProjects } from "@/lib/projects-context";
import { categoryLabels, statusLabels } from "@/lib/types";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { id } = use(params);
  const { user, isAdmin } = useAuth();
  const { getProject, joinProject, leaveProject, likeProject, unlikeProject, updates } = useProjects();
  const project = getProject(id);

  const [isJoining, setIsJoining] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Proje Bulunamadı
          </h1>
          <p className="text-muted-foreground mb-6">
            Aradığınız proje mevcut değil veya kaldırılmış olabilir.
          </p>
          <Button asChild>
            <Link href="/">Ana Sayfaya Dön</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isParticipant = user ? project.participants.includes(user.id) : false;
  const isLiked = user ? project.likes.includes(user.id) : false;
  const projectUpdates = updates.filter((u) => u.projectId === project.id);
  const progress = (project.currentVolunteers / project.maxVolunteers) * 100;

  const handleJoin = async () => {
    if (!user) return;
    setIsJoining(true);
    try {
      if (isParticipant) {
        await leaveProject(project.id);
      } else {
        await joinProject(project.id);
      }
    } finally {
      setIsJoining(false);
    }
  };

  const handleLike = async () => {
    if (!user) return;
    setIsLiking(true);
    try {
      if (isLiked) {
        await unlikeProject(project.id);
      } else {
        await likeProject(project.id);
      }
    } finally {
      setIsLiking(false);
    }
  };

  const statusColors = {
    active: "bg-primary/10 text-primary",
    completed: "bg-muted text-muted-foreground",
    upcoming: "bg-accent/20 text-accent-foreground",
    cancelled: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Image */}
      <div className="relative h-[300px] sm:h-[400px]">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Button variant="secondary" size="icon" asChild className="bg-card/80 backdrop-blur-sm">
            <Link href="/">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="bg-card/80 backdrop-blur-sm"
              onClick={handleLike}
              disabled={!user || isLiking}
            >
              <Heart
                className={`w-5 h-5 ${isLiked ? "fill-destructive text-destructive" : ""}`}
              />
            </Button>
            <Button variant="secondary" size="icon" className="bg-card/80 backdrop-blur-sm">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 -mt-20 relative z-10 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Card */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${statusColors[project.status]}`}
                  >
                    {statusLabels[project.status]}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    {project.title}
                  </h1>
                  <p className="text-muted-foreground">{project.shortDescription}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {project.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(project.startDate).toLocaleDateString("tr-TR")}
                </span>
                <span className="inline-block px-2 py-1 bg-secondary rounded text-secondary-foreground text-xs">
                  {categoryLabels[project.category]}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Proje Hakkında
              </h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {project.description}
              </p>
            </div>

            {/* Updates */}
            {projectUpdates.length > 0 && (
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Son Güncellemeler
                </h2>
                <div className="space-y-4">
                  {projectUpdates.map((update) => (
                    <div
                      key={update.id}
                      className="flex gap-4 p-4 bg-secondary/30 rounded-lg"
                    >
                      {update.imageUrl && (
                        <img
                          src={update.imageUrl}
                          alt={update.title}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div>
                        <h3 className="font-medium text-foreground mb-1">
                          {update.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {update.description}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(update.createdAt).toLocaleDateString("tr-TR")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Join Card */}
            <div className="bg-card rounded-xl p-6 border border-border sticky top-4">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    Gönüllü Durumu
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {project.currentVolunteers}/{project.maxVolunteers}
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <span className="text-foreground">
                    {project.currentVolunteers} gönüllü katıldı
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Heart className="w-5 h-5 text-muted-foreground" />
                  <span className="text-foreground">
                    {project.likes.length} kişi beğendi
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span className="text-foreground">
                    {new Date(project.updatedAt).toLocaleDateString("tr-TR")} güncellendi
                  </span>
                </div>
              </div>

              {user ? (
                <Button
                  className="w-full"
                  variant={isParticipant ? "outline" : "default"}
                  onClick={handleJoin}
                  disabled={isJoining || project.status !== "active"}
                >
                  {isJoining ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : isParticipant ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Katıldınız
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Projeye Katıl
                    </>
                  )}
                </Button>
              ) : (
                <Button className="w-full" asChild>
                  <Link href="/auth/giris">Katılmak için Giriş Yapın</Link>
                </Button>
              )}

              {isParticipant && (
                <p className="text-xs text-center text-muted-foreground mt-3">
                  Tekrar tıklayarak projeden ayrılabilirsiniz
                </p>
              )}
            </div>

            {/* Admin Actions */}
            {(isAdmin || (user && project.createdBy === user.id)) && (
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-medium text-foreground mb-4">Proje Yönetimi</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href={`/proje/${id}/yonetim`}>
                      <Settings className="w-4 h-4 mr-2" />
                      Yönetim Paneli
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
