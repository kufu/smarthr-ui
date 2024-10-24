import test, { expect } from '@playwright/test'

/**
 * サーバーコンポーネントとして利用できるコンポーネント一覧(アルファベット順)
 */
const SERVER_COMPONENTS = [
  'AnchorButton',
  'AppNaviAnchor',
  'AppNaviButton',
  'AppNaviCustomTag',
  'Article',
  'Aside',
  'Badge',
  'Balloon',
  'Base',
  'BaseColumn',
  'Center',
  'Cluster',
  'Chip',
  'CompactInformationPanel',
  'DefinitionList',
  'ErrorScreen',
  'FloatArea',
  'HeaderLink',
  'Heading',
  'Icon',
  'Loader',
  'PageHeading',
  'RangeSeparator',
  'ResponseMessage',
  'SmartHRLogo',
  'SpreadsheetTable',
  'SpreadsheetTableCorner',
  'StatusLabel',
  'Table',
  'Td',
  'Text',
  'TextLink',
  'Th',
  'TimePicker',
  'UnstyledButton',
  'UpwardLink',
  'VisuallyHiddenText',
]

/**
 * サーバーコンポーネントでは利用できないコンポーネント一覧(アルファベット順)
 */
const CLIENT_COMPONENTS = [
  'AccordionPanel',
  'AccordionPanelContent',
  'AccordionPanelItem',
  'AccordionPanelTrigger',
  'ActionDialog',
  'ActionDialogContent',
  'ActionDialogWithTrigger',
  'AppLauncher',
  'AppNavi',
  'AppNaviDropdown',
  'AppNaviDropdownMenuButton',
  'BottomFixedArea',
  'BulkActionRow',
  'Button',
  'Calendar',
  'CheckBox',
  'CurrencyInput',
  'DatePicker',
  'Dialog',
  'DialogCloser',
  'DialogContent',
  'DialogTrigger',
  'DialogWrapper',
  'DropZone',
  'Dropdown',
  'DropdownCloser',
  'DropdownContent',
  'DropdownMenuButton',
  'DropdownTrigger',
  'EmptyTableBody',
  'Fieldset',
  'FilterDropdown',
  'FlashMessage',
  'FormControl',
  'FormDialog',
  'FormDialogContent',
  'Header',
  'HeaderDropdownMenuButton',
  'InformationPanel',
  'InputFile',
  'LanguageSwitcher',
  'LineClamp',
  'MessageDialog',
  'MessageDialogContent',
  'MessageScreen',
  'ModelessDialog',
  'MultiComboBox',
  'Nav',
  'NotificationBar',
  'PageCounter',
  'Pagination',
  'RadioButton',
  'RadioButtonPanel',
  'Reel',
  'RemoteDialogTrigger',
  'RemoteTriggerActionDialog',
  'RemoteTriggerFormDialog',
  'RemoteTriggerMessageDialog',
  'SearchInput',
  'Section',
  'SegmentedControl',
  'Select',
  'SideNav',
  'Sidebar',
  'SingleComboBox',
  'SortDropdown',
  'Stack',
  'Stepper',
  'Switch',
  'TabBar',
  'TabItem',
  'TableReel',
  'TdCheckbox',
  'Textarea',
  'ThCheckbox',
  'Tooltip',
  'WakuWakuButton',
]

test.describe('RSC対応コンポーネントがRSCで利用できること', () => {
  for (const component of SERVER_COMPONENTS) {
    test(component, async ({ page }) => {
      await page.goto(`http://localhost:3000/rsc_test/${component}`)
      await expect(page.getByText(`Success: ${component}`)).toBeVisible()
      await expect(page.getByText('Server Error')).not.toBeVisible()
    })
  }
})

test.describe('RSC非対応コンポーネントはRSCでエラーになること', () => {
  for (const component of CLIENT_COMPONENTS) {
    test(component, async ({ page }) => {
      await page.goto(`http://localhost:3000/rsc_test/${component}`)
      await expect(page.getByText(/Server Error|Unhandled Runtime Error/)).toBeVisible()
      await expect(page.getByText(`Success: ${component}`)).not.toBeVisible()
    })
  }
})
