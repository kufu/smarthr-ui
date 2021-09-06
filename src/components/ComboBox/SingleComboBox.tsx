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
import { useClassNames } from './useClassNames'

import { Input } from '../Input'
import { FaCaretDownIcon, FaTimesCircleIcon } from '../Icon'
import { UnstyledButton } from '../Button'
import { useListBox } from './useListBox'
import { Item } from './types'

type Props<T> = {
  /**
   * A list of items to choose from.
   */
  items: Array<Item<T>>
  /**
   * An item that have already been selected.
   */
  selectedItem: Item<T> | null
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
   * The value given to the width style of input.
   */
  width?: number | string
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
   * Fire when an item is selected.
   */
  onSelect?: (item: Item<T>) => void
  /**
   * Fire when the selected item is cleared.
   */
  onClear?: () => void
  /**
   * Fire when the item selection is changed.
   */
  onChangeSelected?: (selectedItem: Item<T> | null) => void
}

type ElementProps<T> = Omit<HTMLAttributes<HTMLDivElement>, keyof Props<T>>

export function SingleComboBox<T>({
  items,
  selectedItem,
  name,
  disabled = false,
  error = false,
  creatable = false,
  placeholder = '',
  isLoading,
  width = 'auto',
  className = '',
  onChange,
  onChangeInput,
  onAdd,
  onSelect,
  onClear,
  onChangeSelected,
  ...props
}: Props<T> & ElementProps<T>) {
  const theme = useTheme()
  const classNames = useClassNames().single
  const outerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const clearButtonRef = useRef<HTMLButtonElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const filteredItems = useMemo(() => {
    return items
      .filter(({ label }) => {
        if (!inputValue) return true
        return label.includes(inputValue)
      })
      .map((item) => ({
        ...item,
        isSelected: selectedItem === null ? false : item.label === selectedItem.label,
      }))
  }, [inputValue, items, selectedItem])
  const isDuplicate = items.some((item) => item.label === inputValue)
  const hasSelectableExactMatch = filteredItems.some((item) => item.label === inputValue)
  const {
    renderListBox,
    setDropdownStyle,
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
      onChangeSelected && onChangeSelected(selected)
      setIsExpanded(false)
    },
    isExpanded,
    isAddable: creatable && !!inputValue && !isDuplicate,
    isDuplicate: creatable && !!inputValue && isDuplicate && !hasSelectableExactMatch,
    hasNoMatch:
      (!creatable && filteredItems.length === 0) ||
      (creatable && filteredItems.length === 0 && !inputValue),
    isLoading,
    classNames: classNames.listBox,
  })

  const focus = useCallback(() => {
    setIsFocused(true)
    resetActiveOptionIndex()
    if (!isFocused) {
      setIsExpanded(true)
    }
  }, [isFocused, resetActiveOptionIndex])
  const blur = useCallback(() => {
    setIsFocused(false)
    setIsExpanded(false)
  }, [])

  useOuterClick(
    [outerRef, listBoxRef, clearButtonRef],
    useCallback(() => {
      blur()
    }, [blur]),
  )

  useLayoutEffect(() => {
    setInputValue(selectedItem ? selectedItem.label : '')

    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    }

    if (outerRef.current) {
      const rect = outerRef.current.getBoundingClientRect()

      setDropdownStyle({
        top: rect.top + rect.height - 2 + window.pageYOffset,
        left: rect.left + window.pageXOffset,
        width: outerRef.current.clientWidth,
      })
    }
  }, [isFocused, selectedItem, setDropdownStyle])

  const needsClearButton = selectedItem !== null && !disabled

  return (
    <Container
      {...props}
      ref={outerRef}
      className={`${disabled ? 'disabled' : ''} ${className} ${classNames.wrapper}`}
      $width={width}
      role="combobox"
      aria-haspopup="listbox"
      aria-controls={aria.listBoxId}
      aria-expanded={isFocused}
      aria-invalid={error || undefined}
    >
      <StyledInput
        type="text"
        name={name}
        value={inputValue}
        disabled={disabled}
        error={error}
        placeholder={placeholder}
        suffix={
          <>
            <ClearButton
              onClick={(e) => {
                e.stopPropagation()
                onClear && onClear()
                onChangeSelected && onChangeSelected(null)
                if (isFocused) {
                  setIsExpanded(true)
                }
              }}
              ref={clearButtonRef}
              themes={theme}
              className={`${needsClearButton ? '' : 'hidden'} ${classNames.clearButton}`}
            >
              <FaTimesCircleIcon color={theme.color.TEXT_BLACK} visuallyHiddenText="clear" />
            </ClearButton>
            <CaretDownLayout themes={theme}>
              <CaretDownWrapper themes={theme}>
                <FaCaretDownIcon color={isFocused ? theme.color.TEXT_BLACK : theme.color.BORDER} />
              </CaretDownWrapper>
            </CaretDownLayout>
          </>
        }
        onClick={(e) => {
          if (disabled) {
            e.stopPropagation()
            return
          }
          focus()
          if (inputRef.current) {
            inputRef.current.focus()
          }
          if (!isExpanded) {
            setIsExpanded(true)
          }
        }}
        onChange={(e) => {
          if (onChange) onChange(e)
          if (onChangeInput) onChangeInput(e)
          const { value } = e.currentTarget
          setInputValue(value)
          if (value === '') {
            onClear && onClear()
            onChangeSelected && onChangeSelected(null)
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
          if (e.key === 'Escape' || e.key === 'Exc') {
            if (isExpanded) {
              e.stopPropagation()
              setIsExpanded(false)
            }
            return
          }
          if (!isExpanded) {
            setIsExpanded(true)
          }
        }}
        ref={inputRef}
        aria-activedescendant={aria.activeDescendant}
        aria-autocomplete="list"
        className={classNames.input}
      />
      {renderListBox()}
    </Container>
  )
}

const Container = styled.div<{ $width: number | string }>`
  display: inline-block;
  width: ${({ $width = 'auto' }) => (typeof $width === 'number' ? `${$width}px` : $width)};
  &.disabled {
    cursor: not-allowed;
  }
`
const StyledInput = styled(Input)`
  width: 100%;
  input::-ms-clear {
    display: none;
  }
`
const CaretDownLayout = styled.span<{ themes: Theme }>(({ themes }) => {
  const { spacingByChar } = themes
  return css`
    height: 100%;
    box-sizing: border-box;
    padding: ${spacingByChar(0.5)} 0;
  `
})
const CaretDownWrapper = styled.span<{ themes: Theme }>(({ themes }) => {
  const { border, spacingByChar } = themes
  return css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    box-sizing: border-box;
    padding-left: ${spacingByChar(0.5)};
    border-left: ${border.shorthand};
  `
})
const ClearButton = styled(UnstyledButton)<{ themes: Theme }>`
  ${({ themes }) => {
    const { spacingByChar } = themes
    return css`
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 0 ${spacingByChar(0.5)};
      cursor: pointer;
      &.hidden {
        display: none;
      }
    `
  }}
`
