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
  const ActualStepItem = useMemo(() => {
    switch (type) {
      case 'horizontal':
        return HorizontalStepItem
      case 'vertical':
        return VerticalStepItem
    }
  }, [type])
  const style = stepper({ type, className })

  return (
    <ol {...rest} className={style}>
      {steps.map((step, id) => {
        const stepItemProps = {
          ...step,
          stepNumber: id + 1,
          current: id === activeIndex,
          ...(type === 'horizontal'
            ? // 装飾上、前のステップが完了しているかどうかが必要
              { isPrevStepCompleted: isStepCompleted(steps[id - 1]) }
            : {}),
        }
        return <ActualStepItem {...stepItemProps} key={id} />
      })}
    </ol>
  )
}
