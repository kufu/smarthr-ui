import { type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Heading } from '../Heading'
import { Sidebar } from '../Layout'
import { Section } from '../SectioningContent/SectioningContent'

import { StepCounter } from './StepCounter'

import type { VerticalStep } from './types'

const classNameGenerator = tv({
  slots: {
    wrapper: 'shr-group/stepItem',
    // StepCounterの中心に揃えるため、0.25remとborder分の1px paddingを追加している
    headingWrapper: 'shr-flex shr-items-center shr-gap-1 shr-py-[calc(0.25rem_+_1px)]',
    heading: 'shr-inline-block',
    body: [
      // (stepCounter + :after) + (body > inner) という構造
      'shr-flex shr-flex-col',
      'forced-colors:before:shr-bg-[ButtonBorder]',
    ],
    inner: 'shr-grow shr-pt-0.5 shr-pb-1.5',
    stepCounter: [
      // stepCounter の after 疑似要素がステップを繋ぐ線
      'after:shr-block after:shr-content-[""] after:shr-relative after:shr-mx-1 after:shr-bg-border after:shr-w-[theme(borderWidth.2)] after:shr-h-full',
      // 最後のステップの線を消す
      'group-last/stepItem:after:shr-bg-transparent',
    ],
  },
  variants: {
    status: {
      completed: {
        stepCounter: ['after:shr-bg-main', 'forced-colors:after:shr-bg-[Highlight]'],
      },
      closed: {},
    },
    current: {
      true: {
        heading: 'shr-font-bold',
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

type Props = VerticalStep & {
  /** ステップ数 */
  stepNumber: number
  /** 現在地かどうか */
  current: boolean
}

export const VerticalStepItem: FC<Props> = ({ stepNumber, label, status, children, current }) => {
  const classNames = useMemo(() => {
    const { wrapper, headingWrapper, heading, body, inner, stepCounter } = classNameGenerator({
      status: typeof status === 'object' ? status.type : status,
      current,
    })

    return {
      wrapper: wrapper(),
      headingWrapper: headingWrapper(),
      heading: heading(),
      body: body(),
      inner: inner(),
      stepCounter: stepCounter(),
    }
  }, [current, status])

  return (
    <li aria-current={current ? 'step' : undefined} className={classNames.wrapper}>
      <Section>
        <Sidebar>
          <div className={classNames.stepCounter}>
            <StepCounter status={status} current={current} stepNumber={stepNumber} />
          </div>
          <div className={classNames.body}>
            <div className={classNames.headingWrapper}>
              <Heading type="sectionTitle" className={classNames.heading}>
                {label}
              </Heading>
            </div>
            <div className={classNames.inner}>{children}</div>
          </div>
        </Sidebar>
      </Section>
    </li>
  )
}
