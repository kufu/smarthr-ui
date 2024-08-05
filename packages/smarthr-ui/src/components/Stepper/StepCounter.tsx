import React, { type FC } from 'react'
import { tv } from 'tailwind-variants'

import { StepStatusIcon } from './StepStatusIcon'

import type { Step } from './types'

const style = tv({
  slots: {
    // StatusIcon の位置基準となる wrapper
    wrapper: 'shr-relative',
    counter:
      'shr-inline-flex shr-items-center shr-justify-center shr-rounded-full shr-border-shorthand shr-bg-white shr-tabular-nums shr-w-[2em] shr-h-[2em]',
    statusIcon: 'shr-absolute -shr-top-0.25 shr-left-1.5',
  },
  variants: {
    status: {
      completed: { counter: 'shr-border-main' },
      closed: { counter: 'shr-border-grey' },
    },
    current: {
      true: {
        counter: [
          'shr-bg-main shr-border-main shr-text-white shr-font-bold',
          'forced-colors:shr-bg-[Mark] forced-colors:shr-border-[Mark]',
        ],
      },
      false: {},
    },
  },
})

type Props = Pick<Step, 'status'> & {
  stepNumber?: number
  current: boolean
}

export const StepCounter: FC<Props> = ({ status, current, stepNumber }) => {
  const statusType = typeof status === 'object' ? status.type : status
  const { wrapper, counter, statusIcon } = style({ status: statusType, current })
  return (
    <span className={wrapper()}>
      <span className={counter()} aria-hidden>
        {stepNumber}
      </span>
      <StepStatusIcon status={status} className={statusIcon()} />
    </span>
  )
}
