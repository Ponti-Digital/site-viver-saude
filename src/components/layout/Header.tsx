"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { NAV_ITEMS, SITE, PORTALS } from "@/lib/constants/site";
import { Button } from "@/components/ui/Button";
import { MobileNav } from "./MobileNav";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top utility bar */}
      <div className="bg-primary-dark text-white/90 text-xs hidden lg:block">
        <div className="max-w-7xl mx-auto px-6 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <a href={`tel:${SITE.phone}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {SITE.email}
            </a>
          </div>
          <div className="flex items-center gap-3 text-white/70">
            <a href={PORTALS.cliente} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Portal do Cliente
            </a>
            <span className="text-white/20">|</span>
            <a href={PORTALS.prestador} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Área do Prestador
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md py-0"
            : "bg-white shadow-sm py-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/images/logo/logo-viversaude-color.avif"
                alt="Logo - Viver Saúde"
                width={150}
                height={45}
                className="h-9 lg:h-10 w-auto"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav aria-label="Navegação principal" className="hidden lg:flex items-center">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() =>
                    "children" in item ? setOpenDropdown(item.href) : null
                  }
                  onMouseLeave={() => setOpenDropdown(null)}
                  onFocus={() =>
                    "children" in item ? setOpenDropdown(item.href) : null
                  }
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                      setOpenDropdown(null);
                    }
                  }}
                >
                  <Link
                    href={item.href}
                    className="relative px-2.5 xl:px-3 py-2 text-[13px] xl:text-sm font-medium text-foreground/80 hover:text-primary transition-colors group"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-primary rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    {"children" in item && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-3 h-3 inline-block ml-0.5 transition-transform duration-200 ${
                          openDropdown === item.href ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>

                  {"children" in item && openDropdown === item.href && (
                    <div className="absolute top-full left-0 pt-1 w-52">
                      <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 overflow-hidden">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA + mobile toggle */}
            <div className="flex items-center gap-3">
              <Button
                href="/quero-ser-cliente"
                size="sm"
                className="hidden lg:inline-flex rounded-full text-[13px]"
              >
                Quero Contratar
              </Button>

              <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden p-2.5 text-foreground hover:text-primary transition-colors rounded-lg hover:bg-gray-50"
                aria-label="Abrir menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNav isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
    </>
  );
}
