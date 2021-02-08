import React, { FC, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { Base } from '../Base'
import {
  FaCaretDownIcon,
  FaCaretUpIcon,
  FaCheckCircleIcon,
  FaExclamationCircleIcon,
  FaExclamationTriangleIcon,
  FaInfoCircleIcon,
} from '../Icon'
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

  let Icon = InfoTitleIcon
  let iconColor = theme.palette.TEXT_GREY

  switch (type) {
    case 'success':
      Icon = SuccessTitleIcon
      iconColor = theme.palette.MAIN
      break
    case 'info':
      Icon = InfoTitleIcon
      iconColor = theme.palette.TEXT_GREY
      break
    case 'warning':
      Icon = WarningTitleIcon
      iconColor = theme.palette.WARNING
      break
    case 'error':
      Icon = ErrorTitleIcon
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
    <Wrapper className={className} themes={theme} role="presentation">
      <Header themes={theme}>
        <Title themes={theme}>
          <Icon color={iconColor} $theme={theme} />
          <StyledHeading type="blockTitle" tag={titleTag}>
            {title}
          </StyledHeading>
        </Title>
        {togglable && (
          <div>
            <SecondaryButton
              suffix={active ? <FaCaretUpIcon size={14} /> : <FaCaretDownIcon size={14} />}
              size="s"
              onClick={handleClickTrigger}
              aria-expanded={togglable ? active : undefined}
            >
              {active ? closeButtonLabel : openButtonLabel}
            </SecondaryButton>
          </div>
        )}
      </Header>
      {active && (
        <Content themes={theme} aria-hidden={active}>
          {children}
        </Content>
      )}
    </Wrapper>
  )
}

const Wrapper = styled(Base)<{ themes: Theme; role: string }>`
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

const createTitleIcon = (Icon: typeof FaCheckCircleIcon) => {
  return styled(Icon)<{ $theme: Theme }>`
    vertical-align: text-top;
    ${({ $theme }) => {
      const { pxToRem, space } = $theme.size

      return css`
        margin-right: ${pxToRem(space.XXS)};
      `
    }}
  `
}
const SuccessTitleIcon = createTitleIcon(FaCheckCircleIcon)
const InfoTitleIcon = createTitleIcon(FaInfoCircleIcon)
const WarningTitleIcon = createTitleIcon(FaExclamationTriangleIcon)
const ErrorTitleIcon = createTitleIcon(FaExclamationCircleIcon)

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
