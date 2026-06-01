"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { createClient } from "@/lib/supabase/client";

interface Banner {
  id: string;
  title: string;
  image_url: string;
  image_mobile_url: string | null;
  link_url: string | null;
  link_target: string;
  alt_text: string | null;
}

export function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
  });

  useEffect(() => {
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
  }, []);

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
            const slide = (
              <div className="relative w-full flex-none min-w-0 basis-full">
                {/* Desktop image — aspect ratio real: 1920×681 */}
                <Image
                  src={banner.image_url}
                  alt={banner.alt_text || banner.title}
                  width={1920}
                  height={681}
                  className="w-full h-auto hidden md:block"
                  sizes="100vw"
                  priority={index === 0}
                />
                {/* Mobile image — aspect ratio real: 600×341 */}
                <Image
                  src={banner.image_mobile_url || banner.image_url}
                  alt={banner.alt_text || banner.title}
                  width={600}
                  height={341}
                  className="w-full h-auto md:hidden"
                  sizes="100vw"
                  priority={index === 0}
                />
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
