import React from 'react'

export function ScrollArea({ className, children, ...props }) {
  return (
    <div 
      className={`relative overflow-auto ${className || ''}`} 
      {...props}
    >
      <div className="h-full w-full text-white">
        {children}
      </div>
    </div>
  )
}