import React, { ComponentPropsWithRef, PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useReelCells } from './useReelCells'

type ElementProps = Omit<ComponentPropsWithRef<'div'>, keyof PropsWithChildren>

const tableReel = tv({
  slots: {
    wrapper: ['smarthr-ui-TableReel', 'shr-relative'],
    inner: [
      'smarthr-ui-TableReel-inner smarthr-ui-TableReel-scroll-reached-start smarthr-ui-TableReel-scroll-reached-end',
      'shr-relative shr-overflow-auto',
    ],
  },
})

export const TableReel: React.FC<PropsWithChildren & ElementProps> = ({ className, ...props }) => {
  const { tableWrapperRef } = useReelCells()

  const { wrapperStyle, innerStyle } = useMemo(() => {
    const { wrapper, inner } = tableReel()
    return {
      wrapperStyle: wrapper({ className }),
      innerStyle: inner(),
    }
  }, [className])

  return (
    <div className={wrapperStyle}>
      <div {...props} ref={tableWrapperRef} className={innerStyle} />
    </div>
  )
}
