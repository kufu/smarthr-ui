# Calendar

```tsx
import { Calendar } from 'smarthr-ui'

function MyApp() {
  return <Calendar onSelectDate={(e, date) => {}} />
}
```

## props

| Name         | Required | Type         | DefaultValue           | Description                    |
| ------------ | -------- | ------------ | ---------------------- | ------------------------------ |
| from         | -        | **Date**     | 1970-01-01             | Start date that is selectable. |
| to           | -        | **Date**     | today in 50 years time | End date that is selectable.   |
| onSelectDate | true     | **function** | -                      | Fired when date is selected.   |
| value        | -        | **Date**     | -                      | Selected date.                 |
