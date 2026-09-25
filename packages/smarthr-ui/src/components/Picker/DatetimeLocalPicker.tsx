import { forwardRef, useMemo } from 'react'

import { classNameGenerator } from './style'

import type { PickerProps } from './types'

type Props = {
  /** フォームにエラーがあるかどうか */
  error?: boolean
}

/** @deprecated DatetimeLocalPicker は非推奨です。Input[type="datetime-local"] を使ってください。 */
export const DatetimeLocalPicker = forwardRef<HTMLInputElement, PickerProps<Props>>(
  ({ error, className, ...rest }, ref) => {
    const classNames = useMemo(() => {
      const { wrapper, inner } = classNameGenerator('DatetimeLocal')

      return {
        wrapper: wrapper({ className }),
        inner: inner(),
      }
    }, [className])

    const errorAttr = error || undefined

    return (
      <span className={classNames.wrapper}>
        {/* eslint-disable-next-line smarthr/a11y-input-in-form-control */}
        <input
          {...rest}
          ref={ref}
          type="datetime-local"
          className={classNames.inner}
          aria-invalid={errorAttr}
          data-smarthr-ui-input-error={errorAttr}
          data-smarthr-ui-input="true"
        />
      </span>
    )
  },
)
