# Calendar

```tsx
import { Calendar } from 'smarthr-ui'

function MyApp() {
  return (
    <Calendar
      from={new Date(2000, 0, 1)}
      to={new Date(2050, 11, 31)}
      onSelectDate={(e, date) => {}}
      value={new Date()}
    />
  )
}
```

## props

| Name         | Required | Type                                          | DefaultValue           | Description                    |
| ------------ | -------- | --------------------------------------------- | ---------------------- | ------------------------------ |
| from         | -        | **Date**                                      | 1970-01-01             | Start date that is selectable. |
| to           | -        | **Date**                                      | today in 50 years time | End date that is selectable.   |
| onSelectDate | true     | **(e: React.MouseEvent, date: Date) => void** | -                      | Fired when date is selected.   |
| value        | -        | **Date**                                      | -                      | Selected date.                 |
