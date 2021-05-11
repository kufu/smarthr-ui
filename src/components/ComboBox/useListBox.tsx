import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { usePortal } from '../../hooks/usePortal'
import { useId } from '../../hooks/useId'

import { FaPlusCircleIcon } from '../Icon'

type Args = {
  items: Array<{ value: string; label: string; disabled?: boolean; isSelected?: boolean }>
  inputValue: string
  onAdd?: (label: string) => void
  onSelect: (option: { value: string; label: string }) => void
  isExpanded: boolean
  isAddable: boolean
  isDuplicate: boolean
  hasNoMatch: boolean
}

type Option = {
  label: string
  value: string
  disabled?: boolean
  isAdding?: boolean
  isSelected?: boolean
}

export function useListBox({
  items,
  inputValue,
  onAdd,
  onSelect,
  isExpanded,
  isAddable,
  isDuplicate,
  hasNoMatch,
}: Args) {
  const [dropdownStyle, setDropdownStyle] = useState({
    top: 0,
    left: 0,
    width: 0,
  })
  const [activeOptionIndex, setActiveOptionIndex] = useState<number | null>(null)

  const options: Option[] = useMemo(() => {
    if (isAddable) {
      return [{ label: inputValue, value: inputValue, isAdding: true }, ...items]
    }
    return items
  }, [inputValue, isAddable, items])

  const moveActiveOptionIndex = useCallback(
    (currentIndex: number | null, delta: -1 | 1) => {
      if (options.filter((option) => !option.disabled).length === 0) {
        return
      }
      const nextIndex = (() => {
        if (currentIndex === null) {
          if (delta === 1) {
            return 0
          } else {
            return options.length - 1
          }
        }
        return (currentIndex + delta + options.length) % options.length
      })()
      const nextActive = options[nextIndex]
      if (nextActive && nextActive.disabled) {
        // skip disabled item
        moveActiveOptionIndex(nextIndex, delta)
        return
      }
      setActiveOptionIndex(nextIndex)
    },
    [options],
  )

  useEffect(() => {
    // correct the focus index in dropdown to fit actual row count
    if (activeOptionIndex === null) {
      return
    }
    const corrected = Math.max(Math.min(activeOptionIndex, options.length - 1), 0)
    const active = options[corrected]
    if (!active || active.disabled) {
      setActiveOptionIndex(null)
      return
    }
    setActiveOptionIndex(corrected)
  }, [activeOptionIndex, options])

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'ArrowDown':
        case 'Down':
          e.preventDefault()
          moveActiveOptionIndex(activeOptionIndex, 1)
          break
        case 'ArrowUp':
        case 'Up':
          e.preventDefault()
          moveActiveOptionIndex(activeOptionIndex, -1)
          break
        case 'Enter': {
          e.preventDefault()
          if (activeOptionIndex === null) {
            return
          }
          const activeOption = options[activeOptionIndex]
          if (activeOption.isAdding) {
            onAdd && onAdd(activeOption.label)
            return
          }
          if (activeOption && !activeOption.disabled) {
            const { value, label } = activeOption
            onSelect({ value, label })
          }
          break
        }
      }
    },
    [activeOptionIndex, moveActiveOptionIndex, onAdd, onSelect, options],
  )

  const listBoxId = useId()
  const addingButtonId = useId()
  const optionIdPrefix = useId()
  const getOptionId = useCallback(
    (option: Option) => {
      if (option.isAdding) {
        return addingButtonId
      }
      return `${optionIdPrefix}-${option.label}`
    },
    [addingButtonId, optionIdPrefix],
  )
  const activeDescendant = (() => {
    if (activeOptionIndex === null) {
      return undefined
    }
    const activeOption = options[activeOptionIndex]
    if (activeOption) {
      return getOptionId(activeOption)
    }
    return undefined
  })()

  const theme = useTheme()
  const { portalRoot } = usePortal()
  const listBoxRef = useRef<HTMLDivElement>(null)

  const renderListBox = () => {
    return createPortal(
      <Container
        {...dropdownStyle}
        themes={theme}
        id={listBoxId}
        ref={listBoxRef}
        role="listbox"
        aria-hidden={!isExpanded}
      >
        {options.map((option, i) => {
          const isActive = activeOptionIndex === i
          const className = isActive ? 'active' : undefined
          const { value, label, disabled, isAdding, isSelected } = option
          if (isAdding) {
            return (
              <AddButton
                key={`add-${label}`}
                themes={theme}
                onClick={() => onAdd && onAdd(label)}
                onMouseOver={() => setActiveOptionIndex(0)}
                id={addingButtonId}
                role="option"
                className={className}
              >
                <AddIcon size={14} color={theme.palette.TEXT_LINK} $theme={theme} />
                <AddText themes={theme}>「{label}」を追加</AddText>
              </AddButton>
            )
          }
          return (
            <SelectButton
              key={`item-${label}`}
              type="button"
              themes={theme}
              disabled={disabled}
              onClick={() => onSelect({ value, label })}
              onMouseOver={() => setActiveOptionIndex(i)}
              id={getOptionId(option)}
              role="option"
              className={className}
              aria-selected={isSelected}
            >
              {label}
            </SelectButton>
          )
        })}

        {isDuplicate && (
          <NoItems themes={theme} role="alert" aria-live="polite">
            重複する選択肢は追加できません
          </NoItems>
        )}

        {hasNoMatch && (
          <NoItems themes={theme} role="alert" aria-live="polite">
            一致する選択肢がありません
          </NoItems>
        )}
      </Container>,
      portalRoot,
    )
  }
  return {
    renderListBox,
    setDropdownStyle,
    resetActiveOptionIndex: () => setActiveOptionIndex(null),
    handleInputKeyDown,
    listBoxRef,
    aria: {
      listBoxId,
      activeDescendant,
    },
  }
}

const Container = styled.div<{ top: number; left: number; width: number; themes: Theme }>(
  ({ top, left, width, themes }) => {
    const { spacingByChar, frame } = themes
    return css`
      position: absolute;
      top: ${top}px;
      left: ${left}px;
      overflow-y: auto;
      max-height: 300px;
      width: ${width}px;
      padding: ${spacingByChar(0.5)} 0;
      border-radius: ${frame.border.radius.m};
      box-shadow: rgba(51, 51, 51, 0.3) 0 4px 10px 0;
      background-color: #fff;
      white-space: nowrap;
      box-sizing: border-box;
      &[aria-hidden='true'] {
        display: none;
      }
      z-index: ${themes.zIndex.OVERLAP};
    `
  },
)
const NoItems = styled.p<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, spacingByChar } = themes

    return css`
      margin: 0;
      padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
      background-color: #fff;
      font-size: ${size.font.TALL}px;
    `
  }}
`
const SelectButton = styled.button<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, spacingByChar, palette } = themes

    return css`
      display: block;
      width: 100%;
      border: none;
      padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
      background-color: #fff;
      font-size: ${size.font.TALL}px;
      text-align: left;
      cursor: pointer;

      &.active {
        background-color: ${palette.COLUMN};
        color: inherit;
      }

      &[aria-selected='true'] {
        background-color: ${palette.MAIN};
        color: #fff;
      }

      &[disabled] {
        color: ${palette.TEXT_DISABLED};
        cursor: not-allowed;
      }
    `
  }}
`
const AddButton = styled(SelectButton)`
  display: flex;
  align-items: center;
`
const AddIcon = styled(FaPlusCircleIcon)<{ $theme: Theme }>`
  ${({ $theme }) => {
    const { size } = $theme

    return css`
      position: relative;
      top: -1px;
      margin-right: ${size.pxToRem(4)};
    `
  }}
`
const AddText = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { palette } = themes

    return css`
      color: ${palette.TEXT_LINK};
    `
  }}
`
