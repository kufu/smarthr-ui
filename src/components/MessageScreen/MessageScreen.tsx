import React, { HTMLAttributes, ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { SmartHRLogo } from '../SmartHRLogo'
import { TextLink } from '../TextLink'

import { Footer } from './Footer'
import { useClassNames } from './useClassNames'

type Props = {
  /** コンテンツの上に表示されるタイトル */
  title?: ReactNode
  /** コンテンツの下に表示されるアンカー要素のリスト */
  links?: Array<{
    /** アンカー要素のテキスト */
    label: ReactNode
    /** アンカー要素の href */
    url: string
    /** アンカー要素の target。`_blank` を設定すると外部リンクアイコンが表示されます。*/
    target?: string
  }>
  /** 表示するコンテンツ */
  children?: ReactNode
  /** コンポーネントに適用するクラス名 */
  className?: string
}

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
          <SmartHRLogo fill="brand" />
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
            {links.map((link, index) => (
              <li key={index}>
                <TextLink
                  {...(link.target ? { target: link.target } : {})}
                  href={link.url}
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
const Logo = styled.div``
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
