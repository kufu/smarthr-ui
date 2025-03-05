'use client'

import React, {
  type ComponentProps,
  type FC,
  type FormEvent,
  type MouseEventHandler,
  type ReactNode,
  useMemo,
} from 'react'
import innerText from 'react-innertext'
import { tv } from 'tailwind-variants'

import { type DecoratorType, type DecoratorsType } from '../../../hooks/useDecorators'
import { type ResponseMessageType, useResponseMessage } from '../../../hooks/useResponseMessage'
import { Button, BaseProps as ButtonProps } from '../../Button'
import { FaCircleCheckIcon, FaFilterIcon, FaRotateLeftIcon } from '../../Icon'
import { Cluster, Stack } from '../../Layout'
import { ResponseMessage } from '../../ResponseMessage'
import { Dropdown } from '../Dropdown'
import { DropdownCloser } from '../DropdownCloser'
import { DropdownContent } from '../DropdownContent'
import { DropdownTrigger } from '../DropdownTrigger'

type Props = {
  isFiltered?: boolean
  onApply: MouseEventHandler<HTMLButtonElement>
  onCancel?: MouseEventHandler<HTMLButtonElement>
  onReset?: MouseEventHandler<HTMLButtonElement>
  onOpen?: () => void
  onClose?: () => void
  children: ReactNode
  decorators?: DecoratorsType<DecoratorKeyTypes>
  responseMessage?: ResponseMessageType
  /** 引き金となるボタンの大きさ */
  triggerSize?: ButtonProps['size']
  /** 引き金となるボタンをアイコンのみとするかどうか */
  onlyIconTrigger?: boolean
}
type ElementProps = Omit<ComponentProps<'button'>, keyof Props>

const DECORATOR_DEFAULT_TEXTS = {
  status: '適用中',
  triggerButton: '絞り込み',
  applyButton: '適用',
  cancelButton: 'キャンセル',
  resetButton: '絞り込み条件を解除',
} as const
type DecoratorKeyTypes = keyof typeof DECORATOR_DEFAULT_TEXTS

const CONTROL_CLUSTER_GAP: ComponentProps<typeof Cluster>['gap'] = { column: 1, row: 0.5 }

const ON_SUBMIT = (e: FormEvent) => {
  e.preventDefault()
}

const classNameGenerator = tv({
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
  responseMessage,
  triggerSize,
  onlyIconTrigger = false,
  ...props
}: Props) => {
  const decorated = useDecorators<DecoratorKeyTypes>(DECORATOR_DEFAULT_TEXTS, decorators)
  const filteredIconAriaLabel = useMemo(() => innerText(decorated.status), [decorated.status])
  const calcedResponseStatus = useResponseMessage(responseMessage)
  const classNamesMapper = useMemo(() => {
    const {
      iconWrapper,
      filteredIcon,
      inner,
      actionArea,
      resetButtonArea,
      rightButtonArea,
      message,
    } = classNameGenerator()

    const commonStyles = {
      filteredIcon: filteredIcon(),
      inner: inner(),
      actionArea: actionArea(),
      resetButtonArea: resetButtonArea(),
      rightButtonArea: rightButtonArea(),
      message: message(),
    }

    return {
      filtered: {
        ...commonStyles,
        iconWrapper: iconWrapper({ filtered: true, triggerSize }),
      },
      unfiltered: {
        ...commonStyles,
        iconWrapper: iconWrapper({ filtered: false, triggerSize }),
      },
    }
  }, [triggerSize])

  const classNames = classNamesMapper[isFiltered ? 'filtered' : 'unfiltered']

  const { buttonSuffix, buttonContent } = useMemo(() => {
    const FilterIcon = (
      <span className={classNames.iconWrapper}>
        <FaFilterIcon alt={onlyIconTrigger ? decorated.triggerButton : undefined} />

        {isFiltered && (
          <FaCircleCheckIcon
            aria-label={filteredIconAriaLabel}
            className={classNames.filteredIcon}
          />
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
      buttonContent: decorated.triggerButton,
    }
  }, [isFiltered, decorated.triggerButton, onlyIconTrigger, filteredIconAriaLabel, classNames])

  return (
    <Dropdown onOpen={onOpen} onClose={onClose}>
      <DropdownTrigger tooltip={{ show: onlyIconTrigger, message: decorated.triggerButton }}>
        <Button {...props} suffix={buttonSuffix} square={onlyIconTrigger} size={triggerSize}>
          {buttonContent}
        </Button>
      </DropdownTrigger>
      <DropdownContent controllable>
        <form onSubmit={ON_SUBMIT}>
          <div className={classNames.inner}>{children}</div>
          <Stack gap={0.5} className={classNames.actionArea}>
            <Cluster gap={1} align="center" justify="space-between">
              {onReset && (
                <div className={classNames.resetButtonArea}>
                  <Button
                    variant="text"
                    size="s"
                    prefix={<FaRotateLeftIcon />}
                    onClick={onReset}
                    disabled={calcedResponseStatus.isProcessing}
                  >
                    {decorated.resetButton}
                  </Button>
                </div>
              )}

              <Cluster
                gap={CONTROL_CLUSTER_GAP}
                justify="flex-end"
                className={classNames.rightButtonArea}
              >
                <DropdownCloser>
                  <Button onClick={onCancel} disabled={calcedResponseStatus.isProcessing}>
                    {decorated.cancelButton}
                  </Button>
                </DropdownCloser>
                <DropdownCloser>
                  <Button
                    variant="primary"
                    onClick={onApply}
                    loading={calcedResponseStatus.isProcessing}
                  >
                    {decorated.applyButton}
                  </Button>
                </DropdownCloser>
              </Cluster>
            </Cluster>
            {calcedResponseStatus.message && (
              <div className={classNames.message}>
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
