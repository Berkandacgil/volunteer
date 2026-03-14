"use client"

import { useState } from "react"
import Link from "next/link"
import { ProjectCard } from "./project-card"
import { Button } from "@/components/ui/button"
import { Filter, ChevronDown, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useProjects } from "@/lib/projects-context"
import { useAuth } from "@/lib/auth-context"
import { categoryLabels, type ProjectCategory } from "@/lib/types"

const categories: { value: ProjectCategory | "all"; label: string }[] = [
  { value: "all", label: "Tümü" },
  { value: "cevre", label: "Çevre" },
  { value: "egitim", label: "Eğitim" },
  { value: "sosyal", label: "Sosyal Yardım" },
  { value: "saglik", label: "Sağlık" },
  { value: "hayvan", label: "Hayvan" },
  { value: "yasli", label: "Yaşlı Bakımı" },
]

export function ProjectsSection() {
  const { projects } = useProjects()
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | "all">("all")
  const [sortBy, setSortBy] = useState("Yaklaşan")
  const [showCount, setShowCount] = useState(6)

  const filteredProjects = projects.filter(
    (project) => selectedCategory === "all" || project.category === selectedCategory
  )

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "Yaklaşan") {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    } else if (sortBy === "Popüler") {
      return b.likes.length - a.likes.length
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  const displayedProjects = sortedProjects.slice(0, showCount)

  return (
    <section id="projeler" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Aktif Projeler
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2 text-balance">
              Katılabileceğiniz Gönüllülük Projeleri
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl text-pretty">
              Size en uygun projeyi seçin ve topluma katkı sağlama yolculuğunuza başlayın.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <Button asChild>
                <Link href="/proje/olustur">
                  <Plus className="w-4 h-4 mr-2" />
                  Proje Oluştur
                </Link>
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  {sortBy}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("Yaklaşan")}>
                  Yaklaşan
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("Popüler")}>
                  Popüler
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("Yeni Eklenen")}>
                  Yeni Eklenen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {displayedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                image={project.imageUrl}
                title={project.title}
                description={project.shortDescription}
                category={categoryLabels[project.category]}
                date={new Date(project.startDate).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                location={project.location}
                volunteers={project.currentVolunteers}
                maxVolunteers={project.maxVolunteers}
                isUrgent={project.status === "active" && project.currentVolunteers >= project.maxVolunteers * 0.9}
                daysLeft={Math.max(0, Math.ceil((new Date(project.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}
                likes={project.likes.length}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Bu kategoride henüz proje bulunmuyor.</p>
          </div>
        )}

        {/* Load More */}
        {sortedProjects.length > showCount && (
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg" 
              className="gap-2"
              onClick={() => setShowCount(showCount + 6)}
            >
              Daha Fazla Proje Gör
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
