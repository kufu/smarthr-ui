import type { AbstractSize, CharRelativeSize, PositiveCharRelativeSize } from '../themes'

export type Gap = CharRelativeSize | AbstractSize
// マイナスマージン用途を除いた、0以上のGap
export type PositiveGap = PositiveCharRelativeSize | AbstractSize
export type SeparatePositiveGap = {
  row: PositiveGap
  column: PositiveGap
}
