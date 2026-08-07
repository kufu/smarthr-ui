import { type ReactNode, type RefObject, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useLatest } from '../../hooks/useLatest'
import { Localizer } from '../../intl'
import { FaCirclePlusIcon } from '../Icon'
import { Text } from '../Text'

import type { ComboboxOption } from './types'

type Props<T> = {
  option: ComboboxOption<T>
  handleAdd?: (option: ComboboxOption<T>) => void
  handleSelect: (option: ComboboxOption<T>) => void
  handleMouseOver: (option: ComboboxOption<T>) => void
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

const CLASS_NAMES = {
  new: classNameGenerator({ new: true }),
  select: classNameGenerator({ new: false }),
}

const ItemButton = <T,>({
  option,
  handleAdd,
  handleSelect,
  handleMouseOver,
  activeRef,
}: Props<T>) => {
  const latest = useLatest({ handleAdd, handleSelect, handleMouseOver, option })
  const hasHandleAdd = !!handleAdd

  const functions = useMemo(
    () => ({
      handleMouseOver: () => latest.handleMouseOver(latest.option),
      handleAddClick: hasHandleAdd ? () => latest.handleAdd?.(latest.option) : undefined,
      handleSelectClick: () => latest.handleSelect(latest.option),
    }),
    [hasHandleAdd, latest],
  )

  const commonAttrs = {
    id: option.id,
    label: option.item.label,
    activeRef,
    handleMouseOver: functions.handleMouseOver,
  }

  return option.isNew ? (
    <AddButton {...commonAttrs} handleClick={functions.handleAddClick} />
  ) : (
    <SelectButton
      {...commonAttrs}
      disabled={option.item.disabled}
      selected={option.selected}
      handleClick={functions.handleSelectClick}
    />
  )
}
const typedMemo: <T>(c: T) => T = memo
const Memoized = typedMemo(ItemButton)
export { Memoized as ItemButton }

const SelectButton = memo<{
  id: string
  label: ReactNode
  disabled?: boolean
  selected: boolean
  activeRef: RefObject<HTMLButtonElement> | undefined
  handleClick: () => void
  handleMouseOver: () => void
}>(({ id, label, disabled, selected, activeRef, handleClick, handleMouseOver }) => (
  <button
    ref={activeRef}
    type="button"
    role="option"
    id={id}
    disabled={disabled}
    aria-selected={selected}
    data-active={!!activeRef}
    onClick={handleClick}
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    onMouseOver={handleMouseOver}
    className={CLASS_NAMES.select}
  >
    {label}
  </button>
))

const AddButton = memo<{
  id: string
  label: ReactNode
  activeRef: RefObject<HTMLButtonElement> | undefined
  handleClick?: () => void
  handleMouseOver: () => void
}>(({ id, label, activeRef, handleClick, handleMouseOver }) => (
  <button
    ref={activeRef}
    type="button"
    role="option"
    aria-selected={false}
    id={id}
    data-active={!!activeRef}
    onClick={handleClick}
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    onMouseOver={handleMouseOver}
    className={CLASS_NAMES.new}
  >
    <MemoizedNewIconWithText label={label} />
  </button>
))

const MemoizedNewIconWithText = memo<{ label: ReactNode }>(({ label }) => (
  <Text color="TEXT_LINK" icon={<FaCirclePlusIcon color="TEXT_LINK" />}>
    <Localizer
      id="smarthr-ui/Combobox/addItemButtonLabel"
      defaultText="「{name}」を追加"
      values={{ name: label }}
    />
  </Text>
))
