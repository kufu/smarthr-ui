import React, { ComponentProps, forwardRef, useMemo } from 'react'
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
  ({ tooltipMessage, width, ...props }, ref) => {
    const widthStyle = typeof width === 'number' ? `${width}px` : width
    const tooltipStyleProps = useMemo(() => {
      const tooltip = inputWithTooltip()
      return {
        className: tooltip,
        style: {
          width: widthStyle,
        },
      }
    }, [widthStyle])

    return (
      <Tooltip
        {...tooltipStyleProps}
        message={tooltipMessage}
        tabIndex={-1}
        ariaDescribedbyTarget="inner"
      >
        {/* eslint-disable-next-line smarthr/a11y-input-in-form-control */}
        <Input {...props} width={widthStyle} ref={ref} />
      </Tooltip>
    )
  },
)
