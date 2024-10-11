import { Children, ReactNode, useCallback, useMemo, useRef, useState, useTransition } from 'react'

import { FocusTrapRef } from '../FocusTrap'

export const useStepDialog = (children: ReactNode) => {
  const [activeStep, setActiveStep] = useState(0)
  const focusTrapRef = useRef<FocusTrapRef>(null)
  const [_, startTransition] = useTransition()

  const childrenSteps = useMemo(() => {
    const steps: ReactNode[] = []
    Children.map(children, (child) => {
      steps.push(child)
    })
    return steps
  }, [children])

  const onSubmit = useCallback(() => {
    setActiveStep(0)
  }, [])

  const onNextSteps = useCallback(() => {
    focusTrapRef.current?.focus()
    startTransition(() => setActiveStep((pre) => pre + 1))
  }, [])

  const onBackSteps = useCallback(() => {
    if (activeStep > 0) {
      focusTrapRef.current?.focus()
      setActiveStep((pre) => pre - 1)
    }
  }, [activeStep])

  return {
    focusTrapRef,
    activeStep,
    childrenSteps,
    onSubmit,
    onNextSteps,
    onBackSteps,
  }
}
