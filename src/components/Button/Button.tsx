import React, { ButtonHTMLAttributes, forwardRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { FaInfoCircleIcon } from '../Icon'
import { Cluster } from '../Layout'
import { Loader } from '../Loader'
import { Tooltip } from '../Tooltip'

import { ButtonInner } from './ButtonInner'
import { ButtonWrapper } from './ButtonWrapper'
import { BaseProps } from './types'

type ElementProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>

const buttonStyle = tv({
  slots: {
    wrapper: 'smarthr-ui-Button',
    loader: 'shr-align-bottom [&&&_.s]:shr-h-em [&&&_.s]:shr-w-em',
    disabledWrapper: 'smarthr-ui-Button-disabledWrapper',
    disabledTooltip: [
      '[&&&]:shr-overflow-y-unset',
      /* Tooltip との距離を変えずに反応範囲を広げるために negative space を使う */
      '[&_.smarthr-ui-Icon]:-shr-m-0.25',
      /* global styleなどでborder-boxが適用されている場合表示崩れを起こす為、content-boxを指定する */
      '[&_.smarthr-ui-Icon]:shr-box-content',
      '[&_.smarthr-ui-Icon]:shr-p-0.25',
      '[&_.smarthr-ui-Icon]:shr-text-grey',
    ],
  },
  variants: {
    isSecondary: {
      true: {
        loader: '[&&&_.light]:shr-border-disabled',
      },
      false: {
        loader: '[&&&_.light]:shr-border-white/50',
      },
    },
  },
})

export const Button = forwardRef<HTMLButtonElement, BaseProps & ElementProps>(
  (
    {
      type = 'button',
      size = 'default',
      square = false,
      prefix,
      suffix,
      wide = false,
      variant = 'secondary',
      disabled,
      disabledDetail,
      className,
      children,
      loading = false,
      ...props
    },
    ref,
  ) => {
    const { wrapper, loader: loaderSlot, disabledWrapper, disabledTooltip } = buttonStyle()
    const wrapperStyle = useMemo(() => wrapper({ className }), [className, wrapper])
    const loaderStyle = useMemo(
      () => loaderSlot({ isSecondary: variant === 'secondary' }),
      [loaderSlot, variant],
    )

    const loader = <Loader size="s" type="light" className={loaderStyle} />
    const actualPrefix = !loading && prefix
    const actualSuffix = loading && !square ? loader : suffix
    const disabledOnLoading = loading || disabled
    const actualChildren = loading && square ? loader : children

    const button = (
      <ButtonWrapper
        {...props}
        type={type}
        size={size}
        square={square}
        wide={wide}
        variant={variant}
        className={wrapperStyle}
        buttonRef={ref}
        disabled={disabledOnLoading}
        $loading={loading}
      >
        <ButtonInner prefix={actualPrefix} suffix={actualSuffix}>
          {actualChildren}
        </ButtonInner>
      </ButtonWrapper>
    )

    if (disabled && disabledDetail) {
      const DisabledDetailIcon = disabledDetail.icon || FaInfoCircleIcon

      return (
        <Cluster inline align="center" gap={0.25} className={disabledWrapper()}>
          {button}
          <Tooltip
            message={disabledDetail.message}
            triggerType="icon"
            horizontal="auto"
            vertical="auto"
            className={disabledTooltip()}
          >
            <DisabledDetailIcon />
          </Tooltip>
        </Cluster>
      )
    }

    return button
  },
)
// BottomFixedArea での判定に用いるために displayName を明示的に設定する
Button.displayName = 'Button'
