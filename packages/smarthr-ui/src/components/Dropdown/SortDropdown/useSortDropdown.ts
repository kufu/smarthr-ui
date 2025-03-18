import {
  type ChangeEventHandler,
  type ComponentProps,
  type FormEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { FaArrowDownWideShortIcon, FaArrowUpWideShortIcon } from '../../Icon'

import { sortDropdownStyle } from './style'

import type { SortDropdown } from './SortDropdown'

type Props = Omit<ComponentProps<typeof SortDropdown>, 'onCancel'>

const SORT_FIELD_LABEL = '並べ替え項目'
const SORT_ORDER_LABEL = '並び順'
const ASC_LABEL = '昇順'
const DESC_LABEL = '降順'
const APPLY_BUTTON_TEXT = '適用'
const CANCEL_BUTTON_TEXT = 'キャンセル'

export const useSortDropdown = ({ sortFields, defaultOrder, onApply, decorators }: Props) => {
  const decoratedTexts = useMemo(() => {
    if (!decorators) {
      return {
        sortField: SORT_FIELD_LABEL,
        sortOrder: SORT_ORDER_LABEL,
        asc: ASC_LABEL,
        desc: DESC_LABEL,
        applyButton: APPLY_BUTTON_TEXT,
        cancelButton: CANCEL_BUTTON_TEXT,
      }
    }

    return {
      sortFieldLabel: decorators.sortFieldLabel?.(SORT_FIELD_LABEL) || SORT_FIELD_LABEL,
      sortOrderLabel: decorators.sortOrderLabel?.(SORT_ORDER_LABEL) || SORT_ORDER_LABEL,
      ascLabel: decorators.ascLabel?.(ASC_LABEL) || ASC_LABEL,
      descLabel: decorators.descLabel?.(DESC_LABEL) || DESC_LABEL,
      applyButtonLabel: decorators.applyButtonLabel?.(APPLY_BUTTON_TEXT) || APPLY_BUTTON_TEXT,
      cancelButtonLabel: decorators.cancelButtonLabel?.(CANCEL_BUTTON_TEXT) || CANCEL_BUTTON_TEXT,
    }
  }, [decorators])

  // 外向きの値
  const [selectedLabel, setSelectedLabel] = useState<string>()
  const [checkedOrder, setCheckedOrder] = useState<Props['defaultOrder']>(defaultOrder)

  // 内部的な値
  const [innerFields, setInnerFields] = useState<Props['sortFields']>(sortFields)
  const [innerSelectedField, setInnerSelectedField] = useState<string>()
  const [innerCheckedOrder, setCheckedInnerOrder] = useState<Props['defaultOrder']>(defaultOrder)

  useEffect(() => {
    if (selectedLabel) return

    // 初期値は option に紛れているので、選択されている項目を取得
    const defaultField =
      sortFields.find((field) => 'selected' in field && field.selected) || sortFields[0]

    setSelectedLabel(defaultField.label)
    setInnerSelectedField(defaultField.label)
  }, [selectedLabel, sortFields])

  // 外向きな値で構成
  const triggerLabel = useMemo(() => {
    const sortLabel = checkedOrder === 'asc' ? decoratedTexts.asc : decoratedTexts.desc

    return `${selectedLabel}（${sortLabel}）`
  }, [decoratedTexts.asc, decoratedTexts.desc, selectedLabel, checkedOrder])

  const SortIcon = useMemo(
    () => (checkedOrder === 'asc' ? FaArrowUpWideShortIcon : FaArrowDownWideShortIcon),
    [checkedOrder],
  )

  const handleChange = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    (e) => {
      const select = e.currentTarget
      const newLabel = select.options[select.selectedIndex].label
      const newFields = innerFields.map((field) => {
        if (field.label !== newLabel && field.selected) {
          return {
            ...field,
            selected: false,
          }
        }
        if (field.label === newLabel && !field.selected) {
          return {
            ...field,
            selected: true,
          }
        }

        return field
      })

      setInnerFields(newFields)
      setInnerSelectedField(newLabel)
    },
    [innerFields],
  )
  const handleApply = useCallback<FormEventHandler<HTMLFormElement>>(() => {
    setSelectedLabel(innerSelectedField)
    setCheckedOrder(innerCheckedOrder)
    onApply({ field: innerSelectedField || '', order: innerCheckedOrder, newfields: innerFields })
  }, [innerCheckedOrder, innerFields, innerSelectedField, onApply])

  const onChangeSortOrderRadio = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    setCheckedInnerOrder(e.currentTarget.value as Props['defaultOrder'])
  }, [])

  const classNames = useMemo(() => {
    const { body, select, footer } = sortDropdownStyle()

    return {
      body: body(),
      select: select(),
      footer: footer(),
    }
  }, [])

  return {
    onChangeSortOrderRadio,
    labels: {
      trigger: triggerLabel,
      ...decoratedTexts,
    },
    handler: { handleApply, handleChange },
    innerValues: { innerFields, innerSelectedField, innerCheckedOrder },
    SortIcon,
    classNames,
  }
}
