# LineClamp

```tsx
import { LineClamp } from 'smarthr-ui'

<LineClamp maxLines={3} withTooltip>
  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
  the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of
  type and scrambled it to make a type specimen book. It has survived not only five centuries, but
  also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in
  the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently
  with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
</LineClamp>
```

## props

| Name        | Required | Type          | DefaultValue | Description                                    |
| ----------- | -------- | ------------- | ------------ | ---------------------------------------------- |
| maxLines    | -        | **number**    | 3          | Number of lines to be ellipsis.                |
| withTooltip | -        | **boolean**   | false      | ToolTip is enabled when ellipsis is displayed. |
| tooltipType | -        | **'light' &#124; 'dark'**   | 'light'      | Theme type of ToolTip. |
| className   | -        | **string**    | -           | Overwrite style.                               |
| children    | ✓        | **ReactNode** | -           | The Description of this area.                  |
