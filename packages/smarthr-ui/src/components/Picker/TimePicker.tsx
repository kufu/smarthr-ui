import { forwardRef, useMemo } from 'react'

import { classNameGenerator } from './style'

import type { PickerProps } from './types'

type Props = {
  /** フォームにエラーがあるかどうか */
  error?: boolean
}

/** @deprecated TimePicker は非推奨です。Input[type="time"] を使ってください。 */
export const TimePicker = forwardRef<HTMLInputElement, PickerProps<Props>>(
  ({ error, className, ...rest }, ref) => {
    const classNames = useMemo(() => {
      const { wrapper, inner } = classNameGenerator('Time')

      return {
        wrapper: wrapper({ className }),
        inner: inner(),
      }
    }, [className])

    return (
      <span className={classNames.wrapper}>
        <input
          {...rest}
          ref={ref}
          type="time"
          className={classNames.inner}
          aria-invalid={error || undefined}
          data-smarthr-ui-input="true"
        />
      </span>
    )
  },
)
