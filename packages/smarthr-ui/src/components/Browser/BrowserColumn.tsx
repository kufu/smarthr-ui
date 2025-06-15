import { type ChangeEvent, type ComponentProps, type FC, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { BrowserItem } from './BrowserItem'

import type { ItemNode } from './models'

const getColumnId = (column: number) => `column-${column}`

type Props = {
  value?: string
  items: ItemNode[]
  index: number
  onChangeInput?: (e: ChangeEvent<HTMLInputElement>) => void
}
type ElementProps = Omit<ComponentProps<'ul'>, keyof Props>

const classNameGenerator = tv({
  base: 'shr-px-0.25 shr-py-0.5',
})

export const BrowserColumn: FC<Props & ElementProps> = ({
  items,
  index: columnIndex,
  value,
  onChangeInput,
  className,
  ...rest
}) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return (
    <ul {...rest} className={actualClassName} id={getColumnId(columnIndex)}>
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
  )
}

type ListItemProps = Pick<Props, 'value' | 'onChangeInput'> & {
  itemValue: ItemNode['value']
  itemLabel: ItemNode['label']
  itemHasChildren: boolean
  columnIndex: Props['index']
  rowIndex: number
}

const ListItem = memo<ListItemProps>(
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
