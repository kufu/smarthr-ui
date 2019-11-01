import * as React from 'react'

import { TableGroupContext } from './Table'

export type Props = {
  children?: React.ReactNode
  className?: string
}

export const Head: React.FC<Props> = ({ className = '', children }) => (
  <thead className={className}>
    <TableGroupContext.Provider value={{ group: 'head' }}>{children}</TableGroupContext.Provider>
  </thead>
)
