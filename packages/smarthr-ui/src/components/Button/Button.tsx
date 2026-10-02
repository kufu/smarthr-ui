import { type ComponentPropsWithRef, type FC, useMemo } from 'react'

import { Loader } from '../Loader'

import { DisabledReason } from './DisabledReason'
import { LoadingStatus } from './LoadingStatus'
import { ActualButton } from './client'
import { buttonClassNameGenerator } from './style'

import type { BaseProps } from './types'

type Props = BaseProps & Omit<ComponentPropsWithRef<'button'>, keyof BaseProps>

export const Button: FC<Props> = ({
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
  ...rest
}) => {
  const classNames = useMemo(() => {
    const { wrapper, loader, inner } = buttonClassNameGenerator()

    return {
      wrapper: wrapper({ variant, size, wide, className }),
      loader: loader({ variant }),
      inner: inner({ size }),
    }
  }, [variant, size, wide, className])

  const button = (
    <ActualButton
      {...rest}
      type={type}
      disabled={loading || disabled}
      loader={
        loading ? <Loader role="presentation" size="S" className={classNames.loader} /> : null
      }
      classNames={classNames}
      prefix={prefix}
      suffix={suffix}
    >
      <LoadingStatus loading={loading} />
      {children}
    </ActualButton>
  )

  if (disabled && disabledReason) {
    return <DisabledReason disabledReason={disabledReason} button={button} />
  }

  return button
}
// BottomFixedArea での判定に用いるために displayName を明示的に設定する
Button.displayName = 'Button'
