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
      d="M1.326 8.528a.5.5 0 0 1 0-.938l2.897-1.072a.5.5 0 0 0 .295-.295L5.59 3.326a.5.5 0 0 1 .938 0L7.6 6.223a.5.5 0 0 0 .295.295l2.897 1.072a.5.5 0 0 1 0 .938L7.895 9.6a.5.5 0 0 0-.295.295l-1.072 2.897a.5.5 0 0 1-.938 0L4.518 9.895a.5.5 0 0 0-.295-.295L1.326 8.528ZM10.097 12.639a.148.148 0 0 1 0-.278l.859-.318a.148.148 0 0 0 .087-.087l.318-.86c.048-.128.23-.128.278 0l.318.86c.015.04.047.072.087.087l.86.318c.128.048.128.23 0 .278l-.86.318a.148.148 0 0 0-.087.087l-.318.86a.148.148 0 0 1-.278 0l-.318-.86a.148.148 0 0 0-.087-.087l-.86-.318ZM10.161 4.732a.247.247 0 0 1 0-.464l1.432-.53a.247.247 0 0 0 .146-.145l.53-1.432a.247.247 0 0 1 .463 0l.53 1.432a.247.247 0 0 0 .145.146l1.432.53a.247.247 0 0 1 0 .463l-1.432.53a.247.247 0 0 0-.146.145l-.53 1.432a.247.247 0 0 1-.463 0l-.53-1.432a.247.247 0 0 0-.145-.146l-1.432-.53Z"
    />
  </Wrapper>
))
