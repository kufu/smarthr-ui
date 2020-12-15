# Dialog

## Dialog

### usage

controllable

```tsx
import { Dialog } from 'smarthr-ui'

const DialogController: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const onClickOpen = () => setIsOpen(true)
  const onClickClose = () => setIsOpen(false)

  return (
    <div>
      <button onClick={onClickOpen} type="button" aria-haspopup="dialog">
        open dialog
      </button>
      <Dialog isOpen={isOpen} onClickOverlay={onClickClose}>
        <p>text</p>
        <button onClick={onClickClose}>close dialog</button>
      </Dialog>
    </div>
  )
}
```

uncontrollable

```tsx
import { DialogWrapper, DialogTrigger, DialogContent, DialogCloser } from 'smarthr-ui'

const Component: React.FC = () => (
  <DialogWrapper>
    <DialogTrigger>
      <button type="button" aria-haspopup="dialog">
        open dialog
      </button>
    </DialogTrigger>
    <DialogContent>
      <p>text</p>
      <DialogCloser>
        <button>close dialog</button>
      </DialogCloser>
    </DialogContent>
  </DialogWrapper>
)
```

### props

Dialog

| Name           | Required | Type       | DefaultValue | Description                                                                                                                                           |
| -------------- | -------- | ---------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| isOpen         | ✓        | boolean    | -            | Whether to display a Dialog.                                                                                                                          |
| onClickOverlay | -        | () => void | () => {}     | Handler function when clicking on overlay.                                                                                                            |
| top            | -        | number     | -            | Specifies the top position of the Dialog content.                                                                                                     |
| right          | -        | number     | -            | Specifies the right position of the Dialog content.                                                                                                   |
| bottom         | -        | number     | -            | Specifies the bottom position of the Dialog content.                                                                                                  |
| left           | -        | number     | -            | Specifies the left position of the Dialog content.                                                                                                    |
| ariaLabel      | -        | string     | -            | Value to set for [aria-label](https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute).           |
| ariaLabelledby | -        | string     | -            | Value to set for [aria-labelledby](https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-labelledby_attribute). |

DialogContent

| Name           | Required | Type   | DefaultValue | Description                                                                                                                                           |
| -------------- | -------- | ------ | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| top            | -        | number | -            | Specifies the top position of the Dialog content.                                                                                                     |
| right          | -        | number | -            | Specifies the right position of the Dialog content.                                                                                                   |
| bottom         | -        | number | -            | Specifies the bottom position of the Dialog content.                                                                                                  |
| left           | -        | number | -            | Specifies the left position of the Dialog content.                                                                                                    |
| ariaLabel      | -        | string | -            | Value to set for [aria-label](https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute).           |
| ariaLabelledby | -        | string | -            | Value to set for [aria-labelledby](https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-labelledby_attribute). |

## MessageDialog

### usage

controllable

```tsx
import { MessageDialog } from 'smarthr-ui'

const DialogController: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const onClickOpen = () => setIsOpen(true)
  const onClickClose = () => setIsOpen(false)

  return (
    <div>
      <button onClick={onClickOpen} type="button" aria-haspopup="dialog">
        open dialog
      </button>
      <MessageDialog
        isOpen={isOpen}
        title="title message"
        description={<p>description</p>}
        closeText="close dialog"
        onClickClose={onClickClose}
      />
    </div>
  )
}
```

uncontrollable

```tsx
import { DialogWrapper, DialogTrigger, MessageDialogContent } from 'smarthr-ui'

const Component: React.FC = () => (
  <DialogWrapper>
    <DialogTrigger>
      <button type="button" aria-haspopup="dialog">
        open dialog
      </button>
    </DialogTrigger>
    <MessageDialogContent
      title="title message"
      description={<p>description</p>}
      closeText="close dialog"
    />
  </DialogWrapper>
)
```

### props

MessageDialog

| Name         | Required | Type       | DefaultValue | Description                                                 |
| ------------ | -------- | ---------- | ------------ | ----------------------------------------------------------- |
| isOpen       | ✓        | boolean    | -            | Whether to display a Dialog.                                |
| onClickClose | ✓        | () => void | -            | Handler function when clicking on close button and overlay. |
| title        | ✓        | string     | -            | dialog title message.                                       |
| description  | ✓        | ReactNode  | -            | body of dialog.                                             |
| closeText    | ✓        | string     | -            | close button text.                                          |
| top          | -        | number     | -            | Specifies the top position of the Dialog content.           |
| right        | -        | number     | -            | Specifies the right position of the Dialog content.         |
| bottom       | -        | number     | -            | Specifies the bottom position of the Dialog content.        |
| left         | -        | number     | -            | Specifies the left position of the Dialog content.          |

MessageDialogContent

| Name        | Required | Type      | DefaultValue | Description                                          |
| ----------- | -------- | --------- | ------------ | ---------------------------------------------------- |
| title       | ✓        | string    | -            | dialog title message.                                |
| description | ✓        | ReactNode | -            | body of dialog.                                      |
| closeText   | ✓        | string    | -            | close button text.                                   |
| top         | -        | number    | -            | Specifies the top position of the Dialog content.    |
| right       | -        | number    | -            | Specifies the right position of the Dialog content.  |
| bottom      | -        | number    | -            | Specifies the bottom position of the Dialog content. |
| left        | -        | number    | -            | Specifies the left position of the Dialog content.   |

## Action Dialog

### usage

controllable

```tsx
import { ActionDialog } from 'smarthr-ui'

const DialogController: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const onClickOpen = () => setIsOpen(true)
  const onClickClose = () => setIsOpen(false)

  return (
    <div>
      <button onClick={onClickOpen} type="button" aria-haspopup="dialog">
        open dialog
      </button>
      <ActionDialog
        isOpen={isOpen}
        title="title message"
        closeText="close dialog"
        actionText="execute action"
        actionTheme="primary"
        onClickAction={(closeDialog) => closeDialog()}
        onClickClose={onClickClose}
      >
        <p>description</p>
      </ActionDialog>
    </div>
  )
}
```

uncontrollable

```tsx
import { DialogWrapper, DialogTrigger, ActionDialogContent } from 'smarthr-ui'

const Component: React.FC = () => (
  <DialogWrapper>
    <DialogTrigger>
      <button type="button" aria-haspopup="dialog">
        open dialog
      </button>
    </DialogTrigger>
    <ActionDialogContent
      title="title message"
      closeText="close dialog"
      actionText="execute action"
      actionTheme="primary"
      actionDisabled={false}
      onClickAction={(closeDialog) => closeDialog()}
    >
      <p>description</p>
    </ActionDialogContent>
  </DialogWrapper>
)
```

## props

ActionDialog

| Name           | Required | Type                                         | DefaultValue | Description                                                                                                 |
| -------------- | -------- | -------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------- |
| isOpen         | ✓        | boolean                                      | -            | Whether to display a Dialog.                                                                                |
| onClickClose   | ✓        | () => void                                   | -            | Handler function when clicking on close button and overlay.                                                 |
| title          | ✓        | string                                       | -            | dialog title message.                                                                                       |
| closeText      | ✓        | string                                       | -            | close button text.                                                                                          |
| actionText     | ✓        | string                                       | -            | action button text.                                                                                         |
| actionTheme    | ✓        | 'primary' &#124; 'secondary' &#124; 'danger' | -            | action button style theme.                                                                                  |
| onClickAction  | ✓        | (closeDialog: () => void) => void            | -            | Handler function when clicking on action button.<br />accepts a function that closes dialog as an argument. |
| children       | ✓        | ReactNode                                    | -            | body of dialog.                                                                                             |
| actionDisabled | false    | boolean                                      | false        | whether action button should be disabled.                                                                   |
| top            | false    | number                                       | -            | Specifies the top position of the Dialog content.                                                           |
| right          | false    | number                                       | -            | Specifies the right position of the Dialog content.                                                         |
| bottom         | false    | number                                       | -            | Specifies the bottom position of the Dialog content.                                                        |
| left           | false    | number                                       | -            | Specifies the left position of the Dialog content.                                                          |

ActionDialogContent

| Name           | Required | Type                                         | DefaultValue | Description                                                                                                 |
| -------------- | -------- | -------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------- |
| title          | ✓        | string                                       | -            | dialog title message.                                                                                       |
| closeText      | ✓        | string                                       | -            | close button text.                                                                                          |
| actionText     | ✓        | string                                       | -            | action button text.                                                                                         |
| actionTheme    | ✓        | 'primary' &#124; 'secondary' &#124; 'danger' | -            | action button style theme.                                                                                  |
| onClickAction  | ✓        | (closeDialog: () => void) => void            | -            | Handler function when clicking on action button.<br />accepts a function that closes dialog as an argument. |
| children       | ✓        | ReactNode                                    | -            | body of dialog.                                                                                             |
| actionDisabled | -        | boolean                                      | false        | whether action button should be disabled.                                                                   |
| top            | -        | number                                       | -            | Specifies the top position of the Dialog content.                                                           |
| right          | -        | number                                       | -            | Specifies the right position of the Dialog content.                                                         |
| bottom         | -        | number                                       | -            | Specifies the bottom position of the Dialog content.                                                        |
| left           | -        | number                                       | -            | Specifies the left position of the Dialog content.                                                          |

## Accessibility

### usage

#### Recommend

- Add Name by `title` or `ariaLabel` or `ariaLabelledby` props.
- Add `aria-haspopup="dialog"` to trigger
- Add `id` attribute to dialog / dialog content and set the `id` to `aria-controls` in trigger
- Add Close Action in Dialog Contents.

### ARIA

- Dialog component has `role` set to `"dialog"`.
- Dialog component has `aria-modal` set to `true`.
- Uncontrollable Dialog has `aria-haspopup` set to `"dialog"` in the trigger. When using controllable Dialog, set `aria-haspopup` to `"dialog"` in the trigger.
- MessageDialog and ActionDialog set the title value to the `aria-label` value. When using Dialog and DialogContent, you can specify a value for `aria-label` in `ariaLabel` props. Alternatively, you can use the aria-labelledby attribute by passing the id value in `ariaLabelledby` props.

### Keyboard Interaction

> When a dialog opens, focus moves to an element inside the dialog. See notes below regarding initial focus placement.

> `Tab`: Moves focus to the next tabbable element inside the dialog.

If focus is on the last tabbable element inside the dialog, moves focus to the first tabbable element inside the dialog.

> `Shift + Tab`: Moves focus to the previous tabbable element inside the dialog.

If focus is on the first tabbable element inside the dialog, moves focus to the last tabbable element inside the dialog.

> `Escape`: Closes the dialog.

[WAI-ARIA Authoring Practices 1.1 - 3.9 Dialog(Modal) - Keyboard Interaction](https://www.w3.org/TR/wai-aria-practices-1.1/#keyboard-interaction-7)
