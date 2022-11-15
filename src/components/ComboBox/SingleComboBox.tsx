import React, {
  ChangeEvent,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useOuterClick } from '../../hooks/useOuterClick'
import { useSingleComboBoxClassNames } from './useClassNames'

import { Input } from '../Input'
import { FaCaretDownIcon, FaTimesCircleIcon } from '../Icon'
import { UnstyledButton } from '../Button'
import { useOptions } from './useOptions'
import { useListBox } from './useListBox'
import { ComboBoxItem } from './types'
import { ComboBoxContext } from './ComboBoxContext'

type Props<T> = {
  /**
   * 選択可能なアイテムのリスト
   */
  items: Array<ComboBoxItem<T>>
  /**
   * 選択されているアイテム
   */
  selectedItem: ComboBoxItem<T> | null
  /**
   * デフォルトで選択されるアイテム
   */
  defaultItem?: ComboBoxItem<T>
  /**
   * input 要素の `name` 属性の値
   */
  name?: string
  /**
   * input 要素の `disabled` 属性の値
   */
  disabled?: boolean
  /**
   * コンポーネント内の先頭に表示する内容
   */
  prefix?: ReactNode
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
   * ドロップダウンリスト内に表示するヘルプメッセージ
   */
  dropdownHelpMessage?: ReactNode
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
  onSelect?: (item: ComboBoxItem<T>) => void
  /**
   * 選択されているアイテムがクリアされた時に発火するコールバック関数
   */
  onClear?: () => void
  /**
   * 選択されているアイテムのリストが変わった時に発火するコールバック関数
   */
  onChangeSelected?: (selectedItem: ComboBoxItem<T> | null) => void
}

type ElementProps<T> = Omit<HTMLAttributes<HTMLDivElement>, keyof Props<T>>

export function SingleComboBox<T>({
  items,
  selectedItem,
  defaultItem,
  name,
  disabled = false,
  prefix,
  error = false,
  creatable = false,
  placeholder = '',
  dropdownHelpMessage,
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
  const classNames = useSingleComboBoxClassNames()
  const outerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const clearButtonRef = useRef<HTMLButtonElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const { options } = useOptions({
    items,
    selected: selectedItem,
    creatable,
    inputValue,
    isFilteringDisabled: !isEditing,
  })
  const {
    renderListBox,
    activeOption,
    handleKeyDown: handleListBoxKeyDown,
    listBoxId,
    listBoxRef,
  } = useListBox({
    options,
    dropdownHelpMessage,
    onAdd,
    onSelect: useCallback(
      (selected: ComboBoxItem<T>) => {
        onSelect && onSelect(selected)
        onChangeSelected && onChangeSelected(selected)
        setIsExpanded(false)
        setIsEditing(false)
      },
      [onChangeSelected, onSelect],
    ),
    isExpanded,
    isLoading,
    triggerRef: outerRef,
  })

  const focus = useCallback(() => {
    setIsFocused(true)
    if (!isFocused) {
      setIsExpanded(true)
    }
  }, [isFocused])
  const unfocus = useCallback(() => {
    setIsFocused(false)
    setIsExpanded(false)
    setIsEditing(false)

    if (!selectedItem && defaultItem) {
      setInputValue(defaultItem.label)
      onSelect && onSelect(defaultItem)
    }
  }, [selectedItem, defaultItem, onSelect])
  const onClickClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onClear && onClear()
      onChangeSelected && onChangeSelected(null)

      inputRef.current?.focus()
      setIsFocused(true)
      setIsExpanded(true)
    },
    [setIsFocused, setIsExpanded, onClear, onChangeSelected],
  )
  const onClickInput = useCallback(
    (e: React.MouseEvent) => {
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
    },
    [disabled, inputRef, isExpanded, setIsExpanded, focus],
  )
  const actualOnChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(e)
      if (onChangeInput) onChangeInput(e)
      if (!isEditing) setIsEditing(true)

      const { value } = e.currentTarget

      setInputValue(value)

      if (value === '') {
        onClear && onClear()
        onChangeSelected && onChangeSelected(null)
      }
    },
    [isEditing, setIsEditing, setInputValue, onChange, onChangeInput, onClear, onChangeSelected],
  )
  const onFocus = useCallback(() => {
    if (!isFocused) {
      focus()
    }
  }, [isFocused, focus])
  const onCompositionStart = useCallback(() => setIsComposing(true), [setIsComposing])
  const onCompositionEnd = useCallback(() => setIsComposing(false), [setIsComposing])
  const onKeyDownInput = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (isComposing) {
        return
      }
      if (['Escape', 'Exc'].includes(e.key)) {
        if (isExpanded) {
          e.stopPropagation()
          setIsExpanded(false)
        }
      } else if (e.key === 'Tab') {
        unfocus()
      } else {
        if (['Down', 'ArrowDown', 'Up', 'ArrowUp'].includes(e.key)) {
          e.preventDefault()
        }
        inputRef.current?.focus()
        if (!isExpanded) {
          setIsExpanded(true)
        }
      }
      handleListBoxKeyDown(e)
    },
    [isComposing, isExpanded, setIsExpanded, unfocus, handleListBoxKeyDown],
  )
  const onBlurInput = useCallback(() => {
    // HINT: useOuterClickよりあとに発火させたいためsetTimeoutでキューに積む
    setTimeout(() => {
      if (!selectedItem && defaultItem) {
        onSelect && onSelect(defaultItem)
      }
    }, 10)
  }, [selectedItem, defaultItem, onSelect])

  const caretIconColor = useMemo(() => {
    if (isFocused) return theme.color.TEXT_BLACK
    if (disabled) return theme.color.TEXT_DISABLED
    return theme.color.TEXT_GREY
  }, [disabled, isFocused, theme])

  useOuterClick(
    [outerRef, listBoxRef, clearButtonRef],
    useCallback(() => {
      unfocus()
    }, [unfocus]),
  )

  useLayoutEffect(() => {
    if (selectedItem) {
      setInputValue(selectedItem.label)
    } else {
      setInputValue('')
    }

    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    } else if (!selectedItem && defaultItem) {
      onSelect && onSelect(defaultItem)
    }
  }, [isFocused, selectedItem, defaultItem, onSelect])

  const needsClearButton = selectedItem !== null && !disabled
  const contextValue = useMemo(
    () => ({
      listBoxClassNames: classNames.listBox,
    }),
    [classNames.listBox],
  )

  return (
    <ComboBoxContext.Provider value={contextValue}>
      <Container
        {...props}
        ref={outerRef}
        className={`${disabled ? 'disabled' : ''} ${className} ${classNames.wrapper}`}
        $width={width}
        role="combobox"
        aria-haspopup="listbox"
        aria-controls={listBoxId}
        aria-expanded={isFocused}
        aria-invalid={error || undefined}
      >
        {/* eslint-disable smarthr/a11y-prohibit-input-placeholder */}
        <StyledInput
          placeholder={placeholder}
          type="text"
          name={name}
          value={inputValue}
          disabled={disabled}
          prefix={prefix}
          error={error}
          suffix={
            <>
              <ClearButton
                type="button"
                onClick={onClickClear}
                ref={clearButtonRef}
                themes={theme}
                className={`${needsClearButton ? '' : 'hidden'} ${classNames.clearButton}`}
              >
                <FaTimesCircleIcon color={theme.color.TEXT_BLACK} alt="clear" />
              </ClearButton>
              <CaretDownLayout themes={theme}>
                <CaretDownWrapper themes={theme}>
                  <FaCaretDownIcon color={caretIconColor} />
                </CaretDownWrapper>
              </CaretDownLayout>
            </>
          }
          onClick={onClickInput}
          onChange={actualOnChangeInput}
          onFocus={onFocus}
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
          onKeyDown={onKeyDownInput}
          onBlur={onBlurInput}
          ref={inputRef}
          autoComplete="off"
          aria-activedescendant={activeOption?.id}
          aria-autocomplete="list"
          className={classNames.input}
        />
        {/* eslint-enable smarthr/a11y-prohibit-input-placeholder */}
        {renderListBox()}
      </Container>
    </ComboBoxContext.Provider>
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
    const { shadow, spacingByChar } = themes
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

      &:focus-visible {
        box-shadow: unset;
      }

      &:focus-visible > svg {
        border-radius: 50%;
        ${shadow.focusIndicatorStyles};
      }
    `
  }}
`
