import React, {
  ChangeEvent,
  HTMLAttributes,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useOuterClick } from '../../hooks/useOuterClick'
import { useClassNames } from './useClassNames'

import { Input } from '../Input'
import { FaCaretDownIcon, FaTimesCircleIcon } from '../Icon'
import { UnstyledButton } from '../Button'
import { useListBox } from './useListBox'
import { convertMatchableString } from './comboBoxHelper'
import { Item } from './types'

type Props<T> = {
  /**
   * 選択可能なアイテムのリスト
   */
  items: Array<Item<T>>
  /**
   * 選択されているアイテムのリスト
   */
  selectedItem: Item<T> | null
  /**
   * input 要素の `name` 属性の値
   */
  name?: string
  /**
   * input 要素の `disabled` 属性の値
   */
  disabled?: boolean
  /**
   * `true` のとき、コンポーネントの外枠が `DANGER` カラーになる
   */
  error?: boolean
  /**
   * `true` のとき、 `items` 内に存在しないアイテムを新しく追加できるようになる
   */
  creatable?: boolean
  /**
   * input 要素の `placeholder` 属性の値
   */
  placeholder?: string
  /**
   * `true` のとき、ドロップダウンリスト内にローダーを表示する
   */
  isLoading?: boolean
  /**
   * input 要素の `width` スタイルに適用する値
   */
  width?: number | string
  /**
   * コンポーネント内の一番外側の要素に適用するクラス名
   */
  className?: string
  /**
   * input 要素の `value` が変わった時に発火するコールバック関数
   * @deprecated `onChange` は非推奨なため、 代わりに `onChangeInput` を使用してください。
   */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  /**
   * input 要素の `value` が変わった時に発火するコールバック関数
   */
  onChangeInput?: (e: ChangeEvent<HTMLInputElement>) => void
  /**
   * `items` 内に存在しないアイテムが追加されたときに発火するコールバック関数
   */
  onAdd?: (label: string) => void
  /**
   * アイテムが選択された時に発火するコールバック関数
   */
  onSelect?: (item: Item<T>) => void
  /**
   * 選択されているアイテムがクリアされた時に発火するコールバック関数
   */
  onClear?: () => void
  /**
   * 選択されているアイテムのリストが変わった時に発火するコールバック関数
   */
  onChangeSelected?: (selectedItem: Item<T> | null) => void
}

type ElementProps<T> = Omit<HTMLAttributes<HTMLDivElement>, keyof Props<T>>

export function SingleComboBox<T>({
  items,
  selectedItem,
  name,
  disabled = false,
  error = false,
  creatable = false,
  placeholder = '',
  isLoading,
  width = 'auto',
  className = '',
  onChange,
  onChangeInput,
  onAdd,
  onSelect,
  onClear,
  onChangeSelected,
  ...props
}: Props<T> & ElementProps<T>) {
  const theme = useTheme()
  const classNames = useClassNames().single
  const outerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const clearButtonRef = useRef<HTMLButtonElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const filteredItems = useMemo(() => {
    const itemsWithSelected = items.map((item) => ({
      ...item,
      isSelected: selectedItem === null ? false : item.label === selectedItem.label,
    }))

    if (!isEditing) {
      return itemsWithSelected
    }

    return itemsWithSelected.filter(({ label }) => {
      if (!inputValue) return true
      return convertMatchableString(label).includes(convertMatchableString(inputValue))
    })
  }, [inputValue, isEditing, items, selectedItem])
  const isDuplicate = items.some((item) => item.label === inputValue)
  const hasSelectableExactMatch = filteredItems.some((item) => item.label === inputValue)
  const {
    renderListBox,
    calculateDropdownRect,
    resetActiveOptionIndex,
    handleInputKeyDown,
    listBoxRef,
    aria,
  } = useListBox({
    items: filteredItems,
    inputValue,
    onAdd,
    onSelect: (selected) => {
      onSelect && onSelect(selected)
      onChangeSelected && onChangeSelected(selected)
      setIsExpanded(false)
      setIsEditing(false)
    },
    isExpanded,
    isAddable: creatable && !!inputValue && !isDuplicate,
    isDuplicate: creatable && !!inputValue && isDuplicate && !hasSelectableExactMatch,
    hasNoMatch:
      (!creatable && filteredItems.length === 0) ||
      (creatable && filteredItems.length === 0 && !inputValue),
    isLoading,
    classNames: classNames.listBox,
  })

  const focus = useCallback(() => {
    setIsFocused(true)
    resetActiveOptionIndex()
    if (!isFocused) {
      setIsExpanded(true)
    }
  }, [isFocused, resetActiveOptionIndex])
  const blur = useCallback(() => {
    setIsFocused(false)
    setIsExpanded(false)
    setIsEditing(false)
  }, [])

  const caretIconColor = useMemo(() => {
    if (isFocused) return theme.color.TEXT_BLACK
    if (disabled) return theme.color.TEXT_DISABLED
    return theme.color.TEXT_GREY
  }, [disabled, isFocused, theme])

  useOuterClick(
    [outerRef, listBoxRef, clearButtonRef],
    useCallback(() => {
      blur()
    }, [blur]),
  )

  useLayoutEffect(() => {
    setInputValue(selectedItem ? selectedItem.label : '')

    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFocused, selectedItem])

  useLayoutEffect(() => {
    // ドロップダウン表示時に位置を計算する
    if (outerRef.current && isExpanded) {
      calculateDropdownRect(outerRef.current)
    }
  }, [calculateDropdownRect, isExpanded])

  const needsClearButton = selectedItem !== null && !disabled

  return (
    <Container
      {...props}
      ref={outerRef}
      className={`${disabled ? 'disabled' : ''} ${className} ${classNames.wrapper}`}
      $width={width}
      role="combobox"
      aria-haspopup="listbox"
      aria-controls={aria.listBoxId}
      aria-expanded={isFocused}
      aria-invalid={error || undefined}
    >
      <StyledInput
        type="text"
        name={name}
        value={inputValue}
        disabled={disabled}
        error={error}
        placeholder={placeholder}
        suffix={
          <>
            <ClearButton
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onClear && onClear()
                onChangeSelected && onChangeSelected(null)
                if (isFocused) {
                  setIsExpanded(true)
                }
              }}
              ref={clearButtonRef}
              themes={theme}
              className={`${needsClearButton ? '' : 'hidden'} ${classNames.clearButton}`}
            >
              <FaTimesCircleIcon color={theme.color.TEXT_BLACK} visuallyHiddenText="clear" />
            </ClearButton>
            <CaretDownLayout themes={theme}>
              <CaretDownWrapper themes={theme}>
                <FaCaretDownIcon color={caretIconColor} />
              </CaretDownWrapper>
            </CaretDownLayout>
          </>
        }
        onClick={(e) => {
          if (disabled) {
            e.stopPropagation()
            return
          }
          focus()
          if (inputRef.current) {
            inputRef.current.focus()
          }
          if (!isExpanded) {
            setIsExpanded(true)
          }
        }}
        onChange={(e) => {
          if (onChange) onChange(e)
          if (onChangeInput) onChangeInput(e)
          if (!isEditing) setIsEditing(true)
          const { value } = e.currentTarget
          setInputValue(value)
          if (value === '') {
            onClear && onClear()
            onChangeSelected && onChangeSelected(null)
          }
        }}
        onFocus={() => {
          if (!isFocused) {
            focus()
          }
        }}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        onKeyDown={(e) => {
          if (isComposing) {
            return
          }
          if (e.key === 'Tab') {
            blur()
            return
          }
          handleInputKeyDown(e)
          if (e.key === 'Escape' || e.key === 'Exc') {
            if (isExpanded) {
              e.stopPropagation()
              setIsExpanded(false)
            }
            return
          }
          if (!isExpanded) {
            setIsExpanded(true)
          }
        }}
        ref={inputRef}
        autoComplete="off"
        aria-activedescendant={aria.activeDescendant}
        aria-autocomplete="list"
        className={classNames.input}
      />
      {renderListBox()}
    </Container>
  )
}

const Container = styled.div<{ $width: number | string }>`
  display: inline-block;
  width: ${({ $width = 'auto' }) => (typeof $width === 'number' ? `${$width}px` : $width)};
  &.disabled {
    cursor: not-allowed;
  }
`
const StyledInput = styled(Input)`
  width: 100%;
`
const CaretDownLayout = styled.span<{ themes: Theme }>(({ themes }) => {
  const { spacingByChar } = themes
  return css`
    height: 100%;
    box-sizing: border-box;
    padding: ${spacingByChar(0.5)} 0;
  `
})
const CaretDownWrapper = styled.span<{ themes: Theme }>(({ themes }) => {
  const { border, spacingByChar } = themes
  return css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    box-sizing: border-box;
    padding-left: ${spacingByChar(0.5)};
    border-left: ${border.shorthand};
  `
})
const ClearButton = styled(UnstyledButton)<{ themes: Theme }>`
  ${({ themes }) => {
    const { spacingByChar } = themes
    return css`
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 0 ${spacingByChar(0.5)};
      cursor: pointer;
      &.hidden {
        display: none;
      }
    `
  }}
`
