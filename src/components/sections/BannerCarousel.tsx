"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { createClient } from "@/lib/supabase/client";
import type { Banner } from "@/lib/supabase/banners";

// Art-direction com o otimizador de imagem do Next.
//
// Antes usávamos dois <Image fill> (desktop com `hidden md:block` e mobile com
// `md:hidden`). O navegador baixa <img> mesmo com display:none, então no mobile
// a versão desktop também era baixada, competindo por banda com o LCP.
//
// Um único <picture> com <source media> resolve: o preload scanner lê o HTML
// SSR antes do JS e baixa SÓ a imagem que casa com o breakpoint. As URLs
// apontam para /_next/image, então AVIF/WebP e o resize continuam ativos.
const IMG_QUALITY = 75;
// Larguras devem existir em images.deviceSizes (default do Next) p/ o otimizador aceitar.
const MOBILE_WIDTHS = [640, 750, 828, 1080];
const DESKTOP_WIDTHS = [1080, 1200, 1920, 2048];

function optimized(src: string, w: number) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${IMG_QUALITY}`;
}

function buildSrcSet(src: string, widths: number[]) {
  return widths.map((w) => `${optimized(src, w)} ${w}w`).join(", ");
}

export function BannerCarousel({ initialBanners = [] }: { initialBanners?: Banner[] }) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [current, setCurrent] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
  });

  useEffect(() => {
    // Os banners já vêm do servidor (SSR) via initialBanners — o que coloca a
    // imagem LCP no HTML inicial. Só buscamos no cliente como fallback, caso a
    // lista venha vazia (ex.: falha no SSR).
    if (initialBanners.length > 0) return;
    async function fetchBanners() {
      const supabase = createClient();
      const { data } = await supabase
        .from("banners")
        .select("id, title, image_url, image_mobile_url, link_url, link_target, alt_text")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (data && data.length > 0) setBanners(data);
    }
    fetchBanners();
  }, [initialBanners.length]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrent(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  // Auto-play
  useEffect(() => {
    if (!emblaApi || banners.length <= 1) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 3000);
    return () => clearInterval(interval);
  }, [emblaApi, banners.length]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Reserva espaço durante o carregamento inicial para evitar CLS
  // Aspect ratios reais: mobile 600×341 (~56.8%), desktop 1920×681 (~35.5%)
  if (banners.length === 0) {
    return (
      <section className="relative w-full">
        <div className="w-full bg-gray-100 md:hidden" style={{ paddingBottom: "56.83%" }} />
        <div className="w-full bg-gray-100 hidden md:block" style={{ paddingBottom: "35.47%" }} />
      </section>
    );
  }

  return (
    <section className="relative w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner, index) => {
            const isLcp = index === 0;
            const desktopSrc = banner.image_url;
            const mobileSrc = banner.image_mobile_url || banner.image_url;
            // Aspect ratios reais: mobile 600×341, desktop 1920×681 — o
            // container reserva o espaço exato em cada breakpoint (evita CLS).
            const slide = (
              <div className="relative w-full aspect-[600/341] md:aspect-[1920/681]">
                <picture>
                  {/* Desktop só baixa quando a media query casa */}
                  <source
                    media="(min-width: 768px)"
                    srcSet={buildSrcSet(desktopSrc, DESKTOP_WIDTHS)}
                    sizes="100vw"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={optimized(mobileSrc, 828)}
                    srcSet={buildSrcSet(mobileSrc, MOBILE_WIDTHS)}
                    sizes="100vw"
                    alt={banner.alt_text || banner.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    decoding="async"
                    loading={isLcp ? "eager" : "lazy"}
                    fetchPriority={isLcp ? "high" : "auto"}
                  />
                </picture>
              </div>
            );

            if (banner.link_url) {
              return (
                <Link
                  key={banner.id}
                  href={banner.link_url}
                  target={banner.link_target || "_self"}
                  rel={banner.link_target === "_blank" ? "noopener noreferrer" : undefined}
                  className="flex-none min-w-0 basis-full cursor-pointer"
                >
                  {slide}
                </Link>
              );
            }

            return (
              <div key={banner.id} className="flex-none min-w-0 basis-full">
                {slide}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center hover:bg-black/40 transition-colors"
            aria-label="Banner anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center hover:bg-black/40 transition-colors"
            aria-label="Próximo banner"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2.5">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  i === current
                    ? "bg-white w-8"
                    : "bg-white/50 w-3 hover:bg-white/80"
                }`}
                aria-label={`Ir para banner ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
