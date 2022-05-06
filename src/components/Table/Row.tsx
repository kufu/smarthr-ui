import React, { HTMLAttributes } from 'react'
import { useClassNames } from './useClassNames'

export type Props = {
  children?: React.ReactNode
  className?: string
}
type ElementProps = Omit<HTMLAttributes<HTMLTableRowElement>, keyof Props>

/**
 * @deprecated Row コンポーネントは非推奨です。 tr 要素に置き換えてください。
 */
export const Row: React.VFC<Props & ElementProps> = ({ className = '', children, ...props }) => {
  const classNames = useClassNames().row
  return (
    <tr className={`${className} ${classNames.wrapper}`} {...props}>
      {children}
    </tr>
  )
}
