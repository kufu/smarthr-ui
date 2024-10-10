import test, { expect } from '@playwright/test'

/**
 * サーバーコンポーネントとして利用できるコンポーネント一覧
 */
const SERVER_COMPONENTS = [
  'Text',
  'Table',
  'Loader',
  'Td',
  'Chip',
  'SpreadsheetTable',
  'Balloon',
  'Badge',
  'VisuallyHiddenText',
  'SmartHRLogo',
  'UnstyledButton',
  'RangeSeparator',
  'Icon',
  'TextLink',
  'Select',
  'Th',
  'StatusLabel',
  'ResponseMessage',
]

/**
 * サーバーコンポーネントでは利用できないコンポーネント一覧
 */
const CLIENT_COMPONENTS = [
  'SearchInput',
  'TabItem',
  'CurrencyInput',
  'Textarea',
  'CheckBox',
  'RadioButton',
  'LineClamp',
  'RemoteDialogTrigger',
  'TableReel',
  'BulkActionRow',
  'Tooltip',
  'Button',
  'Dropdown',
  'Stack',
  'Heading',
  'Cluster',
  'Base',
  'Dialog',
  'ActionDialog',
  'DatePicker',
  'AccordionPanel',
  'DefinitionList',
  'Fieldset',
  'FlashMessage',
  'Section',
  'Center',
  'Pagination',
  'Calendar',
  'FormControl',
  'Cell',
  'AppNavi',
  'CompactInformationPanel',
  'PageHeading',
  'InformationPanel',
  'Header',
  'NotificationBar',
  'TabBar',
  'BottomFixedArea',
  'DropdownMenuButton',
  'FloatArea',
  'Row',
  'MultiComboBox',
  'SingleComboBox',
  'BaseColumn',
  'InputFile',
  'EmptyTableBody',
  'ErrorScreen',
  'FilterDropdown',
  'SegmentedControl',
  'MessageDialog',
  'DropZone',
  'Sidebar',
  'RemoteTriggerActionDialog',
  'PageCounter',
  'SideNav',
  'MessageScreen',
  'ModelessDialog',
  'Reel',
  'RadioButtonPanel',
  'Switch',
  'RemoteTriggerFormDialog',
  'FormDialog',
  'TdCheckbox',
  'ThCheckbox',
  'Nav',
  'Article',
  'RemoteTriggerMessageDialog',
  'Aside',
  'AppLauncher',
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
