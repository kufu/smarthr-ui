import React, { FC, Ref } from 'react'
import styled, { css } from 'styled-components'

type BaseProps = {
  radius?: 's' | 'm'
  className?: string
  ref?: Ref<HTMLDivElement>
}

export const Base: FC<BaseProps> = ({ radius = 'm', ...props }) => {
  const radiusMap = {
    s: '6px',
    m: '8px',
  }
  return <Wrapper radius={radiusMap[radius]} {...props} />
}

const Wrapper = styled.div<{ radius: string }>`
  ${({ radius }) => {
    return css`
      border-radius: ${radius};
      box-shadow: rgba(51, 51, 51, 0.3) 1px 1px 4px 0;
      background-color: #fff;
    `
  }}
`
