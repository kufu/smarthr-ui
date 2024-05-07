import { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import styled, { css } from 'styled-components'

import { Stack } from '../../Layout'

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
  render: () => {
    const [value, setValue] = React.useState('')
    return (
      <StyledStack>
        <div>
          <p>主に入力欄に対する説明をレイアウト上配置できない場合の利用を想定しています。</p>
          <SearchInput
            name="default"
            onChange={(e) => setValue(e.target.value)}
            value={value}
            tooltipMessage="氏名、ヨミガナ、社員番号で検索できます。スペース区切りでAND検索ができます。"
          />
        </div>
        <div>
          <p>検索解除ボタンを表示</p>
          <SearchInput
            name="default"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            tooltipMessage="氏名、ヨミガナ、社員番号で検索できます。スペース区切りでAND検索ができます。"
            onClickClear={() => setValue('')}
          />
        </div>
        <div>
          <p>アイコンの代替テキストを設定</p>
          <SearchInput
            name="default"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            tooltipMessage="氏名、ヨミガナ、社員番号で検索できます。スペース区切りでAND検索ができます。"
            decorators={{
              iconAlt: (txt) => `search.(${txt})`,
              clearButtonAlt: (txt) => `clear.(${txt})`,
            }}
            onClickClear={() => setValue('')}
          />
        </div>
      </StyledStack>
    )
  },
}

const StyledStack = styled(Stack)`
  ${({ theme: { space } }) => css`
    padding: ${space(2)};
  `}
`
