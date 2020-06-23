# HeadlineArea

```tsx
import { HeadlineArea } from 'smarthr-ui'

<HeadlineArea
  heading={{ heading: 'HeadlineArea', tag: 'h1' }}
  description="Description message."
  className="className"
/>
```

## props

| Name        | Required | Type          | DefaultValue                  | Description                                                    |
| ----------- | -------- | ------------- | ----------------------------- | ---------------------------------------------------------------|
| heading     | true     | **object**    | [reference Heading](#Heading) | The Content of the Headline Area [reference Heading](#Heading) |
| description | false    | **ReactNode** | undefined                     | description message.                                           |
| className   | false    | **string**    | ''                            | `className` of component.                                      |

### Heading

| Name        | Required | Type          | DefaultValue | Description                                                       |
| ----------- | -------- | ------------- | ------------ | ----------------------------------------------------------------- |
| heading     | true     | **ReactNode** | -            | The Content of the HeadlineArea                                   |
| tag         | false    | **string**    | 'h1'         | The tag of the Heading. ([reference](/?path=/story/heading--all)) |
