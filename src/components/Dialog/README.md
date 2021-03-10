Dialog component represents information and operations that are important to users.

<details>
<summary>how to import</summary>

```tsx
import {
  Dialog,
  DialogWrapper,
  DialogTrigger,
  DialogContent,
  DialogCloser,
  MessageDialog,
  MessageDialogContent,
  ActionDialog,
  ActionDialogContent,
} from 'smarthr-ui'
```

</details>

<details>
<summary>Accessibility</summary>

### Accessibility

#### Recommend

- Add Name by `title` or `ariaLabel` or `ariaLabelledby` props.
- Add `aria-haspopup="dialog"` to trigger
- Add `id` attribute to dialog / dialog content and set the `id` to `aria-controls` in trigger
- Add Close Action in Dialog Contents.

#### ARIA

- Dialog component has `role` set to `"dialog"`.
- Dialog component has `aria-modal` set to `true`.
- Uncontrollable Dialog has `aria-haspopup` set to `"dialog"` in the trigger. When using controllable Dialog, set `aria-haspopup` to `"dialog"` in the trigger.
- MessageDialog and ActionDialog set the title value to the `aria-label` value. When using Dialog and DialogContent, you can specify a value for `aria-label` in `ariaLabel` props. Alternatively, you can use the aria-labelledby attribute by passing the id value in `ariaLabelledby` props.

#### Keyboard Interaction

> When a dialog opens, focus moves to an element inside the dialog. See notes below regarding initial focus placement.

> `Tab`: Moves focus to the next tabbable element inside the dialog.

If focus is on the last tabbable element inside the dialog, moves focus to the first tabbable element inside the dialog.

> `Shift + Tab`: Moves focus to the previous tabbable element inside the dialog.

If focus is on the first tabbable element inside the dialog, moves focus to the last tabbable element inside the dialog.

> `Escape`: Closes the dialog.

[WAI-ARIA Authoring Practices 1.1 - 3.9 Dialog(Modal) - Keyboard Interaction](https://www.w3.org/TR/wai-aria-practices-1.1/#keyboard-interaction-7)

</details>
