import React, { FC, ReactNode, useEffect } from 'react'
import { Base as BaseComponent } from '../Base'
import {
  PrimaryButton,
  PrimaryButtonAnchor,
  SecondaryButton,
  SecondaryButtonAnchor,
} from '../Button'
import { TertiaryLink } from './TertiaryLink'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'

type Props = {
  description?: ReactNode
  primaryButton?:
    | React.FunctionComponentElement<React.ComponentProps<typeof PrimaryButton>>
    | React.FunctionComponentElement<React.ComponentProps<typeof PrimaryButtonAnchor>>
  secondaryButton?:
    | React.FunctionComponentElement<React.ComponentProps<typeof SecondaryButton>>
    | React.FunctionComponentElement<React.ComponentProps<typeof SecondaryButtonAnchor>>
  tertiaryLinks?: Array<React.ComponentProps<typeof TertiaryLink>>
  className?: string
}

export const BottomFixedArea: FC<Props> = props => {
  const theme = useTheme()
  const { description, primaryButton, secondaryButton, tertiaryLinks } = props

  useEffect(() => {
    if (primaryButton) {
      const { displayName } = primaryButton.type
      if (displayName !== 'PrimaryButton' && displayName !== 'PrimaryButtonAnchor') {
        console.error(
          'Invalid element Error. Set PrimaryButton or PrimaryButtonAnchor component instead of invalid element.',
        )
      }
    }
    if (secondaryButton) {
      const { displayName } = secondaryButton.type
      if (displayName !== 'SecondaryButton' && displayName !== 'SecondaryButtonAnchor') {
        console.error(
          'Invalid element Error. Set SecondaryButton or SecondaryButtonAnchor component instead of invalid element.',
        )
      }
    }
  }, [primaryButton, secondaryButton])

  return (
    <Base themes={theme}>
      {description && <Text>{description}</Text>}
      <ButtonList themes={theme}>
        {secondaryButton && <li>{secondaryButton}</li>}
        {primaryButton && <li>{primaryButton}</li>}
      </ButtonList>
      {tertiaryLinks && tertiaryLinks.length > 0 && (
        <TertiaryList themes={theme}>
          {tertiaryLinks.map((tertiaryLink, index) => (
            <li key={index}>
              <TertiaryLink {...tertiaryLink} />
            </li>
          ))}
        </TertiaryList>
      )}
    </Base>
  )
}

const Base = styled(BaseComponent)<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size
    return css`
      text-align: center;
      display: flex;
      flex-direction: column;
      padding: ${pxToRem(space.S)};
    `
  }}
`

const Text = styled.p`
  margin: 0;
`
const ButtonList = styled.ul<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size
    return css`
      margin: ${pxToRem(space.XS)} 0 0 0;
      padding: 0;
      display: flex;
      justify-content: center;

      > li {
        list-style: none;
        margin-right: ${pxToRem(space.XS)};

        &:last-of-type {
          margin-right: 0;
        }
      }
    `
  }}
`
const TertiaryList = styled.ul<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size

    return css`
      margin: ${pxToRem(space.XS)} 0 0 0;
      padding: 0;
      display: flex;
      justify-content: center;

      > li {
        list-style: none;
        margin-right: ${pxToRem(space.XS)};

        &:last-of-type {
          margin-right: 0;
        }
      }
    `
  }}
`
