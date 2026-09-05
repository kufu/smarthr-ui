'use client'

import {
  type KeyboardEvent,
  type MouseEvent,
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

import { useAnimationFrame } from '../../hooks/client/useAnimationFrame'
import { useEnhancedEffect } from '../../hooks/client/useEnhancedEffect'
import { usePortal } from '../../hooks/client/usePortal'
import { useTheme } from '../../hooks/client/useTheme'
import { useLatest } from '../../hooks/useLatest'
import { Localizer } from '../../intl'
import { findDelegateTarget } from '../../libs/delegate'
import { FaCircleInfoIcon } from '../Icon'
import { LiveRegion } from '../LiveRegion'
import { Loader } from '../Loader'
import { Scroller } from '../Scroller'
import { Text } from '../Text'

import { ItemButton } from './ItemButton'

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
  /** output要素のhtmlFor属性に使用するinput要素のid */
  inputId?: string
}

type Rect = {
  top: number
  left: number
  height?: number
}

const KEY_DOWN_REGEX = /^(Arrow)?Down$/
const KEY_UP_REGEX = /^(Arrow)?Up/

const OPTION_INCREMENT_AMOUNT = 100

const classNameGenerator = tv({
  slots: {
    wrapper: 'shr-absolute',
    dropdownList: [
      'smarthr-ui-Combobox-dropdownList',
      'shr-absolute shr-z-overlap shr-box-border shr-min-w-full shr-rounded-m shr-bg-white shr-py-0.5 shr-shadow-layer-3 forced-colors:shr-outline forced-colors:shr-outline-1',
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

const CLASS_NAMES = (() => {
  const { wrapper, dropdownList, helpMessage, loaderWrapper, noItems } = classNameGenerator()

  return {
    wrapper: wrapper(),
    dropdownList: dropdownList(),
    helpMessage: helpMessage(),
    loaderWrapper: loaderWrapper(),
    noItems: noItems(),
  }
})()

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
  inputId,
}: Props<T>) => {
  const listBoxId = useId()

  const [navigationType, setNavigationType] = useState<'pointer' | 'key'>('pointer')
  const [activeOption, setActiveOption] = useState<ComboboxOption<T> | null>(null)
  const [listBoxRect, setListBoxRect] = useState<Rect>({
    top: 0,
    left: 0,
  })
  // HINT: calculateRectで同時に計算するとwidthの幅が変更されるタイミングの問題でlistBoxHeightが変化する場合がある
  const [triggerWidth, setTriggerWidth] = useState(0)

  const listBoxRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLButtonElement>(null)

  const theme = useTheme()

  const addFrame = useAnimationFrame()

  const latest = useLatest({ onAdd, onSelect, activeOption, options, triggerRef, theme, addFrame })
  const hasOnAdd = !!onAdd

  const functions = useMemo(() => {
    const moveActiveOptionIndex = (currentActive: ComboboxOption<T> | null, delta: -1 | 1) => {
      if (latest.options.every((option) => option.item.disabled)) {
        return
      }

      const currentActiveIndex =
        currentActive === null
          ? -1
          : latest.options.findIndex((option) => option.id === currentActive.id)
      let nextIndex = 0

      if (currentActiveIndex !== -1) {
        nextIndex = (currentActiveIndex + delta + latest.options.length) % latest.options.length
      } else if (delta !== 1) {
        nextIndex = latest.options.length - 1
      }

      const nextActive = latest.options[nextIndex]

      if (nextActive) {
        if (nextActive.item.disabled) {
          moveActiveOptionIndex(nextActive, delta)
        } else {
          setActiveOption(nextActive)
        }
      }
    }

    return {
      calculateRect: () => {
        if (!listBoxRef.current || !latest.triggerRef.current) {
          return
        }
        const rect = latest.triggerRef.current.getBoundingClientRect()
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

        // HINT: dropdownWidth は 'auto' や '%' などの CSS 値を取りうるため、算出済みの幅を実測して判定する
        const listBoxWidth = listBoxRef.current.getBoundingClientRect().width
        // ドロップダウンの幅は maxWidth でビューポート右端から余白分を残すよう制限しているため、位置の判定にも同じ余白を使う
        const viewportMargin = parseInt(latest.theme.spacingByChar(0.5), 10)
        // 入力欄の左端を起点に右方向へ表示する場合に使える幅
        const rightSpace = window.innerWidth - rect.left - viewportMargin
        // 入力欄の右端を起点に左方向へ表示する場合に使える幅
        const leftSpace = rect.right

        // ビューポートの左端を基準に計算
        let left = window.pageXOffset

        if (listBoxWidth <= rightSpace) {
          // 右側に十分なスペースがある場合は入力欄の左端に揃えて通常表示
          left += rect.left
        } else if (listBoxWidth <= leftSpace) {
          // 左側に収まる場合は入力欄の右端に揃えて表示
          left += rect.right - listBoxWidth
        }

        setListBoxRect({
          top,
          left,
          height,
        })
        setTriggerWidth(rect.width)
      },
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
      handleAdd: hasOnAdd
        ? (option: ComboboxOption<T>) => {
            // HINT: Dropdown系コンポーネント内でComboboxを使うと、選択肢がportalで表現されている関係上Dropdownが閉じてしまう
            // 処理を遅延させることで正常に閉じる/閉じないの判定を行えるようにする
            latest.addFrame.request(() => {
              latest.onAdd!(option.item.value)
            })
          }
        : undefined,
      handleSelect: (option: ComboboxOption<T>) => {
        latest.onSelect(option.item)
      },
      handleHoverOption: (option: ComboboxOption<T>) => {
        setNavigationType('pointer')
        setActiveOption(option)
      },
    }
  }, [hasOnAdd, latest])

  // TODO: callbackRefにまとめ直したい
  useEffect(() => addFrame.cancel, [addFrame.cancel])

  useEffect(() => {
    // props の変更によって activeOption の状態が変わりうるので、実態を反映する
    setActiveOption((current) => {
      if (current === null) {
        return null
      }

      return options.find((option) => current.id === option.id) ?? null
    })
  }, [options])

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
    // 閉じたときに activeOption を初期化
    if (!isExpanded) {
      return setActiveOption(null)
    }

    functions.calculateRect()

    const scrollOption = { capture: true, passive: true }
    window.addEventListener('scroll', functions.calculateRect, scrollOption)
    window.addEventListener('resize', functions.calculateRect, { passive: true })

    return () => {
      window.removeEventListener('scroll', functions.calculateRect, scrollOption)
      window.removeEventListener('resize', functions.calculateRect)
    }
    // HINT: optionsが変わる場合メニューのサイズが変わる可能性がある
  }, [isExpanded, options, functions])

  return {
    listBoxProps: {
      activeOptionId: activeOption?.id,
      options,
      isExpanded,
      isLoading,
      dropdownHelpMessage,
      noResultText,
      inputId,
      listBoxId,
      listBoxRef,
      handleAdd: functions.handleAdd,
      handleHoverOption: functions.handleHoverOption,
      handleSelect: functions.handleSelect,
      activeRef,
      listBoxRect,
      triggerWidth,
      dropdownWidth,
    },
    activeOption,
    handleKeyDownListBox: functions.handleKeyDownListBox,
    listBoxId,
    // TODO: テストで利用されているだけなのでテスト側を修正して対応、最終的に消したい
    listBoxRef,
  }
}

type ListBoxProps<T> = {
  activeOptionId: string | undefined
  options: Array<ComboboxOption<T>>
  isExpanded: boolean
  isLoading?: boolean
  noResultText?: ReactNode
  dropdownHelpMessage?: ReactNode
  inputId?: string
  listBoxId: string
  listBoxRef: RefObject<HTMLDivElement>
  handleAdd: ((option: ComboboxOption<T>) => void) | undefined
  handleHoverOption: (option: ComboboxOption<T>) => void
  handleSelect: (option: ComboboxOption<T>) => void
  activeRef: RefObject<HTMLButtonElement>
  listBoxRect: { top: number; left: number; height?: number }
  triggerWidth: number
  dropdownWidth?: string | number
  callbackRef?: (node: HTMLElement | null) => void
}

export const ListBox = memo(
  <T,>({
    activeOptionId,
    options,
    isExpanded,
    isLoading,
    noResultText,
    dropdownHelpMessage,
    listBoxId,
    listBoxRef,
    handleAdd,
    handleHoverOption,
    handleSelect,
    activeRef,
    listBoxRect,
    triggerWidth,
    dropdownWidth,
    callbackRef,
    inputId,
  }: ListBoxProps<T>) => {
    const { createPortal } = usePortal()
    const theme = useTheme()

    const minLength = useMemo(
      () =>
        (activeOptionId === undefined ? 0 : options.findIndex((o) => o.id === activeOptionId)) + 1,
      [activeOptionId, options],
    )
    const [currentItemLength, setCurrentItemLength] = useState(() =>
      Math.max(OPTION_INCREMENT_AMOUNT, minLength),
    )
    const items = useMemo(() => options.slice(0, currentItemLength), [currentItemLength, options])

    const styles = useMemo(() => {
      const { top, left, height } = listBoxRect
      const dropdownListWidth = dropdownWidth || triggerWidth

      return {
        wrapper: {
          top: `${top}px`,
          left: `${left}px`,
          width: `${triggerWidth}px`,
        },
        dropdownList: {
          width:
            typeof dropdownListWidth === 'string' ? dropdownListWidth : `${dropdownListWidth}px`,
          /* HINT: left に依存させると、算出した幅がさらに maxWidth を縮めて再計算の度に幅が縮んでいくため、
          ビューポート幅のみから算出する */
          maxWidth: `calc(100vw - ${theme.spacingByChar(0.5)})`,
          height: height ? `${height}px` : undefined,
        },
      }
    }, [listBoxRect, triggerWidth, dropdownWidth, theme])

    const latest = useLatest({ handleAdd, handleHoverOption, handleSelect, options, minLength })

    const functions = useMemo(() => {
      const resolveOption = (e: MouseEvent) => {
        const el = findDelegateTarget<HTMLButtonElement>(e, 'button[role="option"]')
        if (!el || el.disabled) return null
        return latest.options.find((o) => o.id === el.id) ?? null
      }

      return {
        handleDelegateClick: (e: MouseEvent) => {
          const option = resolveOption(e)
          if (option) {
            if (option.isNew) {
              latest.handleAdd?.(option)
            } else {
              latest.handleSelect(option)
            }
          }
        },
        handleDelegateMouseOver: (e: MouseEvent) => {
          const option = resolveOption(e)
          if (option) {
            latest.handleHoverOption(option)
          }
        },
        handleIntersect: () => {
          setCurrentItemLength((current) =>
            Math.max(current + OPTION_INCREMENT_AMOUNT, latest.minLength),
          )
        },
      }
    }, [latest])

    useEffect(() => {
      setCurrentItemLength((current) => Math.max(current, minLength))
    }, [minLength])

    return createPortal(
      <div
        ref={isExpanded ? callbackRef : undefined}
        className={CLASS_NAMES.wrapper}
        style={styles.wrapper}
      >
        {isExpanded && isLoading && (
          <LiveRegion htmlFor={inputId}>
            <Localizer id="smarthr-ui/Combobox/loadingText" defaultText="処理中" />
          </LiveRegion>
        )}
        <Scroller
          ref={listBoxRef}
          role="listbox"
          id={listBoxId}
          className={CLASS_NAMES.dropdownList}
          style={styles.dropdownList}
          aria-hidden={!isExpanded}
          onMouseOver={functions.handleDelegateMouseOver}
          onClick={functions.handleDelegateClick}
        >
          {dropdownHelpMessage && (
            <Text
              as="p"
              className={CLASS_NAMES.helpMessage}
              icon={<FaCircleInfoIcon color="TEXT_GREY" />}
            >
              {dropdownHelpMessage}
            </Text>
          )}
          {isExpanded ? (
            isLoading ? (
              <div className={CLASS_NAMES.loaderWrapper}>
                <Loader aria-hidden />
              </div>
            ) : options.length === 0 ? (
              <LiveRegion htmlFor={inputId} className={CLASS_NAMES.noItems}>
                {noResultText ?? (
                  <Localizer
                    id="smarthr-ui/Combobox/noResultsText"
                    defaultText="一致する選択肢がありません。"
                  />
                )}
              </LiveRegion>
            ) : (
              items.map(({ item: { label, disabled }, id, ...optionRest }) => (
                <ItemButton
                  {...optionRest}
                  key={id}
                  activeRef={id === activeOptionId ? activeRef : undefined}
                  id={id}
                  disabled={disabled}
                  label={label}
                />
              ))
            )
          ) : null}
          {currentItemLength < options.length && (
            <Intersection handleIntersect={functions.handleIntersect} />
          )}
        </Scroller>
      </div>,
    )
  },
) as <T>(props: ListBoxProps<T>) => ReactNode

const Intersection = memo<{ handleIntersect: () => void }>(({ handleIntersect }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const target = ref.current

    if (target === null) {
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        handleIntersect()
      }
    })

    observer.observe(target)

    return () => observer.disconnect()
  }, [handleIntersect])

  return <div ref={ref} />
})
