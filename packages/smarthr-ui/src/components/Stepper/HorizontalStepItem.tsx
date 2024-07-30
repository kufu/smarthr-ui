import React, { type FC } from 'react'
import { tv } from 'tailwind-variants'

import { Heading } from '../Heading'
import { SectioningFragment } from '../SectioningContent/SectioningContent'

import { StepCounter } from './StepCounter'

import type { HorizontalStep } from './types'

const horizontallStepItem = tv({
  slots: {
    wrapper: 'shr-group/stepItem',
    headingWrapper: 'shr-flex shr-flex-col shr-items-center shr-gap-0.5',
    stepCounterWrapper: 'shr-self-stretch shr-flex shr-items-center',
    beforeLine: [
      'group-first/stepItem:shr-bg-transparent',
      'shr-grow shr-h-[theme(borderWidth.2)] shr-bg-border',
      'forced-colors:shr-bg-[ButtonBorder]',
    ],
    afterLine: [
      'group-last/stepItem:shr-bg-transparent',
      // compoundSlots で書けるが、variants の上書きが複雑になるため切り出していない
      'shr-grow shr-h-[theme(borderWidth.2)] shr-bg-border',
      'forced-colors:shr-bg-[ButtonBorder]',
    ],
    heading: 'shr-px-0.75 shr-text-sm',
  },
  variants: {
    status: {
      completed: {
        beforeLine: ['shr-bg-main', 'forced-colors:shr-bg-[Highlight]'],
      },
      closed: {},
    },
    current: {
      true: {
        heading: 'shr-font-bold',
      },
      false: {},
    },
    isNextStepCompleted: {
      true: {
        afterLine: ['shr-bg-main', 'forced-colors:shr-bg-[Highlight]'],
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      status: ['completed', 'closed'],
      current: false,
      className: {
        heading: 'shr-text-grey',
      },
    },
  ],
})

export const HorizontalStepItem: FC<HorizontalStep> = ({
  stepNumber,
  label,
  status,
  current,
  isNextStepCompleted,
}) => {
  const statusType = typeof status === 'object' ? status.type : status
  const { wrapper, headingWrapper, stepCounterWrapper, beforeLine, afterLine, heading } =
    horizontallStepItem({
      status: statusType,
      current,
      isNextStepCompleted,
    })

  return (
    <li aria-current={current} className={wrapper()}>
      <SectioningFragment>
        <div className={headingWrapper()}>
          <div className={stepCounterWrapper()}>
            <span className={beforeLine()} />
            <StepCounter status={status} current={current} stepNumber={stepNumber} />
            <span className={afterLine()} />
          </div>
          <Heading type="sectionTitle" className={heading()}>
            {label}
          </Heading>
        </div>
      </SectioningFragment>
    </li>
  )
}
