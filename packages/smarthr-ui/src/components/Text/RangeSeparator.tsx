import React, { useMemo } from 'react'

import { type DecoratorType, type DecoratorsType } from '../../hooks/useDecorators'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

type Props = {
  decorators?: DecoratorsType<'text' | 'visuallyHiddenText'>
}

const DEFAULT_TEXT = '〜'
const DEFAULT_VISUALLY_HIDDEN_TEXT = 'から'

const executeDecorator = (defaultText: string, decorator: DecoratorType | undefined) =>
  decorator?.(defaultText) || defaultText

export const RangeSeparator: React.FC<Props> = ({ decorators }) => {
  const decorated = useMemo(() => {
    if (!decorators) {
      return {
        text: DEFAULT_TEXT,
        visuallyHiddenText: DEFAULT_VISUALLY_HIDDEN_TEXT,
      }
    }

    return {
      text: executeDecorator(DEFAULT_TEXT, decorators.text),
      visuallyHiddenText: executeDecorator(
        DEFAULT_VISUALLY_HIDDEN_TEXT,
        decorators.visuallyHiddenText,
      ),
    }
  }, [decorators])

  return (
    <>
      <span aria-hidden="true">{decorated.text}</span>
      <VisuallyHiddenText>{decorated.visuallyHiddenText}</VisuallyHiddenText>
    </>
  )
}
