# InputFile

```tsx
import { InputFile } from 'smarthr-ui'
```

```tsx
<InputFile label="Choose File" onChange={handleChange} hasFileList={hasFileList} multiple />
```

## props

**InputFile**

This component has the same props of the original [input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) except for the following.

| Name        | Required | Type                        | DefaultValue | Description                                        |
| ----------- | -------- | --------------------------- | ------------ | -------------------------------------------------- |
| size        | -        | **'default' \| 's'**        | 'default'    | Size of the component.                             |
| label       | ✓        | **string**                  | -            | Label for the button.                              |
| onChange    | -        | **(files: File[]) => void** | -            | Fired when the selected files are changed.         |
| hasFileList | -        | **boolean**                 | true         | If false, the selected file list is not displayed. |
