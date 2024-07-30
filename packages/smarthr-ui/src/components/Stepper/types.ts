import type { ComponentPropsWithoutRef, PropsWithChildren, ReactNode } from 'react'

type PropsWithBase<P> = P & {
  /** 現在地。0始まり。 */
  activeIndex?: number
} & Omit<ComponentPropsWithoutRef<'ol'>, keyof P>

export type Step = {
  /** ステップラベル */
  label: ReactNode
  /** 状態 */
  status?:
    | 'completed'
    | 'closed'
    | {
        type: 'completed' | 'closed'
        text: string
      }
  /** 現在地かどうか */
  current?: boolean
  /** ステップ数 */
  stepNumber?: number
}

export type VerticalStep = PropsWithChildren<Step>

export type HorizontalStep = Step & {
  /** 前のステップが完了しているかどうか */
  isPrevStepCompleted?: boolean
}

export type VerticalStepper = PropsWithBase<{
  type: 'vertical'
  /** type=vertical では子要素を持てる */
  steps: VerticalStep[]
}>

export type HorizontalStepper = PropsWithBase<{
  type: 'horizontal'
  steps: HorizontalStep[]
}>
