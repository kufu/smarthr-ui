import React, { forwardRef, useMemo } from 'react'

import { pickerStyle } from './style'
import { PickerProps } from './types'

type Props = {
  /** フォームにエラーがあるかどうか */
  error?: boolean
}

/** @deprecated TimePicker は非推奨です。Input[type="time"] を使ってください。 */
export const TimePicker = forwardRef<HTMLInputElement, PickerProps<Props>>(
  ({ disabled, error, readOnly, className, ...rest }, ref) => {
    const classNames = useMemo(() => {
      const { wrapper, inner } = pickerStyle('Time')

      return {
        wrapper: wrapper({ className, disabled, readOnly }),
        inner: inner(),
      }
    }, [disabled, readOnly, className])

    return (
      <span className={classNames.wrapper}>
        <input
          {...rest}
          data-smarthr-ui-input="true"
          ref={ref}
          type="time"
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={error || undefined}
          className={classNames.inner}
        />
      </span>
    )
  },
)
