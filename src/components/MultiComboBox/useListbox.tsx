import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { usePortal } from '../../hooks/usePortal'
import { useId } from '../../hooks/useId'

import { Icon } from '../Icon'

type Option = {
  items: Array<{ value: string; label: string; disabled?: boolean }>
  inputValue: string
  onAdd?: (label: string) => void
  onSelect: (option: { value: string; label: string }) => void
  isExpanded: boolean
  flags: {
    addable: boolean
    duplicate: boolean
    noItems: boolean
  }
}

export function useListbox({ items, inputValue, onAdd, onSelect, isExpanded, flags }: Option) {
  const [dropdownStyle, setDropdownStyle] = useState({
    top: 0,
    left: 0,
    width: 0,
  })
  const [activeOptionIndex, setActiveOptionIndex] = useState(0)

  const addingOptionCount = flags.addable ? 1 : 0
  const optionCount = addingOptionCount + items.length

  const activateOption = useCallback(
    (index: number) => {
      if (flags.noItems) {
        return
      }
      setActiveOptionIndex((index + optionCount) % optionCount)
    },
    [flags, optionCount],
  )

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'Tab':
          blur()
          break
        case 'ArrowDown':
        case 'Down':
          e.preventDefault()
          activateOption(activeOptionIndex + 1)
          break
        case 'ArrowUp':
        case 'Up':
          e.preventDefault()
          activateOption(activeOptionIndex - 1)
          break
        case 'Enter': {
          e.preventDefault()
          if (flags.addable && activeOptionIndex === 0) {
            onAdd && onAdd(inputValue)
            return
          }
          const itemIndex = activeOptionIndex - addingOptionCount
          const activeItem = items[itemIndex]
          if (activeItem) {
            const { value, label } = activeItem
            onSelect({ value, label })
          }
          break
        }
      }
    },
    [
      activateOption,
      activeOptionIndex,
      addingOptionCount,
      flags.addable,
      inputValue,
      items,
      onAdd,
      onSelect,
    ],
  )

  const listboxId = useId()
  const addingButtonId = useId()
  const optionIdPrefix = useId()
  const getOptionId = useCallback(
    (item: { value: string; label: string }) => {
      return `${optionIdPrefix}-${item.label}`
    },
    [optionIdPrefix],
  )
  const activeDescendant = (() => {
    if (flags.addable && activeOptionIndex === 0) {
      return addingButtonId
    }
    const item = items[activeOptionIndex - addingOptionCount]
    if (item) {
      return getOptionId(item)
    }
    return undefined
  })()

  useEffect(() => {
    // correct the focus index in dropdown to fit actual row count
    setActiveOptionIndex(Math.max(Math.min(activeOptionIndex, optionCount - 1), 0))
  }, [activeOptionIndex, optionCount])

  const theme = useTheme()
  const { portalRoot } = usePortal()
  const listboxRef = useRef<HTMLDivElement>(null)

  const renderListbox = () => {
    return createPortal(
      <Container
        {...dropdownStyle}
        themes={theme}
        id={listboxId}
        className={isExpanded ? undefined : 'hidden'}
        ref={listboxRef}
        role="listbox"
      >
        {flags.addable && (
          <AddButton
            themes={theme}
            onClick={() => onAdd && onAdd(inputValue)}
            onMouseOver={() => setActiveOptionIndex(0)}
            className={activeOptionIndex === 0 ? 'active' : undefined}
            id={addingButtonId}
            role="option"
          >
            <AddIcon
              name="fa-plus-circle"
              size={14}
              color={theme.palette.TEXT_LINK}
              $theme={theme}
            />
            <AddText themes={theme}>「{inputValue}」を追加</AddText>
          </AddButton>
        )}

        {items.map(({ label, value, disabled: itemDisabled = false }, i) => (
          <SelectButton
            key={label}
            type="button"
            themes={theme}
            disabled={itemDisabled}
            onClick={() => onSelect({ value, label })}
            onMouseOver={() => setActiveOptionIndex(i + addingOptionCount)}
            className={activeOptionIndex === i + addingOptionCount ? 'active' : undefined}
            id={getOptionId({ label, value })}
            role="option"
          >
            {label}
          </SelectButton>
        ))}

        {flags.duplicate && (
          <NoItems themes={theme} aria-live="polite">
            重複する選択肢は追加できません
          </NoItems>
        )}

        {flags.noItems && (
          <NoItems themes={theme} aria-live="polite">
            一致する選択肢がありません
          </NoItems>
        )}
      </Container>,
      portalRoot,
    )
  }
  return {
    renderListbox,
    setDropdownStyle,
    resetActiveOptionIndex: () => setActiveOptionIndex(0),
    handleInputKeyDown,
    listboxRef,
    aria: {
      listboxId,
      activeDescendant,
    },
  }
}

const Container = styled.div<{ top: number; left: number; width: number; themes: Theme }>(
  ({ top, left, width, themes }) => {
    const { size, frame } = themes
    return css`
      position: absolute;
      top: ${top}px;
      left: ${left}px;
      overflow-y: auto;
      max-height: 300px;
      width: ${width}px;
      padding: ${size.pxToRem(size.space.XXS)} 0;
      border-radius: ${frame.border.radius.m};
      box-shadow: rgba(51, 51, 51, 0.3) 0 4px 10px 0;
      background-color: #fff;
      white-space: nowrap;
      box-sizing: border-box;
      &.hidden {
        display: none;
      }
      z-index: ${themes.zIndex.OVERLAP};
    `
  },
)
const NoItems = styled.p<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes

    return css`
      margin: 0;
      padding: ${size.pxToRem(size.space.XXS)} ${size.pxToRem(size.space.XS)};
      background-color: #fff;
      font-size: ${size.font.TALL}px;
    `
  }}
`
const SelectButton = styled.button<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, palette } = themes

    return css`
      display: block;
      width: 100%;
      border: none;
      padding: ${size.pxToRem(size.space.XXS)} ${size.pxToRem(size.space.XS)};
      background-color: #fff;
      font-size: ${size.font.TALL}px;
      text-align: left;
      cursor: pointer;

      &:hover:not([disabled]),
      &.active {
        background-color: ${palette.COLUMN};
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
const AddIcon = styled(Icon)<{ $theme: Theme }>`
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
