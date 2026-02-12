'use client'

import {
  type ComponentProps,
  type FC,
  type FormEvent,
  type MouseEventHandler,
  type ReactNode,
  isValidElement,
  useMemo,
} from 'react'
import innerText from 'react-innertext'
import { tv } from 'tailwind-variants'

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

type ObjectTriggerType = {
  text?: ReactNode
  /** 引き金となるボタンの大きさ */
  size?: ButtonProps['size']
  /** 引き金となるボタンをアイコンのみとするかどうか */
  onlyIcon?: boolean
}
type AbstractProps = {
  /** 引き金となるボタン */
  trigger?: ReactNode | ObjectTriggerType
  applyText?: ReactNode
  cancelText?: ReactNode
  resetText?: ReactNode
  children: ReactNode
  filtered?:
    | boolean
    | {
        iconAlt?: ReactNode
      }
  responseStatus?: ResponseStatus
  onApply: MouseEventHandler<HTMLButtonElement>
  onCancel?: MouseEventHandler<HTMLButtonElement>
  onReset?: MouseEventHandler<HTMLButtonElement>
  onOpen?: () => void
  onClose?: () => void
}
type Props = AbstractProps & Omit<ComponentProps<'button'>, keyof AbstractProps>

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
  trigger: orgTrigger,
  applyText,
  cancelText,
  resetText,
  children,
  filtered,
  responseStatus,
  onApply,
  onCancel,
  onReset,
  onOpen,
  onClose,
  ...rest
}) => {
  // HINT: ReactNodeとObjectのどちらかを判定
  // typeofはnullの場合もobject判定されてしまうため念の為falsyで判定
  // ReactNodeの一部であるReactElementもobjectとして判定されてしまうためisValidElementで判定
  const trigger: ObjectTriggerType =
    !orgTrigger || typeof orgTrigger !== 'object' || isValidElement(orgTrigger)
      ? {
          text: orgTrigger as ReactNode,
        }
      : (orgTrigger as ObjectTriggerType)
  const { localize } = useIntl()

  const decorated = useMemo(
    () => ({
      filteredIconAlt:
        (typeof filtered === 'object' && filtered.iconAlt) ||
        localize({
          id: 'smarthr-ui/FilterDropdown/status',
          defaultText: '適用中',
        }),
      trigger:
        trigger.text ||
        localize({
          id: 'smarthr-ui/FilterDropdown/triggerText',
          defaultText: '絞り込み',
        }),
      applyText:
        applyText ||
        localize({
          id: 'smarthr-ui/FilterDropdown/applyText',
          defaultText: '適用',
        }),
      cancelText:
        cancelText ||
        localize({
          id: 'smarthr-ui/FilterDropdown/cancelText',
          defaultText: 'キャンセル',
        }),
      resetText:
        resetText ||
        localize({
          id: 'smarthr-ui/FilterDropdown/resetText',
          defaultText: '絞り込み条件を解除',
        }),
    }),
    [filtered, trigger.text, applyText, cancelText, resetText, localize],
  )

  const filteredIconAlt = useMemo(
    () => innerText(decorated.filteredIconAlt),
    [decorated.filteredIconAlt],
  )
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
        iconWrapper: iconWrapper({ filtered: true, triggerSize: trigger.size }),
      },
      unfiltered: {
        ...commonStyles,
        iconWrapper: iconWrapper({ filtered: false, triggerSize: trigger.size }),
      },
    }
  }, [trigger.size])

  const classNames = classNamesMapper[filtered ? 'filtered' : 'unfiltered']

  const { buttonSuffix, buttonContent } = useMemo(() => {
    const FilterIcon = (
      <span className={classNames.iconWrapper}>
        <FaFilterIcon alt={trigger.onlyIcon ? decorated.trigger : undefined} />

        {filtered && (
          // HINT: altに揃えたいが、styleが複雑になってしまうためaria-labelを利用している
          <FaCircleCheckIcon aria-label={filteredIconAlt} className={classNames.filteredIcon} />
        )}
      </span>
    )

    if (trigger.onlyIcon) {
      return {
        buttonSuffix: undefined,
        buttonContent: FilterIcon,
      }
    }

    return {
      buttonSuffix: FilterIcon,
      buttonContent: decorated.trigger,
    }
  }, [filtered, decorated.trigger, trigger.onlyIcon, filteredIconAlt, classNames])

  return (
    <Dropdown onOpen={onOpen} onClose={onClose}>
      <DropdownTrigger tooltip={{ show: trigger.onlyIcon, message: decorated.trigger }}>
        <Button {...rest} suffix={buttonSuffix} size={trigger.size}>
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
                    {decorated.resetText}
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
                    {decorated.cancelText}
                  </Button>
                </DropdownCloser>
                <DropdownCloser>
                  <Button
                    variant="primary"
                    onClick={onApply}
                    loading={calcedResponseStatus.isProcessing}
                  >
                    {decorated.applyText}
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
