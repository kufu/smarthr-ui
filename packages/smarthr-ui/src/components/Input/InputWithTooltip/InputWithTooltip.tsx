import { type ComponentProps, type FC, type ReactNode, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Tooltip } from '../../Tooltip'
import { Input } from '../client'

type BaseProps = {
  /** 入力欄に紐付けるツールチップに表示するメッセージ */
  tooltipMessage: ReactNode
}
type Props = BaseProps & Omit<ComponentProps<typeof Input>, keyof BaseProps>

const classNameGenerator = tv({
  base: 'smarthr-ui-InputWithTooltip [&]:shr-overflow-y-visible',
})

export const InputWithTooltip: FC<Props> = ({ tooltipMessage, width, className, ...rest }) => {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
  }

  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return (
    // eslint-disable-next-line smarthr/a11y-scroller-has-tabindex
    <Tooltip tabIndex={-1} className={actualClassName} style={style} message={tooltipMessage}>
      {/* eslint-disable-next-line smarthr/a11y-input-in-form-control */}
      <Input {...rest} width={style.width} />
    </Tooltip>
  )
}
