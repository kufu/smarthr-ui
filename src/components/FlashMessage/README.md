# FlashMessage

```tsx
import { useState } from 'react'
import {
  FlashMessage,
} from 'smarthr-ui'

const FlashMessageExample: React.FC = () => {
  const [visible, setVisible] = useState(true)

  return (
    <FlashMessage type="success" text="Hello, FlashMessage." visible={visible} onClose={() => { setVisible(false) }} />
  )
}
```

## props

### FlashMessage component

| Name      | Required | Type                                                  | DefaultValue | Description                                               |
| --------- | -------- | ----------------------------------------------------- | ------------ | --------------------------------------------------------- |
| visible   | ✓        | **boolean**                                           | -            | If true, FlashMessage is display.                         |
| type      | ✓        | **'success' \| 'info' \| 'warning' \| 'error' \| ''** | -            | change Icon type and color.                               |
| text      | ✓        | **string**                                            | -            | -                                                         |
| className |          | **string**                                            | ''           | className of FlashMessage.                                |
| onClose   | ✓        | **() => void**                                        | -            | Fired when the Close button is clicked or wait 8000 msec. |
