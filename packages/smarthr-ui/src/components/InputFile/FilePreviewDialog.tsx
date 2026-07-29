'use client'

import { type FC, memo, useEffect, useState } from 'react'

import { Localizer } from '../../intl'
import { Button } from '../Button'
import { ModelessDialog } from '../Dialog'
import { FileViewer } from '../FileViewer'
import { FaFileArrowDownIcon } from '../Icon'
import { Center } from '../Layout'
import { Loader } from '../Loader'

import { downloadFile } from './utils'

type Props = {
  file: File | null
  onClose: () => void
}

export const FilePreviewDialog: FC<Props> = memo(({ file, onClose }) => {
  const [blobUrl, setBlobUrl] = useState<string>()
  const isOpen = file !== null

  useEffect(() => {
    if (!file) {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl)
        setBlobUrl(undefined)
      }
      return
    }

    const url = URL.createObjectURL(file)
    setBlobUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [file, blobUrl])

  const handleDownload = () => {
    if (file) {
      downloadFile(file)
    }
  }

  return (
    <ModelessDialog
      isOpen={isOpen}
      onClickClose={onClose}
      heading={file?.name ?? ''}
      footer={
        <Button variant="primary" prefix={<FaFileArrowDownIcon />} onClick={handleDownload}>
          <Localizer id="smarthr-ui/InputFile/download" defaultText="ダウンロード" />
        </Button>
      }
    >
      {blobUrl ? (
        <FileViewer
          file={{
            url: blobUrl,
            contentType: file?.type ?? '',
            alt: file?.name ?? '',
          }}
        />
      ) : (
        <Center className="shr-h-full">
          <Loader size="M" />
        </Center>
      )}
    </ModelessDialog>
  )
})
