"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ProgramRegistrationModal } from "./ProgramRegistrationModal";

interface ProgramEnrollButtonProps {
  programName: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "secondary-green" | "outline" | "outline-secondary" | "ghost" | "accent" | "info";
  className?: string;
}

export function ProgramEnrollButton({
  programName,
  size = "md",
  variant = "outline",
  className,
}: ProgramEnrollButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setIsModalOpen(true)}
      >
        Inscreva-se pelo site
      </Button>
      <ProgramRegistrationModal
        programName={programName}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
