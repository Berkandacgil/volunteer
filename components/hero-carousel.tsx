"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, MapPin, Users } from "lucide-react"
import { useProjects } from "@/lib/projects-context"
import { categoryLabels } from "@/lib/types"

export function HeroCarousel() {
  const { getLatestUpdates, projects } = useProjects()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const latestUpdates = getLatestUpdates(4)

  // Map updates to carousel items with project info
  const carouselItems = latestUpdates.map((update) => {
    const project = projects.find((p) => p.id === update.projectId)
    return {
      id: update.id,
      projectId: update.projectId,
      image: update.imageUrl || project?.imageUrl || "/images/volunteer-1.jpg",
      title: update.title,
      description: update.description,
      date: new Date(update.createdAt).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      location: project?.location || "",
      volunteers: project?.currentVolunteers || 0,
      tag: project ? categoryLabels[project.category] : "Genel",
    }
  })

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % carouselItems.length)
  }, [carouselItems.length])

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)
  }

  useEffect(() => {
    if (!isAutoPlaying || carouselItems.length === 0) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide, carouselItems.length])

  if (carouselItems.length === 0) {
    return (
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden bg-primary/5 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Henüz güncelleme yok</h2>
          <p className="text-muted-foreground">Projeler güncellendikçe burada görünecek</p>
        </div>
      </section>
    )
  }

  const currentItem = carouselItems[currentIndex]

  return (
    <section 
      className="relative h-[70vh] min-h-[500px] overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Images */}
      {carouselItems.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16">
        <div className="max-w-2xl">
          <span className="inline-block px-3 py-1 bg-accent text-accent-foreground text-sm font-medium rounded-full mb-4">
            {currentItem.tag}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-card mb-4 text-balance">
            {currentItem.title}
          </h1>
          <p className="text-lg md:text-xl text-card/90 mb-6 text-pretty">
            {currentItem.description}
          </p>
          
          <div className="flex flex-wrap gap-4 mb-8 text-card/80">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{currentItem.date}</span>
            </div>
            {currentItem.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{currentItem.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">{currentItem.volunteers} Gönüllü</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
              <Link href={`/proje/${currentItem.projectId}`}>Projeyi İncele</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-card/50 text-card hover:bg-card/10 hover:text-card" asChild>
              <Link href="/#projeler">Tüm Projeler</Link>
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="absolute bottom-8 right-8 flex items-center gap-4">
          <div className="flex gap-2">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? "bg-card w-8" 
                    : "bg-card/50 hover:bg-card/70"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-card/20 hover:bg-card/30 flex items-center justify-center text-card transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-card/20 hover:bg-card/30 flex items-center justify-center text-card transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
