import React, { ButtonHTMLAttributes, forwardRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { usePortal } from '../../hooks/usePortal'
import { DecoratorsType } from '../../types'
import { FaInfoCircleIcon } from '../Icon'
import { Cluster } from '../Layout'
import { Loader } from '../Loader'
import { Tooltip } from '../Tooltip'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { ButtonInner } from './ButtonInner'
import { ButtonWrapper } from './ButtonWrapper'
import { BaseProps } from './types'

type ElementProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>

const buttonStyle = tv({
  slots: {
    wrapper: 'smarthr-ui-Button',
    loader:
      'shr-align-bottom [&&&_.smarthr-ui-Loader-spinner]:shr-h-em [&&&_.smarthr-ui-Loader-spinner]:shr-w-em',
    disabledWrapper: 'smarthr-ui-Button-disabledWrapper',
    disabledTooltip: [
      '[&&&]:shr-overflow-y-visible',
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
        loader: '[&&&_.smarthr-ui-Loader-line]:shr-border-disabled',
      },
      false: {
        loader: '[&&&_.smarthr-ui-Loader-line]:shr-border-white/50',
      },
    },
  },
})

export type Props = {
  decorators?: DecoratorsType<'loading'>
}

const LOADING_TEXT = '処理中'

export const Button = forwardRef<HTMLButtonElement, BaseProps & ElementProps & Props>(
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
      decorators,
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
    const { createPortal } = usePortal()

    const loader = <Loader size="s" className={loaderStyle} role="presentation" />
    const actualPrefix = !loading && prefix
    const actualSuffix = loading && !square ? loader : suffix
    const disabledOnLoading = loading || disabled
    const actualChildren = loading && square ? loader : children

    const statusText = useMemo(() => {
      const loadingText = decorators?.loading?.(LOADING_TEXT) ?? LOADING_TEXT
      return loading ? loadingText : ''
    }, [decorators, loading])

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
        {
          // `button` 要素内で live region を使うことはできないので、`role="status"` を持つ要素を外側に配置している。 https://github.com/kufu/smarthr-ui/pull/4558
          createPortal(<VisuallyHiddenText role="status">{statusText}</VisuallyHiddenText>)
        }
        <ButtonInner prefix={actualPrefix} suffix={actualSuffix} size={size}>
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
