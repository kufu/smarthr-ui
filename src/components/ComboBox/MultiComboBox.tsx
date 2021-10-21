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
import { hasParentElementByClassName } from './multiComboBoxHelper'
import { useClassNames } from './useClassNames'

import { FaCaretDownIcon } from '../Icon'
import { useListBox } from './useListBox'
import { MultiSelectedItem } from './MultiSelectedItem'
import { Item } from './types'

type Props<T> = {
  /**
   * A list of items to choose from.
   */
  items: Array<Item<T>>
  /**
   * A list of items that have already been selected.
   */
  selectedItems: Array<Item<T> & { deletable?: boolean }>
  /**
   * The value of the input `name` attribute.
   */
  name?: string
  /**
   * The value of the input `disabled` attribute.
   */
  disabled?: boolean
  /**
   * If true, the outline of this component will be DANGER color.
   */
  error?: boolean
  /**
   *  If true, you can add new item that do not exist in `items` props.
   */
  creatable?: boolean
  /**
   * The value of the input `placeholder` attribute.
   */
  placeholder?: string
  /**
   * If `true`, a loader is displayed on the dropdown list.
   */
  isLoading?: boolean
  /**
   * Whether to omit label of selected items with ellipsis
   */
  selectedItemEllipsis?: boolean
  /**
   * The value given to the width style of input.
   */
  width?: number | string
  /**
   * The value of textbox. If the value is given, the textbox is controlled.
   */
  inputValue?: string
  /**
   *  The `className` given to the outermost element of this component.
   */
  className?: string
  /**
   * Fire when the value of input changes.
   * @deprecated The onChange handler is deprecated, so use onChangeInput handler instead.
   */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  /**
   * Fire when the value of input changes.
   */
  onChangeInput?: (e: ChangeEvent<HTMLInputElement>) => void
  /**
   * Fire when adding an item that does not exist in `items` props.
   */
  onAdd?: (label: string) => void
  /**
   *  Fire when clicking the delete element of `selectedItems` button.
   */
  onDelete?: (item: Item<T>) => void
  /**
   * Fire when clicking an element of `items`.
   */
  onSelect?: (item: Item<T>) => void
  /**
   * Fire when the item selections are changed.
   */
  onChangeSelected?: (selectedItems: Array<Item<T>>) => void
  onFocus?: () => void
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
  const isInputControlled = useMemo(
    () => controlledInputValue !== undefined,
    [controlledInputValue],
  )
  const [uncontrolledInputValue, setUncontrolledInputValue] = useState('')
  const inputValue = isInputControlled ? controlledInputValue : uncontrolledInputValue
  const [isComposing, setIsComposing] = useState(false)
  const selectedLabels = selectedItems.map(({ label }) => label)
  const filteredItems = items.filter(({ label }) => {
    if (selectedLabels.includes(label)) return false
    if (!inputValue) return true
    return label.includes(inputValue)
  })
  const isDuplicate = items.some((item) => item.label === inputValue)
  const hasSelectableExactMatch = filteredItems.some((item) => item.label === inputValue)
  const {
    renderListBox,
    calculateDropdownRect,
    resetActiveOptionIndex,
    handleInputKeyDown,
    listBoxRef,
    aria,
  } = useListBox({
    items: filteredItems,
    inputValue,
    onAdd,
    onSelect: (selected) => {
      onSelect && onSelect(selected)
      onChangeSelected && onChangeSelected(selectedItems.concat(selected))
    },
    isExpanded: isFocused,
    isAddable: creatable && !!inputValue && !isDuplicate,
    isDuplicate: creatable && !!inputValue && isDuplicate && !hasSelectableExactMatch,
    hasNoMatch:
      (!creatable && filteredItems.length === 0) ||
      (creatable && filteredItems.length === 0 && !inputValue),
    isLoading,
    classNames: classNames.listBox,
  })

  const focus = useCallback(() => {
    onFocus && onFocus()
    setIsFocused(true)
    resetActiveOptionIndex()
  }, [onFocus, resetActiveOptionIndex])
  const blur = useCallback(() => {
    if (!isFocused) return
    onBlur && onBlur()
    setIsFocused(false)
  }, [isFocused, onBlur])

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
  }, [calculateDropdownRect, isFocused])

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
          // IE対応: 外側クリック判定が完了するまで要素が除去されないようにディレイを入れる
          setTimeout(() => {
            focus()
          }, 0)
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
          e.stopPropagation()
          blur()
        }
      }}
      role="combobox"
      aria-owns={aria.listBoxId}
      aria-haspopup="listbox"
      aria-expanded={isFocused}
      aria-invalid={error || undefined}
      aria-disabled={disabled}
    >
      <InputArea themes={theme}>
        <List themes={theme}>
          {selectedItems.map((selectedItem) => (
            <li key={selectedItem.label}>
              <MultiSelectedItem
                item={selectedItem}
                disabled={disabled}
                onDelete={() => {
                  onDelete && onDelete(selectedItem)
                  onChangeSelected &&
                    onChangeSelected(
                      selectedItems.filter(
                        (selected) =>
                          selected.label !== selectedItem.label ||
                          selected.value !== selectedItem.value,
                      ),
                    )
                }}
                enableEllipsis={selectedItemEllipsis}
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
                if (!isFocused) {
                  focus()
                }
              }}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              onKeyDown={(e) => {
                if (isComposing) {
                  return
                }
                if (e.key === 'Tab') {
                  blur()
                  return
                }
                handleInputKeyDown(e)
              }}
              autoComplete="off"
              aria-activedescendant={aria.activeDescendant}
              aria-autocomplete="list"
              aria-controls={aria.listBoxId}
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
        <FaCaretDownIcon color={isFocused ? theme.color.TEXT_BLACK : theme.color.BORDER} />
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
    /* for IE */
    /* stylelint-disable-next-line length-zero-no-unit */
    flex: 1 1 0px;
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

  /* for IE */
  /* stylelint-disable-next-line length-zero-no-unit */
  flex: 1 1 0px;
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
