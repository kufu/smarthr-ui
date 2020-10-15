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
| heading     | ✓        | **object**    | [reference Heading](#Heading) | The Content of the Headline Area [reference Heading](#Heading) |
| description | -        | **ReactNode** | undefined                     | description message.                                           |
| className   | -        | **string**    | ''                            | `className` of component.                                      |

### Heading

| Name        | Required | Type          | DefaultValue | Description                                                       |
| ----------- | -------- | ------------- | ------------ | ----------------------------------------------------------------- |
| heading     | ✓        | **ReactNode** | -            | The Content of the HeadlineArea                                   |
| tag         | -        | **'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span'**    | 'h1'         | The tag of the Heading. ([reference](/?path=/story/heading--all)) |
