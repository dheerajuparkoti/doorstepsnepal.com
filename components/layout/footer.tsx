
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { Home, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();

  // Function to handle scroll to section
  const scrollToSection = (sectionId: string) => {
    // If we're already on the about page
    if (pathname === "/about") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navigate to about page with hash
      router.push(`/about#${sectionId}`);
    }
  };

  // Function to handle contact info click
  const handleContactClick = (e: React.MouseEvent, sectionId: string = "contact") => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Home className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Doorsteps Nepal</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t.footer.aboutText}
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>

          {/* Quick Links - Updated with scroll functionality */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t.footer.quickLinks}</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection("hero")}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {t.footer.aboutUs}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {t.footer.contactUs}
                </button>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {t.footer.privacyPolicy}
                </a>
              </li>
              <li>
                <a
                  // href="/terms"
                  href="/terms-conditions"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {t.footer.termsConditions}
                </a>
              </li>
              <li>
                <a
                  href="/faqs"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {t.footer.faqs}
                </a>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t.footer.account}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/login"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {t.nav.login}
                </a>
              </li>
              {/* <li>
                <a
                  href="/signup"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {t.nav.signUp}
                </a>
              </li> */}
              <li>
                <a
                  href="/login"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {t.nav.becomeProfessional}
                </a>
              </li>
            </ul>
            <h3 className="font-semibold">{t.footer.download}</h3>
              <ul className="space-y-2">
              <li>
                <a
                  href="/downloads-app"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {t.hero.downloadApp}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info - Updated with scroll functionality */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t.footer.contactUs}</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={(e) => handleContactClick(e, "contact")}
                  className="flex w-full items-start gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span className="text-left">Kathmandu, Nepal</span>
                </button>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
        

               <span>+977-9851407706</span> 
             


              </li>
               <li className="flex items-center gap-3 text-sm text-muted-foreground">
       
                 <Phone className="h-4 w-4 shrink-0" />
                   <span>+977-9851407707</span> 
        


              </li>
               <li className="flex items-center gap-3 text-sm text-muted-foreground">
        
                 <Phone className="h-4 w-4 shrink-0" />
            
                   <span>+977-9768943001</span>


              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span>info@doorstepsnepal.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}