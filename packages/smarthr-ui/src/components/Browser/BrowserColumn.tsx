import React, { type FC } from 'react'

import { BrowserItem } from './BrowserItem'
import { type ItemNode } from './models'

const getColumnId = (column: number) => `column-${column}`

type Props = {
  value?: string
  items: ItemNode[]
  index: number
  onChangeInput?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const BrowserColumn: FC<Props> = ({ items, index: columnIndex, value, onChangeInput }) => (
  <div className="last:shr-flex-1 [&:not(:last-child)]:shr-w-[218px] [&:not(:last-child)]:shr-border-r-shorthand">
    <ul className="shr-list-none shr-px-0.25 shr-py-0.5" id={getColumnId(columnIndex)}>
      {items.map((item, rowIndex) => (
        <ListItem
          key={rowIndex}
          itemValue={item.value}
          itemLabel={item.label}
          itemHasChildren={item.children.length > 0}
          value={value}
          columnIndex={columnIndex}
          rowIndex={rowIndex}
          onChangeInput={onChangeInput}
        />
      ))}
    </ul>
  </div>
)

type ListItemProps = Pick<Props, 'value' | 'onChangeInput'> & {
  itemValue: ItemNode['value']
  itemLabel: ItemNode['label']
  itemHasChildren: boolean
  columnIndex: Props['index']
  rowIndex: number
}

const ListItem = React.memo<ListItemProps>(
  ({ itemValue, itemLabel, itemHasChildren, value, columnIndex, rowIndex, onChangeInput }) => {
    const selected = itemValue === value
    const ariaOwns = selected && itemHasChildren ? getColumnId(columnIndex + 1) : undefined
    const tabIndex = selected || (!value && columnIndex === 0 && rowIndex === 0) ? 0 : -1

    return (
      <li key={rowIndex} aria-owns={ariaOwns}>
        <BrowserItem
          selected={selected}
          itemValue={itemValue}
          itemLabel={itemLabel}
          itemHasChildren={itemHasChildren}
          columnIndex={columnIndex}
          tabIndex={tabIndex}
          onChangeInput={onChangeInput}
        />
      </li>
    )
  },
)
