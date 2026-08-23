import { type ReactNode, useMemo } from 'react'

import { useObjectAttributes } from '../../../hooks/useObjectAttributes'

import type { StepItem } from './StepFormDialogProvider'
import type { ButtonArgType, ButtonThemeType, CommonButtonType, ObjectButtonType } from './type'

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
}: Props): CommonButtonType => {
  const temp = useObjectAttributes<ButtonArgType | ObjectButtonType, ObjectButtonType>(
    button,
    buttonObjectConverter,
  )

  const actualButton = useMemo((): CommonButtonType => {
    let text = temp.text ?? defaultText
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
