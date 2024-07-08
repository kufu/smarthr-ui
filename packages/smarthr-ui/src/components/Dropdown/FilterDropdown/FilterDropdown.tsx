import React, { ComponentProps, FC, ReactNode, useMemo } from 'react'
import innerText from 'react-innertext'
import { tv } from 'tailwind-variants'

import { Button, BaseProps as ButtonProps } from '../../Button'
import { FaCheckCircleIcon, FaFilterIcon, FaUndoAltIcon } from '../../Icon'
import { Cluster, Stack } from '../../Layout'
import { ResponseMessage } from '../../ResponseMessage'
import { Dropdown } from '../Dropdown'
import { DropdownCloser } from '../DropdownCloser'
import { DropdownContent } from '../DropdownContent'
import { DropdownScrollArea } from '../DropdownScrollArea'
import { DropdownTrigger } from '../DropdownTrigger'

import type { DecoratorType, DecoratorsType, ResponseMessageType } from '../../../types'

type Props = {
  isFiltered?: boolean
  onApply: React.MouseEventHandler<HTMLButtonElement>
  onCancel?: React.MouseEventHandler<HTMLButtonElement>
  onReset?: React.MouseEventHandler<HTMLButtonElement>
  onOpen?: () => void
  onClose?: () => void
  children: ReactNode
  decorators?: DecoratorsType<
    'status' | 'triggerButton' | 'applyButton' | 'cancelButton' | 'resetButton'
  >
  responseMessage?: ResponseMessageType
  /** 引き金となるボタンの大きさ */
  triggerSize?: ButtonProps['size']
}
type ElementProps = Omit<ComponentProps<'button'>, keyof Props>

const STATUS_FILTERED_TEXT = '適用中'
const TRIGGER_BUTTON_TEXT = '絞り込み'
const APPLY_BUTTON_TEXT = '適用'
const CANCEL_BUTTON_TEXT = 'キャンセル'
const RESET_BUTTON_TEXT = '絞り込み条件を解除'

const executeDecorator = (defaultText: string, decorator: DecoratorType | undefined) =>
  decorator?.(defaultText) || defaultText

const filterDropdown = tv({
  slots: {
    iconWrapper: [
      'shr-relative shr-leading-none',
      '[&_>_[role="img"]_+_[role="img"]]:shr-absolute [&_>_[role="img"]_+_[role="img"]]:shr-bottom-[2px] [&_>_[role="img"]_+_[role="img"]]:shr-right-[-4px]',
    ],
    fileteredIcon: 'shr-h-[0.5em] shr-w-[0.5em]',
    statusText: 'shr-ms-0.5 shr-text-sm',
    inner: 'shr-p-1.5',
    actionArea: 'shr-border-t-shorthand shr-px-1.5 shr-py-1',
    resetButtonArea: '-shr-ms-0.5',
    rightButtonArea: 'shr-ms-auto',
    message: 'shr-text-right',
  },
  variants: {
    filtered: {
      true: {
        iconWrapper: 'shr-text-main',
      },
    },
    triggerSize: {
      default: {},
      s: {
        iconWrapper: '-shr-translate-x-0.25',
      },
    },
  },
})

export const FilterDropdown: FC<Props & ElementProps> = ({
  isFiltered = false,
  onApply,
  onCancel,
  onReset,
  onOpen,
  onClose,
  children,
  hasStatusText,
  decorators,
  responseMessage,
  triggerSize,
  ...props
}: Props) => {
  const status: ReactNode = useMemo(
    () => executeDecorator(STATUS_FILTERED_TEXT, decorators?.status),
    [decorators],
  )
  const triggerButton: ReactNode = useMemo(
    () => executeDecorator(TRIGGER_BUTTON_TEXT, decorators?.triggerButton),
    [decorators],
  )
  const applyButton: ReactNode = useMemo(
    () => executeDecorator(APPLY_BUTTON_TEXT, decorators?.applyButton),
    [decorators],
  )
  const cancelButton: ReactNode = useMemo(
    () => executeDecorator(CANCEL_BUTTON_TEXT, decorators?.cancelButton),
    [decorators],
  )
  const resetButton: ReactNode = useMemo(
    () => executeDecorator(RESET_BUTTON_TEXT, decorators?.resetButton),
    [decorators],
  )
  const filteredIconAriaLabel = useMemo(() => innerText(status), [status])
  const isRequestProcessing =
    responseMessage !== undefined && responseMessage.status === 'processing'

  const {
    iconWrapperStyle,
    filteredIconStyle,
    statusTextStyle,
    innerStyle,
    actionAreaStyle,
    resetButtonAreaStyle,
    rightButtonAreaStyle,
    messageStyle,
  } = useMemo(() => {
    const {
      iconWrapper,
      fileteredIcon,
      statusText,
      inner,
      actionArea,
      resetButtonArea,
      rightButtonArea,
      message,
    } = filterDropdown()
    return {
      iconWrapperStyle: iconWrapper({ filtered: isFiltered, triggerSize }),
      filteredIconStyle: fileteredIcon(),
      statusTextStyle: statusText(),
      innerStyle: inner(),
      actionAreaStyle: actionArea(),
      resetButtonAreaStyle: resetButtonArea(),
      rightButtonAreaStyle: rightButtonArea(),
      messageStyle: message(),
    }
  }, [isFiltered, triggerSize])

  return (
    <Dropdown onOpen={onOpen} onClose={onClose}>
      <DropdownTrigger>
        <Button
          {...props}
          suffix={
            <span className={iconWrapperStyle}>
              <FaFilterIcon />
              {isFiltered ? (
                <FaCheckCircleIcon
                  aria-label={filteredIconAriaLabel}
                  className={filteredIconStyle}
                />
              ) : null}
            </span>
          }
          size={triggerSize}
        >
          {triggerButton}
        </Button>
      </DropdownTrigger>
      <DropdownContent controllable>
        <DropdownScrollArea>
          <div className={innerStyle}>{children}</div>
        </DropdownScrollArea>
        <Stack gap={0.5} className={actionAreaStyle}>
          <Cluster gap={1} align="center" justify="space-between">
            {onReset && (
              <div className={resetButtonAreaStyle}>
                <Button
                  variant="text"
                  size="s"
                  prefix={<FaUndoAltIcon />}
                  onClick={onReset}
                  disabled={isRequestProcessing}
                >
                  {resetButton}
                </Button>
              </div>
            )}

            <Cluster
              gap={{ column: 1, row: 0.5 }}
              justify="flex-end"
              className={rightButtonAreaStyle}
            >
              <DropdownCloser>
                <Button onClick={onCancel} disabled={isRequestProcessing}>
                  {cancelButton}
                </Button>
              </DropdownCloser>
              <DropdownCloser>
                <Button variant="primary" onClick={onApply} loading={isRequestProcessing}>
                  {applyButton}
                </Button>
              </DropdownCloser>
            </Cluster>
          </Cluster>
          {(responseMessage?.status === 'success' || responseMessage?.status === 'error') && (
            <div className={messageStyle}>
              <ResponseMessage type={responseMessage.status} role="alert">
                {responseMessage.text}
              </ResponseMessage>
            </div>
          )}
        </Stack>
      </DropdownContent>
    </Dropdown>
  )
}
