import { Primary, Secondary } from './BottomFixedArea'

export const validateElement = (primary?: Primary, secondary?: Secondary) => {
  if (primary) {
    const { displayName } = primary.type
    if (displayName !== 'PrimaryButton' && displayName !== 'PrimaryButtonAnchor') {
      throw new Error(
        'SmartHR UI: the primaryButton props accepts PrimaryButton or PrimaryButtonAnchor component',
      )
    }
  }
  if (secondary) {
    const { displayName } = secondary.type
    if (displayName !== 'SecondaryButton' && displayName !== 'SecondaryButtonAnchor') {
      throw new Error(
        'SmartHR UI: the secondaryButton props accepts SecondaryButton or SecondaryButtonAnchor component',
      )
    }
  }
}
