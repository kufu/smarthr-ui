# Input

```tsx
import { Input } from 'smarthr-ui'


const Component: React.FC = () => (

  // text Input
  <Input type="text" defaultValue="string" />

  // number Input
  <Input type="number" defaultValue="1" />

  // number Input with thousandsSeparated prop
  <Input type="number" thousandsSeparated defaultValue="1,000.1234 " />

  // password Input
  <Input type="password" defaultValue="password" />

  // placeholder Input
  <Input placeholder="string" />

  // Input with width prop
  <Input defaultValue="width: 100%" width="100%" />

  // Input with onChange prop
  <Input onChange={action('onChange!!')} />

  // Input with onBlue prop
  <Input onBlur={action('onBlur!!')} />

  // Input with disabled prop
  <Input disabled={true} />

  // Input with disabled prop
  <Input error={true} />
)

```


## props

| Name               | Required | Type                     | DefaultValue | Description                      |
| ------------------ | -------- | ------------------------ | ------------ | -------------------------------- |
| type               | -        | **'text' &#124; 'search' &#124; 'tel' &#124; 'url' &#124; 'email' &#124; 'password' &#124; 'datetime' &#124; 'date' &#124; 'month' &#124; 'week' &#124; 'time' &#124; 'datetime-local' &#124; 'number'** | undefined    | Type of input.                   |
| onFocus            | -        | **() => void**           | undefined    | Fires when the component is focused.                                 |
| onBlur             | -        | **() => void**           | undefined    | Fires when the component is unfocused. |
| autoFocus          | -        | **boolean**              | false        | Whether it should be focused automatically.                          |
| thousandsSeparated | -        | **boolean**              | false        | If `true`, the number will be separated every 3 digits with a comma. |
| width              | -        | **string &#124; number** | auto         | Width of input.                                                      |
| error              | -        | **boolean**              | false        | If `true`, the border color will change to a error intended color.     |

And it also takes properties available for HTMLInputElement.