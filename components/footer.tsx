import Link from "next/link"
import { Heart, Instagram, Twitter, Facebook, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer id="iletisim" className="bg-foreground text-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter */}
        <div className="py-12 border-b border-card/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="font-serif text-xl font-bold mb-2">Bültenimize Abone Olun</h3>
              <p className="text-card/70 text-sm">Yeni projelerden ve etkinliklerden haberdar olun.</p>
            </div>
            <div className="flex gap-2 max-w-md w-full md:w-auto">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-4 py-2 rounded-lg bg-card/10 border border-card/20 text-card placeholder:text-card/50 focus:outline-none focus:border-primary"
              />
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Abone Ol
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground fill-primary-foreground" />
              </div>
              <span className="font-serif text-xl font-bold">GönülBir</span>
            </Link>
            <p className="text-card/70 text-sm mb-6">
              Türkiye'nin en büyük gönüllülük platformu. Topluma katkı sağlamak için bir tık uzağınızdayız.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-card/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-card/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-card/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-card/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium mb-4">Hızlı Bağlantılar</h4>
            <ul className="space-y-3 text-sm text-card/70">
              <li><Link href="#" className="hover:text-card transition-colors">Projeler</Link></li>
              <li><Link href="#" className="hover:text-card transition-colors">Nasıl Çalışır?</Link></li>
              <li><Link href="#" className="hover:text-card transition-colors">Sıkça Sorulan Sorular</Link></li>
              <li><Link href="#" className="hover:text-card transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-card transition-colors">Kariyer</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-medium mb-4">Kategoriler</h4>
            <ul className="space-y-3 text-sm text-card/70">
              <li><Link href="#" className="hover:text-card transition-colors">Çevre</Link></li>
              <li><Link href="#" className="hover:text-card transition-colors">Eğitim</Link></li>
              <li><Link href="#" className="hover:text-card transition-colors">Sosyal Yardım</Link></li>
              <li><Link href="#" className="hover:text-card transition-colors">Sağlık</Link></li>
              <li><Link href="#" className="hover:text-card transition-colors">Hayvan Hakları</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium mb-4">İletişim</h4>
            <ul className="space-y-3 text-sm text-card/70">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:info@gonulbir.org" className="hover:text-card transition-colors">
                  info@gonulbir.org
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:+902121234567" className="hover:text-card transition-colors">
                  (0212) 123 45 67
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>Levent, Beşiktaş<br />İstanbul, Türkiye</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-card/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-card/50">
          <p>© 2026 GönülBir. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-card transition-colors">Gizlilik Politikası</Link>
            <Link href="#" className="hover:text-card transition-colors">Kullanım Koşulları</Link>
            <Link href="#" className="hover:text-card transition-colors">Çerez Politikası</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
