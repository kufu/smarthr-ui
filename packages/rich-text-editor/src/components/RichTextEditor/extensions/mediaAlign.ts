import { isSafeMediaAlign } from '../serializers/safeAttributes'

export type MediaAlign = 'center' | 'right'

type AlignStyles = Record<MediaAlign, Record<string, string>>

export const IMAGE_ALIGN_STYLES: AlignStyles = {
  center: { display: 'block', marginLeft: 'auto', marginRight: 'auto' },
  right: { display: 'block', marginLeft: 'auto' },
}

// エディタの選択枠線が div に付くため、iframe ではなく div ごと寄せる
export const YOUTUBE_ALIGN_STYLES: AlignStyles = {
  center: { width: 'fit-content', marginLeft: 'auto', marginRight: 'auto' },
  right: { width: 'fit-content', marginLeft: 'auto' },
}

const toKebabCase = (property: string) => property.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)

export const getMediaAlignStyles = (
  styles: AlignStyles,
  align: unknown,
): Record<string, string> | undefined => (isSafeMediaAlign(align) ? styles[align] : undefined)

export const toMediaAlignStyleText = (styles: AlignStyles, align: unknown): string | undefined => {
  const alignStyles = getMediaAlignStyles(styles, align)

  if (!alignStyles) return undefined

  return Object.entries(alignStyles)
    .map(([property, value]) => `${toKebabCase(property)}: ${value}`)
    .join('; ')
}

export const parseMediaAlign = (element: HTMLElement | null): MediaAlign | null => {
  if (!element) return null

  const { marginLeft, marginRight } = element.style

  if (marginLeft === 'auto' && marginRight === 'auto') return 'center'
  if (marginLeft === 'auto') return 'right'

  return null
}

// インライン表示の画像には margin auto が効かず、貼り付け元では左に表示されている
export const parseImageAlign = (element: HTMLElement): MediaAlign | null =>
  element.style.display === 'block' ? parseMediaAlign(element) : null

// img や iframe ではなく、リサイズ用の枠に当てる。中身に当てると枠の内側で寄って、ハンドルと選択枠線だけが残る
export const applyMediaAlign = (container: HTMLElement, styles: AlignStyles, align: unknown) => {
  const alignStyles = getMediaAlignStyles(styles, align) ?? {}

  container.style.marginLeft = alignStyles.marginLeft ?? ''
  container.style.marginRight = alignStyles.marginRight ?? ''
}
