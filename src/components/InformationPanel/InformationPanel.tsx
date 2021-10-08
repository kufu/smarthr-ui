import React, { VFC, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useId } from '../../hooks/useId'
import { useClassNames } from './useClassNames'

import { Base, BaseElementProps } from '../Base'
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

export const InformationPanel: VFC<Props & BaseElementProps> = ({
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
  ...props
}) => {
  const theme = useTheme()

  let Icon = InfoTitleIcon
  let iconColor = theme.color.TEXT_GREY

  switch (type) {
    case 'success':
      Icon = SuccessTitleIcon
      iconColor = theme.color.MAIN
      break
    case 'info':
      Icon = InfoTitleIcon
      iconColor = theme.color.TEXT_GREY
      break
    case 'warning':
      Icon = WarningTitleIcon
      iconColor = theme.color.WARNING
      break
    case 'error':
      Icon = ErrorTitleIcon
      iconColor = theme.color.DANGER
      break
    case 'sync':
      Icon = SyncIcon
      iconColor = theme.color.MAIN
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

  const classNames = useClassNames()

  return (
    <Wrapper
      {...props}
      className={`${className} ${classNames.wrapper}`}
      themes={theme}
      role="region"
      aria-labelledby={titleId}
    >
      <Header themes={theme} togglable={togglable}>
        <Title themes={theme} id={titleId} className={classNames.title}>
          <StyledHeading type="blockTitle" tag={titleTag}>
            <Icon color={iconColor} $theme={theme} />
            {title}
          </StyledHeading>
        </Title>
        {togglable && (
          <div>
            <SecondaryButton
              suffix={active ? <FaCaretUpIcon /> : <FaCaretDownIcon />}
              size="s"
              onClick={handleClickTrigger}
              aria-expanded={togglable ? active : undefined}
              aria-controls={contentId}
              className={classNames.closeButton}
            >
              {active ? closeButtonLabel : openButtonLabel}
            </SecondaryButton>
          </div>
        )}
      </Header>
      <Content themes={theme} id={contentId} aria-hidden={!active} className={classNames.content}>
        {children}
      </Content>
    </Wrapper>
  )
}

const Wrapper = styled(Base)<{ themes: Theme; role: string }>`
  ${({ themes: { spacingByChar, shadow } }) => {
    return css`
      padding: ${spacingByChar(1.5)};
      box-shadow: ${shadow.LAYER3};
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
  ${({ themes: { fontSize, spacingByChar } }) => {
    return css`
      margin-top: ${spacingByChar(1.5)};
      font-size: ${fontSize.M};
      &[aria-hidden='true'] {
        display: none;
      }
    `
  }}
`

const StyledHeading = styled(Heading)`
  display: inline;
`
