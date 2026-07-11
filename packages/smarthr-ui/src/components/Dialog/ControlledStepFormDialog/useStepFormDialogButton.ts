import { type ComponentPropsWithoutRef, type ReactNode, useMemo } from 'react'

import { useObjectAttributes } from '../../../hooks/useObjectAttributes'

import type { StepItem } from './StepFormDialogProvider'
import type { Button } from '../../Button'

type ButtonThemeType = 'primary' | 'secondary' | 'danger'
export type ButtonArgType =
  | ReactNode
  | ((currentStep: StepItem, defaultText: ReactNode) => ReactNode)
type VariableFunctionType<T> = (currentStep: StepItem) => T
export type ObjectButtonType = Omit<
  ComponentPropsWithoutRef<typeof Button>,
  'children' | 'hidden' | 'disabled' | 'variant'
> & {
  /** ボタンの内容（関数も可） */
  children?: ButtonArgType
  /** ボタンを非表示にするかどうか */
  hidden?: boolean | VariableFunctionType<boolean>
  /** ボタンを無効にするかどうか */
  disabled?: boolean | VariableFunctionType<boolean>
  /** ボタンのスタイル */
  theme?: ButtonThemeType | VariableFunctionType<ButtonThemeType>
}

const buttonObjectConverter = (children: ButtonArgType): ObjectButtonType => ({
  children,
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
    let children = temp.children ?? defaultText
    let childrenFunc = false

    if (typeof children === 'function') {
      childrenFunc = true
      children = children(currentStep, defaultText)
    }

    const tempTheme = temp.theme || defaultTheme
    const theme = typeof tempTheme === 'function' ? tempTheme(currentStep) : tempTheme
    const disabled =
      typeof temp.disabled === 'function' ? temp.disabled(currentStep) : temp.disabled
    const hidden = typeof temp.hidden === 'function' ? temp.hidden(currentStep) : temp.hidden

    // children, theme, disabled, hidden以外のpropsを抽出

    const {
      children: _children,
      theme: _theme,
      disabled: _disabled,
      hidden: _hidden,
      ...rest
    } = temp

    return {
      ...rest,
      children,
      theme,
      disabled,
      hidden,
      functionCall: {
        children: childrenFunc,
      },
    }
  }, [currentStep, temp, defaultText, defaultTheme])

  return actualButton
}
