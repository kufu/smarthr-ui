'use client'

import { type FC, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { normalizeToJSON } from '../serializers/normalizeToJSON'
import { serializeToReactElement } from '../serializers/serializeToReactElement'
import { staticContentClasses } from '../styles'

import type { RichTextJSON, RichTextViewerGap, RichTextViewerProps } from '../types'

const classNameGenerator = tv({
  base: [
    'smarthr-ui-RichTextViewer',
    // 行送りは RELAXED(loose: 1.75) を使う。読みやすさ重視の表示専用コンポーネントのため。
    'shr-text-base shr-leading-loose shr-text-black',
    ...staticContentClasses,
    // 直下ブロックのブラウザデフォルト縦マージン（h1-h4, p 等の user-agent margin）を打ち消す。
    // staticContentClasses 側ではトップレベル要素の my を指定していないため、間隔は下の
    // space-y(gap) のみで決まり、先頭要素の上マージン・末尾要素の下マージンは出ない。
    '[&>*]:shr-my-0',
  ],
  variants: {
    gap: {
      0: 'shr-space-y-0',
      0.25: 'shr-space-y-0.25',
      0.5: 'shr-space-y-0.5',
      0.75: 'shr-space-y-0.75',
      1: 'shr-space-y-1',
      1.25: 'shr-space-y-1.25',
      1.5: 'shr-space-y-1.5',
      2: 'shr-space-y-2',
      2.5: 'shr-space-y-2.5',
      3: 'shr-space-y-3',
      3.5: 'shr-space-y-3.5',
      4: 'shr-space-y-4',
      8: 'shr-space-y-8',
    } as { [key in RichTextViewerGap]: string },
  },
})

const isRichTextJSON = (content: RichTextViewerProps['content']): content is RichTextJSON =>
  'type' in content && content.type === 'doc'

export const RichTextViewer: FC<RichTextViewerProps> = memo(({ content, className, gap = 1 }) => {
  const normalized = useMemo(
    () => (isRichTextJSON(content) ? content : normalizeToJSON(content)),
    [content],
  )

  const element = useMemo(() => serializeToReactElement(normalized), [normalized])

  return <div className={classNameGenerator({ gap, className })}>{element}</div>
})
