import type { AbstractSize, CharRelativeSize } from '../themes'

// Used in smarthr-design-system via types export:
// import type { Gap, SeparateGap } from 'smarthr-ui/types'
export type Gap = CharRelativeSize | AbstractSize
export type SeparateGap = {
  row: Gap
  column: Gap
}
