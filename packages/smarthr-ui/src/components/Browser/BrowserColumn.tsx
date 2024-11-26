import React, { FC } from 'react'

import { BrowserItem } from './BrowserItem'
import { ItemNode } from './models'

const getColumnId = (column: number) => `column-${column}`

const getTabIndex = (selected: boolean, columnIndex: number, rowIndex: number, value?: string) => {
  if (selected) {
    return 0
  }
  if (!value && columnIndex === 0 && rowIndex === 0) {
    return 0
  }
  return -1
}

type Props = {
  value?: string
  items: ItemNode[]
  index: number
  onSelectItem?: (value: string) => void
}

export const BrowserColumn: FC<Props> = (props) => {
  const { items, index: columnIndex, value, onSelectItem } = props

  return (
    <div className="last:shr-flex-1 [&:not(:last-child)]:shr-w-[218px] [&:not(:last-child)]:shr-border-r-shorthand">
      <ul className="shr-list-none shr-px-0.25 shr-py-0.5" id={getColumnId(columnIndex)}>
        {items.map((item, rowIndex) => {
          const selected = item.value === value
          const ariaOwns =
            selected && item.children.length > 0 ? getColumnId(columnIndex + 1) : undefined

          return (
            <li key={`${columnIndex}-${rowIndex}`} aria-owns={ariaOwns}>
              <BrowserItem
                selected={selected}
                item={item}
                columnIndex={columnIndex}
                tabIndex={getTabIndex(selected, columnIndex, rowIndex, value)}
                onSelectItem={onSelectItem}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
