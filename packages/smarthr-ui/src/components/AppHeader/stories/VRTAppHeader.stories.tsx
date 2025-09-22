import { action } from 'storybook/actions'
import { Meta, StoryObj } from '@storybook/react/*'
import { within } from 'storybook/test'

import { AppHeader } from '../AppHeader'

import { args } from './args'
import { Locale } from '../../../intl/localeMap'

const meta = {
  title: 'Components/AppHeader/VRT',
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

export const VRTLocaleJaEasy: Story = {
  globals: {
    locale: 'ja-easy',
  },
}

export const VRTLocaleEnUs: Story = {
  globals: {
    locale: 'en-us',
  },
}

export const VRTLocaleIdId: Story = {
  globals: {
    locale: 'id-id',
  },
}

export const VRTLocalePt: Story = {
  globals: {
    locale: 'pt',
  },
}

export const VRTLocaleVi: Story = {
  globals: {
    locale: 'vi',
  },
}

export const VRTLocaleKo: Story = {
  globals: {
    locale: 'ko',
  },
}

export const VRTLocaleZhCn: Story = {
  globals: {
    locale: 'zh-cn',
  },
}

export const VRTLocaleZhTw: Story = {
  globals: {
    locale: 'zh-tw',
  },
}
