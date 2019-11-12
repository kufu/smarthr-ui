# AccordionPanel

```tsx
import {
  AccordionPanel,
  AccorionPanelItem,
  AccordionPanelTrigger,
  AccordionPanelContent,
} from 'smarthr-ui'
;<AccordionPanel
  iconPosition="right"
  displayIcon={true}
  expandableMultiply={true}
  defaultExpanded={['accordion-name']}
  onClick={handleClick}
>
  <AccorionPanelItem name="accordionPanel">
    <AccordionPanelTrigger>Accordion panel trigger</AccordionPanelTrigger>
    <AccordionPanelContent>
      <Content>Accordion panel content</Content>
    </AccordionPanelContent>
  </AccorionPanelItem>
</AccordionPanel>
```

## props

### AccordionPanel component

| Name               | Required | Type                              | DefaultValue | Description                                                                                      |
| ------------------ | -------- | --------------------------------- | ------------ | ------------------------------------------------------------------------------------------------ |
| iconPosition       | -        | **string** <br> left &#124; right | left         | Position of icon.                                                                                |
| displayIcon        | -        | **boolean**                       | true         | If false, icon is not display.                                                                   |
| expandableMultiply | -        | **boolean**                       | false        | If true, allow to expand accordion panel multiply.                                               |
| defaultExpanded    | -        | **string[]**                      | []           | Expands accordion with name matching value in array.                                             |
| onClick            | -        | **function**                      | -            | Fires when the AccordionPanelTrigger clicked. <br><br>function: (expandedList: string[]) => void |

### AccorionPanelItem component

| Name | Required | Type       | DefaultValue | Description              |
| ---- | -------- | ---------- | ------------ | ------------------------ |
| name | ✓        | **string** | -            | Name for AccordionPanel. |
