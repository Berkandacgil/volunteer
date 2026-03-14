"use client"

import { TreeDeciduous, GraduationCap, Heart, Stethoscope, Dog, Users } from "lucide-react"

const categories = [
  {
    icon: TreeDeciduous,
    title: "Çevre",
    description: "Ağaçlandırma, temizlik ve doğa koruma projeleri",
    projects: 24,
    color: "bg-chart-1/10 text-chart-1",
  },
  {
    icon: GraduationCap,
    title: "Eğitim",
    description: "Öğrencilere destek, mentorluk ve eğitim materyali",
    projects: 18,
    color: "bg-chart-2/10 text-chart-2",
  },
  {
    icon: Heart,
    title: "Sosyal Yardım",
    description: "Gıda, giysi ve temel ihtiyaç desteği",
    projects: 32,
    color: "bg-chart-5/10 text-chart-5",
  },
  {
    icon: Stethoscope,
    title: "Sağlık",
    description: "Sağlık taraması ve farkındalık kampanyaları",
    projects: 12,
    color: "bg-chart-3/10 text-chart-3",
  },
  {
    icon: Dog,
    title: "Hayvan Hakları",
    description: "Barınak desteği ve sokak hayvanları bakımı",
    projects: 15,
    color: "bg-chart-4/10 text-chart-4",
  },
  {
    icon: Users,
    title: "Yaşlı Bakımı",
    description: "Huzurevi ziyaretleri ve yaşlı desteği",
    projects: 9,
    color: "bg-accent/20 text-accent",
  },
]

export function CategoriesSection() {
  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Kategoriler
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2 text-balance">
            İlgi Alanına Göre Projeler
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-pretty">
            Hangi alanda fark yaratmak istiyorsunuz? Size en uygun kategoriyi seçin.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <button
              key={index}
              className="group p-6 bg-card rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all text-left"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${category.color} mb-4`}>
                <category.icon className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {category.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {category.description}
              </p>
              <span className="text-xs font-medium text-primary">
                {category.projects} aktif proje →
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
