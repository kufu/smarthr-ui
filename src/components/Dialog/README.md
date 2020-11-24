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
      <button onClick={onClickOpen} aria-haspopup="dialog">open dialog</button>
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
      <button>open dialog</button>
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

| Name           | Required | Type       | DefaultValue | Description                                          |
| -------------- | -------- | ---------- | ------------ | ---------------------------------------------------- |
| isOpen         | ✓        | boolean    | -            | Whether to display a Dialog.                         |
| onClickOverlay | -        | () => void | () => {}     | Handler function when clicking on overlay.           |
| top            | -        | number     | -            | Specifies the top position of the Dialog content.    |
| right          | -        | number     | -            | Specifies the right position of the Dialog content.  |
| bottom         | -        | number     | -            | Specifies the bottom position of the Dialog content. |
| left           | -        | number     | -            | Specifies the left position of the Dialog content.   |
| ariaLabel      | -        | string     | -            | Define a string to label the Dialog.                 |
| ariaLabelledby | -        | string     | -            | Define the ID of another element in the DOM as the element's label. |

DialogContent

| Name           | Required | Type   | DefaultValue | Description                                          |
| -------------- | -------- | ------ | ------------ | ---------------------------------------------------- |
| top            | -        | number | -            | Specifies the top position of the Dialog content.    |
| right          | -        | number | -            | Specifies the right position of the Dialog content.  |
| bottom         | -        | number | -            | Specifies the bottom position of the Dialog content. |
| left           | -        | number | -            | Specifies the left position of the Dialog content.   |
| ariaLabel      | -        | string | -            | Define a string to label the Dialog.                 |
| ariaLabelledby | -        | string | -            | Define the ID of another element in the DOM as the element's label. |

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
      <button onClick={onClickOpen} aria-haspopup="dialog">open dialog</button>
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
      <button>open dialog</button>
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
      <button onClick={onClickOpen} aria-haspopup="dialog">open dialog</button>
      <ActionDialog
        isOpen={isOpen}
        title="title message"
        closeText="close dialog"
        actionText="execute action"
        actionTheme="primary"
        onClickAction={closeDialog => closeDialog()}
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
      <button>open dialog</button>
    </DialogTrigger>
    <ActionDialogContent
      title="title message"
      closeText="close dialog"
      actionText="execute action"
      actionTheme="primary"
      actionDisabled={false}
      onClickAction={closeDialog => closeDialog()}
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
| closeText      | ✓         | string                                       | -            | close button text.                                                                                          |
| actionText     | ✓         | string                                       | -            | action button text.                                                                                         |
| actionTheme    | ✓         | 'primary' &#124; 'secondary' &#124; 'danger' | -            | action button style theme.                                                                                  |
| onClickAction  | ✓         | (closeDialog: () => void) => void            | -            | Handler function when clicking on action button.<br />accepts a function that closes dialog as an argument. |
| children       | ✓         | ReactNode                                    | -            | body of dialog.                                                                                             |
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

### ARIA

- Dialog component has `role` set to `"dialog"`.
- Dialog component has `aria-modal` set to `true`.
- Uncontrollable Dialog has `aria-haspopup` set to `"dialog"` in the trigger. When using controllable Dialog, set `aria-haspopup` to `"dialog"` in the trigger.
- MessageDialog and ActionDialog set the title value to the `aria-label` value. When using Dialog and DialogContent, you can specify a value for `aria-label` in `ariaLabel` props. Alternatively, you can use the aria-labelledby attribute by passing the id value in `ariaLabelledby` props.
