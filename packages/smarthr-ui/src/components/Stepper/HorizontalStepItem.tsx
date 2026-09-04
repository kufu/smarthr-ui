import { memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Text } from '../Text'

import { StepCounter } from './StepCounter'

import type { HorizontalStep, StatusType } from './types'

type Props = Omit<HorizontalStep, 'status'> & {
  statusType?: StatusType
  statusText?: string
  /** ステップ数 */
  stepNumber: number
  /** 現在地かどうか */
  current: boolean
  /** 前のステップが完了しているかどうか */
  isPrevStepCompleted: boolean
}

const classNameGenerator = tv({
  slots: {
    wrapper: [
      'shr-group/stepItem',
      // 長いステップ名が来ても等幅にする
      'shr-flex-1',
    ],
    labelWrapper: 'shr-flex shr-flex-col shr-items-center shr-gap-0.5',
    stepCounterWrapper: 'shr-flex shr-items-center shr-self-stretch',
    beforeLine: [
      'group-first/stepItem:shr-bg-transparent',
      'shr-h-[theme(borderWidth.2)] shr-grow shr-bg-border',
      'forced-colors:shr-bg-[ButtonBorder]',
    ],
    afterLine: [
      'group-last/stepItem:shr-bg-transparent',
      // compoundSlots で書けるが、variants の上書きが複雑になるため切り出していない
      'shr-h-[theme(borderWidth.2)] shr-grow shr-bg-border',
      'forced-colors:shr-bg-[ButtonBorder]',
    ],
    label: 'shr-px-0.25 shr-text-center shr-text-sm',
  },
  variants: {
    statusType: {
      completed: {
        afterLine: ['shr-bg-main', 'forced-colors:shr-bg-[Highlight]'],
      },
      closed: {},
    } satisfies Record<StatusType, object>,
    current: {
      true: {
        label: 'shr-font-bold',
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
      statusType: ['completed', 'closed'],
      current: false,
      className: {
        label: 'shr-text-grey',
      },
    },
  ],
})

export const HorizontalStepItem = memo<Props>(
  ({ stepNumber, label, statusType, statusText, current, isPrevStepCompleted }) => {
    const classNames = useMemo(() => {
      const {
        wrapper,
        labelWrapper,
        stepCounterWrapper,
        beforeLine,
        afterLine,
        label: labelText,
      } = classNameGenerator()

      return {
        wrapper: wrapper(),
        labelWrapper: labelWrapper(),
        stepCounterWrapper: stepCounterWrapper(),
        beforeLine: beforeLine({ isPrevStepCompleted }),
        afterLine: afterLine({ statusType }),
        label: labelText({
          statusType,
          current,
        }),
      }
    }, [statusType, current, isPrevStepCompleted])

    return (
      <li className={classNames.wrapper} aria-current={current ? 'step' : undefined}>
        <div className={classNames.labelWrapper}>
          <div className={classNames.stepCounterWrapper}>
            <span className={classNames.beforeLine} />
            <StepCounter
              statusType={statusType}
              statusText={statusText}
              current={current}
              stepNumber={stepNumber}
            />
            <span className={classNames.afterLine} />
          </div>
          <Text styleType="sectionTitle" className={classNames.label}>
            {label}
          </Text>
        </div>
      </li>
    )
  },
)
