import React, { AnchorHTMLAttributes, ReactNode, forwardRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useTheme } from '../../hooks/useTheme'
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

const textLink = tv({
  slots: {
    anchor: 'shr-no-underline',
    prefixWrapper: 'shr-align-middle',
    suffixWrapper: 'shr-align-middle',
  },
})
export const TextLink = forwardRef<HTMLAnchorElement, Props & ElementProps>(
  ({ href, target, onClick, children, prefix, suffix, ...props }, ref) => {
    const theme = useTheme()
    const { anchor, prefixWrapper, suffixWrapper } = textLink()
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

    const anchorStyleProps = useMemo(
      () => ({
        style: {
          boxShadow: actualHref !== undefined ? '0 1px 0 0' : 'none',
          color: theme.color.TEXT_LINK,
        },
        className: anchor(),
      }),
      [actualHref, theme.color.TEXT_LINK, anchor],
    )

    const prefixWrapperStyleProps = useMemo(
      () => ({
        style: { marginRight: theme.spacingByChar(0.25) },
        className: prefixWrapper(),
      }),
      [theme, prefixWrapper],
    )

    const suffixWrapperStyleProps = useMemo(
      () => ({
        style: { marginLeft: theme.spacingByChar(0.25) },
        className: suffixWrapper(),
      }),
      [theme, suffixWrapper],
    )

    return (
      <a
        {...props}
        {...anchorStyleProps}
        ref={ref}
        href={actualHref}
        target={target}
        onClick={actualOnClick}
      >
        {prefix && <span {...prefixWrapperStyleProps}>{prefix}</span>}
        {children}
        {actualSuffix && <span {...suffixWrapperStyleProps}>{actualSuffix}</span>}
      </a>
    )
  },
)
