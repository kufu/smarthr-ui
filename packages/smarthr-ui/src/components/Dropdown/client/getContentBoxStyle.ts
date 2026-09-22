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
  )

  const leftMargin = contentBox.left === undefined ? defaultMargin : `max(${contentBox.left}, 0px)`
  const rightMargin =
    contentBox.right === undefined ? defaultMargin : `max(${contentBox.right}, 0px)`

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

  if (triggerRect.bottom + contentSize.height <= windowSize.height) {
    // ドロップダウンのサイズがトリガの下側の領域に収まる場合
    contentBox.top = `${scroll.top + triggerRect.bottom - 5}px`
  } else if (triggerRect.top - contentSize.height >= 0) {
    // ドロップダウンのサイズがトリガの上川の領域に収まる場合
    contentBox.top = `${scroll.top + triggerRect.top - contentSize.height + 5}px`
  } else {
    const padding = 10
    const triggerHeight = triggerRect.bottom - triggerRect.top

    if (triggerRect.top + triggerHeight / 2 < windowSize.height / 2) {
      // 下側の領域のほうが広い場合
      contentBox.top = `${scroll.top + triggerRect.bottom - 5}px`
      contentBox.maxHeight = `${windowSize.height - triggerRect.bottom - padding}px`
    } else {
      // 上側の領域のほうが広い場合
      contentBox.top = `${scroll.top + padding + 5}px`
      contentBox.maxHeight = `${triggerRect.top - padding}px`
    }
  }

  const triggerAlignCenter = triggerRect.left + (triggerRect.right - triggerRect.left) / 2

  if (triggerAlignCenter <= windowSize.width / 2) {
    // トリガが画面左寄りの場合
    contentBox.left = `${scroll.left + triggerRect.left - 5}px`
  } else {
    // トリガが画面右寄りの場合
    contentBox.right = `${windowSize.width - triggerRect.right - scroll.left - 5}px`
  }

  return contentBox
}
