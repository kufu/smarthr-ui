import React, { useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { FaCircleCheckIcon, FaCircleXmarkIcon } from '../Icon'

import { Step } from './types'

import type { ComponentProps, FC } from 'react'

const stepStatusIcon = tv({
  base: [
    'shr-bg-white shr-rounded-full shr-shadow-[0_0_0_theme(borderWidth.2)_theme(colors.white)]',
    'forced-colors:shr-fill-[Canvas] forced-colors:shr-bg-[CanvasText] forced-colors:shr-shadow-[0_0_0_theme(borderWidth.2)_Canvas]',
  ],
  variants: {
    status: {
      completed: [
        'shr-text-main',
        'forced-colors:shr-fill-[Highlight] forced-colors:shr-bg-[Canvas]',
      ],
      closed: ['shr-text-grey', 'forced-colors:shr-fill-[GrayText] forced-colors:shr-bg-[Canvas]'],
    },
  },
})

export const StepStatusIcon: FC<
  ComponentProps<typeof FaCircleCheckIcon> & { status?: Step['status'] }
> = ({ status, className, ...rest }) => {
  const [statusType, statusText] =
    typeof status === 'object' ? [status.type, status.text] : [status]
  const icon = useMemo(() => {
    switch (statusType) {
      case 'completed':
        return { Icon: FaCircleCheckIcon, alt: '完了' }
      case 'closed':
        return { Icon: FaCircleXmarkIcon, alt: '中断' }
      default:
        return null
    }
  }, [statusType])

  if (!icon) return

  const { Icon, alt } = icon
  const style = stepStatusIcon({ status: statusType, className })

  return <Icon {...rest} alt={statusText || alt} className={style} />
}
