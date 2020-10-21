# DropZone

```tsx
import { DropZone } from 'smarthr-ui'

<DropZone onDropFiles={onDropFiles} onSelectFiles={onSelectFiles} accept="image/*">
  <p>Drop your files here.</p>
</DropZone>
```

## props

| Name          | Required | Type         | DefaultValue | Description                                                                                                                |
| ------------- | -------- | ------------ | ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| onSelectFiles | ✓         | **function** | -            | Fired when files are selected by dropping or through the button. Arguments are Event object and FileList object.<br><br>function: (e: DragEvent<HTMLElement> | ChangeEvent<HTMLInputElement>, files: FileList | null) => void                |
| accept        | -        | **string**   | ''           | One or more unique file type specifiers describing file types to allow to select.<br><b>(Not affect to dropping files)</b> |
