import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface TabsProps {
  children: ReactNode
  value: string
  onValueChange: (value: string) => void
  className?: string
}

interface TabsListProps {
  children: ReactNode
  className?: string
}

interface TabsTriggerProps {
  children: ReactNode
  value: string
  className?: string
}

interface TabsContentProps {
  children: ReactNode
  value: string
  className?: string
}

export function Tabs({ children, value, onValueChange, className }: TabsProps) {
  return (
    <div className={cn("w-full", className)}>
      {children}
    </div>
  )
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
      className
    )}>
      {children}
    </div>
  )
}

export function TabsTrigger({ children, value, className }: TabsTriggerProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 dark:data-[state=active]:bg-gray-950 dark:data-[state=active]:text-gray-50",
        className
      )}
      data-state={value}
    >
      {children}
    </button>
  )
}

export function TabsContent({ children, value, className }: TabsContentProps) {
  return (
    <div className={cn("mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300", className)}>
      {children}
    </div>
  )
}