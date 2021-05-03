import React, { AnchorHTMLAttributes, ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'

type ElementProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Props>
type Props = {
  onClick?: (e: React.MouseEvent) => void
  prefix?: ReactNode
  suffix?: ReactNode
}

export const TextLink: VFC<Props & ElementProps> = ({
  href = '',
  onClick,
  children,
  prefix,
  suffix,
  ...props
}) => {
  const theme = useTheme()

  return (
    <StyledAncher {...props} href={href} onClick={generateOnClick(href, onClick)} themes={theme}>
      {prefix && <PrefixWrapper themes={theme}>{prefix}</PrefixWrapper>}
      {children}
      {suffix && <SuffixWrapper themes={theme}>{suffix}</SuffixWrapper>}
    </StyledAncher>
  )
}

const StyledAncher = styled.a<{ themes: Theme }>`
  ${({ themes }) => {
    const { palette } = themes
    return css`
      text-underline-position: under;
      color: ${palette.TEXT_LINK};

      &:hover {
        color: ${palette.hoverColor(palette.TEXT_LINK)};
      }
    `
  }}
`

const PrefixWrapper = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes
    return css`
      margin-right: ${size.pxToRem(size.space.XXS)};
    `
  }}
`
const SuffixWrapper = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes
    return css`
      margin-left: ${size.pxToRem(size.space.XXS)};
    `
  }}
`

const generateOnClick = (href?: string, onClick?: (e: React.MouseEvent) => void) => {
  if (!onClick) {
    return undefined
  }

  if (!href) {
    return onClick
  }

  return (e: React.MouseEvent) => {
    if (!e.altKey && !e.ctrlKey && !e.shiftKey && !e.metaKey) {
      e.preventDefault()
      onClick(e)
    }
  }
}
