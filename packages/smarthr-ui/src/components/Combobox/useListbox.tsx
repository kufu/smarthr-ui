'use client'

import {
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
  memo,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useEnhancedEffect } from '../../hooks/useEnhancedEffect'
import { useLatest } from '../../hooks/useLatest'
import { usePortal } from '../../hooks/usePortal'
import { useTheme } from '../../hooks/useTheme'
import { useIntl } from '../../intl'
import { FaCircleInfoIcon } from '../Icon'
import { Loader } from '../Loader'
import { Scroller } from '../Scroller'
import { Text } from '../Text'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { ItemButton } from './ItemButton'
import { Intersection, usePartialRendering } from './usePartialRendering'

import type { ComboboxItem, ComboboxOption } from './types'

type Props<T> = {
  options: Array<ComboboxOption<T>>
  dropdownHelpMessage?: ReactNode
  dropdownWidth?: string | number
  onAdd?: (label: string) => void
  onSelect: (item: ComboboxItem<T>) => void
  isExpanded: boolean
  isLoading?: boolean
  triggerRef: RefObject<HTMLElement>
  /** 検索結果が0件の時に表示するコンテンツ */
  noResultText?: ReactNode
}

type Rect = {
  top: number
  left: number
  height?: number
}

const KEY_DOWN_REGEX = /^(Arrow)?Down$/
const KEY_UP_REGEX = /^(Arrow)?Up/

export const useListbox = <T,>({
  options,
  dropdownHelpMessage,
  dropdownWidth,
  onAdd,
  onSelect,
  isExpanded,
  isLoading,
  triggerRef,
  noResultText,
}: Props<T>) => {
  const [navigationType, setNavigationType] = useState<'pointer' | 'key'>('pointer')

  // useActiveOptionの内容を統合
  const [activeOption, setActiveOption] = useState<ComboboxOption<T> | null>(null)

  const listBoxRef = useRef<HTMLDivElement>(null)
  const [listBoxRect, setListBoxRect] = useState<Rect>({
    top: 0,
    left: 0,
  })
  // HINT: calculateRectで同時に計算するとwidthの幅が変更されるタイミングの問題でlistBoxHeightが変化する場合がある
  const [triggerWidth, setTriggerWidth] = useState(0)
  const activeRef = useRef<HTMLButtonElement>(null)
  const listBoxId = useId()
  const { items: partialOptions, onIntersect } = usePartialRendering({
    items: options,
    minLength: (activeOption === null ? 0 : options.indexOf(activeOption)) + 1,
  })

  const latest = useLatest({
    onAdd,
    onSelect,
    options,
    activeOption,
    setNavigationType,
    setActiveOption,
  })

  const functions = useMemo(() => {
    // 内部ヘルパー関数
    const moveActiveOptionIndex = (currentActive: ComboboxOption<T> | null, delta: -1 | 1) => {
      const opts = latest.options

      if (opts.every((option) => option.item.disabled)) {
        return
      }

      const currentActiveIndex =
        currentActive === null ? -1 : opts.findIndex((option) => option.id === currentActive.id)
      let nextIndex = 0

      if (currentActiveIndex !== -1) {
        nextIndex = (currentActiveIndex + delta + opts.length) % opts.length
      } else if (delta !== 1) {
        nextIndex = opts.length - 1
      }

      const nextActive = opts[nextIndex]

      if (nextActive) {
        if (nextActive.item.disabled) {
          // skip disabled item
          moveActiveOptionIndex(nextActive, delta)
        } else {
          setActiveOption(nextActive)
        }
      }
    }

    return {
      handleKeyDownListBox: (e: KeyboardEvent<HTMLElement>) => {
        setNavigationType('key')

        if (KEY_DOWN_REGEX.test(e.key)) {
          e.stopPropagation()
          moveActiveOptionIndex(latest.activeOption, 1)
        } else if (KEY_UP_REGEX.test(e.key)) {
          e.stopPropagation()
          moveActiveOptionIndex(latest.activeOption, -1)
        } else if (e.key === 'Enter') {
          if (latest.activeOption === null) {
            return
          }

          e.stopPropagation()

          if (!latest.activeOption.isNew) {
            latest.onSelect(latest.activeOption.item)
          } else if (latest.onAdd) {
            latest.onAdd(latest.activeOption.item.value)
          }
        } else {
          setActiveOption(null)
        }
      },
      handleSelect: (option: ComboboxOption<T>) => {
        latest.onSelect(option.item)
      },
      handleAdd: (option: ComboboxOption<T>) => {
        if (latest.onAdd) {
          // HINT: Dropdown系コンポーネント内でComboboxを使うと、選択肢がportalで表現されている関係上Dropdownが閉じてしまう
          // requestAnimationFrameを追加、処理を遅延させることで正常に閉じる/閉じないの判定を行えるようにする
          requestAnimationFrame(() => {
            latest.onAdd?.(option.item.value)
          })
        }
      },
      handleHoverOption: (option: ComboboxOption<T>) => {
        latest.setNavigationType('pointer')
        latest.setActiveOption(option)
      },
    }
  }, [latest])

  useEffect(() => {
    // props の変更によって activeOption の状態が変わりうるので、実態を反映する
    setActiveOption((current) => {
      if (current === null) {
        return null
      }

      return options.find((option) => current.id === option.id) ?? null
    })
    // TODO: optionsの安定化方法を検討中
  }, [options])

  useEffect(() => {
    // 閉じたときに activeOption を初期化
    if (!isExpanded) {
      setActiveOption(null)
    }

    // triggerWidth の更新
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setTriggerWidth(rect.width)
    }
  }, [isExpanded, triggerRef])

  useEffect(() => {
    // actionOption の要素が表示される位置までリストボックス内をスクロールさせる
    if (
      !activeRef.current ||
      !listBoxRef.current ||
      activeOption === null ||
      navigationType !== 'key'
    ) {
      return
    }

    const activeRect = activeRef.current.getBoundingClientRect()
    const containerRect = listBoxRef.current.getBoundingClientRect()

    if (activeRect.top < containerRect.top) {
      listBoxRef.current.scrollTop -= containerRect.top - activeRect.top
    } else if (activeRect.bottom > containerRect.bottom) {
      listBoxRef.current.scrollTop += activeRect.bottom - containerRect.bottom
    }
  }, [activeOption, navigationType])

  useEnhancedEffect(() => {
    if (!isExpanded) {
      return
    }

    // options の更新毎に座標を再計算する
    const calculateRect = () => {
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
        height,
      })
      setTriggerWidth(rect.width)
    }

    calculateRect()
    // TODO: optionsの安定化方法を検討中
  }, [isExpanded, options, triggerRef])

  return {
    listBoxProps: {
      activeOptionId: activeOption?.id,
      onIntersect,
      partialOptions,
      optionsLength: options.length,
      isExpanded,
      isLoading,
      dropdownHelpMessage,
      noResultText,
      listBoxId,
      listBoxRef,
      handleSelect: functions.handleSelect,
      handleAdd: functions.handleAdd,
      handleHoverOption: functions.handleHoverOption,
      activeRef,
      listBoxRect,
      triggerWidth,
      dropdownWidth,
    },
    activeOption,
    handleKeyDownListBox: functions.handleKeyDownListBox,
    listBoxId,
    listBoxRef,
  }
}

type ListBoxProps<T> = {
  activeOptionId: string | undefined
  onIntersect: (() => void) | null
  partialOptions: Array<ComboboxOption<T>>
  optionsLength: number
  isExpanded: boolean
  isLoading?: boolean
  noResultText?: ReactNode
  dropdownHelpMessage?: ReactNode
  listBoxId: string
  listBoxRef: RefObject<HTMLDivElement>
  handleSelect: (option: ComboboxOption<T>) => void
  handleAdd: (option: ComboboxOption<T>) => void
  handleHoverOption: (option: ComboboxOption<T>) => void
  activeRef: RefObject<HTMLButtonElement>
  listBoxRect: { top: number; left: number; height?: number }
  triggerWidth: number
  dropdownWidth?: string | number
}

const classNameGenerator = tv({
  slots: {
    wrapper: 'shr-absolute',
    dropdownList: [
      'smarthr-ui-Combobox-dropdownList',
      'shr-absolute shr-z-overlap shr-box-border shr-min-w-full shr-rounded-m shr-bg-white shr-py-0.5 shr-shadow-layer-3',
      /* 縦スクロールに気づきやすくするために8個目のアイテムが半分見切れるように max-height を算出
      = (アイテムのフォントサイズ + アイテムの上下padding) * 7.5 + コンテナの上padding */
      'shr-max-h-[calc((theme(fontSize.base)_+_theme(spacing[0.5])_*_2)_*_7.5_+_theme(spacing[0.5]))]',
      'aria-hidden:shr-hidden',
    ],
    helpMessage:
      'shr-whitespace-[initial] shr-border-b-shorthand shr-mx-0.5 shr-mb-0.5 shr-mt-0 shr-px-0.5 shr-pb-0.5 shr-pt-0 shr-text-sm',
    loaderWrapper: 'shr-flex shr-items-center shr-justify-center shr-p-1',
    noItems: 'smarthr-ui-Combobox-noItems shr-my-0 shr-bg-white shr-px-1 shr-py-0.5 shr-text-base',
  },
})

export const ListBox = memo(
  <T,>({
    activeOptionId,
    onIntersect,
    partialOptions,
    optionsLength,
    isExpanded,
    isLoading,
    noResultText,
    dropdownHelpMessage,
    listBoxId,
    listBoxRef,
    handleSelect,
    handleAdd,
    handleHoverOption,
    activeRef,
    listBoxRect,
    triggerWidth,
    dropdownWidth,
  }: ListBoxProps<T>) => {
    const { createPortal } = usePortal()
    const theme = useTheme()

    const { localize } = useIntl()
    const texts = useMemo(
      () => ({
        loadingText: localize({ id: 'smarthr-ui/Combobox/loadingText', defaultText: '処理中' }),
        noResultText:
          noResultText ??
          localize({
            id: 'smarthr-ui/Combobox/noResultsText',
            defaultText: '一致する選択肢がありません。',
          }),
      }),
      [noResultText, localize],
    )

    const classNames = useMemo(() => {
      const { wrapper, dropdownList, helpMessage, loaderWrapper, noItems } = classNameGenerator()

      return {
        wrapper: wrapper(),
        dropdownList: dropdownList(),
        helpMessage: helpMessage(),
        loaderWrapper: loaderWrapper(),
        noItems: noItems(),
      }
    }, [])

    const wrapperStyle = useMemo(() => {
      const { top, left } = listBoxRect

      return {
        top: `${top}px`,
        left: `${left}px`,
        width: `${triggerWidth}px`,
      }
    }, [listBoxRect, triggerWidth])

    const dropdownListStyle = useMemo(() => {
      const { left, height } = listBoxRect
      const dropdownListWidth = dropdownWidth || triggerWidth

      return {
        width: typeof dropdownListWidth === 'string' ? dropdownListWidth : `${dropdownListWidth}px`,
        maxWidth: `calc(100vw - ${left}px - ${theme.spacingByChar(0.5)})`,
        height: height ? `${height}px` : undefined,
      }
    }, [listBoxRect, triggerWidth, dropdownWidth, theme])

    return createPortal(
      <div className={classNames.wrapper} style={wrapperStyle}>
        {isExpanded && isLoading && (
          <VisuallyHiddenText role="status">{texts.loadingText}</VisuallyHiddenText>
        )}
        <Scroller
          id={listBoxId}
          ref={listBoxRef}
          role="listbox"
          aria-hidden={!isExpanded}
          className={classNames.dropdownList}
          style={dropdownListStyle}
        >
          {dropdownHelpMessage && (
            <Text
              className={classNames.helpMessage}
              icon={<FaCircleInfoIcon color="TEXT_GREY" />}
              as="p"
            >
              {dropdownHelpMessage}
            </Text>
          )}
          {isExpanded ? (
            isLoading ? (
              <div className={classNames.loaderWrapper}>
                <Loader aria-hidden />
              </div>
            ) : optionsLength === 0 ? (
              <p role="alert" aria-live="polite" className={classNames.noItems}>
                {texts.noResultText}
              </p>
            ) : (
              partialOptions.map((option) => (
                <ItemButton
                  key={option.id}
                  option={option}
                  onAdd={handleAdd}
                  onSelect={handleSelect}
                  onMouseOver={handleHoverOption}
                  activeRef={option.id === activeOptionId ? activeRef : undefined}
                />
              ))
            )
          ) : null}
          {onIntersect && <Intersection onIntersect={onIntersect} />}
        </Scroller>
      </div>,
    )
  },
) as <T>(props: ListBoxProps<T>) => ReactNode
