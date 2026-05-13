import { type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { StepStatusIcon } from './StepStatusIcon'

import type { Step } from './types'

const classNameGenerator = tv({
  slots: {
    // StatusIcon の位置基準となる wrapper
    wrapper: 'shr-relative shr-inline-block',
    counter:
      'shr-border-shorthand shr-inline-flex shr-h-[2em] shr-w-[2em] shr-items-center shr-justify-center shr-rounded-full shr-bg-white shr-tabular-nums',
    statusIcon: 'shr-absolute -shr-left-[0.625em] -shr-top-[0.75em]',
  },
  variants: {
    status: {
      completed: { counter: 'shr-border-main' },
      closed: { counter: 'shr-border-grey' },
    },
    current: {
      true: {
        counter: [
          'shr-border-main shr-bg-main shr-font-bold shr-text-white',
          'forced-colors:shr-border-[Mark] forced-colors:shr-bg-[Mark]',
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
  const classNames = useMemo(() => {
    const { wrapper, counter, statusIcon } = classNameGenerator({
      status: typeof status === 'object' ? status.type : status,
      current,
    })

    return {
      wrapper: wrapper(),
      counter: counter(),
      statusIcon: statusIcon(),
    }
  }, [status, current])

  return (
    <span className={classNames.wrapper}>
      <span className={classNames.counter} aria-hidden>
        {stepNumber}
      </span>
      <StepStatusIcon status={status} className={classNames.statusIcon} />
    </span>
  )
}
