'use client'

import {
  type ChangeEvent,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type MouseEvent,
  type Ref,
  memo,
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

import { useOuterClick } from '../../../hooks/useOuterClick'
import { useIntl } from '../../../intl'
import { genericsForwardRef } from '../../../libs/util'
import { textColor } from '../../../themes'
import { FaCaretDownIcon } from '../../Icon'
import { areItemsEqual } from '../helper'
import { useFocusControl } from '../useFocusControl'
import { useListbox } from '../useListbox'
import { useMultiOptions } from '../useOptions'

import { MultiSelectedItem } from './MultiSelectedItem'

import type { DecoratorsType } from '../../../hooks/useDecorators'
import type { ComboboxItem, AbstractProps as ComboboxProps } from '../types'

type AbstractProps<T> = ComboboxProps<T> & {
  /**
   * 選択されているアイテムのリスト
   */
  selectedItems: Array<ComboboxItem<T> & { deletable?: boolean }>
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
  onDelete?: (item: ComboboxItem<T>) => void
  /**
   * 選択されているアイテムのリストが変わった時に発火するコールバック関数
   */
  onChangeSelected?: (selectedItems: Array<ComboboxItem<T>>) => void
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
  decorators?: DecoratorsType<'noResultText'> &
    Exclude<ComponentProps<typeof MultiSelectedItem>['decorators'], undefined> & {
      selectedListAriaLabel?: (text: string) => string
    }
  /**
   * アイテムが選択されたときに選択済みかどうかを判定するコールバック関数/
   */
  isItemSelected?: (targetItem: ComboboxItem<T>, selectedItems: Array<ComboboxItem<T>>) => boolean
}
type Props<T> = AbstractProps<T> &
  Omit<ComponentPropsWithoutRef<'input'>, keyof AbstractProps<unknown>>

const NOOP = () => undefined

const preventDefaultWithPressEnter = (e: KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    e.preventDefault()
  }
}

const ESCAPE_KEY_REGEX = /^Esc(ape)?$/
const ARROW_LEFT_KEY_REGEX = /^(Arrow)?Left$/
const ARROW_RIGHT_KEY_REGEX = /^(Arrow)?Right/
const ARROW_UP_AND_DOWN_KEY_REGEX = /^(Arrow)?(Up|Down)$/

const classNameGenerator = tv({
  slots: {
    wrapper: [
      'smarthr-ui-MultiCombobox',
      'shr-box-border shr-inline-flex shr-min-w-[15em] shr-rounded-m shr-border shr-border-solid shr-px-0.5 shr-py-0.25 shr-align-bottom',
      'contrast-more:shr-border-high-contrast',
      'has-[[aria-invalid]]:shr-border-danger',
    ],
    inputArea: 'shr-flex shr-flex-1 shr-flex-wrap shr-gap-0.5 shr-overflow-y-auto',
    selectedList:
      'smarthr-ui-MultiCombobox-selectedList shr-contents shr-list-none [&_li]:shr-min-w-0',
    inputWrapper: 'shr-flex shr-flex-1 shr-items-center',
    input: [
      'smarthr-ui-MultiCombobox-input',
      'shr-w-full shr-min-w-[5em] shr-border-none shr-text-base shr-text-black shr-outline-none shr-outline-0',
      'disabled:shr-hidden',
    ],
    placeholderEl: 'smarthr-ui-MultiCombobox-placeholder shr-my-0 shr-self-center',
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

const ActualMultiCombobox = <T,>(
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
  }: Props<T>,
  ref: Ref<HTMLInputElement>,
) => {
  const { localize } = useIntl()
  const outerRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [highlighted, setHighlighted] = useState(false)
  const isInputControlled = controlledInputValue !== undefined
  const [uncontrolledInputValue, setUncontrolledInputValue] = useState('')
  const inputValue = isInputControlled ? controlledInputValue : uncontrolledInputValue
  const [isComposing, setIsComposing] = useState(false)
  const { options } = useMultiOptions({
    items,
    selected: selectedItems,
    creatable,
    inputValue,
    isItemSelected,
  })
  const setInputValueIfUncontrolled = isInputControlled ? NOOP : setUncontrolledInputValue
  const actualOnDelete = useMemo(() => {
    const handlers: Array<(item: ComboboxItem<T>) => void> = []

    if (onDelete) {
      handlers.push((item: ComboboxItem<T>) => onDelete(item))
    }
    if (onChangeSelected) {
      handlers.push((item: ComboboxItem<T>) =>
        onChangeSelected(selectedItems.filter((selected) => !areItemsEqual(selected, item))),
      )
    }

    if (handlers.length === 0) {
      return NOOP
    }

    return (item: ComboboxItem<T>) => {
      // HINT: Dropdown系コンポーネント内でComboboxを使うと、選択肢がportalで表現されている関係上Dropdownが閉じてしまう
      // requestAnimationFrameを追加、処理を遅延させることで正常に閉じる/閉じないの判定を行えるようにする
      requestAnimationFrame(() => {
        handlers.forEach((h) => h(item))
      })
    }
  }, [selectedItems, onChangeSelected, onDelete])
  const actualOnSelect = useCallback(
    (selected: ComboboxItem<T>) => {
      // HINT: Dropdown系コンポーネント内でComboboxを使うと、選択肢がportalで表現されている関係上Dropdownが閉じてしまう
      // requestAnimationFrameを追加、処理を遅延させることで正常に閉じる/閉じないの判定を行えるようにする
      requestAnimationFrame(() => {
        const matchedSelectedItem = selectedItems.find((item) => areItemsEqual(item, selected))

        if (matchedSelectedItem === undefined) {
          onSelect?.(selected)
          onChangeSelected?.(selectedItems.concat(selected))
        } else if (matchedSelectedItem.deletable !== false) {
          actualOnDelete(selected)
        }
      })
    },
    [selectedItems, actualOnDelete, onChangeSelected, onSelect],
  )

  const { renderListBox, activeOption, onKeyDownListBox, listBoxId, listBoxRef } = useListbox({
    options,
    dropdownHelpMessage,
    dropdownWidth,
    onAdd,
    onSelect: actualOnSelect,
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

  const focus = useMemo(() => {
    const baseAction = () => {
      setIsFocused(true)
    }

    if (onFocus) {
      return () => {
        onFocus()
        baseAction()
      }
    }

    return baseAction
  }, [onFocus])
  const blur = useMemo(() => {
    if (!isFocused) {
      return NOOP
    }

    const baseAction = () => {
      setIsFocused(false)
      resetDeletionButtonFocus()
    }

    if (onBlur) {
      return () => {
        onBlur()
        baseAction()
      }
    }

    return baseAction
  }, [isFocused, onBlur, resetDeletionButtonFocus])

  const outerClickRef = useMemo(() => [outerRef, listBoxRef], [outerRef, listBoxRef])
  useOuterClick(outerClickRef, blur)

  const highlightedRef = useRef(highlighted)

  useEffect(() => {
    highlightedRef.current = highlighted
  }, [highlighted])

  useEffect(() => {
    if (highlightedRef.current) {
      setHighlighted(false)
      inputRef.current?.select()
    } else {
      setInputValueIfUncontrolled('')
    }
  }, [selectedItems, inputRef, setInputValueIfUncontrolled])

  useEffect(() => {
    if (isFocused) {
      inputRef.current?.focus()
    }
  }, [inputRef, isFocused, setInputValueIfUncontrolled, selectedItems])

  const onDelegateKeyDown = useMemo(
    () =>
      isComposing
        ? undefined
        : (e: KeyboardEvent<HTMLDivElement>) => {
            if (ESCAPE_KEY_REGEX.test(e.key)) {
              e.stopPropagation()
              blur()
            } else if (e.key === 'Tab') {
              if (isFocused) {
                // フォーカスがコンポーネントを抜けるように先に input をフォーカスしておく
                inputRef.current?.focus()
              }

              blur()
            } else if (ARROW_LEFT_KEY_REGEX.test(e.key)) {
              e.stopPropagation()
              focusPrevDeletionButton()
            } else if (ARROW_RIGHT_KEY_REGEX.test(e.key)) {
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

              actualOnDelete(lastItem)
              setHighlighted(true)
              setInputValueIfUncontrolled(innerText(lastItem.label))
            } else {
              e.stopPropagation()
              inputRef.current?.focus()
              resetDeletionButtonFocus()
            }

            onKeyDownListBox(e)
          },
    [
      blur,
      focusNextDeletionButton,
      focusPrevDeletionButton,
      onKeyDownListBox,
      inputRef,
      isComposing,
      isFocused,
      resetDeletionButtonFocus,
      actualOnDelete,
      inputValue,
      selectedItems,
      setInputValueIfUncontrolled,
    ],
  )

  const onDelegateClick = useMemo(
    () =>
      disabled || isFocused
        ? undefined
        : (e: MouseEvent<HTMLElement>) => {
            if (!(e.target as HTMLElement).closest('.smarthr-ui-MultiCombobox-deleteButton')) {
              focus()
            }
          },
    [isFocused, disabled, focus],
  )
  const actualOnChangeInput = useMemo(() => {
    const handlers = [onChange, onChangeInput].filter((h) => !!h)
    const onSetValue = (e: ChangeEvent<HTMLInputElement>) => {
      setInputValueIfUncontrolled(e.currentTarget.value)
    }

    if (handlers.length === 0) {
      return onSetValue
    }

    return (e: ChangeEvent<HTMLInputElement>) => {
      handlers.forEach((h) => h(e))
      onSetValue(e)
    }
  }, [onChange, onChangeInput, setInputValueIfUncontrolled])
  const onFocusInput = useMemo(
    () =>
      isFocused
        ? resetDeletionButtonFocus
        : () => {
            resetDeletionButtonFocus()
            focus()
          },
    [isFocused, focus, resetDeletionButtonFocus],
  )
  const onCompositionStartInput = useCallback(() => setIsComposing(true), [])
  const onCompositionEndInput = useCallback(() => setIsComposing(false), [])
  const onKeyDownInput = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (ARROW_UP_AND_DOWN_KEY_REGEX.test(e.key)) {
      // 上下キー入力はリストボックスの activeDescendant の移動に用いるため、input 内では作用させない
      e.preventDefault()
    }
  }, [])

  // HINT: form内にcomboboxを設置 & 検索inputにfocusした状態で
  // アイテムをキーボードで選択し、Enterを押すとinput上でEnterを押したことになるため、
  // submitイベントが発生し、formが送信される場合がある
  const onDelegateKeyPress = useMemo(
    () =>
      onKeyPress
        ? (e: KeyboardEvent<HTMLInputElement>) => {
            preventDefaultWithPressEnter(e)
            onKeyPress(e)
          }
        : preventDefaultWithPressEnter,
    [onKeyPress],
  )

  const selectedListId = useId()

  const wrapperStyle = useMemo(
    () => ({
      ...style,
      width: typeof width === 'number' ? `${width}px` : width,
    }),
    [style, width],
  )
  const classNames = useMemo(() => {
    const {
      wrapper,
      inputArea,
      selectedList,
      inputWrapper,
      input,
      placeholderEl,
      suffixWrapper,
      suffixIcon,
    } = classNameGenerator()

    return {
      wrapper: wrapper({ focused: isFocused, disabled, className }),
      inputArea: inputArea(),
      selectedList: selectedList(),
      inputWrapper: inputWrapper({ hidden: !isFocused }),
      input: input(),
      placeholder: placeholderEl(),
      suffixWrapper: suffixWrapper({ disabled }),
      suffixIcon: suffixIcon(),
    }
  }, [isFocused, disabled, className])

  const decoratorDefaultTexts = useMemo(
    () => ({
      selectedListAriaLabel: localize({
        id: 'smarthr-ui/MultiCombobox/selectedListAriaLabel',
        defaultText: '選択済みアイテム',
      }),
    }),
    [localize],
  )

  const decoratedAriaLabel = useMemo(
    () =>
      decorators?.selectedListAriaLabel?.(decoratorDefaultTexts.selectedListAriaLabel) ||
      decoratorDefaultTexts.selectedListAriaLabel,
    [decorators, decoratorDefaultTexts],
  )

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      ref={outerRef}
      role="group"
      onClick={onDelegateClick}
      onKeyDown={onDelegateKeyDown}
      onKeyPress={onDelegateKeyPress}
      className={classNames.wrapper}
      style={wrapperStyle}
    >
      <div className={classNames.inputArea}>
        <ul id={selectedListId} aria-label={decoratedAriaLabel} className={classNames.selectedList}>
          {selectedItems.map((selectedItem, i) => (
            <li key={`${selectedItem.label}-${innerText(selectedItem.value)}`}>
              <MultiSelectedItem
                item={selectedItem}
                disabled={disabled}
                onDelete={actualOnDelete}
                enableEllipsis={selectedItemEllipsis}
                buttonRef={deletionButtonRefs[i]}
                decorators={decorators}
              />
            </li>
          ))}
        </ul>

        <div className={classNames.inputWrapper}>
          <input
            {...rest}
            data-smarthr-ui-input="true"
            type="text"
            name={name}
            value={inputValue}
            disabled={disabled}
            required={required && selectedItems.length === 0}
            ref={inputRef}
            onChange={actualOnChangeInput}
            onFocus={onFocusInput}
            onCompositionStart={onCompositionStartInput}
            onCompositionEnd={onCompositionEndInput}
            onKeyDown={onKeyDownInput}
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
            className={classNames.input}
          />
        </div>

        {selectedItems.length === 0 && placeholder && !isFocused && (
          <p className={classNames.placeholder}>{placeholder}</p>
        )}
      </div>

      <MemoizedCaretDown
        disabled={disabled}
        isFocused={isFocused}
        className={classNames.suffixWrapper}
        iconStyle={classNames.suffixIcon}
      />

      {renderListBox()}
    </div>
  )
}

export const MultiCombobox = genericsForwardRef(ActualMultiCombobox)

const MemoizedCaretDown = memo<{
  className: string
  iconStyle: string
  disabled: boolean
  isFocused: boolean
}>(({ className, iconStyle, disabled, isFocused }) => {
  const caretIconColor = useMemo(() => {
    if (isFocused) return textColor.black
    if (disabled) return textColor.disabled

    return textColor.grey
  }, [disabled, isFocused])

  return (
    <div className={className}>
      <FaCaretDownIcon color={caretIconColor} className={iconStyle} />
    </div>
  )
})
