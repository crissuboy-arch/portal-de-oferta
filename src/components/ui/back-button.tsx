"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BackButton() {
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = "/"
    }
  }

  return (
    <Button variant="ghost" onClick={handleBack}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      Voltar
    </Button>
  )
}