import React from 'react'

export function Button({ variant = "default", size = "default", className, icon, ...props }) {
  const getVariantClasses = () => {
    switch (variant) {
      case "default":
        return "btn-primary"
      case "destructive":
        return "bg-destructive text-destructive-foreground hover:bg-destructive/90"
      case "outline":
        return "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
      case "secondary":
        return "btn-secondary"
      case "accent":
        return "btn-accent"
      case "ghost":
        return "hover:bg-accent/10 hover:text-accent-foreground"
      case "link":
        return "text-primary underline-offset-4 hover:underline"
      default:
        return "btn-primary"
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case "default":
        return "h-10 px-4 py-2"
      case "sm":
        return "h-9 rounded-md px-3"
      case "lg":
        return "h-11 rounded-md px-8"
      case "icon":
        return "h-10 w-10"
      default:
        return "h-10 px-4 py-2"
    }
  }

  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  const variantClasses = getVariantClasses()
  const sizeClasses = getSizeClasses()
  
  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className || ''}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {props.children}
    </button>
  )
}