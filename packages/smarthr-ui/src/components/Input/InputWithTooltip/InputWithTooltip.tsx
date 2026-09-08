import { type ComponentProps, type ReactNode, forwardRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Tooltip } from '../../Tooltip'
import { Input } from '../Input'

type Props = ComponentProps<typeof Input> & {
  /** 入力欄に紐付けるツールチップに表示するメッセージ */
  tooltipMessage: ReactNode
}

const classNameGenerator = tv({
  base: 'smarthr-ui-InputWithTooltip [&]:shr-overflow-y-visible',
})

export const InputWithTooltip = forwardRef<HTMLInputElement, Props>(
  ({ tooltipMessage, width, className, ...rest }, ref) => {
    const style = {
      width: typeof width === 'number' ? `${width}px` : width,
    }

    const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

    return (
      // eslint-disable-next-line smarthr/a11y-scroller-has-tabindex
      <Tooltip tabIndex={-1} className={actualClassName} style={style} message={tooltipMessage}>
        {/* eslint-disable-next-line smarthr/a11y-input-in-form-control */}
        <Input {...rest} ref={ref} width={style.width} />
      </Tooltip>
    )
  },
)
