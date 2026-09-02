import { type FC, type MouseEvent, type ReactNode, memo } from 'react'

import { Localizer } from '../../intl'
import { Button } from '../Button'
import { FaFileLinesIcon, FaFolderOpenIcon, FaTrashCanIcon } from '../Icon'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { DownloadAnchorButton } from './client'
import { FILE_NAME_BUTTON_CLASSNAME, PREVIEW_BUTTON_CLASSNAME } from './style'

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
