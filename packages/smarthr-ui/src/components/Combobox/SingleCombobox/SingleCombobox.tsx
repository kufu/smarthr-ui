'use client'

import {
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import innerText from 'react-innertext'
import { tv } from 'tailwind-variants'

import { useClick } from '../../../hooks/useClick'
import { type DecoratorsType, useDecorators } from '../../../hooks/useDecorators'
import { useIntl } from '../../../intl'
import { genericsForwardRef } from '../../../libs/util'
import { textColor } from '../../../themes'
import { UnstyledButton } from '../../Button'
import { FaCaretDownIcon, FaCircleXmarkIcon } from '../../Icon'
import { Input } from '../../Input'
import { useListbox } from '../useListbox'
import { useSingleOptions } from '../useOptions'

import type { ComboboxItem, AbstractProps as ComboboxProps } from '../types'

type AbstractProps<T> = ComboboxProps<T> & {
  /**
   * 選択されているアイテム
   */
  selectedItem: ComboboxItem<T> | null
  /**
   * デフォルトで選択されるアイテム
   */
  defaultItem?: ComboboxItem<T>
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
  onChangeSelected?: (selectedItem: ComboboxItem<T> | null) => void
  /**
   * コンポーネントがフォーカスされたときに発火するコールバック関数
   */
  onFocus?: () => void
  /**
   * コンポーネントからフォーカスが外れた時に発火するコールバック関数
   */
  onBlur?: () => void
  // HINT: useListbox内でnoResultText, loadingTextは実行される
  /**
   * コンポーネント内のテキストを変更する関数/
   */
  decorators?: DecoratorsType<DecoratorKeyTypes | 'noResultText' | 'loadingText'>
}
type Props<T> = AbstractProps<T> &
  Omit<ComponentPropsWithoutRef<'input'>, keyof AbstractProps<unknown>>

type DecoratorKeyTypes = 'destroyButtonIconAlt'

const NOOP = () => undefined

const ESCAPE_KEY_REGEX = /^Esc(ape)?$/
const ARROW_UP_DOWN_REGEX = /^(Arrow)?(Up|Down)$/

const classNameGenerator = tv({
  slots: {
    wrapper: 'smarthr-ui-SingleCombobox shr-inline-block',
    input: 'smarthr-ui-SingleCombobox-input shr-w-full',
    caretDownLayout: [
      'shr-relative -shr-me-0.5 shr-p-0.5',
      'before:shr-border-0',
      'before:shr-absolute before:shr-inset-x-0 before:shr-inset-y-0.25 before:shr-w-0 before:shr-border-l before:shr-border-solid before:shr-border-default before:shr-content-[""]',
    ],
    caretDownIcon: 'shr-block',
    clearButton: [
      'smarthr-ui-SingleCombobox-clearButton',
      'shr-group/clearButton',
      'shr-me-0.5',
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

const ActualSingleCombobox = <T,>(
  {
    items,
    selectedItem,
    defaultItem,
    name,
    disabled,
    readOnly,
    required,
    prefix,
    error,
    creatable,
    placeholder,
    autoComplete,
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
    style,
    ...rest
  }: Props<T>,
  ref: Ref<HTMLInputElement>,
) => {
  const { localize } = useIntl()
  const outerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const clearButtonRef = useRef<HTMLButtonElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(ref, () => inputRef.current)

  const { options } = useSingleOptions({
    items,
    selected: selectedItem,
    creatable,
    inputValue,
    isFilteringDisabled: !isEditing,
  })

  const { renderListBox, activeOption, onKeyDownListBox, listBoxId, listBoxRef } = useListbox<T>({
    options,
    dropdownHelpMessage,
    dropdownWidth,
    onAdd,
    onSelect: useCallback(
      (selected: ComboboxItem<T>) => {
        onSelect?.(selected)
        onChangeSelected?.(selected)

        // HINT: Dropdown系コンポーネント内でComboboxを使うと、選択肢がportalで表現されている関係上Dropdownが閉じてしまう
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

  const selectDefaultItem = useMemo(
    () => (onSelect && defaultItem ? () => onSelect(defaultItem) : NOOP),
    [onSelect, defaultItem],
  )

  const focus = useCallback(() => {
    onFocus?.()
    inputRef.current?.focus()
    setIsFocused(true)

    if (!isFocused) {
      setIsExpanded(true)
    }
  }, [onFocus, isFocused])
  const unfocus = useCallback(() => {
    if (!isFocused) return

    onBlur?.()

    setIsFocused(false)
    setIsExpanded(false)
    setIsEditing(false)

    if (selectedItem) {
      setInputValue(innerText(selectedItem.label))
    } else {
      selectDefaultItem()
    }
  }, [isFocused, onBlur, selectedItem, selectDefaultItem])
  const onClickClear = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()

      let isExecutedPreventDefault = false

      onClearClick?.({
        ...e,
        preventDefault: () => {
          e.preventDefault()
          isExecutedPreventDefault = true
        },
      })

      if (!isExecutedPreventDefault) {
        onClear?.()
        onChangeSelected?.(null)

        inputRef.current?.focus()

        setIsFocused(true)
        setIsExpanded(true)
      }
    },
    [onClearClick, onClear, onChangeSelected],
  )
  const onClickInput = useCallback(
    (e: MouseEvent) => {
      if (disabled || readOnly) {
        e.stopPropagation()

        return
      }

      inputRef.current?.focus()

      if (!isExpanded) {
        setIsExpanded(true)
      }
    },
    [disabled, readOnly, inputRef, isExpanded],
  )
  const onDelegateClickIcon = onClickInput
  const actualOnChangeInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e)
      onChangeInput?.(e)

      if (!isEditing) setIsEditing(true)

      const { value } = e.currentTarget

      setInputValue(value)

      if (value === '') {
        onClear?.()
        onChangeSelected?.(null)
      }
    },
    [isEditing, onChange, onChangeInput, onClear, onChangeSelected],
  )
  const onCompositionStart = useCallback(() => setIsComposing(true), [])
  const onCompositionEnd = useCallback(() => setIsComposing(false), [])
  const onKeyDownInput = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (isComposing) {
        return
      }

      if (ESCAPE_KEY_REGEX.test(e.key)) {
        if (isExpanded) {
          e.stopPropagation()
          setIsExpanded(false)
        }
      } else if (e.key === 'Tab') {
        unfocus()
      } else {
        if (ARROW_UP_DOWN_REGEX.test(e.key)) {
          e.preventDefault()
        }

        inputRef.current?.focus()

        if (!isExpanded) {
          setIsExpanded(true)
        }
      }
      onKeyDownListBox(e)
    },
    [isComposing, isExpanded, unfocus, onKeyDownListBox],
  )

  // HINT: form内にcomboboxを設置 & 検索inputにfocusした状態で
  // アイテムをキーボードで選択し、Enterを押すとinput上でEnterを押したことになるため、
  // submitイベントが発生し、formが送信される場合がある
  const handleKeyPress = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') e.preventDefault()

      onKeyPress?.(e)
    },
    [onKeyPress],
  )

  const caretIconColor = useMemo(() => {
    if (isFocused) return textColor.black
    if (disabled || readOnly) return textColor.disabled

    return textColor.grey
  }, [disabled, readOnly, isFocused])

  useClick(
    useMemo(() => [outerRef, listBoxRef, clearButtonRef], [outerRef, listBoxRef, clearButtonRef]),
    isFocused || selectedItem ? NOOP : selectDefaultItem,
    unfocus,
  )

  // selectedItem.label はプリミティブ値でないデータ型の可能性があり、そのまま useEffect の依存配列に入れると意図せぬエフェクトの実行を引き起こしてしまう可能性があるので、プリミティブ値である string 型に変換したものを依存配列に入れています。
  const selectedItemLabelText = innerText(selectedItem?.label)
  useEffect(() => {
    setInputValue(selectedItemLabelText)
  }, [selectedItemLabelText])

  const wrapperStyle = useMemo(
    () => ({
      ...style,
      width: typeof width === 'number' ? `${width}px` : width,
    }),
    [style, width],
  )

  const notSelected = selectedItem === null

  const classNames = useMemo(() => {
    const { wrapper, input, caretDownLayout, caretDownIcon, clearButton, clearButtonIcon } =
      classNameGenerator()

    return {
      wrapper: wrapper({ disabled, className }),
      input: input(),
      caretDownLayout: caretDownLayout(),
      caretDownIcon: caretDownIcon(),
      clearButton: clearButton({ hidden: notSelected || disabled || readOnly }),
      clearButtonIcon: clearButtonIcon(),
    }
  }, [notSelected, disabled, readOnly, className])

  const decoratorDefaultTexts = useMemo(
    () => ({
      destroyButtonIconAlt: localize({
        id: 'smarthr-ui/SingleCombobox/destroyButtonIconAlt',
        defaultText: 'クリア',
      }),
    }),
    [localize],
  )

  const decorated = useDecorators<DecoratorKeyTypes>(decoratorDefaultTexts, decorators)

  return (
    <div role="group" className={classNames.wrapper} style={wrapperStyle} ref={outerRef}>
      <Input
        {...rest}
        ref={inputRef}
        type="text"
        role="combobox"
        name={name}
        value={inputValue}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        autoComplete={autoComplete ?? 'off'}
        aria-haspopup="listbox"
        aria-controls={listBoxId}
        aria-expanded={isFocused}
        aria-activedescendant={activeOption?.id}
        aria-autocomplete="list"
        /* eslint-disable-next-line smarthr/a11y-prohibit-input-placeholder */
        placeholder={placeholder}
        onClick={onClickInput}
        onChange={actualOnChangeInput}
        onFocus={isFocused ? undefined : focus}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        onKeyDown={onKeyDownInput}
        onKeyPress={handleKeyPress}
        error={error}
        prefix={prefix}
        suffix={
          <>
            <UnstyledButton
              onClick={onClickClear}
              ref={clearButtonRef}
              className={classNames.clearButton}
            >
              <FaCircleXmarkIcon
                color="TEXT_BLACK"
                alt={decorated.destroyButtonIconAlt}
                className={classNames.clearButtonIcon}
              />
            </UnstyledButton>
            <span
              role="presentation"
              onClick={onDelegateClickIcon}
              className={classNames.caretDownLayout}
            >
              <FaCaretDownIcon color={caretIconColor} className={classNames.caretDownIcon} />
            </span>
          </>
        }
        className={classNames.input}
        data-smarthr-ui-input="true"
      />
      {!readOnly && renderListBox()}
    </div>
  )
}

export const SingleCombobox = genericsForwardRef(ActualSingleCombobox)
