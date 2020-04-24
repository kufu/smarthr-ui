# RightFixedNote

```tsx
import { RightFixedNote } from 'smarthr-ui'

const sampleItems = [
  {
    id: 'id-1',
    text: 'コメントテキストテキストテキストテキストテキストテキスト',
    date: '2020/4/15 16:20:00',
    author: 'test@smarthr.co.jp',
  },
  {
    id: 'id-2',
    text: 'コメントテキストテキストテキストテキストテキストテキスト',
    date: '2020/4/15 16:20:00',
    author: 'test@smarthr.co.jp',
  },
  {
    id: 'id-3',
    text: 'コメントテキストテキストテキストテキストテキストテキスト',
    date: '2020/4/15 16:20:00',
    author: 'test@smarthr.co.jp',
  },
]

<RightFixedNote
  title="Component Title"
  items={sampleItems}
  onSubmit={action('submit!')}
  onClickEdit={action('click edit!!')}
/>
```

## props

| Name          | Required | Type                                                                         | DefaultValue | Description                                                                                                                       |
| ------------- | -------- | ---------------------------------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| title         | -        | **string**                                                                   | -            | The title of component                                                                                                            |
| items         | -        | **ItemProps**                                                                | -            |                                                                                                                                   |
| submitLabel   | -        | **string**                                                                   | '送信'       | Label of submit button                                                                                                            |
| width         | -        | **number**                                                                   | 270          | Width of component                                                                                                                |
| textareaLabel | -        | **string**                                                                   | -            | `aria-label` of textarea                                                                                                          |
| onClickEdit   | ✓        | **(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => void** | -            | Fired when the EditButton is clicked <br><br>`function: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => void` |
| onSubmit      | ✓        | **(e: React.FormEvent<HTMLFormElement>, text: string) => void**              | -            | Fired when the SubmitButton is clicked <br><br>`function: (e: React.FormEvent<HTMLFormElement>, text: string) => void`            |

# ItemProps

| Name      | Required | Type       | DefaultValue | Description                     |
| --------- | -------- | ---------- | ------------ | ------------------------------- |
| id        | ✓        | **string** | -            | The ID for onClick event        |
| text      | -        | **string** | -            | Content of component            |
| date      | -        | **string** | -            | Date of added this component    |
| author    | -        | **string** | -            | Author who is saying about text |
| editLabel | -        | **string** | '編集'       | `aria-label` of EditButton      |
