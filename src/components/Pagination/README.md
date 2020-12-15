# Pagination

```tsx
import { Pagination } from 'smarthr-ui'

<Pagination current={7} total={13} onClick={action('click!!')} />

// without Numbers
<Pagination current={2} total={13} onClick={action('click!!')} withoutNumbers={true} />
```

## props

| Name           | Required | Type                               | DefaultValue | Description                                                     |
| -------------- | -------- | ---------------------------------- | ------------ | --------------------------------------------------------------- |
| total          | ✓        | **number**                         | -            | number of total items in pagination.                            |
| current        | ✓        | **number**                         | -            | number of current item in pagination.                           |
| onClick        | ✓        | **(pageNumber: number) => void**   | -            | link's click handler.                                           |
| padding        | -        | **number**                         | 4            | how many numbers will be shown before and after current page.   |
| className      | -        | **string**                         | ''           | className of pagination.                                        |
| withoutNumbers | -        | **boolean**                        | false        | without number-links in pagination.                             |

