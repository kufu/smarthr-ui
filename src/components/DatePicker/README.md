# DatePicker

```tsx
import { DatePicker } from 'smarthr-ui'
```

```tsx
<DatePicker
  value={value}
  onChangeDate={handleChangeDate}
  parseInput={customParser}
  formatDate={customFormatter}
  name={name}
  disabled={disabled}
  error={error}
/>
```

## props

### DatePicker

| Name         | Required | Type                                            | DefaultValue | Description                                |
| ------------ | -------- | ----------------------------------------------- | ------------ | ------------------------------------------ |
| value        | -        | **string \| null**                              | null         | `value` of input.                          |
| onChangeDate | -        | **(date: Date \| null, value: string) => void** | -            | Fired when date is changed.                |
| parseInput   | -        | **(input: string) => Date \| null**             | -            | Custom parsing function for input.         |
| formatDate   | -        | **(date: Date \| null) => string**              | -            | Custom formatting function to displa date. |
| name         | -        | **string**                                      | -            | `name` of input.                           |
| disabled     | -        | **boolean**                                     | -            | `disabled` of input.                       |
| error        | -        | **boolean**                                     | -            | `error` of input.                          |
| className    | -        | **string**                                      | -            | `className` of component.                  |
