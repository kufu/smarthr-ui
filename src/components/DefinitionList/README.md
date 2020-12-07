# DefinitionList

```tsx
import { DefinitionList } from 'smarthr-ui'

<DefinitionList
  items={[
    {
      term: 'term 1',
      description: 'description 1',
    },
    {
     term: 'term 2',
      description: 'description 2',
    },
    {
      term: 'term 3',
      description: 'description 3',
    },
  ]}
/>
```

## props

### DefinitionList

| Name         | Required | Type                                            | DefaultValue | Description                   |
| ------------ | -------- | ----------------------------------------------- | ------------ | ----------------------------- |
| items        | ✓        | **DefinitionListItemProps[]**                   | -            | Data to be actually displayed |
| layout       | -        | **'single' &#124; 'double' &#124; 'triple'**    | `'single'`   | Column layout config          |
| className    | -        | **string**                                      | `''`         | `className` of component      |

## DefinitionListItemProps

| Name         | Required | Type                                                                               | DefaultValue | Description                              |
| ------------ | -------- | ---------------------------------------------------------------------------------- | ------------ | ---------------------------------------- |
| term         | ✓        | **ReactNode**                                                                      | -            | Term to be explained                     |
| description  | ✓        | **ReactNode**                                                                      | -            | Description for the term                 |
| termTag      | -        | **'h1' &#124; 'h2' &#124; 'h3' &#124; 'h4' &#124; 'h5' &#124; 'h6' &#124; 'span'** | `'span'`     | Type of html tag that wraps term element |
| className    | -        | **string**                                                                         | `''`         | `className` of component                 |