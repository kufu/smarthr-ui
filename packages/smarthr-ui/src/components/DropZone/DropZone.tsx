'use client'

import {
  type ChangeEvent,
  type ComponentPropsWithRef,
  type DragEvent,
  type PropsWithChildren,
  forwardRef,
  memo,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useLatest } from '../../hooks/useLatest'
import { Localizer } from '../../intl'
import { Button } from '../Button'
import { FaFolderOpenIcon } from '../Icon'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

const classNameGenerator = tv({
  slots: {
    wrapper: [
      'smarthr-ui-DropZone',
      'shr-relative',
      'shr-border-shorthand shr-flex shr-flex-col shr-items-center shr-justify-center shr-bg-column shr-p-2.5',
      'has-[.smarthr-ui-DropZone-Button:disabled]:shr-cursor-not-allowed',
      '[&:not([data-files-dragged-over])]:shr-border-dashed',
      'data-[files-dragged-over]:shr-border-main',
    ],
    button: ['smarthr-ui-DropZone-Button', 'data-[error]:shr-border-danger'],
  },
})

type BaseProps = PropsWithChildren<{
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
  disabled?: boolean
  /** フォームにエラーがあるかどうか */
  error?: boolean
  /** ファイル選択ボタンのラベル */
  selectButtonLabel?: string
}>
type Props = BaseProps & Omit<ComponentPropsWithRef<'div'>, keyof BaseProps>

const overrideEventDefault = (e: DragEvent<HTMLElement>) => {
  e.preventDefault()
  e.stopPropagation()
}

export const DropZone = forwardRef<HTMLInputElement, Props>(
  (
    { children, onSelectFiles, multiple = true, disabled, error, selectButtonLabel, ...rest },
    ref,
  ) => {
    const fileRef = useRef<HTMLInputElement>(null)
    const [filesDraggedOver, setFilesDraggedOver] = useState(false)
    // FIXME: className を wrapper に適用するバグ修正時に className を依存配列に追加する

    const classNames = useMemo(() => {
      const { wrapper, button } = classNameGenerator()
      return {
        wrapper: wrapper(),
        button: button(),
      }
    }, [])

    const latest = useLatest({ onSelectFiles })

    const functions = useMemo(
      () => ({
        handleDrop: (e: DragEvent<HTMLElement>) => {
          overrideEventDefault(e)
          setFilesDraggedOver(false)

          if (e.dataTransfer.types.includes('Files')) {
            if (fileRef.current) {
              fileRef.current.files = e.dataTransfer.files
            }
            latest.onSelectFiles(e, e.dataTransfer.files)
          }
        },
        handleDragOver: (e: DragEvent<HTMLElement>) => {
          overrideEventDefault(e)
          setFilesDraggedOver(true)
        },
        handleDragLeave: () => {
          setFilesDraggedOver(false)
        },
        handleChange: (e: ChangeEvent<HTMLInputElement>) => {
          latest.onSelectFiles(e, e.target.files)
        },
        handleClickButton: () => {
          fileRef.current!.click()
        },
      }),
      [latest],
    )

    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      ref,
      () => fileRef.current,
    )

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        onDrop={functions.handleDrop}
        onDragOver={functions.handleDragOver}
        onDragLeave={functions.handleDragLeave}
        className={classNames.wrapper}
        data-files-dragged-over={filesDraggedOver || undefined}
      >
        {children}
        <SelectButton
          label={selectButtonLabel}
          disabled={disabled}
          error={error}
          handleClick={functions.handleClickButton}
          className={classNames.button}
        />
        <VisuallyHiddenText>
          {/* TODO: この input にアクセシブルネームが設定されていない。VisuallyHiddenText で視覚的に隠されているが aria-hidden ではないためアクセシビリティツリーに残る。aria-label 等で適切なラベルを付与する必要がある */}
          {/* eslint-disable-next-line smarthr/a11y-input-in-form-control */}
          <input
            {...rest}
            ref={fileRef}
            type="file"
            multiple={multiple}
            disabled={disabled}
            tabIndex={-1}
            aria-invalid={error || undefined}
            onChange={functions.handleChange}
            data-smarthr-ui-input="true"
          />
        </VisuallyHiddenText>
      </div>
    )
  },
)

const SelectButton = memo<{
  label?: string
  disabled?: boolean
  error?: boolean
  handleClick: () => void
  className: string
}>(({ label, disabled, error, handleClick, className }) => (
  <Button
    prefix={<FaFolderOpenIcon />}
    disabled={disabled}
    data-error={error || undefined}
    onClick={handleClick}
    className={className}
  >
    {label || <Localizer id="smarthr-ui/DropZone/selectButtonLabel" defaultText="ファイルを選択" />}
  </Button>
))
