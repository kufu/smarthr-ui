import React, { useCallback, useEffect, useRef, useState } from 'react'

type UseDialogStepsResult = [
  number,
  {
    setStep: React.Dispatch<React.SetStateAction<number>>
    nextStep: () => void
    prevStep: () => void
  },
  () => React.JSX.Element,
]

export function useDialogSteps(startStep?: number): UseDialogStepsResult {
  const [step, setStep] = useState<number>(startStep || 0)
  const dialogContentStartElementRef = useRef<HTMLDivElement | null>(null)
  const prevStep = useRef<number>(step)

  useEffect(() => {
    if (
      step !== prevStep.current &&
      step > 0 &&
      dialogContentStartElementRef.current instanceof HTMLElement
    ) {
      dialogContentStartElementRef.current.focus()
    }

    prevStep.current = step
  }, [step])

  const renderFocusTarget = () => <div tabIndex={-1} ref={dialogContentStartElementRef} />

  const dialogSteps: UseDialogStepsResult = [
    step,
    {
      setStep,
      nextStep: useCallback(() => {
        setStep((prev) => prev + 1)
      }, []),
      prevStep: useCallback(() => {
        setStep((prev) => prev - 1)
      }, []),
    },
    renderFocusTarget,
  ]

  return dialogSteps
}
