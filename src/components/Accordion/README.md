# AppBar

```tsx
import { Accordion, AccordionTrigger, AccordionContent } from 'smarthr-ui'

<Accordion name="accordion" expanded={true} onClick={handleClick}>
  <AccordionTrigger icon="none">accodion trigger</AccordionTrigger>
  <AccordionContent>
    <Content>accordion content</Content>
  </AccordionContent>
</Accordion>
```

## props

### Accordion component

| Name     | Required | Type         | DefaultValue | Description                                                                                          |
| -------- | -------- | ------------ | ------------ | ---------------------------------------------------------------------------------------------------- |
| name     | ✓        | **string**   | -            | Name for Accordion                                                                                   |
| expanded | ✓        | **boolean**  | false        | If true, expands the panel, otherwise collapse the panel.                                            |
| onClick  | ✓        | **function** | -            | Fires when the AccordionTrigger clicked. <br><br>function: (name: string, expanded: boolean) => void |

### AccordionTrigger component

| Name | Required | Type                                          | DefaultValue | Description                                            |
| ---- | -------- | --------------------------------------------- | ------------ | ------------------------------------------------------ |
| icon | -        | **string** <br> left &#124; right &#124; none | left         | Position of icon. If sets 'none', icon is not display. |
