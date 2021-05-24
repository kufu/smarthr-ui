# TextLink

```tsx
import { TextLink } from 'smarthr-ui'
```

```tsx
<TextLink href={href} onClick={handleClick}>TextLink content.</>
```

## props

### TextLink

This component has the same props of the original [a: Then Anchor element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a).

| Name      | Required | Type                 | DefaultValue   | Description                                                                                                                |
| --------- | -------- | -------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------- |
| suffix    | -        | **ReactNode**        | -              | Set a Fa\*\*\*Icon or Other Icon component to be displayed previous to the button text.                                    |
| prefix    | -        | **ReactNode**        | -              | Set a Fa\*\*\*Icon or Other Icon component to be displayed next to the button text.                                        |
| href      | -        | **String**           | '' | undefined | Default value of href is '' to enable focus. if href & onClick are undefined, the default value of href will be undefined. |

