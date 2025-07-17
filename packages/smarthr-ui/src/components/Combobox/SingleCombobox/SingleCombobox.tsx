'use client'

import {
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type FocusEventHandler,
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

import { type DecoratorsType, useDecorators } from '../../../hooks/useDecorators'
import { useOuterClick } from '../../../hooks/useOuterClick'
import { useIntl } from '../../../intl'
import { genericsForwardRef } from '../../../libs/util'
import { textColor } from '../../../themes'
import { UnstyledButton } from '../../Button'
import { FaCaretDownIcon, FaCircleXmarkIcon } from '../../Icon'
import { Input } from '../../Input'
import { useListbox } from '../useListbox'
import { useSingleOptions } from '../useOptions'

import type { BaseProps, ComboboxItem } from '../types'

type Props<T> = BaseProps<T> & {
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

type ElementProps = Omit<ComponentPropsWithoutRef<'input'>, keyof Props<unknown>>

type DecoratorKeyTypes = 'destroyButtonIconAlt'

const NOOP = () => undefined

const classNameGenerator = tv({
  slots: {
    wrapper: ['smarthr-ui-SingleCombobox shr-inline-block'],
    input: [
      'smarthr-ui-SingleCombobox-input shr-w-full',
      'has-[.smarthr-ui-SingleCombobox-clearButton:focus-visible]:shr-shadow-none',
    ],
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
  }: Props<T> & ElementProps,
  ref: Ref<HTMLInputElement>,
) => {
  const { localize } = useIntl()
  const outerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const clearButtonRef = useRef<HTMLButtonElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [inputValue, setInputValue] = useState('')

  useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(ref, () => inputRef.current)

  const [searchValue, setSearchValue] = useState('')

  const { options } = useSingleOptions({
    items,
    selected: selectedItem,
    creatable,
    inputValue: searchValue,
  })

  const { renderListBox, activeOption, listBoxId, listBoxRef, searchInputRef } = useListbox<T>({
    options,
    dropdownWidth,
    onAdd,
    onSelect: useCallback(
      (selected: ComboboxItem<T>) => {
        onSelect?.(selected)
        onChangeSelected?.(selected)

        // HINT: Dropdown系コンポーネント内でComboboxを使うと、選択肢がportalで表現されている関係上Dropdownが閉じてしまう
        // requestAnimationFrameを追加、処理を遅延させることで正常に閉じる/閉じないの判定を行えるようにする
        requestAnimationFrame(() => {
          setIsFocused(false)
        })
      },
      [onChangeSelected, onSelect],
    ),
    isExpanded: isFocused,
    isLoading,
    triggerRef: outerRef,
    decorators,
    searchValue,
    onSearchValueChange: setSearchValue,
    onChangeInput,
    onEscape: () => setIsFocused(false),
  })

  const selectDefaultItem = useMemo(
    () => (onSelect && defaultItem ? () => onSelect(defaultItem) : NOOP),
    [onSelect, defaultItem],
  )

  const focus = useMemo(() => {
    const baseAction = () => {
      setIsFocused(true)
      requestAnimationFrame(() => {
        searchInputRef.current?.focus()
      })
    }

    if (onFocus) {
      return () => {
        onFocus()
        baseAction()
      }
    }

    return baseAction
  }, [onFocus, searchInputRef])

  const handleFocus = useCallback<FocusEventHandler<HTMLInputElement>>(
    ({ relatedTarget, currentTarget }) => {
      if (relatedTarget) {
        const comparison = currentTarget.compareDocumentPosition(relatedTarget)

        // 順方向の場合のみ、パネルを開く
        // DOCUMENT_POSITION_PRECEDING (2) = 前の要素が現在の要素より前にある
        if (comparison & Node.DOCUMENT_POSITION_PRECEDING) {
          focus()
        }
      } else {
        // マウスクリックまたは初回フォーカスの場合は開く
        focus()
      }
    },
    [focus],
  )

  const unfocus = useCallback(() => {
    if (!isFocused) return

    const baseAction = () => {
      setIsFocused(false)
    }

    if (onBlur) {
      return () => {
        onBlur()
        baseAction()
      }
    }

    return baseAction
  }, [isFocused, onBlur])

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

        searchInputRef.current?.focus()

        setIsFocused(true)
      }
    },
    [onClearClick, onClear, onChangeSelected, searchInputRef],
  )
  const onKeyDownClear = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.shiftKey && e.key === 'Tab') {
        searchInputRef.current?.focus()
        unfocus()
      }
    },
    [unfocus, searchInputRef],
  )
  const handleClick = useCallback(() => {
    if (disabled) {
      return
    }

    focus()
  }, [disabled, focus])
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !isFocused) {
        // パネルが閉じている状態でEnterを押した場合、パネルを開く
        e.preventDefault()
        focus()
      } else if (e.key === 'ArrowDown' && !isFocused) {
        // パネルが閉じている状態で下矢印を押した場合、パネルを開く
        e.preventDefault()
        focus()
      }
    },
    [isFocused, focus],
  )
  const actualOnChangeInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e)

      const { value } = e.currentTarget

      setInputValue(value)

      if (value === '') {
        onClear?.()
        onChangeSelected?.(null)
      }
    },
    [onChange, onClear, onChangeSelected],
  )

  // HINT: form内にcomboboxを設置 & 検索inputにfocusした状態で
  // アイテムをキーボードで選択し、Enterを押すとinput上でEnterを押したことになるため、
  // submitイベントが発生し、formが送信される場合がある
  const handleWrapperKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') e.preventDefault()

      onKeyPress?.(e)
    },
    [onKeyPress],
  )

  const caretIconColor = useMemo(() => {
    if (disabled || readOnly) return textColor.disabled
    if (isFocused) return textColor.black

    return textColor.grey
  }, [disabled, readOnly, isFocused])

  const outerClickRef = useMemo(() => [outerRef, listBoxRef], [outerRef, listBoxRef])
  useOuterClick(outerClickRef, unfocus)

  useEffect(() => {
    setInputValue(selectedItem ? innerText(selectedItem.label) : '')

    if (!selectedItem) {
      selectDefaultItem()
    }
  }, [isFocused, selectedItem, selectDefaultItem])

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
        defaultText: '削除',
      }),
    }),
    [localize],
  )

  const decorated = useDecorators<DecoratorKeyTypes>(decoratorDefaultTexts, decorators)

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      role="group"
      onClick={handleClick}
      onKeyDown={handleWrapperKeyDown}
      className={classNames.wrapper}
      style={wrapperStyle}
      ref={outerRef}
    >
      <Input
        {...rest}
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
        onChange={actualOnChangeInput}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        error={error}
        prefix={prefix}
        suffix={
          <>
            <UnstyledButton
              onClick={onClickClear}
              onKeyDown={onKeyDownClear}
              ref={clearButtonRef}
              className={classNames.clearButton}
            >
              <FaCircleXmarkIcon
                color="TEXT_BLACK"
                alt={decorated.destroyButtonIconAlt}
                className={classNames.clearButtonIcon}
              />
            </UnstyledButton>
            <span className={classNames.caretDownLayout}>
              <FaCaretDownIcon color={caretIconColor} className={classNames.caretDownIcon} />
            </span>
          </>
        }
        className={classNames.input}
        data-smarthr-ui-input="true"
        ref={inputRef}
      />
      {!readOnly && renderListBox()}
    </div>
  )
}

export const SingleCombobox = genericsForwardRef(ActualSingleCombobox)
