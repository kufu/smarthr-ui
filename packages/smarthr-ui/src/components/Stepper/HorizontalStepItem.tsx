import React, { type FC } from 'react'
import { tv } from 'tailwind-variants'

import { Heading } from '../Heading'
import { SectioningFragment } from '../SectioningContent/SectioningContent'

import { StepCounter } from './StepCounter'

import type { HorizontalStep } from './types'

const horizontalStepItem = tv({
  slots: {
    wrapper: [
      'shr-group/stepItem',
      // 長いステップ名が来ても等幅にする
      'shr-flex-1',
    ],
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
    heading: 'shr-px-0.25 shr-text-sm shr-text-center',
  },
  variants: {
    status: {
      completed: {
        afterLine: ['shr-bg-main', 'forced-colors:shr-bg-[Highlight]'],
      },
      closed: {},
    },
    current: {
      true: {
        heading: 'shr-font-bold',
      },
      false: {},
    },
    isPrevStepCompleted: {
      true: {
        beforeLine: ['shr-bg-main', 'forced-colors:shr-bg-[Highlight]'],
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

type Props = HorizontalStep & {
  /** ステップ数 */
  stepNumber?: number
  /** 現在地かどうか */
  current: boolean
  /** 前のステップが完了しているかどうか */
  isPrevStepCompleted?: boolean
}

export const HorizontalStepItem: FC<Props> = ({
  stepNumber,
  label,
  status,
  current,
  isPrevStepCompleted,
}) => {
  const statusType = typeof status === 'object' ? status.type : status
  const { wrapper, headingWrapper, stepCounterWrapper, beforeLine, afterLine, heading } =
    horizontalStepItem({
      status: statusType,
      current,
      isPrevStepCompleted,
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
