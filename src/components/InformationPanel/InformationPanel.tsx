import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { useTheme, Theme } from '../../hooks/useTheme'

import { DialogBase } from '../Base'
import { Icon } from '../Icon'
import { Heading, HeadingTagTypes } from '../Heading'
import { SecondaryButton } from '../Button'

type Props = {
  children?: React.ReactNode
  title: string
  titleTag?: HeadingTagTypes
  className?: string
}

export const InformationPanel: FC<Props> = ({ children, title, titleTag = 'span', className }) => {
  const theme = useTheme()

  return (
    <Wrapper className={className} themes={theme}>
      <Title themes={theme}>
        <TitleIcon name="fa-info-circle" color={theme.palette.TEXT_GREY} themes={theme}></TitleIcon>
        <Heading type="blockTitle" tag={titleTag}>
          {title}
        </Heading>
        <PanelButton suffix={<Icon size={14} name="fa-caret-down" />} size="s">
          閉じる
        </PanelButton>
      </Title>
      <Content themes={theme}>{children}</Content>
    </Wrapper>
  )
}

const Wrapper = styled(DialogBase)<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size

    return css`
      padding: ${pxToRem(space.M)};
    `
  }}
`

const Title = styled.div<{ themes: Theme }>`
  display: flex;
  justify-content: start;
  align-items: center;
  position: relative;
`

const TitleIcon = styled(Icon)<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size

    return css`
      margin-right: ${pxToRem(space.XXS)};
    `
  }}
`

const Content = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space, font } = themes.size

    return css`
      margin-top: ${pxToRem(space.S)};
      font-size: ${pxToRem(font.TALL)};
    `
  }}
`

const PanelButton = styled(SecondaryButton)`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
`
