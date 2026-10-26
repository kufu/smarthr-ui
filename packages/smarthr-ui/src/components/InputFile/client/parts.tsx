import { type FC, type ReactNode, memo } from 'react'

import { Localizer } from '../../../intl'
import { Button } from '../../Button'
import { FaFileLinesIcon, FaFolderOpenIcon, FaTrashCanIcon } from '../../Icon'
import { VisuallyHiddenText } from '../../VisuallyHiddenText'

import { DownloadAnchorButton } from './DownloadAnchorButton'
import { FILE_NAME_BUTTON_CLASSNAME, PREVIEW_BUTTON_CLASSNAME } from './style'

import type { ExistingFile } from '../types'

const isPreviewableFile = (file: File | ExistingFile): boolean => {
  const contentType = file instanceof File ? file.type : file.contentType
  return !!contentType && (contentType.startsWith('image/') || contentType === 'application/pdf')
}

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
  file: File | ExistingFile
  handlePreviewClick: (file: File | ExistingFile) => void
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

export const FileListItem = memo<{
  file: File | ExistingFile
  index: number
  previewable: boolean
  handleDeleteClick: (file: File | ExistingFile, index: number) => void
  handlePreviewClick: (file: File | ExistingFile) => void
  className: string
}>(({ file, index, previewable, handleDeleteClick, handlePreviewClick, className }) => (
  <li className={className}>
    {previewable ? (
      isPreviewableFile(file) ? (
        <PreviewButton file={file} handlePreviewClick={handlePreviewClick} />
      ) : (
        <DownloadAnchorButton file={file} />
      )
    ) : (
      <span className={FILE_NAME_BUTTON_CLASSNAME}>{file.name}</span>
    )}
    <Button
      variant="text"
      className="smarthr-ui-InputFile-deleteButton shr-shrink-0"
      onClick={() => handleDeleteClick(file, index)}
      prefix={<FaTrashCanIcon />}
    >
      <Localizer id="smarthr-ui/InputFile/destroy" defaultText="削除" />
    </Button>
  </li>
))
