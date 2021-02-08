# Tooltip

```tsx
import { LightTooltip, DarkTooltip } from 'smarthr-ui'

// LightTooltip
<LightTooltip message="Text in tooltip">
  Displayed text
</LightTooltip>

// DarkTooltip
<DarkTooltip
  message={<span>You can also add ReactNode</span>}
  horizontal="right"
  vertical="middle"
>
  Displayed text
</DarkTooltip>
```

## props

| Name         | Required | Type                                      | DefaultValue | Description                                                                                         |
| ------------ | -------- | ----------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------- |
| message      | ✓        | **ReactNode**                             | -            | message in the tooltip                                                                              |
| children     | ✓        | **ReactNode**                             | -            | target element for tooltip                                                                          |
| triggerType  | -        | **'icon' &#124; 'text'**                  | 'text'       | set 'icon' when the trigger is an icon                                                              |
| multiLine    | -        | **boolean**                               | false        | set true when text in the tooltip is multi line                                                     |
| ellipsisOnly | -        | **boolean**                               | false        | set true when you want the tooltip enabled only when the text is too long and ellipsis is displayed |
| horizontal   | -        | **'right' &#124; 'center' &#124; 'left'** | 'left'       | horizontal position                                                                                 |
| vertical     | -        | **'top' &#124; 'middle' &#124; 'bottom'** | 'bottom'     | vertical position                                                                                   |
