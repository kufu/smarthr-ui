# CurrencyInput

```tsx
import { CurrencyInput } from 'smarthr-ui'

function MyApp() {
  const [value, setValue] = React.useState('2000')

  return (
    <CurrencyInput
      value={value}
      onChangeValue={(changed) => {
        setValue(changed)
      }}
    />
  )
}
```

## props

**CurrencyInput**

This component has props of `Input` component excluding `type` and `defaultValue`.

| Name          | Required | Type                        | DefaultValue | Description                                                    |
| ------------- | -------- | --------------------------- | ------------ | -------------------------------------------------------------- |
| value         | -        | **string**                  | -            | Value of input, but it allows only string type.                |
| onChangeValue | -        | **(value: string) => void** | -            | Handler Function when value changed, or formatted to currency. |
