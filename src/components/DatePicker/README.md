# DatePicker

```tsx
import { DatePicker } from 'smarthr-ui'
```

```tsx
<DatePicker
  date={date}
  onChangeDate={handleChangeDate}
  parsingErrorMessage="custom parsing error message"
  parseInput={customParser}
  formatDate={customFormatter}
/>
```

## props

### DatePicker

| Name                | Required | Type                                | DefaultValue           | Description                                |
| ------------------- | -------- | ----------------------------------- | ---------------------- | ------------------------------------------ |
| date                | -        | **Date**                            | null                   | Date value.                                |
| onChangeDate        | -        | **(date: Date \| null) => void**    | -                      | Fired when date is changed.                |
| parsingErrorMessage | -        | **string**                          | '非対応な入力形式です' | Error message of parsing date string.      |
| parseInput          | -        | **(input: string) => Date \| null** | -                      | Custom parsing function for input.         |
| formatDate          | -        | **(date: Date \| null) => string**  | -                      | Custom formatting function to displa date. |
| className           | -        | **string**                          | -                      | `className` of component.                  |
