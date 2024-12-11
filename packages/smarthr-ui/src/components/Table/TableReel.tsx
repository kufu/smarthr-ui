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

  const { wrapperStyle, innerStyle } = useMemo(() => {
    const { wrapper, inner } = tableReel()
    return {
      wrapperStyle: reelShadowStyle({ showShadow, className: wrapper({ className }) }),
      innerStyle: inner(),
    }
  }, [className, showShadow])

  return (
    <div className={wrapperStyle}>
      <div {...props} ref={tableWrapperRef} className={innerStyle} />
    </div>
  )
}
