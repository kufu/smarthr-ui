import { type ReactNode, type RefObject, memo } from 'react'
import { tv } from 'tailwind-variants'

import { Localizer } from '../../intl'
import { FaCirclePlusIcon } from '../Icon'
import { Text } from '../Text'

import type { ComboboxOption } from './types'

type Props<T> = {
  option: ComboboxOption<T>
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

const ItemButton = <T,>({ option, activeRef }: Props<T>) =>
  option.isNew ? (
    <AddButton
      id={option.id}
      label={option.item.label}
      value={option.item.value}
      activeRef={activeRef}
    />
  ) : (
    <SelectButton
      id={option.id}
      label={option.item.label}
      value={option.item.value}
      disabled={option.item.disabled}
      selected={option.selected}
      activeRef={activeRef}
    />
  )

const typedMemo: <T>(c: T) => T = memo
const Memoized = typedMemo(ItemButton)
export { Memoized as ItemButton }

const SelectButton = memo<{
  id: string
  label: ReactNode
  value: string
  disabled?: boolean
  selected: boolean
  activeRef: RefObject<HTMLButtonElement> | undefined
}>(({ id, label, value, disabled, selected, activeRef }) => (
  <button
    ref={activeRef}
    type="button"
    role="option"
    id={id}
    value={value}
    disabled={disabled}
    aria-selected={selected}
    data-active={!!activeRef}
    className={CLASS_NAMES.select}
  >
    {label}
  </button>
))

const AddButton = memo<{
  id: string
  label: ReactNode
  value: string
  activeRef: RefObject<HTMLButtonElement> | undefined
}>(({ id, label, value, activeRef }) => (
  <button
    ref={activeRef}
    type="button"
    role="option"
    aria-selected={false}
    id={id}
    value={value}
    data-active={!!activeRef}
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
