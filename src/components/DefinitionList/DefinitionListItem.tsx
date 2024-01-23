import React, { FC, HTMLAttributes, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { Stack } from '../Layout'
import { Text } from '../Text'

import { useClassNames } from './useClassNames'

type DefinitionListItemProps = {
  term: ReactNode
  description?: ReactNode
  fullWidth?: boolean
  className?: string
}
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof DefinitionListItemProps>

export const DefinitionListItem: FC<DefinitionListItemProps & ElementProps> = ({
  term,
  description,
  className = '',
}) => {
  const theme = useTheme()
  const { definitionListItem } = useClassNames()

  return (
    <StyledStack themes={theme} className={`${className} ${definitionListItem.wrapper}`}>
      <TermText className={definitionListItem.term}>{term}</TermText>
      <DescriptionText themes={theme} className={definitionListItem.description}>
        {description}
      </DescriptionText>
    </StyledStack>
  )
}

const StyledStack = styled(Stack).attrs({ gap: 0.25 })<{ themes: Theme }>`
  ${({ themes: { border } }) => css`
    border-bottom: ${border.shorthand};
    border-bottom-style: dotted;

    @media (prefers-contrast: more) {
      & {
        border-bottom: ${border.highContrast};
      }
    }
  `}
`

const TermText = styled(Text).attrs({
  forwardedAs: 'dt',
  size: 'S',
  weight: 'bold',
  color: 'TEXT_GREY',
  leading: 'TIGHT',
})``

const DescriptionText = styled(Text).attrs({
  forwardedAs: 'dd',
  size: 'M',
  color: 'TEXT_BLACK',
  leading: 'NORMAL',
})<{ themes: Theme }>`
  ${({ themes: { leading, space } }) => css`
    margin-inline-start: initial;
    padding-bottom: ${space(0.25)};
    min-height: ${leading.NORMAL}em;
  `}
`
