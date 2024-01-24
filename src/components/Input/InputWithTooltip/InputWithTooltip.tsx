import React, { ComponentProps, forwardRef } from 'react'
import styled, { css } from 'styled-components'

import { Tooltip as shrTooltip } from '../../Tooltip'
import { Input } from '../Input'

type Props = ComponentProps<typeof Input> & {
  /** 入力欄に紐付けるツールチップに表示するメッセージ */
  tooltipMessage: React.ReactNode
}

export const InputWithTooltip = forwardRef<HTMLInputElement, Props>(
  ({ tooltipMessage, width, ...props }, ref) => {
    const widthStyle = typeof width === 'number' ? `${width}px` : width
    return (
      <Tooltip
        width={widthStyle}
        message={tooltipMessage}
        tabIndex={-1}
        ariaDescribedbyTarget="inner"
      >
        {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute, smarthr/a11y-input-in-form-control */}
        <Input {...props} width={widthStyle} ref={ref} />
      </Tooltip>
    )
  },
)

const Tooltip = styled(shrTooltip)<{ width?: string }>(
  ({ width }) => css`
    /* Input のフォーカスリングを表示するため */
    overflow: revert;
    ${width && `width: ${width};`}
  `,
)
