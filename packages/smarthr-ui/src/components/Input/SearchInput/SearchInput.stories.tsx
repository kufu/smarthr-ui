import { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import styled, { css } from 'styled-components'

import { Button } from '../../Button'
import { Cluster, Stack } from '../../Layout'

import { SearchInput } from './SearchInput'

const meta = {
  title: 'Forms（フォーム）/Input',
  component: SearchInput,
  parameters: {
    withTheming: true,
  },
} satisfies Meta<typeof SearchInput>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'SearchInput',
  args: {
    tooltipMessage: '',
  },
  render: () => (
    <StyledStack>
      <div>
        <p>主に入力欄に対する説明をレイアウト上配置できない場合の利用を想定しています。</p>
        <SearchInput
          name="default"
          tooltipMessage="氏名、ヨミガナ、社員番号で検索できます。スペース区切りでAND検索ができます。"
        />
      </div>
      <div>
        <p>アイコンの代替テキストを設定</p>
        <SearchInput
          name="default"
          tooltipMessage="氏名、ヨミガナ、社員番号で検索できます。スペース区切りでAND検索ができます。"
          decorators={{ iconAlt: (txt) => `search.(${txt})` }}
        />
      </div>
      <div>
        <p>width: 300px in Cluster</p>
        <StyledCluster>
          <SearchInput
            name="default"
            width={300}
            tooltipMessage="氏名、ヨミガナ、社員番号で検索できます。スペース区切りでAND検索ができます。"
            decorators={{ iconAlt: (txt) => `search.(${txt})` }}
          />
          <Button>検索</Button>
        </StyledCluster>
      </div>
      <div>
        <p>width: 100% in Cluster</p>
        <StyledCluster justify="space-between">
          <SearchInput
            name="default"
            width="100%"
            tooltipMessage="氏名、ヨミガナ、社員番号で検索できます。スペース区切りでAND検索ができます。"
            decorators={{ iconAlt: (txt) => `search.(${txt})` }}
          />
          <Button>検索</Button>
        </StyledCluster>
      </div>
      <div>
        <p>width: 50% in Cluster</p>
        <StyledCluster>
          <SearchInput
            name="default"
            width="50%"
            tooltipMessage="氏名、ヨミガナ、社員番号で検索できます。スペース区切りでAND検索ができます。"
            decorators={{ iconAlt: (txt) => `search.(${txt})` }}
          />
          <Button>検索</Button>
        </StyledCluster>
      </div>
    </StyledStack>
  ),
}

const StyledStack = styled(Stack)`
  ${({ theme: { space } }) => css`
    padding: ${space(2)};
  `}
`

const StyledCluster = styled(Cluster)`
  flex-wrap: nowrap;
`
