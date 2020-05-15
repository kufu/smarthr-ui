# AccordionPanel

```tsx
import { BottomFixedArea } from 'smarthr-ui'

<BottomFixedArea
  description="This is description."
  primaryButton={<PrimaryButton>Primary Button</PrimaryButton>}
  secondaryButton={<SecondaryButton>Secondary Button</SecondaryButton>}
  tertiaryLinks={[{ text: 'tertiary_1', iconName: 'fa-trash', onClick: action('click_1') }]}
/>
```

## props

### AccordionPanel component

| Name            | Required | Type                                             | DefaultValue | Description                                                     |
| --------------- | -------- | ------------------------------------------------ | ------------ | --------------------------------------------------------------- |
| description     | -        | **ReactNode**                                    |              | description of this area.                                       |
| primaryButton   | -        | **PrimaryButton &#124; PrimaryButtonAnchor**     |              | This is for PrimaryButton or PrimaryButtonAnchor component.     |
| secondaryButton | -        | **SecondaryButton &#124; SecondaryButtonAnchor** |              | This is for SecondaryButton or SecondaryButtonAnchor component. |
| tertiaryLinks   | -        | **TertiaryLinks[]**                              |              | array of tertiaryLink props.                                    |

### tertiaryLink

| Name     | Required | Type                                                             | DefaultValue | Description                                                       |
| -------- | -------- | ---------------------------------------------------------------- | ------------ | ----------------------------------------------------------------- |
| test     | ✓        | **string**                                                       |              | The Text of tertiaryLink                                          |
| iconName | -        | **name Props of Icon component** <br> 'fa-trash', 'fa-sync', ... |              | Set the name of the icon to be displayed next to the button text. |
| onClick  | ✓        | **(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void** |              | Fired when the tertiaryLink is clicked                            |
