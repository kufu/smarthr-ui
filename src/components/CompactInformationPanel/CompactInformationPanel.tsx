import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { Base } from '../Base'
import {
  FaCheckCircleIcon,
  FaExclamationCircleIcon,
  FaExclamationTriangleIcon,
  FaInfoCircleIcon,
} from '../Icon'

type IconType = 'info' | 'success' | 'warning' | 'error'
export const CompactInformationPanel: React.VFC<{
  type?: IconType
  children: ReactNode
}> = ({ type = 'info', children }) => {
  const theme = useTheme()

  return (
    <Wrapper themes={theme}>
      <Icon type={type} themes={theme} />
      <Content>{children}</Content>
    </Wrapper>
  )
}

const Wrapper = styled(Base)<{ themes: Theme }>`
  ${({
    themes: {
      fontSize: { pxToRem },
      spacing,
    },
  }) => {
    return css`
      display: flex;
      padding: ${pxToRem(spacing.XS)};
    `
  }}
`
const Icon: React.VFC<{
  type: IconType
  themes: Theme
}> = ({
  type,
  themes: {
    color,
    spacing,
    fontSize: { pxToRem },
  },
}) => {
  let Component
  const style = css`
    flex-shrink: 0;

    /*
      基本 line-height を 1.5 とし
      flexbox の align-items を start（デフォルト）にしたので
      leading 分 0.25em をずらしている
      */
    transform: translateY(0.25em);
    margin-right: ${pxToRem(spacing.XXS)};
  `

  switch (type) {
    case 'info':
    default:
      Component = styled(FaInfoCircleIcon)`
        ${style}
        color: ${color.TEXT_GREY};
      `
      break
    case 'success':
      Component = styled(FaCheckCircleIcon)`
        ${style}
        color: ${color.MAIN};
      `
      break
    case 'warning':
      Component = styled(FaExclamationTriangleIcon)`
        ${style}
        color: ${color.WARNING};
      `
      break
    case 'error':
      Component = styled(FaExclamationCircleIcon)`
        ${style}
        color: ${color.DANGER};
      `
      break
  }

  return <Component />
}
const Content = styled.div`
  line-height: 1.5;
`
