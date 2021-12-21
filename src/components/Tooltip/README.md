# Tooltip

```tsx
import { Tooltip } from 'smarthr-ui'

;<Tooltip message="Text in tooltip">Displayed text</Tooltip>
```

## props

| Name         | Required | Type                                                    | DefaultValue | Description                                                                                         |
| ------------ | -------- | ------------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------- |
| message      | ✓        | **ReactNode**                                           | -            | message in the tooltip                                                                              |
| children     | ✓        | **ReactNode**                                           | -            | target element for tooltip                                                                          |
| triggerType  | -        | **'icon' &#124; 'text'**                                | 'text'       | set 'icon' when the trigger is an icon                                                              |
| multiLine    | -        | **boolean**                                             | false        | set true when text in the tooltip is multi line                                                     |
| ellipsisOnly | -        | **boolean**                                             | false        | set true when you want the tooltip enabled only when the text is too long and ellipsis is displayed |
| horizontal   | -        | **'right' &#124; 'center' &#124; 'left' &#124; 'auto'** | 'left'       | horizontal position                                                                                 |
| vertical     | -        | **'top' &#124; 'middle' &#124; 'bottom' &#124; 'auto'** | 'bottom'     | vertical position                                                                                   |
