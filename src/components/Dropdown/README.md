# Dropdown

```tsx
import { Dropdown, DropdownTrigger, DropdownContent, DropdownCloser } from 'smarthr-ui'

// Uncontrollable Dropdown
// After Dropdown is opened, clicking anywhere will close Dropdown.

<Dropdown>
  <DropdownTrigger>
    <button>dropdown trigger button</button>
  </DropdownTrigger>
  <DropdownContent>
    <div>dropdown content</div>
  </DropdownContent>
</Dropdown>

// Controllable Dropdown
// After Dropdown is opened, click 'DropdownCloser' to close Dropdown.

<Dropdown>
  <DropdownTrigger>
    <button>dropdown trigger button</button>
  </DropdownTrigger>
  <DropdownContent controllable>
    <div>
      <p>dropdown content</p>
      <DropdownCloser>
        <button>dropdown close button</button>
      </DropdownCloser>
    </div>
  </DropdownContent>
</Dropdown>
```

## props

**DropdownTrigger**

| Name      | Required | Type       | DefaultValue | Description                  |
| --------- | -------- | ---------- | ------------ | ---------------------------- |
| className | -        | **string** | ''           | className of DropdownTrigger |

**DropdownCloser**

| Name      | Required | Type       | DefaultValue | Description                 |
| --------- | -------- | ---------- | ------------ | --------------------------- |
| className | -        | **string** | ''           | className of DropdownCloser |

**DropdownContent**

| Name         | Required | Type                               | DefaultValue | Description                            |
| ------------ | -------- | ---------------------------------- | ------------ | -------------------------------------- |
| controllable | -        | **boolean** <br> true &#124; false | false        | Use controllable content when its true |
| className    | -        | **string**                         | ''           | className of DropdownContent           |
