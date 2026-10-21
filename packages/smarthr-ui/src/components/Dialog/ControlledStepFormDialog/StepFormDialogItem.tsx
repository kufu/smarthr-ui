'use client'

import { type FC, type PropsWithChildren, useContext } from 'react'

import { StepFormDialogContext } from './StepFormDialogProvider'

import type { StepItem } from './type'

type Props = PropsWithChildren<StepItem>

export const StepFormDialogItem: FC<Props> = ({ children, id }) => {
  const { currentStep } = useContext(StepFormDialogContext)

  if (currentStep.id !== id) return null

  return children
}
