import { AbstractSize, CharRelativeSize } from '../themes/createSpacing'

export type Gap = CharRelativeSize | AbstractSize
export type SeparateGap = {
  row: Gap
  column: Gap
}
