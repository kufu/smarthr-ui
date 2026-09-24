import { type SafeAreaInsets, getSafeAreaInsets } from '../../../libs/safeAreaInsets'

type Size = { width: number; height: number }

export const INITIAL_CONTENT_STYLES: {
  wrapper: {
    insetBlockStart: string
    insetInlineStart?: string
    insetInlineEnd?: string
    maxWidth: string
  }
  body: {
    maxHeight?: string
  }
} = { wrapper: { insetBlockStart: 'auto', maxWidth: '' }, body: {} }

type ContentStyleType = typeof INITIAL_CONTENT_STYLES

export const generateContentStyle = (
  current: ContentStyleType,
  triggerButton: HTMLButtonElement,
  content: HTMLElement,
  defaultMargin: string,
): ContentStyleType => {
  const safeAreaInsets = getSafeAreaInsets()
  const contentBox = getContentBoxStyle(
    triggerButton.getBoundingClientRect(),
    {
      width: content.offsetWidth,
      height: content.offsetHeight,
    },
    {
      width: document.body.clientWidth,
      height: window.innerHeight,
    },
    {
      top: window.scrollY,
      left: window.scrollX,
    },
    safeAreaInsets,
  )

  // HINT: トリガに揃えていない側は、safe areaの外側に余白を取る
  const leftMargin =
    contentBox.left === undefined
      ? `(${defaultMargin} + ${safeAreaInsets.left}px)`
      : `max(${contentBox.left}, 0px)`
  const rightMargin =
    contentBox.right === undefined
      ? `(${defaultMargin} + ${safeAreaInsets.right}px)`
      : `max(${contentBox.right}, 0px)`

  const nextStyle = {
    wrapper: {
      insetBlockStart: contentBox.top,
      insetInlineStart: contentBox.left || undefined,
      insetInlineEnd: contentBox.right || undefined,
      maxWidth: `calc(100% - ${leftMargin} - ${rightMargin})`,
    },
    body: {
      maxHeight: contentBox.maxHeight || undefined,
    },
  }

  if (
    current.wrapper.insetBlockStart === nextStyle.wrapper.insetBlockStart &&
    current.wrapper.insetInlineStart === nextStyle.wrapper.insetInlineStart &&
    current.wrapper.insetInlineEnd === nextStyle.wrapper.insetInlineEnd &&
    current.wrapper.maxWidth === nextStyle.wrapper.maxWidth &&
    current.body.maxHeight === nextStyle.body.maxHeight
  ) {
    return current
  }

  return nextStyle
}

export function getContentBoxStyle(
  triggerRect: {
    top: number
    right: number
    bottom: number
    left: number
  },
  contentSize: Size,
  windowSize: Size,
  scroll: {
    top: number
    left: number
  },
  safeAreaInsets: SafeAreaInsets,
) {
  const contentBox: {
    top: string
    left?: string
    right?: string
    maxHeight: string
  } = {
    top: 'auto',
    maxHeight: '',
  }

  // HINT: safe areaに重ならない領域を、コンテンツを表示できる範囲とする
  const safeTop = safeAreaInsets.top
  const safeBottom = windowSize.height - safeAreaInsets.bottom
  const safeLeft = safeAreaInsets.left
  const safeRight = windowSize.width - safeAreaInsets.right

  if (triggerRect.bottom + contentSize.height <= safeBottom) {
    // ドロップダウンのサイズがトリガの下側の領域に収まる場合
    contentBox.top = `${scroll.top + triggerRect.bottom - 5}px`
  } else if (triggerRect.top - contentSize.height >= safeTop) {
    // ドロップダウンのサイズがトリガの上川の領域に収まる場合
    contentBox.top = `${scroll.top + triggerRect.top - contentSize.height + 5}px`
  } else {
    const padding = 10
    const triggerHeight = triggerRect.bottom - triggerRect.top

    if (triggerRect.top + triggerHeight / 2 < (safeTop + safeBottom) / 2) {
      // 下側の領域のほうが広い場合
      contentBox.top = `${scroll.top + triggerRect.bottom - 5}px`
      contentBox.maxHeight = `${safeBottom - triggerRect.bottom - padding}px`
    } else {
      // 上側の領域のほうが広い場合
      contentBox.top = `${scroll.top + safeTop + padding + 5}px`
      contentBox.maxHeight = `${triggerRect.top - safeTop - padding}px`
    }
  }

  const triggerAlignCenter = triggerRect.left + (triggerRect.right - triggerRect.left) / 2

  if (triggerAlignCenter <= (safeLeft + safeRight) / 2) {
    // トリガが画面左寄りの場合
    contentBox.left = `${scroll.left + triggerRect.left - 5}px`
  } else {
    // トリガが画面右寄りの場合
    contentBox.right = `${windowSize.width - triggerRect.right - scroll.left - 5}px`
  }

  return contentBox
}
