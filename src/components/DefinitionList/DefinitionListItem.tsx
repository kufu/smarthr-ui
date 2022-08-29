import React, { FC, HTMLAttributes, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

import { Text } from '../Text'
import { Stack } from '../Layout'

export type DefinitionListItemProps = {
  term: ReactNode
  description?: ReactNode
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
    <Stack gap={0.25} className={`${className} ${definitionListItem.wrapper}`}>
      <Term className={definitionListItem.term}>{term}</Term>
      <Description themes={theme} className={definitionListItem.description}>
        {description}
      </Description>
    </Stack>
  )
}

const Term = styled(Text).attrs({
  forwardedAs: 'dt',
  size: 'S',
  weight: 'bold',
  color: 'TEXT_GREY',
  leading: 'TIGHT',
})``

const Description = styled(Text).attrs({
  forwardedAs: 'dd',
  size: 'M',
  color: 'TEXT_BLACK',
  leading: 'NORMAL',
})<{ themes: Theme }>`
  ${({ themes: { border, leading, space } }) => css`
    margin-inline-start: initial;
    padding-bottom: ${space(0.25)};
    border-bottom: ${border.shorthand};
    border-bottom-style: dotted;
    min-height: ${leading.NORMAL}em;
  `}
`
