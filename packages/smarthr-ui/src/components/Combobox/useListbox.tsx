import {
  type KeyboardEvent,
  type ReactNode,
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
import { spacing } from '../../themes'
import { FaInfoCircleIcon } from '../Icon'
import { Loader } from '../Loader'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { ItemButton } from './ItemButton'
import { useActiveOption } from './useActiveOption'
import { usePartialRendering } from './usePartialRendering'

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
  decorators?: DecoratorsType<DecoratorKeyTypes>
}

type Rect = {
  top: number
  left: number
  height?: number
}

type DecoratorKeyTypes = 'loadingText' | 'noResultText'

const KEY_DOWN_REGEX = /^(Arrow)?Down$/
const KEY_UP_REGEX = /^(Arrow)?Up/

const classNameGenerator = tv({
  slots: {
    wrapper: 'shr-absolute',
    dropdownList: [
      'smarthr-ui-Combobox-dropdownList',
      'shr-absolute shr-z-overlap shr-box-border shr-min-w-full shr-overflow-y-auto shr-rounded-m shr-bg-white shr-py-0.5 shr-shadow-layer-3',
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

export const useListbox = <T,>({
  options,
  dropdownHelpMessage,
  dropdownWidth,
  onAdd,
  onSelect,
  isExpanded,
  isLoading,
  triggerRef,
  decorators,
}: Props<T>) => {
  const [navigationType, setNavigationType] = useState<'pointer' | 'key'>('pointer')
  const { activeOption, setActiveOption, moveActiveOptionIndex } = useActiveOption({ options })
  const { localize } = useIntl()

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
      } else {
        setActiveOption(null)
      }
    },
    [activeOption, moveActiveOptionIndex, onAdd, onSelect, setActiveOption],
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

  const handleAdd = useMemo(
    () =>
      onAdd
        ? (option: ComboboxOption<T>) => {
            // HINT: Dropdown系コンポーネント内でComboboxを使うと、選択肢がportalで表現されている関係上Dropdownが閉じてしまう
            // requestAnimationFrameを追加、処理を遅延させることで正常に閉じる/閉じないの判定を行えるようにする
            requestAnimationFrame(() => {
              onAdd(option.item.value)
            })
          }
        : undefined,
    [onAdd],
  )
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
          <div
            id={listBoxId}
            ref={listBoxRef}
            role="listbox"
            aria-hidden={!isExpanded}
            className={classNames.dropdownList}
            style={dropdownListStyle}
          >
            {dropdownHelpMessage && (
              <p className={classNames.helpMessage}>
                <FaInfoCircleIcon color="TEXT_GREY" text={dropdownHelpMessage} iconGap={0.25} />
              </p>
            )}
            {isExpanded ? (
              isLoading ? (
                <div className={classNames.loaderWrapper}>
                  <Loader aria-hidden />
                </div>
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
              )
            ) : null}
            {renderIntersection()}
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
      dropdownHelpMessage,
      listBoxId,
      decorated,
      handleAdd,
      handleHoverOption,
      handleSelect,
      classNames,
      dropdownListStyle,
      wrapperStyle,
      createPortal,
    ],
  )

  return {
    renderListBox,
    activeOption,
    onKeyDownListBox,
    listBoxId,
    listBoxRef,
  }
}
