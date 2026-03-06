import { type ReactNode, type RefObject, memo, useCallback, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Localizer } from '../../intl'
import { FaCheckIcon, FaCirclePlusIcon } from '../Icon'
import { Text } from '../Text'

import type { ComboboxOption, AbstractProps as ComboboxProps } from './types'

type Props<T> = {
  option: ComboboxOption<T>
  onAdd?: (option: ComboboxOption<T>) => void
  onSelect: (option: ComboboxOption<T>) => void
  onMouseOver: (option: ComboboxOption<T>) => void
  activeRef: RefObject<HTMLButtonElement> | undefined
  variant?: ComboboxProps<T>['variant']
}

const classNameGenerator = tv({
  slots: {
    container: [
      'shr-relative shr-block shr-min-w-full shr-cursor-pointer shr-border-none shr-bg-white shr-text-left shr-text-base shr-leading-tight',
      'disabled:shr-cursor-not-allowed disabled:shr-text-disabled',
    ],
    item: 'shr-flex shr-items-center shr-gap-0.5 shr-rounded-m shr-p-0.5 shr-pl-0.25',
    icon: 'shr-h-1 shr-w-1 shr-text-main',
  },
  variants: {
    new: {
      true: 'smarthr-ui-Combobox-addButton shr-flex shr-items-center',
      false: 'smarthr-ui-Combobox-selectButton',
    },
    type: {
      solid: '',
      outline: '',
      github: '',
    },
  },
  compoundVariants: [
    {
      type: 'github',
      new: false,
      className: {
        container: [
          '[&:has([data-active="true"])]:before:shr-content-[""]',
          '[&:has([data-active="true"])]:before:shr-absolute',
          '[&:has([data-active="true"])]:before:shr-bg-main',
          '[&:has([data-active="true"])]:before:shr-rounded-m',
          '[&:has([data-active="true"])]:before:shr-h-full',
          '[&:has([data-active="true"])]:before:shr-w-[3px]',
          '[&:has([data-active="true"])]:before:shr-left-px',
          '[&:has([data-active="true"])]:before:shr-bottom-0',
        ],
        item: 'data-[active="true"]:shr-bg-white-darken',
      },
    },
    {
      type: 'solid',
      new: false,
      className: {
        container: '',
        item: 'data-[active="true"]:shr-bg-main data-[active="true"]:shr-text-white',
        icon: 'data-[active="true"]:shr-text-white',
      },
    },
    {
      type: 'outline',
      new: false,
      className: {
        container: '',
        item: [
          'data-[active="true"]:shr-outline',
          'data-[active="true"]:shr-outline-2',
          'data-[active="true"]:shr-outline-[theme(colors.grey.65)]',
          'data-[active="true"]:-shr-outline-offset-[1px]',
        ],
        icon: '',
      },
    },
  ],
  defaultVariants: {
    type: 'github',
  },
})

const ItemButton = <T,>({ option, onAdd, onSelect, onMouseOver, activeRef, variant }: Props<T>) => {
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
    <SelectButton {...commonProps} onSelect={onSelect} variant={variant} />
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
  variant,
}: ButtonType<T> & Pick<Props<T>, 'onAdd' | 'variant'>) => {
  const className = useMemo(() => {
    const { container } = classNameGenerator({
      new: true,
      type: variant,
    })
    return {
      container: container(),
    }
  }, [variant])

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
      className={className.container}
    >
      <MemoizedNewIconWithText label={option.item.label} />
    </button>
  )
}

const MemoizedNewIconWithText = memo<{ label: ReactNode }>(({ label }) => (
  <Text color="TEXT_LINK" icon={<FaCirclePlusIcon color="TEXT_LINK" />}>
    <Localizer
      id="smarthr-ui/Combobox/addItemButtonLabel"
      defaultText="「{name}」を追加"
      values={{ name: label }}
    />
  </Text>
))

const SelectButton = <T,>({
  activeRef,
  option,
  onSelect,
  onMouseOver,
  variant,
}: ButtonType<T> & Pick<Props<T>, 'onSelect' | 'variant'>) => {
  const className = useMemo(() => {
    const { container, item, icon } = classNameGenerator({
      new: false,
      type: variant,
    })

    return {
      container: container(),
      item: item(),
      icon: icon(),
    }
  }, [variant])

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
      // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
      onMouseOver={onMouseOver}
      className={className.container}
    >
      <span data-active={!!activeRef} className={className.item}>
        <span data-active={!!activeRef} className={className.icon}>
          {option.selected && <FaCheckIcon />}
        </span>
        {option.item.label}
      </span>
    </button>
  )
}
