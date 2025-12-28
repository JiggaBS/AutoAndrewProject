import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Car, Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = forwardRef<HTMLElement>((props, ref) => {
  const { t, language } = useLanguage();
  
  return (
    <footer ref={ref} className="bg-card border-t border-border">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Car className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-foreground">AutoAndrew</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              {t("footer.description")}
            </p>
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-2">{t("footer.newsletter")}</p>
              <div className="flex gap-2">
                <Input type="email" placeholder={t("footer.newsletter.placeholder")} className="bg-secondary border-border" />
                <Button size="sm">{t("footer.newsletter.button")}</Button>
              </div>
            </div>
          </div>

          {/* Site Menu */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t("footer.menu")}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link to="/listings" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  {t("nav.listings")}
                </Link>
              </li>
              <li>
                <Link to="/valutiamo" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  {t("nav.valutiamo")}
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  {t("nav.blog")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t("footer.info")}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  {t("nav.faq")}
                </Link>
              </li>
              <li>
                <Link to="/traccia-richiesta" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  {language === "it" ? "Traccia la tua richiesta" : "Track your request"}
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  {t("footer.cookies")}
                </Link>
              </li>
              <li>
                <Link to="/contatti" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t("footer.contacts")}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                +39 333 388 9908
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                gajanovsa@gmail.com
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5" />
                Via Roma 123, 00100 Roma RM
              </li>
            </ul>
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} AutoAndrew. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/terms" className="hover:text-foreground transition-colors">
              {t("footer.terms")}
            </Link>
            <Link to="/privacy-policy" className="hover:text-foreground transition-colors">
              {t("footer.privacy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
