import React, {
  ChangeEvent,
  ComponentPropsWithoutRef,
  MouseEvent,
  ReactNode,
  Ref,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
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

type ElementProps = Omit<ComponentPropsWithoutRef<'div'>, keyof Props<unknown>>

const DESTROY_BUTTON_TEXT = '削除'

const ActualSingleComboBox = <T,>(
  {
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
    onKeyPress,
    decorators,
    inputAttributes,
    ...props
  }: Props<T> & ElementProps,
  ref: Ref<HTMLInputElement>,
) => {
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

  useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(ref, () => inputRef.current)

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

  // HINT: form内にcomboboxを設置 & 検索inputにfocusした状態で
  // アイテムをキーボードで選択し、Enterを押すとinput上でEnterを押したことになるため、
  // submitイベントが発生し、formが送信される場合がある
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      e.key === 'Enter' && e.preventDefault()
      onKeyPress && onKeyPress(e)
    },
    [onKeyPress],
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
      {/* eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation */}
      <Container
        {...props}
        ref={outerRef}
        className={`${className} ${classNames.wrapper}`}
        $width={width}
        $disabled={disabled}
        role="combobox"
        aria-haspopup="listbox"
        aria-controls={listBoxId}
        aria-expanded={isFocused}
        aria-invalid={error || undefined}
        onKeyPress={handleKeyPress}
      >
        <StyledInput
          {...inputAttributes}
          /* eslint-disable-next-line smarthr/a11y-prohibit-input-placeholder */
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
                $hidden={!needsClearButton}
                className={classNames.clearButton}
              >
                <FaTimesCircleIcon
                  color={theme.color.TEXT_BLACK}
                  alt={
                    decorators?.destroyButtonIconAlt?.(DESTROY_BUTTON_TEXT) || DESTROY_BUTTON_TEXT
                  }
                />
              </ClearButton>
              <CaretDownButton themes={theme} onClick={onClickInput}>
                <FaCaretDownIcon color={caretIconColor} />
              </CaretDownButton>
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
        {renderListBox()}
      </Container>
    </ComboBoxContext.Provider>
  )
}

// forwardRef したコンポーネントでジェネリクスを使うときのワークアラウンド
// https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref/58473012
export const SingleComboBox = forwardRef(ActualSingleComboBox) as (<T>(
  props: ComponentPropsWithoutRef<typeof ActualSingleComboBox<T>> & {
    ref?: Ref<HTMLInputElement>
  },
) => ReturnType<typeof ActualSingleComboBox<T>>) & {
  displayName: string
}

type ContainerType = { $disabled: boolean; $width: number | string }
const Container = styled.div.attrs<ContainerType>(({ style = {}, $disabled, $width }) => {
  style.width = typeof $width === 'number' ? `${$width}px` : $width

  if ($disabled) {
    style.cursor = 'not-allowed'
  }

  return { style }
})<ContainerType>`
  display: inline-block;
`
const StyledInput = styled(Input)`
  width: 100%;
`
const CaretDownButton = styled.button<{ themes: Theme }>(({ themes }) => {
  const { border, space } = themes
  return css`
    position: relative;
    cursor: pointer;
    background-color: transparent;
    border: none;
    appearance: none;
    margin-right: ${space(-0.5)};
    padding: ${space(0.5)};

    &::before {
      content: '';
      position: absolute;
      inset: ${space(0.25)} 0;
      width: 0;
      border-left: ${border.shorthand};
    }

    .smarthr-ui-Icon {
      display: block;
    }
  `
})

type ClearButtonProps = {
  $hidden: boolean
  themes: Theme
}
const ClearButton = styled(UnstyledButton).attrs(({ $hidden }: ClearButtonProps) => ({
  style: $hidden ? { display: 'none' } : undefined,
}))<ClearButtonProps>`
  ${({ themes }) => {
    const { radius, shadow, space } = themes
    return css`
      cursor: pointer;
      margin-inline-end: ${space(0.5)};

      .smarthr-ui-Icon {
        display: block;
      }

      &:focus-visible {
        box-shadow: unset;
      }

      &:focus-visible > svg {
        border-radius: ${radius.full};
        ${shadow.focusIndicatorStyles};
      }
    `
  }}
`
