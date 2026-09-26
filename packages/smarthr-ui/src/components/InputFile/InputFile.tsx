import { forwardRef } from 'react'

import { useObjectAttributes } from '../../hooks/useObjectAttributes'

import { InputFileMultiplyAppendable, InputFileNative } from './client'

import type { PreviewableObjectType, Props } from './types'

const previewableObjectConverter = (org: boolean) => (org ? { searchable: true } : undefined)

export const InputFile = forwardRef<HTMLInputElement, Props>(
  ({ multiple, previewable: orgPreviewable, ...rest }, ref) => {
    const previewable = useObjectAttributes<
      typeof orgPreviewable,
      PreviewableObjectType | undefined
    >(orgPreviewable, previewableObjectConverter)

    if (typeof multiple === 'object' && multiple.appendable) {
      return <InputFileMultiplyAppendable {...rest} outerRef={ref} previewable={previewable} />
    }

    return (
      <InputFileNative
        {...rest}
        outerRef={ref}
        previewable={previewable}
        multiple={multiple as boolean | undefined}
      />
    )
  },
)
