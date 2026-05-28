"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { WHATSAPP_URL } from "@/lib/constants/site";

interface PlanStickyBarProps {
  price: string;
  planName: string;
}

export function PlanStickyBar({ price, planName }: PlanStickyBarProps) {
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Sentinel placed at the bottom of the hero — tracked by IntersectionObserver */}
      <div ref={sentinelRef} aria-hidden="true" />

      {/* Sticky bar — only visible on mobile (<lg) after hero scrolls out */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white shadow-[0_-2px_12px_rgba(0,0,0,0.10)] h-16 flex items-center px-4 gap-4 transition-transform duration-300 ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
        aria-label={`Preço do Plano ${planName}`}
      >
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-muted leading-none mb-0.5">
            a partir de
          </p>
          <p className="text-xl font-bold text-mata-900 leading-none truncate">
            {price}
            <span className="text-sm font-normal text-muted ml-1">/mês</span>
          </p>
        </div>
        <Button
          href={WHATSAPP_URL}
          variant="accent"
          size="sm"
          className="shrink-0"
        >
          Contratar
        </Button>
      </div>
    </>
  );
}
