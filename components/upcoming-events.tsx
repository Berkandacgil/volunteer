"use client"

import { Calendar, Clock, MapPin, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const events = [
  {
    id: 1,
    title: "Gönüllülük Buluşması 2026",
    description: "Tüm gönüllülerimizin bir araya geldiği yıllık buluşma etkinliği.",
    date: "28 Mart 2026",
    time: "14:00 - 18:00",
    location: "Zorlu PSM, İstanbul",
    attendees: 450,
    type: "Networking",
  },
  {
    id: 2,
    title: "Gönüllü Eğitim Semineri",
    description: "Proje yönetimi ve liderlik becerileri üzerine ücretsiz eğitim.",
    date: "5 Nisan 2026",
    time: "10:00 - 16:00",
    location: "Online",
    attendees: 200,
    type: "Eğitim",
  },
  {
    id: 3,
    title: "Dünya Çevre Günü Organizasyonu",
    description: "81 ilde eş zamanlı ağaçlandırma ve temizlik etkinliği.",
    date: "5 Haziran 2026",
    time: "09:00 - 17:00",
    location: "Türkiye Geneli",
    attendees: 5000,
    type: "Etkinlik",
  },
]

export function UpcomingEvents() {
  return (
    <section id="etkinlikler" className="py-16 md:py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Etkinlikler
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2 text-balance">
              Yaklaşan Etkinlikler
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl text-pretty">
              Gönüllülük dünyasındaki en önemli etkinliklere katılın.
            </p>
          </div>
          <Button variant="outline" className="gap-2 w-fit">
            Tüm Etkinlikler
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="group p-6 bg-card rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all flex flex-col lg:flex-row lg:items-center gap-6"
            >
              {/* Date Box */}
              <div className="flex-shrink-0 w-20 h-20 bg-primary/10 rounded-xl flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {event.date.split(" ")[0]}
                </span>
                <span className="text-xs text-primary uppercase">
                  {event.date.split(" ")[1]}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {event.type}
                      </Badge>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                      {event.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {event.attendees.toLocaleString("tr-TR")} Katılımcı
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex-shrink-0">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                  Katıl
                  <Calendar className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
