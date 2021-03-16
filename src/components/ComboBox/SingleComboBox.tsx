import React, {
  ChangeEvent,
  VFC,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useOuterClick } from '../../hooks/useOuterClick'

import { Input } from '../Input'
import { FaCaretDownIcon, FaTimesCircleIcon } from '../Icon'
import { ResetButton } from '../Button/ResetButton'
import { useListBox } from './useListBox'

type Props = {
  /**
   * A list of items to choose from.
   */
  items: Array<{ value: string; label: string; disabled?: boolean }>
  /**
   * An item that have already been selected.
   */
  selectedItem: { value: string; label: string } | null
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
   * The value given to the width style of input.
   */
  width?: number | string
  /**
   *  The `className` given to the outermost element of this component.
   */
  className?: string
  /**
   * Fire when the value of input changes.
   */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  /**
   * Fire when adding an item that does not exist in `items` props.
   */
  onAdd?: (label: string) => void
  /**
   * Fire when the selected item is changed.
   */
  onSelect: (item: { value: string; label: string } | null) => void
}

export const SingleComboBox: VFC<Props> = ({
  items,
  selectedItem,
  name,
  disabled = false,
  error = false,
  creatable = false,
  placeholder = '',
  width = 'auto',
  className = '',
  onChange,
  onAdd,
  onSelect,
}) => {
  const theme = useTheme()
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
      onSelect(selected)
      setIsExpanded(false)
    },
    isExpanded,
    isAddable: creatable && !!inputValue && !isDuplicate,
    isDuplicate: creatable && !!inputValue && isDuplicate && !hasSelectableExactMatch,
    hasNoMatch:
      (!creatable && filteredItems.length === 0) ||
      (creatable && filteredItems.length === 0 && !inputValue),
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

  return (
    <Container
      ref={outerRef}
      className={`${disabled ? 'disabled' : ''} ${className}`}
      role="combobox"
      aria-haspopup="listbox"
      aria-controls={aria.listBoxId}
      aria-expanded={isFocused}
    >
      <StyledInput
        type="text"
        name={name}
        value={inputValue}
        disabled={disabled}
        width={width}
        error={error}
        placeholder={placeholder}
        suffix={
          <>
            <ClearButton
              onClick={() => {
                onSelect(null)
                setIsExpanded(true)
              }}
              ref={clearButtonRef}
              themes={theme}
              className={selectedItem === null || disabled ? 'hidden' : undefined}
            >
              <FaTimesCircleIcon color={theme.color.TEXT_BLACK} visuallyHiddenText="clear" />
            </ClearButton>
            <CaretDownLayout themes={theme}>
              <CaretDownWrapper themes={theme}>
                <FaCaretDownIcon
                  color={isFocused ? theme.palette.TEXT_BLACK : theme.palette.BORDER}
                />
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
          const { value } = e.currentTarget
          setInputValue(value)
          if (value === '') {
            onSelect(null)
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
      />
      {renderListBox()}
    </Container>
  )
}

const Container = styled.div`
  display: inline-block;
  &.disabled {
    cursor: not-allowed;
  }
`
const StyledInput = styled(Input)`
  input::-ms-clear {
    display: none;
  }
`
const CaretDownLayout = styled.span<{ themes: Theme }>(({ themes }) => {
  const { fontSize, spacing } = themes
  return css`
    height: 100%;
    box-sizing: border-box;
    padding: ${fontSize.pxToRem(spacing.XXS)} 0;
  `
})

const CaretDownWrapper = styled.span<{ themes: Theme }>(({ themes }) => {
  const { border, fontSize, spacing } = themes
  return css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    box-sizing: border-box;
    padding-left: ${fontSize.pxToRem(spacing.XXS)};
    border-left: ${border.shorthand};
  `
})
const ClearButton = styled(ResetButton)<{ themes: Theme }>`
  ${({ themes }) => {
    const { fontSize, spacing } = themes
    return css`
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 0 ${fontSize.pxToRem(spacing.XXS)};
      cursor: pointer;
      &.hidden {
        display: none;
      }
    `
  }}
`
