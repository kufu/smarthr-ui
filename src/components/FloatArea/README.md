# FloatArea

```tsx
import { useState } from 'react'
import {
  FloatArea,
} from 'smarthr-ui'

const FloatAreaSample: React.VFC = () => {
  const [visible, setVisible] = useState(true)

  return (
    <FloatArea
      primaryButton={<PrimaryButton>Submit</PrimaryButton>}
      secondaryButton={<SecondaryButton>Cancel</SecondaryButton>}
      tertiaryButton={<SecondaryButton>preview</SecondaryButton>}
      errorIcon={<FaExclamationTriangleIcon color="#e01e5a" />}
      errorText="This is the error text."
      width="80%"
      top={40}
      left={40}
    />
  )
}
```

## props

### FloatArea component

| Name      | Required | Type | DefaultValue | Description                                               |
| --------- | -------- | ----------------------------------------------------- | ------------ | --------------------------------------------------------- |
| primaryButton   | ✓        | **ReactNode**                                           | -            | This is for PrimaryButton or PrimaryButtonAnchor component.                         |
| secondaryButton      |          | **ReactNode** | -            | This is for SecondaryButton or SecondaryButtonAnchor component.                               |
| tertiaryButton      |          | **ReactNode**                                            | -            | Use a button that will be placed in the tertiaryArea.                                                         |
| errorIcon |          | **FaExclamationCircleIcon \| FaExclamationTriangleIcon**                                            | -            | This is for FaExclamationCircleIcon or FaExclamationTriangleIcon component.                                |
| errorText   |          | **() => void**                                        | -            | If false, text is not display. 
| width   |          | **string**                                         | 80%            | FloatArea width.
| top   |          | **number**                                         | -            | value of position.
| right   |          | **number**                                         | -            | value of position.
| bottom   |          | **number**                                         | -            | value of position.
| left   |          | **number**                                         | -            | value of position.
| zIndex   |          | **number**                                         | -            | value of zIndex.