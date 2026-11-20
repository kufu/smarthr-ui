import { useEffect } from 'react'

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
let subscriberCount = 0

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

const getSafeAreaInsets = (): SafeAreaInsets => {
  // HINT: resizeを監視していない間(マウント直後のcallback refなど)はキャッシュが古くなりうるため、都度算出する
  if (subscriberCount === 0) {
    return measureSafeAreaInsets()
  }

  if (!cache) {
    cache = measureSafeAreaInsets()
  }

  return cache
}

/**
 * env(safe-area-inset-*) の値をpx単位で取得する関数を返す
 *
 * JSから env() を直接参照する手段はないため、env() をpaddingに指定した要素の算出値を読み取る。
 * 利用側で viewport-fit=cover が指定されていない場合、全て0になる
 *
 * 算出にはDOMの追加とスタイルの再計算が伴うため、算出した値はキャッシュし、全てのコンポーネントで共有する。
 * safe areaは画面の向きの変更やブラウザのツールバーの表示切り替えで変化するが、いずれもresizeイベントが発生するため、
 * その時点でキャッシュを破棄し、次に参照された時点で再計算する。
 * resizeの監視は、このhookを使うコンポーネントがマウントされている間だけ行う
 *
 * 値は位置を計算するタイミングで読み取る必要があるため、値ではなく取得する関数を返す
 */
export const useSafeAreaInsets = () => {
  useEffect(() => {
    if (subscriberCount === 0) {
      window.addEventListener('resize', clearCache, CLEAR_CACHE_LISTENER_OPTIONS)
    }

    subscriberCount++

    return () => {
      subscriberCount--

      if (subscriberCount === 0) {
        window.removeEventListener('resize', clearCache, CLEAR_CACHE_LISTENER_OPTIONS)
        clearCache()
      }
    }
  }, [])

  return getSafeAreaInsets
}
