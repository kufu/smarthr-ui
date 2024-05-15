import React, { ComponentProps, ComponentPropsWithoutRef, PropsWithChildren, useMemo } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

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

export const notificationBar = tv({
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

type StyleVariants = VariantProps<typeof notificationBar>
type Props = PropsWithChildren<
  Omit<StyleVariants, 'type'> &
    Required<Pick<StyleVariants, 'type'>> & {
      /** メッセージ */
      message: React.ReactNode
      /** 閉じるボタン押下時に発火させる関数 */
      onClose?: () => void
      /** role 属性 */
      role?: 'alert' | 'status'
    }
>
type ElementProps = Omit<ComponentPropsWithoutRef<'div'>, keyof Props>
type BaseProps = Pick<ComponentProps<typeof Base>, 'layer'>

export const NotificationBar: React.FC<Props & ElementProps & BaseProps> = ({
  type,
  bold = false,
  animate,
  message,
  onClose,
  children,
  role = type.match(/^(info|sync)$/) ? 'status' : 'alert',
  base = 'none',
  layer,
  className,
  ...props
}) => {
  const Icon = useMemo(() => {
    switch (type) {
      case 'info':
        return FaCircleInfoIcon
      case 'success': {
        return FaCircleCheckIcon
      }
      case 'warning': {
        return bold ? FaTriangleExclamationIcon : WarningIcon
      }
      case 'error': {
        return FaCircleExclamationIcon
      }
      case 'sync': {
        return FaRotateIcon
      }
    }
  }, [type, bold])

  const { baseComponent: WrapBase = React.Fragment, baseProps = {} } = useMemo(
    () =>
      base === 'base'
        ? {
            baseComponent: Base,
            baseProps: {
              layer,
              overflow: 'hidden' as ComponentProps<typeof Base>['overflow'],
            },
          }
        : {},
    [base, layer],
  )

  const {
    wrapperStyle,
    innerStyle,
    messageAreaStyle,
    iconStyle,
    actionAreaStyle,
    closeButtonStyle,
  } = useMemo(() => {
    const { wrapper, inner, messageArea, icon, actionArea, closeButton } = notificationBar({
      type,
      bold,
      base,
    })
    return {
      wrapperStyle: wrapper({ animate, className }),
      innerStyle: inner(),
      messageAreaStyle: messageArea(),
      iconStyle: icon(),
      actionAreaStyle: actionArea(),
      closeButtonStyle: closeButton(),
    }
  }, [animate, base, bold, className, type])

  return (
    <WrapBase {...baseProps}>
      <div {...props} className={wrapperStyle} role={role}>
        <Cluster gap={1} align="center" justify="flex-end" className={innerStyle}>
          <div className={messageAreaStyle}>
            <Icon text={message} iconGap={0.5} className={iconStyle} />
          </div>
          {children && (
            <Cluster align="center" justify="flex-end" className={actionAreaStyle}>
              {children}
            </Cluster>
          )}
        </Cluster>
        {onClose && (
          <Button variant="text" size="s" onClick={onClose} className={closeButtonStyle}>
            <FaXmarkIcon alt="閉じる" />
          </Button>
        )}
      </div>
    </WrapBase>
  )
}
