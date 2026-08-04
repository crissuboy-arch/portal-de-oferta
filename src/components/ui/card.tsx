import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  padding?: "sm" | "md" | "lg" | "none"
}

export function Card({ children, className, hover = false, padding = "md" }: CardProps) {
  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    none: "p-0",
  }

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700",
        paddingClasses[padding],
        hover && "transition-all duration-200 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600",
        className
      )}
    >
      {children}
    </div>
  )
}