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
  useMemo,
  useRef,
  useState,
} from 'react'
import innerText from 'react-innertext'
import { tv } from 'tailwind-variants'

import { useAnimationFrame } from '../../../hooks/useAnimationFrame'
import { useAreaOutsideClick } from '../../../hooks/useAreaOutsideClick'
import { useLatest } from '../../../hooks/useLatest'
import { useMergeRefs } from '../../../hooks/useMergeRefs'
import { useTheme } from '../../../hooks/useTheme'
import { Localizer } from '../../../intl'
import { genericsForwardRef } from '../../../libs/util'
import { UnstyledButton } from '../../Button'
import { FaCaretDownIcon, FaCircleXmarkIcon } from '../../Icon'
import { Input } from '../../Input'
import { ListBox, useListbox } from '../useListbox'
import { useSingleOptions } from '../useOptions'

import type { ComboboxItem, BaseProps as ComboboxProps } from '../types'

type BaseProps<T> = ComboboxProps<T> & {
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
type Props<T> = BaseProps<T> & Omit<ComponentPropsWithoutRef<'input'>, keyof BaseProps<unknown>>

const ESCAPE_KEY_REGEX = /^Esc(ape)?$/
const ARROW_UP_DOWN_REGEX = /^(Arrow)?(Up|Down)$/

const EMPTY_INPUT_CHANGE_EVENT = {
  currentTarget: { value: '' },
  target: { value: '' },
} as ChangeEvent<HTMLInputElement>

const classNameGenerator = tv({
  slots: {
    wrapper:
      'smarthr-ui-SingleCombobox shr-inline-block [&:has(.smarthr-ui-Input-input:disabled)]:shr-cursor-not-allowed',
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
      '[[data-clear-button-hidden=true]_&]:shr-hidden',
    ],
    clearButtonIcon: [
      'shr-block',
      'group-focus-visible/clearButton:shr-focus-indicator group-focus-visible/clearButton:shr-rounded-full',
    ],
  },
})

type SuffixButtonsProps = {
  clearButtonRef: RefObject<HTMLButtonElement>
  caretIconColor: string
  handleClickClear: (e: MouseEvent) => void
  handleClickIcon: (e: MouseEvent) => void
  classNames: {
    clearButton: string
    clearButtonIcon: string
    caretDownLayout: string
    caretDownIcon: string
  }
}

const SuffixButtons = memo<SuffixButtonsProps>(
  ({
    clearButtonRef,
    caretIconColor,
    handleClickClear,
    handleClickIcon: handleDelegateClickIcon,
    classNames,
  }) => (
    <>
      <UnstyledButton
        onClick={handleClickClear}
        ref={clearButtonRef}
        className={classNames.clearButton}
      >
        <FaCircleXmarkIcon
          color="TEXT_BLACK"
          alt={
            <Localizer id="smarthr-ui/SingleCombobox/destroyButtonIconAlt" defaultText="クリア" />
          }
          className={classNames.clearButtonIcon}
        />
      </UnstyledButton>
      <span
        role="presentation"
        onClick={handleDelegateClickIcon}
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
  const triggerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const clearButtonRef = useRef<HTMLButtonElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const { options } = useSingleOptions({
    items,
    selected: selectedItem,
    creatable,
    inputValue,
    isFilteringDisabled: !isEditing,
  })

  const selectFrame = useAnimationFrame()

  const { listBoxProps, activeOption, handleKeyDownListBox, listBoxId, listBoxRef } = useListbox<T>(
    {
      options,
      dropdownHelpMessage,
      dropdownWidth,
      onAdd,
      // HINT: memo化していないが、内部でuseLatestでstableにしているため最適化としてそのまま渡している
      onSelect: (selected: ComboboxItem<T>) => {
        onSelect?.(selected)
        onChangeSelected?.(selected)

        // HINT: Dropdown系コンポーネント内でComboboxを使うと、選択肢がportalで表現されている関係上Dropdownが閉じてしまう
        // 処理を遅延させることで正常に閉じる/閉じないの判定を行えるようにする
        selectFrame.request(() => {
          setIsExpanded(false)
          // HINT:
          // - 制御コンポーネントの場合に親側でinputValueを更新できるように、選択時にonChangeInputを空文字で発火する
          // - 対応するdropdownを閉じて以降にonChangeInputを発火する必要がある
          //   - 先にclearしてしまうと意図せずこの要素のドロップダウンを閉じる前に他要素の再レンダリングを引き起こす可能性がある
          //   - 例えばFilterDropdownなどで当comboboxを使っている場合、レイアウト上comboboxのdropdown以下の要素がクリックされた扱いになってしまい
          //     FilterDropdownを意図せず閉じてしまうなどの挙動のバグを引き起こす可能性がある
          onChangeInput?.(EMPTY_INPUT_CHANGE_EVENT)
        })

        setIsEditing(false)
      },
      isExpanded,
      isLoading,
      triggerRef,
      noResultText,
    },
  )

  const latest = useLatest({
    onChange,
    onChangeInput,
    onSelect,
    onClear,
    onClearClick,
    onChangeSelected,
    onFocus,
    onBlur,
    onKeyPress,
    handleKeyDownListBox,
    defaultItem,
    selectedItem,
    isFocused,
    isExpanded,
    isComposing,
    isEditing,
    disabled,
    readOnly,
  })

  const functions = useMemo(() => {
    const selectDefaultItem = () => {
      if (latest.onSelect && latest.defaultItem) {
        latest.onSelect(latest.defaultItem)
      }
    }
    const unfocus = () => {
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
    }

    return {
      selectDefaultItem,
      unfocus,
      handleFocus: () => {
        latest.onFocus?.()
        inputRef.current?.focus()
        setIsFocused(true)

        if (!latest.isFocused) {
          setIsExpanded(true)
        }
      },
      handleClickClear: (e: MouseEvent) => {
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
      handleClickInput: (e: MouseEvent) => {
        if (latest.disabled || latest.readOnly) {
          e.stopPropagation()

          return
        }

        inputRef.current?.focus()

        if (!latest.isExpanded) {
          setIsExpanded(true)
        }
      },
      handleChangeInput: (e: ChangeEvent<HTMLInputElement>) => {
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
      handleCompositionStart: () => setIsComposing(true),
      handleCompositionEnd: () => setIsComposing(false),
      // HINT: form内にcomboboxを設置 & 検索inputにfocusした状態で
      // アイテムをキーボードで選択し、Enterを押すとinput上でEnterを押したことになるため、
      // submitイベントが発生し、formが送信される場合がある
      handleKeyPress: (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') e.preventDefault()

        latest.onKeyPress?.(e)
      },
      handleKeyDownInput: (e: KeyboardEvent<HTMLInputElement>) => {
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

        latest.handleKeyDownListBox(e)
      },
    }
  }, [latest])

  const caretIconColor = isFocused
    ? theme.textColor.black
    : disabled || readOnly
      ? theme.textColor.disabled
      : theme.textColor.grey

  useAreaOutsideClick(
    isFocused ? [triggerRef, listBoxRef, clearButtonRef] : null,
    functions.unfocus,
    isFocused || selectedItem ? undefined : functions.selectDefaultItem,
  )

  // HINT: useMergeRefsはv18でもcallbackRefのcleanup関数に対応している
  // もしuseMergeRefsをなくす場合、react v18対応が不要になっているかどうか確認する
  const cleanupCallbackRef = useCallback(() => selectFrame.cancel, [selectFrame.cancel])

  const mergedRef = useMergeRefs(inputRef, cleanupCallbackRef, ref)

  // selectedItem.label はプリミティブ値でないデータ型の可能性があり、そのまま useEffect の依存配列に入れると意図せぬエフェクトの実行を引き起こしてしまう可能性があるので、プリミティブ値である string 型に変換したものを依存配列に入れています。
  const selectedItemLabelText = innerText(selectedItem?.label)
  useEffect(() => {
    setInputValue(selectedItemLabelText)
  }, [selectedItemLabelText])

  const classNames = useMemo(() => {
    const { wrapper, input, caretDownLayout, caretDownIcon, clearButton, clearButtonIcon } =
      classNameGenerator()

    return {
      wrapper: wrapper({ className }),
      input: input(),
      caretDownLayout: caretDownLayout(),
      caretDownIcon: caretDownIcon(),
      clearButton: clearButton(),
      clearButtonIcon: clearButtonIcon(),
    }
  }, [className])

  return (
    <div
      ref={triggerRef}
      role="group"
      className={classNames.wrapper}
      style={{
        ...style,
        width: typeof width === 'number' ? `${width}px` : width,
      }}
      data-clear-button-hidden={(selectedItem === null || disabled || readOnly || false).toString()}
    >
      <Input
        {...rest}
        ref={mergedRef}
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
        onClick={functions.handleClickInput}
        onChange={functions.handleChangeInput}
        onFocus={isFocused ? undefined : functions.handleFocus}
        onCompositionStart={functions.handleCompositionStart}
        onCompositionEnd={functions.handleCompositionEnd}
        onKeyDown={functions.handleKeyDownInput}
        onKeyPress={functions.handleKeyPress}
        error={error}
        prefix={prefix}
        suffix={
          <SuffixButtons
            clearButtonRef={clearButtonRef}
            caretIconColor={caretIconColor}
            handleClickClear={functions.handleClickClear}
            handleClickIcon={functions.handleClickInput}
            classNames={classNames}
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
