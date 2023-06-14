import React from 'react'
import { IconBase } from 'react-icons'
import styled, { css } from 'styled-components'

import { useTheme } from '../../hooks/useTheme'

import { generateIcon } from './generateIcon'

const Wrapper = styled(IconBase)(() => {
  const { color } = useTheme()
  return css`
    .mark {
      fill: ${color.TEXT_BLACK};
    }
  `
})

export const SparklesIcon = /*#__PURE__*/ generateIcon((props) => (
  <Wrapper {...props} viewBox="0 0 16 16">
    <path
      className="mark"
      d="M.373 8.616c-.497-.188-.497-.906 0-1.094l3.31-1.25a.578.578 0 0 0 .338-.345l1.225-3.38a.567.567 0 0 1 1.072 0l1.225 3.38c.058.16.181.285.337.345l3.31 1.25c.498.188.498.906 0 1.094l-3.31 1.25a.577.577 0 0 0-.337.345l-1.225 3.38a.567.567 0 0 1-1.072 0l-1.225-3.38a.577.577 0 0 0-.337-.344l-3.31-1.25ZM10.396 13.412c-.147-.056-.147-.269 0-.324l.982-.371a.17.17 0 0 0 .1-.102l.363-1.002a.168.168 0 0 1 .318 0l.363 1.002a.17.17 0 0 0 .1.102l.982.37c.147.056.147.27 0 .325l-.982.371a.17.17 0 0 0-.1.102l-.363 1.002a.168.168 0 0 1-.318 0l-.363-1.002a.17.17 0 0 0-.1-.102l-.982-.37ZM10.47 4.187c-.246-.093-.246-.448 0-.54l1.636-.619a.285.285 0 0 0 .167-.17l.605-1.67a.28.28 0 0 1 .53 0l.605 1.67c.029.079.09.141.167.17l1.636.618c.245.093.245.448 0 .541l-1.636.618a.285.285 0 0 0-.167.17l-.605 1.67a.28.28 0 0 1-.53 0l-.605-1.67a.285.285 0 0 0-.167-.17l-1.636-.618Z"
    />
  </Wrapper>
))
