'use client'

import {
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
  type RefObject,
  memo,
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
import { useLatest } from '../../../hooks/useLatest'
import { useTheme } from '../../../hooks/useTheme'
import { useIntl } from '../../../intl'
import { genericsForwardRef } from '../../../libs/util'
import { UnstyledButton } from '../../Button'
import { FaCaretDownIcon, FaCircleXmarkIcon } from '../../Icon'
import { Input } from '../../Input'
import { ListBox, useListbox } from '../useListbox'
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
  /**
   * 検索結果が0件の時に表示するコンテンツ
   */
  noResultText?: ReactNode
}
type Props<T> = AbstractProps<T> &
  Omit<ComponentPropsWithoutRef<'input'>, keyof AbstractProps<unknown>>

const NOOP = () => undefined

const ESCAPE_KEY_REGEX = /^Esc(ape)?$/
const ARROW_UP_DOWN_REGEX = /^(Arrow)?(Up|Down)$/

const EMPTY_INPUT_CHANGE_EVENT = {
  currentTarget: { value: '' },
  target: { value: '' },
} as ChangeEvent<HTMLInputElement>

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

type SuffixButtonsProps = {
  onClickClear: (e: MouseEvent) => void
  clearButtonRef: RefObject<HTMLButtonElement>
  onClickIcon: (e: MouseEvent) => void
  caretIconColor: string
  destroyButtonIconAlt: string
  classNames: {
    clearButton: string
    clearButtonIcon: string
    caretDownLayout: string
    caretDownIcon: string
  }
}

const SuffixButtons = memo<SuffixButtonsProps>(
  ({
    onClickClear,
    clearButtonRef,
    onClickIcon: onDelegateClickIcon,
    caretIconColor,
    destroyButtonIconAlt,
    classNames,
  }) => (
    <>
      <UnstyledButton
        onClick={onClickClear}
        ref={clearButtonRef}
        className={classNames.clearButton}
      >
        <FaCircleXmarkIcon
          color="TEXT_BLACK"
          alt={destroyButtonIconAlt}
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
  ),
)

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
    noResultText,
    style,
    ...rest
  }: Props<T>,
  ref: Ref<HTMLInputElement>,
) => {
  const theme = useTheme()
  const { localize } = useIntl()
  const outerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const clearButtonRef = useRef<HTMLButtonElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const latest = useLatest({
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
    defaultItem,
    selectedItem,
    isFocused,
    isExpanded,
    isComposing,
    isEditing,
  })

  useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(ref, () => inputRef.current)

  const { options } = useSingleOptions({
    items,
    selected: selectedItem,
    creatable,
    inputValue,
    isFilteringDisabled: !isEditing,
  })

  const { listBoxProps, activeOption, handleKeyDownListBox, listBoxId, listBoxRef } = useListbox<T>(
    {
      options,
      dropdownHelpMessage,
      dropdownWidth,
      onAdd,
      onSelect: useCallback(
        (selected: ComboboxItem<T>) => {
          latest.onSelect?.(selected)
          latest.onChangeSelected?.(selected)

          // HINT: Dropdown系コンポーネント内でComboboxを使うと、選択肢がportalで表現されている関係上Dropdownが閉じてしまう
          // requestAnimationFrameを追加、処理を遅延させることで正常に閉じる/閉じないの判定を行えるようにする
          requestAnimationFrame(() => {
            setIsExpanded(false)
            // HINT:
            // - 制御コンポーネントの場合に親側でinputValueを更新できるように、選択時にonChangeInputを空文字で発火する
            // - 対応するdropdownを閉じて以降にonChangeInputを発火する必要がある
            //   - 先にclearしてしまうと意図せずこの要素のドロップダウンを閉じる前に他要素の再レンダリングを引き起こす可能性がある
            //   - 例えばFilterDropdownなどで当comboboxを使っている場合、レイアウト上comboboxのdropdown以下の要素がクリックされた扱いになってしまい
            //     FilterDropdownを意図せず閉じてしまうなどの挙動のバグを引き起こす可能性がある
            latest.onChangeInput?.(EMPTY_INPUT_CHANGE_EVENT)
          })

          setIsEditing(false)
        },
        [latest],
      ),
      isExpanded,
      isLoading,
      triggerRef: outerRef,
      noResultText,
    },
  )

  const selectDefaultItem = useCallback(() => {
    if (latest.onSelect && latest.defaultItem) {
      latest.onSelect(latest.defaultItem)
    }
  }, [latest])

  const focus = useCallback(() => {
    latest.onFocus?.()
    inputRef.current?.focus()
    setIsFocused(true)

    if (!latest.isFocused) {
      setIsExpanded(true)
    }
  }, [latest])
  const unfocus = useCallback(() => {
    if (!latest.isFocused) return

    latest.onBlur?.()

    setIsFocused(false)
    setIsExpanded(false)
    setIsEditing(false)

    if (latest.selectedItem) {
      setInputValue(innerText(latest.selectedItem.label))
    } else {
      selectDefaultItem()
    }
  }, [selectDefaultItem, latest])
  const onClickClear = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()

      let isExecutedPreventDefault = false

      latest.onClearClick?.({
        ...e,
        preventDefault: () => {
          e.preventDefault()
          isExecutedPreventDefault = true
        },
      })

      if (!isExecutedPreventDefault) {
        latest.onClear?.()
        latest.onChangeSelected?.(null)

        inputRef.current?.focus()

        setIsFocused(true)
        setIsExpanded(true)
      }
    },
    [latest],
  )
  const onClickInput = useCallback(
    (e: MouseEvent) => {
      if (disabled || readOnly) {
        e.stopPropagation()

        return
      }

      inputRef.current?.focus()

      if (!latest.isExpanded) {
        setIsExpanded(true)
      }
    },
    [disabled, readOnly, latest],
  )
  const actualOnChangeInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      latest.onChange?.(e)
      latest.onChangeInput?.(e)

      if (!latest.isEditing) setIsEditing(true)

      const { value } = e.currentTarget

      setInputValue(value)

      if (value === '') {
        latest.onClear?.()
        latest.onChangeSelected?.(null)
      }
    },
    [latest],
  )
  const onCompositionStart = useCallback(() => setIsComposing(true), [])
  const onCompositionEnd = useCallback(() => setIsComposing(false), [])
  const onKeyDownInput = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (latest.isComposing) {
        return
      }

      if (ESCAPE_KEY_REGEX.test(e.key)) {
        if (latest.isExpanded) {
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

        if (!latest.isExpanded) {
          setIsExpanded(true)
        }
      }
      handleKeyDownListBox(e)
    },
    [unfocus, handleKeyDownListBox, latest],
  )

  // HINT: form内にcomboboxを設置 & 検索inputにfocusした状態で
  // アイテムをキーボードで選択し、Enterを押すとinput上でEnterを押したことになるため、
  // submitイベントが発生し、formが送信される場合がある
  const handleKeyPress = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') e.preventDefault()

      latest.onKeyPress?.(e)
    },
    [latest],
  )

  const caretIconColor = isFocused
    ? theme.textColor.black
    : disabled || readOnly
      ? theme.textColor.disabled
      : theme.textColor.grey

  useClick(
    useMemo(() => [outerRef, listBoxRef, clearButtonRef], [listBoxRef]),
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

  const hasSelectedItem = selectedItem !== null

  const classNames = useMemo(() => {
    const { wrapper, input, caretDownLayout, caretDownIcon, clearButton, clearButtonIcon } =
      classNameGenerator()

    return {
      wrapper: wrapper({ disabled, className }),
      input: input(),
      caretDownLayout: caretDownLayout(),
      caretDownIcon: caretDownIcon(),
      clearButton: clearButton({
        hidden: !hasSelectedItem || disabled || readOnly,
      }),
      clearButtonIcon: clearButtonIcon(),
    }
  }, [hasSelectedItem, disabled, readOnly, className])

  const destroyButtonIconAlt = useMemo(
    () =>
      localize({
        id: 'smarthr-ui/SingleCombobox/destroyButtonIconAlt',
        defaultText: 'クリア',
      }),
    [localize],
  )

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
          <SuffixButtons
            onClickClear={onClickClear}
            clearButtonRef={clearButtonRef}
            onClickIcon={onClickInput}
            caretIconColor={caretIconColor}
            destroyButtonIconAlt={destroyButtonIconAlt}
            classNames={{
              clearButton: classNames.clearButton,
              clearButtonIcon: classNames.clearButtonIcon,
              caretDownLayout: classNames.caretDownLayout,
              caretDownIcon: classNames.caretDownIcon,
            }}
          />
        }
        className={classNames.input}
        data-smarthr-ui-input="true"
      />
      {!readOnly && <ListBox {...listBoxProps} />}
    </div>
  )
}

export const SingleCombobox = genericsForwardRef(ActualSingleCombobox)
