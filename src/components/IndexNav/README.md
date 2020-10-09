# IndexNav

```tsx
import { IndexNav } from 'smarthr-ui'

function MyApp() {
  return (
    <IndexNav
      items={[
        { label: 'index 1', href: '/path/to/1' },
        { label: 'index 2', href: '/path/to/2', current: true },
        {
          label: 'index 3',
          href: '/path/to/3',
          children: [
            { label: 'sub index 1', href: '/path/to/3_1' },
            { label: 'sub index 2', href: '/path/to/3_2' },
          ],
        },
      ]}
    />
  )
}
```

## props

### IndexNav

| Name  | Required | Type                    | DefaultValue | Description               |
| ----- | -------- | ----------------------- | ------------ | ------------------------- |
| items | true     | **IndexNavItemProps[]** | -            | Array of index item props |

### IndexNavItemProps

| Name     | Required | Type                    | DefaultValue | Description                |
| -------- | -------- | ----------------------- | ------------ | -------------------------- |
| label    | true     | **string**              | -            | Label of the index.        |
| href     | true     | **string**              | -            | Href of the index anchor.  |
| children | -        | **IndexNavItemProps[]** | -            | Child indexes.             |
| current  | -        | **boolean**             | -            | Flag of the current index. |
