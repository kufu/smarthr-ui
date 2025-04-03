import { type FC, type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { tv } from 'tailwind-variants'

import { spacing } from '../../themes'
import { Balloon } from '../Balloon'

type Props = {
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

type ContentBoxStyle = {
  top: string
  left?: string
  right?: string
  maxHeight: string
}
const INITIAL_CONTENT_BOX: ContentBoxStyle = { top: 'auto', maxHeight: '' }

export const TooltipPortal: FC<Props> = ({ message, isVisible, parentRect, isIcon }) => {
  const portalRef = useRef<HTMLDivElement>(null)
  const [contentBox, setContentBox] = useState<ContentBoxStyle>(INITIAL_CONTENT_BOX)
  const [actualHorizontal, setActualHorizontal] = useState<'left' | 'center' | 'right'>('center')
  const [actualVertical, setActualVertical] = useState<'top' | 'middle' | 'bottom'>('bottom')

  useEffect(() => {
    if (!portalRef.current || !parentRect) {
      return
    }

    const box: ContentBoxStyle = { ...INITIAL_CONTENT_BOX }

    if (parentRect.top - portalRef.current.offsetHeight >= 0) {
      // トリガの上側の領域に収まる場合
      box.top = `${scrollY + parentRect.top - portalRef.current.offsetHeight - 5}px`
      setActualVertical('bottom')
    } else if (parentRect.bottom + portalRef.current.offsetHeight <= innerHeight) {
      // トリガの下側の領域に収まる場合
      box.top = `${scrollY + parentRect.bottom + 5}px`
      setActualVertical('top')
    } else {
      const triggerHeight = parentRect.bottom - parentRect.top

      if (parentRect.top + triggerHeight / 2 >= innerHeight / 2) {
        // 上側の領域のほうが広い場合
        box.top = `${scrollY + OUTER_MARGIN - 5}px`
        box.maxHeight = `${parentRect.top - OUTER_MARGIN}px`
        setActualVertical('bottom')
      } else {
        // 下側の領域のほうが広い場合
        box.top = `${scrollY + parentRect.bottom + 5}px`
        box.maxHeight = `${innerHeight - parentRect.bottom - OUTER_MARGIN}px`
        setActualVertical('top')
      }
    }

    const triggerAlignCenter = parentRect.left + parentRect.width / 2
    const portalHalfWidth = portalRef.current.offsetWidth / 2

    // トリガを中心に左右に十分な余白がある場合
    if (
      triggerAlignCenter - portalHalfWidth > 5 &&
      triggerAlignCenter + portalHalfWidth < document.body.clientWidth - 5
    ) {
      box.left = `${triggerAlignCenter - portalHalfWidth}px`
      setActualHorizontal('center')
    } else if (triggerAlignCenter <= document.body.clientWidth / 2) {
      // トリガが画面左寄りの場合
      box.left = `${scrollX + parentRect.left - 5}px`
      setActualHorizontal('left')
    } else {
      // トリガが画面右寄りの場合
      box.right = `${document.body.clientWidth - parentRect.right - scrollX - 5}px`
      setActualHorizontal('right')
    }

    setContentBox(box)
  }, [parentRect])

  const classNames = useMemo(() => {
    const { container, balloon, balloonText } = classNameGenerator()

    return {
      container: container(),
      balloon: balloon(),
      balloonText: balloonText(),
    }
  }, [])
  const style = useMemo(() => {
    const leftMargin = contentBox.left === undefined ? spacing[0.5] : `max(${contentBox.left}, 0px)`
    const rightMargin =
      contentBox.right === undefined ? spacing[0.5] : `max(${contentBox.right}, 0px)`

    return {
      insetBlockStart: contentBox.top,
      insetInlineStart: contentBox.left || undefined,
      insetInlineEnd: contentBox.right || undefined,
      maxWidth: `calc(100% - ${leftMargin} - ${rightMargin})`,
      maxHeight: contentBox.maxHeight || undefined,
    }
  }, [contentBox])

  return (
    <div
      ref={portalRef}
      role="tooltip"
      aria-hidden={!isVisible}
      className={classNames.container}
      style={style}
    >
      <Balloon
        horizontal={actualHorizontal}
        vertical={actualVertical}
        triggerIcon={isIcon}
        className={classNames.balloon}
      >
        <div className={classNames.balloonText}>{message}</div>
      </Balloon>
    </div>
  )
}
