'use client'

import { type ComponentPropsWithRef, type FC, type PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { reelShadowClassNameGenerator } from './reelShadowStyle'
import { useReelCells } from './useReelCells'

type Props = PropsWithChildren & Omit<ComponentPropsWithRef<'div'>, keyof PropsWithChildren>

const classNameGenerator = tv({
  slots: {
    wrapper: ['smarthr-ui-TableReel', 'shr-relative'],
    inner: ['smarthr-ui-TableReel-inner', 'shr-relative shr-overflow-auto'],
  },
})

export const TableReel: FC<Props> = ({ className, children, ...rest }) => {
  const { showShadow, tableWrapperRef } = useReelCells(children)

  const classNames = useMemo(() => {
    const { wrapper, inner } = classNameGenerator()

    return {
      wrapper: reelShadowClassNameGenerator({ showShadow, className: wrapper({ className }) }),
      inner: inner(),
    }
  }, [className, showShadow])

  return (
    <div className={classNames.wrapper}>
      <div {...rest} ref={tableWrapperRef} className={classNames.inner}>
        {children}
      </div>
    </div>
  )
}
