import type { ReactNode } from 'react'

export type StepItem = {
  /** StepのID */
  id: string
  /** 何ステップ目か */
  stepNumber: number
}

export type ButtonThemeType = 'primary' | 'secondary' | 'danger'

/** useStepFormDialogButtonが返すボタンの実際の表示情報 */
export type CommonButtonType = {
  text: ReactNode
  theme?: ButtonThemeType
  disabled?: boolean
  hidden?: boolean
  functionCall: {
    text: boolean
  }
}
