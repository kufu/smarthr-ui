import {
  type ComponentProps,
  type FC,
  type MouseEventHandler,
  type ReactNode,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { useObjectAttributes } from '../../../hooks/useObjectAttributes'
import { type ResponseStatus, useResponseStatus } from '../../../hooks/useResponseStatus'
import { Localizer } from '../../../intl'
import { Button, type BaseProps as ButtonProps } from '../../Button'
import { FaFilterIcon, FaRotateLeftIcon } from '../../Icon'
import { Cluster, Stack } from '../../Layout'
import { ResponseMessage } from '../../ResponseMessage'
import { DropdownCloser } from '../DropdownCloser'
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
  FilterDropdownForm,
  FilteredIcon,
} from '../client'

type ObjectTriggerType = {
  text?: ReactNode
  /** 引き金となるボタンの大きさ */
  size?: ButtonProps['size']
  /** 引き金となるボタンをアイコンのみとするかどうか */
  onlyIcon?: boolean
}
type BaseProps = {
  /** 引き金となるボタン */
  trigger?: ReactNode | ObjectTriggerType
  applyText?: ReactNode
  cancelText?: ReactNode
  resetText?: ReactNode
  children: ReactNode
  filtered?:
    | boolean
    | {
        iconAlt?: string
      }
  responseStatus?: ResponseStatus
  onApply: MouseEventHandler<HTMLButtonElement>
  onCancel?: MouseEventHandler<HTMLButtonElement>
  onReset?: MouseEventHandler<HTMLButtonElement>
  onOpen?: () => void
  onClose?: () => void
}
type Props = BaseProps & Omit<ComponentProps<'button'>, keyof BaseProps>

const triggerObjectConverter = (trigger: ReactNode): ObjectTriggerType => ({ text: trigger })

const CONTROL_CLUSTER_GAP: ComponentProps<typeof Cluster>['gap'] = { column: 1, row: 0.5 }

const classNameGenerator = tv({
  slots: {
    iconWrapper: [
      'smarthr-ui-Icon-extended',
      'shr-relative shr-leading-none',
      'data-[filtered=true]:shr-text-main',
    ],
    filteredIcon: 'shr-absolute shr-bottom-[2px] shr-right-[-4px] shr-h-[0.5em] shr-w-[0.5em]',
    inner: 'shr-p-1.5',
    actionArea: 'shr-border-t-shorthand shr-sticky shr-bottom-0 shr-bg-white shr-px-1.5 shr-py-1',
    resetButtonArea: '-shr-ms-0.5',
    rightButtonArea: 'shr-ms-auto',
    message: 'shr-text-right',
  },
  variants: {
    triggerSize: {
      M: {},
      S: {
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
  const trigger = useObjectAttributes<ReactNode | ObjectTriggerType, ObjectTriggerType>(
    orgTrigger,
    triggerObjectConverter,
  )

  const calcedResponseStatus = useResponseStatus(responseStatus)

  const classNames = useMemo(() => {
    const {
      iconWrapper,
      filteredIcon,
      inner,
      actionArea,
      resetButtonArea,
      rightButtonArea,
      message,
    } = classNameGenerator()

    return {
      iconWrapper: iconWrapper({ triggerSize: trigger.size }),
      filteredIcon: filteredIcon(),
      inner: inner(),
      actionArea: actionArea(),
      resetButtonArea: resetButtonArea(),
      rightButtonArea: rightButtonArea(),
      message: message(),
    }
  }, [trigger.size])

  const triggerText = trigger.text || (
    <Localizer id="smarthr-ui/FilterDropdown/triggerText" defaultText="絞り込み" />
  )

  const FilterIcon = (
    <span className={classNames.iconWrapper} data-filtered={!!filtered}>
      <FaFilterIcon alt={trigger.onlyIcon ? triggerText : undefined} />

      {filtered && (
        <FilteredIcon
          alt={typeof filtered === 'object' ? filtered.iconAlt : undefined}
          className={classNames.filteredIcon}
        />
      )}
    </span>
  )

  const suffix = trigger.onlyIcon ? undefined : FilterIcon
  const content = trigger.onlyIcon ? FilterIcon : triggerText

  return (
    <Dropdown onOpen={onOpen} onClose={onClose}>
      <DropdownTrigger tooltip={{ show: trigger.onlyIcon, message: triggerText }}>
        <Button {...rest} size={trigger.size} suffix={suffix}>
          {content}
        </Button>
      </DropdownTrigger>
      <DropdownContent controllable>
        <FilterDropdownForm>
          <div className={classNames.inner}>{children}</div>
          <Stack gap={0.5} className={classNames.actionArea}>
            <Cluster gap={1} align="center" justify="space-between">
              {onReset && (
                <div className={classNames.resetButtonArea}>
                  <Button
                    disabled={calcedResponseStatus.isProcessing}
                    variant="text"
                    size="S"
                    onClick={onReset}
                    prefix={<FaRotateLeftIcon />}
                  >
                    {resetText || (
                      <Localizer
                        id="smarthr-ui/FilterDropdown/resetText"
                        defaultText="絞り込み条件を解除"
                      />
                    )}
                  </Button>
                </div>
              )}

              <Cluster
                gap={CONTROL_CLUSTER_GAP}
                justify="flex-end"
                className={classNames.rightButtonArea}
              >
                <DropdownCloser>
                  <Button disabled={calcedResponseStatus.isProcessing} onClick={onCancel}>
                    {cancelText || (
                      <Localizer
                        id="smarthr-ui/FilterDropdown/cancelText"
                        defaultText="キャンセル"
                      />
                    )}
                  </Button>
                </DropdownCloser>
                <DropdownCloser>
                  <Button
                    loading={calcedResponseStatus.isProcessing}
                    variant="primary"
                    onClick={onApply}
                  >
                    {applyText || (
                      <Localizer id="smarthr-ui/FilterDropdown/applyText" defaultText="適用" />
                    )}
                  </Button>
                </DropdownCloser>
              </Cluster>
            </Cluster>
            {calcedResponseStatus.message && (
              <div className={classNames.message}>
                <ResponseMessage role="alert" status={calcedResponseStatus.status}>
                  {calcedResponseStatus.message}
                </ResponseMessage>
              </div>
            )}
          </Stack>
        </FilterDropdownForm>
      </DropdownContent>
    </Dropdown>
  )
}
