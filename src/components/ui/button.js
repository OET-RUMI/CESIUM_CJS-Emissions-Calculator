import React from 'react'

export function Button({ variant = "default", size = "default", className, icon, ...props }) {
  const getVariantClasses = () => {
    switch (variant) {
      case "default":
        return "btn-primary transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
      case "destructive":
        return "destructive-button transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
      case "outline":
        return "border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
      case "secondary":
        return "btn-secondary transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
      case "accent":
        return "btn-accent transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
      case "ghost":
        return "ghost-button hover:text-accent-foreground transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5"
      case "link":
        return "text-primary underline-offset-4 hover:underline transition-all duration-200"
      default:
        return "btn-primary transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
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