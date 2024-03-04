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
import { tv } from 'tailwind-variants'

import { useClick } from '../../hooks/useClick'
import { useTheme } from '../../hooks/useTailwindTheme'
import { UnstyledButton } from '../Button'
import { FaCaretDownIcon, FaTimesCircleIcon } from '../Icon'
import { Input } from '../Input'

import { BaseProps, ComboBoxItem } from './types'
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

const singleCombobox = tv({
  slots: {
    wrapper: 'smarthr-ui-SingleComboBox shr-inline-block',
    input: 'smarthr-ui-SingleComboBox-input shr-w-full',
    caretDownLayout: [
      'shr-relative -shr-me-0.5 shr-p-0.5',
      'before:shr-border-0',
      'before:shr-absolute before:shr-inset-x-0 before:shr-inset-y-0.25 before:shr-w-0 before:shr-border-l before:shr-border-solid before:shr-border-default before:shr-content-[""]',
    ],
    caretDownIcon: 'shr-block',
    clearButton: [
      'smarthr-ui-SingleComboBox-clearButton',
      'shr-group/clearButton',
      'shr-me-0.5 shr-cursor-pointer',
      'focus-visible:shr-shadow-none',
    ],
    clearButtonIcon: [
      'shr-block',
      'group-focus-visible/clearButton:shr-focus-indicator group-focus-visible/clearButton:shr-rounded-full',
    ],
  },
  variants: {
    disabled: {
      true: {
        wrapper: 'shr-cursor-not-allowed',
      },
    },
    hidden: {
      true: {
        clearButton: 'shr-hidden',
      },
    },
  },
})

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
    width,
    dropdownWidth = 'auto',
    className,
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
    style,
    ...props
  }: Props<T> & ElementProps,
  ref: Ref<HTMLInputElement>,
) => {
  const { textColor } = useTheme()
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
    if (isFocused) return textColor.black
    if (disabled) return textColor.disabled
    return textColor.grey
  }, [disabled, isFocused, textColor.black, textColor.disabled, textColor.grey])

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

  const { wrapper, input, caretDownLayout, caretDownIcon, clearButton, clearButtonIcon } =
    singleCombobox()
  const {
    wrapperStyleProps,
    inputStyle,
    caretDownLayoutStyle,
    caretDownIconStyle,
    clearButtonStyle,
    clearButtonIconStyle,
  } = useMemo(() => {
    const wrapperWidth = typeof width === 'number' ? `${width}px` : width
    return {
      wrapperStyleProps: {
        style: {
          ...style,
          width: wrapperWidth,
        },
        className: wrapper({ disabled, className }),
      },
      inputStyle: input(),
      caretDownLayoutStyle: caretDownLayout(),
      caretDownIconStyle: caretDownIcon(),
      clearButtonStyle: clearButton({ hidden: !needsClearButton }),
      clearButtonIconStyle: clearButtonIcon(),
    }
  }, [
    width,
    style,
    wrapper,
    disabled,
    className,
    input,
    caretDownLayout,
    caretDownIcon,
    clearButton,
    needsClearButton,
    clearButtonIcon,
  ])

  return (
    <div
      {...props}
      {...wrapperStyleProps}
      ref={outerRef}
      role="combobox"
      aria-haspopup="listbox"
      aria-controls={listBoxId}
      aria-expanded={isFocused}
      aria-invalid={error || undefined}
      onKeyPress={handleKeyPress}
    >
      <Input
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
            <UnstyledButton
              onClick={onClickClear}
              ref={clearButtonRef}
              className={clearButtonStyle}
            >
              <FaTimesCircleIcon
                color="TEXT_BLACK"
                alt={decorators?.destroyButtonIconAlt?.(DESTROY_BUTTON_TEXT) || DESTROY_BUTTON_TEXT}
                className={clearButtonIconStyle}
              />
            </UnstyledButton>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, smarthr/a11y-delegate-element-has-role-presentation */}
            <span onClick={onClickInput} className={caretDownLayoutStyle}>
              <FaCaretDownIcon color={caretIconColor} className={caretDownIconStyle} />
            </span>
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
        className={inputStyle}
      />
      {renderListBox()}
    </div>
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
