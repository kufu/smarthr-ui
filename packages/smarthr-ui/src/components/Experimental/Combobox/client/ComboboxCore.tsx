'use client'

import {
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
  useContext,
  useDeferredValue,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from 'react'
import { tv } from 'tailwind-variants'

// useEnvironment を使わないのは、EnvironmentProvider の外で例外を投げるため
// eslint-disable-next-line smarthr/require-barrel-import
import { EnvironmentContext } from '../../../../hooks/client/useEnvironment/useEnvironment'
import { useLayoutEffectRef } from '../../../../hooks/client/useLayoutEffectRef'
import { useMergeRefs } from '../../../../hooks/client/useMergeRefs'
import { useLatest } from '../../../../hooks/useLatest'
import { Localizer, useIntl } from '../../../../intl'
import { findDelegateTarget } from '../../../../libs/delegate'
import { defaultMediaQuery } from '../../../../themes'
import { Button, UnstyledButton } from '../../../Button'
import { getSelectedLabelText } from '../../../Combobox'
import { ControlledDrawer, DrawerFooter, DrawerHeader } from '../../../Drawer'
import {
  FaCaretDownIcon,
  FaCheckIcon,
  FaChevronDownIcon,
  FaCircleXmarkIcon,
  FaMagnifyingGlassIcon,
  FaRotateLeftIcon,
  FaXmarkIcon,
} from '../../../Icon'
import { Input } from '../../../Input'
import { Cluster, Stack } from '../../../Layout'
import { LiveRegion } from '../../../LiveRegion'
import { Loader } from '../../../Loader'
import { Text } from '../../../Text'
import { VisuallyHiddenText } from '../../../VisuallyHiddenText'

import {
  DISPLAY_LIMIT,
  MODE_RULES,
  type SelectionMode,
  arrangeOptions,
  isSameItems,
  isSelected,
  itemKey,
} from './selection'

import type { ComboboxItem } from './types'

type Items<T> = Array<ComboboxItem<T>>

type LoadResult<T> = Items<T> | { items: Items<T>; hasMore: boolean }

type ItemsSource<T> =
  | {
      /** 選択肢のすべて。検索文字列による絞り込みはコンポーネント内で行う */
      items: Items<T>
      loadItems?: never
    }
  | {
      items?: never
      /**
       * 検索文字列ごとに選択肢を取得する。返した結果は絞り込まずにそのまま表示し、次の取得を始めるときに前の signal を abort する。
       * 取得しきれなかった続きがあるときは `{ items, hasMore: true }` を返すと検索文字列を変えるよう案内する。配列だけを返すと続きは無いものとして扱う
       */
      loadItems: (query: string, options: { signal: AbortSignal }) => Promise<LoadResult<T>>
    }

export type CommonProps<T> = ItemsSource<T> & {
  /** hidden input の name。MultiCombobox では選択中のアイテムごとに hidden input を置く */
  name?: string
  required?: boolean
  disabled?: boolean
  error?: boolean
  width?: number | string
  /** ポップアップの幅。省略時はトリガと同じ幅。トリガより狭くはならず、画面幅を超えない */
  dropdownWidth?: number | string
  /** 検索結果が0件のときに表示する内容 */
  noResultText?: ReactNode
  className?: string
  /** トリガのボタンへの ref */
  ref?: Ref<HTMLButtonElement>
  /** 試作の評価用。省略時は画面幅で決める */
  variant?: 'popup' | 'drawer'
}

type Props<T> = CommonProps<T> & {
  mode: SelectionMode
  selected: Items<T> | undefined
  defaultSelected: Items<T>
  onChangeSelected: (selected: Items<T>) => void
  maxVisibleItems?: number
}

const DEBOUNCE_MS = 250
const POPUP_GAP = 4
const POPUP_MAX_HEIGHT = 400
const POPUP_MIN_HEIGHT = 240
const VIEWPORT_MARGIN = 8

const NOOP = () => {}

const REQUIRED_MESSAGES = {
  single: { id: 'smarthr-ui/SingleCombobox/requiredMessage', defaultText: '選択してください' },
  multiple: {
    id: 'smarthr-ui/MultiCombobox/requiredMessage',
    defaultText: '1つ以上選択してください',
  },
} as const

const SMALL_SCREEN_QUERY = defaultMediaQuery.SCREEN_SMALL
// matchMedia の有無を確かめずに呼ばないのは、jsdom など matchMedia の無い環境で描画しただけで例外になるため
const subscribeSmallScreen = (callback: () => void) => {
  if (!window.matchMedia) return NOOP

  const mediaQueryList = window.matchMedia(SMALL_SCREEN_QUERY)

  mediaQueryList.addEventListener('change', callback)

  return () => mediaQueryList.removeEventListener('change', callback)
}
const getSmallScreen = () =>
  window.matchMedia ? window.matchMedia(SMALL_SCREEN_QUERY).matches : false
const getServerSmallScreen = () => false

const supportsPopover = () => typeof HTMLElement.prototype.showPopover === 'function'

const classNameGenerator = tv({
  slots: {
    wrapper:
      'smarthr-ui-ExperimentalCombobox shr-relative shr-inline-block shr-w-[20em] shr-max-w-full shr-align-middle',
    trigger: [
      'shr-border-shorthand shr-box-border shr-flex shr-min-h-[calc(theme(fontSize.base)+theme(spacing[0.75])*2+2px)] shr-w-full shr-cursor-pointer shr-items-center shr-gap-0.5 shr-rounded-m shr-bg-white shr-px-0.5 shr-py-0.25 shr-text-left shr-text-base shr-leading-tight shr-text-black',
      'contrast-more:shr-border-high-contrast',
      'focus-visible:shr-focus-indicator',
      '[&[aria-invalid]]:shr-border-danger',
      'disabled:shr-cursor-not-allowed disabled:shr-border-default/50 disabled:shr-bg-white-darken disabled:shr-text-disabled',
    ],
    triggerValue: 'shr-min-w-0 shr-flex-1',
    singleValue: 'shr-block shr-truncate',
    tags: 'shr-flex shr-min-w-0 shr-flex-wrap shr-gap-0.25',
    tag: 'shr-border-shorthand shr-box-border shr-min-w-0 shr-max-w-full shr-truncate shr-rounded-s shr-bg-column shr-px-0.5 shr-py-0.25 shr-text-sm shr-leading-tight',
    caret: 'shr-shrink-0 shr-text-grey',
    popup: [
      'shr-border-shorthand shr-fixed shr-z-overlap-base shr-m-0 shr-box-border shr-overflow-hidden shr-rounded-m shr-bg-white shr-p-0 shr-text-black shr-shadow-layer-3',
      'forced-colors:shr-outline forced-colors:shr-outline-1',
    ],
    popupInner: 'shr-flex shr-max-h-[inherit] shr-flex-col',
    popupHeader:
      'shr-border-b-shorthand shr-flex shr-shrink-0 shr-items-center shr-justify-between shr-gap-0.5 shr-py-0.5 shr-pl-0.75 shr-pr-0.5',
    searchArea: 'shr-shrink-0 shr-p-0.5',
    drawerSearchArea: 'shr-shrink-0 shr-px-1 shr-pb-0.5 shr-pt-1',
    searchInput: 'shr-w-full',
    clearQueryButton: 'shr-rounded-full shr-leading-[0] focus-visible:shr-focus-indicator',
    listArea: 'shr-min-h-0 shr-flex-1 shr-overflow-y-auto shr-overscroll-contain',
    listbox: 'shr-m-0 shr-list-none shr-p-0 shr-pb-0.5 aria-busy:shr-opacity-50',
    option: [
      'shr-relative shr-flex shr-cursor-pointer shr-items-start shr-gap-0.5 shr-px-0.75 shr-py-0.5 shr-text-base shr-leading-tight',
      'data-[active=true]:shr-focus-indicator data-[active=true]:shr-z-1 data-[active=true]:shr-bg-white-darken',
      'aria-disabled:shr-cursor-not-allowed aria-disabled:shr-text-disabled',
    ],
    // break-words だけでは区切りの無い長い英数字が min-content の幅を押し広げるため、anywhere にする
    optionBody: 'shr-[overflow-wrap:anywhere] shr-flex shr-min-w-0 shr-flex-col shr-gap-0.25',
    optionDescription:
      'shr-text-sm shr-leading-tight shr-text-grey [[aria-disabled=true]_&]:shr-text-disabled',
    radio: [
      'shr-border-shorthand shr-mt-[0.125em] shr-box-border shr-flex shr-h-em shr-w-em shr-shrink-0 shr-items-center shr-justify-center shr-rounded-full shr-bg-white',
      '[[aria-selected=true]>&]:shr-border-main [[aria-selected=true]>&]:shr-bg-main',
      '[[aria-disabled=true]>&]:shr-bg-white-darken',
      // 既存の RadioButton のようにネイティブの input を見せる案は、option の中に操作できる要素を入れることになるため採らない
      'forced-colors:[[aria-selected=true]>&]:shr-border-[Highlight] forced-colors:[[aria-selected=true]>&]:shr-bg-[Highlight]',
    ],
    radioDot:
      'shr-hidden shr-h-[0.375em] shr-w-[0.375em] shr-rounded-full shr-bg-white forced-colors:shr-bg-[HighlightText] [[aria-selected=true]>*>&]:shr-block',
    checkbox: [
      'shr-border-shorthand shr-mt-[0.125em] shr-box-border shr-flex shr-h-em shr-w-em shr-shrink-0 shr-items-center shr-justify-center shr-rounded-s shr-bg-white',
      '[[aria-selected=true]>&]:shr-border-main [[aria-selected=true]>&]:shr-bg-main',
      '[[aria-disabled=true]>&]:shr-bg-white-darken',
      'forced-colors:[[aria-selected=true]>&]:shr-border-[Highlight] forced-colors:[[aria-selected=true]>&]:shr-bg-[Highlight]',
    ],
    checkIcon:
      'shr-invisible shr-text-2xs shr-text-white forced-colors:shr-fill-[HighlightText] [[aria-selected=true]>*>&]:shr-visible',
    status: 'shr-block shr-px-0.75 shr-py-0.5 shr-text-base',
    loaderWrapper: 'shr-flex shr-justify-center shr-p-1',
    hint: 'shr-m-0 shr-shrink-0 shr-bg-column shr-px-0.75 shr-py-0.75 shr-text-sm shr-leading-normal',
    linkButton:
      'shr-shrink-0 shr-rounded-s shr-text-sm shr-text-link focus-visible:shr-focus-indicator',
    // 箱の中心で回すだけにしないのは、Font Awesome のシェブロンが箱の 0.0625em 下寄りに描かれていて、上向きにすると図形が上にずれるため
    chevron:
      'shr-relative -shr-top-[0.0625em] shr-origin-[50%_56.25%] shr-transition-transform [[aria-expanded=false]_&]:shr-rotate-180',
    drawerBody: 'shr-flex shr-min-h-0 shr-flex-auto shr-flex-col',
    drawerFooter: 'shr-bg-column shr-px-1 shr-py-0.75',
    drawerFooterContent: 'shr-w-full shr-min-w-0',
    chips:
      'shr-m-0 shr-flex shr-max-h-[30vh] shr-list-none shr-flex-wrap shr-gap-0.5 shr-overflow-y-auto shr-p-0',
    chip: 'shr-border-shorthand shr-box-border shr-inline-flex shr-max-w-full shr-items-center shr-gap-0.5 shr-rounded-full shr-bg-white shr-py-0.25 shr-pl-0.75 shr-pr-0.5 shr-text-sm shr-leading-tight',
    chipLabel: 'shr-[overflow-wrap:anywhere] shr-min-w-0',
    chipButton: 'shr-shrink-0 shr-rounded-full shr-leading-[0] focus-visible:shr-focus-indicator',
    singleSummary: 'shr-flex shr-items-center shr-justify-between shr-gap-1',
    singleSummaryText: 'shr-[overflow-wrap:anywhere] shr-m-0 shr-min-w-0 shr-flex-1',
    requiredInput:
      'shr-pointer-events-none shr-absolute shr-bottom-0 shr-left-0 shr-m-0 shr-h-px shr-w-full shr-border-0 shr-p-0 shr-opacity-0',
  },
})

const SLOT_CLASS_NAMES = classNameGenerator()

const CLASS_NAMES = Object.fromEntries(
  Object.entries(SLOT_CLASS_NAMES).map(([key, slot]) => [key, slot()]),
) as Record<keyof typeof SLOT_CLASS_NAMES, string>

export const ComboboxCore = <T,>({
  mode,
  selected: controlledSelected,
  defaultSelected,
  onChangeSelected,
  items,
  loadItems,
  name,
  required,
  disabled,
  error,
  width,
  dropdownWidth,
  noResultText,
  className,
  ref,
  variant,
  maxVisibleItems,
}: Props<T>) => {
  const listboxId = useId()
  const valueId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const listAreaRef = useRef<HTMLDivElement>(null)

  const [uncontrolledSelected, setUncontrolledSelected] = useState(defaultSelected)
  const isControlled = controlledSelected !== undefined
  const selected = isControlled ? controlledSelected : uncontrolledSelected

  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [pinned, setPinned] = useState<Items<T>>([])
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const [loaded, setLoaded] = useState<{
    query: string
    items: Items<T>
    hasMore: boolean
  } | null>(null)
  const [label, setLabel] = useState<{ id: string | undefined; text: string }>({
    id: undefined,
    text: '',
  })
  const [chipsExpanded, setChipsExpanded] = useState(false)
  const [isPending, startTransition] = useTransition()
  const deferredQuery = useDeferredValue(query)

  const environment = useContext(EnvironmentContext)
  const isSmallScreen = useSyncExternalStore(
    subscribeSmallScreen,
    getSmallScreen,
    getServerSmallScreen,
  )
  const shell = variant ?? ((environment?.mobile ?? isSmallScreen) ? 'drawer' : 'popup')

  const hasLoadItems = Boolean(loadItems)
  const options = useMemo(() => {
    if (!hasLoadItems) {
      return arrangeOptions({ source: items ?? [], pinned, query: deferredQuery, filter: true })
    }

    if (loaded === null) {
      return []
    }

    return arrangeOptions({ source: loaded.items, pinned, query: loaded.query, filter: false })
    // eslint-disable-next-line smarthr/best-practice-for-unstable-dependencies
  }, [hasLoadItems, items, pinned, deferredQuery, loaded])

  // eslint-disable-next-line smarthr/best-practice-for-unstable-dependencies
  const visibleOptions = useMemo(() => options.slice(0, DISPLAY_LIMIT), [options])
  const isTruncated = options.length > DISPLAY_LIMIT || Boolean(loaded?.hasMore)
  const activeIndex =
    activeKey === null ? -1 : visibleOptions.findIndex((item) => itemKey(item) === activeKey)

  const latest = useLatest({
    mode,
    selected,
    isControlled,
    defaultSelected,
    onChangeSelected,
    loadItems,
    isOpen,
    shell,
    visibleOptions,
    activeIndex,
    listboxId,
    valueId,
    dropdownWidth,
    startTransition,
  })

  const functions = useMemo(() => {
    let abortController: AbortController | null = null
    let debounceTimer: ReturnType<typeof setTimeout> | undefined

    const stopLoading = () => {
      clearTimeout(debounceTimer)
      abortController?.abort()
      abortController = null
    }

    const load = (nextQuery: string) => {
      const loader = latest.loadItems

      if (!loader) return

      stopLoading()

      const controller = new AbortController()

      abortController = controller

      latest.startTransition(async () => {
        try {
          const result = await loader(nextQuery, { signal: controller.signal })

          if (controller.signal.aborted) return

          abortController = null

          const normalized = Array.isArray(result) ? { items: result, hasMore: false } : result

          latest.startTransition(() => setLoaded({ ...normalized, query: nextQuery }))
        } catch (e) {
          // エラーの種類で中断を見分けないのは、axios の CanceledError のように AbortError 以外を投げるライブラリがあるため
          if (controller.signal.aborted) return

          throw e
        }
      })
    }

    const updateQuery = (nextQuery: string, debounce: boolean) => {
      setQuery(nextQuery)
      setActiveKey(null)

      if (nextQuery === '') {
        setPinned(latest.selected)
      }

      if (!latest.loadItems) return

      if (debounce) {
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => load(nextQuery), DEBOUNCE_MS)
      } else {
        load(nextQuery)
      }
    }

    // ドロワーで検索欄へ戻さないのは、タッチ端末でソフトキーボードが上がって選択肢が隠れるため
    const focusFallback = () => {
      const target = latest.shell === 'drawer' ? listAreaRef.current : searchInputRef.current

      target?.focus()
    }

    const commit = (next: Items<T>) => {
      if (!latest.isControlled) {
        setUncontrolledSelected(next)
      }

      latest.onChangeSelected(next)
    }

    const open = () => {
      const labelElement = triggerRef.current?.labels?.[0]

      setLabel({
        id: labelElement?.id || undefined,
        text:
          (labelElement?.querySelector('.smarthr-ui-FormControl-labelText') ?? labelElement)
            ?.textContent ?? '',
      })
      setPinned(latest.selected)
      setQuery('')
      setActiveKey(null)
      setLoaded(null)
      setIsOpen(true)
      load('')
    }

    const close = (returnFocus: boolean) => {
      stopLoading()
      setIsOpen(false)

      if (returnFocus) {
        triggerRef.current?.focus()
      }
    }

    const toggle = (item: ComboboxItem<T>) => {
      if (item.disabled) return

      setActiveKey(itemKey(item))

      const next = MODE_RULES[latest.mode].toggle(latest.selected, item)

      if (next !== latest.selected) {
        commit(next)
      }
    }

    const moveActive = (to: 'next' | 'prev' | 'first' | 'last') => {
      const enabled = latest.visibleOptions.flatMap((item, index) => (item.disabled ? [] : [index]))

      if (enabled.length === 0) return

      const position = enabled.indexOf(latest.activeIndex)
      const last = enabled.length - 1
      const nextIndex = {
        first: enabled[0],
        last: enabled[last],
        next: position === -1 ? enabled[0] : enabled[(position + 1) % enabled.length],
        prev: position === -1 ? enabled[last] : enabled[(position + last) % enabled.length],
      }[to]

      setActiveKey(itemKey(latest.visibleOptions[nextIndex]))
      document
        .getElementById(`${latest.listboxId}-${nextIndex}`)
        ?.scrollIntoView({ block: 'nearest' })
    }

    const resolveOption = (e: MouseEvent) => {
      const el = findDelegateTarget<HTMLElement>(e, '[role="option"]')

      return el ? latest.visibleOptions[Number(el.dataset.index)] : undefined
    }

    return {
      triggerCallbackRef: (node: HTMLButtonElement | null) => {
        if (!node) return

        // マウント時に一度だけ紐付けないのは、FormControl が id を後から振るため
        const syncLabelledby = () => {
          const labelIds = Array.from(node.labels ?? [], (l) => l.id).filter(Boolean)

          if (labelIds.length > 0) {
            node.setAttribute('aria-labelledby', [...labelIds, latest.valueId].join(' '))
          } else {
            node.removeAttribute('aria-labelledby')
          }
        }

        syncLabelledby()

        const observer = new MutationObserver(syncLabelledby)

        observer.observe(node, { attributes: true, attributeFilter: ['id'] })

        const { form } = node
        let resetFrame = 0
        const handleReset = (e: Event) => {
          // 同期で判定しないのは、後続のリスナーの preventDefault を見届けるため
          resetFrame = requestAnimationFrame(() => {
            if (
              !e.defaultPrevented &&
              !latest.isControlled &&
              !isSameItems(latest.selected, latest.defaultSelected)
            ) {
              setUncontrolledSelected(latest.defaultSelected)
              latest.onChangeSelected(latest.defaultSelected)
            }
          })
        }

        form?.addEventListener('reset', handleReset)

        return () => {
          observer.disconnect()
          cancelAnimationFrame(resetFrame)
          form?.removeEventListener('reset', handleReset)
        }
      },
      // トリガの ref で取得を止めないのは、利用側がインラインの ref を渡すと再描画のたびに後始末が走り、取得中の結果を捨ててしまうため
      listAreaCallbackRef: (node: HTMLDivElement | null) => {
        if (!node) return

        return stopLoading
      },
      popupCallbackRef: (node: HTMLDivElement | null) => {
        const trigger = triggerRef.current
        const area = node?.parentElement

        if (!node || !trigger || !area) return

        if (supportsPopover()) {
          node.showPopover()
        }

        const place = () => {
          const rect = trigger.getBoundingClientRect()
          // window.innerWidth / innerHeight を使わないのは、スクロールバーの分だけ fixed の基準より大きいため
          const { clientWidth: viewportWidth, clientHeight: viewportHeight } =
            document.documentElement
          const spaceBelow = viewportHeight - rect.bottom - POPUP_GAP - VIEWPORT_MARGIN
          const spaceAbove = rect.top - POPUP_GAP - VIEWPORT_MARGIN
          const above = spaceBelow < POPUP_MIN_HEIGHT && spaceAbove > spaceBelow
          const maxWidth = viewportWidth - VIEWPORT_MARGIN * 2
          const { dropdownWidth: requestedWidth } = latest

          node.style.inset = 'auto'
          node.style.minWidth = `${Math.min(rect.width, maxWidth)}px`
          node.style.maxWidth = `${maxWidth}px`
          node.style.width =
            typeof requestedWidth === 'number'
              ? `${requestedWidth}px`
              : (requestedWidth ?? `${rect.width}px`)
          node.style.left = `${Math.max(VIEWPORT_MARGIN, Math.min(rect.left, viewportWidth - node.offsetWidth - VIEWPORT_MARGIN))}px`
          node.style.maxHeight = `${Math.min(POPUP_MAX_HEIGHT, above ? spaceAbove : spaceBelow)}px`

          if (above) {
            node.style.bottom = `${viewportHeight - rect.top + POPUP_GAP}px`
          } else {
            node.style.top = `${rect.bottom + POPUP_GAP}px`
          }
        }

        place()
        searchInputRef.current?.focus({ preventScroll: true })

        const handlePointerDown = (e: PointerEvent) => {
          if (!e.composedPath().includes(area)) {
            close(false)
          }
        }

        // 選択でタグが増えるとトリガの高さが変わるため、スクロールとリサイズだけでは足りない
        const triggerObserver = new ResizeObserver(place)

        triggerObserver.observe(trigger)
        document.addEventListener('pointerdown', handlePointerDown, true)
        window.addEventListener('scroll', place, { capture: true, passive: true })
        window.addEventListener('resize', place, { passive: true })

        return () => {
          triggerObserver.disconnect()
          document.removeEventListener('pointerdown', handlePointerDown, true)
          window.removeEventListener('scroll', place, true)
          window.removeEventListener('resize', place)
        }
      },
      handleClickTrigger: () => {
        if (latest.isOpen) {
          close(true)
        } else {
          open()
        }
      },
      handleKeyDownTrigger: (e: KeyboardEvent<HTMLButtonElement>) => {
        if (!latest.isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
          e.preventDefault()
          open()
        }
      },
      handleKeyDownEscape: (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Escape' && !e.nativeEvent.isComposing) {
          // 伝播させないのは、document で Escape を聞く外側の Dialog や Drawer まで閉じてしまうため。
          // ドロワーではフォーカスの復帰を FocusTrap に任せる
          e.stopPropagation()
          close(latest.shell === 'popup')
        }
      },
      handleDelegateBlur: (e: FocusEvent<HTMLDivElement>) => {
        const next = e.relatedTarget

        // relatedTarget が null のとき閉じないのは、ウィンドウの切り替えでも null になるため。外側のクリックは pointerdown で閉じる
        if (
          latest.isOpen &&
          latest.shell === 'popup' &&
          next instanceof Node &&
          !e.currentTarget.contains(next)
        ) {
          close(false)
        }
      },
      handleClose: () => close(true),
      handleCloseDrawer: () => close(false),
      handleChangeQuery: (e: ChangeEvent<HTMLInputElement>) =>
        updateQuery(e.currentTarget.value, true),
      handleClearQuery: () => {
        updateQuery('', false)
        searchInputRef.current?.focus()
      },
      handleKeyDownSearch: (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.isComposing) return

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault()
            moveActive('next')
            break
          case 'ArrowUp':
            e.preventDefault()
            moveActive('prev')
            break
          case 'Home':
          case 'End':
            // アクティブな選択肢が無いときに奪わないのは、入力欄のキャレット移動を残すため
            if (latest.activeIndex !== -1) {
              e.preventDefault()
              moveActive(e.key === 'Home' ? 'first' : 'last')
            }
            break
          case 'Enter': {
            e.preventDefault()

            const item = latest.visibleOptions[latest.activeIndex]

            if (item) {
              toggle(item)
            }
            break
          }
        }
      },
      handleDelegateClickOption: (e: MouseEvent) => {
        const item = resolveOption(e)

        if (item) {
          toggle(item)
        }
      },
      handleDelegateMouseOverOption: (e: MouseEvent) => {
        const item = resolveOption(e)

        if (item && !item.disabled) {
          setActiveKey(itemKey(item))
        }
      },
      // フォーカスを option に移さないのは、検索欄のキャレットと読み上げ位置を保つため
      handleMouseDownList: (e: MouseEvent) => e.preventDefault(),
      handleClearSelection: () => {
        commit([])
        focusFallback()
      },
      handleToggleChips: () => setChipsExpanded((current) => !current),
      handleClickRemove: (e: MouseEvent<HTMLButtonElement>) => {
        const index = Number(e.currentTarget.dataset.removeIndex)
        const list = e.currentTarget.closest('ul')

        commit(latest.selected.filter((_, i) => i !== index))
        requestAnimationFrame(() => {
          const buttons = list?.querySelectorAll<HTMLButtonElement>('button[data-remove-index]')

          const next = buttons?.[Math.min(index, buttons.length - 1)]

          // 見つかったボタンをそのまま使わないのは、最後の1件を消すとリストごと外れ、外れたリストに古いボタンが残るため
          if (next?.isConnected) {
            next.focus()
          } else {
            focusFallback()
          }
        })
      },
    }
  }, [latest])

  const { localize } = useIntl()
  const requiredMessage = localize(REQUIRED_MESSAGES[mode])
  const isMissing = Boolean(required) && selected.length === 0
  const validityRef = useLayoutEffectRef(
    (node: HTMLInputElement | null) => {
      node?.setCustomValidity(isMissing ? requiredMessage : '')
    },
    [isMissing, requiredMessage],
  )

  const mergedTriggerRef = useMergeRefs(triggerRef, functions.triggerCallbackRef, ref)
  const mergedListAreaRef = useMergeRefs(listAreaRef, functions.listAreaCallbackRef)

  const wrapperClass = useMemo(() => SLOT_CLASS_NAMES.wrapper({ className }), [className])

  const selectedCount = selected.length
  const firstSelected = selected[0]
  const visibleTags = maxVisibleItems === undefined ? selected : selected.slice(0, maxVisibleItems)
  const hiddenTagCount = selectedCount - visibleTags.length
  const ruleOfMode = MODE_RULES[mode]
  const indicatorClassName = mode === 'single' ? CLASS_NAMES.radio : CLASS_NAMES.checkbox
  const triggerValueClassName = mode === 'single' ? CLASS_NAMES.singleValue : CLASS_NAMES.tags

  const summary =
    selectedCount === 0 ? (
      <Localizer id="smarthr-ui/Experimental/Combobox/unselected" defaultText="未選択" />
    ) : mode === 'single' ? (
      <Localizer id="smarthr-ui/Experimental/Combobox/selected" defaultText="選択済み" />
    ) : (
      <Localizer
        id="smarthr-ui/Experimental/Combobox/selectedCount"
        defaultText="選択中：{count}件"
        values={{ count: selectedCount }}
      />
    )

  const clearSelectionButton = (
    <UnstyledButton className={CLASS_NAMES.linkButton} onClick={functions.handleClearSelection}>
      <Text icon={<FaRotateLeftIcon />}>
        <Localizer id="smarthr-ui/Experimental/Combobox/clearSelection" defaultText="選択を解除" />
      </Text>
    </UnstyledButton>
  )

  const searchInput = (
    // name を付けないのは、検索文字列を form の送信値に含めないため
    // eslint-disable-next-line smarthr/a11y-input-has-name-attribute
    <Input
      ref={searchInputRef}
      role="combobox"
      type="text"
      value={query}
      autoComplete="off"
      className={CLASS_NAMES.searchInput}
      aria-label={localize({
        id: 'smarthr-ui/Experimental/Combobox/searchInputLabel',
        defaultText: '検索',
      })}
      aria-expanded={true}
      aria-controls={listboxId}
      aria-autocomplete="list"
      aria-activedescendant={activeIndex === -1 ? undefined : `${listboxId}-${activeIndex}`}
      onChange={functions.handleChangeQuery}
      onKeyDown={functions.handleKeyDownSearch}
      prefix={<FaMagnifyingGlassIcon />}
      subActionArea={
        query !== '' && (
          <UnstyledButton
            className={CLASS_NAMES.clearQueryButton}
            onClick={functions.handleClearQuery}
          >
            <FaCircleXmarkIcon
              alt={
                <Localizer
                  id="smarthr-ui/Experimental/Combobox/clearQuery"
                  defaultText="検索文字列をクリア"
                />
              }
              color="TEXT_BLACK"
            />
          </UnstyledButton>
        )
      }
    />
  )

  const truncatedHint = isTruncated && (
    <p className={CLASS_NAMES.hint}>
      <Localizer
        id="smarthr-ui/Experimental/Combobox/truncatedHint"
        defaultText="さらに表示するには検索文字列を変えてください"
      />
    </p>
  )

  const listArea = (
    // tabIndex を付けないと Chrome がスクロール領域を Tab の止まり先にし、検索欄の次で一度止まる。
    // 選択肢のスクロールは検索欄の矢印キーで行う
    // eslint-disable-next-line smarthr/a11y-scroller-has-tabindex
    <div ref={mergedListAreaRef} tabIndex={-1} className={CLASS_NAMES.listArea}>
      {/* キーボード操作は検索欄の onKeyDown で受け、フォーカスは option に移さない */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div
        role="listbox"
        id={listboxId}
        className={CLASS_NAMES.listbox}
        aria-label={label.text || undefined}
        aria-multiselectable={ruleOfMode.multiselectable || undefined}
        aria-busy={isPending || undefined}
        onClick={functions.handleDelegateClickOption}
        // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
        onMouseOver={functions.handleDelegateMouseOverOption}
        onMouseDown={functions.handleMouseDownList}
      >
        {visibleOptions.map((item, index) => (
          <div
            key={itemKey(item)}
            role="option"
            id={`${listboxId}-${index}`}
            className={CLASS_NAMES.option}
            aria-selected={isSelected(selected, item)}
            aria-disabled={item.disabled || undefined}
            // 内容から名前を作らせないのは、description まで名前に含まれてしまうため
            aria-labelledby={item.description ? `${listboxId}-${index}-label` : undefined}
            aria-describedby={item.description ? `${listboxId}-${index}-description` : undefined}
            data-index={index}
            data-active={index === activeIndex}
          >
            <span className={indicatorClassName} aria-hidden>
              {mode === 'single' ? (
                <span className={CLASS_NAMES.radioDot} />
              ) : (
                <FaCheckIcon className={CLASS_NAMES.checkIcon} />
              )}
            </span>
            <span className={CLASS_NAMES.optionBody}>
              <span id={`${listboxId}-${index}-label`}>{item.label}</span>
              {item.description && (
                <span
                  id={`${listboxId}-${index}-description`}
                  className={CLASS_NAMES.optionDescription}
                >
                  {item.description}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
      {hasLoadItems && loaded === null ? (
        <div className={CLASS_NAMES.loaderWrapper}>
          <Loader size="S" />
        </div>
      ) : (
        options.length === 0 &&
        !isPending && (
          <LiveRegion className={CLASS_NAMES.status}>
            {noResultText ?? (
              <Localizer
                id="smarthr-ui/Combobox/noResultsText"
                defaultText="一致する選択肢がありません。"
              />
            )}
          </LiveRegion>
        )
      )}
      {shell === 'drawer' && truncatedHint}
    </div>
  )

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={wrapperClass}
      style={{ width: typeof width === 'number' ? `${width}px` : width }}
      onBlur={functions.handleDelegateBlur}
    >
      <button
        ref={mergedTriggerRef}
        type="button"
        disabled={disabled}
        className={CLASS_NAMES.trigger}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-invalid={error || undefined}
        data-smarthr-ui-input="true"
        data-smarthr-ui-input-error={error || undefined}
        onClick={functions.handleClickTrigger}
        onKeyDown={functions.handleKeyDownTrigger}
      >
        <span id={valueId} className={CLASS_NAMES.triggerValue}>
          <span className={triggerValueClassName}>
            {firstSelected === undefined
              ? null
              : mode === 'single'
                ? getSelectedLabelText(firstSelected)
                : visibleTags
                    .map((item) => (
                      <span key={itemKey(item)} className={CLASS_NAMES.tag}>
                        {item.label}
                      </span>
                    ))
                    .concat(
                      hiddenTagCount > 0 ? (
                        <span key="more" className={CLASS_NAMES.tag}>
                          <span aria-hidden>
                            <Localizer
                              id="smarthr-ui/Experimental/Combobox/moreItems"
                              defaultText="+{count}"
                              values={{ count: hiddenTagCount }}
                            />
                          </span>
                          <VisuallyHiddenText>
                            <Localizer
                              id="smarthr-ui/Experimental/Combobox/moreItemsLabel"
                              defaultText="ほか{count}件"
                              values={{ count: hiddenTagCount }}
                            />
                          </VisuallyHiddenText>
                        </span>
                      ) : (
                        []
                      ),
                    )}
          </span>
        </span>
        <FaCaretDownIcon className={CLASS_NAMES.caret} />
      </button>
      {name &&
        ruleOfMode
          .formValues(selected)
          .map((value, index) => (
            <input
              key={`${index}-${value}`}
              type="hidden"
              name={name}
              disabled={disabled}
              value={value}
            />
          ))}
      {required && (
        // 送信時の検証だけに使う。見えるラベルはトリガ側にあるため FormControl で囲まず、送信値にもしない
        // eslint-disable-next-line smarthr/a11y-input-in-form-control, smarthr/a11y-input-has-name-attribute
        <input
          ref={validityRef}
          type="text"
          required
          disabled={disabled}
          value={selectedCount > 0 ? 'selected' : ''}
          tabIndex={-1}
          className={CLASS_NAMES.requiredInput}
          aria-hidden
          onChange={NOOP}
          onFocus={() => triggerRef.current?.focus()}
        />
      )}
      {shell === 'popup' && isOpen && (
        // Escape を検索欄ではなく dialog 全体で受けないと、ヘッダのボタンにいるとき外側の Dialog が閉じる
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <div
          ref={functions.popupCallbackRef}
          role="dialog"
          // 常に popover を付けないのは、jsdom が popover の要素を隠すのに showPopover を持たず、開いても見えないままになるため
          popover={supportsPopover() ? 'manual' : undefined}
          className={CLASS_NAMES.popup}
          aria-labelledby={label.id}
          onKeyDown={functions.handleKeyDownEscape}
        >
          <div className={CLASS_NAMES.popupInner}>
            <div className={CLASS_NAMES.popupHeader}>
              <Cluster align="center">
                <Text size="S" weight="bold">
                  {summary}
                </Text>
                {mode === 'single' && selectedCount > 0 && clearSelectionButton}
              </Cluster>
              <Button size="S" onClick={functions.handleClose}>
                <FaXmarkIcon
                  alt={
                    <Localizer
                      id="smarthr-ui/Experimental/Combobox/closeButtonIconAlt"
                      defaultText="閉じる"
                    />
                  }
                />
              </Button>
            </div>
            <div className={CLASS_NAMES.searchArea}>{searchInput}</div>
            {listArea}
            {truncatedHint}
          </div>
        </div>
      )}
      {shell === 'drawer' && (
        // 検索欄を最初のフォーカス先にしないのは、タッチ端末でソフトキーボードが上がって選択肢が隠れるため
        <ControlledDrawer
          position="bottom"
          isOpen={isOpen}
          onClickClose={functions.handleCloseDrawer}
          onPressEscape={functions.handleCloseDrawer}
          onClickOverlay={functions.handleCloseDrawer}
          onKeyDown={functions.handleKeyDownEscape}
        >
          <DrawerHeader title={label.text} />
          <div className={CLASS_NAMES.drawerBody}>
            <div className={CLASS_NAMES.drawerSearchArea}>{searchInput}</div>
            {listArea}
          </div>
          <DrawerFooter className={CLASS_NAMES.drawerFooter}>
            <div className={CLASS_NAMES.drawerFooterContent}>
              {mode === 'single' ? (
                firstSelected === undefined ? (
                  <Text size="S" weight="bold">
                    {summary}
                  </Text>
                ) : (
                  // Cluster にしないのは、長いラベルで折り返すと「選択を解除」が下の行へ落ちるため
                  <div className={CLASS_NAMES.singleSummary}>
                    <Text as="p" size="S" className={CLASS_NAMES.singleSummaryText}>
                      <Text weight="bold">
                        <Localizer
                          id="smarthr-ui/Experimental/Combobox/selectedPrefix"
                          defaultText="選択中："
                        />
                      </Text>
                      <br />
                      {getSelectedLabelText(firstSelected)}
                    </Text>
                    {clearSelectionButton}
                  </div>
                )
              ) : (
                <Stack gap={0.5}>
                  <Cluster justify="space-between" align="center">
                    <Text size="S" weight="bold">
                      {summary}
                    </Text>
                    {selectedCount > 0 && (
                      <UnstyledButton
                        className={CLASS_NAMES.linkButton}
                        aria-expanded={chipsExpanded}
                        onClick={functions.handleToggleChips}
                      >
                        <Text icon={<FaChevronDownIcon className={CLASS_NAMES.chevron} />}>
                          {chipsExpanded ? (
                            <Localizer
                              id="smarthr-ui/Experimental/Combobox/collapse"
                              defaultText="折りたたむ"
                            />
                          ) : (
                            <Localizer
                              id="smarthr-ui/Experimental/Combobox/expand"
                              defaultText="すべて表示"
                            />
                          )}
                        </Text>
                      </UnstyledButton>
                    )}
                  </Cluster>
                  {chipsExpanded && selectedCount > 0 && (
                    <ul className={CLASS_NAMES.chips}>
                      {selected.map((item, index) => (
                        <li key={itemKey(item)} className={CLASS_NAMES.chip}>
                          <span className={CLASS_NAMES.chipLabel}>{item.label}</span>
                          <UnstyledButton
                            className={CLASS_NAMES.chipButton}
                            data-remove-index={index}
                            onClick={functions.handleClickRemove}
                          >
                            <FaCircleXmarkIcon
                              alt={
                                <Localizer
                                  id="smarthr-ui/Experimental/Combobox/removeItem"
                                  defaultText="{name}を削除"
                                  values={{ name: getSelectedLabelText(item) }}
                                />
                              }
                              color="TEXT_LINK"
                            />
                          </UnstyledButton>
                        </li>
                      ))}
                    </ul>
                  )}
                </Stack>
              )}
            </div>
          </DrawerFooter>
        </ControlledDrawer>
      )}
    </div>
  )
}
