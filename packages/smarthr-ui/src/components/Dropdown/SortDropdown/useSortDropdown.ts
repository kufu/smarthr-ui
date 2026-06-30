import {
  type ChangeEventHandler,
  type ComponentProps,
  type MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../intl'
import { FaArrowDownWideShortIcon, FaArrowUpWideShortIcon } from '../../Icon'

import type { SortDropdown } from './SortDropdown'

const classNameGenerator = tv({
  slots: {
    body: 'shr-p-1.5',
    select: 'shr-min-w-[16em]',
    footer: 'shr-border-t-shorthand shr-px-1.5 shr-py-1',
  },
})

type Props = Omit<ComponentProps<typeof SortDropdown>, 'onCancel'>

export const useSortDropdown = ({
  sortFields,
  defaultOrder,
  onApply,
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

  // 外向きの値
  const [selectedLabel, setSelectedLabel] = useState<string>('')
  const [checkedOrder, setCheckedOrder] = useState<Props['defaultOrder']>(defaultOrder)

  // 内部的な値
  const [innerFields, setInnerFields] = useState<Props['sortFields']>(sortFields)
  const [innerSelectedField, setInnerSelectedField] = useState<string>()
  const [innerCheckedOrder, setCheckedInnerOrder] = useState<Props['defaultOrder']>(defaultOrder)

  const propsRef = useRef({
    innerCheckedOrder,
    innerFields,
    innerSelectedField,
    onApply,
  })
  propsRef.current = {
    innerCheckedOrder,
    innerFields,
    innerSelectedField,
    onApply,
  }

  const defaultFieldLabel = useMemo(() => {
    if (selectedLabel) return selectedLabel

    const nextField = sortFields.find((field) => field.selected) || sortFields[0]

    return nextField.label
  }, [sortFields, selectedLabel])

  useEffect(() => {
    setSelectedLabel(defaultFieldLabel)
    setInnerSelectedField(defaultFieldLabel)
  }, [defaultFieldLabel])

  const handleChange = useCallback<ChangeEventHandler<HTMLSelectElement>>((e) => {
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
  }, [])
  const handleApply = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
    setSelectedLabel(propsRef.current.innerSelectedField)
    setCheckedOrder(propsRef.current.innerCheckedOrder)
    propsRef.current.onApply({
      field: propsRef.current.innerSelectedField || '',
      order: propsRef.current.innerCheckedOrder,
      newfields: propsRef.current.innerFields,
    })
  }, [])

  const onChangeSortOrderRadio = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    setCheckedInnerOrder(e.currentTarget.value as Props['defaultOrder'])
  }, [])

  const classNames = useMemo(() => {
    const { body, select, footer } = classNameGenerator()

    return {
      body: body(),
      select: select(),
      footer: footer(),
    }
  }, [])

  return {
    onChangeSortOrderRadio,
    texts: {
      ...texts,
      triggerLabel: `${selectedLabel}（${checkedOrder === 'asc' ? texts.ascLabel : texts.descLabel}）`,
    },
    handler: { handleApply, handleChange },
    innerValues: { innerFields, innerSelectedField, innerCheckedOrder },
    SortIcon: checkedOrder === 'asc' ? FaArrowUpWideShortIcon : FaArrowDownWideShortIcon,
    classNames,
  }
}
