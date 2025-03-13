import React, { forwardRef, useMemo } from 'react'

import { classNameGenerator } from './style'

import type { PickerProps } from './types'

type Props = {
  /** フォームにエラーがあるかどうか */
  error?: boolean
}

/** @deprecated MonthPicker は非推奨です。Input[type="month"] を使ってください。 */
export const MonthPicker = forwardRef<HTMLInputElement, PickerProps<Props>>(
  ({ disabled, error, readOnly, className, ...rest }, ref) => {
    const classNames = useMemo(() => {
      const { wrapper, inner } = classNameGenerator('Month')

      return {
        wrapper: wrapper({ className }),
        inner: inner(),
      }
    }, [className])

    return (
      <span className={classNames.wrapper}>
        {/* eslint-disable-next-line smarthr/a11y-input-in-form-control */}
        <input
          {...rest}
          data-smarthr-ui-input="true"
          ref={ref}
          type="month"
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={error || undefined}
          className={classNames.inner}
        />
      </span>
    )
  },
)
