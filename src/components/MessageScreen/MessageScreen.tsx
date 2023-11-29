import React, { FC, HTMLAttributes, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { PageHeading } from '../Heading'
import { Center, Stack } from '../Layout'
import { SmartHRLogo } from '../SmartHRLogo'
import { TextLink } from '../TextLink'

import { useClassNames } from './useClassNames'

type Props = {
  /** ロゴ */
  logo?: ReactNode
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
  /** フッター */
  footer?: ReactNode
  /** コンポーネントに適用するクラス名 */
  className?: string
}

type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const MessageScreen: FC<Props & ElementProps> = ({
  logo = <SmartHRLogo fill="brand" />,
  title,
  links,
  children,
  footer,
  className = '',
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames()

  return (
    <Wrapper {...props} themes={theme} className={`${className} ${classNames.wrapper}`}>
      <Box>
        <Logo className={classNames.logo}>{logo}</Logo>

        <Stack align="center">
          {title && <PageHeading className={classNames.title}>{title}</PageHeading>}

          {children && <Content className={classNames.content}>{children}</Content>}

          {links?.length && (
            <Links className={classNames.linkList}>
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
        </Stack>
      </Box>

      {footer && <FooterArea className={classNames.footer}>{footer}</FooterArea>}
    </Wrapper>
  )
}

const Wrapper = styled(Center).attrs({ minHeight: '100vh', verticalCentering: true })<{
  themes: Theme
}>`
  ${({ themes }) => {
    const { color } = themes

    return css`
      background-color: ${color.BACKGROUND};
    `
  }}
`
const Box = styled(Stack).attrs({ gap: 1.5, align: 'center' })`
  &&& {
    margin-block: auto;
  }
`
const Logo = styled.div``
const Content = styled.div``
const Links = styled(Stack).attrs({ forwardedAs: 'ul', gap: 0.5, align: 'center' })``
const FooterArea = styled.div`
  align-self: stretch;
`
