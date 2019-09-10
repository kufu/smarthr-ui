# TabBar

```tsx
import { TabBar, TabItem } from 'smarthr-ui'

<TabBar>
  <TabItem id="1" onClick={action('clicked')}>Tab</TabItem>
  <TabItem id="2" onClick={action('clicked')} selected>Selected</TabItem>
  <TabItem id="3" onClick={action('clicked')} disabled>Disabled</TabItem>
</TabBar>
```

## props

### TabBar

| Name      | Required | Type        | DefaultValue | Description                                  |
| --------- | -------- | ----------- | ------------ | -------------------------------------------- |
| bordered  | -        | **boolean** | true         | If true, display border on bottom of TabBar. |
| className | -        | **string**  | -            | `className` for component.                   |

### TabItem

| Name      | Required | Type        | DefaultValue | Description                                                                                                                 |
| --------- | -------- | ----------- | ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| children  | ✓        | **string**  | -            | Display children on Tab                                                                                                        |
| id        | ✓        | **string**  | -            | Id for Tab                                                                                                                  |
| selected  | -        | **boolean** | false        | If true, Tab changes to selected style.                                                                                     |
| disabled  | -        | **boolean** | false        | If true, Tab changes to selected style, and not clickable.                                                                  |
| onClick   | ✓        | **func**    | -            | Fired when the Tab is clicked. <br/><br/>**Signature:**<br/> `function(id: string) => void` <br> _id_ : id given to the tab |
| className | -        | **string**  | -            | `className` for component.                                                                                                  |
