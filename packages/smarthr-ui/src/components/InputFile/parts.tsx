'use client'

import { type FC, type MouseEvent, type ReactNode, memo, useEffect, useState } from 'react'

import { Localizer } from '../../intl'
import { AnchorButton, Button } from '../Button'
import { FaFileArrowDownIcon, FaFileLinesIcon, FaFolderOpenIcon, FaTrashCanIcon } from '../Icon'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

export const StyledFaFolderOpenIcon = memo<{ className: string }>(({ className }) => (
  <span className={className}>
    <FaFolderOpenIcon />
  </span>
))

export const LabelRender = memo<{ id: string; label: ReactNode }>(({ id, label }) => (
  <span id={id} aria-hidden="true">
    {label}
  </span>
))

const FILE_NAME_BUTTON_CLASSNAME =
  'smarthr-ui-InputFile-fileName shr-justify-start shr-min-w-0 shr-break-all shr-whitespace-normal shr-text-left'
const PREVIEW_BUTTON_CLASSNAME = `${FILE_NAME_BUTTON_CLASSNAME} shr-p-0 shr-font-normal shr-text-link`

const PreviewButton: FC<{
  file: File
  handlePreviewClick: (file: File) => void
}> = ({ file, handlePreviewClick }) => (
  <Button
    variant="tertiary"
    className={PREVIEW_BUTTON_CLASSNAME}
    onClick={() => handlePreviewClick(file)}
    prefix={<FaFileLinesIcon className="shr-shrink-0" />}
  >
    <span aria-hidden="true">{file.name}</span>
    <VisuallyHiddenText>
      <Localizer
        id="smarthr-ui/InputFile/previewLabel"
        defaultText="{fileName}のプレビューを開く"
        values={{ fileName: file.name }}
      />
    </VisuallyHiddenText>
  </Button>
)

const DownloadAnchorButton: FC<{ file: File }> = ({ file }) => {
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

type FileListItemProps = {
  file: File
  index: number
  previewable: boolean
  handleDeleteClick: (e: MouseEvent<HTMLButtonElement>) => void
  handlePreviewClick: (file: File) => void
  className: string
}

export const FileListItem = memo<FileListItemProps>(
  ({ file, index, previewable, handleDeleteClick, handlePreviewClick, className }) => (
    <li className={className}>
      {previewable ? (
        file.type.startsWith('image/') || file.type === 'application/pdf' ? (
          <PreviewButton file={file} handlePreviewClick={handlePreviewClick} />
        ) : (
          <DownloadAnchorButton file={file} />
        )
      ) : (
        <span className={FILE_NAME_BUTTON_CLASSNAME}>{file.name}</span>
      )}
      <Button
        value={index}
        variant="text"
        className="smarthr-ui-InputFile-deleteButton shr-shrink-0"
        onClick={handleDeleteClick}
        prefix={<FaTrashCanIcon />}
      >
        <Localizer id="smarthr-ui/InputFile/destroy" defaultText="削除" />
      </Button>
    </li>
  ),
)
