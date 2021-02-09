# Balloon

```tsx
import { DarkBalloon, LightBalloon } from './Balloon'

<>
  <LightBalloon horizontal="center" vertical="bottom">
    LightBalloon
  </LightBalloon>
  <DarkBalloon horizontal="right" vertical="top">
    DarkBalloon
  </DarkBalloon>
</>
```

## props

| Name         | Required | Type                              | DefaultValue | Description                  |
| ------------ | -------- | --------------------------------- | ------------ | ---------------------------- |
| horizontal   | ✓        | **'right' | 'center' | 'left'**   | -            | horizontal position          |
| vertical     | ✓        | **'top' | 'middle' | 'bottom'**   | -            | vertical position            |
| className    | -        | **string**                        | `''`         | `className` of component     |
| children     | -        | **ReactNode**                     | -            | target element for balloon   |
