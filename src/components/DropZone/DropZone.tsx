import React, { ChangeEvent, DragEvent, HTMLAttributes, useCallback, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { SecondaryButton } from '../Button'
import { FaFolderOpenIcon } from '../Icon'
import { useClassNames } from './useClassNames'

type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof DropZoneProps>

type DropZoneProps = {
  /**
   * ボタンまたはドラッグ&ドロップでファイルが追加された時に発火するコールバック関数
   */
  onSelectFiles: (
    e: DragEvent<HTMLElement> | ChangeEvent<HTMLInputElement>,
    files: FileList | null,
  ) => void
  /**
   * 許可するファイル型を表す1つ以上の固有ファイル型指定子
   * <b>（ドラッグ&ドロップの挙動には影響しません）</b>
   */
  accept?: string
  children?: React.ReactNode
}

const overrideEventDefault = (e: DragEvent<HTMLElement>) => {
  e.preventDefault()
  e.stopPropagation()
}

export const DropZone: React.VFC<DropZoneProps & ElementProps> = ({
  children,
  onSelectFiles,
  accept,
}) => {
  const theme = useTheme()
  const classNames = useClassNames()
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
      className={classNames.wrapper}
    >
      {children}
      <SecondaryButton prefix={<FaFolderOpenIcon />} onClick={onClickButton}>
        ファイルを選択
      </SecondaryButton>
      <input ref={fileRef} type="file" multiple accept={accept} onChange={onChange} />
    </Wrapper>
  )
}

const Wrapper = styled.div<{ theme: Theme; filesDraggedOver: boolean }>`
  ${({ theme, filesDraggedOver }) => {
    const { palette, frame, spacingByChar } = theme
    const border = filesDraggedOver
      ? `solid ${frame.border.lineWidth} ${palette.MAIN}`
      : `dashed ${frame.border.lineWidth} ${palette.BORDER}`
    return css`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: ${spacingByChar(2.5)};
      border: ${border};
      background-color: ${palette.COLUMN};
      > input {
        display: none;
      }
    `
  }}
`
