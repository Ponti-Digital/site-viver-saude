"use client";

import { Button } from "@/components/ui/Button";
import { openConsentManager } from "@/lib/utils/cookie-consent";

interface ManageCookiesButtonProps {
  /** Use "outline-light" em fundos escuros (ex.: footer). Default "outline" para fundos claros. */
  variant?: "outline" | "outline-light";
}

export function ManageCookiesButton({
  variant = "outline",
}: ManageCookiesButtonProps = {}) {
  return (
    <Button variant={variant} size="md" onClick={openConsentManager}>
      Gerenciar preferências de cookies
    </Button>
  );
}
