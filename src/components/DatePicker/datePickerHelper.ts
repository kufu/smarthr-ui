import dayjs from 'dayjs'
import { warekiToDate } from '@smarthr/wareki'

const fullWidthToHalfWidth = (dateString: string) =>
  dateString.replace(/[ａ-ｚＡ-Ｚ０-９．]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))

export function parseJpnDateString(dateString: string): Date {
  const { isValid, result } = warekiToDate(dateString)

  if (isValid) {
    return result
  }

  // TODO: warekiToDateには全角文字列渡しても問題無い
  // warekiToDateが数字を半角に直した値をreturnするようになったら
  // fullWidthToHalfWidth(dateString) をその値と差し替える
  return dayjs(fullWidthToHalfWidth(dateString)).toDate()
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
