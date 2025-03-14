import React, {
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type FC,
  Fragment,
  type PropsWithChildren,
  type ReactNode,
  memo,
  useMemo,
} from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { Base } from '../Base'
import { Button } from '../Button'
import {
  FaCircleCheckIcon,
  FaCircleExclamationIcon,
  FaCircleInfoIcon,
  FaRotateIcon,
  FaTriangleExclamationIcon,
  FaXmarkIcon,
  WarningIcon,
} from '../Icon'
import { Cluster } from '../Layout'

const classNameGenerator = tv({
  slots: {
    wrapper:
      'smarthr-ui-NotificationBar shr-flex shr-items-baseline shr-justify-between shr-gap-0.5 shr-p-0.75',
    inner: 'shr-flex-grow',
    messageArea: [
      'smarthr-ui-NotificationBar-messageArea',
      'shr-flex shr-grow',
      '[&_.smarthr-ui-Icon-withText]:shr-leading-tight',
    ],
    icon: '',
    actionArea: 'smarthr-ui-NotificationBar-actionArea -shr-my-0.5 shr-shrink-0',
    closeButton:
      'smarthr-ui-NotificationBar-closeButton -shr-mb-0.5 -shr-mr-0.5 -shr-mt-0.5 shr-flex-shrink-0 shr-text-black',
  },
  variants: {
    /** 下地 */
    base: {
      none: {},
      base: {
        wrapper: 'shr-py-1 shr-pe-1 shr-ps-1.5',
      },
    },
    /** メッセージの種類 */
    type: {
      info: {
        icon: 'shr-text-grey',
      },
      success: {},
      warning: {
        icon: 'shr-text-black',
      },
      error: {},
      sync: {
        icon: 'shr-text-main',
      },
    },
    /** 強調するかどうか */
    bold: {
      true: '',
      false: '',
    },
    /** スライドインするかどうか */
    animate: {
      true: {
        wrapper: 'shr-animate-[notification-bar-slide-in_0.2s_ease-out]',
      },
    },
  },
  compoundVariants: [
    {
      type: ['info', 'success', 'warning', 'error', 'sync'],
      bold: false,
      className: {
        wrapper: 'shr-bg-white shr-text-black',
      },
    },
    {
      type: 'success',
      bold: false,
      className: {
        icon: 'shr-text-main',
      },
    },
    {
      type: 'error',
      bold: false,
      className: {
        icon: 'shr-text-danger',
      },
    },
    {
      type: ['info', 'sync'],
      bold: true,
      className: {
        wrapper: 'shr-bg-white',
      },
    },
    {
      type: 'success',
      bold: true,
      className: {
        wrapper: 'shr-bg-main shr-text-white',
        icon: 'shr-text-white',
        closeButton:
          'shr-text-white hover:[&]:shr-bg-main-darken focus-visible:[&]:shr-bg-main-darken',
      },
    },
    {
      type: 'warning',
      bold: true,
      className: {
        wrapper: 'shr-bg-warning-yellow shr-text-black',
        closeButton:
          'shr-text-black hover:[&]:shr-bg-warning-yellow-darken focus-visible:[&]:shr-bg-warning-yellow-darken',
      },
    },
    {
      type: 'error',
      bold: true,
      className: {
        wrapper: 'shr-bg-danger shr-text-white',
        icon: 'shr-text-white',
        closeButton:
          'shr-text-white hover:[&]:shr-bg-danger-darken focus-visible:[&]:shr-bg-danger-darken',
      },
    },
  ],
})

type StyleVariants = VariantProps<typeof classNameGenerator>
type Props = PropsWithChildren<
  Omit<StyleVariants, 'type'> &
    Required<Pick<StyleVariants, 'type'>> & {
      /** メッセージ */
      message: ReactNode
      /** 閉じるボタン押下時に発火させる関数 */
      onClose?: () => void
      /** role 属性 */
      role?: 'alert' | 'status'
    }
>
type ElementProps = Omit<ComponentPropsWithoutRef<'div'>, keyof Props>
type BaseProps = Pick<ComponentProps<typeof Base>, 'layer'>
type ActualProps = Props & ElementProps & BaseProps

const ABSTRACT_ICON_MAPPER = {
  info: FaCircleInfoIcon,
  success: FaCircleCheckIcon,
  error: FaCircleExclamationIcon,
  sync: FaRotateIcon,
}
const ICON_MAPPER = {
  normal: {
    ...ABSTRACT_ICON_MAPPER,
    warning: WarningIcon,
  },
  bold: {
    ...ABSTRACT_ICON_MAPPER,
    warning: FaTriangleExclamationIcon,
  },
} as const

const ROLE_STATUS_TYPE_REGEX = /^(info|sync)$/

export const NotificationBar: FC<ActualProps> = ({
  type,
  bold,
  animate,
  message,
  onClose,
  children,
  role,
  base,
  layer,
  className,
  ...props
}) => {
  const actualRole = useMemo(() => {
    if (role) {
      return role
    }

    return ROLE_STATUS_TYPE_REGEX.test(type) ? 'status' : 'alert'
  }, [role, type])
  const { WrapBase, baseProps } = useMemo(
    () =>
      base === 'base'
        ? {
            WrapBase: Base,
            baseProps: {
              layer,
              overflow: 'hidden' as ComponentProps<typeof Base>['overflow'],
            },
          }
        : {
            WrapBase: Fragment,
            baseProps: {},
          },
    [base, layer],
  )
  const classNames = useMemo(() => {
    const { wrapper, inner, messageArea, icon, actionArea, closeButton } = classNameGenerator({
      type,
      bold: !!bold,
      base: base || 'none',
    })

    return {
      wrapper: wrapper({ animate, className }),
      inner: inner(),
      messageArea: messageArea(),
      icon: icon(),
      actionArea: actionArea(),
      closeButton: closeButton(),
    }
  }, [animate, base, bold, type, className])

  return (
    <WrapBase {...baseProps}>
      <div {...props} className={classNames.wrapper} role={actualRole}>
        <Cluster gap={1} align="center" justify="flex-end" className={classNames.inner}>
          <MessageArea message={message} bold={bold} type={type} classNames={classNames} />
          {children && (
            <Cluster align="center" justify="flex-end" className={classNames.actionArea}>
              {children}
            </Cluster>
          )}
        </Cluster>
        <CloseButton onClose={onClose} className={classNames.closeButton} />
      </div>
    </WrapBase>
  )
}

const MessageArea = memo<
  Pick<ActualProps, 'message' | 'bold' | 'type'> & {
    classNames: { messageArea: string; icon: string }
  }
>(({ message, bold, type, classNames }) => {
  const Icon = ICON_MAPPER[bold ? 'bold' : 'normal'][type]

  return (
    <div className={classNames.messageArea}>
      <Icon text={message} iconGap={0.5} className={classNames.icon} />
    </div>
  )
})

const CloseButton = memo<Pick<ActualProps, 'onClose'> & { className: string }>(
  ({ onClose, className }) =>
    onClose && (
      <Button variant="text" size="s" onClick={onClose} className={className}>
        <FaXmarkIcon alt="閉じる" />
      </Button>
    ),
)
