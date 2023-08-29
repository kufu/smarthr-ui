import React, {
  ChangeEvent,
  HTMLAttributes,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import innerText from 'react-innertext'
import styled, { css } from 'styled-components'

import { useClick } from '../../hooks/useClick'
import { Theme, useTheme } from '../../hooks/useTheme'
import { UnstyledButton } from '../Button'
import { FaCaretDownIcon, FaTimesCircleIcon } from '../Icon'
import { Input } from '../Input'

import { ComboBoxContext } from './ComboBoxContext'
import { BaseProps, ComboBoxItem } from './types'
import { useSingleComboBoxClassNames } from './useClassNames'
import { useListBox } from './useListBox'
import { useOptions } from './useOptions'

import type { DecoratorsType } from '../../types'

type Props<T> = BaseProps<T> & {
  /**
   * 選択されているアイテム
   */
  selectedItem: ComboBoxItem<T> | null
  /**
   * デフォルトで選択されるアイテム
   */
  defaultItem?: ComboBoxItem<T>
  /**
   * コンポーネント内の先頭に表示する内容
   */
  prefix?: ReactNode
  /**
   * 選択されているアイテムがクリアされた時に発火するコールバック関数
   */
  onClear?: () => void
  /**
   * 選択されているアイテムがクリアされた時に発火するコールバック関数
   * 指定している場合、クリア時にonClickを実行せずにonClearClickのみ実行する
   */
  onClearClick?: (e: MouseEvent) => void
  /**
   * 選択されているアイテムのリストが変わった時に発火するコールバック関数
   */
  onChangeSelected?: (selectedItem: ComboBoxItem<T> | null) => void
  /**
   * コンポーネントがフォーカスされたときに発火するコールバック関数
   */
  onFocus?: () => void
  /**
   * コンポーネントからフォーカスが外れた時に発火するコールバック関数
   */
  onBlur?: () => void
  /**
   * コンポーネント内のテキストを変更する関数/
   */
  decorators?: DecoratorsType<'noResultText'> & {
    destroyButtonIconAlt?: (text: string) => string
  }
  /**
   * input 要素の属性
   */
  inputAttributes?: Omit<
    React.ComponentProps<typeof Input>,
    | 'aria-activedescendant'
    | 'aria-autocomplete'
    | 'autoComplete'
    | 'className'
    | 'disabled'
    | 'required'
    | 'error'
    | 'name'
    | 'onChange'
    | 'onClick'
    | 'onCompositionEnd'
    | 'onCompositionStart'
    | 'onFocus'
    | 'onKeyDown'
    | 'placeholder'
    | 'prefix'
    | 'ref'
    | 'suffix'
    | 'type'
    | 'value'
  >
}

type ElementProps<T> = Omit<HTMLAttributes<HTMLDivElement>, keyof Props<T>>

const DESTROY_BUTTON_TEXT = '削除'

export function SingleComboBox<T>({
  items,
  selectedItem,
  defaultItem,
  name,
  disabled = false,
  required = false,
  prefix,
  error = false,
  creatable = false,
  placeholder = '',
  dropdownHelpMessage,
  isLoading,
  width = 'auto',
  dropdownWidth = 'auto',
  className = '',
  onChange,
  onChangeInput,
  onAdd,
  onSelect,
  onClear,
  onClearClick,
  onChangeSelected,
  onFocus,
  onBlur,
  decorators,
  inputAttributes,
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
  } = useListBox<T>({
    options,
    dropdownHelpMessage,
    dropdownWidth,
    onAdd,
    onSelect: useCallback(
      (selected: ComboBoxItem<T>) => {
        onSelect && onSelect(selected)
        onChangeSelected && onChangeSelected(selected)
        // HINT: Dropdown系コンポーネント内でComboBoxを使うと、選択肢がportalで表現されている関係上Dropdownが閉じてしまう
        // requestAnimationFrameを追加、処理を遅延させることで正常に閉じる/閉じないの判定を行えるようにする
        requestAnimationFrame(() => {
          setIsExpanded(false)
        })
        setIsEditing(false)
      },
      [onChangeSelected, onSelect],
    ),
    isExpanded,
    isLoading,
    triggerRef: outerRef,
    decorators,
  })

  const focus = useCallback(() => {
    onFocus && onFocus()
    setIsFocused(true)
    if (!isFocused) {
      setIsExpanded(true)
    }
  }, [onFocus, isFocused])
  const unfocus = useCallback(() => {
    if (!isFocused) return

    onBlur && onBlur()
    setIsFocused(false)
    setIsExpanded(false)
    setIsEditing(false)

    if (!selectedItem && defaultItem) {
      setInputValue(innerText(defaultItem.label))
      onSelect && onSelect(defaultItem)
    }
  }, [isFocused, onBlur, selectedItem, defaultItem, onSelect])
  const onClickClear = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()

      let isExecutedPreventDefault = false

      onClearClick &&
        onClearClick({
          ...e,
          preventDefault: () => {
            e.preventDefault()
            isExecutedPreventDefault = true
          },
        })

      if (!isExecutedPreventDefault) {
        onClear && onClear()
        onChangeSelected && onChangeSelected(null)
        inputRef.current?.focus()
        setIsFocused(true)
        setIsExpanded(true)
      }
    },
    [onClearClick, onClear, onChangeSelected],
  )
  const onClickInput = useCallback(
    (e: MouseEvent) => {
      if (disabled) {
        e.stopPropagation()
        return
      }
      if (inputRef.current) {
        inputRef.current.focus()
      }
      if (!isExpanded) {
        setIsExpanded(true)
      }
    },
    [disabled, inputRef, isExpanded, setIsExpanded],
  )
  const actualOnChangeInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
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
  const handleFocus = useCallback(() => {
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
      if (['Escape', 'Esc'].includes(e.key)) {
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

  const caretIconColor = useMemo(() => {
    if (isFocused) return theme.color.TEXT_BLACK
    if (disabled) return theme.color.TEXT_DISABLED
    return theme.color.TEXT_GREY
  }, [disabled, isFocused, theme])

  useClick(
    [outerRef, listBoxRef, clearButtonRef],
    useCallback(() => {
      if (!isFocused && onSelect && !selectedItem && defaultItem) {
        onSelect(defaultItem)
      }
    }, [isFocused, selectedItem, onSelect, defaultItem]),
    useCallback(() => {
      unfocus()
    }, [unfocus]),
  )

  useEffect(() => {
    if (selectedItem) {
      setInputValue(innerText(selectedItem.label))
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
          {...inputAttributes}
          placeholder={placeholder}
          type="text"
          name={name}
          value={inputValue}
          disabled={disabled}
          required={required}
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
                <FaTimesCircleIcon
                  color={theme.color.TEXT_BLACK}
                  alt={
                    decorators?.destroyButtonIconAlt?.(DESTROY_BUTTON_TEXT) || DESTROY_BUTTON_TEXT
                  }
                />
              </ClearButton>
              <CaretDownLayout themes={theme} onClick={onClickInput}>
                <CaretDownWrapper themes={theme}>
                  <FaCaretDownIcon color={caretIconColor} />
                </CaretDownWrapper>
              </CaretDownLayout>
            </>
          }
          onClick={onClickInput}
          onChange={actualOnChangeInput}
          onFocus={handleFocus}
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
          onKeyDown={onKeyDownInput}
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
  const space = spacingByChar(0.5)

  return css`
    height: 100%;
    box-sizing: border-box;
    padding: ${space};
    padding-left: 0;
    margin-right: -${space};
    cursor: pointer;
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
