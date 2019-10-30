# AppBar

```tsx
import { AccordionPanel, AccordionPanelTrigger, AccordionPanelContent } from 'smarthr-ui'

<AccordionPanel name="accordionPanel" expanded={true} icon="none" onClick={handleClick}>
  <AccordionPanelTrigger>Accordion panel trigger</AccordionPanelTrigger>
  <AccordionPanelContent>
    <Content>Accordion panel content</Content>
  </AccordionPanelContent>
</AccordionPanel>
```

## props

### Accordion component

| Name     | Required | Type                                          | DefaultValue | Description                                                                                          |
| -------- | -------- | --------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------- |
| name     | ✓        | **string**                                    | -            | Name for AccordionPanel                                                                                   |
| expanded | ✓        | **boolean**                                   | false        | If true, expands the panel, otherwise collapse the panel.                                            |
| icon     | -        | **string** <br> left &#124; right &#124; none | left         | Position of icon. If sets 'none', icon is not display.                                               |
| onClick  | ✓        | **function**                                  | -            | Fires when the AccordionPanelTrigger clicked. <br><br>function: (name: string, expanded: boolean) => void |
