import React, { ComponentProps, HTMLAttributes, ReactElement, ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'
import { Heading } from '../Heading'
import { RadioButton } from '../RadioButton'
import { CheckBox } from '../CheckBox'
import { Cluster, Stack } from '../Layout'

type Item =
  | ReactElement<ComponentProps<typeof RadioButton>>
  | ReactElement<ComponentProps<typeof CheckBox>>
type Items = Item | Item[]
type Props = {
  legend?: ReactNode
  titleType?: ComponentProps<typeof Heading>['type']
  disabled?: boolean
  children: Items
  background?: 'BACKGROUND' | 'OVER_BACKGROUND' | 'none'
}
type ElementProps = Omit<HTMLAttributes<HTMLFieldSetElement>, keyof Props>

export const NewFieldset: VFC<Props & ElementProps> = ({
  legend,
  titleType = 'blockTitle',
  children,
  disabled,
  background = 'BACKGROUND',
}) => {
  const theme = useTheme()

  return (
    <StackFieldset gap="XXS">
      {legend && (
        <Heading type={titleType} tag="legend" style={{ padding: '0' }}>
          {legend}
        </Heading>
      )}
      <StyledCluster background={background} themes={theme} gap={{ row: 'XS', column: 'S' }}>
        {React.Children.map(children, (item) => (
          <item.type disabled={disabled} {...item.props} />
        ))}
      </StyledCluster>
    </StackFieldset>
  )
}

const StackFieldset = styled(Stack).attrs({
  as: 'fieldset',
})`
  border: 0;
  padding: 0;
`

const StyledCluster = styled(Cluster)<{
  themes: Theme
  background: Required<ComponentProps<typeof NewFieldset>>['background']
}>(
  ({ themes: { color, spacing }, background }) => css`
    ${background !== 'none' &&
    css`
      background-color: ${color[background]};
      padding: ${spacing.S};
    `}
  `,
)
