import { Header } from "@/components/header"
import { HeroCarousel } from "@/components/hero-carousel"
import { StatsSection } from "@/components/stats-section"
import { ProjectsSection } from "@/components/projects-section"
import { CategoriesSection } from "@/components/categories-section"
import { UpcomingEvents } from "@/components/upcoming-events"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroCarousel />
      <StatsSection />
      <ProjectsSection />
      <CategoriesSection />
      <UpcomingEvents />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
