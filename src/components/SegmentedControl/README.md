# SegmentedControl

```tsx
import { SegmentedControl } from 'smarthr-ui'
```

```tsx
<SegmentedControl
  options={[
    { value: 'val1', content: 'Value 1', ariaLabel: 'value 1' },
    { value: 'val2', content: 'Value 2', ariaLabel: 'value 2' },
    { value: 'val3', content: 'Value 3', ariaLabel: 'value 3' },
  ]}
  value={value1}
  onClickOption={handleChangeOption}
/>
```

## props

### SegmentedControl

| Name          | Required | Type                         | DefaultValue | Description                                                                               |
| ------------- | -------- | ---------------------------- | ------------ | ----------------------------------------------------------------------------------------- |
| options       | ✓        | **SegmentedControlOption[]** | -            | Data of each option.                                                                      |
| value         | -        | **string**                   | -            | Value of selected option.                                                                 |
| onClickOption | -        | **(value: string) => void**  | -            | Fired when option is clicked.                                                             |
| size          | -        | **'default' \| 's'**         | 'default'    | Size of each button.                                                                      |
| isSquare      | -        | **boolean**                  | false        | Whether makes each button square. <br/>It is set when each option button are icon button. |
| className     | -        | **string**                   | -            | ClassName for component                                                                   |

### SegmentedControlOption

| Name      | Required | Type                | DefaultValue | Description                                           |
| --------- | -------- | ------------------- | ------------ | ----------------------------------------------------- |
| value     | ✓        | **string**          | -            | Value of option. <br/>It should be unique to options. |
| content   | ✓        | **React.ReactNode** | -            | Content of option button.                             |
| ariaLabel | -        | **string**          | -            | Value of aria-label.                                  |
| disabled  | -        | **boolean**         | -            | Whether makes button disabled.                        |
