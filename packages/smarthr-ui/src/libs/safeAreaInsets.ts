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

// HINT: 各コンポーネントのresizeイベントのハンドラより先にキャッシュを破棄するため、captureで登録する
const CLEAR_CACHE_LISTENER_OPTIONS = { capture: true, passive: true }

let cache: SafeAreaInsets | null = null

const clearCache = () => {
  cache = null
}

const measureSafeAreaInsets = (): SafeAreaInsets => {
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

/**
 * env(safe-area-inset-*) の値をpx単位で取得する
 *
 * JSから env() を直接参照する手段はないため、env() をpaddingに指定した要素の算出値を読み取る。
 * 利用側で viewport-fit=cover が指定されていない場合、全て0になる
 *
 * 算出にはDOMの追加とスタイルの再計算が伴うため、算出した値はキャッシュし、全てのコンポーネントで共有する。
 * safe areaは画面の向きの変更やブラウザのツールバーの表示切り替えで変化するが、いずれもresizeイベントが発生するため、
 * その時点でキャッシュを破棄し、次に参照された時点で再計算する
 */
export const getSafeAreaInsets = (): SafeAreaInsets => {
  if (!cache) {
    cache = measureSafeAreaInsets()
    // HINT: 同じリスナーの重複登録は無視されるため、キャッシュを作るたびに呼んでも登録は1つのままになる
    window.addEventListener('resize', clearCache, CLEAR_CACHE_LISTENER_OPTIONS)
  }

  return cache
}
