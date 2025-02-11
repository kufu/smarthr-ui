import React, { RefObject, useCallback, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { FaPlusCircleIcon } from '../Icon'
import { Text } from '../Text'

import { ComboBoxOption } from './types'

type Props<T> = {
  option: ComboBoxOption<T>
  onAdd?: (option: ComboBoxOption<T>) => void
  onSelect: (option: ComboBoxOption<T>) => void
  onMouseOver: (option: ComboBoxOption<T>) => void
  activeRef: RefObject<HTMLButtonElement> | undefined
}

const button = tv({
  base: [
    'shr-block shr-min-w-full shr-cursor-pointer shr-border-none shr-px-1 shr-py-0.5 shr-text-left shr-text-base shr-leading-tight',
    'aria-selected:shr-text-white',
    'disabled:shr-cursor-not-allowed disabled:shr-text-disabled',
  ],
  variants: {
    active: {
      true: ['shr-bg-white-darken shr-text-color-inherit', 'aria-selected:shr-bg-main-darken'],
      false: ['shr-bg-white', 'aria-selected:shr-bg-main'],
    },
    new: {
      true: 'smarthr-ui-ComboBox-addButton shr-flex shr-items-center',
      false: 'smarthr-ui-ComboBox-selectButton',
    },
  },
})

const ListBoxItemButton = <T,>({ option, onAdd, onSelect, onMouseOver, activeRef }: Props<T>) => {
  const { item, selected, isNew } = option
  const { label, disabled } = item

  const handleAdd = useMemo(
    () =>
      onAdd
        ? () => {
            onAdd(option)
          }
        : undefined,
    [option, onAdd],
  )

  const handleSelect = useCallback(() => {
    onSelect(option)
  }, [onSelect, option])

  const handleMouseOver = useCallback(() => {
    onMouseOver(option)
  }, [onMouseOver, option])

  const className = useMemo(
    () =>
      button({
        active: !!activeRef,
        new: isNew,
      }),
    [activeRef, isNew],
  )

  return isNew ? (
    <button
      type="button"
      onClick={handleAdd}
      onMouseOver={handleMouseOver}
      id={option.id}
      role="option"
      className={className}
      ref={activeRef}
    >
      <FaPlusCircleIcon color="TEXT_LINK" text={<Text color="TEXT_LINK">「{label}」を追加</Text>} />
    </button>
  ) : (
    <button
      type="button"
      disabled={disabled}
      onClick={handleSelect}
      onMouseOver={handleMouseOver}
      id={option.id}
      role="option"
      className={className}
      aria-selected={selected}
      ref={activeRef}
    >
      {label}
    </button>
  )
}
const typedMemo: <T>(c: T) => T = React.memo
const Memoized = typedMemo(ListBoxItemButton)
export { Memoized as ListBoxItemButton }
