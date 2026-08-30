'use client'

import {
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
  memo,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import innerText from 'react-innertext'
import { tv } from 'tailwind-variants'

import { useTheme } from '../../../hooks/client/useTheme'
import { useAnimationFrame } from '../../../hooks/useAnimationFrame'
import { useLatest } from '../../../hooks/useLatest'
import { useMergeRefs } from '../../../hooks/useMergeRefs'
import { useOuterClick } from '../../../hooks/useOuterClick'
import { useLocalize } from '../../../intl'
import { findDelegateTarget } from '../../../libs/delegate'
import { genericsForwardRef } from '../../../libs/util'
import { FaCaretDownIcon } from '../../Icon'
import { Scroller } from '../../Scroller'
import { areItemsEqual } from '../helper'
import { ListBox, useListbox } from '../useListbox'
import { useMultiOptions } from '../useOptions'

import { DELETE_BUTTON_SELECTOR, MultiSelectedItem } from './MultiSelectedItem'

import type { ComboboxItem, BaseProps as ComboboxProps } from '../types'

type BaseProps<T> = ComboboxProps<T> & {
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
   * アイテムが選択されたときに選択済みかどうかを判定するコールバック関数/
   */
  isItemSelected?: (targetItem: ComboboxItem<T>, selectedItems: Array<ComboboxItem<T>>) => boolean
  /**
   * 検索結果が0件の時に表示するコンテンツ
   */
  noResultText?: ReactNode
}
type Props<T> = BaseProps<T> & Omit<ComponentPropsWithoutRef<'input'>, keyof BaseProps<unknown>>

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

const EMPTY_INPUT_CHANGE_EVENT = {
  currentTarget: { value: '' },
  target: { value: '' },
} as ChangeEvent<HTMLInputElement>

const DELETE_BUTTON_CLASSNAME = `.${DELETE_BUTTON_SELECTOR}`

const classNameGenerator = tv({
  slots: {
    wrapper: [
      'smarthr-ui-MultiCombobox',
      'shr-box-border shr-inline-flex shr-min-w-[15em] shr-rounded-m shr-border shr-border-solid shr-px-0.5 shr-py-0.25 shr-align-bottom',
      'contrast-more:shr-border-high-contrast',
      'has-[[role=combobox][aria-expanded=true]]:shr-focus-indicator',
      'shr-cursor-text shr-border-default shr-bg-white',
      'has-[[role=combobox]:disabled]:shr-cursor-not-allowed',
      'has-[[role=combobox]:disabled]:shr-border-default/50',
      'has-[[role=combobox]:disabled]:shr-bg-white-darken',
      'has-[[role=combobox]:disabled]:shr-text-disabled',
      // HINT: disabled と詳細度が同じ [0,2,0] のため、CSS ソース順でこちらを後に置くことで error 時の border 色を優先させる
      'has-[[role=combobox][aria-invalid]]:shr-border-danger',
    ],
    inputArea: 'shr-flex shr-flex-1 shr-flex-wrap shr-gap-0.5',
    selectedList:
      'smarthr-ui-MultiCombobox-selectedList shr-contents shr-list-none [&_li]:shr-min-w-0',
    inputWrapper: [
      'shr-flex shr-flex-1 shr-items-center',
      'has-[[role=combobox][aria-expanded=false]]:shr-pointer-events-none',
      'has-[[role=combobox][aria-expanded=false]]:shr-absolute',
      'has-[[role=combobox][aria-expanded=false]]:shr-opacity-0',
    ],
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
    isItemSelected,
    noResultText,
    style,
    id,
    ...rest
  }: Props<T>,
  ref: Ref<HTMLInputElement>,
) => {
  const triggerRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [highlighted, setHighlighted] = useState(false)
  const [uncontrolledInputValue, setUncontrolledInputValue] = useState('')
  const [isComposing, setIsComposing] = useState(false)

  const baseId = useId()
  const inputId = id || `${baseId}-input`
  const selectedListId = `${baseId}-selected`

  const isInputControlled = controlledInputValue !== undefined
  const inputValue = isInputControlled ? controlledInputValue : uncontrolledInputValue
  const setInputValueIfUncontrolled = isInputControlled ? NOOP : setUncontrolledInputValue
  const isInputEmpty = !inputValue

  const { options } = useMultiOptions({
    items,
    selected: selectedItems,
    creatable,
    inputValue,
    isItemSelected,
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const deleteFrame = useAnimationFrame()
  const selectFrame = useAnimationFrame()

  // eslint-disable-next-line local-rules/best-practice-for-use-latest
  const latestForListBox = useLatest({
    onDelete,
    onChangeSelected,
    onSelect,
    onChangeInput,
    selectedItems,
    deleteFrame,
    selectFrame,
  })

  const listBoxFunctions = useMemo(() => {
    const handleDelete = (item: ComboboxItem<T>) => {
      const handlers: Array<(deletingItem: ComboboxItem<T>) => void> = []

      if (latestForListBox.onDelete) {
        handlers.push((deletingItem: ComboboxItem<T>) => latestForListBox.onDelete!(deletingItem))
      }
      if (latestForListBox.onChangeSelected) {
        handlers.push((deletingItem: ComboboxItem<T>) =>
          latestForListBox.onChangeSelected!(
            latestForListBox.selectedItems.filter(
              (selected) => !areItemsEqual(selected, deletingItem),
            ),
          ),
        )
      }

      if (handlers.length > 0) {
        // HINT: Dropdown系コンポーネント内でComboboxを使うと、選択肢がportalで表現されている関係上Dropdownが閉じてしまう
        // 処理を遅延させることで正常に閉じる/閉じないの判定を行えるようにする
        latestForListBox.deleteFrame.request(() => {
          handlers.forEach((h) => h(item))
        })
      }
    }

    return {
      cleanupListBoxCallbackRef: () => () => {
        latestForListBox.deleteFrame.cancel()
        latestForListBox.selectFrame.cancel()
      },
      handleDelete,
      handleSelect: (selected: ComboboxItem<T>) => {
        // HINT: Dropdown系コンポーネント内でComboboxを使うと、選択肢がportalで表現されている関係上Dropdownが閉じてしまう
        // 処理を遅延させることで正常に閉じる/閉じないの判定を行えるようにする
        latestForListBox.selectFrame.request(() => {
          const matchedSelectedItem = latestForListBox.selectedItems.find((item) =>
            areItemsEqual(item, selected),
          )

          if (matchedSelectedItem === undefined) {
            latestForListBox.onSelect?.(selected)
            latestForListBox.onChangeSelected?.(latestForListBox.selectedItems.concat(selected))

            // 制御コンポーネントの場合に親側でinputValueを更新できるように、選択時にonChangeInputを空文字で発火する
            latestForListBox.onChangeInput?.(EMPTY_INPUT_CHANGE_EVENT)
          } else if (matchedSelectedItem.deletable !== false) {
            handleDelete(selected)
          }
        })
      },
    }
  }, [latestForListBox])

  const { listBoxProps, activeOption, handleKeyDownListBox, listBoxId, listBoxRef } = useListbox({
    options,
    dropdownHelpMessage,
    dropdownWidth,
    onAdd,
    onSelect: listBoxFunctions.handleSelect,
    isExpanded,
    isLoading,
    triggerRef,
    noResultText,
    inputId,
  })

  const latest = useLatest({
    onChange,
    onChangeInput,
    onFocus,
    onBlur,
    onKeyPress,
    disabled,
    isExpanded,
    highlighted,
    isComposing,
    isInputEmpty,
    selectedItems,
    setInputValueIfUncontrolled,
    handleKeyDownListBox,
  })

  const functions = useMemo(() => {
    const handleDelete = listBoxFunctions.handleDelete

    const getDeletionButtons = () => {
      if (triggerRef.current) {
        const buttons =
          triggerRef.current.querySelectorAll<HTMLButtonElement>(DELETE_BUTTON_CLASSNAME)

        if (buttons.length > 0) {
          const actualButtons = Array.from(buttons)

          return {
            buttons: actualButtons,
            currentIndex: actualButtons.indexOf(document.activeElement as HTMLButtonElement),
          }
        }
      }

      return null
    }

    const focusPrevDeletionButton = () => {
      const result = getDeletionButtons()

      if (!result) return

      const { buttons, currentIndex } = result

      if (currentIndex !== -1) {
        buttons[Math.max(currentIndex - 1, 0)].focus()
      } else if (inputRef.current?.selectionStart === 0) {
        buttons[buttons.length - 1].focus()
      }
    }

    const focusNextDeletionButton = () => {
      const result = getDeletionButtons()

      if (!result) return

      const { buttons, currentIndex } = result

      if (currentIndex === -1) return

      const nextIndex = currentIndex + 1

      if (nextIndex < buttons.length) {
        buttons[nextIndex].focus()
      } else {
        // キー入力が input に影響しないようにフォーカスタイミングを遅らせる
        setTimeout(() => {
          inputRef.current?.focus()
        })
      }
    }

    const focus = () => {
      latest.onFocus?.()
      setIsExpanded(true)
    }

    const blur = () => {
      if (latest.isExpanded) {
        latest.onBlur?.()
        setIsExpanded(false)
      }
    }

    return {
      handleDelete,
      blur,
      handleDelegateKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
        if (latest.isComposing) return

        if (ESCAPE_KEY_REGEX.test(e.key)) {
          e.stopPropagation()
          blur()
        } else if (e.key === 'Tab') {
          if (latest.isExpanded) {
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
          latest.isInputEmpty &&
          latest.selectedItems.length > 0 &&
          latest.selectedItems[latest.selectedItems.length - 1].deletable !== false
        ) {
          e.preventDefault()
          e.stopPropagation()

          const lastItem = latest.selectedItems[latest.selectedItems.length - 1]

          handleDelete(lastItem)
          setHighlighted(true)
          latest.setInputValueIfUncontrolled(innerText(lastItem.label))
        } else {
          e.stopPropagation()
          inputRef.current?.focus()
        }

        latest.handleKeyDownListBox(e)
      },
      handleDelegateClick: (e: MouseEvent<HTMLElement>) => {
        if (
          !latest.disabled &&
          !latest.isExpanded &&
          !findDelegateTarget(e, DELETE_BUTTON_CLASSNAME)
        ) {
          focus()
        }
      },
      handleChangeInput: (e: ChangeEvent<HTMLInputElement>) => {
        const handlers = [latest.onChange, latest.onChangeInput].filter((h) => !!h)

        handlers.forEach((h) => h(e))
        latest.setInputValueIfUncontrolled(e.currentTarget.value)
      },
      handleFocusInput: () => {
        if (!latest.isExpanded) {
          focus()
        }
      },
      handleCompositionStart: () => setIsComposing(true),
      handleCompositionEnd: () => setIsComposing(false),
      handleKeyDownInput: (e: KeyboardEvent<HTMLInputElement>) => {
        if (ARROW_UP_AND_DOWN_KEY_REGEX.test(e.key)) {
          // 上下キー入力はリストボックスの activeDescendant の移動に用いるため、input 内では作用させない
          e.preventDefault()
        }
      },
      // HINT: form内にcomboboxを設置 & 検索inputにfocusした状態で
      // アイテムをキーボードで選択し、Enterを押すとinput上でEnterを押したことになるため、
      // submitイベントが発生し、formが送信される場合がある
      handleDelegateKeyPress: (e: KeyboardEvent<HTMLInputElement>) => {
        preventDefaultWithPressEnter(e)
        latest.onKeyPress?.(e)
      },
    }
  }, [listBoxFunctions, latest])

  useOuterClick([triggerRef, listBoxRef], functions.blur)

  const mergedRef = useMergeRefs(inputRef, listBoxFunctions.cleanupListBoxCallbackRef, ref)

  useEffect(() => {
    if (latest.highlighted) {
      setHighlighted(false)
      inputRef.current?.select()
    } else {
      setInputValueIfUncontrolled('')
    }
  }, [selectedItems, setInputValueIfUncontrolled, inputRef, latest])

  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus()
    }
  }, [isExpanded, selectedItems, isInputControlled, inputRef])

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
      wrapper: wrapper({ className }),
      inputArea: inputArea(),
      selectedList: selectedList(),
      inputWrapper: inputWrapper(),
      input: input(),
      placeholder: placeholderEl(),
      suffixWrapper: suffixWrapper(),
      suffixIcon: suffixIcon(),
    }
  }, [className])

  const localized = useLocalize({
    selectedListAriaLabel: {
      id: 'smarthr-ui/MultiCombobox/selectedListAriaLabel',
      defaultText: '選択済みアイテム',
    },
  })

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      ref={triggerRef}
      role="group"
      className={classNames.wrapper}
      style={{
        ...style,
        width: typeof width === 'number' ? `${width}px` : width,
      }}
      onClick={functions.handleDelegateClick}
      onKeyDown={functions.handleDelegateKeyDown}
      onKeyPress={functions.handleDelegateKeyPress}
    >
      <Scroller className={classNames.inputArea}>
        <ul
          id={selectedListId}
          className={classNames.selectedList}
          aria-label={localized.selectedListAriaLabel}
        >
          {selectedItems.map((selectedItem) => (
            <li key={`${selectedItem.label}-${innerText(selectedItem.value)}`}>
              <MultiSelectedItem
                disabled={disabled}
                item={selectedItem}
                enableEllipsis={selectedItemEllipsis}
                handleDelete={functions.handleDelete}
              />
            </li>
          ))}
        </ul>

        <div className={classNames.inputWrapper}>
          <input
            {...rest}
            ref={mergedRef}
            role="combobox"
            type="text"
            id={inputId}
            name={name}
            required={required && selectedItems.length === 0}
            disabled={disabled}
            value={inputValue}
            autoComplete={autoComplete ?? 'off'}
            tabIndex={0}
            className={classNames.input}
            aria-activedescendant={activeOption?.id}
            aria-controls={`${listBoxId} ${selectedListId}`}
            aria-haspopup="listbox"
            aria-expanded={isExpanded}
            aria-invalid={error || undefined}
            aria-disabled={disabled}
            aria-autocomplete="list"
            data-smarthr-ui-input="true"
            onChange={functions.handleChangeInput}
            onFocus={functions.handleFocusInput}
            onCompositionStart={functions.handleCompositionStart}
            onCompositionEnd={functions.handleCompositionEnd}
            onKeyDown={functions.handleKeyDownInput}
          />
        </div>

        {selectedItems.length === 0 && placeholder && !isExpanded && (
          <p className={classNames.placeholder}>{placeholder}</p>
        )}
      </Scroller>

      <MemoizedCaretDown disabled={disabled} isExpanded={isExpanded} classNames={classNames} />

      <ListBox {...listBoxProps} />
    </div>
  )
}

export const MultiCombobox = genericsForwardRef(ActualMultiCombobox)

const MemoizedCaretDown = memo<{
  disabled: boolean
  isExpanded: boolean
  classNames: {
    suffixWrapper: string
    suffixIcon: string
  }
}>(({ disabled, isExpanded, classNames }) => {
  const theme = useTheme()
  const caretIconColor = isExpanded
    ? theme.textColor.black
    : disabled
      ? theme.textColor.disabled
      : theme.textColor.grey

  return (
    <div className={classNames.suffixWrapper}>
      <FaCaretDownIcon color={caretIconColor} className={classNames.suffixIcon} />
    </div>
  )
})
