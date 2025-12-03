import { Meta, StoryObj } from '@storybook/react/*'
import { FC, PropsWithChildren } from 'react'

import { EnvironmentProvider } from './EnvironmentProvider'
import { useEnvironment } from './useEnvironment'
import { DefinitionList, DefinitionListItem } from '../../components/DefinitionList'
import { Stack } from '../../components/Layout'
import { Heading } from '../../components/Heading'
import { BaseColumn } from '../../components/Base'

const Content = () => {
  const { mobile, matches } = useEnvironment()

  return (
    <Stack gap={1.5}>
      <DefinitionList maxColumns={1}>
        <DefinitionListItem term="mobile">{mobile.toString()}</DefinitionListItem>
      </DefinitionList>
      <Stack>
        <Heading>matches</Heading>
        <BaseColumn>
          <DefinitionList maxColumns={1}>
            {Object.entries(matches).map(([key, value]) => (
              <DefinitionListItem key={key} term={key}>
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
