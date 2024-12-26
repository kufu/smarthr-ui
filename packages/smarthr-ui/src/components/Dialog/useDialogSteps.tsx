import React, { useCallback, useEffect, useRef, useState } from 'react'

type UseDialogStepsResult = [
  number,
  {
    setStep: React.Dispatch<React.SetStateAction<number>>
    nextStep: () => void
    prevStep: () => void
  },
]

export function useDialogSteps(startStep?: number): UseDialogStepsResult {
  const [step, setStep] = useState<number>(startStep || 0)
  const prevStep = useRef<number>(step)

  useEffect(() => {
    if (step !== prevStep.current && step > 0) {
      const focusTarget = document.querySelector('[role=dialog] > div > div[tabindex]')
      if (focusTarget instanceof HTMLDivElement) {
        focusTarget.focus()
      }
    }

    prevStep.current = step
  }, [step])

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
  ]

  return dialogSteps
}
