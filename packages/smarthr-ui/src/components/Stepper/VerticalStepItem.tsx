import { type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Heading } from '../Heading'
import { Section } from '../SectioningContent'

import { StepCounter } from './StepCounter'

import type { VerticalStep } from './types'

type StatusType = 'completed' | 'closed'
type Props = Omit<VerticalStep, 'status'> & {
  statusType?: StatusType
  statusText?: string
  /** ステップ数 */
  stepNumber: number
  /** 現在地かどうか */
  current: boolean
}

const classNameGenerator = tv({
  slots: {
    wrapper: 'shr-group/stepItem',
    section: 'shr-flex shr-gap-1',
    // StepCounterの中心に揃えるため、0.25remとborder分の1px paddingを追加している
    headingWrapper: 'shr-flex shr-items-center shr-gap-1 shr-py-[calc(0.25rem_+_1px)]',
    heading: 'shr-inline-block',
    body: [
      // (stepCounter + :after) + (body > inner) という構造
      'shr-flex shr-grow shr-flex-col',
      'forced-colors:before:shr-bg-[ButtonBorder]',
    ],
    inner: 'shr-grow shr-pb-1.5 shr-pt-0.5',
    stepCounter: [
      // stepCounter の after 疑似要素がステップを繋ぐ線
      'after:shr-relative after:shr-mx-1 after:shr-block after:shr-h-full after:shr-w-[theme(borderWidth.2)] after:shr-bg-border after:shr-content-[""]',
      // 最後のステップの線を消す
      'group-last/stepItem:after:shr-bg-transparent',
    ],
  },
  variants: {
    statusType: {
      completed: {
        stepCounter: ['after:shr-bg-main', 'forced-colors:after:shr-bg-[Highlight]'],
      },
      closed: {},
    } satisfies Record<StatusType, object>,
    current: {
      true: {
        heading: 'shr-font-bold',
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      statusType: ['completed', 'closed'],
      current: false,
      className: {
        heading: 'shr-text-grey',
      },
    },
  ],
})

export const VerticalStepItem: FC<Props> = ({
  stepNumber,
  label,
  statusType,
  statusText,
  children,
  current,
}) => {
  const classNames = useMemo(() => {
    const { wrapper, section, headingWrapper, heading, body, inner, stepCounter } =
      classNameGenerator()

    return {
      wrapper: wrapper(),
      section: section(),
      headingWrapper: headingWrapper(),
      heading: heading({
        statusType,
        current,
      }),
      body: body(),
      inner: inner(),
      stepCounter: stepCounter({ statusType }),
    }
  }, [statusType, current])

  return (
    <li className={classNames.wrapper} aria-current={current ? 'step' : undefined}>
      <Section className={classNames.section}>
        <div className={classNames.stepCounter}>
          <StepCounter
            statusType={statusType}
            statusText={statusText}
            current={current}
            stepNumber={stepNumber}
          />
        </div>
        <div className={classNames.body}>
          <div className={classNames.headingWrapper}>
            <Heading type="sectionTitle" className={classNames.heading}>
              {label}
            </Heading>
          </div>
          <div className={classNames.inner}>{children}</div>
        </div>
      </Section>
    </li>
  )
}
