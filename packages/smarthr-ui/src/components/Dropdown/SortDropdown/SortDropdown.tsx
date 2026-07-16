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

import { useSortDropdown } from './useSortDropdown'

type SortFieldType = {
  value: string
} & Omit<OptionHTMLAttributes<HTMLOptionElement>, 'value'>

type ArgsOnApply = {
  field: string
  order: 'asc' | 'desc'
  newfields: SortFieldType[]
}

type AbstractProps = {
  /** 並び替え項目 */
  sortFields: SortFieldType[]
  /** 並び順の初期値 */
  defaultOrder: 'asc' | 'desc'
  sortFieldLabel?: ReactNode
  sortOrderLegend?: ReactNode
  ascLabel?: ReactNode
  descLabel?: ReactNode
  applyText?: ReactNode
  cancelText?: ReactNode
  /** 適用時に発火するイベント */
  onApply: (args: ArgsOnApply) => void
  /** キャンセル時に発火するイベント */
  onCancel?: MouseEventHandler<HTMLButtonElement>
}
type Props = AbstractProps & Omit<ComponentPropsWithRef<'button'>, keyof AbstractProps>

const ON_SUBMIT = (e: FormEvent) => {
  e.preventDefault()
}

export const SortDropdown: FC<Props> = ({
  sortFields,
  defaultOrder,
  sortFieldLabel,
  sortOrderLegend,
  ascLabel,
  descLabel,
  applyText,
  cancelText,
  onApply,
  onCancel,
  ...rest
}) => {
  const {
    texts,
    SortIcon,
    innerValues: { innerFields, innerCheckedOrder },
    handler,
    classNames,
  } = useSortDropdown({
    sortFields,
    defaultOrder,
    onApply,
    sortFieldLabel,
    sortOrderLegend,
    ascLabel,
    descLabel,
    applyText,
    cancelText,
  })

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button {...rest} suffix={<SortIcon />}>
          {texts.triggerLabel}
        </Button>
      </DropdownTrigger>
      <DropdownContent controllable>
        <form onSubmit={ON_SUBMIT}>
          <Stack className={classNames.body}>
            <FormControl label={texts.sortFieldLabel}>
              <Select
                name="sortFields"
                options={innerFields}
                onChange={handler.change}
                className={classNames.select}
              />
            </FormControl>
            <Fieldset legend={texts.sortOrderLegend} innerMargin={0.5}>
              <Cluster gap={1.25}>
                <RadioButton
                  name="sortOrder"
                  value="asc"
                  checked={innerCheckedOrder === 'asc'}
                  onChange={handler.changeSortOrderRadio}
                >
                  {texts.ascLabel}
                </RadioButton>
                <RadioButton
                  name="sortOrder"
                  value="desc"
                  checked={innerCheckedOrder === 'desc'}
                  onChange={handler.changeSortOrderRadio}
                >
                  {texts.descLabel}
                </RadioButton>
              </Cluster>
            </Fieldset>
          </Stack>
          <Footer
            handleApply={handler.apply}
            handleCancel={onCancel}
            cancelText={texts.cancelText}
            applyText={texts.applyText}
            className={classNames.footer}
          />
        </form>
      </DropdownContent>
    </Dropdown>
  )
}

const Footer = memo<{
  handleApply: MouseEventHandler<HTMLButtonElement>
  handleCancel?: MouseEventHandler<HTMLButtonElement>
  className: string
  cancelText: ReactNode
  applyText: ReactNode
}>(({ className, handleApply, handleCancel, cancelText, applyText }) => (
  <Cluster gap={1} align="center" justify="flex-end" as="footer" className={className}>
    <CancelButton handleClick={handleCancel}>{cancelText}</CancelButton>
    <ApplyButton handleClick={handleApply}>{applyText}</ApplyButton>
  </Cluster>
))

const CancelButton = memo<
  PropsWithChildren<{ handleClick?: MouseEventHandler<HTMLButtonElement> }>
>(({ handleClick, children }) => (
  <DropdownCloser>
    <Button onClick={handleClick}>{children}</Button>
  </DropdownCloser>
))

const ApplyButton = memo<PropsWithChildren<{ handleClick: MouseEventHandler<HTMLButtonElement> }>>(
  ({ handleClick, children }) => (
    <DropdownCloser>
      <Button variant="primary" onClick={handleClick}>
        {children}
      </Button>
    </DropdownCloser>
  ),
)
