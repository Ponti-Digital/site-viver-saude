"use client";

import { Button } from "@/components/ui/Button";
import { openConsentManager } from "@/lib/utils/cookie-consent";

export function ManageCookiesButton() {
  return (
    <Button variant="outline" size="md" onClick={openConsentManager}>
      Gerenciar preferências de cookies
    </Button>
  );
}
