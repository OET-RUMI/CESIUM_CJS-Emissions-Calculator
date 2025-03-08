import React from 'react'

export function ScrollArea({ className, children, ...props }) {
  return (
    <div 
      className={`relative overflow-auto ${className || ''}`} 
      {...props}
    >
      <div className="h-full w-full">
        {children}
      </div>
    </div>
  )
}