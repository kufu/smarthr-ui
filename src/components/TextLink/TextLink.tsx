import React, { AnchorHTMLAttributes, ReactNode, VFC, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'
import { FaExternalLinkAltIcon } from '../Icon'
import { LineUp } from '../Layout/LineUp'

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
      <LineUp gap={0.25} inline vAlign="center" as="span">
        {prefix}
        {children}
        {actualSuffix}
      </LineUp>
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
