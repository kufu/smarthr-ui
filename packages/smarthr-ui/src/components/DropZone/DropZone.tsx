import { ActualDropZone, DropZoneMultiplyAppendable } from './client'

import type { ComponentPropsWithRef, FC } from 'react'

type Props =
  | (ComponentPropsWithRef<typeof ActualDropZone> & { files?: never })
  | (ComponentPropsWithRef<typeof DropZoneMultiplyAppendable> & {
      multiple: {
        /** ファイル複数選択の際に、選択済みのファイルと結合するかどうか */
        appendable: true
      }
    })

export const DropZone: FC<Props> = (props) => {
  if (typeof props.multiple === 'object') {
    const { multiple: _multiple, ...rest } = props

    return <DropZoneMultiplyAppendable {...rest} />
  }

  return <ActualDropZone {...props} />
}
