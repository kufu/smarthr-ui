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
  title="FormGroup sample"
  titleType="subSubBlockTitle"
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
| title            | ✓        | **string**                                                                                                                                                                                               | -               | Title name                                                                                   |
| titleType        | -        | **'screenTitle' &#124; 'sectionTitle' &#124; 'blockTitle' &#124; 'subBlockTitle' &#124; 'subSubBlockTitle'**                                                                                             | -               | Type for title heading                                                                       |
| labelId          | -        | **string**                                                                                                                                                                                               | -               | ID for label                                                                                 |
| innerMargin      | -        | **'XXS' &#124; 'XS' &#124; 'S'**                                                                                                                                                                         | 'XS'            | margin between label and children                                                            |
| statusLabelProps | -        | **Array<ComponentProps\<typeof StatusLabel>>**                                                                                                                                                           | -               | Each statusLabelProps is passed to StatusLabel component and display them next to the label  |
| helpMessage      | -        | **string**                                                                                                                                                                                               | -               | Helper message displayed under the label                                                     |
| errorMessages    | -        | **string &#124; string[]**                                                                                                                                                                               | -               | Error messages displayed under the label                                                     |
| disabled         | -        | **boolean**                                                                                                                                                                                              | false           | Use `palette.TEXT_DISABLED` when disabled is set true                                        |
| className        | -        | **string**                                                                                                                                                                                               | -               | Class name which is passed to the wrapper element                                            |
| children         | ✓        | **React.ReactNode**                                                                                                                                                                                      | -               | Form component you want to wrap                                                              |
