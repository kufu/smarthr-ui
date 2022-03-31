import React, { useCallback, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { usePortal } from '../../hooks/usePortal'
import { ComboBoxItem, ComboBoxOption } from './types'
import { usePartialRendering } from './usePartialRendering'

import { FaPlusCircleIcon } from '../Icon'
import { Loader } from '../Loader'

type Args<T> = {
  options: Array<ComboBoxOption<T>>
  activeOptionId: string | null
  onHoverOption: (option: ComboBoxOption<T>) => void
  onAdd?: (label: string) => void
  onSelect: (item: ComboBoxItem<T>) => void
  isExpanded: boolean
  isLoading?: boolean
  listBoxId: string
  classNames: {
    dropdownList: string
    addButton: string
    selectButton: string
    noItems: string
  }
}

type DropDownStyle = {
  top: number
  left: number
  width: number
  height?: number
}

export function useListBox<T>({
  options,
  activeOptionId,
  onHoverOption,
  onAdd,
  onSelect,
  isExpanded,
  isLoading,
  listBoxId,
  classNames,
}: Args<T>) {
  const [dropdownStyle, setDropdownStyle] = useState<DropDownStyle>({
    top: 0,
    left: 0,
    width: 0,
  })
  const calculateDropdownRect = useCallback((triggerElement: Element) => {
    if (!listBoxRef.current) {
      return
    }
    const rect = triggerElement.getBoundingClientRect()
    const bottomSpace = window.innerHeight - rect.bottom
    const topSpace = rect.top
    const listBoxHeight = Math.min(
      listBoxRef.current.scrollHeight,
      parseInt(getComputedStyle(listBoxRef.current).maxHeight, 10),
    )
    const offset = 2

    let top = 0
    let height: number | undefined = undefined

    if (bottomSpace >= listBoxHeight) {
      // 下側に十分なスペースがある場合は下側に通常表示
      top = rect.top + rect.height - offset + window.pageYOffset
    } else if (topSpace >= listBoxHeight) {
      // 上側に十分なスペースがある場合は上側に通常表示
      top = rect.top - listBoxHeight + offset + window.pageYOffset
    } else if (topSpace > bottomSpace) {
      // 上下に十分なスペースがなく、上側の方がスペースが大きい場合は上側に縮めて表示
      top = rect.top - topSpace + offset + window.pageYOffset
      height = topSpace
    } else {
      // 下側に縮めて表示
      top = rect.top + rect.height - offset + window.pageYOffset
      height = bottomSpace
    }

    setDropdownStyle({
      top,
      left: rect.left + window.pageXOffset,
      width: rect.width,
      height,
    })
  }, [])

  const bottomIntersectionRef = useRef<HTMLDivElement>(null)
  const partialOptions = usePartialRendering({
    items: options,
    bottomElement: bottomIntersectionRef.current,
  })

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
        className={classNames.dropdownList}
      >
        {isLoading ? (
          <LoaderWrapper themes={theme}>
            <Loader />
          </LoaderWrapper>
        ) : (
          <>
            {partialOptions.map((option) => {
              const isActive = option.id === activeOptionId
              const className = isActive ? 'active' : ''
              const { item, selected, isNew } = option
              const { label, disabled } = item
              if (isNew) {
                return (
                  <AddButton
                    key={`add-${label}`}
                    themes={theme}
                    onClick={() => {
                      onAdd && onAdd(label)
                    }}
                    onMouseOver={() => onHoverOption(option)}
                    id={option.id}
                    role="option"
                    className={`${className} ${classNames.addButton}`}
                  >
                    <AddIcon color={theme.color.TEXT_LINK} $theme={theme} />
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
                  onClick={() => {
                    onSelect(item)
                  }}
                  onMouseOver={() => onHoverOption(option)}
                  id={option.id}
                  role="option"
                  className={`${className} ${classNames.selectButton}`}
                  aria-selected={selected}
                >
                  {label}
                </SelectButton>
              )
            })}

            {options.length === 0 && (
              <NoItems
                themes={theme}
                role="alert"
                aria-live="polite"
                className={classNames.noItems}
              >
                一致する選択肢がありません
              </NoItems>
            )}
          </>
        )}
        <div ref={bottomIntersectionRef} />
      </Container>,
      portalRoot,
    )
  }
  return {
    renderListBox,
    calculateDropdownRect,
    listBoxRef,
  }
}

const Container = styled.div<
  DropDownStyle & {
    themes: Theme
  }
>(({ top, left, width, height, themes }) => {
  const { color, fontSize, spacingByChar, radius, shadow, zIndex } = themes
  return css`
    position: absolute;
    top: ${top}px;
    left: ${left}px;
    overflow-y: auto;

    /*
     縦スクロールに気づきやすくするために8個目のアイテムが半分見切れるように max-height を算出
     = (アイテムのフォントサイズ + アイテムの上下padding) * 7.5 + コンテナの上padding
    */
    max-height: calc((${fontSize.M} + ${spacingByChar(0.5)} * 2) * 7.5 + ${spacingByChar(0.5)});
    ${height !== undefined &&
    css`
      height: ${height}px;
    `}
    width: ${width}px;
    padding: ${spacingByChar(0.5)} 0;
    border-radius: ${radius.m};
    box-shadow: ${shadow.LAYER3};
    background-color: ${color.WHITE};
    white-space: nowrap;
    box-sizing: border-box;
    &[aria-hidden='true'] {
      display: none;
    }
    z-index: ${zIndex.OVERLAP};
  `
})
const NoItems = styled.p<{ themes: Theme }>`
  ${({ themes }) => {
    const { color, fontSize, spacingByChar } = themes

    return css`
      margin: 0;
      padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
      background-color: ${color.WHITE};
      font-size: ${fontSize.M};
    `
  }}
`
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
      line-height: ${leading.NONE};
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
    const { color } = themes

    return css`
      color: ${color.TEXT_LINK};
    `
  }}
`
const LoaderWrapper = styled.div<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => {
    return css`
      display: flex;
      align-items: center;
      justify-content: center;
      padding: ${spacingByChar(1)};
    `
  }}
`
