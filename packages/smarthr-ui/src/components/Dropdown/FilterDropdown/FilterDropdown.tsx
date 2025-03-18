'use client'

import React, { type ComponentProps, type FC, type ReactNode, useMemo } from 'react'
import innerText from 'react-innertext'
import { tv } from 'tailwind-variants'

import { type ResponseStatus, useResponseStatus } from '../../../hooks/useResponseStatus'
import { Button, type BaseProps as ButtonProps } from '../../Button'
import { FaCircleCheckIcon, FaFilterIcon, FaRotateLeftIcon } from '../../Icon'
import { Cluster, Stack } from '../../Layout'
import { ResponseMessage } from '../../ResponseMessage'
import { Dropdown } from '../Dropdown'
import { DropdownCloser } from '../DropdownCloser'
import { DropdownContent } from '../DropdownContent'
import { DropdownTrigger } from '../DropdownTrigger'

import type { DecoratorType, DecoratorsType } from '../../../hooks/useDecorators'

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
  responseStatus?: ResponseStatus
  /** 引き金となるボタンの大きさ */
  triggerSize?: ButtonProps['size']
  /** 引き金となるボタンをアイコンのみとするかどうか */
  onlyIconTrigger?: boolean
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
  isFiltered,
  onApply,
  onCancel,
  onReset,
  onOpen,
  onClose,
  children,
  decorators,
  responseStatus,
  triggerSize,
  onlyIconTrigger = false,
  ...props
}: Props) => {
  const texts = useMemo(() => {
    if (!decorators) {
      return {
        status: STATUS_FILTERED_TEXT,
        triggerButton: TRIGGER_BUTTON_TEXT,
        applyButton: APPLY_BUTTON_TEXT,
        cancelButton: CANCEL_BUTTON_TEXT,
        resetButton: RESET_BUTTON_TEXT,
      }
    }

    return {
      status: executeDecorator(STATUS_FILTERED_TEXT, decorators.status),
      triggerButton: executeDecorator(TRIGGER_BUTTON_TEXT, decorators.triggerButton),
      applyButton: executeDecorator(APPLY_BUTTON_TEXT, decorators.applyButton),
      cancelButton: executeDecorator(CANCEL_BUTTON_TEXT, decorators.cancelButton),
      resetButton: executeDecorator(RESET_BUTTON_TEXT, decorators.resetButton),
    }
  }, [decorators])

  const filteredIconAriaLabel = useMemo(() => innerText(texts.status), [texts.status])

  const calcedResponseStatus = useResponseStatus(responseStatus)

  const styles = useMemo(() => {
    const {
      iconWrapper,
      filteredIcon,
      inner,
      actionArea,
      resetButtonArea,
      rightButtonArea,
      message,
    } = filterDropdown()

    const commonStyles = {
      filteredIconStyle: filteredIcon(),
      innerStyle: inner(),
      actionAreaStyle: actionArea(),
      resetButtonAreaStyle: resetButtonArea(),
      rightButtonAreaStyle: rightButtonArea(),
      messageStyle: message(),
    }

    return {
      filtered: {
        ...commonStyles,
        iconWrapperStyle: iconWrapper({ filtered: true, triggerSize }),
      },
      unfiltered: {
        ...commonStyles,
        iconWrapperStyle: iconWrapper({ filtered: false, triggerSize }),
      },
    }
  }, [triggerSize])

  const {
    iconWrapperStyle,
    filteredIconStyle,
    innerStyle,
    actionAreaStyle,
    resetButtonAreaStyle,
    rightButtonAreaStyle,
    messageStyle,
  } = styles[isFiltered ? 'filtered' : 'unfiltered']

  const { buttonSuffix, buttonContent } = useMemo(() => {
    const FilterIcon = (
      <span className={iconWrapperStyle}>
        <FaFilterIcon alt={onlyIconTrigger ? texts.triggerButton : undefined} />

        {isFiltered && (
          <FaCircleCheckIcon aria-label={filteredIconAriaLabel} className={filteredIconStyle} />
        )}
      </span>
    )

    if (onlyIconTrigger) {
      return {
        buttonSuffix: undefined,
        buttonContent: FilterIcon,
      }
    }

    return {
      buttonSuffix: FilterIcon,
      buttonContent: texts.triggerButton,
    }
  }, [
    isFiltered,
    texts.triggerButton,
    onlyIconTrigger,
    filteredIconAriaLabel,
    iconWrapperStyle,
    filteredIconStyle,
  ])

  return (
    <Dropdown onOpen={onOpen} onClose={onClose}>
      <DropdownTrigger tooltip={{ show: onlyIconTrigger, message: texts.triggerButton }}>
        <Button {...props} suffix={buttonSuffix} square={onlyIconTrigger} size={triggerSize}>
          {buttonContent}
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
                    disabled={calcedResponseStatus.isProcessing}
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
                  <Button onClick={onCancel} disabled={calcedResponseStatus.isProcessing}>
                    {texts.cancelButton}
                  </Button>
                </DropdownCloser>
                <DropdownCloser>
                  <Button
                    variant="primary"
                    onClick={onApply}
                    loading={calcedResponseStatus.isProcessing}
                  >
                    {texts.applyButton}
                  </Button>
                </DropdownCloser>
              </Cluster>
            </Cluster>
            {calcedResponseStatus.message && (
              <div className={messageStyle}>
                <ResponseMessage type={calcedResponseStatus.status} role="alert">
                  {calcedResponseStatus.message}
                </ResponseMessage>
              </div>
            )}
          </Stack>
        </form>
      </DropdownContent>
    </Dropdown>
  )
}
