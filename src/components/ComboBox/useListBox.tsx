import React, {
  KeyboardEvent,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { usePortal } from '../../hooks/usePortal'
import { useId } from '../../hooks/useId'
import { FaPlusCircleIcon } from '../Icon'
import { Loader } from '../Loader'

import { ComboBoxItem, ComboBoxOption } from './types'
import { usePartialRendering } from './usePartialRendering'
import { useActiveOption } from './useActiveOption'

type Props<T> = {
  options: Array<ComboBoxOption<T>>
  onAdd?: (label: string) => void
  onSelect: (item: ComboBoxItem<T>) => void
  isExpanded: boolean
  isLoading?: boolean
  triggerRef: RefObject<HTMLElement>
  classNames: {
    dropdownList: string
    addButton: string
    selectButton: string
    noItems: string
  }
}

type Rect = {
  top: number
  left: number
  width: number
  height?: number
}

export function useListBox<T>({
  options,
  onAdd,
  onSelect,
  isExpanded,
  isLoading,
  triggerRef,
  classNames,
}: Props<T>) {
  const [navigationType, setNavigationType] = useState<'pointer' | 'key'>('pointer')
  const { activeOption, setActiveOption, moveActivePositionDown, moveActivePositionUp } =
    useActiveOption({ options })

  useEffect(() => {
    if (!isExpanded) {
      setActiveOption(null)
    }
  }, [isExpanded, setActiveOption])

  const bottomIntersectionRef = useRef<HTMLDivElement>(null)
  const partialOptions = usePartialRendering({
    items: options,
    bottomIntersectionRef,
    minLength: useMemo(
      () => (activeOption === null ? 0 : options.indexOf(activeOption)) + 1,
      [activeOption, options],
    ),
  })

  const listBoxRef = useRef<HTMLDivElement>(null)
  const [listBoxRect, setListBoxRect] = useState<Rect>({
    top: 0,
    left: 0,
    width: 0,
  })

  const calculateRect = useCallback(() => {
    if (!listBoxRef.current || !triggerRef.current) {
      return
    }
    const rect = triggerRef.current.getBoundingClientRect()
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

    setListBoxRect({
      top,
      left: rect.left + window.pageXOffset,
      width: rect.width,
      height,
    })
  }, [listBoxRef, triggerRef])

  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // actionOption の要素が表示される位置までリストボックス内をスクロールさせる
    if (
      navigationType !== 'key' ||
      activeOption === null ||
      !activeRef.current ||
      !listBoxRef.current
    ) {
      return
    }
    const activeRect = activeRef.current.getBoundingClientRect()
    const containerRect = listBoxRef.current.getBoundingClientRect()

    const isActiveTopOutside = activeRect.top < containerRect.top
    const isActiveBottomOutside = activeRect.bottom > containerRect.bottom

    if (isActiveTopOutside) {
      listBoxRef.current.scrollTop -= containerRect.top - activeRect.top
    } else if (isActiveBottomOutside) {
      listBoxRef.current.scrollTop += activeRect.bottom - containerRect.bottom
    }
  }, [activeOption, listBoxRef, navigationType])

  useEffect(() => {
    if (!isExpanded || !triggerRef.current) {
      return
    }
    // 初回表示時とトリガ要素のりサイズ時に矩形の再計算を行う
    const resizeObserver = new ResizeObserver(() => {
      calculateRect()
    })
    resizeObserver.observe(triggerRef.current)
    return () => resizeObserver.disconnect()
  }, [calculateRect, isExpanded, triggerRef])

  const handleKeyDwon = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      setNavigationType('key')
      if (e.key === 'Down' || e.key === 'ArrowDown') {
        e.stopPropagation()
        moveActivePositionDown()
      } else if (e.key === 'Up' || e.key === 'ArrowUp') {
        e.stopPropagation()
        moveActivePositionUp()
      } else if (e.key === 'Enter') {
        if (activeOption === null) {
          return
        }
        e.stopPropagation()
        if (activeOption.isNew) {
          onAdd && onAdd(activeOption.item.label)
        } else {
          onSelect(activeOption.item)
        }
      } else {
        setActiveOption(null)
      }
    },
    [activeOption, moveActivePositionDown, moveActivePositionUp, onAdd, onSelect, setActiveOption],
  )

  const theme = useTheme()
  const { portalRoot } = usePortal()
  const listBoxId = useId()

  const renderListBox = useCallback(() => {
    return createPortal(
      <Container
        {...listBoxRect}
        themes={theme}
        id={listBoxId}
        ref={listBoxRef}
        role="listbox"
        aria-hidden={!isExpanded}
        className={classNames.dropdownList}
      >
        {!isExpanded ? null : isLoading ? (
          <LoaderWrapper themes={theme}>
            <Loader />
          </LoaderWrapper>
        ) : (
          <>
            {partialOptions.map((option) => {
              const isActive = option.id === activeOption?.id
              const className = isActive ? 'active' : ''
              const { item, selected, isNew } = option
              const { label, disabled } = item
              if (isNew) {
                return (
                  <AddButton
                    key={option.id}
                    themes={theme}
                    onClick={() => {
                      onAdd && onAdd(label)
                    }}
                    onMouseOver={() => {
                      setNavigationType('pointer')
                      setActiveOption(option)
                    }}
                    id={option.id}
                    role="option"
                    className={`${className} ${classNames.addButton}`}
                    ref={isActive ? activeRef : undefined}
                  >
                    <AddIcon color={theme.color.TEXT_LINK} themes={theme} />
                    <AddText themes={theme}>「{label}」を追加</AddText>
                  </AddButton>
                )
              }
              return (
                <SelectButton
                  key={option.id}
                  type="button"
                  themes={theme}
                  disabled={disabled}
                  onClick={() => {
                    onSelect(item)
                  }}
                  onMouseOver={() => {
                    setNavigationType('pointer')
                    setActiveOption(option)
                  }}
                  id={option.id}
                  role="option"
                  className={`${className} ${classNames.selectButton}`}
                  aria-selected={selected}
                  ref={isActive ? activeRef : undefined}
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
  }, [
    activeOption?.id,
    classNames.addButton,
    classNames.dropdownList,
    classNames.noItems,
    classNames.selectButton,
    isExpanded,
    isLoading,
    listBoxId,
    listBoxRect,
    listBoxRef,
    onAdd,
    onSelect,
    options.length,
    partialOptions,
    portalRoot,
    setActiveOption,
    theme,
  ])

  return {
    renderListBox,
    activeOption,
    handleKeyDwon,
    listBoxId,
    listBoxRef,
  }
}

const Container = styled.div<
  Rect & {
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
