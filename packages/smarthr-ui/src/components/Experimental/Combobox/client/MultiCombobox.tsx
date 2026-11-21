'use client'

import { ComboboxCore, type CommonProps } from './ComboboxCore'

import type { ComboboxItem } from './types'

type Props<T> = CommonProps<T> & {
  /** 選択中のアイテム。undefined 以外を渡すと制御コンポーネントになる */
  selectedItems?: Array<ComboboxItem<T>>
  /** 非制御で使うときの初期値。親の form の reset でもこの値に戻る */
  defaultSelectedItems?: Array<ComboboxItem<T>>
  onChangeSelected?: (selectedItems: Array<ComboboxItem<T>>) => void
  /** トリガに並べる選択済みアイテムの上限。超えた分は「+N」にまとめる。省略時はすべて並べる */
  maxVisibleItems?: number
}

const EMPTY: never[] = []
const NOOP = () => {}

export const MultiCombobox = <T,>({
  selectedItems,
  defaultSelectedItems = EMPTY,
  onChangeSelected = NOOP,
  ...rest
}: Props<T>) => (
  <ComboboxCore
    {...rest}
    selected={selectedItems}
    mode="multiple"
    defaultSelected={defaultSelectedItems}
    onChangeSelected={onChangeSelected}
  />
)
