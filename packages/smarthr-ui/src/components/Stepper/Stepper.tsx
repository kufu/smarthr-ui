import { type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { HorizontalStepItem } from './HorizontalStepItem'
import { VerticalStepItem } from './VerticalStepItem'

import type {
  HorizontalStepper as HStepperProps,
  Step,
  VerticalStepper as VStepperProps,
} from './types'

type Props = HStepperProps | VStepperProps

const classNameGenerator = tv({
  base: ['smarthr-ui-Stepper', 'shr-list-none shr-my-0 shr-ps-0'],
  variants: {
    type: {
      // ステップ見出しの左右パディングをネガティブマージンで消し込んでいてる
      horizontal: 'shr-flex -shr-mx-0.75',
      vertical: '',
    },
  },
})

export const Stepper: FC<Props> = ({ type, steps, activeIndex, className, ...rest }) => {
  const isHorizontal = type === 'horizontal'
  const ItemComponent = isHorizontal ? HorizontalStepItem : VerticalStepItem

  const actualClassName = useMemo(() => classNameGenerator({ type, className }), [type, className])

  return (
    <ol {...rest} className={actualClassName}>
      {steps.map((step, index) => (
        <StepItem
          key={index}
          Component={ItemComponent}
          activeIndex={activeIndex}
          index={index}
          step={step}
          // 装飾上、horizontalの場合、前のステップが完了しているかどうかチェックする必要がある
          previousStepStatus={isHorizontal ? steps[index - 1]?.status : undefined}
        />
      ))}
    </ol>
  )
}

const StepItem: FC<
  Pick<Props, 'activeIndex'> & {
    Component: typeof HorizontalStepItem | typeof VerticalStepItem
    step: Step
    previousStepStatus: Step['status'] | undefined
    index: number
  }
> = ({ Component, step, previousStepStatus, index, activeIndex }) => {
  const isPrevStepCompleted = useMemo(() => {
    if (!previousStepStatus) return false

    const statusType =
      typeof previousStepStatus === 'object' ? previousStepStatus.type : previousStepStatus

    return statusType === 'completed'
  }, [previousStepStatus])

  return (
    <Component
      {...step}
      isPrevStepCompleted={isPrevStepCompleted}
      stepNumber={index + 1}
      current={index === activeIndex}
    />
  )
}
