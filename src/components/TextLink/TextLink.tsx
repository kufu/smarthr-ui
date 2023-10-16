import React, { AnchorHTMLAttributes, ReactNode, forwardRef, useMemo } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

import { useTheme } from '../../hooks/useTheme'
import { FaExternalLinkAltIcon } from '../Icon'

type ElementProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Props>
type Props = VariantProps<typeof textLink> & {
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
  defaultVariants: {
    color: 'TEXT_LINK',
  },
  variants: {
    underline: {
      true: {
        anchor: 'shr-shadow-underline',
      },
    },
    color: {
      TEXT_BLACK: {
        anchor: 'shr-text-black',
      },
      TEXT_WHITE: {
        anchor: 'shr-text-white',
      },
      TEXT_GREY: {
        anchor: 'shr-text-grey',
      },
      TEXT_DISABLED: {
        anchor: 'shr-text-disabled',
      },
      TEXT_LINK: {
        anchor: 'shr-text-link',
      },
      inherit: {
        anchor: 'shr-text-inherit',
      },
    },
  },
})

export const TextLink = forwardRef<HTMLAnchorElement, Props & ElementProps>(
  ({ href, target, onClick, children, prefix, suffix, color, className, ...others }, ref) => {
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

    const { anchor, prefixWrapper, suffixWrapper } = useMemo(
      () =>
        textLink({
          color,
          underline: actualHref !== undefined,
        }),
      [color, actualHref],
    )

    const anchorStyleProps = useMemo(
      () => ({
        className: anchor({ className }),
      }),
      [anchor, className],
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
        {...others}
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
