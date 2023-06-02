export function getTooltipRect({
  parentRect,
  scrollOffset,
  tooltipSize,
  vertical,
  horizontal,
  isIcon = false,
  outerMargin,
}: {
  parentRect: DOMRect
  scrollOffset: { top: number; left: number }
  tooltipSize: { width: number; height: number }
  vertical: 'top' | 'middle' | 'bottom'
  horizontal: 'left' | 'center' | 'right'
  isIcon: boolean
  outerMargin: number
}): { top: number; left: number; $width: number; $height: number } {
  const top = getTop({
    parentRect,
    tooltipHeight: tooltipSize.height,
    vertical,
    outerMargin,
  })
  const left = getLeft({
    parentRect,
    tooltipWidth: tooltipSize.width,
    horizontal,
    vertical,
    isIcon,
    outerMargin,
  })

  return {
    top: top + scrollOffset.top,
    left: left + scrollOffset.left,
    $width: tooltipSize.width,
    $height: tooltipSize.height,
  }
}

function getTop({
  parentRect,
  tooltipHeight,
  vertical,
  outerMargin,
}: {
  parentRect: DOMRect
  tooltipHeight: number
  vertical: 'top' | 'middle' | 'bottom'
  outerMargin: number
}): number {
  switch (vertical) {
    case 'top':
      return parentRect.top + parentRect.height + outerMargin
    case 'middle':
      return parentRect.top + (parentRect.height - tooltipHeight) / 2
    case 'bottom':
      return parentRect.top - tooltipHeight - outerMargin
  }
}

function getLeft({
  parentRect,
  tooltipWidth,
  horizontal,
  vertical,
  isIcon,
  outerMargin,
}: {
  parentRect: DOMRect
  tooltipWidth: number
  horizontal: 'left' | 'center' | 'right'
  vertical: 'top' | 'middle' | 'bottom'
  isIcon: boolean
  outerMargin: number
}): number {
  switch (vertical) {
    case 'middle':
      switch (horizontal) {
        case 'right':
          return parentRect.left - tooltipWidth - outerMargin
        default:
          return parentRect.left + parentRect.width + outerMargin
      }
    case 'top':
    case 'bottom': {
      const arrowPosition = 29 // length between Balloon edge and center of arrow
      const iconGap = isIcon ? arrowPosition - parentRect.width / 2 : 0 // to align center of Balloon arrow and icon
      switch (horizontal) {
        case 'right':
          return parentRect.left + parentRect.width - tooltipWidth + iconGap
        case 'center':
          return parentRect.left + (parentRect.width - tooltipWidth) / 2
        case 'left':
          return parentRect.left - iconGap
      }
    }
  }
}
