import React, { AnchorHTMLAttributes, ReactNode, forwardRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

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
    anchor:
      'shr-text-link shr-no-underline shr-shadow-underline forced-colors:shr-underline [&:not([href])]:shr-shadow-none',
    prefixWrapper: 'shr-me-0.25 shr-align-middle',
    suffixWrapper: 'shr-ms-0.25 shr-align-middle',
  },
})

export const TextLink = forwardRef<HTMLAnchorElement, Props & ElementProps>(
  ({ href, target, onClick, children, prefix, suffix, className, ...others }, ref) => {
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

    const { anchor, prefixWrapper, suffixWrapper } = useMemo(() => textLink(), [])

    return (
      <a
        {...others}
        ref={ref}
        href={actualHref}
        target={target}
        onClick={actualOnClick}
        className={anchor({ className })}
      >
        {prefix && <span className={prefixWrapper()}>{prefix}</span>}
        {children}
        {actualSuffix && <span className={suffixWrapper()}>{actualSuffix}</span>}
      </a>
    )
  },
)
