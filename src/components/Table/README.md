# Table

```tsx
import { Table, Body, Head, Row, Cell } from 'smarthr-ui'

<Table>
  <Head>
    <Row>
      <Cell>cell</Cell>
      <Cell>cell</Cell>
      <Cell>cell</Cell>
    </Row>
  </Head>
  <Body>
    <Row>
      <Cell>cell</Cell>
      <Cell>cell</Cell>
      <Cell>cell</Cell>
    </Row>
    <Row>
      <Cell>cell</Cell>
      <Cell>cell</Cell>
      <Cell>cell</Cell>
    </Row>
  </Body>
</Table>
```

## props

### Table

| Name      | Required | Type       | DefaultValue | Description             |
| --------- | -------- | ---------- | ------------ | ----------------------- |
| className | -        | **string** | -            | className for component |

### Head

| Name      | Required | Type       | DefaultValue | Description             |
| --------- | -------- | ---------- | ------------ | ----------------------- |
| className | -        | **string** | -            | className for component |

### Body

| Name      | Required | Type       | DefaultValue | Description             |
| --------- | -------- | ---------- | ------------ | ----------------------- |
| className | -        | **string** | -            | className for component |

### Row

| Name      | Required | Type       | DefaultValue | Description             |
| --------- | -------- | ---------- | ------------ | ----------------------- |
| className | -        | **string** | -            | className for component |

### Cell

| Name        | Required | Type           | DefaultValue | Description                                      |
| ----------- | -------- | -------------- | ------------ | ------------------------------------------------ |
| className   | -        | **string**     | -            | className for component                          |
| highlighted | -        | **boolean**    | false        | If true, the cell has a className of highlighted |
| colSpan     | -        | **number**     | -            | Indicates for how many columns the cell extends. |
| rowSpan     | -        | **number**     | -            | Indicates for how many rows the cell extends.    |
| onClick     | -        | **() => void** | -            | Fires when clicked.                              |
