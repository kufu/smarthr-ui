# Heading

```tsx
import { Heading } from 'smarthr-ui'

<Heading type="screenTitle" tag="h1">
  TitleText
</Heading>
```

## props

| Name      | Required | Type                                                                                                         | DefaultValue  | Description              |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------ | ------------- | ------------------------ |
| children  | ✓        | **React.ReactNode**                                                                                          | -             | displayed text           |
| type      | -        | **'screenTitle' &#124; 'sectionTitle' &#124; 'blockTitle' &#124; 'subBlockTitle' &#124; 'subSubBlockTitle'** | 'screenTitle' | style for the text       |
| tag       | -        | **'h1' &#124; 'h2' &#124; 'h3' &#124; 'h4' &#124; 'h5' &#124; 'h6' &#124; 'span'**                           | 'h1'          | HTML tag                 |
| className | -        | **string**                                                                                                   | ''            | `className` of component |
