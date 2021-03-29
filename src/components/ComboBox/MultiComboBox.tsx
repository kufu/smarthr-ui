import React, { ChangeEvent, FC, useCallback, useLayoutEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useOuterClick } from '../../hooks/useOuterClick'
import { hasParentElementByClassName } from './multiComboBoxHelper'

import { FaCaretDownIcon, FaTimesCircleIcon } from '../Icon'
import { useListBox } from './useListBox'

const DELETE_BUTTON_CLASS_NAME = 'DELETE_BUTTON_CLASS_NAME'

type Props = {
  /**
   * A list of items to choose from.
   */
  items: Array<{ value: string; label: string; disabled?: boolean }>
  /**
   * A list of items that have already been selected.
   */
  selectedItems: Array<{ value: string; label: string; deletable?: boolean }>
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
   *  Fire when clicking the delete element of `selectedItems` button.
   */
  onDelete: (option: { value: string; label: string }) => void
  /**
   * Fire when clicking an element of `items`.
   */
  onSelect: (option: { value: string; label: string }) => void
}

export const MultiComboBox: FC<Props> = ({
  items,
  selectedItems,
  name,
  disabled = false,
  error = false,
  creatable = false,
  placeholder = '',
  width = 'auto',
  className = '',
  onChange,
  onAdd,
  onDelete,
  onSelect,
}) => {
  const theme = useTheme()
  const outerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [inputValue, setInputValue] = useState('')
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
    setDropdownStyle,
    resetActiveOptionIndex,
    handleInputKeyDown,
    listBoxRef,
    aria,
  } = useListBox({
    items: filteredItems,
    inputValue,
    onAdd,
    onSelect,
    isExpanded: isFocused,
    isAddable: creatable && !!inputValue && !isDuplicate,
    isDuplicate: creatable && !!inputValue && isDuplicate && !hasSelectableExactMatch,
    hasNoMatch:
      (!creatable && filteredItems.length === 0) ||
      (creatable && filteredItems.length === 0 && !inputValue),
  })

  const classNames = [
    isFocused ? 'active' : '',
    disabled ? 'disabled' : '',
    error ? 'error' : '',
    className,
  ]
    .filter((item) => item)
    .join(' ')

  const focus = useCallback(() => {
    setIsFocused(true)
    resetActiveOptionIndex()
  }, [resetActiveOptionIndex])
  const blur = useCallback(() => {
    setIsFocused(false)
  }, [])

  useOuterClick(
    [outerRef, listBoxRef],
    useCallback(() => {
      blur()
    }, [blur]),
  )

  useLayoutEffect(() => {
    setInputValue('')

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
  }, [isFocused, selectedItems, setDropdownStyle])

  return (
    <Container
      themes={theme}
      width={width}
      ref={outerRef}
      className={classNames}
      onClick={(e) => {
        if (
          !hasParentElementByClassName(e.target as HTMLElement, DELETE_BUTTON_CLASS_NAME) &&
          !disabled &&
          !isFocused
        ) {
          focus()
        }
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }}
      onKeyDown={(e) => {
        if ((e.key === 'Escape' || e.key === 'Esc') && isFocused) {
          e.stopPropagation()
          blur()
        }
      }}
      role="combobox"
      aria-owns={aria.listBoxId}
      aria-haspopup="listbox"
      aria-expanded={isFocused}
    >
      <InputArea themes={theme}>
        <List themes={theme}>
          {selectedItems.map(({ value, label, deletable = true }, i) => (
            <li key={i}>
              <SelectedItem themes={theme} className={deletable ? 'deletable' : ''}>
                {label}

                {deletable && (
                  <DeleteButton
                    type="button"
                    themes={theme}
                    className={DELETE_BUTTON_CLASS_NAME}
                    onClick={() => onDelete({ value, label })}
                  >
                    <DeleteIcon
                      size={11}
                      color={theme.palette.TEXT_BLACK}
                      visuallyHiddenText="delete"
                    />
                  </DeleteButton>
                )}
              </SelectedItem>
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
                setInputValue(e.currentTarget.value)
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
              aria-activedescendant={aria.activeDescendant}
              aria-autocomplete="list"
              aria-controls={aria.listBoxId}
            />
          </InputWrapper>

          {selectedItems.length === 0 && placeholder && !isFocused && (
            <li>
              <Placeholder themes={theme}>{placeholder}</Placeholder>
            </li>
          )}
        </List>
      </InputArea>

      <Suffix themes={theme}>
        <FaCaretDownIcon color={isFocused ? theme.palette.TEXT_BLACK : theme.palette.BORDER} />
      </Suffix>

      {renderListBox()}
    </Container>
  )
}

const Container = styled.div<{ themes: Theme; width: number | string }>`
  ${({ themes, width }) => {
    const { frame, size, palette } = themes

    return css`
      display: inline-flex;
      min-width: calc(62px + 32px + ${size.pxToRem(size.space.XXS)} * 2);
      width: ${typeof width === 'number' ? `${width}px` : width};
      min-height: 40px;
      border-radius: ${frame.border.radius.m};
      border: ${frame.border.default};
      box-sizing: border-box;
      background-color: #fff;
      cursor: text;

      &.active {
        border-color: ${palette.MAIN};
      }

      &.error {
        border-color: ${palette.DANGER};
      }

      &.disabled {
        background-color: ${palette.COLUMN};
        cursor: not-allowed;
      }
    `
  }}
`
const InputArea = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { fontSize, spacing } = themes

    return css`
      /* for IE */
      /* stylelint-disable-next-line length-zero-no-unit */
      flex: 1 1 0px;
      overflow-y: auto;
      max-height: 300px;
      padding-left: ${fontSize.pxToRem(spacing.XXS)};
    `
  }}
`
const smallMargin = 6.5
const borderWidth = 1
const List = styled.ul<{ themes: Theme }>`
  ${({ themes }) => {
    const {
      fontSize: { pxToRem },
      spacing,
    } = themes

    return css`
      display: flex;
      flex-wrap: wrap;
      margin: ${pxToRem(smallMargin - borderWidth)} 0 0;
      padding: 0;
      list-style: none;

      > li {
        min-height: 27px;
        margin-right: ${pxToRem(spacing.XXS)};
        margin-bottom: ${pxToRem(smallMargin - borderWidth)};
      }
    `
  }}
`
const SelectedItem = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { frame, palette, size } = themes

    return css`
      position: relative;
      padding: ${size.pxToRem(size.space.XXS - borderWidth)};
      border-radius: calc(${size.font.SHORT}px + ${size.pxToRem(size.space.XXS - borderWidth)} * 2);
      border: ${frame.border.default};
      background-color: #fff;
      color: ${palette.TEXT_BLACK};
      font-size: ${size.font.SHORT}px;
      line-height: 1;

      &.deletable {
        padding-right: ${size.pxToRem(size.space.M)};
      }
    `
  }}
`
const DeleteButton = styled.button<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes

    return css`
      position: absolute;
      top: 0;
      right: 0;
      width: calc(11px + ${size.pxToRem(size.space.XXS)} * 2);
      height: calc(11px + ${size.pxToRem(size.space.XXS)} * 2);
      padding: ${size.pxToRem(size.space.XXS)};
      border-radius: 50%;
      border: none;
      background-color: transparent;
      cursor: pointer;
    `
  }}
`
const DeleteIcon = styled(FaTimesCircleIcon)`
  vertical-align: 1px;
`
const InputWrapper = styled.li`
  &.hidden {
    position: absolute;
    opacity: 0;
  }

  /* for IE */
  /* stylelint-disable-next-line length-zero-no-unit */
  flex: 1 1 0px;
`
const Input = styled.input<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes

    return css`
      min-width: 80px;
      width: 100%;
      border: none;
      font-size: ${size.font.TALL}px;
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
    const { palette, size } = themes

    return css`
      margin: 0;
      color: ${palette.TEXT_GREY};
      font-size: ${size.font.TALL}px;
      line-height: 25px;
    `
  }}
`
const Suffix = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { spacing, fontSize, border } = themes

    return css`
      display: flex;
      justify-content: center;
      align-items: center;
      margin: ${fontSize.pxToRem(spacing.XXS)} 0;
      padding: 0 ${fontSize.pxToRem(spacing.XXS)};
      border-left: ${border.shorthand};
      box-sizing: border-box;
    `
  }}
`
