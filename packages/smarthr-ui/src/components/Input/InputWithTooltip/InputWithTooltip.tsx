import React, { type ComponentProps, forwardRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Tooltip } from '../../Tooltip'
import { Input } from '../Input'

type Props = ComponentProps<typeof Input> & {
  /** 入力欄に紐付けるツールチップに表示するメッセージ */
  tooltipMessage: React.ReactNode
}

const inputWithTooltip = tv({
  base: 'smarthr-ui-InputWithTooltip [&]:shr-overflow-y-visible',
})

export const InputWithTooltip = forwardRef<HTMLInputElement, Props>(
  ({ tooltipMessage, width, className, ...rest }, ref) => {
    const widthStyle = useMemo(
      () => ({
        width: typeof width === 'number' ? `${width}px` : width,
      }),
      [width],
    )

    const tooltipStyleProps = useMemo(() => inputWithTooltip({ className }), [className])

    return (
      <Tooltip
        message={tooltipMessage}
        tabIndex={-1}
        ariaDescribedbyTarget="inner"
        className={tooltipStyleProps}
        style={widthStyle}
      >
        {/* eslint-disable-next-line smarthr/a11y-input-in-form-control */}
        <Input {...rest} width={widthStyle.width} ref={ref} />
      </Tooltip>
    )
  },
)
