import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { usePortal } from '../../hooks/usePortal'
import { useId } from '../../hooks/useId'
import { ComboBoxItem } from './types'

import { FaPlusCircleIcon } from '../Icon'
import { Loader } from '../Loader'

const OPTION_INCREMENT_AMOUNT = 100

type Args<T> = {
  items: Array<ComboBoxItem<T> & { isSelected?: boolean }>
  inputValue?: string
  onAdd?: (label: string) => void
  onSelect: (item: ComboBoxItem<T>) => void
  isExpanded: boolean
  isAddable: boolean
  isDuplicate: boolean
  hasNoMatch: boolean
  isLoading?: boolean
  listBoxId: string
  classNames: {
    dropdownList: string
    addButton: string
    selectButton: string
    noItems: string
  }
}

type Option<T> = ComboBoxItem<T> & {
  isAdding?: boolean
  isSelected?: boolean
}

function optionToItem<T>(option: Option<T>): ComboBoxItem<T> {
  const { isAdding, isSelected, ...props } = option
  return { ...props }
}

type DropDownStyle = {
  top: number
  left: number
  width: number
  height?: number
}

export function useListBox<T>({
  items,
  inputValue = '',
  onAdd,
  onSelect,
  isExpanded,
  isAddable,
  isDuplicate,
  hasNoMatch,
  isLoading,
  listBoxId,
  classNames,
}: Args<T>) {
  const [dropdownStyle, setDropdownStyle] = useState<DropDownStyle>({
    top: 0,
    left: 0,
    width: 0,
  })
  const [activeOptionIndex, setActiveOptionIndex] = useState<number | null>(null)

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

  const [optionLength, setOptionLength] = useState(OPTION_INCREMENT_AMOUNT)
  useEffect(() => {
    // 表示 option 数を初期化
    setOptionLength(OPTION_INCREMENT_AMOUNT)
  }, [items])
  const options: Array<Option<T>> = useMemo(() => {
    const limitedItems = items.slice(0, optionLength + 1)
    if (isAddable) {
      const addingOption = { label: inputValue, value: inputValue, isAdding: true }
      return [addingOption, ...limitedItems]
    }
    return limitedItems
  }, [inputValue, isAddable, items, optionLength])

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
    (e: React.KeyboardEvent<HTMLElement>) => {
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

  const optionIdPrefix = useId()
  const getOptionId = useCallback(
    (optionIndex: number | null) => {
      if (optionIndex === null) {
        return undefined
      }
      return `${optionIdPrefix}-${optionIndex}`
    },
    [optionIdPrefix],
  )
  const activeDescendant = getOptionId(activeOptionIndex)

  const theme = useTheme()
  const { portalRoot } = usePortal()
  const listBoxRef = useRef<HTMLDivElement>(null)

  const bottomIntersectionRef = useRef<HTMLDivElement>(null)
  const isDisplayingPartial = optionLength < items.length
  const scrollObserver = useMemo(
    // スクロール最下部に到達する度に表示する option 数を増加させるための IntersectionObserver
    () =>
      new IntersectionObserver((entries) => {
        const entry = entries[0]
        if (entry && entry.isIntersecting && isDisplayingPartial) {
          setOptionLength((current) => current + OPTION_INCREMENT_AMOUNT)
        }
      }),
    [isDisplayingPartial],
  )
  useEffect(() => {
    // IntersectionObserver を設定
    if (!bottomIntersectionRef.current) {
      return
    }
    scrollObserver.observe(bottomIntersectionRef.current)
    return () => scrollObserver.disconnect()
  }, [scrollObserver])

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
              const id = getOptionId(i)
              const isActive = activeOptionIndex === i
              const className = isActive ? 'active' : ''
              const { label, disabled, isAdding, isSelected } = option
              if (isAdding) {
                return (
                  <AddButton
                    key={`add-${label}`}
                    themes={theme}
                    onClick={() => {
                      onAdd && onAdd(label)
                    }}
                    onMouseOver={() => setActiveOptionIndex(0)}
                    id={id}
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
                    onSelect(optionToItem(option))
                  }}
                  onMouseOver={() => setActiveOptionIndex(i)}
                  id={id}
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
        <div ref={bottomIntersectionRef} />
      </Container>,
      portalRoot,
    )
  }
  return {
    renderListBox,
    calculateDropdownRect,
    resetActiveOptionIndex: () => setActiveOptionIndex(null),
    handleInputKeyDown,
    listBoxRef,
    activeOptionId: activeDescendant,
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
