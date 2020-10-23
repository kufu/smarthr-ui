# FilterDropdown

```tsx
import { FilterDropdown } from 'smarthr-ui'


<FilterDropdown onApply={() => {}}>
  <div>Components to control Inputs for filtering conditions</div>
<FilterDropdown>
```

## props

**FilterDropdown**

| Name       | Required | Type                | DefaultValue | Description                                           |
| ---------- | -------- | ------------------- | ------------ | ----------------------------------------------------- |
| isFiltered | -        | **boolean**         | false        | Flag to switch border color of the trigger button     |
| onApply    | ✓       | **function**        | -            | Fired when the Apply button is clicked                |
| onCancel   | -        | **function**        | -            | Fired when the Cancel button is clicked               |
| onReset    | -        | **function**        | -            | Fired when the Reset button is clicked                |
| children   | ✓       | **React.ReactNode** | -            | Components to control Inputs for filtering conditions |
