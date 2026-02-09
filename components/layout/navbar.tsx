"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { useTheme } from "@/lib/theme/context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menu,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  Home,
  Briefcase,
  Users,
  Info,
  UserPlus,
  LogIn,
  HomeIcon,
} from "lucide-react";

export function Navbar() {
  const { t, language, setLanguage } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t.nav.home, icon: HomeIcon },
    { href: "/services", label: t.nav.services, icon: Briefcase },
    { href: "/professionals", label: t.nav.professionals, icon: Users },
    { href: "/about", label: t.nav.aboutUs, icon: Info },
    { href: "/become-professional", label: t.nav.becomeProfessional, icon: UserPlus },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Home className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden text-xl font-bold text-foreground sm:inline-block">
            Doorsteps Nepal
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">{language === "en" ? "EN" : "NE"}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("en")}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("ne")}>
                नेपाली
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Auth Buttons - Desktop */}
          <div className="hidden items-center gap-2 sm:flex">
            {/* <Button variant="ghost" size="sm" asChild>
              <Link href="/login">{t.nav.login}</Link>
            </Button> */}
            <Button size="sm" asChild>
              <Link href="/login">{t.nav.login}</Link>
            </Button>
            {/* <Button size="sm" asChild>
              <Link href="/signup">{t.nav.signUp}</Link>
            </Button> */}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <Home className="h-4 w-4 text-primary-foreground" />
                  </div>
                  Doorsteps Nepal
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                ))}
                <div className="my-4 h-px bg-border" />
                {/* <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <LogIn className="h-5 w-5" />
                  {t.nav.login}
                </Link> */}
                  <Button asChild className="mt-2">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    {t.nav.login}
                  </Link>
                </Button>
                {/* <Button asChild className="mt-2">
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    {t.nav.signUp}
                  </Link>
                </Button> */}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
