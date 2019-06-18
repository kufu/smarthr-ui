# AppBar

```tsx
import { AppBar } from 'smarthr-ui'

<AppBar pcSize="l" tabletSize="m" spSize="s">
  AppBar Component
</AppBar>
```

## props

| Name       | Required | Type                              | DefaultValue | Description                                                       |
| ---------- | -------- | --------------------------------- | ------------ | ----------------------------------------------------------------- |
| pcSize     | -        | **enum** <br> s &#124; m &#124; l | m            | Size of left and right padding when innerWidth is 1000px or more  |
| tabletSize | -        | **enum** <br> s &#124; m &#124; l | m            | Size of left and right padding when innerWidth is 600px or more   |
| spSize     | -        | **enum** <br> s &#124; m &#124; l | m            | Size of left and right padding when innerWidth is less than 599px |

The number of mediaQuery can be overwritten by the user.
