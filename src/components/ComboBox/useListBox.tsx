import React, {
  KeyboardEvent,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styled, { css } from 'styled-components'

import { useEnhancedEffect } from '../../hooks/useEnhancedEffect'
import { useId } from '../../hooks/useId'
import { usePortal } from '../../hooks/usePortal'
import { Theme, useTheme } from '../../hooks/useTheme'
import { FaInfoCircleIcon } from '../Icon'
import { Loader } from '../Loader'

import { ComboBoxContext } from './ComboBoxContext'
import { ListBoxItemButton } from './ListBoxItemButton'
import { ComboBoxItem, ComboBoxOption } from './types'
import { useActiveOption } from './useActiveOption'
import { usePartialRendering } from './usePartialRendering'

import type { DecoratorsType } from '../../types'

type Props<T> = {
  options: Array<ComboBoxOption<T>>
  dropdownHelpMessage?: ReactNode
  dropdownWidth?: string | number
  onAdd?: (label: string) => void
  onSelect: (item: ComboBoxItem<T>) => void
  isExpanded: boolean
  isLoading?: boolean
  triggerRef: RefObject<HTMLElement>
  decorators?: DecoratorsType<'noResultText'>
}

type Rect = {
  top: number
  left: number
  $width: number | string
  height?: number
}

const NO_RESULT_TEXT = '一致する選択肢がありません'

export function useListBox<T>({
  options,
  dropdownHelpMessage,
  dropdownWidth,
  onAdd,
  onSelect,
  isExpanded,
  isLoading,
  triggerRef,
  decorators,
}: Props<T>) {
  const [navigationType, setNavigationType] = useState<'pointer' | 'key'>('pointer')
  const { activeOption, setActiveOption, moveActivePositionDown, moveActivePositionUp } =
    useActiveOption({ options })

  useEffect(() => {
    // 閉じたときに activeOption を初期化
    if (!isExpanded) {
      setActiveOption(null)
    }
  }, [isExpanded, setActiveOption])

  const listBoxRef = useRef<HTMLDivElement>(null)
  const [listBoxRect, setListBoxRect] = useState<Rect>({
    top: 0,
    left: 0,
    $width: 0,
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
      $width: rect.width,
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

  useEnhancedEffect(() => {
    if (isExpanded) {
      // options の更新毎に座標を再計算する
      calculateRect()
    }
  }, [calculateRect, isExpanded, options])

  const handleKeyDown = useCallback(
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
          onAdd && onAdd(activeOption.item.value)
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
  const { createPortal } = usePortal()
  const listBoxId = useId()
  const { items: partialOptions, renderIntersection } = usePartialRendering({
    items: options,
    minLength: useMemo(
      () => (activeOption === null ? 0 : options.indexOf(activeOption)) + 1,
      [activeOption, options],
    ),
  })
  const { listBoxClassNames: classNames } = useContext(ComboBoxContext)

  const handleAdd = useCallback(
    (option: ComboBoxOption<T>) => {
      // HINT: Dropdown系コンポーネント内でComboBoxを使うと、選択肢がportalで表現されている関係上Dropdownが閉じてしまう
      // requestAnimationFrameを追加、処理を遅延させることで正常に閉じる/閉じないの判定を行えるようにする
      requestAnimationFrame(() => {
        onAdd && onAdd(option.item.value)
      })
    },
    [onAdd],
  )
  const handleSelect = useCallback(
    (option: ComboBoxOption<T>) => {
      onSelect(option.item)
    },
    [onSelect],
  )
  const handleHoverOption = useCallback(
    (option: ComboBoxOption<T>) => {
      setNavigationType('pointer')
      setActiveOption(option)
    },
    [setActiveOption],
  )

  const renderListBox = useCallback(
    () =>
      createPortal(
        <Wrapper {...listBoxRect}>
          <Container
            {...listBoxRect}
            themes={theme}
            $width={dropdownWidth || listBoxRect.$width}
            id={listBoxId}
            ref={listBoxRef}
            role="listbox"
            aria-hidden={!isExpanded}
            className={classNames.dropdownList}
          >
            {dropdownHelpMessage && (
              <HelpMessage themes={theme}>
                <FaInfoCircleIcon
                  color={theme.color.TEXT_GREY}
                  text={dropdownHelpMessage}
                  iconGap={0.25}
                />
              </HelpMessage>
            )}
            {!isExpanded ? null : isLoading ? (
              <LoaderWrapper themes={theme}>
                <Loader />
              </LoaderWrapper>
            ) : options.length === 0 ? (
              <NoItems
                themes={theme}
                role="alert"
                aria-live="polite"
                className={classNames.noItems}
              >
                {decorators?.noResultText
                  ? decorators.noResultText(NO_RESULT_TEXT)
                  : NO_RESULT_TEXT}
              </NoItems>
            ) : (
              partialOptions.map((option) => (
                <ListBoxItemButton
                  key={option.id}
                  option={option}
                  isActive={option.id === activeOption?.id}
                  onAdd={handleAdd}
                  onSelect={handleSelect}
                  onMouseOver={handleHoverOption}
                  activeRef={activeRef}
                />
              ))
            )}
            {renderIntersection()}
          </Container>
        </Wrapper>,
      ),
    [
      activeOption?.id,
      classNames.dropdownList,
      classNames.noItems,
      createPortal,
      handleAdd,
      handleHoverOption,
      handleSelect,
      isExpanded,
      isLoading,
      listBoxId,
      listBoxRect,
      options.length,
      partialOptions,
      renderIntersection,
      dropdownHelpMessage,
      dropdownWidth,
      theme,
      decorators,
    ],
  )

  return {
    renderListBox,
    activeOption,
    handleKeyDown,
    listBoxId,
    listBoxRef,
  }
}

const Wrapper = styled.div<Rect>(
  ({ top, left, $width }) => css`
    /*
    ドロップダウンリストをInputの幅に対する相対値で指定できるように、Inputの幅のdivを親要素にする
    */
    position: absolute;
    top: ${top}px;
    left: ${left}px;
    width: ${$width}px;
  `,
)

const Container = styled.div<Rect & { themes: Theme }>(({ left, $width, height, themes }) => {
  const { color, fontSize, spacingByChar, radius, shadow, zIndex } = themes
  return css`
    position: absolute;
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

    /*
    dropdownWidthの指定があれば、ドロップダウンリストの幅として設定する。
    ドロップダウンリストは、viewportの幅を超えないように、かつInputの幅より小さくならないようにする。
    */
    width: ${typeof $width === 'string' ? $width : `${$width}px`};
    max-width: calc(100vw - ${left}px - ${spacingByChar(0.5)});
    min-width: 100%;

    padding: ${spacingByChar(0.5)} 0;
    border-radius: ${radius.m};
    box-shadow: ${shadow.LAYER3};
    background-color: ${color.WHITE};
    box-sizing: border-box;
    &[aria-hidden='true'] {
      display: none;
    }
    z-index: ${zIndex.OVERLAP};
  `
})

const HelpMessage = styled.p<{ themes: Theme }>`
  ${({ themes }) => {
    const { border, fontSize, spacingByChar } = themes

    return css`
      margin: 0 ${spacingByChar(0.5)} ${spacingByChar(0.5)};
      padding: 0 ${spacingByChar(0.5)} ${spacingByChar(0.5)};
      border-bottom: ${border.shorthand};
      font-size: ${fontSize.S};
      white-space: initial;
    `
  }}
`

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

const LoaderWrapper = styled.div<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${spacingByChar(1)};
  `}
`
