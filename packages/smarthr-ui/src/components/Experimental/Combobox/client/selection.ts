import { areItemsEqual, convertMatchableString, getSelectedLabelText } from '../../../Combobox'

import type { ComboboxItem } from './types'

export type SelectionMode = 'single' | 'multiple'

type Items<T> = Array<ComboboxItem<T>>

const includesItem = <T>(items: Items<T>, item: ComboboxItem<T>) =>
  items.some((i) => areItemsEqual(i, item))

type ModeRule = {
  toggle: <T>(selected: Items<T>, item: ComboboxItem<T>) => Items<T>
  formValues: <T>(selected: Items<T>) => string[]
  multiselectable: boolean
}

export const MODE_RULES: Record<SelectionMode, ModeRule> = {
  single: {
    // 選択済みを選び直しても解除しないのは、ラジオボタンと同じく解除を専用の操作に分けるため
    toggle: (selected, item) => (includesItem(selected, item) ? selected : [item]),
    formValues: (selected) => [selected[0]?.value ?? ''],
    multiselectable: false,
  },
  multiple: {
    toggle: (selected, item) =>
      includesItem(selected, item)
        ? selected.filter((i) => !areItemsEqual(i, item))
        : [...selected, item],
    formValues: (selected) => selected.map((i) => i.value),
    multiselectable: true,
  },
}

export const DISPLAY_LIMIT = 100

export const itemKey = <T>(item: ComboboxItem<T>) => `${item.value}\n${getSelectedLabelText(item)}`

export const isSelected = includesItem

export const isSameItems = <T>(a: Items<T>, b: Items<T>) =>
  a.length === b.length && a.every((item, i) => areItemsEqual(item, b[i]))

/**
 * 検索文字列が空のときは開いた時点の選択済み（pinned）を先頭に寄せる。
 * 検索中は元の並び順のまま返し、選択しても並びを変えない。
 */
export const arrangeOptions = <T>({
  source,
  pinned,
  query,
  filter,
}: {
  source: Items<T>
  pinned: Items<T>
  query: string
  filter: boolean
}): Items<T> => {
  if (query === '') {
    return [...pinned, ...source.filter((item) => !includesItem(pinned, item))]
  }

  if (!filter) {
    return source
  }

  const matchable = convertMatchableString(query)

  return source.filter((item) =>
    convertMatchableString(getSelectedLabelText(item)).includes(matchable),
  )
}
