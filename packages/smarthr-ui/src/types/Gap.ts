import type { AbstractSize, CharRelativeSize } from '../themes'

// smarthr-design-systemでtypes exportされています:
// import type { Gap, SeparateGap } from 'smarthr-ui/types'
export type Gap = CharRelativeSize | AbstractSize
export type SeparateGap = {
  row: Gap
  column: Gap
}
