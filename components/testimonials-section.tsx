"use client"

import { Quote, Star } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Ayşe Yılmaz",
    role: "5 Yıllık Gönüllü",
    content: "GönülBir sayesinde 50'den fazla projeye katıldım. Her proje bana yeni insanlar tanıttı ve topluma katkı sağlamanın mutluluğunu yaşattı.",
    initials: "AY",
    rating: 5,
  },
  {
    name: "Mehmet Kaya",
    role: "Proje Koordinatörü",
    content: "Platform olarak projeleri yönetmek çok kolay. Gönüllüleri bulmak ve organize etmek artık saatler değil dakikalar sürüyor.",
    initials: "MK",
    rating: 5,
  },
  {
    name: "Zeynep Demir",
    role: "Üniversite Öğrencisi",
    content: "Üniversite döneminde gönüllü çalışmalara katılmak kariyer gelişimime de çok katkı sağladı. Harika bir deneyim!",
    initials: "ZD",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Gönüllülerimiz
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2 text-balance">
            Onların Hikayesi
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-pretty">
            Binlerce gönüllümüz topluma katkı sağlamanın mutluluğunu paylaşıyor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative p-6 bg-card rounded-xl border border-border hover:shadow-lg transition-shadow"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/20" />
              
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              
              <p className="text-muted-foreground mb-6 text-pretty">
                &quot;{testimonial.content}&quot;
              </p>
              
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 bg-primary">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
