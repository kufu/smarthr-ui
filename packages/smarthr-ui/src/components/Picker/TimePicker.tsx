import { type FC, useMemo } from 'react'

import { classNameGenerator } from './style'

import type { SHRComponentPropsWithRef } from '../../types'

type Props = SHRComponentPropsWithRef<
  'input',
  {
    /** フォームにエラーがあるかどうか */
    error?: boolean
  },
  { omit: 'type' | 'children' }
>

/** @deprecated TimePicker は非推奨です。Input[type="time"] を使ってください。 */
export const TimePicker: FC<Props> = ({ error, className, ...rest }) => {
  const classNames = useMemo(() => {
    const { wrapper, inner } = classNameGenerator('Time')

    return {
      wrapper: wrapper({ className }),
      inner: inner(),
    }
  }, [className])

  const errorAttr = error || undefined

  return (
    <span className={classNames.wrapper}>
      <input
        {...rest}
        type="time"
        className={classNames.inner}
        aria-invalid={errorAttr}
        data-smarthr-ui-input-error={errorAttr}
        data-smarthr-ui-input="true"
      />
    </span>
  )
}
