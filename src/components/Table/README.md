# AppBar

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

| Name    | Required | Type       | DefaultValue | Description                                      |
| ------- | -------- | ---------- | ------------ | ------------------------------------------------ |
| colspan | -        | **number** | -            | Indicates for how many columns the cell extends. |
| rowspan | -        | **number** | -            | Indicates for how many rows the cell extends.    |
| onClick | -        | () => void | -            | Fires when clicked.                              |
