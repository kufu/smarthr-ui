import React from 'react'
import { Story } from '@storybook/react'
import styled, { css } from 'styled-components'

import { Stack } from '../../Layout'
import { SearchInput } from './SearchInput'

export const Default: Story = () => (
  <Container>
    <p>主に入力欄に対する説明をレイアウト上配置できない場合の利用を想定しています。</p>
    <SearchInput description="氏名、ヨミガナ、社員番号で検索できます。スペース区切りでAND検索ができます。" />
  </Container>
)

const Container = styled(Stack)`
  ${({ theme: { space } }) => css`
    padding: ${space(2)};
  `}
`
