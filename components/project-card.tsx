"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Heart, Clock, ArrowRight } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useProjects } from "@/lib/projects-context"

interface ProjectCardProps {
  id: string
  image: string
  title: string
  description: string
  category: string
  date: string
  location: string
  volunteers: number
  maxVolunteers: number
  isUrgent?: boolean
  daysLeft?: number
  likes?: number
}

export function ProjectCard({
  id,
  image,
  title,
  description,
  category,
  date,
  location,
  volunteers,
  maxVolunteers,
  isUrgent,
  daysLeft,
  likes = 0,
}: ProjectCardProps) {
  const { user } = useAuth()
  const { projects, likeProject, unlikeProject } = useProjects()
  
  const project = projects.find((p) => p.id === id)
  const isLiked = user && project ? project.likes.includes(user.id) : false
  const progress = (volunteers / maxVolunteers) * 100

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return
    
    try {
      if (isLiked) {
        await unlikeProject(id)
      } else {
        await likeProject(id)
      }
    } catch (error) {
      console.error("Like error:", error)
    }
  }

  return (
    <Link href={`/proje/${id}`}>
      <Card className="group overflow-hidden border-border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
        <div className="relative h-52 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-primary/90 text-primary-foreground hover:bg-primary">
              {category}
            </Badge>
            {isUrgent && (
              <Badge className="bg-destructive/90 text-destructive-foreground hover:bg-destructive">
                Acil
              </Badge>
            )}
          </div>

          {/* Like Button */}
          <button
            onClick={handleLike}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/90 flex items-center justify-center hover:bg-card transition-colors"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isLiked ? "fill-destructive text-destructive" : "text-muted-foreground"
              }`}
            />
          </button>

          {/* Days Left */}
          {daysLeft !== undefined && daysLeft > 0 && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-card/90 rounded-full text-xs font-medium text-foreground">
              <Clock className="w-3 h-3" />
              {daysLeft} gün kaldı
            </div>
          )}
        </div>

        <CardContent className="p-5">
          <h3 className="font-serif text-lg font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {description}
          </p>

          {/* Info */}
          <div className="flex flex-wrap gap-3 mb-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {date}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {location}
            </div>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="w-3.5 h-3.5" />
                <span>{volunteers} / {maxVolunteers} Gönüllü</span>
              </div>
              <span className="font-medium text-foreground">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>

          {/* Stats & Action */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Heart className="w-3.5 h-3.5" />
              <span>{likes} beğeni</span>
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground group/btn">
              Detaylar
              <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
