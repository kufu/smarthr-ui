# SideNav

```tsx
import { SideNav } from 'smarthr-ui'

const const SideNavItems =  [
  {
    id: 'id-1',
    title: ' one!',
    isSelected: true,
  },
  {
    id: 'id-2',
    title: 'two!',
    isSelected: false,
  },
  {
    id: 'id-3',
    title: 'three!',
    isSelected: false,
  },
]

<SideNav items={SideNavItems} onClick={(e, id) => console.log(e, id)} />
```

## props

### SideNav

| Name          | Required | Type                                                                         | DefaultValue | Description                                                                                                                             |
| ------------- | -------- | ---------------------------------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| items         | ✓        | **SideNavItems**                                                             | -            | Data of each item.                                                                                                                      |
| size          | -        | **'default' \| 's'**                                                         | 'default'      | Size of each SideNavItemButton.                                                                                                         |
| onClick       | -        | **(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => void** | -            | Fired when the SideNavItemButton is clicked <br><br>`function: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => void`|


### SideNavItem

| Name       | Required | Type                | DefaultValue | Description                                                                         |
| ---------- | -------- | --------------------| ------------ | ----------------------------------------------------------------------------------- |
| id         | ✓        | **string**          | -            | The ID for onClick event                                                            |
| title      | ✓        | **string**          | -            | Content of component                                                                |
| prefix     | -        | **React.ReactNode** | -            | The content of the prefix of title.<br>Normally, this is for statuslabel insertion. |
| isSelected | -        | **boolean**         | false        | Whether to give active style.                                                       |
