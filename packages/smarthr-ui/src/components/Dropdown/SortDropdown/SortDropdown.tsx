'use client'

import {
  type ChangeEvent,
  type ComponentPropsWithRef,
  type FC,
  type FormEvent,
  type MouseEvent,
  type MouseEventHandler,
  type OptionHTMLAttributes,
  type PropsWithChildren,
  type ReactNode,
  memo,
  useMemo,
  useState,
} from 'react'

import { useLatest } from '../../../hooks/useLatest'
import { Localizer, useIntl } from '../../../intl'
import { Button } from '../../Button'
import { Fieldset } from '../../Fieldset'
import { FormControl } from '../../FormControl'
import { FaArrowDownWideShortIcon, FaArrowUpWideShortIcon } from '../../Icon'
import { Cluster, Stack } from '../../Layout'
import { RadioButton } from '../../RadioButton'
import { Select } from '../../Select'
import { Dropdown } from '../Dropdown'
import { DropdownCloser } from '../DropdownCloser'
import { DropdownContent } from '../DropdownContent'
import { DropdownTrigger } from '../DropdownTrigger'

type SortFieldType = {
  value: string
} & Omit<OptionHTMLAttributes<HTMLOptionElement>, 'value'>

type ArgsOnApply = {
  field: string
  order: 'asc' | 'desc'
  newfields: SortFieldType[]
}

type BaseProps = {
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
type Props = BaseProps & Omit<ComponentPropsWithRef<'button'>, keyof BaseProps>

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
  const { localize } = useIntl()

  const texts = useMemo(
    () => ({
      sortOrderLegend:
        sortOrderLegend ||
        localize({
          id: 'smarthr-ui/SortDropdown/sortOrderLegend',
          defaultText: '並び順',
        }),
      ascLabel:
        ascLabel ||
        localize({
          id: 'smarthr-ui/SortDropdown/ascLabel',
          defaultText: '昇順',
        }),
      descLabel:
        descLabel ||
        localize({
          id: 'smarthr-ui/SortDropdown/descLabel',
          defaultText: '降順',
        }),
      applyText:
        applyText ||
        localize({
          id: 'smarthr-ui/SortDropdown/applyText',
          defaultText: '適用',
        }),
      cancelText:
        cancelText ||
        localize({
          id: 'smarthr-ui/SortDropdown/cancelText',
          defaultText: 'キャンセル',
        }),
    }),
    [sortOrderLegend, ascLabel, descLabel, applyText, cancelText, localize],
  )

  const [defaultFieldLabel] = useState(
    () => (sortFields.find((field) => field.selected) || sortFields[0])?.label || '',
  )

  // 外向きの値
  const [selectedLabel, setSelectedLabel] = useState<string>(defaultFieldLabel)
  const [checkedOrder, setCheckedOrder] = useState<Props['defaultOrder']>(defaultOrder)

  // 内部的な値
  const [innerFields, setInnerFields] = useState<Props['sortFields']>(sortFields)
  const [innerSelectedField, setInnerSelectedField] = useState<string>(defaultFieldLabel)
  const [innerCheckedOrder, setCheckedInnerOrder] = useState<Props['defaultOrder']>(defaultOrder)

  const latest = useLatest({
    innerCheckedOrder,
    innerFields,
    innerSelectedField,
    onApply,
    onCancel,
  })
  const hasOnCancel = !!onCancel

  const functions = useMemo(
    () => ({
      handleChange: (e: ChangeEvent<HTMLSelectElement>) => {
        const select = e.currentTarget
        const newLabel = select.options[select.selectedIndex].label

        setInnerFields((currentFields) =>
          currentFields.map((field) => {
            if (field.label === newLabel) {
              if (!field.selected) {
                return {
                  ...field,
                  selected: true,
                }
              }
            } else if (field.selected) {
              return {
                ...field,
                selected: false,
              }
            }

            return field
          }),
        )
        setInnerSelectedField(newLabel)
      },
      handleApply: () => {
        setSelectedLabel(latest.innerSelectedField)
        setCheckedOrder(latest.innerCheckedOrder)
        latest.onApply({
          field: latest.innerSelectedField || '',
          order: latest.innerCheckedOrder,
          newfields: latest.innerFields,
        })
      },
      handleCancel: hasOnCancel
        ? (e: MouseEvent<HTMLButtonElement>) => {
            latest.onCancel!(e)
          }
        : undefined,
      handleChangeSortOrderRadio: (e: ChangeEvent<HTMLInputElement>) => {
        setCheckedInnerOrder(e.currentTarget.value as Props['defaultOrder'])
      },
    }),
    [hasOnCancel, latest],
  )

  const SortIcon = checkedOrder === 'asc' ? FaArrowUpWideShortIcon : FaArrowDownWideShortIcon

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button {...rest} suffix={<SortIcon />}>
          {`${selectedLabel}（${checkedOrder === 'asc' ? texts.ascLabel : texts.descLabel}）`}
        </Button>
      </DropdownTrigger>
      <DropdownContent controllable>
        <form onSubmit={ON_SUBMIT}>
          <Stack className="shr-p-1.5">
            <FormControl
              label={
                sortFieldLabel || (
                  <Localizer
                    id="smarthr-ui/SortDropdown/sortFieldLabel"
                    defaultText="並べ替え項目"
                  />
                )
              }
            >
              <Select
                name="sortFields"
                options={innerFields}
                onChange={functions.handleChange}
                className="shr-min-w-[16em]"
              />
            </FormControl>
            <Fieldset legend={texts.sortOrderLegend} innerMargin={0.5}>
              <Cluster gap={1.25}>
                <RadioButton
                  name="sortOrder"
                  value="asc"
                  checked={innerCheckedOrder === 'asc'}
                  onChange={functions.handleChangeSortOrderRadio}
                >
                  {texts.ascLabel}
                </RadioButton>
                <RadioButton
                  name="sortOrder"
                  value="desc"
                  checked={innerCheckedOrder === 'desc'}
                  onChange={functions.handleChangeSortOrderRadio}
                >
                  {texts.descLabel}
                </RadioButton>
              </Cluster>
            </Fieldset>
          </Stack>
          <Footer
            handleApply={functions.handleApply}
            handleCancel={functions.handleCancel}
            cancelText={texts.cancelText}
            applyText={texts.applyText}
            className="shr-border-t-shorthand shr-px-1.5 shr-py-1"
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
