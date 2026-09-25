import type { StepItem } from './StepFormDialogProvider'
import type { ReactNode } from 'react'

export type ButtonThemeType = 'primary' | 'secondary' | 'danger'
type VariableFunctionType<T> = (currentStep: StepItem) => T

export type ButtonArgType =
  ReactNode | ((currentStep: StepItem, defaultText: ReactNode) => ReactNode)

export type ObjectButtonType = {
  text?: ButtonArgType
  /** ボタンを非表示にするかどうか */
  hidden?: boolean | VariableFunctionType<boolean>
  /** ボタンを無効にするかどうか */
  disabled?: boolean | VariableFunctionType<boolean>
  /** ボタンのスタイル */
  theme?: ButtonThemeType | VariableFunctionType<ButtonThemeType>
}

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
