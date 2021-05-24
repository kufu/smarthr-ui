import React, { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { SmartHRLogo } from '../SmartHRLogo'
import { Footer } from '../Footer'
import { FaExternalLinkAltIcon } from '../Icon'

type Props = {
  title?: ReactNode
  links?: Array<{
    label: string
    url: string
    target?: string
  }>
  className?: string
}

const LOGO_HEIGHT = 20

export const MessageScreen: FC<Props> = ({ title, links, children, className = '' }) => {
  const theme = useTheme()

  return (
    <Wrapper themes={theme} className={className}>
      <Box>
        <Logo>
          <SmartHRLogo width={111} height={LOGO_HEIGHT} fill={theme.palette.BRAND} />
        </Logo>

        {title && <Title themes={theme}>{title}</Title>}

        {children && <Content themes={theme}>{children}</Content>}

        {links && links.length && (
          <Links themes={theme}>
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.url}
                  {...(link.target ? { target: link.target } : {})}
                  themes={theme}
                >
                  {link.label}
                  {link.target === '_blank' && (
                    <ExternalIcon color={theme.palette.TEXT_LINK} aria-label="別タブで開く" />
                  )}
                </Link>
              </li>
            ))}
          </Links>
        )}
      </Box>

      <FooterArea themes={theme}>
        <Footer />
      </FooterArea>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { palette } = themes

    return css`
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      background-color: ${palette.BACKGROUND};
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
    const { size, spacingByChar, palette } = themes
    const { font } = size

    return css`
      margin: ${spacingByChar(1.5)} 0 0;
      background-color: ${palette.BACKGROUND};
      color: ${palette.TEXT_BLACK};
      font-weight: normal;
      font-size: ${font.VENTI}px;
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
const Link = styled.a<{ themes: Theme }>`
  ${({ themes }) => {
    const { palette, size } = themes

    return css`
      color: ${palette.TEXT_LINK};
      font-size: ${size.font.TALL}px;
      line-height: 1.4;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    `
  }}
`
const ExternalIcon = styled(FaExternalLinkAltIcon).attrs(() => ({
  size: 14,
}))`
  margin-left: 0.4rem;
  vertical-align: -1px;
`
const FooterArea = styled.div<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => {
    return css`
      width: 100%;
      padding-top: ${spacingByChar(1)};
    `
  }}
`
