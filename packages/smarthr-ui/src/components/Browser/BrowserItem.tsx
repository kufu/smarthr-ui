import React, { FC, KeyboardEventHandler, useCallback, useMemo } from 'react'
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

const KEYDOWN_REGEX = /^((Arrow(Right|Left|Up|Down))|Enter| )$/
const HANDLE_KEYDOWN: KeyboardEventHandler = (e) => {
  if (KEYDOWN_REGEX.test(e.key)) {
    e.preventDefault()
  }
}

export const BrowserItem: FC<Props> = ({ selected, item, tabIndex, columnIndex, onSelectItem }) => {
  const { inputId, hasChildren } = useMemo(
    () => ({
      inputId: getElementIdFromNode(item),
      hasChildren: item.children.length > 0,
    }),
    [item],
  )

  const style = useMemo(
    () =>
      radioWrapperStyle({
        selected: selected ? (hasChildren ? 'parent' : 'last') : 'none',
      }),
    [selected, hasChildren],
  )

  const onChange = useMemo(
    () =>
      onSelectItem
        ? (e: React.ChangeEvent<HTMLInputElement>) => onSelectItem(e.currentTarget.value)
        : undefined,
    [onSelectItem],
  )

  return (
    <label htmlFor={inputId} className={style}>
      <input
        className="shr-sr-only"
        type="radio"
        id={inputId}
        name={`column-${columnIndex}`}
        value={item.value}
        tabIndex={tabIndex}
        onKeyDown={HANDLE_KEYDOWN}
        onChange={onChange}
        checked={selected}
      />
      <BodyCluster label={item.label} hasChildren={hasChildren} />
    </label>
  )
}

const BodyCluster = React.memo<{ label: string; hasChildren: boolean }>(
  ({ label, hasChildren }) => (
    <Cluster align="center" justify="space-between" as="span">
      <Text>{label}</Text>
      {hasChildren && <FaAngleRightIcon />}
    </Cluster>
  ),
)
