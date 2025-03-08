import React, { useState } from 'react'

export function Toggle({ defaultPressed = false, onPressedChange, children, className, ...props }) {
  const [isPressed, setIsPressed] = useState(defaultPressed)

  const handleClick = () => {
    const newState = !isPressed
    setIsPressed(newState)
    if (onPressedChange) {
      onPressedChange(newState)
    }
  }

  return (
    <button
      type="button"
      aria-pressed={isPressed}
      data-state={isPressed ? "on" : "off"}
      onClick={handleClick}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  )
}