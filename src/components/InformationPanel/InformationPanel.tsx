import React, { FC, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { Base } from '../Base'
import { Icon, iconMap } from '../Icon'
import { Heading, HeadingTagTypes } from '../Heading'
import { SecondaryButton } from '../Button'

type Props = {
  title: string
  titleTag?: HeadingTagTypes
  type?: 'success' | 'info' | 'warning' | 'error' | ''
  togglable?: boolean
  openButtonLabel?: string
  closeButtonLabel?: string
  active?: boolean
  className?: string
  children: React.ReactNode
  onClickTrigger?: (active: boolean) => void
}

export const InformationPanel: FC<Props> = ({
  title,
  titleTag = 'span',
  type = 'info',
  togglable = true,
  openButtonLabel = '開く',
  closeButtonLabel = '閉じる',
  active: activeProps = true,
  className = '',
  children,
  onClickTrigger,
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

  const [active, setActive] = useState(activeProps)

  const handleClickTrigger = () => {
    if (onClickTrigger) {
      onClickTrigger(active)
    } else {
      setActive(!active)
    }
  }

  useEffect(() => {
    setActive(activeProps)
  }, [activeProps])

  return (
    <Wrapper className={className} themes={theme} aria-expanded={active}>
      <Header themes={theme}>
        <Title themes={theme}>
          <TitleIcon name={iconName} color={iconColor} themes={theme} />
          <StyledHeading type="blockTitle" tag={titleTag}>
            {title}
          </StyledHeading>
        </Title>
        {togglable && (
          <div>
            <SecondaryButton
              suffix={<Icon size={14} name={active ? 'fa-caret-up' : 'fa-caret-down'} />}
              size="s"
              onClick={handleClickTrigger}
            >
              {active ? closeButtonLabel : openButtonLabel}
            </SecondaryButton>
          </div>
        )}
      </Header>
      {active && <Content themes={theme}>{children}</Content>}
    </Wrapper>
  )
}

const Wrapper = styled(Base)<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size

    return css`
      padding: ${pxToRem(space.S)};
      box-shadow: rgba(51, 51, 51, 0.3) 0 4px 10px 0;
    `
  }}
`

const Header = styled.div<{ themes: Theme }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Title = styled.div<{ themes: Theme }>`
  vertical-align: middle;
  ${({ themes }) => {
    const { pxToRem, space } = themes.size

    return css`
      margin-right: ${pxToRem(space.XXS)};
    `
  }}
`

const TitleIcon = styled(Icon)<{ themes: Theme }>`
  vertical-align: text-top;
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

const StyledHeading = styled(Heading)`
  display: inline;
`
