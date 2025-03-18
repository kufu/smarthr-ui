'use client'

import React, {
  type ComponentPropsWithRef,
  type FC,
  type MouseEventHandler,
  type PropsWithChildren,
  type ReactNode,
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

import { useSortDropdown } from './useSortDropdown'

import type { DecoratorsType } from '../../../hooks/useDecorators'

type SortFieldType = {
  value: string
} & Omit<React.OptionHTMLAttributes<HTMLOptionElement>, 'value'>

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
  decorators?: DecoratorsType<
    | 'sortFieldLabel'
    | 'sortOrderLabel'
    | 'ascLabel'
    | 'descLabel'
    | 'applyButtonLabel'
    | 'cancelButtonLabel'
  >
}
type ElementProps = Omit<ComponentPropsWithRef<'button'>, keyof Props>

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
          {labels.trigger}
        </Button>
      </DropdownTrigger>
      <DropdownContent controllable>
        <form onSubmit={handleApply}>
          <Stack className={classNames.body}>
            <FormControl title={labels.sortField}>
              <Select
                name="sortFields"
                options={innerFields}
                onChange={handleChange}
                className={classNames.select}
              />
            </FormControl>
            <Fieldset title={labels.sortOrder} innerMargin={0.5}>
              <Cluster gap={1.25}>
                <RadioButton
                  name="sortOrder"
                  value="asc"
                  checked={innerCheckedOrder === 'asc'}
                  onChange={onChangeSortOrderRadio}
                >
                  {labels.asc}
                </RadioButton>
                <RadioButton
                  name="sortOrder"
                  value="desc"
                  checked={innerCheckedOrder === 'desc'}
                  onChange={onChangeSortOrderRadio}
                >
                  {labels.desc}
                </RadioButton>
              </Cluster>
            </Fieldset>
          </Stack>
          <Footer
            onCancel={onCancel}
            cancelButtonLabel={labels.cancelButton}
            applyButtonLabel={labels.applyButton}
            className={classNames.footer}
          />
        </form>
      </DropdownContent>
    </Dropdown>
  )
}

const Footer = React.memo<
  Pick<Props, 'onCancel'> & {
    className: string
    cancelButtonLabel: ReactNode
    applyButtonLabel: ReactNode
  }
>(({ className, onCancel, cancelButtonLabel, applyButtonLabel }) => (
  <Cluster gap={1} align="center" justify="flex-end" as="footer" className={className}>
    <CancelButton onClick={onCancel}>{cancelButtonLabel}</CancelButton>
    <ApplyButton>{applyButtonLabel}</ApplyButton>
  </Cluster>
))

const CancelButton = React.memo<PropsWithChildren<{ onClick: Props['onCancel'] }>>(
  ({ onClick, children }) => (
    <DropdownCloser>
      <Button onClick={onClick}>{children}</Button>
    </DropdownCloser>
  ),
)

const ApplyButton = React.memo<PropsWithChildren>(({ children }) => (
  <DropdownCloser>
    <Button type="submit" variant="primary">
      {children}
    </Button>
  </DropdownCloser>
))
