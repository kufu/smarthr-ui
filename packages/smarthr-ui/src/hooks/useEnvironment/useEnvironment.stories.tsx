import { BaseColumn } from '../../components/Base'
import { DefinitionList, DefinitionListItem } from '../../components/DefinitionList'
import { Heading } from '../../components/Heading'
import { Stack } from '../../components/Layout'
import { defaultMediaQuery } from '../../themes'
import { ThemeProvider } from '../../themes/ThemeProvider'
import { createTheme } from '../../themes/createTheme'

import { EnvironmentProvider } from './EnvironmentProvider'
import { useEnvironment } from './useEnvironment'

import type { Meta, StoryObj } from '@storybook/react/*'
import type { FC, PropsWithChildren } from 'react'

const Content = () => {
  const { mobile, matches } = useEnvironment()

  return (
    <Stack gap={1.5}>
      <DefinitionList>
        <DefinitionListItem maxColumns={1} term="mobile">
          {mobile.toString()}
        </DefinitionListItem>
      </DefinitionList>
      <Stack>
        <Heading>matches</Heading>
        <BaseColumn>
          <DefinitionList>
            {Object.entries(matches).map(([key, value]) => (
              <DefinitionListItem key={key} maxColumns={1} term={key}>
                {value.toString()}
              </DefinitionListItem>
            ))}
          </DefinitionList>
        </BaseColumn>
      </Stack>
    </Stack>
  )
}

export default {
  title: 'Hooks/useEnvironment',
  component: EnvironmentProvider,
  args: {
    children: <Content />,
  },
  render: (args) => <EnvironmentProvider {...args} />,
} satisfies Meta<typeof EnvironmentProvider>

export const Default: StoryObj<typeof EnvironmentProvider> = {}

export const FixedValue: StoryObj<typeof EnvironmentProvider> = {
  name: '環境値を固定する場合',
  args: {
    environment: {
      mobile: true,
    },
  },
}

const CustomEnvironmentProvider: FC<PropsWithChildren> = ({ children }) => {
  const environment = useEnvironment()
  const mobile = environment.matches.SCREEN_SMALL && window.navigator.maxTouchPoints > 0
  return (
    <EnvironmentProvider environment={{ ...environment, mobile }}>{children}</EnvironmentProvider>
  )
}

export const CustomMobile: StoryObj<typeof EnvironmentProvider> = {
  name: 'モバイルの判定をカスタマイズする場合 (例：タッチデバイスかつ画面がSCREEN_SMALL)',
  render: (args) => (
    <EnvironmentProvider {...args}>
      <CustomEnvironmentProvider>
        <Content />
      </CustomEnvironmentProvider>
      <code style={{ whiteSpace: 'pre-wrap' }}>
        {`
const CustomEnvironmentProvider : FC<PropsWithChildren> = ({ children }) => {
  const environment = useEnvironment()
  const mobile = environment.matches.SCREEN_SMALL && window.navigator.maxTouchPoints > 0
  return (
    <EnvironmentProvider environment={{ ...environment, mobile }}>
      { children }
     </EnvironmentProvider>
  )
}
        `}
      </code>
    </EnvironmentProvider>
  ),
}

export const CustomMediaQuery: StoryObj<typeof EnvironmentProvider> = {
  name: 'カスタムしたメディアクエリトークンを使用する場合',
  render: (args) => (
    <ThemeProvider
      theme={{
        ...createTheme(),
        mediaQuery: { ...defaultMediaQuery, SCREEN_SMALL: '(width <= 400px)' },
      }}
    >
      <EnvironmentProvider {...args}>
        <Content />
      </EnvironmentProvider>
    </ThemeProvider>
  ),
}
