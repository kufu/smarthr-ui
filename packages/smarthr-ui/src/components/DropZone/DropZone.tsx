'use client'

import React, {
  ChangeEvent,
  ComponentPropsWithRef,
  DragEvent,
  PropsWithChildren,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { Button } from '../Button'
import { FaFolderOpenIcon } from '../Icon'

import type { DecoratorsType } from '../../types'

const dropZone = tv({
  slots: {
    wrapper: [
      'smarthr-ui-DropZone',
      'shr-border-shorthand shr-flex shr-flex-col shr-items-center shr-justify-center shr-bg-column shr-p-2.5',
    ],
    input: 'shr-hidden',
  },
  variants: {
    filesDraggedOver: {
      true: {
        wrapper: 'shr-border-main',
      },
      false: {
        wrapper: 'shr-border-dashed',
      },
    },
  },
})

type ElementProps = Omit<ComponentPropsWithRef<'div'>, keyof DropZoneProps>

type DropZoneProps = PropsWithChildren<{
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
  name?: string
  /** コンポーネント内の文言を変更するための関数を設定 */
  decorators?: DecoratorsType<'selectButtonLabel'>
}>

const SELECT_BUTTON_LABEL = 'ファイルを選択'

const overrideEventDefault = (e: DragEvent<HTMLElement>) => {
  e.preventDefault()
  e.stopPropagation()
}

export const DropZone = forwardRef<HTMLInputElement, DropZoneProps & ElementProps>(
  ({ children, onSelectFiles, multiple = true, decorators, ...props }, ref) => {
    const fileRef = useRef<HTMLInputElement>(null)
    const [filesDraggedOver, setFilesDraggedOver] = useState(false)
    const { wrapper, input } = useMemo(() => dropZone({ filesDraggedOver }), [filesDraggedOver])
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
        if (fileRef.current) {
          fileRef.current.files = e.dataTransfer.files
        }
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
      <div onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave} className={wrapper()}>
        {children}
        <Button prefix={<FaFolderOpenIcon />} onClick={onClickButton}>
          {selectButtonLabel}
        </Button>
        {/* eslint-disable-next-line smarthr/a11y-input-in-form-control */}
        <input
          {...props}
          data-smarthr-ui-input="true"
          ref={fileRef}
          type="file"
          multiple={multiple}
          onChange={onChange}
          className={input()}
        />
      </div>
    )
  },
)
