import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"

interface AlertProps {
  children: ReactNode
  variant?: "default" | "destructive" | "warning" | "success"
  className?: string
}

interface AlertTitleProps {
  children: ReactNode
  className?: string
}

interface AlertDescriptionProps {
  children: ReactNode
  className?: string
}

export function Alert({ children, variant = "default", className }: AlertProps) {
  const variantClasses = {
    default: "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
    destructive: "bg-red-50 text-red-900 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
    warning: "bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
    success: "bg-green-50 text-green-900 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
  }

  const icons = {
    default: Info,
    destructive: AlertCircle,
    warning: AlertTriangle,
    success: CheckCircle,
  }

  const Icon = icons[variant]

  return (
    <div className={cn(
      "relative w-full rounded-lg border p-4",
      variantClasses[variant],
      className
    )}>
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          {children}
        </div>
      </div>
    </div>
  )
}

export function AlertTitle({ children, className }: AlertTitleProps) {
  return (
    <h5 className={cn("font-semibold leading-none tracking-tight", className)}>
      {children}
    </h5>
  )
}

export function AlertDescription({ children, className }: AlertDescriptionProps) {
  return (
    <div className={cn("text-sm [&_p]:leading-relaxed", className)}>
      {children}
    </div>
  )
}