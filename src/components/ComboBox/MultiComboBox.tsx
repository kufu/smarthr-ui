import React, {
  ChangeEvent,
  HTMLAttributes,
  useCallback,
  useEffect,
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
import { useClassNames } from './useClassNames'

import { FaCaretDownIcon } from '../Icon'
import { useListBox } from './useListBox'
import { useOptions } from './useOptions'
import { MultiSelectedItem } from './MultiSelectedItem'
import { convertMatchableString } from './comboBoxHelper'
import { ComboBoxItem } from './types'

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
  const classNames = useClassNames().multi
  const outerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [focusedSelectedItemIndex, setFocusedSelectedItemIndex] = useState<number | null>(null)
  const isInputControlled = useMemo(
    () => controlledInputValue !== undefined,
    [controlledInputValue],
  )
  const [uncontrolledInputValue, setUncontrolledInputValue] = useState('')
  const inputValue = isInputControlled ? controlledInputValue : uncontrolledInputValue
  const [isComposing, setIsComposing] = useState(false)
  const selectedLabels = useMemo(() => selectedItems.map(({ label }) => label), [selectedItems])
  const filteredItems = useMemo(
    () =>
      items.filter(({ label }) => {
        if (!inputValue) return true
        return convertMatchableString(label).includes(convertMatchableString(inputValue))
      }),
    [inputValue, items],
  )
  const handleDelete = useCallback(
    (item: ComboBoxItem<T>) => {
      onDelete && onDelete(item)
      onChangeSelected &&
        onChangeSelected(
          selectedItems.filter(
            (selected) => selected.label !== item.label || selected.value !== item.value,
          ),
        )
    },
    [onChangeSelected, onDelete, selectedItems],
  )

  const { options, activeOption, setActiveOption, moveActivePositionDown, moveActivePositionUp } =
    useOptions({
      items: filteredItems,
      selected: selectedItems,
      creatable,
      inputValue,
    })

  const listBoxId = useId()
  const { renderListBox, calculateDropdownRect, listBoxRef } = useListBox({
    options,
    activeOptionId: activeOption?.id || null,
    onHoverOption: (option) => setActiveOption(option),
    onAdd,
    onSelect: (selected) => {
      const isSelectedItem = selectedLabels.includes(selected.label)
      if (isSelectedItem) {
        handleDelete(selected)
      } else {
        onSelect && onSelect(selected)
        onChangeSelected && onChangeSelected(selectedItems.concat(selected))
      }
    },
    isExpanded: isFocused,
    isLoading,
    listBoxId,
    classNames: classNames.listBox,
  })

  const focus = useCallback(() => {
    onFocus && onFocus()
    setIsFocused(true)
    setActiveOption(null)
  }, [onFocus, setActiveOption])
  const blur = useCallback(() => {
    if (!isFocused) return
    onBlur && onBlur()
    setIsFocused(false)
    setTimeout(() => setFocusedSelectedItemIndex(null))
  }, [isFocused, onBlur])

  const caretIconColor = useMemo(() => {
    if (isFocused) return theme.color.TEXT_BLACK
    if (disabled) return theme.color.TEXT_DISABLED
    return theme.color.TEXT_GREY
  }, [disabled, isFocused, theme])

  useOuterClick(
    [outerRef, listBoxRef],
    useCallback(() => {
      blur()
    }, [blur]),
  )

  useLayoutEffect(() => {
    if (!isInputControlled) {
      setUncontrolledInputValue('')
    }

    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFocused, isInputControlled, selectedItems])

  useLayoutEffect(() => {
    // ドロップダウン表示時に位置を計算する
    if (outerRef.current && isFocused) {
      calculateDropdownRect(outerRef.current)
    }
    // 選択済みアイテムによってコンボボックスの高さが変わりうるので selectedItems を依存に含める
  }, [calculateDropdownRect, isFocused, selectedItems])

  useEffect(() => {
    if (focusedSelectedItemIndex === null) {
      return
    }
    if (selectedItems.length === 0) {
      setFocusedSelectedItemIndex(null)
    } else {
      setFocusedSelectedItemIndex(Math.min(focusedSelectedItemIndex, selectedItems.length - 1))
    }
  }, [focusedSelectedItemIndex, selectedItems.length])

  return (
    <Container
      {...props}
      themes={theme}
      width={width}
      ref={outerRef}
      className={`${className} ${classNames.wrapper}`}
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
          blur()
        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
          if (focusedSelectedItemIndex === null) {
            if (inputRef.current?.selectionStart === 0 && selectedItems.length > 0) {
              setFocusedSelectedItemIndex(selectedItems.length - 1)
            }
          } else {
            setFocusedSelectedItemIndex(Math.max(focusedSelectedItemIndex - 1, 0))
          }
        } else if (e.key === 'Right' || e.key === 'ArrowRight') {
          if (focusedSelectedItemIndex !== null) {
            const nextIndex = focusedSelectedItemIndex + 1
            if (nextIndex < selectedItems.length) {
              setFocusedSelectedItemIndex(nextIndex)
            } else {
              setFocusedSelectedItemIndex(null)
              inputRef.current?.focus()
            }
          }
        } else if (e.key === 'Down' || e.key === 'ArrowDown') {
          e.preventDefault()
          inputRef.current?.focus()
          setFocusedSelectedItemIndex(null)
          moveActivePositionDown()
        } else if (e.key === 'Up' || e.key === 'ArrowUp') {
          e.preventDefault()
          inputRef.current?.focus()
          setFocusedSelectedItemIndex(null)
          moveActivePositionUp()
        } else if (e.key === 'Enter' && document.activeElement === inputRef.current) {
          if (activeOption === null) {
            return
          }
          e.preventDefault()
          if (activeOption.selected) {
            handleDelete(activeOption.item)
          } else if (activeOption.isNew) {
            onAdd && onAdd(activeOption.item.label)
          } else {
            onSelect && onSelect(activeOption.item)
          }
        } else {
          e.stopPropagation()
          inputRef.current?.focus()
          setFocusedSelectedItemIndex(null)
          setActiveOption(null)
        }
      }}
      role="combobox"
      aria-owns={listBoxId}
      aria-haspopup="listbox"
      aria-expanded={isFocused}
      aria-invalid={error || undefined}
      aria-disabled={disabled}
    >
      <InputArea themes={theme}>
        <List themes={theme}>
          {selectedItems.map((selectedItem, i) => (
            <li key={selectedItem.label}>
              <MultiSelectedItem
                item={selectedItem}
                disabled={disabled}
                onDelete={() => {
                  handleDelete(selectedItem)
                }}
                enableEllipsis={selectedItemEllipsis}
                focused={i === focusedSelectedItemIndex}
              />
            </li>
          ))}

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
                setFocusedSelectedItemIndex(null)
                if (!isFocused) {
                  focus()
                }
              }}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              autoComplete="off"
              tabIndex={focusedSelectedItemIndex === null ? 0 : -1}
              aria-activedescendant={activeOption?.id}
              aria-autocomplete="list"
              aria-controls={listBoxId}
              className={classNames.input}
            />
          </InputWrapper>

          {selectedItems.length === 0 && placeholder && !isFocused && (
            <li>
              <Placeholder themes={theme} className={classNames.placeholder}>
                {placeholder}
              </Placeholder>
            </li>
          )}
        </List>
      </InputArea>

      <Suffix themes={theme}>
        <FaCaretDownIcon color={caretIconColor} />
      </Suffix>

      {renderListBox()}
    </Container>
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

      &[aria-expanded='true'] {
        box-shadow: ${shadow.OUTLINE};
      }

      &[aria-invalid='true'] {
        border-color: ${color.DANGER};
      }

      &[aria-disabled='true'] {
        background-color: ${color.COLUMN};
        cursor: not-allowed;
      }
    `
  }}
`
const InputArea = styled.div<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => css`
    flex: 1;
    overflow-y: auto;
    max-height: 300px;
    padding-left: ${spacingByChar(0.5)};
  `}
`
const smallMargin = 6.5
const borderWidth = 1
const List = styled.ul<{ themes: Theme }>`
  ${({ themes }) => {
    const {
      fontSize: { pxToRem },
      spacingByChar,
    } = themes

    return css`
      display: flex;
      flex-wrap: wrap;
      margin: ${pxToRem(smallMargin - borderWidth)} 0 0;
      padding: 0;
      list-style: none;

      > li {
        min-height: 27px;
        max-width: calc(100% - ${spacingByChar(0.5)});
        margin-right: ${spacingByChar(0.5)};
        margin-bottom: ${pxToRem(smallMargin - borderWidth)};
      }
    `
  }}
`
const InputWrapper = styled.li`
  &.hidden {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  flex: 1;
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
      color: ${color.TEXT_GREY};
      font-size: ${fontSize.M};
      line-height: 25px;
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
