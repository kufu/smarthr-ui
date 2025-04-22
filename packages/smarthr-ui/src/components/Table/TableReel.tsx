'use client'

import { type ComponentPropsWithRef, type FC, type PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { reelShadowClassNameGenerator } from './reelShadowStyle'
import { useReelCells } from './useReelCells'

type ElementProps = Omit<ComponentPropsWithRef<'div'>, keyof PropsWithChildren>

const classNameGenerator = tv({
  slots: {
    wrapper: ['smarthr-ui-TableReel', 'shr-relative'],
    inner: ['smarthr-ui-TableReel-inner', 'shr-relative shr-overflow-auto'],
  },
})

export const TableReel: FC<PropsWithChildren & ElementProps> = ({
  className,
  children,
  ...props
}) => {
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
      <div {...props} ref={tableWrapperRef} className={classNames.inner}>
        {children}
      </div>
    </div>
  )
}
