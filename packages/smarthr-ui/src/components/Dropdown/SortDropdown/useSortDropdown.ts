import {
  ChangeEventHandler,
  ComponentProps,
  FormEventHandler,
  useCallback,
  useMemo,
  useState,
} from 'react'

import { FaArrowDownWideShortIcon, FaArrowUpWideShortIcon } from '../../Icon'

import { SortDropdown } from './SortDropdown'
import { sortDropdownStyle } from './style'

type Props = Omit<ComponentProps<typeof SortDropdown>, 'onCancel'>

const SORT_FIELD_LABEL = '並べ替え項目'
const SORT_ORDER_LABEL = '並び順'
const ASC_LABEL = '昇順'
const DESC_LABEL = '降順'
const APPLY_BUTTON_TEXT = '適用'
const CANCEL_BUTTON_TEXT = 'キャンセル'

export const useSortDropdown = ({ sortFields, defaultOrder, onApply, decorators }: Props) => {
  const sortFieldLabel = useMemo(
    () => decorators?.sortFieldLabel?.(SORT_FIELD_LABEL) || SORT_FIELD_LABEL,
    [decorators],
  )
  const sortOrderLabel = useMemo(
    () => decorators?.sortOrderLabel?.(SORT_ORDER_LABEL) || SORT_ORDER_LABEL,
    [decorators],
  )
  const ascLabel = useMemo(() => decorators?.ascLabel?.(ASC_LABEL) || ASC_LABEL, [decorators])
  const descLabel = useMemo(() => decorators?.descLabel?.(DESC_LABEL) || DESC_LABEL, [decorators])
  const applyButtonLabel = useMemo(
    () => decorators?.applyButtonLabel?.(APPLY_BUTTON_TEXT) || APPLY_BUTTON_TEXT,
    [decorators],
  )
  const cancelButtonLabel = useMemo(
    () => decorators?.cancelButtonLabel?.(CANCEL_BUTTON_TEXT) || CANCEL_BUTTON_TEXT,
    [decorators],
  )

  // 外向きの値
  const [selectedLabel, setSelectedLabel] = useState<string>()
  const [checkedOrder, setCheckedOrder] = useState<Props['defaultOrder']>(defaultOrder)

  // 内部的な値
  const [innerFields, setInnerFields] = useState<Props['sortFields']>(sortFields)
  const [innerSelectedField, setInnerSelectedField] = useState<string>()
  const [innerCheckedOrder, setCheckedInnerOrder] = useState<Props['defaultOrder']>(defaultOrder)

  useMemo(() => {
    if (selectedLabel) return

    // 初期値は option に紛れているので、選択されている項目を取得
    const defaultField =
      sortFields.find((field) => 'selected' in field && field.selected) || sortFields[0]
    setSelectedLabel(defaultField.label)
    setInnerSelectedField(defaultField.label)
  }, [selectedLabel, sortFields])

  // 外向きな値で構成
  const triggerLabel = useMemo(() => {
    const sortLabel = checkedOrder === 'asc' ? ascLabel : descLabel
    return `${selectedLabel}（${sortLabel}）`
  }, [ascLabel, descLabel, selectedLabel, checkedOrder])

  const SortIcon = useMemo(
    () => (checkedOrder === 'asc' ? FaArrowUpWideShortIcon : FaArrowDownWideShortIcon),
    [checkedOrder],
  )

  const handleChange = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    (e) => {
      const select = e.currentTarget
      const newLabel = select.options[select.selectedIndex].label
      const newFields = innerFields.map((field) => ({
        ...field,
        selected: field.label === newLabel,
      }))
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

  const styles = useMemo(() => {
    const { body, select, footer } = sortDropdownStyle()
    return {
      bodyStyle: body(),
      selectStyle: select(),
      footerStyle: footer(),
    }
  }, [])

  return {
    setCheckedInnerOrder,
    labels: {
      triggerLabel,
      sortFieldLabel,
      sortOrderLabel,
      ascLabel,
      descLabel,
      applyButtonLabel,
      cancelButtonLabel,
    },
    handler: { handleApply, handleChange },
    innerValues: { innerFields, innerSelectedField, innerCheckedOrder },
    SortIcon,
    styles,
  }
}
