import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface BadgeProps {
  children: ReactNode
  variant?: "default" | "secondary" | "destructive" | "outline"
  className?: string
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variantClasses = {
    default: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    secondary: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    destructive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    outline: "border border-gray-300 dark:border-gray-700",
  }

  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      variantClasses[variant],
      className
    )}>
      {children}
    </span>
  )
}