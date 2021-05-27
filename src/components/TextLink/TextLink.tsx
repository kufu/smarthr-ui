import React, { AnchorHTMLAttributes, ReactNode, VFC, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'
import { FaExternalLinkAltIcon } from '../Icon'

type ElementProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Props>
type Props = {
  onClick?: (e: React.MouseEvent) => void
  prefix?: ReactNode
  suffix?: ReactNode
}

export const TextLink: VFC<Props & ElementProps> = ({
  href,
  target,
  onClick,
  children,
  prefix,
  suffix,
  ...props
}) => {
  const theme = useTheme()
  const actualSuffix = useMemo(
    () =>
      suffix || (target === '_blank' ? <FaExternalLinkAltIcon aria-label="別タブで開く" /> : null),
    [suffix, target],
  )
  const actualHref = useMemo(() => {
    if (href) {
      return href
    }

    if (onClick) {
      return ''
    }

    return undefined
  }, [href, onClick])
  const actualOnClick = useMemo(() => {
    if (!onClick) {
      return undefined
    }

    return (e: React.MouseEvent) => {
      if (!href) {
        e.preventDefault()
      }
      onClick(e)
    }
  }, [href, onClick])

  return (
    <StyledAncher
      {...props}
      href={actualHref}
      target={target}
      onClick={actualOnClick}
      themes={theme}
    >
      {prefix && <PrefixWrapper themes={theme}>{prefix}</PrefixWrapper>}
      {children}
      {actualSuffix && <SuffixWrapper themes={theme}>{actualSuffix}</SuffixWrapper>}
    </StyledAncher>
  )
}

const StyledAncher = styled.a<{ themes: Theme }>`
  ${({ themes }) => {
    const { color } = themes
    return css`
      text-underline-position: under;
      color: ${color.TEXT_LINK};

      &:hover {
        color: ${color.hoverColor(color.TEXT_LINK)};
      }
    `
  }}
`

const PrefixWrapper = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { spacingByChar } = themes
    return css`
      margin-right: ${spacingByChar(0.5)};
    `
  }}
`
const SuffixWrapper = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { spacingByChar } = themes
    return css`
      margin-left: ${spacingByChar(0.5)};
    `
  }}
`
