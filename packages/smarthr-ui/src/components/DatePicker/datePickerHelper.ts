import { warekiToDate } from '@smarthr/wareki'
import dayjs from 'dayjs'

export function parseJpnDateString(dateString: string): Date {
  const { isValid, result, formatted } = warekiToDate(dateString)

  return isValid ? result : dayjs(formatted).toDate()
}

const PORTAL_POSITION_MARGIN = 4

export function getPortalPosition(inputRect: DOMRect, contentHeihgt: number) {
  const { innerHeight, pageYOffset } = window
  const left = pageXOffset + inputRect.left

  if (
    // has no space on bottom side
    inputRect.bottom + contentHeihgt > innerHeight &&
    // top side space bigger than bottom side
    inputRect.top > innerHeight - inputRect.bottom
  ) {
    // display on top side
    return {
      top: pageYOffset + inputRect.top - contentHeihgt + PORTAL_POSITION_MARGIN,
      left,
    }
  }

  // display on bottom side
  return {
    top: pageYOffset + inputRect.bottom - PORTAL_POSITION_MARGIN,
    left,
  }
}
