# FlashMessage

```tsx
import {
  FlashMessage,
} from 'smarthr-ui'

interface State {
  visible: boolean
}

class FlashMessageExample {
  public state = {
    visible: true,
  }

  public render() {
    const { visible } = this.state

    return (
      <FlashMessage type="success" text="Hello, FlashMessage." visible={visible} onClose={this.onClose} />
    )
  }

  private onClose = () => {
    this.setState((state) => ({ visible: false }))
  }
}
```

## props

### FlashMessage component

| Name      | Required | Type                                                  | DefaultValue | Description                                               |
| --------- | -------- | ----------------------------------------------------- | ------------ | --------------------------------------------------------- |
| visible   | ✓        | **boolean**                                           | -            | If true, FlashMessage is display.                         |
| type      | ✓        | **'success' \| 'info' \| 'warning' \| 'error' \| ''** | -            | Icon type prop.                                           |
| text      | ✓        | **string**                                            | -            |                                                           |
| className |          | **string**                                            | ''           | className of FlashMessage.                                |
| onClose   | ✓        | **function**                                          | -            | Fired when the Close button is clicked or wait 8000 msec. |
