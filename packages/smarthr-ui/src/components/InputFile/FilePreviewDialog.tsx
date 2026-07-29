'use client'

import { type FC, memo, useCallback, useEffect, useState } from 'react'

import { useLatest } from '../../hooks/useLatest'
import { Localizer } from '../../intl'
import { Button } from '../Button'
import { ModelessDialog } from '../Dialog'
import { FileViewer } from '../FileViewer'
import { Center, Cluster } from '../Layout'
import { Loader } from '../Loader'

type Props = {
  file: File | null
  onClose: () => void
}

export const FilePreviewDialog: FC<Props> = memo(({ file, onClose }) => {
  const [blobUrl, setBlobUrl] = useState<string>()
  const isOpen = !!file

  const latest = useLatest({ file })

  const handleDownload = useCallback(() => {
    if (!latest.file) return

    const url = URL.createObjectURL(latest.file)
    const a = document.createElement('a')
    a.href = url
    a.download = latest.file.name
    a.click()
    URL.revokeObjectURL(url)
  }, [latest])

  useEffect(() => {
    if (!file) {
      setBlobUrl((current) => {
        if (current) {
          URL.revokeObjectURL(current)
          return undefined
        }

        return current
      })

      return
    }

    const url = URL.createObjectURL(file)
    setBlobUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [file])

  return (
    <ModelessDialog
      isOpen={isOpen}
      onClickClose={onClose}
      heading={file?.name ?? ''}
      height="75svh"
      size="M"
      resizable
      footer={
        <Cluster justify="end" className="shr-px-1.5 shr-py-1">
          <Button onClick={handleDownload}>
            <Localizer id="smarthr-ui/InputFile/download" defaultText="ダウンロード" />
          </Button>
        </Cluster>
      }
    >
      {isOpen && blobUrl ? (
        <FileViewer
          file={{
            url: blobUrl,
            contentType: file.type,
            alt: file.name,
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
