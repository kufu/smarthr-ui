import type { AbstractSize, CharRelativeSize, PositiveCharRelativeSize } from '../themes'

// smarthr-design-systemでtypes exportされています:
// import type { Gap, SeparateGap } from 'smarthr-ui/types'
export type Gap = CharRelativeSize | AbstractSize
export type SeparateGap = {
  row: Gap
  column: Gap
}
// マイナスマージン用途を除いた、0以上のGap
export type PositiveGap = PositiveCharRelativeSize | AbstractSize
