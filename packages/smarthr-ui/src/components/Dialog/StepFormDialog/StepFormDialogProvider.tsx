'use client'

import React, { type ReactNode, createContext, useRef, useState } from 'react'

export type StepItem = {
  /** StepのID */
  id: string
  /** 何ステップ目か */
  stepNumber: number
}

type StepFormDialogContextType = {
  stepQueue: React.MutableRefObject<StepItem[]>
  currentStep: StepItem
  setCurrentStep: (step: StepItem) => void
}
export const StepFormDialogContext = createContext<StepFormDialogContextType>({
  stepQueue: { current: [] },
  currentStep: { id: '', stepNumber: 0 },
  setCurrentStep: () => {},
})

type Props = {
  children: ReactNode
  firstStep: StepItem
}
export const StepFormDialogProvider: React.FC<Props> = ({ children, firstStep }) => {
  const [currentStep, setCurrentStep] = useState<StepItem>(firstStep)
  const stepQueue = useRef<StepItem[]>([])

  return (
    <StepFormDialogContext.Provider value={{ currentStep, stepQueue, setCurrentStep }}>
      {children}
    </StepFormDialogContext.Provider>
  )
}
