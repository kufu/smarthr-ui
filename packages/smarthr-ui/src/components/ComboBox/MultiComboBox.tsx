'use client'

import React, {
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useId } from 'react'
import innerText from 'react-innertext'
import { tv } from 'tailwind-variants'

import { useOuterClick } from '../../hooks/useOuterClick'
import { genericsForwardRef } from '../../libs/util'
import { textColor } from '../../themes'
import { FaCaretDownIcon } from '../Icon'

import { MultiSelectedItem } from './MultiSelectedItem'
import { hasParentElementByClassName } from './multiComboBoxHelper'
import { useFocusControl } from './useFocusControl'
import { useListBox } from './useListBox'
import { useOptions } from './useOptions'

import type { BaseProps, ComboBoxItem } from './types'
import type { DecoratorsType } from '../../types'

type Props<T> = BaseProps<T> & {
  /**
   * 選択されているアイテムのリスト
   */
  selectedItems: Array<ComboBoxItem<T> & { deletable?: boolean }>
  /**
   * 選択されているアイテムのラベルを省略表示するかどうか
   */
  selectedItemEllipsis?: boolean
  /**
   * テキストボックスの `value` 属性の値。
   * `onChangeInput` と併せて設定することで、テキストボックスの挙動が制御可能になる。
   */
  inputValue?: string
  /**
   * 選択されているアイテムの削除ボタンがクリックされた時に発火するコールバック関数
   */
  onDelete?: (item: ComboBoxItem<T>) => void
  /**
   * 選択されているアイテムのリストが変わった時に発火するコールバック関数
   */
  onChangeSelected?: (selectedItems: Array<ComboBoxItem<T>>) => void
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
    selectedListAriaLabel?: (text: string) => string
  }
  /**
   * アイテムが選択されたときに選択済みかどうかを判定するコールバック関数/
   */
  isItemSelected?: (targetItem: ComboBoxItem<T>, selectedItems: Array<ComboBoxItem<T>>) => boolean
}

type ElementProps = Omit<ComponentPropsWithoutRef<'input'>, keyof Props<unknown>>

const SELECTED_LIST_ARIA_LABEL = '選択済みアイテム'

const multiCombobox = tv({
  slots: {
    wrapper: [
      'smarthr-ui-MultiComboBox',
      'shr-box-border shr-inline-flex shr-min-w-[15em] shr-rounded-m shr-border shr-border-solid shr-px-0.5 shr-py-0.25 shr-align-bottom',
      'contrast-more:shr-border-high-contrast',
      'has-[[aria-invalid]]:shr-border-danger',
    ],
    inputArea: 'shr-flex shr-flex-1 shr-flex-wrap shr-gap-0.5 shr-overflow-y-auto',
    selectedList:
      'smarthr-ui-MultiComboBox-selectedList shr-contents shr-list-none [&_li]:shr-min-w-0',
    inputWrapper: 'shr-flex shr-flex-1 shr-items-center',
    input: [
      'smarthr-ui-MultiComboBox-input',
      'shr-w-full shr-min-w-[5em] shr-border-none shr-text-base shr-text-black shr-outline-none shr-outline-0',
      'disabled:shr-hidden',
    ],
    placeholderEl: 'smarthr-ui-MultiComboBox-placeholder shr-my-0 shr-self-center',
    suffixWrapper: [
      'shr-relative -shr-me-0.5 shr-ms-0.5 shr-p-0.5',
      'before:shr-absolute before:shr-inset-x-0 before:shr-inset-y-0.25 before:shr-w-0 before:shr-border-0 before:shr-border-l before:shr-border-solid before:shr-border-default before:shr-content-[""]',
    ],
    suffixIcon: 'shr-block',
  },
  variants: {
    focused: {
      true: {
        wrapper: 'shr-focus-indicator',
      },
    },
    disabled: {
      true: {
        wrapper:
          'shr-cursor-not-allowed shr-border-default/50 shr-bg-white-darken shr-text-disabled',
      },
      false: {
        wrapper: 'shr-cursor-text shr-bg-white',
      },
    },
    hidden: {
      true: {
        inputWrapper: 'shr-pointer-events-none shr-absolute shr-opacity-0',
      },
    },
  },
  compoundVariants: [
    {
      disabled: false,
      className: {
        wrapper: 'shr-border-default',
      },
    },
  ],
})

const ActualMultiComboBox = <T,>(
  {
    items,
    selectedItems,
    name,
    disabled = false,
    required = false,
    error = false,
    creatable = false,
    placeholder = '',
    autoComplete,
    dropdownHelpMessage,
    isLoading,
    selectedItemEllipsis,
    width,
    dropdownWidth = 'auto',
    inputValue: controlledInputValue,
    className,
    onChange,
    onChangeInput,
    onAdd,
    onDelete,
    onSelect,
    onChangeSelected,
    onFocus,
    onBlur,
    onKeyPress,
    decorators,
    isItemSelected,
    style,
    ...rest
  }: Props<T> & ElementProps,
  ref: Ref<HTMLInputElement>,
) => {
  const outerRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [highlighted, setHighlighted] = useState(false)
  const isInputControlled = useMemo(
    () => controlledInputValue !== undefined,
    [controlledInputValue],
  )
  const [uncontrolledInputValue, setUncontrolledInputValue] = useState('')
  const inputValue = isInputControlled ? controlledInputValue : uncontrolledInputValue
  const [isComposing, setIsComposing] = useState(false)
  const { options } = useOptions({
    items,
    selected: selectedItems,
    creatable,
    inputValue,
    isItemSelected,
  })
  const setInputValueIfUncontrolled = useCallback(
    (value: string) => {
      if (!isInputControlled) {
        setUncontrolledInputValue(value)
      }
    },
    [isInputControlled],
  )
  const handleDelete = useCallback(
    (item: ComboBoxItem<T>) => {
      // HINT: Dropdown系コンポーネント内でComboBoxを使うと、選択肢がportalで表現されている関係上Dropdownが閉じてしまう
      // requestAnimationFrameを追加、処理を遅延させることで正常に閉じる/閉じないの判定を行えるようにする
      requestAnimationFrame(() => {
        if (onDelete) onDelete(item)
        if (onChangeSelected)
          onChangeSelected(
            selectedItems.filter(
              (selected) => selected.label !== item.label || selected.value !== item.value,
            ),
          )
      })
    },
    [onChangeSelected, onDelete, selectedItems],
  )
  const handleSelect = useCallback(
    (selected: ComboBoxItem<T>) => {
      // HINT: Dropdown系コンポーネント内でComboBoxを使うと、選択肢がportalで表現されている関係上Dropdownが閉じてしまう
      // requestAnimationFrameを追加、処理を遅延させることで正常に閉じる/閉じないの判定を行えるようにする
      requestAnimationFrame(() => {
        const matchedSelectedItem = selectedItems.find(
          (item) => item.label === selected.label && item.value === selected.value,
        )
        if (matchedSelectedItem !== undefined) {
          if (matchedSelectedItem.deletable !== false) {
            handleDelete(selected)
          }
        } else {
          if (onSelect) onSelect(selected)
          if (onChangeSelected) onChangeSelected(selectedItems.concat(selected))
        }
      })
    },
    [handleDelete, onChangeSelected, onSelect, selectedItems],
  )

  const {
    renderListBox,
    activeOption,
    handleKeyDown: handleListBoxKeyDown,
    listBoxId,
    listBoxRef,
  } = useListBox({
    options,
    dropdownHelpMessage,
    dropdownWidth,
    onAdd,
    onSelect: handleSelect,
    isExpanded: isFocused,
    isLoading,
    triggerRef: outerRef,
    decorators,
  })

  const {
    deletionButtonRefs,
    inputRef,
    focusPrevDeletionButton,
    focusNextDeletionButton,
    resetDeletionButtonFocus,
  } = useFocusControl(selectedItems.length)

  useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(ref, () => inputRef.current)

  const focus = useCallback(() => {
    if (onFocus) onFocus()
    setIsFocused(true)
  }, [onFocus])
  const blur = useCallback(() => {
    if (!isFocused) return
    if (onBlur) onBlur()
    setIsFocused(false)
    resetDeletionButtonFocus()
  }, [isFocused, onBlur, resetDeletionButtonFocus])

  const caretIconColor = useMemo(() => {
    if (isFocused) return textColor.black
    if (disabled) return textColor.disabled
    return textColor.grey
  }, [disabled, isFocused])

  useOuterClick([outerRef, listBoxRef], blur)

  useEffect(() => {
    if (highlighted) {
      setHighlighted(false)
      inputRef.current?.select()
    } else {
      setInputValueIfUncontrolled('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems, inputRef, setInputValueIfUncontrolled]) // highlighted 変更時には発火してほしくないため

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef, isFocused, setInputValueIfUncontrolled, selectedItems])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (isComposing) {
        return
      } else if (e.key === 'Escape' || e.key === 'Esc') {
        e.stopPropagation()
        blur()
      } else if (e.key === 'Tab') {
        if (isFocused) {
          // フォーカスがコンポーネントを抜けるように先に input をフォーカスしておく
          inputRef.current?.focus()
        }
        blur()
      } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        e.stopPropagation()
        focusPrevDeletionButton()
      } else if (e.key === 'Right' || e.key === 'ArrowRight') {
        e.stopPropagation()
        focusNextDeletionButton()
      } else if (
        e.key === 'Backspace' &&
        !inputValue &&
        selectedItems.length > 0 &&
        selectedItems[selectedItems.length - 1].deletable !== false
      ) {
        e.preventDefault()
        e.stopPropagation()
        const lastItem = selectedItems[selectedItems.length - 1]
        handleDelete(lastItem)
        setHighlighted(true)
        setInputValueIfUncontrolled(innerText(lastItem.label))
      } else {
        e.stopPropagation()
        inputRef.current?.focus()
        resetDeletionButtonFocus()
      }
      handleListBoxKeyDown(e)
    },
    [
      blur,
      focusNextDeletionButton,
      focusPrevDeletionButton,
      handleListBoxKeyDown,
      inputRef,
      isComposing,
      isFocused,
      resetDeletionButtonFocus,
      handleDelete,
      inputValue,
      selectedItems,
      setInputValueIfUncontrolled,
    ],
  )

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (
        !hasParentElementByClassName(
          e.target as HTMLElement,
          'smarthr-ui-MultiComboBox-deleteButton',
        ) &&
        !disabled &&
        !isFocused
      ) {
        focus()
      }
    },
    [isFocused, disabled, focus],
  )
  const handleChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(e)
      if (onChangeInput) onChangeInput(e)
      setInputValueIfUncontrolled(e.currentTarget.value)
    },
    [onChange, onChangeInput, setInputValueIfUncontrolled],
  )
  const handleFocusInput = useCallback(() => {
    resetDeletionButtonFocus()

    if (!isFocused) {
      focus()
    }
  }, [isFocused, focus, resetDeletionButtonFocus])
  const handleCompositionStartInput = useCallback(() => setIsComposing(true), [])
  const handleCompositionEndInput = useCallback(() => setIsComposing(false), [])
  const handleInputKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Down' || e.key === 'ArrowDown' || e.key === 'Up' || e.key === 'ArrowUp') {
      // 上下キー入力はリストボックスの activeDescendant の移動に用いるため、input 内では作用させない
      e.preventDefault()
    }
  }, [])

  // HINT: form内にcomboboxを設置 & 検索inputにfocusした状態で
  // アイテムをキーボードで選択し、Enterを押すとinput上でEnterを押したことになるため、
  // submitイベントが発生し、formが送信される場合がある
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') e.preventDefault()
      if (onKeyPress) onKeyPress(e)
    },
    [onKeyPress],
  )

  const selectedListId = useId()

  const {
    wrapper,
    inputArea,
    selectedList,
    inputWrapper,
    input,
    placeholderEl,
    suffixWrapper,
    suffixIcon,
  } = multiCombobox()
  const {
    wrapperStyleProps,
    inputAreaStyle,
    selectedListStyle,
    inputWrapperStyle,
    inputStyle,
    placeholderStyle,
    suffixWrapperStyle,
    suffixIconStyle,
  } = useMemo(() => {
    const widthStyle = typeof width === 'number' ? `${width}px` : width
    return {
      wrapperStyleProps: {
        style: {
          ...style,
          width: widthStyle,
        },
        className: wrapper({ focused: isFocused, disabled, className }),
      },
      inputAreaStyle: inputArea(),
      selectedListStyle: selectedList(),
      inputWrapperStyle: inputWrapper({ hidden: !isFocused }),
      inputStyle: input(),
      placeholderStyle: placeholderEl(),
      suffixWrapperStyle: suffixWrapper({ disabled }),
      suffixIconStyle: suffixIcon(),
    }
  }, [
    className,
    disabled,
    input,
    inputArea,
    inputWrapper,
    isFocused,
    placeholderEl,
    selectedList,
    style,
    suffixIcon,
    suffixWrapper,
    width,
    wrapper,
  ])

  return (
    <div
      {...wrapperStyleProps}
      ref={outerRef}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onKeyPress={handleKeyPress}
      role="group"
    >
      <div className={inputAreaStyle}>
        <ul
          id={selectedListId}
          aria-label={
            decorators?.selectedListAriaLabel?.(SELECTED_LIST_ARIA_LABEL) ||
            SELECTED_LIST_ARIA_LABEL
          }
          className={selectedListStyle}
        >
          {selectedItems.map((selectedItem, i) => (
            <li key={`${selectedItem.label}-${selectedItem.value}`}>
              <MultiSelectedItem
                item={selectedItem}
                disabled={disabled}
                onDelete={handleDelete}
                enableEllipsis={selectedItemEllipsis}
                buttonRef={deletionButtonRefs[i]}
                decorators={decorators}
              />
            </li>
          ))}
        </ul>

        <div className={inputWrapperStyle}>
          <input
            {...rest}
            data-smarthr-ui-input="true"
            type="text"
            name={name}
            value={inputValue}
            disabled={disabled}
            required={required && selectedItems.length === 0}
            ref={inputRef}
            onChange={handleChangeInput}
            onFocus={handleFocusInput}
            onCompositionStart={handleCompositionStartInput}
            onCompositionEnd={handleCompositionEndInput}
            onKeyDown={handleInputKeyDown}
            autoComplete={autoComplete ?? 'off'}
            tabIndex={0}
            role="combobox"
            aria-activedescendant={activeOption?.id}
            aria-controls={`${listBoxId} ${selectedListId}`}
            aria-haspopup="listbox"
            aria-expanded={isFocused}
            aria-invalid={error || undefined}
            aria-disabled={disabled}
            aria-autocomplete="list"
            className={inputStyle}
          />
        </div>

        {selectedItems.length === 0 && placeholder && !isFocused && (
          <p className={placeholderStyle}>{placeholder}</p>
        )}
      </div>

      <div className={suffixWrapperStyle}>
        <FaCaretDownIcon color={caretIconColor} className={suffixIconStyle} />
      </div>

      {renderListBox()}
    </div>
  )
}

export const MultiComboBox = genericsForwardRef(ActualMultiComboBox)
