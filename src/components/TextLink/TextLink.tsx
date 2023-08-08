import React, { AnchorHTMLAttributes, ReactNode, forwardRef, useMemo } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { FaExternalLinkAltIcon } from '../Icon'

type ElementProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Props>
type Props = {
  /** リンクをクリックした時に発火するコールバック関数 */
  onClick?: (e: React.MouseEvent) => void
  /** テキストの前に表示するアイコン */
  prefix?: ReactNode
  /** テキストの後ろに表示するアイコン */
  suffix?: ReactNode
}

export const TextLink = forwardRef<HTMLAnchorElement, Props & ElementProps>(
  ({ href, target, onClick, children, prefix, suffix, ...props }, ref) => {
    const theme = useTheme()
    const actualSuffix = useMemo(() => {
      if (target === '_blank' && suffix === undefined) {
        return <FaExternalLinkAltIcon aria-label="別タブで開く" />
      }
      return suffix
    }, [suffix, target])
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
      <StyledAnchor
        {...props}
        ref={ref}
        href={actualHref}
        target={target}
        onClick={actualOnClick}
        themes={theme}
      >
        {prefix && <PrefixWrapper themes={theme}>{prefix}</PrefixWrapper>}
        {children}
        {actualSuffix && <SuffixWrapper themes={theme}>{actualSuffix}</SuffixWrapper>}
      </StyledAnchor>
    )
  },
)

const StyledAnchor = styled.a<{ themes: Theme }>`
  ${({ themes }) => {
    const { color } = themes
    return css`
      text-decoration: none;
      box-shadow: 0 1px 0 0;
      color: ${color.TEXT_LINK};

      &:not([href]) {
        box-shadow: none;
      }
    `
  }}
`
const PrefixWrapper = styled.span<{ themes: Theme }>(
  ({ themes: { spacingByChar } }) => css`
    margin-right: ${spacingByChar(0.25)};
    vertical-align: middle;
  `,
)
const SuffixWrapper = styled.span<{ themes: Theme }>(
  ({ themes: { spacingByChar } }) => css`
    margin-left: ${spacingByChar(0.25)};
    vertical-align: middle;
  `,
)
