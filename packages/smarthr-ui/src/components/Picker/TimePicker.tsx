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
        wrapper: wrapper({ className }),
        inner: inner(),
      }
    }, [disabled])

    return (
      <span className={classNames.wrapper}>
        <input
          {...rest}
          ref={ref}
          type="time"
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={error || undefined}
          className={classNames.inner}
          data-smarthr-ui-input="true"
        />
      </span>
    )
  },
)
