# FieldSet

```tsx
import { FieldSet } from 'smarthr-ui'

const Component: React.FC = () => (
  <FieldSet label="field name" />
)

// When the component has children, default input element will be replaced by them. 
const CustomComponent: React.FC = () => (
  <FieldSet label="field name">
    <SomeYourCustomElement />
  </FieldSet>
)
```

## props

| Name         | Required | Type                                                                                                                                                                                                     | DefaultValue    | Description                                                       |
|--------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|------------------------------------------------------------------|
| label        | ✓        | **string**                                                                                                                                                                                               | -               | Label name                                                        |
| labelType    | -        | **'screenTitle' &#124; 'sectionTitle' &#124; 'blockTitle' &#124; 'subBlockTitle' &#124; 'subSubBlockTitle'**                                                                                             | 'subBlockTitle' | Label type                                                        |
| labelTagType | -        | **'h1' &#124; 'h2' &#124; 'h3' &#124; 'h4' &#124; 'h5' &#124; 'h6' &#124; 'span'**                                                                                                                       | 'span'          | Type of HTML element for the label name                           |
| required     | -        | **boolean**                                                                                                                                                                                              | -               | When true, required label is added                                |
| errorMessage | -        | **string &#124; string[]**                                                                                                                                                                               | -               | Error messages displayed under the input field                    |
| helpMessage  | -        | **string**                                                                                                                                                                                               | -               | Helper message displayed under the input field                    |
| labelSuffix  | -        | **ReactNode**                                                                                                                                                                                            | ''              | Optional element appended after the name label and required label |
| className    | -        | **string**                                                                                                                                                                                               | -               | Class name                                                        |
| type         | -        | **'text' &#124; 'search' &#124; 'tel' &#124; 'url' &#124; 'email' &#124; 'password' &#124; 'datetime' &#124; 'date' &#124; 'month' &#124; 'week' &#124; 'time' &#124; 'datetime-local' &#124; 'number'** | -               | Type of input element                                             |
| width        | -        | **number &#124; string**                                                                                                                                                                                 | -               | Width of the element                                              |
| autoFocus    | -        | **boolean**                                                                                                                                                                                              | -               | Whether it should be focused automatically                        |

And it also takes properties available for HTMLInputElement.
