'use client'

import { type FC, useLayoutEffect, useState } from 'react'

import { Localizer } from '../../../intl'
import { AnchorButton } from '../../Button'
import { FaFileArrowDownIcon } from '../../Icon'
import { VisuallyHiddenText } from '../../VisuallyHiddenText'

import { PREVIEW_BUTTON_CLASSNAME } from './style'

import type { ExistingFile } from '../types'

type AnchorAttributes = {
  href: string
  target?: '_blank'
}

// HINT: download属性はsame-origin URL・same-origin blob:・data:スキームでのみ機能し、
// それ以外(クロスオリジン)では無視されて通常のナビゲーションが発生する
// (https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#download)
export const canUseDownloadAttribute = (url: string): boolean => {
  try {
    const parsed = new URL(url, window.location.href)
    return parsed.protocol === 'data:' || parsed.origin === window.location.origin
  } catch {
    return false
  }
}

export const DownloadAnchorButton: FC<{ file: File | ExistingFile }> = ({ file }) => {
  const [anchorAttributes, setAnchorAttributes] = useState<AnchorAttributes>({ href: '' })

  useLayoutEffect(() => {
    if (!(file instanceof File)) {
      setAnchorAttributes({
        href: file.url,
        target: canUseDownloadAttribute(file.url) ? undefined : '_blank',
      })
      return
    }

    const url = URL.createObjectURL(file)
    setAnchorAttributes({ href: url })

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [file])

  return (
    <AnchorButton
      href={anchorAttributes.href}
      target={anchorAttributes.target}
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
