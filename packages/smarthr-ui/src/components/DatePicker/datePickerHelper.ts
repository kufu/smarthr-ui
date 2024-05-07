import { warekiToDate } from '@smarthr/wareki'
import dayjs from 'dayjs'

export function parseJpnDateString(dateString: string): Date {
  const { isValid, result, formatted } = warekiToDate(dateString)

  return isValid ? result : dayjs(formatted).toDate()
}

export function getPortalPosition(inputRect: DOMRect, contentHeihgt: number) {
  const margin = 4
  const { innerHeight, pageYOffset } = window

  const left = pageXOffset + inputRect.left

  const hasNoSpaceOnBottomSide = inputRect.bottom + contentHeihgt > innerHeight
  const isTopSideSpaceBiggerThanBottomSide = inputRect.top > innerHeight - inputRect.bottom
  if (hasNoSpaceOnBottomSide && isTopSideSpaceBiggerThanBottomSide) {
    // display on top side
    return {
      top: pageYOffset + inputRect.top - contentHeihgt + margin,
      left,
    }
  }
  // display on bottom side
  return {
    top: pageYOffset + inputRect.bottom - margin,
    left,
  }
}
