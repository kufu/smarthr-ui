'use client'

import { type FC, type ReactNode, useCallback, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { tv } from 'tailwind-variants'

import { type SafeAreaInsets, useSafeAreaInsets } from '../../../hooks/client/useSafeAreaInsets'
import { useTheme } from '../../../hooks/client/useTheme'
import { debounce } from '../../../libs/debounce'
import { ControlledTooltip } from '../ControlledTooltip'

import type { ExtendElementPropsWithoutRef } from '../../../types'

const subscribeFullscreenChange = (callback: () => void) => {
  window.addEventListener('fullscreenchange', callback)

  return () => {
    window.removeEventListener('fullscreenchange', callback)
  }
}
const getPortalRoot = () => document.fullscreenElement ?? document.body
const getPortalRootOnSSR = () => null

type Props = ExtendElementPropsWithoutRef<
  'div',
  {
    messageId: string
    message: ReactNode
    isVisible: boolean
    parentRect: DOMRect | null
    isIcon?: boolean
  },
  { omit: 'children' | 'role' | 'className' | 'style' | 'aria-hidden' }
>

const classNameGenerator = tv({
  slots: {
    container: 'smarthr-ui-Tooltip-popup shr-absolute shr-z-overlap aria-hidden:shr-hidden',
    // HINT: 中身をスクロール可能にすると inline-block の baseline が下端になり、下に行の余白ができるため上揃えにする
    balloon: 'shr-max-w-full shr-align-top [&&&]:shr-whitespace-normal',
    // HINT: 高さを制限する場合は、吹き出しの中身をスクロールさせて吹き出し自体が制限した高さに収まるようにする
    balloonText: 'shr-m-0 shr-box-border shr-overflow-y-auto shr-px-1 shr-py-0.5',
  },
})

const CLASS_NAMES = (() => {
  const { container, balloon, balloonText } = classNameGenerator()

  return {
    container: container(),
    balloon: balloon(),
    balloonText: balloonText(),
  }
})()

const OUTER_MARGIN = 10
const SPACING = 5

type HorizontalType = 'left' | 'center' | 'right'
type VerticalType = 'top' | 'middle' | 'bottom'

export const TooltipPortal: FC<Props> = ({
  messageId,
  message,
  isVisible,
  parentRect,
  isIcon,
  ...rest
}) => {
  const theme = useTheme()
  const getSafeAreaInsets = useSafeAreaInsets()
  const portalRoot = useSyncExternalStore(
    subscribeFullscreenChange,
    getPortalRoot,
    getPortalRootOnSSR,
  )
  const [style, setStyle] = useState<{ [key: string]: undefined | string }>({})
  const [actualHorizontal, setActualHorizontal] = useState<HorizontalType>('center')
  const [actualVertical, setActualVertical] = useState<VerticalType>('bottom')
  const [messageMaxHeight, setMessageMaxHeight] = useState<string | undefined>(undefined)

  // HINT: smarthr-ui外部からrefを受け取る様になった場合、useLayoutEffectRef + useMergeRefsに変更する
  const callbackRef = useCallback(
    (element: HTMLElement | null) => {
      if (!element || !parentRect) {
        return
      }

      const action = () => {
        const safeAreaInsets = getSafeAreaInsets()
        const messageElement = document.getElementById(messageId)
        // HINT: maxHeightで高さが制限され中身がスクロールしている場合でも、中身全体の高さを元に計算し直せるよう、
        // スクロールで隠れている分を足す
        const portalHeight =
          element.offsetHeight +
          (messageElement ? messageElement.scrollHeight - messageElement.clientHeight : 0)
        const vertical = calculateVertical(portalHeight, parentRect, safeAreaInsets)
        const horizontal = calculateHorizontal(
          element.offsetWidth,
          parentRect,
          theme,
          safeAreaInsets,
        )

        setStyle({
          insetBlockStart: vertical.insetBlockStart,
          transform: vertical.transform,
          insetInlineStart: horizontal.insetInlineStart,
          insetInlineEnd: horizontal.insetInlineEnd,
          maxWidth: horizontal.maxWidth,
        })
        setMessageMaxHeight(vertical.maxHeight)
        setActualVertical(vertical.alignment)
        setActualHorizontal(horizontal.alignment)
      }
      const debouncedAction = debounce(action, 100)

      action()

      window.addEventListener('resize', debouncedAction)

      // HINT: 表示したまま message が変わるなどして大きさが変わった場合も、位置を計算し直す。
      // containerはmaxHeightで高さが制限されて変化を検知できない場合があるため、中身の吹き出しを監視する
      const resizeObserver = new ResizeObserver(action)

      resizeObserver.observe(element.firstElementChild ?? element)

      return () => {
        window.removeEventListener('resize', debouncedAction)
        debouncedAction.cancel()
        resizeObserver.disconnect()
      }
    },
    [parentRect, theme, getSafeAreaInsets, messageId],
  )

  if (!portalRoot) {
    return null
  }

  return createPortal(
    <div
      {...rest}
      ref={callbackRef}
      role="tooltip"
      className={CLASS_NAMES.container}
      style={isVisible ? style : undefined}
      aria-hidden={!isVisible}
    >
      <ControlledTooltip
        horizontal={actualHorizontal}
        vertical={actualVertical}
        triggerIcon={isIcon}
        className={CLASS_NAMES.balloon}
      >
        <div
          id={messageId}
          className={CLASS_NAMES.balloonText}
          style={isVisible && messageMaxHeight ? { maxHeight: messageMaxHeight } : undefined}
        >
          {message}
        </div>
      </ControlledTooltip>
    </div>,
    portalRoot,
  )
}

const calculateVertical = (
  portalHeight: number,
  parentRect: DOMRect,
  safeAreaInsets: SafeAreaInsets,
): {
  insetBlockStart: string
  transform: string | undefined
  maxHeight: string | undefined
  alignment: VerticalType
} => {
  // HINT: safe areaに重ならない領域を、ツールチップを表示できる範囲とする
  const safeTop = safeAreaInsets.top

  // HINT: トリガの上側に配置する場合は、ツールチップの下端をトリガの上端(からSPACING分離した位置)に揃える。
  // 上端の位置で配置すると、表示したまま中身が増えた際に下に伸びてトリガに重なってしまうため、
  // 下端を基準にして上に伸びるようにする
  const aboveInsetBlockStart = `${scrollY + parentRect.top - SPACING}px`
  const aboveTransform = 'translateY(-100%)'

  // トリガの上側の領域に収まる場合
  // HINT: トリガとの間にSPACING分の隙間を空けて配置するため、判定にも含める
  if (parentRect.top - portalHeight - SPACING >= safeTop) {
    return {
      insetBlockStart: aboveInsetBlockStart,
      transform: aboveTransform,
      maxHeight: undefined,
      alignment: 'bottom',
    }
  }

  const safeBottom = innerHeight - safeAreaInsets.bottom

  // トリガの下側の領域に収まる場合
  if (parentRect.bottom + portalHeight + SPACING <= safeBottom) {
    return {
      insetBlockStart: `${scrollY + parentRect.bottom + SPACING}px`,
      transform: undefined,
      maxHeight: undefined,
      alignment: 'top',
    }
  }

  const triggerHeight = parentRect.bottom - parentRect.top

  // 上側の領域のほうが広い場合
  if (parentRect.top + triggerHeight / 2 >= (safeTop + safeBottom) / 2) {
    return {
      insetBlockStart: aboveInsetBlockStart,
      transform: aboveTransform,
      maxHeight: `${parentRect.top - safeTop - OUTER_MARGIN}px`,
      alignment: 'bottom',
    }
  }

  // 下側の領域のほうが広い場合
  return {
    insetBlockStart: `${scrollY + parentRect.bottom + SPACING}px`,
    transform: undefined,
    maxHeight: `${safeBottom - parentRect.bottom - OUTER_MARGIN}px`,
    alignment: 'top',
  }
}

type ReturnCalculateHorizontalType = {
  insetInlineStart: string | undefined
  insetInlineEnd: string | undefined
  maxWidth: string
  alignment: HorizontalType
}
const calculateHorizontal = (
  portalWidth: number,
  parentRect: DOMRect,
  theme: ReturnType<typeof useTheme>,
  safeAreaInsets: SafeAreaInsets,
): ReturnCalculateHorizontalType => {
  const triggerAlignCenter = parentRect.left + parentRect.width / 2
  const portalHalfWidth = portalWidth / 2
  const edgeSpacing = theme.spacingByChar(0.5)
  // HINT: トリガに揃えていない側は、safe areaの外側に余白を取る
  const rightEdgeSpacing = `(${edgeSpacing} + ${safeAreaInsets.right}px)`

  const leftSpacing = triggerAlignCenter - portalHalfWidth
  const safeLeft = safeAreaInsets.left
  const safeRight = document.body.clientWidth - safeAreaInsets.right

  // トリガを中心に左右に十分な余白がある場合
  if (
    leftSpacing > safeLeft + SPACING &&
    triggerAlignCenter + portalHalfWidth < safeRight - SPACING
  ) {
    const insetInlineStart = `${leftSpacing}px`

    return {
      insetInlineStart,
      insetInlineEnd: undefined,
      maxWidth: `calc(100% - max(${insetInlineStart}, 0px) - ${rightEdgeSpacing})`,
      alignment: 'center',
    }
  }

  // トリガが画面左寄りの場合
  if (triggerAlignCenter <= (safeLeft + safeRight) / 2) {
    const insetInlineStart = `${scrollX + parentRect.left - SPACING}px`

    return {
      insetInlineStart,
      insetInlineEnd: undefined,
      maxWidth: `calc(100% - max(${insetInlineStart}, 0px) - ${rightEdgeSpacing})`,
      alignment: 'left',
    }
  }

  // トリガが画面右寄りの場合
  const insetInlineEnd = `${document.body.clientWidth - SPACING - parentRect.right - scrollX}px`

  return {
    insetInlineStart: undefined,
    insetInlineEnd,
    maxWidth: `calc(100% - (${edgeSpacing} + ${safeAreaInsets.left}px) - max(${insetInlineEnd}, 0px))`,
    alignment: 'right',
  }
}
