# HeadlineArea

```tsx
import { HeadlineArea } from 'smarthr-ui'

<HeadlineArea
  heading={{ children: 'HeadlineArea', tag: 'h1' }}
  description="Description message."
  className="className"
/>
```

## props

| Name        | Required | Type                                | DefaultValue | Description                     |
| ----------- | -------- | ----------------------------------- | ------------ | ------------------------------- |
| heading     | ✓        | **Heading ([reference](#Heading))** | -            | The Content of the Heading Area |
| description | -        | **ReactNode**                       | -            | description message.            |
| className   | -        | **string**                          | ''           | `className` of component.       |

### Heading

| Name     | Required | Type                                                       | DefaultValue | Description                                                       |
| -------- | -------- | ---------------------------------------------------------- | ------------ | ----------------------------------------------------------------- |
| children | ✓        | **ReactNode**                                              | -            | The Content of the HeadlineArea                                   |
| tag      | -        | **'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6' \| 'span'** | 'h1'         | The tag of the Heading. ([reference](/?path=/story/heading--all)) |
