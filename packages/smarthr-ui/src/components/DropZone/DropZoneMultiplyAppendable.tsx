'use client'

import {
  type ChangeEvent,
  type ComponentPropsWithRef,
  type ComponentPropsWithoutRef,
  type DragEvent,
  type PropsWithChildren,
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useIntl } from '../../intl'
import { Button } from '../Button'
import { FaFolderOpenIcon } from '../Icon'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { classNameGenerator } from './style'

type AbstractProps = PropsWithChildren<{
  /** 現在のファイルリスト。親が state 管理する（controlled） */
  files: File[]
  /**
   * ファイルが追加された時に発火するコールバック関数。
   * 第2引数は今回選択分ではなく「マージ済み全ファイル（File[]）」
   */
  onSelectFiles: (e: DragEvent<HTMLElement> | ChangeEvent<HTMLInputElement>, files: File[]) => void
  accept?: string
  name?: string
  disabled?: boolean
  error?: boolean
  selectButtonLabel?: string
}>
export type DropZoneMultiplyAppendableProps = AbstractProps &
  Omit<ComponentPropsWithRef<'div'>, keyof AbstractProps>

const overrideEventDefault = (e: DragEvent<HTMLElement>) => {
  e.preventDefault()
  e.stopPropagation()
}

export const DropZoneMultiplyAppendable = forwardRef<
  HTMLInputElement,
  DropZoneMultiplyAppendableProps
>(({ children, files, onSelectFiles, disabled, error, selectButtonLabel, ...rest }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [filesDraggedOver, setFilesDraggedOver] = useState(false)
  const classNames = useMemo(() => {
    const { wrapper, button } = classNameGenerator({ filesDraggedOver, disabled, error })
    return {
      wrapper: wrapper(),
      button: button(),
    }
  }, [disabled, error, filesDraggedOver])
  useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(ref, () => inputRef.current)

  const onDrop = useCallback(
    (e: DragEvent<HTMLElement>) => {
      overrideEventDefault(e)
      setFilesDraggedOver(false)

      if (e.dataTransfer.types.includes('Files')) {
        const newFiles = Array.from(e.dataTransfer.files)
        onSelectFiles(e, [...files, ...newFiles])
      }
    },
    [files, onSelectFiles],
  )

  const onDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    overrideEventDefault(e)
    setFilesDraggedOver(true)
  }, [])

  const onDragLeave = useCallback(() => {
    setFilesDraggedOver(false)
  }, [])

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newFiles = Array.from(e.target.files ?? [])
      onSelectFiles(e, [...files, ...newFiles])
      // 同一ファイルを再選択可能にするためリセット
      e.target.value = ''
    },
    [files, onSelectFiles],
  )

  const onClickButton = useCallback(() => {
    inputRef.current!.click()
  }, [])

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={classNames.wrapper}
    >
      {children}
      <SelectButton
        onClick={onClickButton}
        disabled={disabled}
        className={classNames.button}
        label={selectButtonLabel}
      />
      <VisuallyHiddenText>
        {/* eslint-disable-next-line smarthr/a11y-input-in-form-control */}
        <input
          {...rest}
          data-smarthr-ui-input="true"
          ref={inputRef}
          type="file"
          multiple
          disabled={disabled}
          tabIndex={-1}
          aria-invalid={error || undefined}
          onChange={onChange}
        />
      </VisuallyHiddenText>
    </div>
  )
})

const SelectButton = memo<
  ComponentPropsWithoutRef<typeof Button> & { onClick: () => void; label?: string }
>(({ onClick, label, ...rest }) => {
  const { localize } = useIntl()

  const buttonLabel = useMemo(
    () =>
      label ||
      localize({
        id: 'smarthr-ui/DropZone/selectButtonLabel',
        defaultText: 'ファイルを選択',
      }),
    [label, localize],
  )

  return (
    <Button {...rest} prefix={<FaFolderOpenIcon />} onClick={onClick}>
      {buttonLabel}
    </Button>
  )
})
