# Textarea

```tsx
import { Textarea } from 'smarthr-ui'
```

```tsx
<Textarea value={value} onChange={handleChange} width="100%" error={hasError} autoFocus />
```

## props

### Textarea

This component has the same props of the original [textarea](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea).

| Name      | Required | Type                 | DefaultValue | Description                                    |
| --------- | -------- | -------------------- | ------------ | ---------------------------------------------- |
| autoFocus | -        | **boolean**          | -            | Whether the textarea is focused automatically. |
| error     | -        | **boolean**          | -            | Whether the input value has any errors.        |
| width     | -        | **number \| string** | -            | Width of style.                                |
