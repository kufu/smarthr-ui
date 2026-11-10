'use client'

import { type ComponentPropsWithRef, type FC, memo, useLayoutEffect, useState } from 'react'

import { useEnvironment } from '../../../hooks/client/useEnvironment'
import { Localizer } from '../../../intl'
import { AnchorButton, Button } from '../../Button'
import { Dialog, ModelessDialog } from '../../Dialog'
import { FileViewer } from '../../FileViewer'
import { Heading } from '../../Heading'
import { FaXmarkIcon } from '../../Icon'
import { Center, Cluster } from '../../Layout'
import { Loader } from '../../Loader'
import { Section } from '../../SectioningContent'

import type { ExistingFile } from '../types'

type Props = {
  file: File | ExistingFile | null
  handleClose: () => void
  handleDownload: () => void
  searchable?: boolean
  onPassword?: ComponentPropsWithRef<typeof FileViewer>['onPassword']
}

export const FilePreviewDialog: FC<Props> = memo(
  ({ file, handleClose, handleDownload, searchable, onPassword }) => {
    const [blobUrl, setBlobUrl] = useState<string>()
    const isOpen = !!file
    const { mobile } = useEnvironment()

    useLayoutEffect(() => {
      if (!file) {
        setBlobUrl(undefined)
        return
      }

      if (!(file instanceof File)) {
        setBlobUrl(file.url)
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
            contentType: file instanceof File ? file.type : (file.contentType ?? ''),
            alt: file.name,
          }}
          searchable={searchable}
          onPassword={onPassword}
        />
      ) : (
        <Center className="shr-h-full">
          <Loader />
        </Center>
      )
    const actionAreaButtons = (
      <>
        <AnchorButton href={blobUrl} target="_blank">
          <Localizer id="smarthr-ui/InputFile/targetBlank" defaultText="別タブで開く" />
        </AnchorButton>
        <Button onClick={handleDownload}>
          <Localizer id="smarthr-ui/InputFile/download" defaultText="ダウンロード" />
        </Button>
      </>
    )

    if (mobile) {
      return (
        <Dialog
          isOpen={isOpen}
          size="M"
          ariaLabel={file?.name ?? ''}
          onClickOverlay={handleClose}
          onPressEscape={handleClose}
        >
          <Section className="shr-flex shr-h-[calc(100svh-1rem)] shr-flex-col">
            <Cluster
              align="center"
              className="shr-border-b-shorthand shr-shrink-0 shr-px-1 shr-py-0.5"
            >
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
              {actionAreaButtons}
            </Cluster>
          </Section>
        </Dialog>
      )
    }

    return (
      <ModelessDialog
        isOpen={isOpen}
        resizable
        contentPadding={0}
        size="M"
        height="75svh"
        onClickClose={handleClose}
        heading={file?.name ?? ''}
        footer={
          <Cluster gap={1} justify="end" className="shr-px-1.5 shr-py-1">
            {actionAreaButtons}
          </Cluster>
        }
      >
        {fileViewer}
      </ModelessDialog>
    )
  },
)
