import React, { ComponentPropsWithoutRef, PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

type Props = PropsWithChildren<{
  /** 現在地かどうか */
  current?: boolean
}>
type ElementProps = Omit<ComponentPropsWithoutRef<'li'>, keyof Props>
type InnerLinkProps = Omit<ComponentPropsWithoutRef<'a'>, keyof Props & keyof ElementProps>

const sideMenuItem = tv({
  slots: {
    wrapper: ['smarthr-ui-SideMenu-item', 'shr-relative shr-ps-0.75'],
    innerLink: [
      // 親要素ではなくリンクにスタイリングするため block でいっぱいに広げている
      'shr-block',
      'shr-rounded-m shr-px-1 shr-py-0.75 shr-no-underline',
      'aria-current-page:shr-bg-grey-9 aria-current-page:shr-font-bold',
      'hover:shr-bg-grey-9-darken',
      // フォーカスリングを前に出したいので、スタッキングコンテキストを発生させている
      'focus-visible:shr-focus-indicator focus-visible:shr-relative focus-visible:shr-z-1',
    ],
  },
  variants: {
    current: {
      true: {
        wrapper:
          'before:shr-absolute before:shr-inset-y-0 before:shr-left-0 before:shr-block before:shr-w-[3px] before:shr-bg-main before:shr-content-[""]',
      },
    },
  },
})

export const SideMenuItem: React.FC<Props & ElementProps & InnerLinkProps> = ({
  href,
  children,
  current,
  className,
  ...rest
}) => {
  const { wrapperStyle, innerLinkStyle } = useMemo(() => {
    const { wrapper, innerLink } = sideMenuItem()
    return {
      wrapperStyle: wrapper({ current, className }),
      innerLinkStyle: innerLink(),
    }
  }, [className, current])

  return (
    <li {...rest} className={wrapperStyle}>
      <a href={href} aria-current={current && 'page'} className={innerLinkStyle}>
        {children}
      </a>
    </li>
  )
}
