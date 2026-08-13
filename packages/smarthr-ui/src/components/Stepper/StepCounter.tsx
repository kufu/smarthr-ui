import { type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { StepStatusIcon } from './StepStatusIcon'

type Props = {
  statusType?: 'completed' | 'closed'
  statusText?: string
  stepNumber?: number
  current: boolean
}

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

export const StepCounter: FC<Props> = ({ statusType, statusText, current, stepNumber }) => {
  const classNames = useMemo(() => {
    const { wrapper, counter, statusIcon } = classNameGenerator({
      status: statusType,
      current,
    })

    return {
      wrapper: wrapper(),
      counter: counter(),
      statusIcon: statusIcon(),
    }
  }, [statusType, current])

  return (
    <span className={classNames.wrapper}>
      <span className={classNames.counter} aria-hidden>
        {stepNumber}
      </span>
      <StepStatusIcon
        status={statusText ? { type: statusType!, text: statusText } : statusType}
        className={classNames.statusIcon}
      />
    </span>
  )
}
