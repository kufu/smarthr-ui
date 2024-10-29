import React, {
  ComponentPropsWithoutRef,
  ElementType,
  FC,
  PropsWithoutRef,
  ReactNode,
  Ref,
  forwardRef,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { ElementRef, ElementRefProps } from '../../types'
import { FaUpRightFromSquareIcon } from '../Icon'

type ElementProps<T extends ElementType> = Omit<
  ComponentPropsWithoutRef<T>,
  (keyof Props<T> & ElementRefProps<T>) | 'color'
>

type Props<T extends ElementType> = {
  /** リンクをクリックした時に発火するコールバック関数 */
  onClick?: (e: React.MouseEvent) => void
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

export const TextLink: TextLinkComponent = forwardRef(
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
      ...others
    }: PropsWithoutRef<Props<T>> & ElementProps<T>,
    ref: Ref<ElementRef<T>>,
  ) => {
    const Component = elementAs || 'a'
    const actualSuffix = useMemo(() => {
      if (target === '_blank' && suffix === undefined) {
        return <FaUpRightFromSquareIcon aria-label="別タブで開く" />
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

    return (
      // eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation
      <Component
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
      </Component>
    )
  },
)
