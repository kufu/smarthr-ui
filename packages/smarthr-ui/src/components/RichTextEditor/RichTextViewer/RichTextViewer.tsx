'use client'

import { type FC, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { normalizeToJSON } from '../serializers/normalizeToJSON'
import { serializeToReactElement } from '../serializers/serializeToReactElement'
import { staticContentClasses } from '../styles'

import type { RichTextJSON, RichTextViewerProps } from '../types'

const classNameGenerator = tv({
  base: [
    'smarthr-ui-RichTextViewer',
    // 行送りは RELAXED(loose: 1.75) を使う。読みやすさ重視の表示専用コンポーネントのため。
    'shr-text-base shr-leading-loose shr-text-black',
    ...staticContentClasses,
  ],
})

const isRichTextJSON = (content: RichTextViewerProps['content']): content is RichTextJSON =>
  'type' in content && content.type === 'doc'

export const RichTextViewer: FC<RichTextViewerProps> = memo(({ content, className }) => {
  const normalized = useMemo(
    () => (isRichTextJSON(content) ? content : normalizeToJSON(content)),
    [content],
  )

  const element = useMemo(() => serializeToReactElement(normalized), [normalized])

  return <div className={classNameGenerator({ className })}>{element}</div>
})
