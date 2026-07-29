'use client'

import { type FC, type MouseEvent, type ReactNode, memo, useEffect, useState } from 'react'

import { Localizer } from '../../intl'
import { AnchorButton, Button } from '../Button'
import { FaFileArrowDownIcon, FaFileLinesIcon, FaFolderOpenIcon, FaTrashCanIcon } from '../Icon'

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

const PreviewButton: FC<{
  file: File
  handlePreviewClick: (file: File) => void
}> = ({ file, handlePreviewClick }) => (
  <Button
    variant="tertiary"
    prefix={<FaFileLinesIcon />}
    onClick={() => handlePreviewClick(file)}
    className="smarthr-ui-InputFile-fileButton"
  >
    {file.name}
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
      prefix={<FaFileArrowDownIcon />}
      className="smarthr-ui-InputFile-fileButton"
    >
      {file.name}
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
        <span className="smarthr-ui-InputFile-fileName">{file.name}</span>
      )}
      <Button
        variant="text"
        prefix={<FaTrashCanIcon />}
        value={index}
        onClick={handleDeleteClick}
        className="smarthr-ui-InputFile-deleteButton"
      >
        <Localizer id="smarthr-ui/InputFile/destroy" defaultText="削除" />
      </Button>
    </li>
  ),
)
