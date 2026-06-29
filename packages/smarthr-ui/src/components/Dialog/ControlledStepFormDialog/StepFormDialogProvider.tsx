'use client'

import {
  type FC,
  type MutableRefObject,
  type ReactNode,
  type RefObject,
  createContext,
  useRef,
  useState,
} from 'react'

export type StepItem = {
  /** StepのID */
  id: string
  /** 何ステップ目か */
  stepNumber: number
}

type StepFormDialogContextType = {
  stepQueueRef: MutableRefObject<StepItem[]>
  currentStep: StepItem
  setCurrentStep: (step: StepItem) => void
  scrollerRef: RefObject<HTMLDivElement>
}
export const StepFormDialogContext = createContext<StepFormDialogContextType>({
  stepQueueRef: { current: [] },
  currentStep: { id: '', stepNumber: 0 },
  setCurrentStep: () => {},
  scrollerRef: { current: null },
})

type Props = {
  children: ReactNode
  firstStep: StepItem
}
export const StepFormDialogProvider: FC<Props> = ({ children, firstStep }) => {
  const [currentStep, setCurrentStep] = useState<StepItem>(firstStep)
  const stepQueueRef = useRef<StepItem[]>([])
  const scrollerRef = useRef<HTMLDivElement>(null)

  return (
    <StepFormDialogContext.Provider
      value={{ currentStep, stepQueueRef, setCurrentStep, scrollerRef }}
    >
      {children}
    </StepFormDialogContext.Provider>
  )
}
