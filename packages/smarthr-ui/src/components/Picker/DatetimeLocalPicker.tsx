import { type ComponentPropsWithRef, type FC, useMemo } from 'react'

import { classNameGenerator } from './style'

type BaseProps = {
  /** フォームにエラーがあるかどうか */
  error?: boolean
}
type Props = BaseProps & Omit<ComponentPropsWithRef<'input'>, keyof BaseProps | 'type'>

/** @deprecated DatetimeLocalPicker は非推奨です。Input[type="datetime-local"] を使ってください。 */
export const DatetimeLocalPicker: FC<Props> = ({ error, className, ...rest }) => {
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
        type="datetime-local"
        className={classNames.inner}
        aria-invalid={errorAttr}
        data-smarthr-ui-input-error={errorAttr}
        data-smarthr-ui-input="true"
      />
    </span>
  )
}
