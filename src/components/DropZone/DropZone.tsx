import React, {
  ChangeEvent,
  DragEvent,
  HTMLAttributes,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { Button } from '../Button'
import { FaFolderOpenIcon } from '../Icon'

import { useClassNames } from './useClassNames'

import type { DecoratorsType } from '../../types'

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
  /** 複数ファイルを選択できるかどうか */
  multiple?: boolean
  children?: React.ReactNode
  name?: string
  /** コンポーネント内の文言を変更するための関数を設定 */
  decorators?: DecoratorsType<'selectButtonLabel'>
}

const SELECT_BUTTON_LABEL = 'ファイルを選択'

const overrideEventDefault = (e: DragEvent<HTMLElement>) => {
  e.preventDefault()
  e.stopPropagation()
}

export const DropZone = forwardRef<HTMLInputElement, DropZoneProps & ElementProps>(
  ({ children, onSelectFiles, accept, multiple = true, name, decorators }, ref) => {
    const theme = useTheme()
    const classNames = useClassNames()
    const fileRef = useRef<HTMLInputElement>(null)
    const [filesDraggedOver, setFilesDraggedOver] = useState(false)

    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      ref,
      () => fileRef.current,
    )

    const selectButtonLabel = useMemo(
      () => decorators?.selectButtonLabel?.(SELECT_BUTTON_LABEL) || SELECT_BUTTON_LABEL,
      [decorators],
    )

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
        <Button prefix={<FaFolderOpenIcon />} onClick={onClickButton}>
          {selectButtonLabel}
        </Button>
        {/* eslint-disable-next-line smarthr/a11y-input-in-form-control */}
        <input
          ref={fileRef}
          name={name}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={onChange}
        />
      </Wrapper>
    )
  },
)

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
