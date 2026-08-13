'use client'

import { type FC, memo, useEffect, useState } from 'react'

import { useEnvironment } from '../../hooks/useEnvironment'
import { Localizer } from '../../intl'
import { Button } from '../Button'
import { Dialog, ModelessDialog } from '../Dialog'
import { FileViewer } from '../FileViewer'
import { Heading } from '../Heading'
import { FaXmarkIcon } from '../Icon'
import { Center, Cluster } from '../Layout'
import { Loader } from '../Loader'

type Props = {
  file: File | null
  handleClose: () => void
  handleDownload: () => void
}

export const FilePreviewDialog: FC<Props> = memo(({ file, handleClose, handleDownload }) => {
  const [blobUrl, setBlobUrl] = useState<string>()
  const isOpen = !!file
  const { mobile } = useEnvironment()

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

  const fileViewer =
    isOpen && blobUrl ? (
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
    )

  if (mobile) {
    return (
      <Dialog
        isOpen={isOpen}
        onClickOverlay={handleClose}
        onPressEscape={handleClose}
        size="M"
        ariaLabel={file?.name ?? ''}
      >
        <div className="shr-flex shr-h-full shr-flex-col">
          <Cluster
            align="center"
            className="shr-border-b-shorthand shr-shrink-0 shr-px-1 shr-py-0.5"
          >
            {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
            <Heading className="shr-min-w-0 shr-grow shr-truncate shr-text-base">
              {file?.name}
            </Heading>
            <Button size="S" onClick={handleClose}>
              <FaXmarkIcon
                alt={<Localizer id="smarthr-ui/InputFile/closePreview" defaultText="閉じる" />}
              />
            </Button>
          </Cluster>
          <div className="shr-min-h-0 shr-grow">{fileViewer}</div>
          <Cluster
            justify="end"
            className="shr-border-t-shorthand shr-shrink-0 shr-px-1.5 shr-py-1"
          >
            <Button onClick={handleDownload}>
              <Localizer id="smarthr-ui/InputFile/download" defaultText="ダウンロード" />
            </Button>
          </Cluster>
        </div>
      </Dialog>
    )
  }

  return (
    <ModelessDialog
      isOpen={isOpen}
      onClickClose={handleClose}
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
      {fileViewer}
    </ModelessDialog>
  )
})
