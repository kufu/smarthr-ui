import * as React from 'react'

export type Props = {
  children?: React.ReactNode
  className?: string
}

export const Row: React.FC<Props> = ({ className = '', children }) => (
  <tr className={className}>{children}</tr>
)
