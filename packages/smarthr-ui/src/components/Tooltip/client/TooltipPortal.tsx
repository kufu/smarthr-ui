import { type FC, type ReactNode, useCallback, useState } from 'react'
import { tv } from 'tailwind-variants'

import { useCallbackRefCleanupForReact18 } from '../../../hooks/client/useCallbackRefCleanupForReact18'
import { useTheme } from '../../../hooks/client/useTheme'
import { debounce } from '../../../libs/debounce'
import { type SafeAreaInsets, getSafeAreaInsets } from '../../../libs/safeAreaInsets'
import { ControlledTooltip } from '../ControlledTooltip'

type Props = {
  messageId: string
  message: ReactNode
  isVisible: boolean
  parentRect: DOMRect | null
  isIcon?: boolean
}

const classNameGenerator = tv({
  slots: {
    container: 'smarthr-ui-Tooltip-popup shr-absolute shr-z-overlap aria-hidden:shr-hidden',
    balloon: 'shr-max-w-full [&&&]:shr-whitespace-normal',
    balloonText: 'shr-m-0 shr-px-1 shr-py-0.5',
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

export const TooltipPortal: FC<Props> = ({ messageId, message, isVisible, parentRect, isIcon }) => {
  const theme = useTheme()
  const [style, setStyle] = useState<{ [key: string]: undefined | string }>({})
  const [actualHorizontal, setActualHorizontal] = useState<HorizontalType>('center')
  const [actualVertical, setActualVertical] = useState<VerticalType>('bottom')

  // HINT: smarthr-ui外部からrefを受け取る様になった場合、useLayoutEffectRef + useMergeRefsに変更する
  const callbackRef = useCallbackRefCleanupForReact18(
    useCallback(
      (element: HTMLDivElement | null) => {
        if (!element || !parentRect) {
          return
        }

        const action = () => {
          const safeAreaInsets = getSafeAreaInsets()
          const vertical = calculateVertical(element.offsetHeight, parentRect, safeAreaInsets)
          const horizontal = calculateHorizontal(
            element.offsetWidth,
            parentRect,
            theme,
            safeAreaInsets,
          )

          setStyle({
            insetBlockStart: vertical.insetBlockStart,
            insetInlineStart: horizontal.insetInlineStart,
            insetInlineEnd: horizontal.insetInlineEnd,
            maxWidth: horizontal.maxWidth,
            maxHeight: vertical.maxHeight,
          })
          setActualVertical(vertical.alignment)
          setActualHorizontal(horizontal.alignment)
        }
        const debouncedAction = debounce(action, 100)

        action()

        window.addEventListener('resize', debouncedAction)

        return () => {
          window.removeEventListener('resize', debouncedAction)
          debouncedAction.cancel()
        }
      },
      [parentRect, theme],
    ),
  )

  return (
    <div
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
        <div id={messageId} className={CLASS_NAMES.balloonText}>
          {message}
        </div>
      </ControlledTooltip>
    </div>
  )
}

const calculateVertical = (
  portalHeight: number,
  parentRect: DOMRect,
  safeAreaInsets: SafeAreaInsets,
): { insetBlockStart: string; maxHeight: string | undefined; alignment: VerticalType } => {
  // HINT: safe areaに重ならない領域を、ツールチップを表示できる範囲とする
  const safeTop = safeAreaInsets.top

  // トリガの上側の領域に収まる場合
  if (parentRect.top - portalHeight >= safeTop) {
    return {
      insetBlockStart: `${scrollY + parentRect.top - portalHeight - SPACING}px`,
      maxHeight: undefined,
      alignment: 'bottom',
    }
  }

  const safeBottom = innerHeight - safeAreaInsets.bottom

  // トリガの下側の領域に収まる場合
  if (parentRect.bottom + portalHeight <= safeBottom) {
    return {
      insetBlockStart: `${scrollY + parentRect.bottom + SPACING}px`,
      maxHeight: undefined,
      alignment: 'top',
    }
  }

  const triggerHeight = parentRect.bottom - parentRect.top

  // 上側の領域のほうが広い場合
  if (parentRect.top + triggerHeight / 2 >= (safeTop + safeBottom) / 2) {
    return {
      insetBlockStart: `${scrollY + safeTop + OUTER_MARGIN - SPACING}px`,
      maxHeight: `${parentRect.top - safeTop - OUTER_MARGIN}px`,
      alignment: 'bottom',
    }
  }

  // 下側の領域のほうが広い場合
  return {
    insetBlockStart: `${scrollY + parentRect.bottom + SPACING}px`,
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
