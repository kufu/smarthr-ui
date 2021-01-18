import React, { ChangeEvent, DragEvent, useCallback, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { SecondaryButton } from '../Button'
import { FaFolderOpenIcon } from '../Icon'

type DropZoneProps = {
  onSelectFiles: (
    e: DragEvent<HTMLElement> | ChangeEvent<HTMLInputElement>,
    files: FileList | null,
  ) => void
  accept?: string
}

const overrideEventDefault = (e: DragEvent<HTMLElement>) => {
  e.preventDefault()
  e.stopPropagation()
}

export const DropZone: React.FC<DropZoneProps> = ({ children, onSelectFiles, accept }) => {
  const theme = useTheme()
  const fileRef = useRef<HTMLInputElement>(null)
  const [filesDraggedOver, setFilesDraggedOver] = useState(false)

  const onDrop = useCallback(
    (e: DragEvent<HTMLElement>) => {
      overrideEventDefault(e)
      setFilesDraggedOver(false)
      onSelectFiles(e, e.dataTransfer.files)
    },
    [setFilesDraggedOver, onSelectFiles],
  )

  const onDragOver = useCallback(
    (e: DragEvent<HTMLElement>) => {
      overrideEventDefault(e)
      setFilesDraggedOver(true)
    },
    [setFilesDraggedOver],
  )

  const onDragLeave = useCallback(() => {
    setFilesDraggedOver(false)
  }, [setFilesDraggedOver])

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onSelectFiles(e, e.target.files)
    },
    [onSelectFiles],
  )

  const onClickButton = () => {
    fileRef.current!.click()
  }

  return (
    <Wrapper
      theme={theme}
      filesDraggedOver={filesDraggedOver}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      {children}
      <SecondaryButton prefix={<FaFolderOpenIcon size={14} />} onClick={onClickButton}>
        ファイルを選択
      </SecondaryButton>
      <input ref={fileRef} type="file" multiple accept={accept} onChange={onChange} />
    </Wrapper>
  )
}

const Wrapper = styled.div<{ theme: Theme; filesDraggedOver: boolean }>`
  ${({ theme, filesDraggedOver }) => {
    const { palette, frame, size } = theme
    const border = filesDraggedOver
      ? `solid ${frame.border.lineWidth} ${palette.MAIN}`
      : `dashed ${frame.border.lineWidth} ${palette.BORDER}`
    return css`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: ${size.pxToRem(size.space.L)};
      border: ${border};
      background-color: ${palette.COLUMN};
      > input {
        display: none;
      }
    `
  }}
`
