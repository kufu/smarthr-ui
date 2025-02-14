import React, { forwardRef, useMemo } from 'react'

import { pickerStyle } from './style'
import { PickerProps } from './types'

type Props = {
  /** フォームにエラーがあるかどうか */
  error?: boolean
}

/** @deprecated DatetimeLocalPicker は非推奨です。Input[type="datetime-local"] を使ってください。 */
export const DatetimeLocalPicker = forwardRef<HTMLInputElement, PickerProps<Props>>(
  ({ disabled, error, readOnly, className, ...rest }, ref) => {
    const classNames = useMemo(() => {
      const { wrapper, inner } = pickerStyle('DatetimeLocal')

      return {
        wrapper: wrapper({ className, disabled, readOnly }),
        inner: inner(),
      }
    }, [disabled, readOnly, className])

    return (
      <span className={classNames.wrapper}>
        {/* eslint-disable-next-line smarthr/a11y-input-in-form-control */}
        <input
          {...rest}
          data-smarthr-ui-input="true"
          ref={ref}
          type="datetime-local"
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={error || undefined}
          className={classNames.inner}
        />
      </span>
    )
  },
)
