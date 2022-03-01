import React, { HTMLAttributes, ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

import { SmartHRLogo } from '../SmartHRLogo'
import { TextLink } from '../TextLink'
import { Footer } from './Footer'

type Props = {
  title?: ReactNode
  links?: Array<{
    label: string
    url: string
    target?: string
  }>
  children?: ReactNode
  className?: string
}

const LOGO_HEIGHT = 20
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const MessageScreen: VFC<Props & ElementProps> = ({
  title,
  links,
  children,
  className = '',
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames()

  return (
    <Wrapper {...props} themes={theme} className={`${className} ${classNames.wrapper}`}>
      <Box>
        <Logo className={classNames.logo}>
          <SmartHRLogo width={111} height={LOGO_HEIGHT} fill={theme.color.BRAND} />
        </Logo>

        {title && (
          <Title themes={theme} className={classNames.title}>
            {title}
          </Title>
        )}

        {children && (
          <Content themes={theme} className={classNames.content}>
            {children}
          </Content>
        )}

        {links && links.length && (
          <Links themes={theme} className={classNames.linkList}>
            {links.map((link) => (
              <li key={link.label}>
                <TextLink
                  href={link.url}
                  {...(link.target ? { target: link.target } : {})}
                  className={classNames.link}
                >
                  {link.label}
                </TextLink>
              </li>
            ))}
          </Links>
        )}
      </Box>

      <FooterArea themes={theme} className={classNames.footer}>
        <Footer />
      </FooterArea>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { color } = themes

    return css`
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      background-color: ${color.BACKGROUND};
    `
  }}
`
const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto 0;
`
const Logo = styled.div`
  height: ${LOGO_HEIGHT}px;
`
const Title = styled.h1<{ themes: Theme }>`
  ${({ themes }) => {
    const { fontSize, spacingByChar, color } = themes

    return css`
      margin: ${spacingByChar(1.5)} 0 0;
      background-color: ${color.BACKGROUND};
      color: ${color.TEXT_BLACK};
      font-weight: normal;
      font-size: ${fontSize.XL};
      line-height: 1;
    `
  }}
`
const Content = styled.div<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => {
    return css`
      margin-top: ${spacingByChar(1)};
    `
  }}
`
const Links = styled.ul<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => {
    return css`
      margin: ${spacingByChar(1)} 0 0;
      padding: 0;
      list-style: none;
      text-align: center;
      line-height: 1;

      > li:not(:first-child) {
        margin-top: ${spacingByChar(1)};
      }
    `
  }}
`
const FooterArea = styled.div<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => {
    return css`
      width: 100%;
      padding-top: ${spacingByChar(1)};
    `
  }}
`
