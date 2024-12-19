import React, { ReactNode, createContext, useRef, useState } from 'react'

export type StepItem = {
  /** StepのID */
  id: string
  /** 何ステップ目か */
  stepNumber: number
}

type StepFormDialogContextType = {
  stepQueue: React.MutableRefObject<StepItem[]>
  currentStep: StepItem
}
export const StepFormDialogContext = createContext<StepFormDialogContextType>({
  stepQueue: { current: [] },
  currentStep: { id: '', stepNumber: 0 },
})

type StepFormDialogActionType = {
  setCurrentStep: (step: StepItem) => void
}
export const StepFormDialogActionContext = createContext<StepFormDialogActionType>({
  setCurrentStep: () => {},
})

type Props = {
  children: ReactNode
  firstStep: StepItem
}
export const StepFormDialogProvider: React.FC<Props> = ({ children, firstStep }) => {
  const [currentStep, setCurrentStep] = useState<StepItem>(firstStep)
  const stepQueue = useRef<StepItem[]>([firstStep])

  return (
    <StepFormDialogContext.Provider value={{ currentStep, stepQueue }}>
      <StepFormDialogActionContext.Provider value={{ setCurrentStep }}>
        {children}
      </StepFormDialogActionContext.Provider>
    </StepFormDialogContext.Provider>
  )
}
