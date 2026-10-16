import { type FC, memo, useMemo } from 'react'

import { tv } from '../../../libs/tv'
import { getValueKeys, resolveRichTextValue } from '../serializers/resolveRichTextValue'
import { serializeToReactElement } from '../serializers/serializeToReactElement'
import { staticContentClasses } from '../styles'

import type { RichTextViewerGap, RichTextViewerProps } from '../types'

const classNameGenerator = tv({
  base: [
    'smarthr-ui-RichTextViewer',
    // 行送りは RELAXED(loose: 1.75) を使う。読みやすさ重視の表示専用コンポーネントのため。
    'shr-rte-text-base shr-rte-leading-loose shr-rte-text-black',
    ...staticContentClasses,
    // 直下ブロックのブラウザデフォルト縦マージン（h1-h4, p 等の user-agent margin）を打ち消す。
    // staticContentClasses 側ではトップレベル要素の my を指定していないため、間隔は下の
    // space-y(gap) のみで決まり、先頭要素の上マージン・末尾要素の下マージンは出ない。
    '[&>*]:shr-rte-my-0',
  ],
  variants: {
    gap: {
      0: 'shr-rte-space-y-0',
      0.25: 'shr-rte-space-y-0.25',
      0.5: 'shr-rte-space-y-0.5',
      0.75: 'shr-rte-space-y-0.75',
      1: 'shr-rte-space-y-1',
      1.25: 'shr-rte-space-y-1.25',
      1.5: 'shr-rte-space-y-1.5',
      2: 'shr-rte-space-y-2',
      2.5: 'shr-rte-space-y-2.5',
      3: 'shr-rte-space-y-3',
      3.5: 'shr-rte-space-y-3.5',
      4: 'shr-rte-space-y-4',
      8: 'shr-rte-space-y-8',
    } as { [key in RichTextViewerGap]: string },
  },
})

export const RichTextViewer: FC<RichTextViewerProps> = memo(({ content, className, gap = 1 }) => {
  const [format, contentKey] = getValueKeys(content)
  const element = useMemo(() => {
    try {
      return serializeToReactElement(resolveRichTextValue(content))
    } catch (error) {
      // 1件の破損データで表示ページ全体を落とさないよう、この Viewer だけを空にする
      console.error(error)

      return null
    }
    // content の参照で再計算しないのは、包みを描画のたびに作ると中身が同じでも作り直すため
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [format, contentKey])

  return <div className={classNameGenerator({ gap, className })}>{element}</div>
})
