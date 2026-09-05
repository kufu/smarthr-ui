import { type ButtonHTMLAttributes, forwardRef, useId, useMemo } from 'react'

import { Loader } from '../Loader'

import { DisabledReason } from './DisabledReason'
import { ActualButton, LoadingStatus } from './client'
import { commonClassNameGenerator } from './style'

import type { BaseProps } from './types'

type Props = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      type = 'button',
      size = 'M',
      prefix,
      suffix,
      wide = false,
      variant = 'secondary',
      disabled,
      disabledReason,
      className,
      children,
      loading = false,
      id,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId()
    const buttonId = id || generatedId
    const classNames = useMemo(() => {
      const { button, loader, inner } = commonClassNameGenerator()

      return {
        wrapper: button({ variant, size, wide, className: `smarthr-ui-Button ${className || ''}` }),
        loader: loader({ variant }),
        inner: inner({ size }),
      }
    }, [variant, size, wide, className])

    const button = (
      <ActualButton
        {...rest}
        buttonRef={ref}
        type={type}
        id={buttonId}
        disabled={loading || disabled}
        loader={
          loading ? <Loader role="presentation" size="S" className={classNames.loader} /> : null
        }
        classNames={classNames}
        prefix={prefix}
        suffix={suffix}
      >
        <LoadingStatus buttonId={buttonId} loading={loading} />
        {children}
      </ActualButton>
    )

    if (disabled && disabledReason) {
      return <DisabledReason disabledReason={disabledReason} button={button} />
    }

    return button
  },
)
// BottomFixedArea での判定に用いるために displayName を明示的に設定する
Button.displayName = 'Button'
