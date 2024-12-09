'use client'

import React, { ComponentProps, FC, ReactNode, useMemo } from 'react'
import innerText from 'react-innertext'
import { tv } from 'tailwind-variants'

import { Button, BaseProps as ButtonProps } from '../../Button'
import { FaCircleCheckIcon, FaFilterIcon, FaRotateLeftIcon } from '../../Icon'
import { Cluster, Stack } from '../../Layout'
import { ResponseMessage } from '../../ResponseMessage'
import { Dropdown } from '../Dropdown'
import { DropdownCloser } from '../DropdownCloser'
import { DropdownContent } from '../DropdownContent'
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

const CONTROL_CLUSTER_GAP: React.ComponentProps<typeof Cluster>['gap'] = { column: 1, row: 0.5 }

const ON_SUBMIT = (e: React.FormEvent) => {
  e.preventDefault()
}

const executeDecorator = (defaultText: string, decorator: DecoratorType | undefined) =>
  decorator?.(defaultText) || defaultText

const filterDropdown = tv({
  slots: {
    iconWrapper: [
      'shr-relative shr-leading-none',
      '[&_>_[role="img"]_+_[role="img"]]:shr-absolute [&_>_[role="img"]_+_[role="img"]]:shr-bottom-[2px] [&_>_[role="img"]_+_[role="img"]]:shr-right-[-4px]',
    ],
    filteredIcon: 'shr-h-[0.5em] shr-w-[0.5em]',
    inner: 'shr-p-1.5',
    actionArea: 'shr-sticky shr-bottom-0 shr-border-t-shorthand shr-bg-white shr-px-1.5 shr-py-1',
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
  decorators,
  responseMessage,
  triggerSize,
  ...props
}: Props) => {
  const texts = useMemo(
    () => ({
      status: executeDecorator(STATUS_FILTERED_TEXT, decorators?.status),
      triggerButton: executeDecorator(TRIGGER_BUTTON_TEXT, decorators?.triggerButton),
      applyButton: executeDecorator(APPLY_BUTTON_TEXT, decorators?.applyButton),
      cancelButton: executeDecorator(CANCEL_BUTTON_TEXT, decorators?.cancelButton),
      resetButton: executeDecorator(RESET_BUTTON_TEXT, decorators?.resetButton),
    }),
    [decorators],
  )

  const filteredIconAriaLabel = useMemo(() => innerText(texts.status), [texts.status])

  const calcedResponseStatus: {
    isRequestProcessing: boolean
    visibleMessageType: 'error' | 'success' | null
    visibleMessage: React.ReactNode
  } = useMemo(() => {
    const status = responseMessage?.status
    const isVisibleMessage = status === 'success' || status === 'error'

    return {
      isRequestProcessing: status === 'processing',
      visibleMessageType: isVisibleMessage ? status : null,
      visibleMessage: isVisibleMessage ? responseMessage?.text : '',
    }
  }, [responseMessage?.status])

  const {
    iconWrapperStyle,
    filteredIconStyle,
    innerStyle,
    actionAreaStyle,
    resetButtonAreaStyle,
    rightButtonAreaStyle,
    messageStyle,
  } = useMemo(() => {
    const {
      iconWrapper,
      filteredIcon,
      inner,
      actionArea,
      resetButtonArea,
      rightButtonArea,
      message,
    } = filterDropdown()
    return {
      iconWrapperStyle: iconWrapper({ filtered: isFiltered, triggerSize }),
      filteredIconStyle: filteredIcon(),
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
                <FaCircleCheckIcon
                  aria-label={filteredIconAriaLabel}
                  className={filteredIconStyle}
                />
              ) : null}
            </span>
          }
          size={triggerSize}
        >
          {texts.triggerButton}
        </Button>
      </DropdownTrigger>
      <DropdownContent controllable>
        <form onSubmit={ON_SUBMIT}>
          <div className={innerStyle}>{children}</div>
          <Stack gap={0.5} className={actionAreaStyle}>
            <Cluster gap={1} align="center" justify="space-between">
              {onReset && (
                <div className={resetButtonAreaStyle}>
                  <Button
                    variant="text"
                    size="s"
                    prefix={<FaRotateLeftIcon />}
                    onClick={onReset}
                    disabled={calcedResponseStatus.isRequestProcessing}
                  >
                    {texts.resetButton}
                  </Button>
                </div>
              )}

              <Cluster
                gap={CONTROL_CLUSTER_GAP}
                justify="flex-end"
                className={rightButtonAreaStyle}
              >
                <DropdownCloser>
                  <Button onClick={onCancel} disabled={calcedResponseStatus.isRequestProcessing}>
                    {texts.cancelButton}
                  </Button>
                </DropdownCloser>
                <DropdownCloser>
                  <Button
                    variant="primary"
                    onClick={onApply}
                    loading={calcedResponseStatus.isRequestProcessing}
                  >
                    {texts.applyButton}
                  </Button>
                </DropdownCloser>
              </Cluster>
            </Cluster>
            {calcedResponseStatus.visibleMessageType && (
              <div className={messageStyle}>
                <ResponseMessage type={calcedResponseStatus.visibleMessageType} role="alert">
                  {calcedResponseStatus.visibleMessage}
                </ResponseMessage>
              </div>
            )}
          </Stack>
        </form>
      </DropdownContent>
    </Dropdown>
  )
}
