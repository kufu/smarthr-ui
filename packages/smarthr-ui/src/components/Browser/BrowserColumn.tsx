import { type ChangeEvent, type ComponentProps, type FC, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { BrowserItem } from './BrowserItem'

import type { ItemNode } from './models'

const getColumnId = (column: number) => `column-${column}`

type BaseProps = {
  value?: string
  items: ItemNode[]
  index: number
  handleChangeInput?: (e: ChangeEvent<HTMLInputElement>) => void
}
type Props = BaseProps & Omit<ComponentProps<'ul'>, keyof BaseProps>

const classNameGenerator = tv({
  base: 'shr-px-0.25 shr-py-0.5',
})

export const BrowserColumn: FC<Props> = ({
  items,
  index: columnIndex,
  value,
  handleChangeInput,
  className,
  ...rest
}) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return (
    <ul {...rest} id={getColumnId(columnIndex)} className={actualClassName}>
      {items.map((item, rowIndex) => (
        <ListItem
          key={rowIndex}
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

type ListItemProps = Pick<Props, 'value' | 'handleChangeInput'> & {
  itemValue: ItemNode['value']
  itemLabel: ItemNode['label']
  itemHasChildren: boolean
  columnIndex: Props['index']
  rowIndex: number
}

const ListItem = memo<ListItemProps>(
  ({ itemValue, itemLabel, itemHasChildren, value, columnIndex, rowIndex, handleChangeInput }) => {
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
          handleChangeInput={handleChangeInput}
        />
      </li>
    )
  },
)
