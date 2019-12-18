# InformationPanel

```tsx
import { InformationPanel } from 'smarthr-ui'

<InformationPanel title={Panel Title} />
```

## props

| Name             | Required | Type                                                                                          | DefaultValue | Description                                                                         |
| ---------------- | -------- | --------------------------------------------------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------- |
| title            | ✓        | **string**                                                                                    | -            | The title of component                                                              |
| titleTag         | -        | **enum** <br/> 'h1' &#124; 'h2' &#124; 'h3' &#124; 'h4' &#124; 'h5' &#124; 'h6' &#124; 'span' | 'span'       | HTML tag of title                                                                   |
| type             | -        | **enum** <br/> 'success' &#124; 'info' &#124; 'warning' &#124; 'error'                        | 'info'       | Can be set type of component                                                        |
| openButtonLabel  | -        | **string**                                                                                    | '開く'       | Label of open button                                                                |
| closeButtonLabel | -        | **string**                                                                                    | '閉じる'     | Label of close button                                                               |
| active           | -        | **boolean**                                                                                   | `true`       | Panel open / closed state                                                           |
| className        | -        | **string**                                                                                    | ''           | `className` of component.                                                           |
| children         | ✓        | **React.ReactNode**                                                                           | -            | The content of component                                                            |
| onClickTrigger   | -        | **(active: boolean) => void**                                                                 | -            | Fired when the PanelButton is clicked <br><br>`function: (active: boolean) => void` |
