'use client'

import {
  type ComponentPropsWithRef,
  type FC,
  type FormEvent,
  type MouseEventHandler,
  type OptionHTMLAttributes,
  type PropsWithChildren,
  type ReactNode,
  memo,
} from 'react'

import { Button } from '../../Button'
import { Fieldset } from '../../Fieldset'
import { FormControl } from '../../FormControl'
import { Cluster, Stack } from '../../Layout'
import { RadioButton } from '../../RadioButton'
import { Select } from '../../Select'
import { Dropdown } from '../Dropdown'
import { DropdownCloser } from '../DropdownCloser'
import { DropdownContent } from '../DropdownContent'
import { DropdownTrigger } from '../DropdownTrigger'

import { type DecoratorKeyTypes, useSortDropdown } from './useSortDropdown'

import type { DecoratorsType } from '../../../hooks/useDecorators'

type SortFieldType = {
  value: string
} & Omit<OptionHTMLAttributes<HTMLOptionElement>, 'value'>

type ArgsOnApply = {
  field: string
  order: 'asc' | 'desc'
  newfields: SortFieldType[]
}

type Props = {
  /** 並び替え項目 */
  sortFields: SortFieldType[]
  /** 並び順の初期値 */
  defaultOrder: 'asc' | 'desc'
  /** 適用時に発火するイベント */
  onApply: (args: ArgsOnApply) => void
  /** キャンセル時に発火するイベント */
  onCancel?: MouseEventHandler<HTMLButtonElement>
  decorators?: DecoratorsType<DecoratorKeyTypes>
}
type ElementProps = Omit<ComponentPropsWithRef<'button'>, keyof Props>

const ON_SUBMIT = (e: FormEvent) => {
  e.preventDefault()
}

export const SortDropdown: FC<Props & ElementProps> = ({
  sortFields,
  defaultOrder,
  onApply,
  onCancel,
  decorators,
  ...props
}) => {
  const {
    labels,
    SortIcon,
    onChangeSortOrderRadio,
    innerValues: { innerFields, innerCheckedOrder },
    handler: { handleApply, handleChange },
    classNames,
  } = useSortDropdown({
    sortFields,
    defaultOrder,
    onApply,
    decorators,
  })

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button {...props} suffix={<SortIcon />}>
          {labels.triggerLabel}
        </Button>
      </DropdownTrigger>
      <DropdownContent controllable>
        <form onSubmit={ON_SUBMIT}>
          <Stack className={classNames.body}>
            <FormControl title={labels.sortFieldLabel}>
              <Select
                name="sortFields"
                options={innerFields}
                onChange={handleChange}
                className={classNames.select}
              />
            </FormControl>
            <Fieldset title={labels.sortOrderLabel} innerMargin={0.5}>
              <Cluster gap={1.25}>
                <RadioButton
                  name="sortOrder"
                  value="asc"
                  checked={innerCheckedOrder === 'asc'}
                  onChange={onChangeSortOrderRadio}
                >
                  {labels.ascLabel}
                </RadioButton>
                <RadioButton
                  name="sortOrder"
                  value="desc"
                  checked={innerCheckedOrder === 'desc'}
                  onChange={onChangeSortOrderRadio}
                >
                  {labels.descLabel}
                </RadioButton>
              </Cluster>
            </Fieldset>
          </Stack>
          <Footer
            onApply={handleApply}
            onCancel={onCancel}
            cancelButtonLabel={labels.cancelButtonLabel}
            applyButtonLabel={labels.applyButtonLabel}
            className={classNames.footer}
          />
        </form>
      </DropdownContent>
    </Dropdown>
  )
}

const Footer = memo<
  Pick<Props, 'onCancel'> & {
    onApply: MouseEventHandler<HTMLButtonElement>
    className: string
    cancelButtonLabel: ReactNode
    applyButtonLabel: ReactNode
  }
>(({ className, onApply, onCancel, cancelButtonLabel, applyButtonLabel }) => (
  <Cluster gap={1} align="center" justify="flex-end" as="footer" className={className}>
    <CancelButton onClick={onCancel}>{cancelButtonLabel}</CancelButton>
    <ApplyButton onClick={onApply}>{applyButtonLabel}</ApplyButton>
  </Cluster>
))

const CancelButton = memo<PropsWithChildren<{ onClick: Props['onCancel'] }>>(
  ({ onClick, children }) => (
    <DropdownCloser>
      <Button onClick={onClick}>{children}</Button>
    </DropdownCloser>
  ),
)

const ApplyButton = memo<PropsWithChildren<{ onClick: MouseEventHandler<HTMLButtonElement> }>>(
  ({ onClick, children }) => (
    <DropdownCloser>
      <Button variant="primary" onClick={onClick}>
        {children}
      </Button>
    </DropdownCloser>
  ),
)
