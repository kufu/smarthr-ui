# RadioButton

```tsx
import { RadioButton } from 'smarthr-ui'

<RadioButton name="sample" checked onChange={(e) => console.log(e)}>
  Radio button label sample.
</RadioButton>
```

## props

This component has the same props of the original [\<input type="radio" /\>](https://developer.mozilla.org/ja/docs/Web/HTML/Element/input/radio).

| Name     | Required | Type                | DefaultValue | Description                                                           |
| -------- | -------- | ------------------- | ------------ | --------------------------------------------------------------------- |
| children | -        | **React.ReactNode** | -            | If children prop is passed, the radio button label will be displayed. |
