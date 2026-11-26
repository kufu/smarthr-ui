// ブラウザは video に src 属性があれば、空でも source を使わない。source は src が空なら次の source を使う
export const readVideoSrc = (video: Element): string | null =>
  video.hasAttribute('src')
    ? video.getAttribute('src')
    : (Array.from(video.children)
        .find((child) => child.tagName === 'SOURCE' && child.getAttribute('src'))
        ?.getAttribute('src') ?? null)
