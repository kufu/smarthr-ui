# Select

```tsx
import { Select } from 'smarthr-ui'

<Select
  value="orange"
  options={[
    { label: 'Select fruit', value: '' },
    { label: 'apple', value: 'apple' },
    {
      label: 'citrus',
      options: [
        { label: 'orange', value: 'orange' },
        { label: 'lemon', value: 'lemon' },
        { label: 'grapefruit', value: 'grapefruit' },
      ],
    },
    { label: 'banana', value: 'banana' },
  ]}
/>
```

## props

| Name           | Required | Type                               | DefaultValue             | Description                                                     |
| -------------- | -------- | ---------------------------------- | ------------------------ | --------------------------------------------------------------- |
| options        | ✓        | **Array<Option \| Optgroup>**      | -                        | Option list in select.                                          |
| error          | -        | **boolean**                        | false                    | Whether the input value has any errors.                         |
| width          | -        | **number | string**                | 260                      | Width of style.                                                 |
| hasBlank       | -        | **boolean**                        | false                    | Show blank item in select.                                      |
| blankLabel     | -        | **string**                         | '選択してください'       | Set blank item text.                                            |
