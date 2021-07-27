# DatePicker

```tsx
import { DatePicker } from 'smarthr-ui'
```

```tsx
<DatePicker
  value={value}
  name={name}
  from={from}
  to={to}
  disabled={disabled}
  error={error}
  parseInput={customParser}
  formatDate={customFormatter}
  onChangeDate={handleChangeDate}
/>
```

## props

### DatePicker

| Name         | Required | Type                                            | DefaultValue           | Description                                |
| ------------ | -------- | ----------------------------------------------- | ---------------------- | ------------------------------------------ |
| value        | -        | **string \| null**                              | null                   | `value` of input.                          |
| name         | -        | **string**                                      | -                      | `name` of input.                           |
| from         | -        | **Date**                                        | 1970-01-01             | Start date that is selectable.             |
| to           | -        | **Date**                                        | today in 50 years time | End date that is selectable.               |
| disabled     | -        | **boolean**                                     | -                      | `disabled` of input.                       |
| error        | -        | **boolean**                                     | -                      | `error` of input.                          |
| className    | -        | **string**                                      | -                      | `className` of component.                  |
| parseInput   | -        | **(input: string) => Date \| null**             | -                      | Custom parsing function for input.         |
| formatDate   | -        | **(date: Date \| null) => string**              | -                      | Custom formatting function to display date. |
| onChangeDate | -        | **(date: Date \| null, value: string) => void** | -                      | Fired when date is changed.                |
