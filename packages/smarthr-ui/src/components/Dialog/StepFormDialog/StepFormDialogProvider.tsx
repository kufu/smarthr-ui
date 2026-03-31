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
  stepQueue: MutableRefObject<StepItem[]>
  currentStep: StepItem
  setCurrentStep: (step: StepItem) => void
  scrollerRef: RefObject<HTMLDivElement>
}
export const StepFormDialogContext = createContext<StepFormDialogContextType>({
  stepQueue: { current: [] },
  currentStep: { id: '', stepNumber: 0 },
  setCurrentStep: () => {},
  scrollerRef: { current: null },
})

type Props = {
  children: ReactNode
  firstStep: StepItem
  isOpen: boolean
}
export const StepFormDialogProvider: FC<Props> = ({ children, firstStep, isOpen }) => {
  const [currentStep, setCurrentStep] = useState<StepItem>(firstStep)
  const stepQueue = useRef<StepItem[]>([])
  const scrollerRef = useRef<HTMLDivElement>(null)
  const prevIsOpen = useRef(isOpen)

  // ダイアログが閉じたときにリセット
  if (prevIsOpen.current && !isOpen) {
    setTimeout(() => {
      stepQueue.current = []
      setCurrentStep(firstStep)
    }, 300)
  }
  prevIsOpen.current = isOpen

  return (
    <StepFormDialogContext.Provider value={{ currentStep, stepQueue, setCurrentStep, scrollerRef }}>
      {children}
    </StepFormDialogContext.Provider>
  )
}
