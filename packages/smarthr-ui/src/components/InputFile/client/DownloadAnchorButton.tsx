'use client'

import { type FC, useEffect, useState } from 'react'

import { Localizer } from '../../../intl'
import { AnchorButton } from '../../Button'
import { FaFileArrowDownIcon } from '../../Icon'
import { VisuallyHiddenText } from '../../VisuallyHiddenText'
import { PREVIEW_BUTTON_CLASSNAME } from '../style'

export const DownloadAnchorButton: FC<{ file: File }> = ({ file }) => {
  const [href, setHref] = useState('')

  useEffect(() => {
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
