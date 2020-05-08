# MessageScreen

```tsx
import { MessageScreen } from 'smarthr-ui'

<MessageScreen
  title="お探しのページはみつかりませんでした"
  links={[
    {
      label: 'ホームへ',
      url: 'http://example.com',
    },
  ]}
>
  <p>
    お探しのページは一時的にアクセスができない状況にあるか、
    <br />
    移動もしくは削除された可能性があります。
  </p>
</MessageScreen>
```

## props

| Name      | Required | Type                | DefaultValue | Description                                                     |
| --------- | -------- | ------------------- | ------------ | --------------------------------------------------------------- |
| title     | -        | **string**          | -            | title string to display at the top of the content               |
| links     | -        | **Link[]**          | -            | List of anchor elements to display at the bottom of the content |
| children  | -        | **React.ReactNode** | -            | children content                                                |
| className | -        | **string**          | ''           | className of wrapper div element                                |

### type of Link

| Name   | Required | Type       | DefaultValue | Description                                                         |
| ------ | -------- | ---------- | ------------ | ------------------------------------------------------------------- |
| label  | ✓        | **string** | -            | inner text of anchor element                                        |
| url    | ✓        | **string** | -            | href of anchor element                                              |
| target | -        | **string** | -            | target of anchor element. For "\_blank", ExternalIcon is displayed |
