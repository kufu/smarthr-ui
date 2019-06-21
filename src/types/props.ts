import { CSSProperties } from 'react'

export type FineSize = 'xs' | 's' | 'm' | 'l' | 'xl'
export type Size = 's' | 'm' | 'l'

export interface ComponentProps {
  pcSize?: Size
  tabletSize?: Size
  spSize?: Size
  className?: string
  style?: CSSProperties
  children?: React.ReactNode
}

export interface StyledProperties {
  pcSize?: Size
  tabletSize?: Size
  spSize?: Size
}
