import React, { VFC, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useId } from '../../hooks/useId'

import { Base } from '../Base'
import {
  FaCaretDownIcon,
  FaCaretUpIcon,
  FaCheckCircleIcon,
  FaExclamationCircleIcon,
  FaExclamationTriangleIcon,
  FaInfoCircleIcon,
  FaSyncAltIcon,
} from '../Icon'
import { Heading, HeadingTagTypes } from '../Heading'
import { SecondaryButton } from '../Button'

type Props = {
  title: string
  titleTag?: HeadingTagTypes
  type?: 'success' | 'info' | 'warning' | 'error' | 'sync' | ''
  togglable?: boolean
  openButtonLabel?: string
  closeButtonLabel?: string
  active?: boolean
  className?: string
  children: React.ReactNode
  onClickTrigger?: (active: boolean) => void
}

export const InformationPanel: VFC<Props> = ({
  title,
  titleTag = 'h3',
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
      break
    case 'sync':
      Icon = SyncIcon
      iconColor = theme.palette.MAIN
  }

  const [active, setActive] = useState(activeProps)
  const titleId = useId()
  const contentId = useId()

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
    <Wrapper className={className} themes={theme} role="region" aria-labelledby={titleId}>
      <Header themes={theme} togglable={togglable}>
        <Title themes={theme} id={titleId}>
          <StyledHeading type="blockTitle" tag={titleTag}>
            <Icon color={iconColor} $theme={theme} />
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
              aria-controls={contentId}
            >
              {active ? closeButtonLabel : openButtonLabel}
            </SecondaryButton>
          </div>
        )}
      </Header>
      <Content themes={theme} id={contentId} aria-hidden={!active}>
        {children}
      </Content>
    </Wrapper>
  )
}

const Wrapper = styled(Base)<{ themes: Theme; role: string }>`
  ${({ themes: { spacingByChar } }) => {
    return css`
      padding: ${spacingByChar(1.5)};
      box-shadow: rgba(51, 51, 51, 0.3) 0 4px 10px 0;
    `
  }}
`

const Header = styled.div<{ themes: Theme; togglable: boolean }>(
  ({ togglable }) => `
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${
    togglable &&
    // (SecondaryButton(27px) - Heading(14px)) / 2 = 6.5px
    `
    margin-top: -6.5px;
    margin-bottom: -6.5px;
  `
  }
`,
)

const Title = styled.div<{ themes: Theme }>`
  vertical-align: middle;
  line-height: 1;
  ${({ themes: { spacingByChar } }) => {
    return css`
      margin-right: ${spacingByChar(0.5)};
    `
  }}
`

const createTitleIcon = (Icon: typeof FaCheckCircleIcon) => {
  return styled(Icon)<{ $theme: Theme }>`
    vertical-align: text-top;
    ${({ $theme: { spacingByChar } }) => {
      return css`
        margin-right: ${spacingByChar(0.5)};
      `
    }}
  `
}
const SuccessTitleIcon = createTitleIcon(FaCheckCircleIcon)
const InfoTitleIcon = createTitleIcon(FaInfoCircleIcon)
const WarningTitleIcon = createTitleIcon(FaExclamationTriangleIcon)
const ErrorTitleIcon = createTitleIcon(FaExclamationCircleIcon)
const SyncIcon = createTitleIcon(FaSyncAltIcon)

const Content = styled.div<{ themes: Theme }>`
  ${({ themes: { size, spacingByChar } }) => {
    const { pxToRem, font } = size

    return css`
      margin-top: ${spacingByChar(1.5)};
      font-size: ${pxToRem(font.TALL)};
      &[aria-hidden='true'] {
        display: none;
      }
    `
  }}
`

const StyledHeading = styled(Heading)`
  display: inline;
`
