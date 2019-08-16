import * as React from 'react'
import { InjectedProps, withTheme } from '../../hocs/withTheme'

export type Props = {
  children?: React.ReactNode
  className?: string
}

const Row: React.FC<Props & InjectedProps> = ({ className = '', children }) => {
  return <tr className={className}>{children}</tr>
}

export default withTheme(Row)
