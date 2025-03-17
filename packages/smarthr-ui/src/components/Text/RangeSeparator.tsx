import React, { useMemo } from 'react'

import { type DecoratorsType, useDecorators } from '../../hooks/useDecorators'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

type Props = {
  decorators?: DecoratorsType<DecoratorKeyTypes>
}

const DECORATOR_DEFAULT_TEXTS = {
  text: '〜',
  visuallyHiddenText: 'から',
} as const
type DecoratorKeyTypes = keyof typeof DECORATOR_DEFAULT_TEXTS

export const RangeSeparator: React.FC<Props> = ({ decorators }) => {
  const decorated = useDecorators<DecoratorKeyTypes>(DECORATOR_DEFAULT_TEXTS, decorators)

  return (
    <>
      <span aria-hidden="true">{decorated.text}</span>
      <VisuallyHiddenText className="shr-select-none">
        {decorated.visuallyHiddenText}
      </VisuallyHiddenText>
    </>
  )
}
