# BottomFixedArea

```tsx
import { BottomFixedArea, FaTrashIcon } from 'smarthr-ui'

;<BottomFixedArea
  description="This is description."
  primaryButton={<PrimaryButton>Primary Button</PrimaryButton>}
  secondaryButton={<SecondaryButton>Secondary Button</SecondaryButton>}
  tertiaryLinks={[{ text: 'tertiary_1', icon: FaTrashIcon, onClick: action('click_1') }]}
/>
```

## props

### BottomFixedArea component

| Name            | Required | Type                                             | DefaultValue | Description                                                     |
| --------------- | -------- | ------------------------------------------------ | ------------ | --------------------------------------------------------------- |
| description     | -        | **ReactNode**                                    | -            | The Description of this area.                                   |
| primaryButton   | -        | **PrimaryButton &#124; PrimaryButtonAnchor**     | -            | This is for PrimaryButton or PrimaryButtonAnchor component.     |
| secondaryButton | -        | **SecondaryButton &#124; SecondaryButtonAnchor** | -            | This is for SecondaryButton or SecondaryButtonAnchor component. |
| tertiaryLinks   | -        | **TertiaryLinks[]**                              | -            | Array of tertiaryLink props.                                    |
| zIndex          | -        | **number**                                       | 500          | The z-index of this component                                   |
| className       | -        | **string**                                       | ''           | The className of this component                                 |

### TertiaryLink

| Name    | Required | Type                                                             | DefaultValue | Description                                                           |
| ------- | -------- | ---------------------------------------------------------------- | ------------ | --------------------------------------------------------------------- |
| text    | ✓        | **string**                                                       | -            | The text of tertiaryLink                                              |
| icon    | -        | **An Fa\*\*\*Component in Icon**                                 | -            | Set a Fa\*\*\*Icon component to be displayed next to the button text. |
| type    | -        | **"button" &#124; "reset"**                                      | "button"     | type for component.                                                   |
| onClick | ✓        | **(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void** | -            | Fired when the tertiaryLink is clicked                                |
