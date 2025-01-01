import { AbstractSize, CharRelativeSize, PositiveCharRelativeSize } from '../themes/createSpacing'

export type PositiveGap = PositiveCharRelativeSize | AbstractSize
export type Gap = CharRelativeSize | AbstractSize
export type SeparateGap = {
  row: Gap
  column: Gap
}
