import React, { FC, KeyboardEventHandler, useCallback, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { FaAngleRightIcon } from '../Icon'
import { Cluster } from '../Layout'
import { Text } from '../Text'

import { ItemNode } from './models'
import { getElementIdFromNode } from './utils'

const radioWrapperStyle = tv({
  base: [
    'shr-block shr-px-1 shr-py-0.5 shr-rounded-m focus-within:shr-shadow-outline',
    '[&[data-selected="true"][data-type="parent"]]:shr-bg-white-darken',
    '[&[data-selected="true"][data-type="last"]]:shr-bg-main [&[data-selected="true"][data-type="last"]]:shr-text-white [&[data-selected="true"][data-type="last"]]:forced-colors:shr-bg-[Highlight]',
    '[&[data-selected="false"]]:hover:shr-bg-white-darken',
  ],
})

type Props = {
  selected: boolean
  itemValue: ItemNode['value']
  itemLabel: ItemNode['label']
  itemHasChildren: boolean
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

export const BrowserItem: React.FC<Props> = ({
  selected,
  itemValue,
  itemLabel,
  itemHasChildren,
  tabIndex,
  columnIndex,
  onSelectItem,
}) => {
  const inputId = getElementIdFromNode(itemValue)
  const style = useMemo(() => radioWrapperStyle(), [])

  const onChange = useMemo(
    () =>
      onSelectItem
        ? (e: React.ChangeEvent<HTMLInputElement>) => onSelectItem(e.currentTarget.value)
        : undefined,
    [onSelectItem],
  )

  return (
    <label
      htmlFor={inputId}
      data-selected={selected}
      data-type={itemHasChildren ? 'parent' : 'last'}
      className={style}
    >
      <input
        className="shr-sr-only"
        type="radio"
        id={inputId}
        name={`column-${columnIndex}`}
        value={itemValue}
        tabIndex={tabIndex}
        onKeyDown={HANDLE_KEYDOWN}
        onChange={onChange}
        checked={selected}
      />
      <BodyCluster label={itemLabel} hasChildren={itemHasChildren} />
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
