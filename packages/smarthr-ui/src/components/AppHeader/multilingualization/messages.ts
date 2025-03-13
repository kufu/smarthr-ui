import type { Locale } from './types'

export type Messages = {
  'common/school': string
  'common/help': string
  'common/userSetting': string
  'common/releaseNote': string
  'common/releaseNotesLoadError': string
  'common/seeAllReleaseNotes': string
  'DesktopHeader/DesktopHeader/appLauncherLabel': string
  'MobileHeader/UserInfo/account': string
  'MobileHeader/Menu/openMenu': string
  'MobileHeader/Menu/closeMenu': string
  'MobileHeader/Menu/allAppButton': string
  'MobileHeader/Menu/managementMenu': string
  'MobileHeader/Menu/latestReleaseNotes': string
  'MobileHeader/MenuSubHeader/back': string
  'MobileHeader/MenuAccordion/open': string
  'MobileHeader/MenuAccordion/close': string
  'Launcher/searchInputTitle': string
  'Launcher/favoriteModeText': string
  'Launcher/allModeText': string
  'Launcher/listText': string
  'Launcher/helpText': string
  'Launcher/searchResultText': string
  'Launcher/emptyText': string
  'Launcher/sortDropdownLabel': string
  'Launcher/sortDropdownSelected': string
  'Launcher/sortDropdownOrderDefault': string
  'Launcher/sortDropdownOrderNameAsc': string
  'Launcher/sortDropdownOrderNameDesc': string
}

export const translation = {
  ja: {
    'common/school': 'スクール',
    'common/help': 'ヘルプ',
    'common/userSetting': '個人設定',
    'common/releaseNote': 'リリースノート',
    'common/releaseNotesLoadError':
      'リリースノートの読み込みに失敗しました。\n時間をおいて、やり直してください。',
    'common/seeAllReleaseNotes': 'すべてのリリースノートを見る',
    'DesktopHeader/DesktopHeader/appLauncherLabel': 'アプリ',
    'MobileHeader/UserInfo/account': 'アカウント',
    'MobileHeader/Menu/openMenu': 'メニューを開く',
    'MobileHeader/Menu/closeMenu': 'メニューを閉じる',
    'MobileHeader/Menu/allAppButton': 'すべてのアプリ',
    'MobileHeader/Menu/managementMenu': '管理メニュー',
    'MobileHeader/Menu/latestReleaseNotes': '最新のリリースノート',
    'MobileHeader/MenuSubHeader/back': '戻る',
    'MobileHeader/MenuAccordion/open': '開く',
    'MobileHeader/MenuAccordion/close': '閉じる',
    'Launcher/searchInputTitle': 'アプリ名を入力してください。',
    'Launcher/favoriteModeText': 'よく使うアプリ',
    'Launcher/allModeText': 'すべてのアプリ',
    'Launcher/listText': 'アプリ一覧',
    'Launcher/helpText': 'よく使うアプリとは',
    'Launcher/searchResultText': '検索結果',
    'Launcher/emptyText': '該当するアプリが見つかりませんでした。',
    'Launcher/sortDropdownLabel': '表示順',
    'Launcher/sortDropdownSelected': '選択中',
    'Launcher/sortDropdownOrderDefault': 'デフォルト',
    'Launcher/sortDropdownOrderNameAsc': 'アプリ名の昇順',
    'Launcher/sortDropdownOrderNameDesc': 'アプリ名の降順',
  },
  'id-id': {
    'common/school': 'Sekolah',
    'common/help': 'Bantuan',
    'common/userSetting': 'Personalisasi',
    'common/releaseNote': 'Release Note',
    'common/releaseNotesLoadError': 'Gagal memuat Release Note. \nSilakan coba lagi setelah jam.',
    'common/seeAllReleaseNotes': 'Lihat semua Release Note',
    'DesktopHeader/DesktopHeader/appLauncherLabel': 'Aplikasi',
    'MobileHeader/UserInfo/account': 'Akun',
    'MobileHeader/Menu/openMenu': 'Buka menu',
    'MobileHeader/Menu/closeMenu': 'Tutup menu',
    'MobileHeader/Menu/allAppButton': 'Semua aplikasi',
    'MobileHeader/Menu/managementMenu': 'Menu pengelolaan',
    'MobileHeader/Menu/latestReleaseNotes': 'Release Note terkini',
    'MobileHeader/MenuSubHeader/back': 'Kembali',
    'MobileHeader/MenuAccordion/open': 'Buka',
    'MobileHeader/MenuAccordion/close': 'Tutup',
    'Launcher/searchInputTitle': 'Masukkan nama aplikasi.',
    'Launcher/favoriteModeText': 'Aplikasi yang sering digunakan',
    'Launcher/allModeText': 'Semua aplikasi',
    'Launcher/listText': 'Daftar aplikasi',
    'Launcher/helpText': 'よく使うアプリとは', // TODO: 「よく使うアプリとは」の翻訳
    'Launcher/searchResultText': 'Hasil penelusuran',
    'Launcher/emptyText': 'Tidak ditemukan aplikasi yang sesuai.',
    'Launcher/sortDropdownLabel': 'Urutan tampilan',
    'Launcher/sortDropdownSelected': 'Sedang dipilih',
    'Launcher/sortDropdownOrderDefault': 'Default',
    'Launcher/sortDropdownOrderNameAsc': 'Urutkan nama aplikasi dari atas ke bawah',
    'Launcher/sortDropdownOrderNameDesc': 'Urutkan nama aplikasi dari bawah ke atas',
  },
  'en-us': {
    'common/school': 'School',
    'common/help': 'Help',
    'common/userSetting': 'Personal Settings',
    'common/releaseNote': 'Release notes',
    'common/releaseNotesLoadError': 'Failed to load release notes.\nTry again later.',
    'common/seeAllReleaseNotes': 'See all release notes',
    'DesktopHeader/DesktopHeader/appLauncherLabel': 'Apps',
    'MobileHeader/UserInfo/account': 'Account',
    'MobileHeader/Menu/openMenu': 'Open menu',
    'MobileHeader/Menu/closeMenu': 'Close menu',
    'MobileHeader/Menu/allAppButton': 'All apps',
    'MobileHeader/Menu/managementMenu': 'Admin Menu',
    'MobileHeader/Menu/latestReleaseNotes': 'Latest release notes',
    'MobileHeader/MenuSubHeader/back': 'Back',
    'MobileHeader/MenuAccordion/open': 'Expand',
    'MobileHeader/MenuAccordion/close': 'Collapse',
    'Launcher/searchInputTitle': 'Input the name of the App',
    'Launcher/favoriteModeText': 'Favorite Apps',
    'Launcher/allModeText': 'All Apps',
    'Launcher/listText': 'App List',
    'Launcher/helpText': 'よく使うアプリとは', // TODO: 「よく使うアプリとは」の翻訳
    'Launcher/searchResultText': 'Search results',
    'Launcher/emptyText': 'App not found.',
    'Launcher/sortDropdownLabel': 'Sort by',
    'Launcher/sortDropdownSelected': 'Selected',
    'Launcher/sortDropdownOrderDefault': 'Default order',
    'Launcher/sortDropdownOrderNameAsc': 'App name (A→Z)',
    'Launcher/sortDropdownOrderNameDesc': 'App name (Z→A)',
  },
  pt: {
    'common/school': 'Escola',
    'common/help': 'Ajuda',
    'common/userSetting': 'Configuração pessoal',
    'common/releaseNote': 'Notas de versão',
    'common/releaseNotesLoadError':
      'Não foi possível carregar as notas de versão. \nPor favor, tente novamente mais tarde.',
    'common/seeAllReleaseNotes': 'Ver todas as notas de versão',
    'DesktopHeader/DesktopHeader/appLauncherLabel': 'Apps',
    'MobileHeader/UserInfo/account': 'Conta',
    'MobileHeader/Menu/openMenu': 'Abrir menu',
    'MobileHeader/Menu/closeMenu': 'Fechar menu',
    'MobileHeader/Menu/allAppButton': 'Todos os Apps',
    'MobileHeader/Menu/managementMenu': 'Menu de administração',
    'MobileHeader/Menu/latestReleaseNotes': 'Notas de versão mais recentes',
    'MobileHeader/MenuSubHeader/back': 'Voltar',
    'MobileHeader/MenuAccordion/open': 'Abrir',
    'MobileHeader/MenuAccordion/close': 'Fechar',
    'Launcher/searchInputTitle': 'Insira o nome do app.',
    'Launcher/favoriteModeText': 'Apps Favoritos',
    'Launcher/allModeText': 'Todos os Apps',
    'Launcher/listText': 'Lista de Apps',
    'Launcher/helpText': 'よく使うアプリとは', // TODO: 「よく使うアプリとは」の翻訳
    'Launcher/searchResultText': 'Resultados de pesquisa',
    'Launcher/emptyText': 'App não encontrado.',
    'Launcher/sortDropdownLabel': 'Ordenar por',
    'Launcher/sortDropdownSelected': 'Selecionando',
    'Launcher/sortDropdownOrderDefault': 'Ordem padrão',
    'Launcher/sortDropdownOrderNameAsc': 'Nome do App (A→Z)',
    'Launcher/sortDropdownOrderNameDesc': 'Nome do App (Z→A)',
  },
  vi: {
    'common/school': 'School',
    'common/help': 'Trợ giúp',
    'common/userSetting': 'Cài đặt cá nhân',
    'common/releaseNote': 'Release Notes',
    'common/releaseNotesLoadError': 'Tải Release Notes thất bại.\nHãy thử lại sau một lúc nữa.',
    'common/seeAllReleaseNotes': 'Xem tất cả Release Notes',
    'DesktopHeader/DesktopHeader/appLauncherLabel': 'Danh mục',
    'MobileHeader/UserInfo/account': 'Tài khoản',
    'MobileHeader/Menu/openMenu': 'Mở menu',
    'MobileHeader/Menu/closeMenu': 'Đóng menu',
    'MobileHeader/Menu/allAppButton': 'Tất cả Tính năng',
    'MobileHeader/Menu/managementMenu': 'Menu Quản lý',
    'MobileHeader/Menu/latestReleaseNotes': 'Ghi chú phát hành mới nhất',
    'MobileHeader/MenuSubHeader/back': 'Quay lại',
    'MobileHeader/MenuAccordion/open': 'Mở',
    'MobileHeader/MenuAccordion/close': 'Đóng',
    'Launcher/searchInputTitle': 'Nhập tên tính năng.',
    'Launcher/favoriteModeText': 'Tính năng thường dùng',
    'Launcher/allModeText': 'Tất cả Tính năng',
    'Launcher/listText': 'Danh sách các tính năng',
    'Launcher/helpText': 'よく使うアプリとは', // TODO: 「よく使うアプリとは」の翻訳
    'Launcher/searchResultText': 'Kết quả tìm kiếm',
    'Launcher/emptyText': 'Không tìm thấy tính năng tương thích.',
    'Launcher/sortDropdownLabel': 'Thứ tự hiển thị',
    'Launcher/sortDropdownSelected': 'Đang lựa chọn',
    'Launcher/sortDropdownOrderDefault': 'Mặc định',
    'Launcher/sortDropdownOrderNameAsc': 'Tên tính năng (A→Z）',
    'Launcher/sortDropdownOrderNameDesc': 'Tên tính năng (Z→A）',
  },
  ko: {
    'common/school': '스쿨',
    'common/help': '도움말',
    'common/userSetting': '개인 설정',
    'common/releaseNote': '리리스 노트',
    'common/releaseNotesLoadError':
      '리리스노트의 불러오기를 실패했습니다.\n시간을 두고 다시 시도해 주세요.',
    'common/seeAllReleaseNotes': '모든 리리스 노트를 보기',
    'DesktopHeader/DesktopHeader/appLauncherLabel': '앱',
    'MobileHeader/UserInfo/account': '어카운트',
    'MobileHeader/Menu/openMenu': '메뉴를 열기',
    'MobileHeader/Menu/closeMenu': '메뉴를 닫기',
    'MobileHeader/Menu/allAppButton': '모든 앱',
    'MobileHeader/Menu/managementMenu': '관리메뉴',
    'MobileHeader/Menu/latestReleaseNotes': '최신 리리스 노트',
    'MobileHeader/MenuSubHeader/back': '돌아가기',
    'MobileHeader/MenuAccordion/open': '열기',
    'MobileHeader/MenuAccordion/close': '닫기',
    'Launcher/searchInputTitle': '앱의 이름을 입력해 주세요.',
    'Launcher/favoriteModeText': '자주 사용하는 앱',
    'Launcher/allModeText': '모든 앱',
    'Launcher/listText': '앱 리스트',
    'Launcher/helpText': 'よく使うアプリとは', // TODO: 「よく使うアプリとは」の翻訳
    'Launcher/searchResultText': '검색결과',
    'Launcher/emptyText': '해당하는 앱을 발견할수 없습니다.',
    'Launcher/sortDropdownLabel': '표시순서',
    'Launcher/sortDropdownSelected': '선택중',
    'Launcher/sortDropdownOrderDefault': '디폴트',
    'Launcher/sortDropdownOrderNameAsc': '앱 이름의 오름차순',
    'Launcher/sortDropdownOrderNameDesc': '앱 이름의 내림차순',
  },
  'zh-cn': {
    'common/school': '学校',
    'common/help': '帮助',
    'common/userSetting': '个人设置',
    'common/releaseNote': '版本说明',
    'common/releaseNotesLoadError': '无法取得版本说明。\n请稍等片刻后再试。',
    'common/seeAllReleaseNotes': '查看全部版本说明',
    'DesktopHeader/DesktopHeader/appLauncherLabel': '应用程序',
    'MobileHeader/UserInfo/account': '账号',
    'MobileHeader/Menu/openMenu': '展开菜单',
    'MobileHeader/Menu/closeMenu': '关闭菜单',
    'MobileHeader/Menu/allAppButton': '所有功能',
    'MobileHeader/Menu/managementMenu': '管理菜单',
    'MobileHeader/Menu/latestReleaseNotes': '最新版本说明',
    'MobileHeader/MenuSubHeader/back': '返回',
    'MobileHeader/MenuAccordion/open': '展开',
    'MobileHeader/MenuAccordion/close': '关闭',
    'Launcher/searchInputTitle': '请输入功能名称。',
    'Launcher/favoriteModeText': '常用功能',
    'Launcher/allModeText': '所有功能',
    'Launcher/listText': '功能一览表',
    'Launcher/helpText': 'よく使うアプリとは', // TODO: 「よく使うアプリとは」の翻訳
    'Launcher/searchResultText': '搜索结果',
    'Launcher/emptyText': '未找到匹配的功能。',
    'Launcher/sortDropdownLabel': '显示排序',
    'Launcher/sortDropdownSelected': '已选择',
    'Launcher/sortDropdownOrderDefault': '默认',
    'Launcher/sortDropdownOrderNameAsc': '以功能名称升序',
    'Launcher/sortDropdownOrderNameDesc': '以功能名称降序',
  },
  'zh-tw': {
    'common/school': '學校',
    'common/help': '幫助',
    'common/userSetting': '個人設定',
    'common/releaseNote': '版本說明',
    'common/releaseNotesLoadError': '載入版本說明失敗。\n請稍等片刻後再試。',
    'common/seeAllReleaseNotes': '查看全部版本說明',
    'DesktopHeader/DesktopHeader/appLauncherLabel': '應用程式',
    'MobileHeader/UserInfo/account': '帳戶',
    'MobileHeader/Menu/openMenu': '展開選單',
    'MobileHeader/Menu/closeMenu': '關閉選單',
    'MobileHeader/Menu/allAppButton': '所有功能',
    'MobileHeader/Menu/managementMenu': '管理選單',
    'MobileHeader/Menu/latestReleaseNotes': '最新版本說明',
    'MobileHeader/MenuSubHeader/back': '返回以功能名稱遞減',
    'MobileHeader/MenuAccordion/open': '展開',
    'MobileHeader/MenuAccordion/close': '關閉',
    'Launcher/searchInputTitle': '請輸入功能名稱。',
    'Launcher/favoriteModeText': '常用功能',
    'Launcher/allModeText': '所有功能',
    'Launcher/listText': '功能一覽表',
    'Launcher/helpText': 'よく使うアプリとは', // TODO: 「よく使うアプリとは」の翻訳
    'Launcher/searchResultText': '搜尋結果',
    'Launcher/emptyText': '未找到符合的功能。',
    'Launcher/sortDropdownLabel': '顯示排序',
    'Launcher/sortDropdownSelected': '選擇中',
    'Launcher/sortDropdownOrderDefault': '預設',
    'Launcher/sortDropdownOrderNameAsc': '以功能名稱遞增',
    'Launcher/sortDropdownOrderNameDesc': '以功能名稱遞減',
  },
} as const satisfies Record<Locale, Messages>
