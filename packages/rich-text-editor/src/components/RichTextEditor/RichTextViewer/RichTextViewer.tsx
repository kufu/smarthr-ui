import { type FC, memo, useMemo } from 'react'

import { tv } from '../../../libs/tv'
import { getValueKeys, resolveRichTextValue } from '../serializers/resolveRichTextValue'
import { serializeToReactElement } from '../serializers/serializeToReactElement'
import { staticBlockSpacingClasses, staticContentClasses } from '../styles'

import type { RichTextViewerGap, RichTextViewerProps } from '../types'

const classNameGenerator = tv({
  base: [
    'smarthr-ui-RichTextViewer',
    // 行送りは RELAXED(loose: 1.75) を使う。読みやすさ重視の表示専用コンポーネントのため。
    'shr-rte-text-base shr-rte-leading-loose shr-rte-text-black',
    // 空白と折り返しを既定のままにしないのは、エディタが ProseMirror の CSS で行頭や連続した空白をそのまま表示し、長い単語を折り返すため
    'shr-rte-whitespace-break-spaces shr-rte-break-words',
    // block のままにしないのは、入れ子の要素の余白がマージンの相殺で外にはみ出すため
    'shr-rte-flow-root',
    ...staticContentClasses,
  ],
  variants: {
    uniformGap: {
      true: '[&>*]:shr-rte-my-0',
      false: staticBlockSpacingClasses,
    },
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

export const RichTextViewer: FC<RichTextViewerProps> = memo(({ content, className, gap }) => {
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
  const actualClassName = useMemo(
    () => classNameGenerator({ uniformGap: gap !== undefined, gap, className }),
    [gap, className],
  )

  return <div className={actualClassName}>{element}</div>
})
