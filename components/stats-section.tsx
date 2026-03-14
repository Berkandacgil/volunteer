"use client"

import { useEffect, useState } from "react"
import { Users, Heart, TreeDeciduous, MapPin } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: 12500,
    suffix: "+",
    label: "Aktif Gönüllü",
  },
  {
    icon: Heart,
    value: 850,
    suffix: "+",
    label: "Tamamlanan Proje",
  },
  {
    icon: TreeDeciduous,
    value: 25000,
    suffix: "+",
    label: "Dikilen Fidan",
  },
  {
    icon: MapPin,
    value: 81,
    suffix: "",
    label: "İl Kapsamı",
  },
]

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return (
    <span>
      {count.toLocaleString("tr-TR")}
      {suffix}
    </span>
  )
}

export function StatsSection() {
  return (
    <section className="py-16 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-foreground/10 mb-4">
                <stat.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-1">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-sm text-primary-foreground/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
