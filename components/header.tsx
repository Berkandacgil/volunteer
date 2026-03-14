"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Menu, X, Search, User, Bell, LogOut, Shield, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAdmin, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground fill-primary-foreground" />
            </div>
            <span className="font-serif text-xl font-bold text-foreground">GönülBir</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#projeler" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Projeler
            </Link>
            <Link href="/#kategoriler" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Kategoriler
            </Link>
            <Link href="/#etkinlikler" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Etkinlikler
            </Link>
            <Link href="/#iletisim" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              İletişim
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Search className="w-5 h-5" />
            </Button>
            
            {user ? (
              <>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-foreground">
                          {user.displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {isAdmin && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                          <Shield className="w-2.5 h-2.5 text-accent-foreground" />
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium text-foreground">{user.displayName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      {isAdmin && (
                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
                          <Shield className="w-3 h-3" />
                          Admin
                        </span>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profil" className="cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        Profilim
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/proje/olustur" className="cursor-pointer">
                        <Plus className="w-4 h-4 mr-2" />
                        Proje Oluştur
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer">
                            <Shield className="w-4 h-4 mr-2" />
                            Admin Paneli
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Çıkış Yap
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/giris">Giriş Yap</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/kayit">Gönüllü Ol</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <Link href="/#projeler" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Projeler
              </Link>
              <Link href="/#kategoriler" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Kategoriler
              </Link>
              <Link href="/#etkinlikler" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Etkinlikler
              </Link>
              <Link href="/#iletisim" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                İletişim
              </Link>
              
              {user ? (
                <>
                  <div className="border-t border-border pt-4 mt-2">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-lg font-medium text-primary-foreground">
                          {user.displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.displayName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Link href="/profil" className="block text-sm font-medium text-muted-foreground hover:text-foreground mb-2">
                      Profilim
                    </Link>
                    <Link href="/proje/olustur" className="block text-sm font-medium text-muted-foreground hover:text-foreground mb-2">
                      Proje Oluştur
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="block text-sm font-medium text-primary hover:text-primary/80 mb-2">
                        Admin Paneli
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="text-sm font-medium text-destructive hover:text-destructive/80"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-border">
                  <Button variant="outline" asChild>
                    <Link href="/auth/giris">Giriş Yap</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/kayit">Gönüllü Ol</Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
