import test, { expect } from '@playwright/test'

/**
 * サーバーコンポーネントとして利用できるコンポーネント一覧(アルファベット順)
 */
const SERVER_COMPONENTS = [
  'AppNavi',
  'AppNaviAnchor',
  'AppNaviButton',
  'AppNaviCustomTag',
  'AppNaviDropdown',
  'AppNaviDropdownMenuButton',
  'Badge',
  'Balloon',
  'BaseColumn',
  'Chip',
  'DatetimeLocalPicker',
  'DefinitionList',
  'DefinitionListItem',
  'ErrorScreen',
  'Fieldset',
  'FloatArea',
  'Header',
  'HeaderDropdownMenuButton',
  'HeaderLink',
  'Icon',
  'Loader',
  'MessageScreen',
  'MonthPicker',
  'NotificationBar',
  'PageCounter',
  'Pagination',
  'RangeSeparator',
  'ResponseMessage',
  'SearchInput',
  'SideMenu',
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
  'TdCheckbox',
  'Text',
  'TextLink',
  'Th',
  'TimePicker',
  'UnstyledButton',
  'UpwardLink',
  'VisuallyHiddenText',
  'WakuWakuButton',
]

/**
 * サーバーコンポーネント内で、クライアントコンポーネントとして利用できるコンポーネント一覧(アルファベット順)
 */
const CLIENT_COMPONENTS: string[] = [
  'AccordionPanel',        // 開閉状態の管理のためのuseStateなど
  'AccordionPanelContent', // 開いているパネル名を共有するためのuseContext
  'AccordionPanelItem',    // 開いているパネル名を共有するためのuseContext
  'AccordionPanelTrigger', // 開いているパネル名を共有するためのuseContext
  'AnchorButton',   // アイコンのみの場合のstyle調整のためのquerySelector
  'AppLauncher',    // 翻訳
  'AppHeader',      // ドロップダウンやダイアログを表示するためのuseStateなど
  'Article',        // 見出しレベルの自動生成のため
  'Aside',          // 見出しレベルの自動生成のため
  'Base',           // 見出しレベルの自動生成のため
  'BottomFixedArea', // children のバリデーションのための useEffect
  'BulkActionRow',  // 件数計算のためのuseStateなど
  'Button',         // アイコンのみの場合のstyle調整のためのquerySelector & live region を使うためのcreatePortal
  'Center',         // 見出しレベルの自動生成のため
  'Checkbox',       // indeterminate 状態管理のためのuseRef
  'Cluster',        // 見出しレベルの自動生成のため
  'CurrencyInput',  // フォーマット変換のためのuseEffect
  'DatePicker',     // カレンダー表示のためのcreatePortal
  'Dialog',         // ダイアログ描画のためのcreatePortal
  'DialogCloser',   // ダイアログ開閉状態管理のためのuseContext
  'DialogContent',  // ダイアログ描画のためのcreatePortal
  'DialogTrigger',  // ダイアログ開閉状態管理のためのuseContext
  'DialogWrapper',  // ダイアログ開閉状態管理のためのuseState
  'Dropdown',        // 開閉状態管理のためのuseStateなど
  'DropdownCloser',  // 開閉状態管理のためのuseContext
  'DropdownContent', // 開閉状態管理のためのuseContext
  'DropdownMenuButton', // キーボード操作のためのuseRef
  'DropdownTrigger', // 開閉状態管理のためのuseContext
  'EmptyTableBody', // テーブルヘッダーのカウントのためのuseRef
  'FormControl',    // Input要素への自動紐づけのためのuseRefなど
  'Heading',        // 見出しレベルの自動生成のため
  'InformationPanel', // 開閉状態の管理のためのuseState
  'Input',          // オートフォーカスのためのuseRefなど
  'InputFile',      // ファイル選択のためのuseStateなど
  'LanguageSwitcher', // イベントハンドラを含むため
  'LineClamp',      // ツールチップ開閉管理のためのuseState
  'ModelessDialog', // ダイアログ描画のためのcreatePortal
  'MultiCombobox',  // プルダウン表示のためのcreatePortalなど
  'Nav',            // 見出しレベルの自動生成のため
  'PageHeading',    // 見出しレベルの自動生成のため
  'RadioButton',    // イベントハンドラを含むため
  'RadioButtonPanel',           // パネルをクリックしてもラジオを選択できるようにするための useRef
  'Reel',                       // 見出しレベルの自動生成のため
  'RemoteDialogTrigger',        // children を clone するため
  'RemoteTriggerMessageDialog', // ダイアログ開閉管理のためのuseState
  'Section',        // 見出しレベルの自動生成のため
  'SegmentedControl', // フォーカス管理のためのuseRefなど
  'Select',         // イベントハンドラを含むため
  'Sidebar',        // 見出しレベルの自動生成のため
  'SingleCombobox', // プルダウン表示のためのcreatePortalなど
  'Stack',          // 見出しレベルの自動生成のため
  'TableReel',      // scroll監視のためのuseEffect
  'Textarea',       // オートフォーカスや文字数カウントのための状態管理
  'ThCheckbox',     // 多言語化対応のため
  'Tooltip',        // 開閉状態の管理
]

/**
 * サーバーコンポーネント内では利用できないコンポーネント一覧(アルファベット順)
 */
const DISABLED_COMPONENTS = [
  'ActionDialog',            // 必須のイベントハンドラをもつため
  'Calendar',                // 必須のイベントハンドラをもつため
  'DropZone',                // 必須のイベントハンドラをもつため
  'FilterDropdown',          // 必須のイベントハンドラをもつため
  'FormDialog',              // 必須のイベントハンドラをもつため
  'MessageDialog',           // 必須のイベントハンドラをもつため
  'MessageDialogContent',    // 必須のイベントハンドラを持つため
  'RemoteTriggerActionDialog',  // 必須のイベントハンドラをもつため
  'RemoteTriggerFormDialog',    // 必須のイベントハンドラをもつため
  'SortDropdown',           // 必須のイベントハンドラをもつため
  'TabItem',                // 必須のイベントハンドラをもつため
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
      await expect(page.getByText(/Server Error|Unhandled Runtime Error|Runtime Error|Runtime TypeError/)).toBeVisible()
      await expect(page.getByText('This is server component')).not.toBeVisible()
      await expect(page.getByText('This is client component')).not.toBeVisible()
    })
  }
})
