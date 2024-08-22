import React, { AnchorHTMLAttributes, ReactNode, forwardRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { FaExternalLinkAltIcon } from '../Icon'

type ElementProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Props | 'color'>
type Props = {
  /** リンクをクリックした時に発火するコールバック関数 */
  onClick?: (e: React.MouseEvent) => void
  /** テキストの前に表示するアイコン */
  prefix?: ReactNode
  /** テキストの後ろに表示するアイコン */
  suffix?: ReactNode
  /** react-router/Link や next/link などのカスタムリンク要素を差し込むためのレンダー関数 */
  renderLink?: (props: { className: string; href: string; children: ReactNode }) => ReactNode
}

const textLink = tv({
  slots: {
    anchor:
      'shr-text-link shr-no-underline shr-shadow-underline forced-colors:shr-underline [&:not([href])]:shr-shadow-none [&:not([href])]:forced-colors:shr-no-underline',
    prefixWrapper: 'shr-me-0.25 shr-align-middle',
    suffixWrapper: 'shr-ms-0.25 shr-align-middle',
  },
})
const { anchor, prefixWrapper, suffixWrapper } = textLink()
const prefixWrapperClassName = prefixWrapper()
const suffixWrapperClassName = suffixWrapper()

export const TextLink = forwardRef<HTMLAnchorElement, Props & ElementProps>(
  (
    { href, target, rel, onClick, children, prefix, suffix, className, renderLink, ...others },
    ref,
  ) => {
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
    const actualRel = useMemo(
      () => (rel === undefined && target === '_blank' ? 'noopener noreferrer' : rel),
      [rel, target],
    )
    const anchorClassName = useMemo(() => anchor({ className }), [className])

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

    const actualChildren = (
      <>
        {prefix && <span className={prefixWrapperClassName}>{prefix}</span>}
        {children}
        {actualSuffix && <span className={suffixWrapperClassName}>{actualSuffix}</span>}
      </>
    )

    if (renderLink && actualHref) {
      return renderLink({
        href: actualHref,
        className: anchorClassName,
        children: actualChildren,
      })
    }

    return (
      <a
        {...others}
        ref={ref}
        href={actualHref}
        target={target}
        rel={actualRel}
        onClick={actualOnClick}
        className={anchorClassName}
      >
        {actualChildren}
      </a>
    )
  },
)
