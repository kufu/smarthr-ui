# Dropdown

```tsx
import { Dropdown, DropdownTrigger, DropdownContent, DropdownControllableContent, DropdownCloser } from 'smarthr-ui

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
  <DropdownControllableContent>
    <div>
      <p>dropdown content</p>
      <DropdownCloser>
        <button>dropdown close button</button>
      </DropdownCloser>
    </div>
  </DropdownControllableContent>
</Dropdown>
```

## props

There are no props to pass.
