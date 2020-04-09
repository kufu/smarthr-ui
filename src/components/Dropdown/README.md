# Dropdown

```tsx
import { Dropdown, DropdownTrigger, DropdownContent, DropdownCloser, DropdownScrollArea } from 'smarthr-ui'

// Uncontrollable Dropdown
// After Dropdown is opened, clicking anywhere will close Dropdown.

<Dropdown>
  <DropdownTrigger>
    <button>dropdown trigger button</button>
  </DropdownTrigger>
  <DropdownContent>
    <DropdownScrollArea>
      <div>dropdown content</div>
    </DropdownScrollArea>
  </DropdownContent>
</Dropdown>

// Controllable Dropdown
// After Dropdown is opened, click 'DropdownCloser' to close Dropdown.

<Dropdown>
  <DropdownTrigger>
    <button>dropdown trigger button</button>
  </DropdownTrigger>
  <DropdownContent controllable>
    <DropdownScrollArea>
      <div>
        <p>dropdown content</p>
        <DropdownCloser>
          <button>dropdown close button</button>
        </DropdownCloser>
      </div>
    </DropdownScrollArea>
  </DropdownContent>
</Dropdown>

// Dropdown with fixed content
<Dropdown>
  <DropdownTrigger>
    <button>dropdown trigger button</button>
  </DropdownTrigger>
  <DropdownContent controllable>
    <div>fixed area</div>
    <DropdownScrollArea>
      <div>
        <p>dropdown content</p>
        <DropdownCloser>
          <button>dropdown close button</button>
        </DropdownCloser>
      </div>
    </DropdownScrollArea>
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

| Name         | Required | Type                               | DefaultValue | Description                                                                               |
| ------------ | -------- | ---------------------------------- | ------------ | ----------------------------------------------------------------------------------------- |
| controllable | -        | **boolean** <br> true &#124; false | false        | Use controllable content when its true                                                    |
| scrollable   | -        | **boolean** <br> true &#124; false | true         | If true, the content will automatically be scrollable when the window size is not enough. |
| className    | -        | **string**                         | ''           | className of DropdownContent                                                              |
