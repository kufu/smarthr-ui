# FilterDropdown

```tsx
import { FilterDropdown } from 'smarthr-ui'


<FilterDropdown onApply={() => {}}>
  <div>Components to control Inputs for filtering conditions</div>
<FilterDropdown>
```

## props

**FilterDropdown**

| Name     | Required | Type                | DefaultValue | Description                                           |
| -------- | -------- | ------------------- | ------------ | ----------------------------------------------------- |
| onApply  | true     | **function**        | -            | Fired when the Apply button is clicked                |
| onCancel | -        | **function**        | -            | Fired when the Cancel button is clicked               |
| onReset  | -        | **function**        | -            | Fired when the Reset button is clicked                |
| children | true     | **React.ReactNode** | -            | Components to control Inputs for filtering conditions |
