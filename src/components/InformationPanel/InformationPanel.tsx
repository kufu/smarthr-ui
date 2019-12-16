import React, { FC, useState } from 'react'
import styled, { css } from 'styled-components'

import { useTheme, Theme } from '../../hooks/useTheme'

import { Base } from '../Base'
import { Icon, iconMap } from '../Icon'
import { Heading, HeadingTagTypes } from '../Heading'
import { SecondaryButton } from '../Button'

type Props = {
  children?: React.ReactNode
  title: string
  titleTag?: HeadingTagTypes
  type?: 'success' | 'info' | 'warning' | 'error' | ''
  className?: string
  active?: boolean
  controllable?: boolean
  onClickOpener?: () => void
  onClickCloser?: () => void
}

export const InformationPanel: FC<Props> = ({
  children,
  title,
  titleTag = 'span',
  type = 'info',
  className = '',
  active = true,
  controllable = false,
  onClickOpener,
  onClickCloser,
}) => {
  const theme = useTheme()

  let iconName: keyof typeof iconMap = 'fa-info-circle'
  let iconColor = theme.palette.TEXT_GREY

  switch (type) {
    case 'success':
      iconName = 'fa-check-circle'
      iconColor = theme.palette.MAIN
      break
    case 'info':
      iconName = 'fa-info-circle'
      iconColor = theme.palette.TEXT_GREY
      break
    case 'warning':
      iconName = 'fa-exclamation-triangle'
      iconColor = theme.palette.WARNING
      break
    case 'error':
      iconName = 'fa-exclamation-circle'
      iconColor = theme.palette.DANGER
  }

  const [activeState, setActiveState] = useState(active)
  const actualActive = controllable ? active : activeState
  const actualClickOpener = controllable
    ? onClickOpener
    : () => {
        setActiveState(true)
      }
  const actualClickCloser = controllable
    ? onClickCloser
    : () => {
        setActiveState(false)
      }

  return (
    <Wrapper className={className} themes={theme}>
      <Title themes={theme}>
        <TitleIcon name={iconName} color={iconColor} themes={theme}></TitleIcon>
        <Heading type="blockTitle" tag={titleTag}>
          {title}
        </Heading>
        <PanelButton
          suffix={<Icon size={14} name={actualActive ? 'fa-caret-up' : 'fa-caret-down'} />}
          size="s"
          onClick={actualActive ? actualClickCloser : actualClickOpener}
        >
          {actualActive ? '閉じる' : '開く'}
        </PanelButton>
      </Title>
      {actualActive && <Content themes={theme}>{children}</Content>}
    </Wrapper>
  )
}

const Wrapper = styled(Base)<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size

    return css`
      padding: ${pxToRem(space.S)};
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
