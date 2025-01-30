import React, { FC, useMemo } from 'react'

import { BrowserItem } from './BrowserItem'
import { ItemNode } from './models'

const getColumnId = (column: number) => `column-${column}`

type Props = {
  value?: string
  items: ItemNode[]
  index: number
  onSelectItem?: (value: string) => void
}

export const BrowserColumn: FC<Props> = ({ items, index: columnIndex, value, onSelectItem }) => (
  <div className="last:shr-flex-1 [&:not(:last-child)]:shr-w-[218px] [&:not(:last-child)]:shr-border-r-shorthand">
    <ul className="shr-list-none shr-px-0.25 shr-py-0.5" id={getColumnId(columnIndex)}>
      {items.map((item, rowIndex) => (
        <ListItem
          item={item}
          value={value}
          columnIndex={columnIndex}
          rowIndex={rowIndex}
          onSelectItem={onSelectItem}
        />
      ))}
    </ul>
  </div>
)

const ListItem = React.memo<
  Pick<Props, 'value' | 'columnIndex' | 'onSelectItem'> & { item: ItemNode; rowIndex: number }
>(({ item, value, columnIndex, rowIndex, onSelectItem }) => {
  const selected = item.value === value
  const ariaOwns = useMemo(
    () => (selected && item.children.length > 0 ? getColumnId(columnIndex + 1) : undefined),
    [selected, item.children.length, columnIndex],
  )

  // HINT: valueのままmemo化の依存関係にすると、キャッシュ効率が悪いため
  // booleanに変更してなるべく変化がない状態にする
  const nullValue = !value
  const tabIndex = useMemo(() => {
    if (selected || (nullValue && columnIndex === 0 && rowIndex === 0)) {
      return 0
    }

    return -1
  }, [nullValue, selected, columnIndex, rowIndex])

  return (
    <li key={rowIndex} aria-owns={ariaOwns}>
      <BrowserItem
        selected={selected}
        item={item}
        columnIndex={columnIndex}
        tabIndex={tabIndex}
        onSelectItem={onSelectItem}
      />
    </li>
  )
})
