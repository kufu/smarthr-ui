import { Props, CSSProperties } from 'react'

export type SizePattern = 'xs' | 's' | 'm' | 'l' | 'xl'

export interface ComponentProps<T> extends Props<T> {
  pcSize?: SizePattern
  tabletSize?: SizePattern
  spSize?: SizePattern
  className?: string
  style?: CSSProperties
}

export interface StyledProperties {
  pcSize: SizePattern
  tabletSize: SizePattern
  spSize: SizePattern
}
