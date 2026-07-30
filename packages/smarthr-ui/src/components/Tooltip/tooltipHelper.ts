const BALLOON_ARROW_POSITION = 29 // length between Balloon edge and center of arrow

type Props = {
  parentRect: DOMRect
  scrollOffset: { top: number; left: number }
  tooltipSize: { width: number; height: number }
  vertical: 'top' | 'middle' | 'bottom'
  horizontal: 'left' | 'center' | 'right'
  isIcon?: boolean
  outerMargin: number
}

export function getTooltipRect({
  parentRect,
  scrollOffset,
  tooltipSize,
  vertical,
  horizontal,
  isIcon,
  outerMargin,
}: Props): { top: number; left: number; $width: number; $height: number } {
  let top: number = 0
  let left: number = 0

  switch (vertical) {
    case 'top':
      top = parentRect.top + parentRect.height + outerMargin
      left = calculateLeftWithVerticalTopOrBottom({
        horizontal,
        parentRect,
        tooltipSize,
        isIcon,
      })
      break
    case 'bottom':
      top = parentRect.top - tooltipSize.height - outerMargin
      left = calculateLeftWithVerticalTopOrBottom({
        horizontal,
        parentRect,
        tooltipSize,
        isIcon,
      })
      break
    case 'middle':
      top = parentRect.top + (parentRect.height - tooltipSize.height) / 2

      switch (horizontal) {
        case 'right':
          left = parentRect.left - tooltipSize.width - outerMargin
          break
        default:
          left = parentRect.left + parentRect.width + outerMargin
          break
      }

      break
  }

  return {
    top: top + scrollOffset.top,
    left: left + scrollOffset.left,
    $width: tooltipSize.width,
    $height: tooltipSize.height,
  }
}

const calculateLeftWithVerticalTopOrBottom = ({
  horizontal,
  parentRect,
  tooltipSize,
  isIcon,
}: Pick<Props, 'horizontal' | 'parentRect' | 'tooltipSize' | 'isIcon'>) => {
  if (horizontal === 'center') {
    return parentRect.left + (parentRect.width - tooltipSize.width) / 2
  }

  const iconGap = isIcon ? BALLOON_ARROW_POSITION - parentRect.width / 2 : 0 // to align center of Balloon arrow and icon

  switch (horizontal) {
    case 'right':
      return parentRect.left + parentRect.width - tooltipSize.width + iconGap
    case 'left':
      return parentRect.left - iconGap
  }
}
