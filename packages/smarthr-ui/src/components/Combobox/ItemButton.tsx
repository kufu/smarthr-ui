import { type ReactNode, type RefObject, memo, useCallback, useRef } from 'react'
import { tv } from 'tailwind-variants'

import { Localizer } from '../../intl'
import { FaCirclePlusIcon } from '../Icon'
import { Text } from '../Text'

import type { ComboboxOption } from './types'

type Props<T> = {
  option: ComboboxOption<T>
  onAdd?: (option: ComboboxOption<T>) => void
  onSelect: (option: ComboboxOption<T>) => void
  onMouseOver: (option: ComboboxOption<T>) => void
  activeRef: RefObject<HTMLButtonElement> | undefined
}

const classNameGenerator = tv({
  base: [
    'shr-block shr-min-w-full shr-cursor-pointer shr-border-none shr-px-1 shr-py-0.5 shr-text-left shr-text-base shr-leading-tight',
    'aria-selected:shr-text-white',
    'disabled:shr-cursor-not-allowed disabled:shr-text-disabled',
    'data-[active=true]:shr-bg-white-darken data-[active=true]:aria-selected:shr-bg-main-darken',
    'data-[active=false]:shr-bg-white data-[active=false]:aria-selected:shr-bg-main',
  ],
  variants: {
    new: {
      true: 'smarthr-ui-Combobox-addButton shr-flex shr-items-center',
      false: 'smarthr-ui-Combobox-selectButton',
    },
  },
})

const ItemButton = <T,>({ option, onAdd, onSelect, onMouseOver, activeRef }: Props<T>) => {
  const unstableRef = useRef({ onAdd, onSelect, onMouseOver, option })
  unstableRef.current = { onAdd, onSelect, onMouseOver, option }

  const handleMouseOver = useCallback(() => {
    unstableRef.current.onMouseOver(unstableRef.current.option)
  }, [])

  const handleAddClick = useCallback(() => {
    unstableRef.current.onAdd?.(unstableRef.current.option)
  }, [])

  const handleSelectClick = useCallback(() => {
    unstableRef.current.onSelect(unstableRef.current.option)
  }, [])

  const commonAttrs = {
    id: option.id,
    label: option.item.label,
    activeRef,
    onMouseOver: handleMouseOver,
  }

  return option.isNew ? (
    <AddButton {...commonAttrs} onClick={handleAddClick} />
  ) : (
    <SelectButton
      {...commonAttrs}
      disabled={option.item.disabled}
      selected={option.selected}
      onClick={handleSelectClick}
    />
  )
}
const typedMemo: <T>(c: T) => T = memo
const Memoized = typedMemo(ItemButton)
export { Memoized as ItemButton }

const AddButton = memo<{
  id: string
  label: ReactNode
  activeRef: RefObject<HTMLButtonElement> | undefined
  onClick?: () => void
  onMouseOver: () => void
}>(({ id, label, activeRef, onClick, onMouseOver }) => {
  const className = classNameGenerator({
    new: true,
  })

  return (
    <button
      ref={activeRef}
      type="button"
      role="option"
      aria-selected={false}
      id={id}
      data-active={!!activeRef}
      onClick={onClick}
      // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
      onMouseOver={onMouseOver}
      className={className}
    >
      <MemoizedNewIconWithText label={label} />
    </button>
  )
})

const MemoizedNewIconWithText = memo<{ label: ReactNode }>(({ label }) => (
  <Text color="TEXT_LINK" icon={<FaCirclePlusIcon color="TEXT_LINK" />}>
    <Localizer
      id="smarthr-ui/Combobox/addItemButtonLabel"
      defaultText="「{name}」を追加"
      values={{ name: label }}
    />
  </Text>
))

const SelectButton = memo<{
  id: string
  label: ReactNode
  disabled?: boolean
  selected: boolean
  activeRef: RefObject<HTMLButtonElement> | undefined
  onClick: () => void
  onMouseOver: () => void
}>(({ id, label, disabled, selected, activeRef, onClick, onMouseOver }) => {
  const className = classNameGenerator({
    new: false,
  })

  return (
    <button
      ref={activeRef}
      type="button"
      role="option"
      id={id}
      disabled={disabled}
      aria-selected={selected}
      data-active={!!activeRef}
      onClick={onClick}
      // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
      onMouseOver={onMouseOver}
      className={className}
    >
      {label}
    </button>
  )
})
