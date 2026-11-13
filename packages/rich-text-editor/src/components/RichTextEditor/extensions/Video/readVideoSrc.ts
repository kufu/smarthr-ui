// src 属性があるとブラウザは source を使わない
export const readVideoSrc = (video: Element): string | null =>
  video.hasAttribute('src')
    ? video.getAttribute('src')
    : (Array.from(video.children)
        .find((child) => child.tagName === 'SOURCE' && child.hasAttribute('src'))
        ?.getAttribute('src') ?? null)
