import { forwardRef, useMemo } from 'react'

import { classNameGenerator } from './style'

import type { PickerProps } from './types'

type Props = {
  /** フォームにエラーがあるかどうか */
  error?: boolean
}

/** @deprecated MonthPicker は非推奨です。Input[type="month"] を使ってください。 */
export const MonthPicker = forwardRef<HTMLInputElement, PickerProps<Props>>(
  ({ error, className, ...rest }, ref) => {
    const classNames = useMemo(() => {
      const { wrapper, inner } = classNameGenerator('Month')

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
          type="month"
          className={classNames.inner}
          aria-invalid={errorAttr}
          data-smarthr-ui-input-error={errorAttr}
          data-smarthr-ui-input="true"
        />
      </span>
    )
  },
)
