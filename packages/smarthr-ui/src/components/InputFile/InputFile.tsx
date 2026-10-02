import { useObjectAttributes } from '../../hooks/useObjectAttributes'

import { InputFileMultiplyAppendable, InputFileNative } from './client'

import type { PreviewableObjectType, Props } from './types'
import type { FC } from 'react'

const previewableObjectConverter = (org: boolean) => (org ? { searchable: true } : undefined)

export const InputFile: FC<Props> = ({ multiple, previewable: orgPreviewable, ref, ...rest }) => {
  const previewable = useObjectAttributes<typeof orgPreviewable, PreviewableObjectType | undefined>(
    orgPreviewable,
    previewableObjectConverter,
  )

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
}
