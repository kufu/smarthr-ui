import { Story } from '@storybook/react'
import React from 'react'
import styled, { css } from 'styled-components'

import { Stack } from '../../Layout'

import { SearchInput } from './SearchInput'

export const Default: Story = () => (
  <Container>
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
  </Container>
)
Default.storyName = 'SearchInput'

const Container = styled(Stack)`
  ${({ theme: { space } }) => css`
    padding: ${space(2)};
  `}
`
