import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { usePortal } from '../../hooks/usePortal'
import { useId } from '../../hooks/useId'
import { Item } from './types'

import { FaPlusCircleIcon } from '../Icon'
import { Loader } from '../Loader'

type Args<T> = {
  items: Array<Item<T> & { isSelected?: boolean }>
  inputValue: string
  onAdd?: (label: string) => void
  onSelect: (item: Item<T>) => void
  isExpanded: boolean
  isAddable: boolean
  isDuplicate: boolean
  hasNoMatch: boolean
  isLoading?: boolean
  classNames: {
    dropdownList: string
    addButton: string
    selectButton: string
    noItems: string
  }
}

type Option<T> = Item<T> & {
  isAdding?: boolean
  isSelected?: boolean
}

function optionToItem<T>(option: Option<T>): Item<T> {
  const { isAdding, isSelected, ...props } = option
  return { ...props }
}

export function useListBox<T>({
  items,
  inputValue,
  onAdd,
  onSelect,
  isExpanded,
  isAddable,
  isDuplicate,
  hasNoMatch,
  isLoading,
  classNames,
}: Args<T>) {
  const [dropdownStyle, setDropdownStyle] = useState({
    top: 0,
    left: 0,
    width: 0,
  })
  const [activeOptionIndex, setActiveOptionIndex] = useState<number | null>(null)

  const options: Array<Option<T>> = useMemo(() => {
    if (isAddable) {
      const addingOption = { label: inputValue, value: inputValue, isAdding: true }
      return [addingOption, ...items]
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
      if (isLoading) {
        return
      }
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
            onSelect(optionToItem(activeOption))
          }
          break
        }
      }
    },
    [activeOptionIndex, isLoading, moveActiveOptionIndex, onAdd, onSelect, options],
  )

  const listBoxId = useId()
  const addingButtonId = useId()
  const optionIdPrefix = useId()
  const getOptionId = useCallback(
    (option: Option<T>) => {
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
        className={classNames.dropdownList}
      >
        {isLoading ? (
          <LoaderWrapper themes={theme}>
            <Loader />
          </LoaderWrapper>
        ) : (
          <>
            {options.map((option, i) => {
              const isActive = activeOptionIndex === i
              const className = isActive ? 'active' : ''
              const { label, disabled, isAdding, isSelected } = option
              if (isAdding) {
                return (
                  <AddButton
                    key={`add-${label}`}
                    themes={theme}
                    onClick={() => {
                      // IE対応: 外側クリック判定が完了するまで要素が除去されないようにディレイを入れる
                      setTimeout(() => {
                        onAdd && onAdd(label)
                      }, 0)
                    }}
                    onMouseOver={() => setActiveOptionIndex(0)}
                    id={addingButtonId}
                    role="option"
                    className={`${className} ${classNames.addButton}`}
                  >
                    <AddIcon size={14} color={theme.color.TEXT_LINK} $theme={theme} />
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
                    // IE対応: 外側クリック判定が完了するまで要素が除去されないようにディレイを入れる
                    setTimeout(() => {
                      onSelect(optionToItem(option))
                    }, 0)
                  }}
                  onMouseOver={() => setActiveOptionIndex(i)}
                  id={getOptionId(option)}
                  role="option"
                  className={`${className} ${classNames.selectButton}`}
                  aria-selected={isSelected}
                >
                  {label}
                </SelectButton>
              )
            })}

            {isDuplicate && (
              <NoItems
                themes={theme}
                role="alert"
                aria-live="polite"
                className={classNames.noItems}
              >
                重複する選択肢は追加できません
              </NoItems>
            )}

            {hasNoMatch && (
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
    const { spacingByChar, radius, shadow } = themes
    return css`
      position: absolute;
      top: ${top}px;
      left: ${left}px;
      overflow-y: auto;
      max-height: 300px;
      width: ${width}px;
      padding: ${spacingByChar(0.5)} 0;
      border-radius: ${radius.m};
      box-shadow: ${shadow.LAYER3};
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
    const { fontSize, spacingByChar } = themes

    return css`
      margin: 0;
      padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
      background-color: #fff;
      font-size: ${fontSize.M};
    `
  }}
`
const SelectButton = styled.button<{ themes: Theme }>`
  ${({ themes }) => {
    const { fontSize, spacingByChar, color } = themes

    return css`
      display: block;
      min-width: 100%;
      border: none;
      padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
      background-color: #fff;
      font-size: ${fontSize.M};
      text-align: left;
      cursor: pointer;

      &.active {
        background-color: ${color.COLUMN};
        color: inherit;
      }

      &[aria-selected='true'] {
        background-color: ${color.MAIN};
        color: #fff;
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
