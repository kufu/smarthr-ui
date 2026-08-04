import type { ComponentPropsWithoutRef, PropsWithChildren, ReactNode } from 'react'

type BaseProps<P> = P & {
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
}

export type VerticalStep = PropsWithChildren<Step>

export type HorizontalStep = Step

export type VerticalStepper = BaseProps<{
  type: 'vertical'
  /** type=vertical では子要素を持てる */
  steps: VerticalStep[]
}>

export type HorizontalStepper = BaseProps<{
  type: 'horizontal'
  steps: HorizontalStep[]
}>
