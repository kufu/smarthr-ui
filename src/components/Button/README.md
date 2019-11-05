# Buttons

```tsx
import { PrimaryButton, PrimaryButtonAnchor } from 'smarthr-ui'
import { SecondaryButton, SecondaryButtonAnchor } from 'smarthr-ui'
import { DangerButton, DangerButtonAnchor } from 'smarthr-ui'

<PrimaryButton>Button</PrimaryButton>
<PrimaryButtonAnchor href="#">Anchor</PrimaryButtonAnchor>

<SecondaryButton>Button</SecondaryButton>
<SecondaryButtonAnchor href="#">Anchor</SecondaryButtonAnchor>

<DangerButton>Button</DangerButton>
<DangerButtonAnchor href="#">Anchor</DangerButtonAnchor>
```

## props

### Common to Button and Anchor

| Name      | Required | Type                           | DefaultValue | Description                                                                           |
| --------- | -------- | ------------------------------ | ------------ | ------------------------------------------------------------------------------------- |
| size      | -        | **enum** <br> default &#124; s | default      | Size of button.                                                                       |
| children  | -        | **node**                       | ''           | The content of the component.                                                         |
| prefix    | -        | **node**                       | ''           | The content of the prefix of button content.<br>Normally, this is for icon insertion. |
| suffix    | -        | **node**                       | ''           | The content of the suffix of button content.<br>Normally, this is for icon insertion. |
| square    | -        | **boolean**                    | false        | If `true`, the component shape changes to square. Cannot be used with TextButton.     |
| wide      | -        | **boolean**                    | false        | If `true`, the component shape changes width is 100%.                                 |
| className | -        | **string**                     | ''           | `className` of component.                                                             |

### Button

| Name     | Required | Type         | DefaultValue | Description                                                         |
| -------- | -------- | ------------ | ------------ | ------------------------------------------------------------------- |
| onClick  | -        | **function** | -            | Fired when the component is focused. <br><br>`function: () => void` |
| disabled | -        | **boolean**  | false        | If `true`, the component is disabled.                               |

### Anchor

| Name   | Required | Type       | DefaultValue | Description             |
| ------ | -------- | ---------- | ------------ | ----------------------- |
| href   | ✓        | **string** | ''           | `href` for component.   |
| target | -        | **string** | ''           | `target` for component. |
| rel    | -        | **string** | ''           | `rel` for component.    |
