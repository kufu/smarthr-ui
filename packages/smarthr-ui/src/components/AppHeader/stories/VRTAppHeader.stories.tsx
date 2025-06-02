import { action } from 'storybook/actions'
import { Meta, StoryObj } from '@storybook/react/*'
import { within } from 'storybook/test'

import { AppHeader } from '../AppHeader'
import { Locale } from '../multilingualization'

import { args } from './args'

const meta = {
  title: 'Navigation（ナビゲーション）/AppHeader/VRT',
  component: AppHeader,
  args,
  decorators: [
    (Story) => (
      <div style={{ height: '700px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AppHeader>

export default meta

type Story = StoryObj<typeof meta>

export const VRTNameOnly: Story = {
  args: {
    userInfo: {
      email: 'smarthr@example.com',
      empCode: null,
      firstName: '須磨',
      lastName: '栄子',
      accountUrl: 'https://example.com',
    },
  },
}

export const VRTEmpCodeOnly: Story = {
  args: {
    userInfo: {
      email: 'smarthr@example.com',
      empCode: '001',
      firstName: null,
      lastName: null,
      accountUrl: 'https://example.com',
    },
  },
}

export const VRTEmailOnly: Story = {
  args: {
    userInfo: {
      email: 'smarthr@example.com',
      empCode: null,
      firstName: null,
      lastName: null,
      accountUrl: 'https://example.com',
    },
  },
}

export const VRTNoUserInfo: Story = {
  args: {
    userInfo: {
      email: null,
      empCode: null,
      firstName: null,
      lastName: null,
      accountUrl: 'https://example.com',
    },
  },
}

export const VRTSingleTenant: Story = {
  args: {
    tenants: [
      {
        id: 'tenant-1',
        name: '株式会社テストテナント壱',
      },
    ],
  },
}

export const VRTNoNavigations: Story = {
  args: {
    navigations: undefined,
  },
}

export const VRTTenant: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    canvas.getByRole('button', { name: '株式会社テストテナント壱 候補を開く' }).click()
  },
}

export const VRTLauncher: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    canvas.getByRole('button', { name: 'アプリ' }).click()
  },
}

export const VRTReleaseNote: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    canvas.getByRole('button', { name: 'リリースノート' }).click()
  },
}

export const VRTReleaseNoteLoading: Story = {
  args: {
    releaseNote: {
      loading: true,
      links: [],
      indexUrl: 'https://example.com',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    canvas.getByRole('button', { name: 'リリースノート' }).click()
  },
}

export const VRTReleaseNoteError: Story = {
  args: {
    releaseNote: {
      error: true,
      links: [],
      indexUrl: 'https://example.com',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    canvas.getByRole('button', { name: 'リリースノート' }).click()
  },
}

export const VRTSetting: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    canvas.getByRole('button', { name: '栄子 須磨（001）' }).click()
  },
}

export const VRTNavigationDropdown: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    canvas.getByRole('button', { name: 'ドロップダウン 候補を開く' }).click()
  },
}

export const VRTNavigationDropdownGroup: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    canvas.getByRole('button', { name: 'グループ 候補を開く' }).click()
  },
}

export const VRTLocaleEnUs: Story = {
  args: {
    locale: {
      selectedLocale: 'en-us',
      onSelectLocale: (locale: Locale) => action(locale),
    },
  },
}

export const VRTLocaleIdId: Story = {
  args: {
    locale: {
      selectedLocale: 'id-id',
      onSelectLocale: (locale: Locale) => action(locale),
    },
  },
}

export const VRTLocalePt: Story = {
  args: {
    locale: {
      selectedLocale: 'pt',
      onSelectLocale: (locale: Locale) => action(locale),
    },
  },
}

export const VRTLocaleVi: Story = {
  args: {
    locale: {
      selectedLocale: 'vi',
      onSelectLocale: (locale: Locale) => action(locale),
    },
  },
}

export const VRTLocaleKo: Story = {
  args: {
    locale: {
      selectedLocale: 'ko',
      onSelectLocale: (locale: Locale) => action(locale),
    },
  },
}

export const VRTLocaleZhCn: Story = {
  args: {
    locale: {
      selectedLocale: 'zh-cn',
      onSelectLocale: (locale: Locale) => action(locale),
    },
  },
}

export const VRTLocaleZhTw: Story = {
  args: {
    locale: {
      selectedLocale: 'zh-tw',
      onSelectLocale: (locale: Locale) => action(locale),
    },
  },
}
