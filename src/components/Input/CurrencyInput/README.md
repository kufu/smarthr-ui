# CurrencyInput

```tsx
import { CurrencyInput } from 'smarthr-ui'

function MyApp() {
  const [value, setValue] = React.useState('2000')

  return (
    <CurrencyInput
      value={value}
      onChange={(e) => {
        setValue(e.target.value)
      }}
      onFormatValue={(formatted) => {
        setValue(formatted)
      }}
    />
  )
}
```

## props

**CurrencyInput**

This component has props of `Input` component excluding `type` prop.

| Name          | Required | Type                        | DefaultValue | Description                                              |
| ------------- | -------- | --------------------------- | ------------ | -------------------------------------------------------- |
| value         | -        | **string**                  | -            | Value of input that is allowed only string type.         |
| defaultValue  | -        | **string**                  | -            | Default value of input that is allowed only string type. |
| onFormatValue | -        | **(value: string) => void** | -            | Handler Function when value formatted.                   |
