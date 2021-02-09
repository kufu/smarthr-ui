# AppNavi

```tsx
import React, { FC, ReactNode } from 'react'
import { AppNavi, FaBirthdayCakeIcon, FaChartPieIcon, FaCogIcon, FaFileIcon, FaUserAltIcon } from 'smarthr-ui'

const CustomLink: FC<{ to: string; children: ReactNode }> = ({ to, children, ...props }) => (
  <a href={to} {...props}>
    {children}
  </a>
)
const buttons = [
  {
    children: 'current',
    icon: FaFileIcon,
    current: true,
  },
  {
    children: 'button',
    icon: FaUserAltIcon,
    onClick: () => console.log('click'),
  },
  {
    children: 'anchor',
    icon: FaCogIcon,
    href: 'http://www.google.com',
  },
  {
    children: 'dropdown',
    icon: FaChartPieIcon,
    dropdownContent: <div>dropdown content</div>,
  },
  {
    children: 'custom tag',
    icon: FaBirthdayCakeIcon,
    tag: CustomLink,
    to: 'http://www.google.com',
  },
]

const component = () => (
  <AppNavi label="label text" buttons={buttons}>
    <p>child component</p>
  </AppNavi>
)
```

## props

### AppNavi props

| Name                 | Required | Type                                                                                                 | DefaultValue | Description                                      |
| -------------------- | -------- | ---------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------ |
| label                | -        | **string**                                                                                           | -            | Label text.                                      |
| buttons              | -        | **Array<AppNaviButtonProps \| AppNaviAnchorProps \| AppNaviDropdownProps \| AppNaviCustomTagProps>** | -            | Button props array                               |
| isCurrentUnclickable | -        | **boolean**                                                                                          | false        | Whether to make current unclickable.             |
| children             | -        | **React.ReactNode**                                                                                  | -            | Element to be additionally displayed in AppNavi. |

### AppNaviButtonProps

| Name     | Required | Type                                                               | DefaultValue | Description                                                                        |
| -------- | -------- | ------------------------------------------------------------------ | ------------ | ---------------------------------------------------------------------------------- |
| children | ✓        | **React.ReactNode**                                                | -            | Button text.                                                                       |
| icon     | -        | - **Fa\*\*\*Icon component in Icon**<br /> - **IconProps['name']** | -            | - A Fa\*\*\*Icon component<br />- **\[DEPRECATED\]** the name of a Icon component. |
| current  | -        | **boolean**                                                        | false        | Whether to give active style.                                                      |
| onClick  | -        | **(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void**   | -            | Button's click handler.                                                            |

IconProps is props of Icon component.

### AppNaviAnchorProps

| Name     | Required | Type                                                               | DefaultValue | Description                                                                        |
| -------- | -------- | ------------------------------------------------------------------ | ------------ | ---------------------------------------------------------------------------------- |
| children | ✓        | **React.ReactNode**                                                | -            | Anchor text.                                                                       |
| href     | ✓        | **string**                                                         | -            | Href of anchor.                                                                    |
| icon     | -        | - **Fa\*\*\*Icon component in Icon**<br /> - **IconProps['name']** | -            | - A Fa\*\*\*Icon component<br />- **\[DEPRECATED\]** the name of a Icon component. |
| current  | -        | **boolean**                                                        | false        | Whether to give active style.                                                      |

### AppNaviDropdownProps

| Name            | Required | Type                                                               | DefaultValue | Description                                                                        |
| --------------- | -------- | ------------------------------------------------------------------ | ------------ | ---------------------------------------------------------------------------------- |
| children        | ✓        | **React.ReactNode**                                                | -            | Button text.                                                                       |
| dropdownContent | ✓        | **React.ReactNode**                                                | -            | Content of DropdownContent.                                                        |
| icon            | -        | - **Fa\*\*\*Icon component in Icon**<br /> - **IconProps['name']** | -            | - A Fa\*\*\*Icon component<br />- **\[DEPRECATED\]** the name of a Icon component. |
| current         | -        | **boolean**                                                        | false        | Whether to give active style.                                                      |

### AppNaviCustomTagProps

| Name     | Required | Type                                                               | DefaultValue | Description                                                                        |
| -------- | -------- | ------------------------------------------------------------------ | ------------ | ---------------------------------------------------------------------------------- |
| children | ✓        | **React.ReactNode**                                                | -            | Button text.                                                                       |
| tag      | ✓        | **React.ComponentType<any>**                                       | -            | Custom tag component.                                                              |
| icon     | -        | - **Fa\*\*\*Icon component in Icon**<br /> - **IconProps['name']** | -            | - A Fa\*\*\*Icon component<br />- **\[DEPRECATED\]** the name of a Icon component. |
| current  | -        | **boolean**                                                        | false        | Whether to give active style.                                                      |

and additional key value, `{ key: [string]: any }`.
