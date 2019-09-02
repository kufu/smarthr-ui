# TabBar

```tsx
import { TabBar, Tab } from 'smarthr-ui'

<TabBar>
  <Tab label="Tab" id="1" onClick={action('clicked')} />
  <Tab label="Selected" id="2" onClick={action('clicked')} selected />
  <Tab label="Disabled" id="3" onClick={action('clicked')} disabled />
</TabBar>
```

## props

### TabBar

| Name      | Required | Type        | DefaultValue | Description                                  |
| --------- | -------- | ----------- | ------------ | -------------------------------------------- |
| bordered  | -        | **boolean** | true         | If true, display border on bottom of TabBar. |
| className | -        | **string**  | -            | `className` for component.                   |

### Tab

| Name      | Required | Type        | DefaultValue | Description                                                                                                                 |
| --------- | -------- | ----------- | ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| label     | ✓        | **string**  | -            | Display label on Tab                                                                                                        |
| id        | ✓        | **string**  | -            | Id for Tab                                                                                                                  |
| selected  | -        | **boolean** | false        | If true, Tab changes to selected style.                                                                                     |
| disabled  | -        | **boolean** | false        | If true, Tab changes to selected style, and not clickable.                                                                  |
| onClick   | ✓        | **func**    | -            | Fired when the Tab is clicked. <br/><br/>**Signature:**<br/> `function(id: string) => void` <br> _id_ : id given to the tab |
| className | -        | **string**  | -            | `className` for component.                                                                                                  |
