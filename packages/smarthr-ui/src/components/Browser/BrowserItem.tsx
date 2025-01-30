import React, { FC, KeyboardEventHandler, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { FaAngleRightIcon } from '../Icon'
import { Cluster } from '../Layout'
import { Text } from '../Text'

import { ItemNode } from './models'
import { getElementIdFromNode } from './utils'

const radioWrapperStyle = tv({
  base: 'shr-block shr-px-1 shr-py-0.5 shr-rounded-m focus-within:shr-shadow-outline',
  variants: {
    selected: {
      parent: 'shr-bg-white-darken',
      last: 'shr-bg-main shr-text-white forced-colors:shr-bg-[Highlight]',
      none: 'hover:shr-bg-white-darken',
    },
  },
  defaultVariants: {
    selected: 'none',
  },
})

type Props = {
  selected: boolean
  item: ItemNode
  tabIndex: 0 | -1
  columnIndex: number
  onSelectItem?: (id: string) => void
}

export const BrowserItem: FC<Props> = ({ selected, item, tabIndex, columnIndex, onSelectItem }) => {
  const { inputId, hasChildren } = useMemo(
    () => ({
      inputId: getElementIdFromNode(item),
      hasChildren: item.children.length > 0,
    }),
    [item],
  )

  const handleKeyDown: KeyboardEventHandler = (e) => {
    if (
      e.key === 'ArrowRight' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown' ||
      e.key === 'Enter' ||
      e.key === ' '
    ) {
      e.preventDefault()
    }
  }

  return (
    <label
      htmlFor={inputId}
      className={radioWrapperStyle({
        selected: selected ? (hasChildren ? 'parent' : 'last') : 'none',
      })}
    >
      <input
        className="shr-sr-only"
        type="radio"
        id={inputId}
        name={`column-${columnIndex}`}
        value={item.value}
        tabIndex={tabIndex}
        onKeyDown={handleKeyDown}
        onChange={() => onSelectItem?.(item.value)}
        checked={selected}
      />
      <Cluster align="center" justify="space-between">
        <Text>{item.label}</Text>
        {hasChildren && <FaAngleRightIcon />}
      </Cluster>
    </label>
  )
}
