import React, { useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { HorizontalStepItem } from './HorizontalStepItem'
import { VerticalStepItem } from './VerticalStepItem'

import type {
  HorizontalStepper as HStepperProps,
  Step,
  VerticalStepper as VStepperProps,
} from './types'
import type { FC } from 'react'

type Props = HStepperProps | VStepperProps

const stepper = tv({
  base: ['smarthr-ui-Stepper', 'shr-list-none shr-my-0 shr-ps-0'],
  variants: {
    type: {
      // ステップ見出しの左右パディングをネガティブマージンで消し込んでいてる
      horizontal: 'shr-flex -shr-mx-0.75',
      vertical: '',
    },
  },
})

const isStepCompleted = (step: Step | undefined) => {
  if (!step) return false

  const { status } = step
  const statusType = typeof status === 'object' ? status.type : status
  return statusType === 'completed'
}

export const Stepper: FC<Props> = ({ type, steps, activeIndex, className, ...rest }) => {
  const style = stepper({ type, className })

  return (
    <ol {...rest} className={style}>
      {steps.map((step, index) => (
        <StepItem
          key={index}
          type={type}
          activeIndex={activeIndex}
          index={index}
          step={step}
          previousStep={steps[index - 1]}
        />
      ))}
    </ol>
  )
}

const StepItem: FC<
  Pick<Props, 'activeIndex' | 'type'> & {
    step: Step
    previousStep: Step | undefined
    index: number
  }
> = ({ Component, step, index, activeIndex, type }) => {
  const Component = useMemo(() => {
    switch (type) {
      case 'horizontal':
        return HorizontalStepItem
      case 'vertical':
        return VerticalStepItem
    }
  }, [type])

  const stepItemProps = {
    ...step,
    stepNumber: index + 1,
    current: index === activeIndex,
    ...(type === 'horizontal'
      ? // 装飾上、前のステップが完了しているかどうかが必要
        { isPrevStepCompleted: isStepCompleted(previousStep) }
      : {}),
  }

  return <Component {...stepItemProps} />
}
