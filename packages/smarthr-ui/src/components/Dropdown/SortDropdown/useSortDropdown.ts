import {
  type ChangeEventHandler,
  type ComponentProps,
  type FormEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useDecorators } from '../../../hooks/useDecorators'
import { FaArrowDownWideShortIcon, FaArrowUpWideShortIcon } from '../../Icon'

import { SortDropdown } from './SortDropdown'

const classNameGenerator = tv({
  slots: {
    body: 'shr-p-1.5',
    select: 'shr-min-w-[16em]',
    footer: 'shr-border-t-shorthand shr-px-1.5 shr-py-1',
  },
})

type Props = Omit<ComponentProps<typeof SortDropdown>, 'onCancel'>

const DECORATOR_DEFAULT_TEXTS = {
  sortFieldLabel: '並べ替え項目',
  sortOrderLabel: '並び順',
  ascLabel: '昇順',
  descLabel: '降順',
  applyButtonLabel: '適用',
  cancelButtonLabel: 'キャンセル',
} as const
export type DecoratorKeyTypes = keyof typeof DECORATOR_DEFAULT_TEXTS

export const useSortDropdown = ({ sortFields, defaultOrder, onApply, decorators }: Props) => {
  const decorated = useDecorators<DecoratorKeyTypes>(DECORATOR_DEFAULT_TEXTS, decorators)

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
    const sortLabel = checkedOrder === 'asc' ? decorated.ascLabel : decorated.descLabel

    return `${selectedLabel}（${sortLabel}）`
  }, [decorated.ascLabel, decorated.descLabel, selectedLabel, checkedOrder])

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
    const { body, select, footer } = classNameGenerator()

    return {
      body: body(),
      select: select(),
      footer: footer(),
    }
  }, [])

  return {
    onChangeSortOrderRadio,
    labels: {
      triggerLabel,
      ...decorated,
    },
    handler: { handleApply, handleChange },
    innerValues: { innerFields, innerSelectedField, innerCheckedOrder },
    SortIcon,
    classNames,
  }
}
