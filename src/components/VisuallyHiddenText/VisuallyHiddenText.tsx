import React, { HTMLAttributes } from 'react'

export const VisuallyHiddenText: React.FC<HTMLAttributes<HTMLSpanElement>> = ({ children }) => (
  <span
    style={{
      clipPath: 'inset(100%)',
      clip: 'rect(0 0 0 0)',
    }}
    className="shr-absolute shr-left-0 shr-top-[-1px] shr-h-[1px] shr-w-[1px] shr-overflow-hidden shr-whitespace-nowrap shr-border-0 shr-p-0"
  >
    {children}
  </span>
)
