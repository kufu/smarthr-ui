'use client'

import { type FC, useLayoutEffect, useState } from 'react'

import { Localizer } from '../../../intl'
import { AnchorButton } from '../../Button'
import { FaFileArrowDownIcon } from '../../Icon'
import { VisuallyHiddenText } from '../../VisuallyHiddenText'

import { PREVIEW_BUTTON_CLASSNAME } from './style'

import type { ExistingFile } from '../types'

export const DownloadAnchorButton: FC<{ file: File | ExistingFile }> = ({ file }) => {
  const [href, setHref] = useState('')

  useLayoutEffect(() => {
    if (!(file instanceof File)) {
      setHref(file.url)
      return
    }

    const url = URL.createObjectURL(file)
    setHref(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [file])

  return (
    <AnchorButton
      href={href}
      download={file.name}
      variant="text"
      className={PREVIEW_BUTTON_CLASSNAME}
      prefix={<FaFileArrowDownIcon className="shr-shrink-0" />}
    >
      <span aria-hidden="true">{file.name}</span>
      <VisuallyHiddenText>
        <Localizer
          id="smarthr-ui/InputFile/downloadLabel"
          defaultText="{fileName}をダウンロード"
          values={{ fileName: file.name }}
        />
      </VisuallyHiddenText>
    </AnchorButton>
  )
}
