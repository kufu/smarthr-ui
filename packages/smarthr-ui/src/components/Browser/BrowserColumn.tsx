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
  const ariaOwns = selected && item.children.length > 0 ? getColumnId(columnIndex + 1) : undefined
  const tabIndex = selected || (!value && columnIndex === 0 && rowIndex === 0) ? 0 : -1

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
