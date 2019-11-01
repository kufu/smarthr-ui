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
      <button onClick={onClickOpen}>open dialog</button>
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
| isOpen         | true     | boolean    | -            | Whether to display a Dialog.                         |
| onClickOverlay | false    | () => void | () => {}     | Handler function when clicking on overlay.           |
| top            | false    | number     | -            | Specifies the top position of the Dialog content.    |
| right          | false    | number     | -            | Specifies the right position of the Dialog content.  |
| bottom         | false    | number     | -            | Specifies the bottom position of the Dialog content. |
| left           | false    | number     | -            | Specifies the left position of the Dialog content.   |

DialogContent

| Name   | Required | Type   | DefaultValue | Description                                          |
| ------ | -------- | ------ | ------------ | ---------------------------------------------------- |
| top    | false    | number | -            | Specifies the top position of the Dialog content.    |
| right  | false    | number | -            | Specifies the right position of the Dialog content.  |
| bottom | false    | number | -            | Specifies the bottom position of the Dialog content. |
| left   | false    | number | -            | Specifies the left position of the Dialog content.   |

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
      <button onClick={onClickOpen}>open dialog</button>
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
| isOpen       | true     | boolean    | -            | Whether to display a Dialog.                                |
| onClickClose | true     | () => void | -            | Handler function when clicking on close button and overlay. |
| title        | true     | string     | -            | dialog title message.                                       |
| description  | true     | ReactNode  | -            | body of dialog.                                             |
| closeText    | true     | string     | -            | close button text.                                          |
| top          | false    | number     | -            | Specifies the top position of the Dialog content.           |
| right        | false    | number     | -            | Specifies the right position of the Dialog content.         |
| bottom       | false    | number     | -            | Specifies the bottom position of the Dialog content.        |
| left         | false    | number     | -            | Specifies the left position of the Dialog content.          |

MessageDialogContent

| Name        | Required | Type      | DefaultValue | Description                                          |
| ----------- | -------- | --------- | ------------ | ---------------------------------------------------- |
| title       | true     | string    | -            | dialog title message.                                |
| description | true     | ReactNode | -            | body of dialog.                                      |
| closeText   | true     | string    | -            | close button text.                                   |
| top         | false    | number    | -            | Specifies the top position of the Dialog content.    |
| right       | false    | number    | -            | Specifies the right position of the Dialog content.  |
| bottom      | false    | number    | -            | Specifies the bottom position of the Dialog content. |
| left        | false    | number    | -            | Specifies the left position of the Dialog content.   |

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
      <button onClick={onClickOpen}>open dialog</button>
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
| isOpen         | true     | boolean                                      | -            | Whether to display a Dialog.                                                                                |
| onClickClose   | true     | () => void                                   | -            | Handler function when clicking on close button and overlay.                                                 |
| title          | true     | string                                       | -            | dialog title message.                                                                                       |
| closeText      | true     | string                                       | -            | close button text.                                                                                          |
| actionText     | true     | string                                       | -            | action button text.                                                                                         |
| actionTheme    | true     | 'primary' &#124; 'secondary' &#124; 'danger' | -            | action button style theme.                                                                                  |
| onClickAction  | true     | (closeDialog: () => void) => void            | -            | Handler function when clicking on action button.<br />accepts a function that closes dialog as an argument. |
| children       | true     | ReactNode                                    | -            | body of dialog.                                                                                             |
| actionDisabled | false    | boolean                                      | false        | whether action button should be disabled.                                                                   |
| top            | false    | number                                       | -            | Specifies the top position of the Dialog content.                                                           |
| right          | false    | number                                       | -            | Specifies the right position of the Dialog content.                                                         |
| bottom         | false    | number                                       | -            | Specifies the bottom position of the Dialog content.                                                        |
| left           | false    | number                                       | -            | Specifies the left position of the Dialog content.                                                          |

ActionDialogContent

| Name           | Required | Type                                         | DefaultValue | Description                                                                                                 |
| -------------- | -------- | -------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------- |
| title          | true     | string                                       | -            | dialog title message.                                                                                       |
| closeText      | true     | string                                       | -            | close button text.                                                                                          |
| actionText     | true     | string                                       | -            | action button text.                                                                                         |
| actionTheme    | true     | 'primary' &#124; 'secondary' &#124; 'danger' | -            | action button style theme.                                                                                  |
| onClickAction  | true     | (closeDialog: () => void) => void            | -            | Handler function when clicking on action button.<br />accepts a function that closes dialog as an argument. |
| children       | true     | ReactNode                                    | -            | body of dialog.                                                                                             |
| actionDisabled | false    | boolean                                      | false        | whether action button should be disabled.                                                                   |
| top            | false    | number                                       | -            | Specifies the top position of the Dialog content.                                                           |
| right          | false    | number                                       | -            | Specifies the right position of the Dialog content.                                                         |
| bottom         | false    | number                                       | -            | Specifies the bottom position of the Dialog content.                                                        |
| left           | false    | number                                       | -            | Specifies the left position of the Dialog content.                                                          |
