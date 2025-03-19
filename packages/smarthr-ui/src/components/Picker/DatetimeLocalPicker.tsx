import { forwardRef, useMemo } from 'react'

import { classNameGenerator } from './style'

import type { PickerProps } from './types'

type Props = {
  /** フォームにエラーがあるかどうか */
  error?: boolean
}

/** @deprecated DatetimeLocalPicker は非推奨です。Input[type="datetime-local"] を使ってください。 */
export const DatetimeLocalPicker = forwardRef<HTMLInputElement, PickerProps<Props>>(
  ({ disabled, error, readOnly, className, ...rest }, ref) => {
    const classNames = useMemo(() => {
      const { wrapper, inner } = classNameGenerator('DatetimeLocal')

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
          ref={ref}
          type="datetime-local"
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
