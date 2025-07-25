import { type ReactNode, type RefObject, memo, useCallback, useMemo } from 'react'
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
  const handleMouseOver = useCallback(() => {
    onMouseOver(option)
  }, [onMouseOver, option])

  const commonProps = {
    option,
    onMouseOver: handleMouseOver,
    activeRef,
  }

  return option.isNew ? (
    <AddButton {...commonProps} onAdd={onAdd} />
  ) : (
    <SelectButton {...commonProps} onSelect={onSelect} />
  )
}
const typedMemo: <T>(c: T) => T = memo
const Memoized = typedMemo(ItemButton)
export { Memoized as ItemButton }

type ButtonType<T> = Pick<Props<T>, 'option' | 'activeRef'> & {
  onMouseOver: () => void
}

const AddButton = <T,>({
  activeRef,
  option,
  onAdd,
  onMouseOver,
}: ButtonType<T> & Pick<Props<T>, 'onAdd'>) => {
  const className = useMemo(
    () =>
      classNameGenerator({
        new: true,
      }),
    [],
  )

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
      aria-selected={false}
      id={option.id}
      data-active={!!activeRef}
      onClick={onClick}
      // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
      onMouseOver={onMouseOver}
      className={className}
    >
      <MemoizedNewIconWithText label={option.item.label} />
    </button>
  )
}

const MemoizedNewIconWithText = memo<{ label: ReactNode }>(({ label }) => (
  <FaCirclePlusIcon
    color="TEXT_LINK"
    text={
      <Text color="TEXT_LINK">
        <Localizer
          id="smarthr-ui/Combobox/addItemButtonLabel"
          defaultText="「{name}」を追加"
          values={{ name: label }}
        />
      </Text>
    }
  />
))

const SelectButton = <T,>({
  activeRef,
  option,
  onSelect,
  onMouseOver,
}: ButtonType<T> & Pick<Props<T>, 'onSelect'>) => {
  const className = useMemo(
    () =>
      classNameGenerator({
        new: false,
      }),
    [],
  )

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
      data-active={!!activeRef}
      onClick={handleSelect}
      // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
      onMouseOver={onMouseOver}
      className={className}
    >
      {option.item.label}
    </button>
  )
}
