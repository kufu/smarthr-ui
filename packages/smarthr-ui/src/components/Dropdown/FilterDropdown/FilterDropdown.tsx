'use client'

import {
  type ComponentProps,
  type FC,
  type FormEvent,
  type MouseEventHandler,
  type ReactNode,
  useMemo,
} from 'react'
import innerText from 'react-innertext'
import { tv } from 'tailwind-variants'

import { type DecoratorsType, useDecorators } from '../../../hooks/useDecorators'
import { type ResponseStatus, useResponseStatus } from '../../../hooks/useResponseStatus'
import { useIntl } from '../../../intl'
import { Button, type AbstractProps as ButtonProps } from '../../Button'
import { FaCircleCheckIcon, FaFilterIcon, FaRotateLeftIcon } from '../../Icon'
import { Cluster, Stack } from '../../Layout'
import { ResponseMessage } from '../../ResponseMessage'
import { Dropdown } from '../Dropdown'
import { DropdownCloser } from '../DropdownCloser'
import { DropdownContent } from '../DropdownContent'
import { DropdownTrigger } from '../DropdownTrigger'

type AbstractProps = {
  isFiltered?: boolean
  onApply: MouseEventHandler<HTMLButtonElement>
  onCancel?: MouseEventHandler<HTMLButtonElement>
  onReset?: MouseEventHandler<HTMLButtonElement>
  onOpen?: () => void
  onClose?: () => void
  children: ReactNode
  decorators?: DecoratorsType<DecoratorKeyTypes>
  responseStatus?: ResponseStatus
  /** 引き金となるボタンの大きさ */
  triggerSize?: ButtonProps['size']
  /** 引き金となるボタンをアイコンのみとするかどうか */
  onlyIconTrigger?: boolean
}
type Props = AbstractProps & Omit<ComponentProps<'button'>, keyof AbstractProps>

type DecoratorKeyTypes = 'status' | 'triggerButton' | 'applyButton' | 'cancelButton' | 'resetButton'

const CONTROL_CLUSTER_GAP: ComponentProps<typeof Cluster>['gap'] = { column: 1, row: 0.5 }

const ON_SUBMIT = (e: FormEvent) => {
  e.preventDefault()
}

const classNameGenerator = tv({
  slots: {
    iconWrapper: ['smarthr-ui-Icon-extended', 'shr-relative shr-leading-none'],
    filteredIcon: 'shr-absolute shr-bottom-[2px] shr-right-[-4px] shr-h-[0.5em] shr-w-[0.5em]',
    inner: 'shr-p-1.5',
    actionArea: 'shr-border-t-shorthand shr-sticky shr-bottom-0 shr-bg-white shr-px-1.5 shr-py-1',
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

export const FilterDropdown: FC<Props> = ({
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
}) => {
  const { localize } = useIntl()

  const decoratorDefaultTexts = useMemo(
    () => ({
      status: localize({
        id: 'smarthr-ui/FilterDropdown/status',
        defaultText: '適用中',
      }),
      triggerButton: localize({
        id: 'smarthr-ui/FilterDropdown/triggerButton',
        defaultText: '絞り込み',
      }),
      applyButton: localize({
        id: 'smarthr-ui/FilterDropdown/applyButton',
        defaultText: '適用',
      }),
      cancelButton: localize({
        id: 'smarthr-ui/FilterDropdown/cancelButton',
        defaultText: 'キャンセル',
      }),
      resetButton: localize({
        id: 'smarthr-ui/FilterDropdown/resetButton',
        defaultText: '絞り込み条件を解除',
      }),
    }),
    [localize],
  )

  const decorated = useDecorators<DecoratorKeyTypes>(decoratorDefaultTexts, decorators)
  const filteredIconAriaLabel = useMemo(() => innerText(decorated.status), [decorated.status])
  const calcedResponseStatus = useResponseStatus(responseStatus)

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
        <Button {...props} suffix={buttonSuffix} size={triggerSize}>
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
