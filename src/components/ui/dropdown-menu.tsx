"use client"

import { ReactNode, useState } from "react"
import { cn } from "@/lib/utils"

interface DropdownMenuProps {
  children: ReactNode
  className?: string
}

interface DropdownMenuTriggerProps {
  children: ReactNode
  asChild?: boolean
  className?: string
}

interface DropdownMenuContentProps {
  children: ReactNode
  className?: string
  align?: "start" | "end" | "center"
}

interface DropdownMenuItemProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
}

interface DropdownMenuLabelProps {
  children: ReactNode
  className?: string
}

interface DropdownMenuSeparatorProps {
  className?: string
}

export function DropdownMenu({ children, className }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={cn("relative", className)}>
      {children}
    </div>
  )
}

export function DropdownMenuTrigger({ children, asChild, className, ...props }: DropdownMenuTriggerProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function DropdownMenuContent({ children, className, align = "start" }: DropdownMenuContentProps) {
  const alignClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  }

  return (
    <div className={cn(
      "absolute z-50 mt-2 w-56 rounded-md border border-gray-200 bg-white p-1 shadow-md animate-in fade-in-80 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-950",
      alignClasses[align],
      className
    )}>
      {children}
    </div>
  )
}

export function DropdownMenuItem({ children, className, onClick, disabled }: DropdownMenuItemProps) {
  return (
    <button
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:hover:bg-gray-800 dark:focus:bg-gray-800 dark:focus:text-gray-50 w-full text-left",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export function DropdownMenuLabel({ children, className }: DropdownMenuLabelProps) {
  return (
    <div className={cn("px-2 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-300", className)}>
      {children}
    </div>
  )
}

export function DropdownMenuSeparator({ className }: DropdownMenuSeparatorProps) {
  return (
    <div className={cn("-mx-1 my-1 h-px bg-gray-200 dark:bg-gray-800", className)} />
  )
}