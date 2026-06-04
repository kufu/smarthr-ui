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
  onSelectFiles: (
    e: DragEvent<HTMLElement> | ChangeEvent<HTMLInputElement>,
    files: FileList | null,
  ) => void
  accept?: string
  multiple?: boolean
  name?: string
  disabled?: boolean
  error?: boolean
  selectButtonLabel?: string
}>
export type DropZoneBaseProps = AbstractProps & Omit<ComponentPropsWithRef<'div'>, keyof AbstractProps>

const overrideEventDefault = (e: DragEvent<HTMLElement>) => {
  e.preventDefault()
  e.stopPropagation()
}

export const DropZoneBase = forwardRef<HTMLInputElement, DropZoneBaseProps>(
  (
    { children, onSelectFiles, multiple = true, disabled, error, selectButtonLabel, ...rest },
    ref,
  ) => {
    const fileRef = useRef<HTMLInputElement>(null)
    const [filesDraggedOver, setFilesDraggedOver] = useState(false)
    const classNames = useMemo(() => {
      const { wrapper, button } = classNameGenerator({ filesDraggedOver, disabled, error })
      return {
        wrapper: wrapper(),
        button: button(),
      }
    }, [disabled, error, filesDraggedOver])
    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      ref,
      () => fileRef.current,
    )

    const onDrop = useCallback(
      (e: DragEvent<HTMLElement>) => {
        overrideEventDefault(e)
        setFilesDraggedOver(false)

        if (e.dataTransfer.types.includes('Files')) {
          if (fileRef.current) {
            fileRef.current.files = e.dataTransfer.files
          }
          onSelectFiles(e, e.dataTransfer.files)
        }
      },
      [onSelectFiles],
    )

    const onDragOver = useCallback(
      (e: DragEvent<HTMLElement>) => {
        overrideEventDefault(e)
        setFilesDraggedOver(true)
      },
      [],
    )

    const onDragLeave = useCallback(() => {
      setFilesDraggedOver(false)
    }, [])

    const onChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        onSelectFiles(e, e.target.files)
      },
      [onSelectFiles],
    )

    const onClickButton = useCallback(() => {
      fileRef.current!.click()
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
            ref={fileRef}
            type="file"
            multiple={multiple}
            disabled={disabled}
            tabIndex={-1}
            aria-invalid={error || undefined}
            onChange={onChange}
          />
        </VisuallyHiddenText>
      </div>
    )
  },
)

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
