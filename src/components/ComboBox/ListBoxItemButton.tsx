import React, { RefObject, useCallback, useContext } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { FaPlusCircleIcon } from '../Icon'

import { ComboBoxContext } from './ComboBoxContext'
import { ComboBoxOption } from './types'

type Props<T> = {
  option: ComboBoxOption<T>
  isActive: boolean
  onAdd: (option: ComboBoxOption<T>) => void
  onSelect: (option: ComboBoxOption<T>) => void
  onMouseOver: (option: ComboBoxOption<T>) => void
  activeRef: RefObject<HTMLButtonElement>
}

function ListBoxItemButton<T>({
  option,
  isActive,
  onAdd,
  onSelect,
  onMouseOver,
  activeRef,
}: Props<T>) {
  const className = isActive ? 'active' : ''
  const { item, selected, isNew } = option
  const { label, disabled } = item

  const handleAdd = useCallback(() => {
    onAdd(option)
  }, [onAdd, option])

  const handleSelect = useCallback(() => {
    onSelect(option)
  }, [onSelect, option])

  const handleMouseOver = useCallback(() => {
    onMouseOver(option)
  }, [onMouseOver, option])

  const theme = useTheme()
  const { listBoxClassNames: classNames } = useContext(ComboBoxContext)

  return isNew ? (
    <AddButton
      key={option.id}
      themes={theme}
      onClick={handleAdd}
      onMouseOver={handleMouseOver}
      id={option.id}
      role="option"
      className={`${className} ${classNames.addButton}`}
      ref={isActive ? activeRef : undefined}
    >
      <AddIcon color={theme.color.TEXT_LINK} themes={theme} />
      <AddText themes={theme}>「{label}」を追加</AddText>
    </AddButton>
  ) : (
    <SelectButton
      key={option.id}
      type="button"
      themes={theme}
      disabled={disabled}
      onClick={handleSelect}
      onMouseOver={handleMouseOver}
      id={option.id}
      role="option"
      className={`${className} ${classNames.selectButton}`}
      aria-selected={selected}
      ref={isActive ? activeRef : undefined}
    >
      {label}
    </SelectButton>
  )
}
const typedMemo: <T>(c: T) => T = React.memo
const Memoized = typedMemo(ListBoxItemButton)
export { Memoized as ListBoxItemButton }

const SelectButton = styled.button<{ themes: Theme }>`
  ${({ themes }) => {
    const { fontSize, leading, spacingByChar, color } = themes

    return css`
      display: block;
      min-width: 100%;
      border: none;
      padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
      background-color: ${color.WHITE};
      font-size: ${fontSize.M};
      line-height: ${leading.TIGHT};
      text-align: left;
      cursor: pointer;

      &.active {
        background-color: ${color.hoverColor(color.WHITE)};
        color: inherit;
      }

      &[aria-selected='true'] {
        background-color: ${color.MAIN};
        color: ${color.TEXT_WHITE};
        &.active {
          background-color: ${color.hoverColor(color.MAIN)};
        }
      }

      &[disabled] {
        color: ${color.TEXT_DISABLED};
        cursor: not-allowed;
      }
    `
  }}
`
const AddButton = styled(SelectButton)`
  display: flex;
  align-items: center;
  min-width: 100%;
`
const AddIcon = styled(FaPlusCircleIcon)<{ themes: Theme }>`
  ${({ themes }) => {
    const { spacingByChar } = themes

    return css`
      position: relative;
      top: -1px;
      margin-right: ${spacingByChar(0.25)};
    `
  }}
`
const AddText = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { color } = themes

    return css`
      color: ${color.TEXT_LINK};
    `
  }}
`
