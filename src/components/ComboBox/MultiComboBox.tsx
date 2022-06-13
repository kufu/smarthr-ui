import React, {
  ChangeEvent,
  HTMLAttributes,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useOuterClick } from '../../hooks/useOuterClick'
import { useId } from '../../hooks/useId'
import { hasParentElementByClassName } from './multiComboBoxHelper'
import { useMultiComboBoxClassNames } from './useClassNames'

import { FaCaretDownIcon } from '../Icon'
import { useOptions } from './useOptions'
import { useFocusControl } from './useFocusControl'
import { MultiSelectedItem } from './MultiSelectedItem'
import { useListBox } from './useListBox'
import { convertMatchableString } from './comboBoxHelper'
import { ComboBoxItem } from './types'
import { ComboBoxContext } from './ComboBoxContext'

type Props<T> = {
  /**
   * 選択可能なアイテムのリスト
   */
  items: Array<ComboBoxItem<T>>
  /**
   * 選択されているアイテムのリスト
   */
  selectedItems: Array<ComboBoxItem<T> & { deletable?: boolean }>
  /**
   * input 要素の `name` 属性の値
   */
  name?: string
  /**
   * input 要素の `disabled` 属性の値
   */
  disabled?: boolean
  /**
   * `true` のとき、コンポーネントの外枠が `DANGER` カラーになる
   */
  error?: boolean
  /**
   * `true` のとき、 `items` 内に存在しないアイテムを新しく追加できるようになる
   */
  creatable?: boolean
  /**
   * input 要素の `placeholder` 属性の値
   */
  placeholder?: string
  /**
   * `true` のとき、ドロップダウンリスト内にローダーを表示する
   */
  isLoading?: boolean
  /**
   * 選択されているアイテムのラベルを省略表示するかどうか
   */
  selectedItemEllipsis?: boolean
  /**
   * input 要素の `width` スタイルに適用する値
   */
  width?: number | string
  /**
   * テキストボックスの `value` 属性の値。
   * `onChangeInput` と併せて設定することで、テキストボックスの挙動が制御可能になる。
   */
  inputValue?: string
  /**
   * コンポーネント内の一番外側の要素に適用するクラス名
   */
  className?: string
  /**
   * input 要素の `value` が変わった時に発火するコールバック関数
   * @deprecated `onChange` は非推奨なため、代わりに `onChangeInput` を使用してください。
   */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  /**
   * input 要素の `value` が変わった時に発火するコールバック関数
   */
  onChangeInput?: (e: ChangeEvent<HTMLInputElement>) => void
  /**
   * `items` 内に存在しないアイテムが追加されたときに発火するコールバック関数
   */
  onAdd?: (label: string) => void
  /**
   * 選択されているアイテムの削除ボタンがクリックされた時に発火するコールバック関数
   */
  onDelete?: (item: ComboBoxItem<T>) => void
  /**
   * アイテムが選択された時に発火するコールバック関数
   */
  onSelect?: (item: ComboBoxItem<T>) => void
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
}

type ElementProps<T> = Omit<HTMLAttributes<HTMLDivElement>, keyof Props<T>>

export function MultiComboBox<T>({
  items,
  selectedItems,
  name,
  disabled = false,
  error = false,
  creatable = false,
  placeholder = '',
  isLoading,
  selectedItemEllipsis,
  width = 'auto',
  inputValue: controlledInputValue,
  className = '',
  onChange,
  onChangeInput,
  onAdd,
  onDelete,
  onSelect,
  onChangeSelected,
  onFocus,
  onBlur,
  ...props
}: Props<T> & ElementProps<T>) {
  const theme = useTheme()
  const classNames = useMultiComboBoxClassNames()
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
  const filteredOptions = useMemo(
    () =>
      options.filter(({ item: { label } }) => {
        if (!inputValue) return true
        return convertMatchableString(label).includes(convertMatchableString(inputValue))
      }),
    [inputValue, options],
  )
  const handleDelete = useCallback(
    (item: ComboBoxItem<T>) => {
      onDelete && onDelete(item)
      onChangeSelected &&
        onChangeSelected(selectedItems.filter((selected) => selected.label !== item.label))
    },
    [onChangeSelected, onDelete, selectedItems],
  )
  const handleSelect = useCallback(
    (selected: ComboBoxItem<T>) => {
      const matchedSelectedItem = selectedItems.find((item) => item.label === selected.label)
      if (matchedSelectedItem !== undefined) {
        if (matchedSelectedItem.deletable !== false) {
          handleDelete(selected)
        }
      } else {
        onSelect && onSelect(selected)
        onChangeSelected && onChangeSelected(selectedItems.concat(selected))
      }
    },
    [handleDelete, onChangeSelected, onSelect, selectedItems],
  )

  const {
    renderListBox,
    activeOption,
    handleKeyDwon: handleListBoxKeyDown,
    listBoxId,
    listBoxRef,
  } = useListBox({
    options: filteredOptions,
    onAdd,
    onSelect: handleSelect,
    isExpanded: isFocused,
    isLoading,
    triggerRef: outerRef,
  })

  const {
    deletionButtonRefs,
    inputRef,
    focusPrevDeletionButton,
    focusNextDeletionButton,
    resetDeletionButtonFocus,
  } = useFocusControl(selectedItems.length)

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
    if (isFocused) return theme.color.TEXT_BLACK
    if (disabled) return theme.color.TEXT_DISABLED
    return theme.color.TEXT_GREY
  }, [disabled, isFocused, theme])

  useOuterClick([outerRef, listBoxRef], blur)

  useLayoutEffect(() => {
    if (!isInputControlled) {
      setUncontrolledInputValue('')
    }

    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef, isFocused, isInputControlled, selectedItems])

  const contextValue = useMemo(
    () => ({
      listBoxClassNames: classNames.listBox,
    }),
    [classNames.listBox],
  )

  const wrapperClassNames = [
    className,
    isFocused && 'focused',
    error && 'invalid',
    disabled && 'disabled',
    classNames.wrapper,
  ]
    .filter((text) => text !== false && text !== '')
    .join(' ')
  const selectedListId = useId()

  return (
    <ComboBoxContext.Provider value={contextValue}>
      <Container
        {...props}
        themes={theme}
        width={width}
        ref={outerRef}
        className={wrapperClassNames}
        onClick={(e) => {
          if (
            !hasParentElementByClassName(e.target as HTMLElement, classNames.deleteButton) &&
            !disabled &&
            !isFocused
          ) {
            focus()
          }
        }}
        onKeyDown={(e) => {
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
        }}
        role="group"
      >
        <InputArea themes={theme}>
          <SelectedList
            id={selectedListId}
            aria-label="選択済みアイテム"
            className={classNames.selectedList}
          >
            {selectedItems.map((selectedItem, i) => (
              <li key={selectedItem.label}>
                <MultiSelectedItem
                  item={selectedItem}
                  disabled={disabled}
                  onDelete={handleDelete}
                  enableEllipsis={selectedItemEllipsis}
                  buttonRef={deletionButtonRefs[i]}
                />
              </li>
            ))}
          </SelectedList>

          <InputWrapper className={isFocused ? undefined : 'hidden'}>
            <Input
              type="text"
              name={name}
              value={inputValue}
              disabled={disabled}
              ref={inputRef}
              themes={theme}
              onChange={(e) => {
                if (onChange) onChange(e)
                if (onChangeInput) onChangeInput(e)
                if (!isInputControlled) {
                  setUncontrolledInputValue(e.currentTarget.value)
                }
              }}
              onFocus={() => {
                resetDeletionButtonFocus()
                if (!isFocused) {
                  focus()
                }
              }}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              onKeyDown={(e) => {
                if (
                  e.key === 'Down' ||
                  e.key === 'ArrowDown' ||
                  e.key === 'Up' ||
                  e.key === 'ArrowUp'
                ) {
                  e.preventDefault()
                }
              }}
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
              className={classNames.input}
            />
          </InputWrapper>

          {selectedItems.length === 0 && placeholder && !isFocused && (
            <Placeholder themes={theme} className={classNames.placeholder}>
              {placeholder}
            </Placeholder>
          )}
        </InputArea>

        <Suffix themes={theme}>
          <FaCaretDownIcon color={caretIconColor} />
        </Suffix>

        {renderListBox()}
      </Container>
    </ComboBoxContext.Provider>
  )
}

const Container = styled.div<{ themes: Theme; width: number | string }>`
  ${({ themes, width }) => {
    const { border, radius, color, shadow, spacingByChar } = themes

    return css`
      display: inline-flex;
      min-width: calc(62px + 32px + ${spacingByChar(0.5)} * 2);
      width: ${typeof width === 'number' ? `${width}px` : width};
      min-height: 40px;
      border-radius: ${radius.m};
      border: ${border.shorthand};
      box-sizing: border-box;
      background-color: ${color.WHITE};
      cursor: text;

      &.focused {
        box-shadow: ${shadow.OUTLINE};
      }

      &.invalid {
        border-color: ${color.DANGER};
      }

      &.disabled {
        background-color: ${color.COLUMN};
        cursor: not-allowed;
      }
    `
  }}
`
const InputArea = styled.div<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => css`
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: ${spacingByChar(0.5)};
    min-height: calc(1em + ${spacingByChar(0.5)} * 2);
    max-height: 300px;
    margin: ${spacingByChar(0.25)} ${spacingByChar(0.5)};
    overflow-y: auto;
  `}
`
const SelectedList = styled.ul`
  display: contents;
  list-style: none;
  li {
    /** 選択済みアイテムのラベルの省略表示のために幅を計算させる */
    min-width: 0;
  }
`
const InputWrapper = styled.div`
  &.hidden {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  flex: 1;
  display: flex;
  align-items: center;
`
const Input = styled.input<{ themes: Theme }>`
  ${({ themes }) => {
    const { fontSize } = themes

    return css`
      min-width: 80px;
      width: 100%;
      border: none;
      font-size: ${fontSize.M};
      box-sizing: border-box;
      outline: none;
      &[disabled] {
        display: none;
      }
    `
  }}
`
const Placeholder = styled.p<{ themes: Theme }>`
  ${({ themes }) => {
    const { color, fontSize } = themes

    return css`
      margin: 0;
      align-self: center;
      color: ${color.TEXT_GREY};
      font-size: ${fontSize.M};
    `
  }}
`
const Suffix = styled.div<{ themes: Theme }>`
  ${({ themes: { spacingByChar, border } }) =>
    css`
      display: flex;
      justify-content: center;
      align-items: center;
      margin: ${spacingByChar(0.5)} 0;
      padding: 0 ${spacingByChar(0.5)};
      border-left: ${border.shorthand};
      box-sizing: border-box;
    `}
`
