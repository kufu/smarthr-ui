'use client'

import { type FC, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { normalizeToJSON } from '../serializers/normalizeToJSON'
import { serializeToReactElement } from '../serializers/serializeToReactElement'
import { staticContentClasses } from '../styles'

import type { RichTextContentProps, RichTextJSON } from '../types'

const classNameGenerator = tv({
  base: [
    'smarthr-ui-RichTextContent',
    'shr-text-base shr-leading-normal shr-text-black',
    ...staticContentClasses,
  ],
})

const isRichTextJSON = (content: RichTextContentProps['content']): content is RichTextJSON =>
  'type' in content && content.type === 'doc'

export const RichTextContent: FC<RichTextContentProps> = memo(({ content, className }) => {
  const normalized = useMemo(
    () => (isRichTextJSON(content) ? content : normalizeToJSON(content)),
    [content],
  )

  const element = useMemo(() => serializeToReactElement(normalized), [normalized])

  return <div className={classNameGenerator({ className })}>{element}</div>
})
