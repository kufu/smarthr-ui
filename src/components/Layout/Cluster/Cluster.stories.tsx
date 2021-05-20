import React from 'react'
import { Story } from '@storybook/react'

import { useTheme } from '../../../hooks/useTheme'
import { Cluster } from '.'
import { Stack } from '../Stack'
import { Heading as shrHeading } from '../../Heading'
import { StatusLabel } from '../../StatusLabel'

import readme from './README.md'
import styled, { css } from 'styled-components'

export default {
  title: 'Cluster',
  component: Cluster,
  parameters: {
    docs: {
      description: { component: readme },
    },
  },
}

export const Default: Story = () => (
  <Stack>
    <figure>
      <figcaption>幅を狭めて収まり切らなくなると折返します。</figcaption>
      <Cluster>
        <StatusLabel type="done">アコーディオン</StatusLabel>
        <StatusLabel type="success">コンボボックス</StatusLabel>
        <StatusLabel type="process">ディスクロージャ</StatusLabel>
        <StatusLabel type="required">タブ・コントロール</StatusLabel>
        <StatusLabel type="disabled">ツリー・ビュー</StatusLabel>
        <StatusLabel type="must">ツリー・グリッド</StatusLabel>
        <StatusLabel type="warning">ウィンドウ・スプリッター</StatusLabel>
        <StatusLabel type="error">ランドマーク・リージョン</StatusLabel>
      </Cluster>
    </figure>
    <figure>
      <figcaption>
        間隔を <code>gap</code> で変えられます。
      </figcaption>
      <Cluster gap="XS">
        {[...Array(10)].map((_, i) => (
          <ColorBox key={i} />
        ))}
      </Cluster>
    </figure>
    <figure>
      <figcaption>
        入れ子にして <code>align</code> や <code>justify</code>{' '}
        を組み合わせるとメディアクエリを使用せずに柔軟なレイアウトを作れます。
      </figcaption>
      <Cluster align="center" justify="space-between">
        <Heading>これは Cluster の構成例です</Heading>

        <Cluster>
          <StatusLabel type="done">アコーディオン</StatusLabel>
          <StatusLabel type="success">コンボボックス</StatusLabel>
          <StatusLabel type="process">ディスクロージャ</StatusLabel>
        </Cluster>
      </Cluster>
    </figure>
  </Stack>
)

const Heading = styled(shrHeading)`
  margin-top: 0;
  margin-bottom: 0;
`
const ColorBox = styled.div(() => {
  const { color, radius } = useTheme()

  return css`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${radius.m};
    background-color: ${color.BRAND};
    color: white;
    width: 80px;
    height: 80px;
  `
})
