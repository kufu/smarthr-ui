import { warekiToDate } from '@smarthr/wareki'
import dayjs from 'dayjs'

export function parseJpnDateString(dateString: string): Date {
  const { isValid, result, formatted } = warekiToDate(dateString)

  return isValid ? result : dayjs(formatted).toDate()
}

const PORTAL_POSITION_MARGIN_FOR_BOTTOM = 4
// HINT: 上方向表示はcontentHeightを引いて位置を決めるため、
// Portalとinputの重なりが下方向表示と同じになるよう小さい値にしている
const PORTAL_POSITION_MARGIN_FOR_TOP = 2

export function getPortalPosition(inputRect: DOMRect, contentHeight: number) {
  const { innerHeight, pageYOffset } = window
  const left = pageXOffset + inputRect.left

  if (
    // has no space on bottom side
    inputRect.bottom + contentHeight > innerHeight &&
    // top side space bigger than bottom side
    inputRect.top > innerHeight - inputRect.bottom
  ) {
    // display on top side
    return {
      top: pageYOffset + inputRect.top - contentHeight + PORTAL_POSITION_MARGIN_FOR_TOP,
      left,
    }
  }

  // display on bottom side
  return {
    top: pageYOffset + inputRect.bottom - PORTAL_POSITION_MARGIN_FOR_BOTTOM,
    left,
  }
}
