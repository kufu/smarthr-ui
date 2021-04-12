# FormGroup

```tsx
import { FormGroup } from 'smarthr-ui'

const SampleStatusLabelProps = [
  {
    type: 'required',
    children: 'label 1',
  },
  {
    type: 'success',
    children: 'label 2',
  },
]

<FormGroup
  label="FormGroup sample"
  labelType="subSubBlockTitle"
  labelId="form-group-sample"
  innerMargin="XXS"
  statusLabelProps={SampleStatusLabelProps}
  helpMessage="help message text"
  errorMessages={['error message 1', 'error message 2']}
>
  <Input aria-labelledby="form-group-sample" />
</FormGroup>
```

## props

| Name             | Required | Type                                                                                                                                                                                                     | DefaultValue    | Description                                                                                  |
|------------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|----------------------------------------------------------------------------------------------|
| label            | ✓        | **string**                                                                                                                                                                                               | -               | Label name                                                                                   |
| titleTag         | -        | **'h1' &#124; 'h2' &#124; 'h3' &#124; 'h4' &#124; 'h5' &#124; 'h6' &#124; 'span'**                                                                                                                       | -               | Tag for title heading                                                                        |
| labelType        | -        | **'screenTitle' &#124; 'sectionTitle' &#124; 'blockTitle' &#124; 'subBlockTitle' &#124; 'subSubBlockTitle'**                                                                                             | 'blockTitle'    | Label type                                                                                   |
| labelId          | -        | **string**                                                                                                                                                                                               | -               | ID for label                                                                                 |
| innerMargin      | -        | **'XXS' &#124; 'XS' &#124; 'S'**                                                                                                                                                                         | 'XS'            | margin between label and children                                                            |
| statusLabelProps | -        | **Array<ComponentProps\<typeof StatusLabel>>**                                                                                                                                                           | -               | Each statusLabelProps is passed to StatusLabel component and display them next to the label  |
| helpMessage      | -        | **string**                                                                                                                                                                                               | -               | Helper message displayed under the label                                                     |
| errorMessages    | -        | **string &#124; string[]**                                                                                                                                                                               | -               | Error messages displayed under the label                                                     |
| children         | ✓        | **React.ReactNode**                                                                                                                                                                                      | -               | Form component you want to wrap                                                              |
| disabled         | -        | **boolean**                                                                                                                                                                                              | false           | Use `palette.TEXT_DISABLED` when disabled is set true                                        |
| className        | -        | **string**                                                                                                                                                                                               | -               | Class name which is passed to the wrapper element                                            |
