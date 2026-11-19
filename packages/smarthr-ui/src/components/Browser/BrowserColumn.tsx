import { type ChangeEvent, type FC, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { BrowserItem } from './BrowserItem'

import type { ItemNode } from './models'
import type { ExtendElementPropsWithRef } from '../../types'

const getColumnId = (browserId: string, column: number) => `${browserId}-column-${column}`

type Props = ExtendElementPropsWithRef<
  'ul',
  {
    browserId: string
    value?: string
    items: ItemNode[]
    index: number
    handleChangeInput?: (e: ChangeEvent<HTMLInputElement>) => void
  },
  { omit: 'id' }
>

const classNameGenerator = tv({
  base: 'shr-px-0.25 shr-py-0.5',
})

export const BrowserColumn: FC<Props> = ({
  browserId,
  items,
  index: columnIndex,
  value,
  handleChangeInput,
  className,
  ...rest
}) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return (
    <ul {...rest} id={getColumnId(browserId, columnIndex)} className={actualClassName}>
      {items.map((item, rowIndex) => (
        <ListItem
          key={rowIndex}
          browserId={browserId}
          value={value}
          itemValue={item.value}
          itemLabel={item.label}
          itemHasChildren={item.children.length > 0}
          columnIndex={columnIndex}
          rowIndex={rowIndex}
          handleChangeInput={handleChangeInput}
        />
      ))}
    </ul>
  )
}

type ListItemProps = Pick<Props, 'browserId' | 'value' | 'handleChangeInput'> & {
  itemValue: ItemNode['value']
  itemLabel: ItemNode['label']
  itemHasChildren: boolean
  columnIndex: Props['index']
  rowIndex: number
}

const ListItem = memo<ListItemProps>(
  ({
    browserId,
    itemValue,
    itemLabel,
    itemHasChildren,
    value,
    columnIndex,
    rowIndex,
    handleChangeInput,
  }) => {
    const selected = itemValue === value
    const ariaOwns =
      selected && itemHasChildren ? getColumnId(browserId, columnIndex + 1) : undefined
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
          handleChangeInput={handleChangeInput}
        />
      </li>
    )
  },
)
