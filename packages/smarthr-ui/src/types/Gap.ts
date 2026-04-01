import type { AbstractSize, CharRelativeSize } from '../themes'

export type Gap = CharRelativeSize | AbstractSize
export type SeparateGap = {
  row: Gap
  column: Gap
}
