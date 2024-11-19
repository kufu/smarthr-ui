import test, { expect } from '@playwright/test'

/**
 * サーバーコンポーネントとして利用できるコンポーネント一覧(アルファベット順)
 */
const SERVER_COMPONENTS = [
  'AnchorButton',
  'AppNaviAnchor',
  'AppNaviButton',
  'AppNaviCustomTag',
  'Badge',
  'Balloon',
  'BaseColumn',
  'Chip',
  'CompactInformationPanel',
  'DefinitionList',
  'DefinitionListItem',
  'ErrorScreen',
  'FloatArea',
  'HeaderLink',
  'Icon',
  'Loader',
  'MessageScreen',
  'MonthPicker',
  'PageCounter',
  'RangeSeparator',
  'ResponseMessage',
  'SideNav',
  'SmartHRLogo',
  'SpreadsheetTable',
  'SpreadsheetTableCorner',
  'StatusLabel',
  'Stepper',
  'Switch',
  'TabBar',
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
 * サーバーコンポーネント内で、クライアントコンポーネントとして利用できるコンポーネント一覧(アルファベット順)
 */
const CLIENT_COMPONENTS: string[] = [
  'Article',        // 見出しレベルの自動生成のため
  'Aside',          // 見出しレベルの自動生成のため
  'Base',           // 見出しレベルの自動生成のため
  'Center',         // 見出しレベルの自動生成のため
  'Cluster',        // 見出しレベルの自動生成のため
  'Heading',        // 見出しレベルの自動生成のため
  'Nav',            // 見出しレベルの自動生成のため
  'PageHeading',    // 見出しレベルの自動生成のため
  'Reel',           // 見出しレベルの自動生成のため
  'Section',        // 見出しレベルの自動生成のため
  'Sidebar',        // 見出しレベルの自動生成のため
  'Stack',          // 見出しレベルの自動生成のため
]

/**
 * サーバーコンポーネント内では利用できないコンポーネント一覧(アルファベット順)
 * FIXME: すべての use client を付与して CLIENT_COMPONENTS に移動する
 */
const DISABLED_COMPONENTS = [
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
  'ModelessDialog',
  'MultiComboBox',
  'NotificationBar',
  'Pagination',
  'RadioButton',
  'RadioButtonPanel',
  'RemoteDialogTrigger',
  'RemoteTriggerActionDialog',
  'RemoteTriggerFormDialog',
  'RemoteTriggerMessageDialog',
  'SearchInput',
  'SegmentedControl',
  'Select',
  'SingleComboBox',
  'SortDropdown',
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
      await expect(page.getByText('This is server component')).toBeVisible()
      await expect(page.getByText('Server Error')).not.toBeVisible()
    })
  }

  for (const component of CLIENT_COMPONENTS) {
    test(component, async ({ page }) => {
      await page.goto(`http://localhost:3000/rsc_test/${component}`)
      await expect(page.getByText('This is client component')).toBeVisible()
      await expect(page.getByText('Server Error')).not.toBeVisible()
    })
  }
})

test.describe('RSC非対応コンポーネントはRSCでエラーになること', () => {
  for (const component of DISABLED_COMPONENTS) {
    test(component, async ({ page }) => {
      await page.goto(`http://localhost:3000/rsc_test/${component}`)
      await expect(page.getByText(/Server Error|Unhandled Runtime Error/)).toBeVisible()
      await expect(page.getByText('This is server component')).not.toBeVisible()
      await expect(page.getByText('This is client component')).not.toBeVisible()
    })
  }
})
