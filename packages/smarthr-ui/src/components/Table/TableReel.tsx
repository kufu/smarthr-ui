'use client'

import { type ComponentPropsWithRef, type FC, type PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { reelShadowClassNameGenerator } from './reelShadowStyle'
import { useReelCells } from './useReelCells'

type Props = PropsWithChildren &
  Omit<ComponentPropsWithRef<'div'>, keyof PropsWithChildren> & {
    tableWrapperRef: React.RefObject<HTMLDivElement>
  }

const classNameGenerator = tv({
  slots: {
    wrapper: ['smarthr-ui-TableReel', 'shr-relative'],
    inner: ['smarthr-ui-TableReel-inner', 'shr-relative'],
  },
})

export const TableReel: FC<Props> = ({ className, children, tableWrapperRef, ...rest }) => {
  const { showShadow } = useReelCells(children, tableWrapperRef)

  const classNames = useMemo(() => {
    const { wrapper, inner } = classNameGenerator()

    return {
      wrapper: reelShadowClassNameGenerator({ showShadow, className: wrapper({ className }) }),
      inner: inner(),
    }
  }, [className, showShadow])

  return (
    <div className={classNames.wrapper}>
      <div {...rest} className={classNames.inner}>
        {children}
      </div>
    </div>
  )
}
