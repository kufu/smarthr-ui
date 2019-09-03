# PrimaryButton

```tsx
import { PrimaryButton, PrimaryButtonAnchor } from 'smarthr-ui'

<PrimaryButton>Button</PrimaryButton>
<PrimaryButtonAnchor href="#">Anchor</PrimaryButtonAnchor>
```

## props

### Common to PrimaryButton and PrimaryButtonAnchor

| Name      | Required | Type                           | DefaultValue | Description                                                                           |
| --------- | -------- | ------------------------------ | ------------ | ------------------------------------------------------------------------------------- |
| size      | -        | **enum** <br> default &#124; s | default      | Size of button.                                                                       |
| children  | -        | **node**                       | ''           | The content of the component.                                                         |
| prefix    | -        | **node**                       | ''           | The content of the prefix of button content.<br>Normally, this is for icon insertion. |
| suffix    | -        | **node**                       | ''           | The content of the suffix of button content.<br>Normally, this is for icon insertion. |
| square    | -        | **boolean**                    | false        | If `true`, the component shape changes to square.                                     |
| wide      | -        | **boolean**                    | false        | If `true`, the component shape changes width is 100%.                                 |
| className | -        | **string**                     | ''           | `className` of component.                                                             |

### PrimaryButton

| Name     | Required | Type         | DefaultValue | Description                                                         |
| -------- | -------- | ------------ | ------------ | ------------------------------------------------------------------- |
| onClick  | -        | **function** | -            | Fired when the component is focused. <br><br>`function: () => void` |
| disabled | -        | **boolean**  | false        | If `true`, the component is disabled.                               |

### PrimaryButtonAnchor

| Name   | Required | Type       | DefaultValue | Description             |
| ------ | -------- | ---------- | ------------ | ----------------------- |
| href   | ✓        | **string** | ''           | `href` for component.   |
| target | -        | **string** | ''           | `target` for component. |
| rel    | -        | **string** | ''           | `rel` for component.    |
