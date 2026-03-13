import { type ReactNode, useMemo } from 'react'

import { useObjectAttributes } from '../../../hooks/useObjectAttributes'

import type { StepItem } from './StepFormDialogProvider'

type ButtonThemeType = 'primary' | 'secondary' | 'danger'
export type ButtonArgType =
  | ReactNode
  | ((currentStep: StepItem, defaultText: ReactNode) => ReactNode)
type VariableFunctionType<T> = (currentStep: StepItem) => T
export type ObjectButtonType = {
  text: ButtonArgType
  /** ボタンを非表示にするかどうか */
  hidden?: boolean | VariableFunctionType<boolean>
  /** ボタンを無効にするかどうか */
  disabled?: boolean | VariableFunctionType<boolean>
  /** ボタンのスタイル */
  theme?: ButtonThemeType | VariableFunctionType<ButtonThemeType>
}

const buttonObjectConverter = (text: ButtonArgType): ObjectButtonType => ({
  text,
})

type Props = {
  button: ButtonArgType | ObjectButtonType
  currentStep: StepItem
  defaultValues: {
    text: ReactNode
    theme?: ButtonThemeType
  }
}

export const useStepFormDialogButton = ({
  button,
  currentStep,
  defaultValues: { text: defaultText, theme: defaultTheme },
}: Props) => {
  const temp = useObjectAttributes<ButtonArgType | ObjectButtonType, ObjectButtonType>(
    button,
    buttonObjectConverter,
  )

  const actualButton = useMemo(() => {
    let text = temp.text || defaultText
    let textFunc = false

    if (typeof text === 'function') {
      textFunc = true
      text = text(currentStep, defaultText)
    }

    const tempTheme = temp.theme || defaultTheme
    const theme = typeof tempTheme === 'function' ? tempTheme(currentStep) : tempTheme
    const disabled =
      typeof temp.disabled === 'function' ? temp.disabled(currentStep) : temp.disabled
    const hidden = typeof temp.hidden === 'function' ? temp.hidden(currentStep) : temp.hidden

    return {
      text,
      theme,
      disabled,
      hidden,
      functionCall: {
        text: textFunc,
      },
    }
  }, [currentStep, temp, defaultText, defaultTheme])

  return actualButton
}
