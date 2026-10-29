import { type FC, useMemo } from 'react'

import { classNameGenerator } from './style'

import type { ExtendElementPropsWithRef } from '../../types'

type Props = ExtendElementPropsWithRef<
  'input',
  {
    /** フォームにエラーがあるかどうか */
    error?: boolean
  },
  { omit: 'type' | 'children' }
>

/** @deprecated MonthPicker は非推奨です。Input[type="month"] を使ってください。 */
export const MonthPicker: FC<Props> = ({ error, className, ...rest }) => {
  const classNames = useMemo(() => {
    // eslint-disable-next-line smarthr/best-practice-for-tailwind-variants
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
        type="month"
        className={classNames.inner}
        aria-invalid={errorAttr}
        data-smarthr-ui-input-error={errorAttr}
        data-smarthr-ui-input="true"
      />
    </span>
  )
}
