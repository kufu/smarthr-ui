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
    const style = useMemo(
      () => ({
        width: typeof width === 'number' ? `${width}px` : width,
      }),
      [width],
    )

    const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

    return (
      <Tooltip
        message={tooltipMessage}
        tabIndex={-1}
        ariaDescribedbyTarget="inner"
        className={actualClassName}
        style={style}
      >
        {/* eslint-disable-next-line smarthr/a11y-input-in-form-control */}
        <Input {...rest} ref={ref} width={style.width} />
      </Tooltip>
    )
  },
)
