'use client'

import { useCallback, useMemo } from 'react'

import { useLatest } from '../../../../hooks/useLatest'

import { ComboboxCore, type CommonProps } from './ComboboxCore'

import type { ComboboxItem } from './types'

type Props<T> = CommonProps<T> & {
  /** 選択中のアイテム。undefined 以外を渡すと制御コンポーネントになる */
  selectedItem?: ComboboxItem<T> | null
  /** 非制御で使うときの初期値。親の form の reset でもこの値に戻る */
  defaultSelectedItem?: ComboboxItem<T>
  onChangeSelected?: (selectedItem: ComboboxItem<T> | null) => void
}

export const SingleCombobox = <T,>({
  selectedItem,
  defaultSelectedItem,
  onChangeSelected,
  ...rest
}: Props<T>) => {
  const selected = useMemo(
    () => (selectedItem === undefined ? undefined : selectedItem ? [selectedItem] : []),
    [selectedItem],
  )
  const defaultSelected = useMemo(
    () => (defaultSelectedItem ? [defaultSelectedItem] : []),
    [defaultSelectedItem],
  )
  const latest = useLatest({ onChangeSelected })
  const handleChangeSelected = useCallback(
    (items: Array<ComboboxItem<T>>) => latest.onChangeSelected?.(items[0] ?? null),
    [latest],
  )

  return (
    <ComboboxCore
      {...rest}
      selected={selected}
      mode="single"
      defaultSelected={defaultSelected}
      onChangeSelected={handleChangeSelected}
    />
  )
}
