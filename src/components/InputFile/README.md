# InputFile

```tsx
import { InputFile } from 'smarthr-ui'
```

```tsx
<InputFile
  label="Choose File"
  files={files}
  onAdd={handleAddFiles}
  onDelete={handleDeleteFile}
  hasFileList={hasFileList}
  multiple
/>
```

## props

**InputFile**

This component has the same props of the original [input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) except for the following.

| Name        | Required | Type                           | DefaultValue | Description                                        |
| ----------- | -------- | ------------------------------ | ------------ | -------------------------------------------------- |
| size        | -        | **'default' \| 's'**           | 'default'    | Size of the component.                             |
| label       | ✓        | **string**                     | -            | Label for the button.                              |
| files       | -        | **File[]**                     | []           | Array of the selected files.                       |
| onAdd       | -        | **(addFiles: File[]) => void** | -            | Fired when any new files are selected.             |
| onDelete    | -        | **(index: number) => void**    | -            | Fired when the Delete file button is clicked.      |
| hasFileList | -        | **boolean**                    | true         | If false, the selected file list is not displayed. |
