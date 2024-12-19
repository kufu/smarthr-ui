import React, { forwardRef, useMemo } from 'react'

import { pickerStyle } from './style'
import { PickerProps } from './types'

type Props = {
  /** フォームにエラーがあるかどうか */
  error?: boolean
}

/** @deprecated MonthPicker は非推奨です。Input[type="month"] を使ってください。 */
export const MonthPicker = forwardRef<HTMLInputElement, PickerProps<Props>>(
  ({ disabled, error, readOnly, className, ...rest }, ref) => {
    const { wrapperStyle, innerStyle } = useMemo(() => {
      const { wrapper, inner } = pickerStyle('MonthPicker')
      return {
        wrapperStyle: wrapper({ className, disabled, readOnly }),
        innerStyle: inner(),
      }
    }, [disabled, readOnly, className])

    return (
      <span className={wrapperStyle}>
        {/* eslint-disable-next-line smarthr/a11y-input-in-form-control */}
        <input
          {...rest}
          data-smarthr-ui-input="true"
          ref={ref}
          type="month"
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={error || undefined}
          className={innerStyle}
        />
      </span>
    )
  },
)
