'use client'

import { forwardRef, memo, useCallback, useMemo } from 'react'

import { RichTextEditor } from '../RichTextEditor/RichTextEditor'
import { normalizeToJSON } from '../serializers/normalizeToJSON'

import type {
  FlexibleRichTextEditorProps,
  RichTextChangeMeta,
  RichTextEditorController,
  RichTextJSON,
} from '../types'

export const FlexibleRichTextEditor = memo(
  forwardRef<RichTextEditorController, FlexibleRichTextEditorProps>(
    ({ content, value, defaultValue, outputFormat = 'json', onChange, ...rest }, ref) => {
      const normalizedDefaultValue = useMemo(() => {
        if (defaultValue) return defaultValue
        if (content) return normalizeToJSON(content)
        return undefined
      }, [defaultValue, content])

      const handleChange = useCallback(
        (nextJson: RichTextJSON, meta: RichTextChangeMeta) => {
          if (!onChange) return
          if (outputFormat === 'html') {
            onChange(meta.html, meta)
            return
          }
          onChange(nextJson, meta)
        },
        [onChange, outputFormat],
      )

      return (
        <RichTextEditor
          {...rest}
          ref={ref}
          value={value}
          defaultValue={normalizedDefaultValue}
          onChange={handleChange}
        />
      )
    },
  ),
)
