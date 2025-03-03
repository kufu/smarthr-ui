import React, { type FC, type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { tv } from 'tailwind-variants'

import { Balloon } from '../Balloon'

import { getTooltipRect } from './tooltipHelper'

type Props = {
  message: ReactNode
  isVisible: boolean
  parentRect: DOMRect | null
  isIcon?: boolean
  isMultiLine?: boolean
  horizontal: 'left' | 'center' | 'right' | 'auto'
  vertical: 'top' | 'middle' | 'bottom' | 'auto'
  fullscreenElement: Element | null
}

const classNameGenerator = tv({
  slots: {
    container: 'smarthr-ui-Tooltip-popup shr-absolute shr-z-overlap aria-hidden:shr-hidden',
    balloon: '',
    balloonText: 'shr-m-0 shr-px-1 shr-py-0.5',
  },
  variants: {
    isMultiLine: {
      true: {
        balloon: 'shr-max-w-full [&&&]:shr-whitespace-normal',
      },
    },
  },
})

export const TooltipPortal: FC<Props> = ({
  message,
  isVisible,
  parentRect,
  isIcon = false,
  isMultiLine = false,
  horizontal,
  vertical,
  fullscreenElement,
}) => {
  const portalRef = useRef<HTMLDivElement>(null)
  const [rect, setRect] = useState({
    top: 0,
    left: 0,
    $width: 0,
    $height: 0,
  })
  const [actualHorizontal, setActualHorizontal] = useState<'left' | 'center' | 'right' | null>(
    horizontal === 'auto' ? null : horizontal,
  )
  const [actualVertical, setActualVertical] = useState<'top' | 'middle' | 'bottom' | null>(
    vertical === 'auto' ? null : vertical,
  )

  const outerMargin = 10
  useEffect(() => {
    if (!portalRef.current || !parentRect) {
      return
    }

    if (vertical === 'auto') {
      let position: 'top' | 'bottom' = 'bottom'
      const requiredHeight = portalRef.current.offsetHeight + outerMargin
      const topSpace = parentRect.top

      if (topSpace <= requiredHeight) {
        const bottomSpace = window.innerHeight - parentRect.bottom

        if (bottomSpace > requiredHeight || bottomSpace > topSpace) {
          position = 'top'
        }
      }

      setActualVertical(position)
    }

    if (horizontal === 'auto') {
      let position: 'left' | 'right' = 'left'
      const requiredWidth = portalRef.current.offsetWidth + outerMargin
      const rightSpace =
        window.innerWidth - (vertical === 'middle' ? parentRect.right : parentRect.left)

      if (rightSpace <= requiredWidth) {
        const leftSpace = vertical === 'middle' ? parentRect.left : parentRect.right

        if (leftSpace > requiredWidth || leftSpace > rightSpace) {
          position = 'right'
        }
      }

      setActualHorizontal(position)
    }
  }, [horizontal, parentRect, vertical])

  useEffect(() => {
    if (!isVisible || !portalRef.current || !actualHorizontal || !actualVertical || !parentRect) {
      return
    }

    const scrollOffset = fullscreenElement
      ? {
          top: fullscreenElement.scrollTop,
          left: fullscreenElement.scrollLeft,
        }
      : {
          top: window.scrollY,
          left: window.scrollX,
        }
    const { offsetWidth, offsetHeight } = portalRef.current

    setRect(
      getTooltipRect({
        parentRect,
        scrollOffset: {
          top: scrollOffsetTop,
          left: scrollOffsetLeft,
        },
        tooltipSize: {
          width: offsetWidth,
          height: offsetHeight,
        },
        vertical: actualVertical,
        horizontal: actualHorizontal,
        isIcon,
        outerMargin,
      }),
    )
  }, [actualHorizontal, actualVertical, fullscreenElement, isIcon, isVisible, parentRect])

  const classNames = useMemo(() => {
    const { container, balloon, balloonText } = classNameGenerator()

    return {
      container: container(),
      balloon: balloon({ isMultiLine }),
      balloonText: balloonText(),
    }
  }, [isMultiLine])
  const containerStyle = useMemo(
    () => ({
      top: rect.top,
      left: rect.left,
      width: rect.$width > 0 ? `${rect.$width}px` : undefined,
      height: rect.$height > 0 ? `${rect.$height}px` : undefined,
      maxWidth: isMultiLine && parentRect ? `${parentRect.width}px` : undefined,
    }),
    [isMultiLine, parentRect, rect.$height, rect.$width, rect.left, rect.top],
  )

  return (
    <div
      ref={portalRef}
      role="tooltip"
      aria-hidden={!isVisible}
      className={classNames.container}
      style={containerStyle}
    >
      <Balloon
        horizontal={actualHorizontal || 'left'}
        vertical={actualVertical || 'bottom'}
        className={classNames.balloon}
      >
        <div className={classNames.balloonText}>{message}</div>
      </Balloon>
    </div>
  )
}
