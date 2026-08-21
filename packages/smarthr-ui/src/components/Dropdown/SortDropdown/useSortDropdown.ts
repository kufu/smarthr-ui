import { type ChangeEvent, type ComponentProps, type MouseEvent, useMemo, useState } from 'react'

import { useLatest } from '../../../hooks/useLatest'
import { useIntl } from '../../../intl'
import { FaArrowDownWideShortIcon, FaArrowUpWideShortIcon } from '../../Icon'

import type { SortDropdown } from './SortDropdown'

type Props = ComponentProps<typeof SortDropdown>

export const useSortDropdown = ({
  sortFields,
  defaultOrder,
  onApply,
  onCancel,
  sortFieldLabel,
  sortOrderLegend,
  ascLabel,
  descLabel,
  applyText,
  cancelText,
}: Props) => {
  const { localize } = useIntl()

  const texts = useMemo(
    () => ({
      sortFieldLabel:
        sortFieldLabel ||
        localize({
          id: 'smarthr-ui/SortDropdown/sortFieldLabel',
          defaultText: '並べ替え項目',
        }),
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
    [sortFieldLabel, sortOrderLegend, ascLabel, descLabel, applyText, cancelText, localize],
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

  const hasOnCancel = !!onCancel

  const latest = useLatest({
    innerCheckedOrder,
    innerFields,
    innerSelectedField,
    onApply,
    onCancel,
  })

  const handler = useMemo(
    () => ({
      change: (e: ChangeEvent<HTMLSelectElement>) => {
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
      apply: () => {
        setSelectedLabel(latest.innerSelectedField)
        setCheckedOrder(latest.innerCheckedOrder)
        latest.onApply({
          field: latest.innerSelectedField || '',
          order: latest.innerCheckedOrder,
          newfields: latest.innerFields,
        })
      },
      cancel: hasOnCancel
        ? (e: MouseEvent<HTMLButtonElement>) => {
            latest.onCancel!(e)
          }
        : undefined,
      changeSortOrderRadio: (e: ChangeEvent<HTMLInputElement>) => {
        setCheckedInnerOrder(e.currentTarget.value as Props['defaultOrder'])
      },
    }),
    [hasOnCancel, latest],
  )

  return {
    texts: {
      ...texts,
      triggerLabel: `${selectedLabel}（${checkedOrder === 'asc' ? texts.ascLabel : texts.descLabel}）`,
    },
    handler,
    innerValues: { innerFields, innerSelectedField, innerCheckedOrder },
    SortIcon: checkedOrder === 'asc' ? FaArrowUpWideShortIcon : FaArrowDownWideShortIcon,
  }
}
