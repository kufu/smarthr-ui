import React, { HTMLAttributes } from 'react'

export type Props = {
  children?: React.ReactNode
  className?: string
}
type ElementProps = Omit<HTMLAttributes<HTMLTableRowElement>, keyof Props>

export const Row: React.FC<Props & ElementProps> = ({ className = '', children, ...props }) => (
  <tr className={className} {...props}>
    {children}
  </tr>
)
