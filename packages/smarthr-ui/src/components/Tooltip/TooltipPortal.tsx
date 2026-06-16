'use client'

import { type FC, type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { tv } from 'tailwind-variants'

import { useTheme } from '../../hooks/useTheme'
import { debounce } from '../../libs/debounce'

import { ControlledTooltip } from './ControlledTooltip'

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

const OUTER_MARGIN = 10
const SPACING = 5

type HorizontalType = 'left' | 'center' | 'right'
type VerticalType = 'top' | 'middle' | 'bottom'

export const TooltipPortal: FC<Props> = ({ messageId, message, isVisible, parentRect, isIcon }) => {
  const theme = useTheme()
  const portalRef = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<{ [key: string]: undefined | string }>({})
  const [actualHorizontal, setActualHorizontal] = useState<HorizontalType>('center')
  const [actualVertical, setActualVertical] = useState<VerticalType>('bottom')

  useEffect(() => {
    if (!portalRef.current || !parentRect) {
      return
    }

    const portal = portalRef.current

    const action = () => {
      const vertical = calculateVertical(portal.offsetHeight, parentRect)
      const horizontal = calculateHorizontal(portal.offsetWidth, parentRect, theme)

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
    }
  }, [parentRect, theme])

  const classNames = useMemo(() => {
    const { container, balloon, balloonText } = classNameGenerator()

    return {
      container: container(),
      balloon: balloon(),
      balloonText: balloonText(),
    }
  }, [])

  return (
    <div
      ref={portalRef}
      role="tooltip"
      aria-hidden={!isVisible}
      className={classNames.container}
      style={style}
    >
      <ControlledTooltip
        horizontal={actualHorizontal}
        vertical={actualVertical}
        triggerIcon={isIcon}
        className={classNames.balloon}
      >
        <div id={messageId} className={classNames.balloonText}>
          {message}
        </div>
      </ControlledTooltip>
    </div>
  )
}

const calculateVertical = (
  portalHeight: number,
  parentRect: DOMRect,
): { insetBlockStart: string; maxHeight: string | undefined; alignment: VerticalType } => {
  // トリガの上側の領域に収まる場合
  if (parentRect.top - portalHeight >= 0) {
    return {
      insetBlockStart: `${scrollY + parentRect.top - portalHeight - SPACING}px`,
      maxHeight: undefined,
      alignment: 'bottom',
    }
  }

  // トリガの下側の領域に収まる場合
  if (parentRect.bottom + portalHeight <= innerHeight) {
    return {
      insetBlockStart: `${scrollY + parentRect.bottom + SPACING}px`,
      maxHeight: undefined,
      alignment: 'top',
    }
  }

  const triggerHeight = parentRect.bottom - parentRect.top

  // 上側の領域のほうが広い場合
  if (parentRect.top + triggerHeight / 2 >= innerHeight / 2) {
    return {
      insetBlockStart: `${scrollY + OUTER_MARGIN - SPACING}px`,
      maxHeight: `${parentRect.top - OUTER_MARGIN}px`,
      alignment: 'bottom',
    }
  }

  // 下側の領域のほうが広い場合
  return {
    insetBlockStart: `${scrollY + parentRect.bottom + SPACING}px`,
    maxHeight: `${innerHeight - parentRect.bottom - OUTER_MARGIN}px`,
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
): ReturnCalculateHorizontalType => {
  const triggerAlignCenter = parentRect.left + parentRect.width / 2
  const portalHalfWidth = portalWidth / 2
  const edgeSpacing = theme.spacingByChar(0.5)

  // トリガを中心に左右に十分な余白がある場合
  if (
    triggerAlignCenter - portalHalfWidth > SPACING &&
    triggerAlignCenter + portalHalfWidth < document.body.clientWidth - SPACING
  ) {
    const insetInlineStart = `${triggerAlignCenter - portalHalfWidth}px`

    return {
      insetInlineStart,
      insetInlineEnd: undefined,
      maxWidth: `calc(100% - max(${insetInlineStart}, 0px) - ${edgeSpacing})`,
      alignment: 'center',
    }
  }

  // トリガが画面左寄りの場合
  if (triggerAlignCenter <= document.body.clientWidth / 2) {
    const insetInlineStart = `${scrollX + parentRect.left - SPACING}px`

    return {
      insetInlineStart,
      insetInlineEnd: undefined,
      maxWidth: `calc(100% - max(${insetInlineStart}, 0px) - ${edgeSpacing})`,
      alignment: 'left',
    }
  }

  // トリガが画面右寄りの場合
  const insetInlineEnd = `${document.body.clientWidth - parentRect.right - scrollX - SPACING}px`

  return {
    insetInlineStart: undefined,
    insetInlineEnd,
    maxWidth: `calc(100% - ${edgeSpacing} - max(${insetInlineEnd}, 0px))`,
    alignment: 'right',
  }
}
