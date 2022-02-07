import React from 'react'
import styled, { css } from 'styled-components'
import { LineUp } from '../../..'

export const Footer: React.VFC = () => (
  <Wrapper>
    <LineUp align="flex-end" vAlign="center">
      <p>SmartHR, Inc.</p>
    </LineUp>
  </Wrapper>
)

const Wrapper = styled.footer(
  ({ theme: { color, space } }) => css`
    overflow: hidden;
    padding: 0 ${space(1.5)};
    height: fit-content;
    background-color: ${color.BRAND};
    p {
      color: ${color.WHITE};
      padding: ${space(0.75)} ${space(0.5)};
    }
  `,
)
