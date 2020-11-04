# StatusLabel

```tsx
import { StatusLabel } from 'smarthr-ui'

<StatusLabel type="require">必須</StatusLabel>
```

## props

| Name       | Required | Type                              | DefaultValue | Description                                                       |
| ---------- | -------- | --------------------------------- | ------------ | ----------------------------------------------------------------- |
| skeleton     | -        | **boolean** <br> true &#124; false | false            | Set transparent background when its true  |
| type | ✓           | **enum** <br> `'done'` &#124; `'success'` &#124; `'process'` &#124; `'required'` &#124; `'disabled'` &#124; `'must'` &#124; `'warning'` &#124; `'error'` | 'done'            | Can be set type of tag   |
