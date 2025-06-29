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
import { tv } from 'tailwind-variants'

import { useDecorators } from '../../hooks/useDecorators'
import { useIntl } from '../../intl'
import { Button } from '../Button'
import { FaFolderOpenIcon } from '../Icon'

import type { DecoratorsType } from '../../hooks/useDecorators'

const classNameGenerator = tv({
  slots: {
    wrapper: [
      'smarthr-ui-DropZone',
      'shr-border-shorthand shr-flex shr-flex-col shr-items-center shr-justify-center shr-bg-column shr-p-2.5',
    ],
    input: 'shr-hidden',
    button: '',
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
    disabled: {
      true: {
        wrapper: 'shr-cursor-not-allowed',
      },
    },
    error: {
      true: {
        button: 'shr-border-danger',
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
  disabled?: boolean
  /** フォームにエラーがあるかどうか */
  error?: boolean
  /** コンポーネント内の文言を変更するための関数を設定 */
  decorators?: DecoratorsType<'selectButtonLabel'>
}>

const overrideEventDefault = (e: DragEvent<HTMLElement>) => {
  e.preventDefault()
  e.stopPropagation()
}

export const DropZone = forwardRef<HTMLInputElement, DropZoneProps & ElementProps>(
  ({ children, onSelectFiles, multiple = true, disabled, error, decorators, ...props }, ref) => {
    const fileRef = useRef<HTMLInputElement>(null)
    const [filesDraggedOver, setFilesDraggedOver] = useState(false)
    const classNames = useMemo(() => {
      const { wrapper, input, button } = classNameGenerator({ filesDraggedOver, disabled, error })
      return {
        wrapper: wrapper(),
        input: input(),
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
          decorators={decorators}
        />
        {/* eslint-disable-next-line smarthr/a11y-input-in-form-control */}
        <input
          {...props}
          data-smarthr-ui-input="true"
          ref={fileRef}
          type="file"
          multiple={multiple}
          disabled={disabled}
          aria-invalid={error || undefined}
          onChange={onChange}
          className={classNames.input}
        />
      </div>
    )
  },
)

const SelectButton = memo<
  ComponentPropsWithoutRef<typeof Button> &
    Pick<DropZoneProps, 'decorators'> & { onClick: () => void }
>(({ onClick, decorators, ...rest }) => {
  const { localize } = useIntl()

  const decoratorDefaultTexts = useMemo(
    () => ({
      selectButtonLabel: localize({
        id: 'smarthr-ui/DropZone/selectButtonLabel',
        defaultText: 'ファイルを選択',
      }),
    }),
    [localize],
  )

  const decorated = useDecorators<'selectButtonLabel'>(decoratorDefaultTexts, decorators)

  return (
    <Button {...rest} prefix={<FaFolderOpenIcon />} onClick={onClick}>
      {decorated.selectButtonLabel}
    </Button>
  )
})
