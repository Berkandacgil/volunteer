"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Heart } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-primary relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-4 border-primary-foreground" />
        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full border-4 border-primary-foreground" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full border-4 border-primary-foreground" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/10 mb-6">
          <Heart className="w-8 h-8 text-primary-foreground fill-primary-foreground" />
        </div>
        
        <h2 className="font-serif text-3xl md:text-5xl font-bold text-primary-foreground mb-6 text-balance">
          Fark Yaratmaya Hazır mısın?
        </h2>
        
        <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto text-pretty">
          Binlerce gönüllümüze katıl ve topluma katkı sağlamanın mutluluğunu yaşa.
          Her küçük adım büyük değişimlerin başlangıcıdır.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2"
          >
            Hemen Gönüllü Ol
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            Proje Başvurusu Yap
          </Button>
        </div>
      </div>
    </section>
  )
}
