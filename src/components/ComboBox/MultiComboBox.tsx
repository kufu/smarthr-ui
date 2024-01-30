import React, {
  ComponentPropsWithoutRef,
  InputHTMLAttributes,
  KeyboardEvent,
  Ref,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useId } from '../../hooks/useId'
import { useOuterClick } from '../../hooks/useOuterClick'
import { useTheme } from '../../hooks/useTailwindTheme'
import { FaCaretDownIcon } from '../Icon'

import { MultiSelectedItem } from './MultiSelectedItem'
import { hasParentElementByClassName } from './multiComboBoxHelper'
import { BaseProps, ComboBoxItem } from './types'
import { useFocusControl } from './useFocusControl'
import { useListBox } from './useListBox'
import { useOptions } from './useOptions'

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
   * input 要素の属性
   */
  inputAttributes?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | 'name'
    | 'disabled'
    | 'required'
    | 'type'
    | 'aria-activedescendant'
    | 'aria-autocomplete'
    | 'aria-controls'
    | 'aria-disabled'
    | 'aria-expanded'
    | 'aria-haspopup'
    | 'aria-invalid'
    | 'autoComplete'
    | 'className'
    | 'onChange'
    | 'onCompositionEnd'
    | 'onCompositionStart'
    | 'onFocus'
    | 'onKeyDown'
    | 'ref'
    | 'role'
    | 'tabIndex'
    | 'value'
  >
}

type ElementProps = Omit<ComponentPropsWithoutRef<'div'>, keyof Props<unknown>>

const SELECTED_LIST_ARIA_LABEL = '選択済みアイテム'

const multiCombobox = tv({
  slots: {
    wrapper: [
      'smarthr-ui-MultiComboBox',
      'shr-box-border shr-inline-flex shr-min-w-[20em] shr-rounded-m shr-border shr-border-solid shr-bg-white shr-px-0.5 shr-py-0.25',
      'contrast-more:shr-border-high-contrast',
    ],
    inputArea: 'shr-flex shr-flex-1 shr-flex-wrap shr-gap-0.5 shr-overflow-y-auto',
    selectedList:
      'smarthr-ui-MultiComboBox-selectedList shr-contents shr-list-none [&_li]:shr-min-w-0',
    inputWrapper: 'shr-flex shr-flex-1 shr-items-center',
    input: [
      'smarthr-ui-MultiComboBox-input',
      'shr-w-full shr-min-w-[5em] shr-border-none shr-text-base shr-text-black shr-outline-none',
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
    error: {
      true: {
        wrapper: 'shr-border-danger',
      },
    },
    disabled: {
      true: {
        wrapper:
          'shr-cursor-not-allowed shr-border-default/50 shr-bg-white-darken shr-text-disabled',
      },
      false: {
        wrapper: 'shr-cursor-text',
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
      error: false,
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
    dropdownHelpMessage,
    isLoading,
    selectedItemEllipsis,
    width = 'auto',
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
    inputAttributes,
    style,
    ...props
  }: Props<T> & ElementProps,
  ref: Ref<HTMLInputElement>,
) => {
  const { textColor } = useTheme()
  const outerRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
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
  })
  const handleDelete = useCallback(
    (item: ComboBoxItem<T>) => {
      // HINT: Dropdown系コンポーネント内でComboBoxを使うと、選択肢がportalで表現されている関係上Dropdownが閉じてしまう
      // requestAnimationFrameを追加、処理を遅延させることで正常に閉じる/閉じないの判定を行えるようにする
      requestAnimationFrame(() => {
        onDelete && onDelete(item)
        onChangeSelected &&
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
          onSelect && onSelect(selected)
          onChangeSelected && onChangeSelected(selectedItems.concat(selected))
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
    onFocus && onFocus()
    setIsFocused(true)
  }, [onFocus])
  const blur = useCallback(() => {
    if (!isFocused) return
    onBlur && onBlur()
    setIsFocused(false)
    resetDeletionButtonFocus()
  }, [isFocused, onBlur, resetDeletionButtonFocus])

  const caretIconColor = useMemo(() => {
    if (isFocused) return textColor.black
    if (disabled) return textColor.disabled
    return textColor.grey
  }, [disabled, isFocused, textColor.black, textColor.disabled, textColor.grey])

  useOuterClick([outerRef, listBoxRef], blur)

  useEffect(() => {
    if (!isInputControlled) {
      setUncontrolledInputValue('')
    }

    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef, isFocused, isInputControlled, selectedItems])

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
      if (!isInputControlled) {
        setUncontrolledInputValue(e.currentTarget.value)
      }
    },
    [isInputControlled, onChangeInput, onChange],
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
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      e.key === 'Enter' && e.preventDefault()
      onKeyPress && onKeyPress(e)
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
    inputWrapperStlye,
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
        className: wrapper({ focused: isFocused, error, disabled, className }),
      },
      inputAreaStyle: inputArea(),
      selectedListStyle: selectedList(),
      inputWrapperStlye: inputWrapper({ hidden: !isFocused }),
      inputStyle: input(),
      placeholderStyle: placeholderEl(),
      suffixWrapperStyle: suffixWrapper({ disabled }),
      suffixIconStyle: suffixIcon(),
    }
  }, [
    className,
    disabled,
    error,
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
      {...props}
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

        <div className={inputWrapperStlye}>
          <input
            {...inputAttributes}
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
            autoComplete="off"
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

// forwardRef したコンポーネントでジェネリクスを使うときのワークアラウンド
// https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref/58473012
export const MultiComboBox = forwardRef(ActualMultiComboBox) as (<T>(
  props: ComponentPropsWithoutRef<typeof ActualMultiComboBox<T>> & {
    ref?: Ref<HTMLInputElement>
  },
) => ReturnType<typeof ActualMultiComboBox<T>>) & {
  displayName: string
}
