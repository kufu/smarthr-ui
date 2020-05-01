import React, { FC, ReactNode, useEffect } from 'react'
import { Base } from '../Base'
import {
  PrimaryButton,
  PrimaryButtonAnchor,
  SecondaryButton,
  SecondaryButtonAnchor,
} from '../Button'
import { TertiaryLink } from './TertiaryLink'

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
  const { description, primaryButton, secondaryButton, tertiaryLinks } = props

  useEffect(() => {
    console.log(primaryButton)
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
    <Base>
      {description && <p>{description}</p>}
      <ul>
        {secondaryButton && <li>{secondaryButton}</li>}
        {primaryButton && <li>{primaryButton}</li>}
      </ul>
      {tertiaryLinks && tertiaryLinks.length > 0 && (
        <ul>
          {tertiaryLinks.map((tertiaryLink, index) => (
            <li key={index}>
              <TertiaryLink {...tertiaryLink} />
            </li>
          ))}
        </ul>
      )}
    </Base>
  )
}
