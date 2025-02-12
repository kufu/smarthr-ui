import React, { type RefObject, useCallback, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { FaPlusCircleIcon } from '../Icon'
import { Text } from '../Text'

import type { ComboBoxOption } from './types'

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
  const className = useMemo(
    () =>
      button({
        active: !!activeRef,
        new: option.isNew,
      }),
    [activeRef, option.isNew],
  )

  const handleMouseOver = useCallback(() => {
    onMouseOver(option)
  }, [onMouseOver, option])

  const commonProps = {
    activeRef,
    option,
    onMouseOver: handleMouseOver,
    className,
  }

  return option.isNew ? (
    <AddButton {...commonProps} onAdd={onAdd} />
  ) : (
    <SelectButton {...commonProps} onSelect={onSelect} />
  )
}
const typedMemo: <T>(c: T) => T = React.memo
const Memoized = typedMemo(ListBoxItemButton)
export { Memoized as ListBoxItemButton }

type ButtonType<T> = Pick<Props<T>, 'option' | 'activeRef'> & {
  className: string
  onMouseOver: () => void
}

const AddButton = <T,>({
  activeRef,
  option,
  onAdd,
  onMouseOver,
  className,
}: ButtonType<T> & Pick<Props<T>, 'onAdd'>) => {
  const onClick = useMemo(
    () =>
      onAdd
        ? () => {
            onAdd(option)
          }
        : undefined,
    [option, onAdd],
  )

  return (
    <button
      ref={activeRef}
      type="button"
      role="option"
      id={option.id}
      onClick={onClick}
      onMouseOver={onMouseOver}
      className={className}
    >
      <FaPlusCircleIcon
        color="TEXT_LINK"
        text={<Text color="TEXT_LINK">「{option.item.label}」を追加</Text>}
      />
    </button>
  )
}
const SelectButton = <T,>({
  activeRef,
  option,
  onSelect,
  onMouseOver,
  className,
}: ButtonType<T> & Pick<Props<T>, 'onSelect'>) => {
  const handleSelect = useCallback(() => {
    onSelect(option)
  }, [onSelect, option])

  return (
    <button
      ref={activeRef}
      type="button"
      role="option"
      id={option.id}
      disabled={option.item.disabled}
      aria-selected={option.selected}
      onClick={handleSelect}
      onMouseOver={handleMouseOver}
      className={className}
    >
      {option.item.label}
    </button>
  )
}
