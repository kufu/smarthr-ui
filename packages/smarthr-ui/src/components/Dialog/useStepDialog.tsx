import React, { Children, ReactNode, useCallback, useMemo, useRef, useState } from 'react'

import { Button } from '../Button'

import { FocusTrapRef } from './FocusTrap'

const NEXT_BUTTON_LABEL = '次へ'

export const useStepDialog = (children: ReactNode) => {
  const [activeStep, setActiveStep] = useState(0)
  const focusTrapRef = useRef<FocusTrapRef>(null)

  const childrenSteps = useMemo(() => {
    const steps: ReactNode[] = []
    Children.map(children, (child) => {
      steps.push(child)
    })
    return steps
  }, [children])

  const getActionText = (submitActionText: ReactNode) =>
    activeStep < childrenSteps.length - 1 ? NEXT_BUTTON_LABEL : submitActionText

  const handleNextSteps = useCallback(() => {
    if (activeStep + 1 === childrenSteps.length) {
      setActiveStep(0)
      return
    }
    focusTrapRef.current?.focus()
    setActiveStep((pre) => pre + 1)
  }, [activeStep, childrenSteps])

  const handleBackSteps = useCallback(() => {
    if (activeStep > 0) {
      focusTrapRef.current?.focus()
      setActiveStep((pre) => pre - 1)
    }
  }, [activeStep])

  const renderSubActionButton = useCallback(() => {
    if (activeStep === 0) {
      return null
    }
    return <Button onClick={handleBackSteps}>戻る</Button>
  }, [activeStep, handleBackSteps])

  const titleSuffix = useMemo(
    () => ` (${activeStep + 1}/${childrenSteps.length})`,
    [activeStep, childrenSteps],
  )

  return {
    focusTrapRef,
    activeStep,
    childrenSteps,
    titleSuffix,
    getActionText,
    handleNextSteps,
    renderSubActionButton,
  }
}
