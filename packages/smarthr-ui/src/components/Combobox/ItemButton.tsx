import { type FC, type ReactNode, type RefObject, memo } from 'react'
import { tv } from 'tailwind-variants'

import { Localizer } from '../../intl'
import { FaCirclePlusIcon } from '../Icon'
import { Text } from '../Text'

import type { ComboboxOption } from './types'

type Props = Omit<ComboboxOption<unknown>, 'item'> &
  Omit<ComboboxOption<unknown>['item'], 'data'> & {
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

export const ItemButton = memo<Props>(({ disabled, selected, isNew, ...rest }) =>
  isNew ? (
    <AddButton {...rest} />
  ) : (
    <SelectButton {...rest} disabled={disabled} selected={selected} />
  ),
)

const SelectButton: FC<{
  id: string
  label: ReactNode
  value: string
  disabled?: boolean
  selected: boolean
  activeRef: RefObject<HTMLButtonElement> | undefined
}> = ({ label, selected, activeRef, ...rest }) => (
  <button
    {...rest}
    ref={activeRef}
    type="button"
    role="option"
    aria-selected={selected}
    data-active={!!activeRef}
    className={CLASS_NAMES.select}
  >
    {label}
  </button>
)

const AddButton: FC<{
  id: string
  label: ReactNode
  value: string
  activeRef: RefObject<HTMLButtonElement> | undefined
}> = ({ label, activeRef, ...rest }) => (
  <button
    {...rest}
    ref={activeRef}
    type="button"
    role="option"
    aria-selected={false}
    data-active={!!activeRef}
    className={CLASS_NAMES.new}
  >
    <Text color="TEXT_LINK" icon={<FaCirclePlusIcon color="TEXT_LINK" />}>
      <Localizer
        id="smarthr-ui/Combobox/addItemButtonLabel"
        defaultText="「{name}」を追加"
        values={{ name: label }}
      />
    </Text>
  </button>
)
