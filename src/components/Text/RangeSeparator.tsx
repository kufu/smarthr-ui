import React, { ReactNode, useMemo } from 'react'

import { VisuallyHiddenText } from '../VisuallyHiddenText'

import type { DecoratorType, DecoratorsType } from '../../types'

type Props = {
  decorators?: DecoratorsType<'text' | 'visuallyHiddenText'>
}

const DEFAULT_TEXT = '〜'
const DEFAULT_VISUALLY_HIDDEN_TEXT = 'から'

const executeDecorator = (defaultText: string, decorator: DecoratorType | undefined) =>
  decorator?.(defaultText) || defaultText

export const RangeSeparator: React.FC<Props> = ({ decorators }) => {
  const text: ReactNode = useMemo(
    () => executeDecorator(DEFAULT_TEXT, decorators?.text),
    [decorators?.text],
  )
  const visuallyHiddenText: ReactNode = useMemo(
    () => executeDecorator(DEFAULT_VISUALLY_HIDDEN_TEXT, decorators?.visuallyHiddenText),
    [decorators?.visuallyHiddenText],
  )

  return (
    <>
      <span aria-hidden="true">{text}</span>
      <VisuallyHiddenText>{visuallyHiddenText}</VisuallyHiddenText>
    </>
  )
}
