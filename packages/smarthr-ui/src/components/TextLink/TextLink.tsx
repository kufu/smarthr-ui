import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type FC,
  type MouseEvent,
  type PropsWithoutRef,
  type ReactNode,
  type Ref,
  forwardRef,
  memo,
  useMemo,
} from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { OpenInNewTabIcon } from '../OpenInNewTabIcon'

import type { ElementRef, ElementRefProps } from '../../types'

type ElementProps<T extends ElementType> = Omit<
  ComponentPropsWithoutRef<T>,
  (keyof Props<T> & ElementRefProps<T>) | 'color'
>

type Props<T extends ElementType> = VariantProps<typeof classNameGenerator> & {
  /** リンクをクリックした時に発火するコールバック関数 */
  onClick?: (e: MouseEvent) => void
  /** テキストの前に表示するアイコン */
  prefix?: ReactNode
  /** テキストの後ろに表示するアイコン */
  suffix?: ReactNode
  /** TextLinkを利用しつつnext/linkなどと併用する場合に指定する */
  elementAs?: T
}

type TextLinkComponent = <T extends ElementType = 'a'>(
  props: Props<T> & ElementProps<T> & ElementRefProps<T>,
) => ReturnType<FC>

const classNameGenerator = tv({
  slots: {
    anchor: [
      'shr-text-link shr-no-underline shr-shadow-underline',
      'forced-colors:shr-underline',
      '[&:not([href])]:shr-shadow-none [&:not([href])]:forced-colors:shr-no-underline',
      '[.smarthr-ui-Th_&]:shr-text-link-darken',
    ],
    prefixWrapper: 'shr-me-0.25 shr-align-middle',
    suffixWrapper: 'shr-ms-0.25 shr-align-middle',
  },
  variants: {
    size: {
      XS: {
        anchor: 'shr-text-xs',
      },
      S: {
        anchor: 'shr-text-sm',
      },
      M: {
        anchor: 'shr-text-base',
      },
    },
  },
})
const { anchor, prefixWrapper, suffixWrapper } = classNameGenerator()
const prefixWrapperClassName = prefixWrapper()
const suffixWrapperClassName = suffixWrapper()

const ActualTextLink: TextLinkComponent = forwardRef(
  <T extends ElementType = 'a'>(
    {
      elementAs,
      href,
      target,
      rel,
      onClick,
      children,
      prefix,
      suffix,
      className,
      size,
      ...others
    }: PropsWithoutRef<Props<T>> & ElementProps<T>,
    ref: Ref<ElementRef<T>>,
  ) => {
    const Anchor = elementAs || 'a'
    const actualSuffix = useMemo(() => {
      // target="_blank" だが OpenInNewTabIcon を表示したくない場合 suffix に null を指定すれば表示しないようにしている
      if (target === '_blank' && !prefix && suffix === undefined) {
        return <OpenInNewTabIcon />
      }

      return suffix
    }, [prefix, suffix, target])
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
    const anchorClassName = useMemo(() => anchor({ size, className }), [size, className])

    const actualOnClick = useMemo(() => {
      if (!onClick) {
        return undefined
      }

      if (href) {
        return onClick
      }

      return (e: MouseEvent) => {
        e.preventDefault()
        onClick(e)
      }
    }, [onClick, href])

    return (
      <Anchor
        {...others}
        ref={ref}
        href={actualHref}
        target={target}
        rel={actualRel}
        onClick={actualOnClick}
        className={anchorClassName}
      >
        {prefix && <span className={prefixWrapperClassName}>{prefix}</span>}
        {children}
        {actualSuffix && <span className={suffixWrapperClassName}>{actualSuffix}</span>}
      </Anchor>
    )
  },
)

export const TextLink = memo(ActualTextLink) as typeof ActualTextLink
