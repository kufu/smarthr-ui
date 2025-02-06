'use client'

import React, { ComponentPropsWithRef, PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useReelCells } from './useReelCells'
import { reelShadowStyle } from './useReelShadow'

type ElementProps = Omit<ComponentPropsWithRef<'div'>, keyof PropsWithChildren>

const tableReel = tv({
  slots: {
    wrapper: ['smarthr-ui-TableReel', 'shr-relative'],
    inner: ['smarthr-ui-TableReel-inner', 'shr-relative shr-overflow-auto'],
  },
})

export const TableReel: React.FC<PropsWithChildren & ElementProps> = ({ className, ...props }) => {
  const { showShadow, tableWrapperRef } = useReelCells()

  const classNames = useMemo(() => {
    const { wrapper, inner } = tableReel()

    return {
      wrapper: reelShadowStyle({ showShadow, className: wrapper({ className }) }),
      inner: inner(),
    }
  }, [className, showShadow])

  return (
    <div className={classNames.wrapper}>
      <div {...props} ref={tableWrapperRef} className={classNames.inner} />
    </div>
  )
}
