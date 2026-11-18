import type { MediaAlign } from './mediaAlign'

type FroalaAlignClasses = {
  block: string
  inline: string
  left: string
  right: string
}

const IMAGE_CLASSES: FroalaAlignClasses = {
  block: 'fr-dib',
  inline: 'fr-dii',
  left: 'fr-fil',
  right: 'fr-fir',
}

const VIDEO_CLASSES: FroalaAlignClasses = {
  block: 'fr-dvb',
  inline: 'fr-dvi',
  left: 'fr-fvl',
  right: 'fr-fvr',
}

const hasDisplayClass = (element: HTMLElement, classes: FroalaAlignClasses) =>
  element.classList.contains(classes.block) || element.classList.contains(classes.inline)

// 左寄せを null で返すのは、Froala のブロック表示や float は段落の text-align で動かないため
const parseFroalaAlign = (
  element: HTMLElement,
  classes: FroalaAlignClasses,
): MediaAlign | null | undefined => {
  if (!hasDisplayClass(element, classes)) return undefined

  const { classList } = element

  // 中央の class（fr-fvc）を判定に使わないのは、Froala が寄せ方を付け替えても外さないため
  if (classList.contains(classes.left)) return null
  if (classList.contains(classes.right)) return 'right'

  // 両方あるときにインラインとするのは、froala_style.css で後に定義された fr-dii・fr-dvi の display が勝つため
  return classList.contains(classes.inline) ? undefined : 'center'
}

/**
 * img ではなくキャプションを返すのは、Froala 自身が寄せ方をキャプションの span から読むため。
 * closest で探さないのは、キャプションの文（span.fr-inner）の中の画像まで拾うため
 */
export const findFroalaImageCaption = (image: HTMLElement): HTMLElement | null => {
  const parent = image.parentElement
  const wrap = parent?.tagName === 'A' ? parent.parentElement : parent
  const caption = wrap?.matches('span.fr-img-wrap') ? wrap.parentElement : null

  return caption?.matches('span.fr-img-caption') && hasDisplayClass(caption, IMAGE_CLASSES)
    ? caption
    : null
}

export const parseFroalaImageAlign = (element: HTMLElement) =>
  parseFroalaAlign(element, IMAGE_CLASSES)

export const parseFroalaYoutubeAlign = (iframe: HTMLElement) => {
  const wrapper = iframe.parentElement

  return wrapper?.classList.contains('fr-video')
    ? parseFroalaAlign(wrapper, VIDEO_CLASSES)
    : undefined
}
