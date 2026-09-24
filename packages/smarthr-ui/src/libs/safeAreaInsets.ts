export type SafeAreaInsets = {
  top: number
  right: number
  bottom: number
  left: number
}

const PROBE_STYLE = [
  'position:fixed',
  'visibility:hidden',
  'pointer-events:none',
  'padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
].join(';')

/**
 * env(safe-area-inset-*) の値をpx単位で取得する
 *
 * JSから env() を直接参照する手段はないため、env() をpaddingに指定した要素の算出値を読み取る。
 * 利用側で viewport-fit=cover が指定されていない場合、全て0になる
 */
export const getSafeAreaInsets = (): SafeAreaInsets => {
  const probe = document.createElement('div')

  probe.style.cssText = PROBE_STYLE
  document.body.appendChild(probe)

  const { paddingTop, paddingRight, paddingBottom, paddingLeft } = getComputedStyle(probe)

  probe.remove()

  return {
    top: parseFloat(paddingTop) || 0,
    right: parseFloat(paddingRight) || 0,
    bottom: parseFloat(paddingBottom) || 0,
    left: parseFloat(paddingLeft) || 0,
  }
}
