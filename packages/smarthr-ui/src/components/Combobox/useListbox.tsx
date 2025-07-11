import {
  type ChangeEventHandler,
  type FocusEvent,
  type KeyboardEvent,
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { type DecoratorsType, useDecorators } from '../../hooks/useDecorators'
import { useEnhancedEffect } from '../../hooks/useEnhancedEffect'
import { usePortal } from '../../hooks/usePortal'
import { useIntl } from '../../intl'
import { tabbable } from '../../libs/tabbable'
import { spacing } from '../../themes'
import { FaMagnifyingGlassIcon } from '../Icon'
import { Input } from '../Input'
import { Center } from '../Layout'
import { Loader } from '../Loader'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { ItemButton } from './ItemButton'
import { useActiveOption } from './useActiveOption'
import { usePartialRendering } from './usePartialRendering'

import type { ComboboxItem, ComboboxOption } from './types'

type Props<T> = {
  options: Array<ComboboxOption<T>>
  dropdownWidth?: string | number
  onAdd?: (label: string) => void
  onSelect: (item: ComboboxItem<T>) => void
  isExpanded: boolean
  isLoading?: boolean
  triggerRef: RefObject<HTMLElement>
  decorators?: DecoratorsType<DecoratorKeyTypes>
  searchValue?: string
  onSearchValueChange?: (value: string) => void
  onChangeInput?: ChangeEventHandler<HTMLInputElement>
  onEscape?: () => void
  onShiftTab?: () => void
}

type Rect = {
  top: number
  left: number
  height?: number
}

type DecoratorKeyTypes = 'loadingText' | 'noResultText'

const KEY_DOWN_REGEX = /^(Arrow)?Down$/
const KEY_UP_REGEX = /^(Arrow)?Up/
const ESCAPE_KEY_REGEX = /^Esc(ape)?$/

const { wrapper, dropdownList, inputWrapper, input, helpMessage, noItems } = tv({
  slots: {
    wrapper: 'shr-absolute',
    dropdownList: [
      'smarthr-ui-Combobox-dropdownList',
      'shr-absolute shr-z-overlap shr-box-border shr-min-w-full shr-overflow-y-auto shr-overscroll-contain shr-rounded-m shr-bg-white shr-shadow-layer-3',
      /* 縦スクロールに気づきやすくするために8個目のアイテムが半分見切れるように max-height を算出
      = (アイテムのフォントサイズ + アイテムの上下padding) * 7.5 + コンテナの上padding */
      'shr-max-h-[calc((theme(fontSize.base)_+_theme(spacing[0.5])_*_2)_*_7.5_+_theme(spacing[0.5]))]',
      'aria-hidden:shr-hidden',
    ],
    inputWrapper: 'shr-sticky shr-top-0 shr-bg-white shr-p-0.5',
    input: 'shr-w-full',
    helpMessage:
      'shr-whitespace-[initial] shr-border-b-shorthand shr-mx-0.5 shr-mb-0.5 shr-mt-0 shr-px-0.5 shr-pb-0.5 shr-pt-0 shr-text-sm',
    noItems: 'smarthr-ui-Combobox-noItems shr-my-0 shr-bg-white shr-px-1 shr-py-0.5 shr-text-base',
  },
})()
const classNames = {
  wrapper: wrapper(),
  dropdownList: dropdownList(),
  inputWrapper: inputWrapper(),
  input: input(),
  helpMessage: helpMessage(),
  noItems: noItems(),
}

export const useListbox = <T,>({
  options,
  dropdownWidth,
  onAdd,
  onSelect,
  isExpanded,
  isLoading,
  triggerRef,
  decorators,
  searchValue: externalSearchValue,
  onSearchValueChange,
  onChangeInput,
  onEscape,
}: Props<T>) => {
  const [navigationType, setNavigationType] = useState<'pointer' | 'key'>('pointer')
  const { activeOption, setActiveOption, moveActiveOptionIndex } = useActiveOption({ options })
  const { localize } = useIntl()
  const [internalSearchValue, setInternalSearchValue] = useState('')

  const searchValue = externalSearchValue !== undefined ? externalSearchValue : internalSearchValue
  const setSearchValue = onSearchValueChange || setInternalSearchValue

  useEffect(() => {
    // 閉じたときに activeOption を初期化
    if (!isExpanded) {
      setActiveOption(null)
    }
  }, [isExpanded, setActiveOption])

  useEffect(() => {
    // ドロップダウンが閉じたときに検索値をクリア（外部制御でない場合のみ）
    if (!isExpanded && externalSearchValue === undefined) {
      setSearchValue('')
    }
  }, [isExpanded, externalSearchValue, setSearchValue])

  const listBoxRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [listBoxRect, setListBoxRect] = useState<Rect>({
    top: 0,
    left: 0,
  })
  // HINT: calculateRectで同時に計算するとwidthの幅が変更されるタイミングの問題でlistBoxHeightが変化する場合がある
  const [triggerWidth, setTriggerWidth] = useState(0)

  useEffect(() => {
    if (!triggerRef.current) {
      return
    }

    const rect = triggerRef.current.getBoundingClientRect()

    setTriggerWidth(rect.width)
  }, [isExpanded, triggerRef])

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
      height,
    })
    setTriggerWidth(rect.width)
  }, [listBoxRef, triggerRef])

  const activeRef = useRef<HTMLButtonElement>(null)

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
  }, [activeOption, listBoxRef, navigationType])

  useEnhancedEffect(() => {
    if (isExpanded) {
      // options の更新毎に座標を再計算する
      calculateRect()
    }
  }, [calculateRect, isExpanded, options])

  const onKeyDownListBox = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      setNavigationType('key')

      if (KEY_DOWN_REGEX.test(e.key)) {
        e.stopPropagation()
        moveActiveOptionIndex(activeOption, 1)
      } else if (KEY_UP_REGEX.test(e.key)) {
        e.stopPropagation()
        moveActiveOptionIndex(activeOption, -1)
      } else if (e.key === 'Enter') {
        if (activeOption === null) {
          return
        }

        e.stopPropagation()

        if (!activeOption.isNew) {
          onSelect(activeOption.item)
        } else if (onAdd) {
          onAdd(activeOption.item.value)
        }
      } else if (ESCAPE_KEY_REGEX.test(e.key)) {
        e.stopPropagation()
        onEscape?.()
      } else if (e.key === 'Tab') {
        e.preventDefault()
        e.stopPropagation()

        if (e.shiftKey) {
          // Shift+Tabの場合：パネルを閉じてトリガー要素にフォーカス
          onEscape?.()
          requestAnimationFrame(() => {
            if (triggerRef.current) {
              const focusableElements = tabbable(triggerRef.current)
              const lastElement = focusableElements[focusableElements.length - 1]
              if (lastElement) {
                lastElement.focus()
              }
            }
          })
        } else {
          // 順方向Tabの場合：パネルを閉じてトリガーの次の要素にフォーカス
          onEscape?.()
          requestAnimationFrame(() => {
            if (triggerRef.current) {
              const allFocusableElements = tabbable(document.body)
              const triggerElements = tabbable(triggerRef.current)
              const lastTriggerElement = triggerElements[triggerElements.length - 1]

              if (lastTriggerElement) {
                const triggerIndex = allFocusableElements.indexOf(lastTriggerElement)
                const nextElement = allFocusableElements[triggerIndex + 1]

                if (nextElement) {
                  nextElement.focus()
                }
              }
            }
          })
        }
      } else {
        setActiveOption(null)
      }
    },
    [activeOption, moveActiveOptionIndex, onAdd, onSelect, setActiveOption, onEscape, triggerRef],
  )

  const onBlurListBox = useCallback(
    (e: FocusEvent<HTMLDivElement>) => {
      // リストボックス内の要素間でのフォーカス移動は無視
      if (e.currentTarget.contains(e.relatedTarget as Node)) {
        return
      }

      // リストボックス外にフォーカスが移動した場合はonEscapeを呼ぶ
      onEscape?.()
    },
    [onEscape],
  )

  const { createPortal } = usePortal()
  const listBoxId = useId()
  const { items: partialOptions, renderIntersection } = usePartialRendering({
    items: options,
    minLength: useMemo(
      () => (activeOption === null ? 0 : options.indexOf(activeOption)) + 1,
      [activeOption, options],
    ),
  })

  const handleAdd = useMemo(() => {
    if (!onAdd) {
      return
    }

    return (option: ComboboxOption<T>) => {
      // HINT: Dropdown系コンポーネント内でComboboxを使うと、選択肢がportalで表現されている関係上Dropdownが閉じてしまう
      // requestAnimationFrameを追加、処理を遅延させることで正常に閉じる/閉じないの判定を行えるようにする
      requestAnimationFrame(() => {
        onAdd(option.item.value)
      })
    }
  }, [onAdd])
  const handleSelect = useCallback(
    (option: ComboboxOption<T>) => {
      onSelect(option.item)
    },
    [onSelect],
  )
  const handleHoverOption = useCallback(
    (option: ComboboxOption<T>) => {
      setNavigationType('pointer')
      setActiveOption(option)
    },
    [setActiveOption],
  )

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
      maxWidth: `calc(100vw - ${left}px - ${spacing[0.5]})`,
      height: height ? `${height}px` : undefined,
    }
  }, [listBoxRect, triggerWidth, dropdownWidth])

  const decoratorDefaultTexts = useMemo(
    () => ({
      loadingText: localize({ id: 'smarthr-ui/Combobox/loadingText', defaultText: '処理中' }),
      noResultText: localize({
        id: 'smarthr-ui/Combobox/noResultsText',
        defaultText: '一致する選択肢がありません。',
      }),
    }),
    [localize],
  )

  const decorated = useDecorators<DecoratorKeyTypes>(decoratorDefaultTexts, decorators)

  const renderListBox = useCallback(
    () =>
      createPortal(
        <div className={classNames.wrapper} style={wrapperStyle}>
          {isExpanded && isLoading && (
            <VisuallyHiddenText role="status">{decorated.loadingText}</VisuallyHiddenText>
          )}
          <div role="presentation" onBlur={onBlurListBox}>
            <div
              id={listBoxId}
              ref={listBoxRef}
              role="listbox"
              aria-hidden={!isExpanded}
              className={classNames.dropdownList}
              style={dropdownListStyle}
            >
              <div className={classNames.inputWrapper}>
                {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute, smarthr/a11y-input-in-form-control */}
                <Input
                  ref={searchInputRef}
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value)
                    onChangeInput?.(e)
                  }}
                  onKeyDown={onKeyDownListBox}
                  prefix={<FaMagnifyingGlassIcon />}
                  disabled={isLoading}
                  className={classNames.input}
                />
              </div>
              {isExpanded &&
                (isLoading ? (
                  <Center verticalCentering padding={1}>
                    <Loader aria-hidden />
                  </Center>
                ) : options.length === 0 ? (
                  <p role="alert" aria-live="polite" className={classNames.noItems}>
                    {decorated.noResultText}
                  </p>
                ) : (
                  partialOptions.map((option) => (
                    <ItemButton
                      key={option.id}
                      option={option}
                      onAdd={handleAdd}
                      onSelect={handleSelect}
                      onMouseOver={handleHoverOption}
                      activeRef={option.id === activeOption?.id ? activeRef : undefined}
                    />
                  ))
                ))}
              {renderIntersection()}
            </div>
          </div>
        </div>,
      ),
    [
      activeOption?.id,
      renderIntersection,
      partialOptions,
      options.length,
      isExpanded,
      isLoading,
      listBoxId,
      decorated,
      handleAdd,
      handleHoverOption,
      handleSelect,
      dropdownListStyle,
      wrapperStyle,
      createPortal,
      searchValue,
      setSearchValue,
      onKeyDownListBox,
      onChangeInput,
      onBlurListBox,
    ],
  )

  return {
    renderListBox,
    activeOption,
    listBoxId,
    listBoxRef,
    searchInputRef,
  }
}
