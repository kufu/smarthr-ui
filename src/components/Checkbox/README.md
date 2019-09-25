# Checkbox

```tsx
import { Checkbox } from 'smarthr-ui'

<Checkbox name="sample" checked={true} mixed={true} onChange={() => {}} themeColor="light" />
```

## props

| Name       | Required | Type                                   | DefaultValue | Description                                                                                 |
| ---------- | -------- | -------------------------------------- | ------------ | ------------------------------------------------------------------------------------------- |
| checked    | true     | **boolean** <br> true &#124; false     | -            | Whether the check box is checked.                                                           |
| name       | true     | **string**                             | -            | the name attribute of input tag.                                                            |
| themeColor | -        | **string** <br>  'light' &#124; 'dark' | 'light'      | style theme.                                                                                |
| disabled   | -        | **boolean** <br> true &#124; false     | false        | The disabled attribute of input tag.                                                        |
| mixed      | -        | **boolean** <br> true &#124; false     | false        | If `true`, the check Icon change to minus.                                                  |
| className  | -        | **string**                             | ''           | The className attribute of component.                                                       |
| onChange   | -        | **function**                           | -            | Fired when the checkbox changed. <br><br>function: (name: string, checked: boolean) => void |
