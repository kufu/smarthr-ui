# MultiComboBox

```tsx
import { MultiComboBox } from 'smarthr-ui'

const Component = () => (
  <MultiComboBox
    items={[{ value: 'value-1', label: 'label-1', disabled: true }]}
    selectedItems={[{ value: 'value-1', label: 'label-1', deletable: true }]}
    name="multi-combo-box"
    disabled
    error
    creatable
    placeholder="Please input"
    width={300}
    className="sample-class-name"
    onChange={(e) => console.log(e)}
    onAdd={(label) => console.log(label)}
    onDelete={(option) => console.log(option)}
    onSelect={(option) => console.log(option)}
  />
)
```

## props

### MultiComboBox

| Name          | Required | Type                                                             | DefaultValue | Description                                                       |
| ------------- | -------- | ---------------------------------------------------------------- | ------------ | ----------------------------------------------------------------- |
| items         | ✓        | **Array<{ value: string; label: string; disabled?: boolean }>**  | -            | A list of items to choose from.                                   |
| selectedItems | ✓        | **Array<{ value: string; label: string; deletable?: boolean }>** | -            | A list of items that have already been selected.                  |
| name          | -        | **string**                                                       | ''           | The value of the input `name` attribute.                          |
| disabled      | -        | **boolean**                                                      | false        | The value of the input `disabled` attribute.                      |
| error         | -        | **boolean**                                                      | false        | If true, the outline of this component will be DANGER color.      |
| creatable     | -        | **boolean**                                                      | false        | If true, you can add new item that do not exist in `items` props. |
| placeholder   | -        | **string**                                                       | ''           | The value of the input `placeholder` attribute.                   |
| width         | -        | **number \| string**                                             | 'auto'       | The value given to the width style of input.                      |
| className     | -        | **string**                                                       | ''           | The `className` given to the outermost element of this component. |
| onChange      | -        | **(e: ChangeEvent<HTMLInputElement>) => void**                   | undefined    | Fire when the value of input changes.                             |
| onAdd         | -        | **(label: string) => void**                                      | undefined    | Fire when adding an item that does not exist in `items` props.    |
| onDelete      | ✓        | **(option: { value: string; label: string }) => void**           | -            | Fire when clicking the delete element of `selectedItems` button.  |
| onSelect      | ✓        | **(option: { value: string; label: string }) => void**           | -            | Fire when clicking an element of `items`.                         |
