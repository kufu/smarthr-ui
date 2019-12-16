import React, { ReactNode, forwardRef } from 'react'
import styled, { css } from 'styled-components'

type Props = {
  children: ReactNode
  radius?: 's' | 'm'
  dialog?: boolean
  className?: string
}

export const Base = forwardRef<HTMLDivElement, Props>(
  ({ radius = 'm', dialog = false, ...props }, ref) => {
    const radiusMap = {
      s: '6px',
      m: '8px',
    }
    return <Wrapper radius={radiusMap[radius]} dialog={dialog} ref={ref} {...props} />
  },
)

const Wrapper = styled.div<{ radius: string; dialog: boolean }>`
  ${({ radius, dialog }) => {
    const boxShadow = dialog
      ? 'rgba(51, 51, 51, 0.3) 0px 4px 10px 0'
      : 'rgba(51, 51, 51, 0.3) 1px 1px 4px 0'

    return css`
      border-radius: ${radius};
      box-shadow: ${boxShadow};
      background-color: #fff;
    `
  }}
`
