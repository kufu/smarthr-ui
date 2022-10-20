import React from 'react'
import { Story } from '@storybook/react'

import { Cluster } from '.'
import { Stack } from '../Stack'
import { Heading as shrHeading } from '../../Heading'
import { StatusLabel } from '../../StatusLabel'

import styled, { css } from 'styled-components'
import { Base } from '../../Base'
import { RadioButton } from '../../RadioButton'

export const ClusterStory: Story = () => {
  return (
    <StyledStack gap="L">
      <Stack as="figure" gap="X3S">
        <figcaption>幅を狭めて収まり切らなくなると折返します。</figcaption>
        <Cluster>
          <StatusLabel type="grey">アコーディオン</StatusLabel>
          <StatusLabel type="blue">コンボボックス</StatusLabel>
          <StatusLabel type="red">ディスクロージャ</StatusLabel>
          <StatusLabel type="grey" bold>
            タブ・コントロール
          </StatusLabel>
          <StatusLabel type="red" bold>
            ツリー・ビュー
          </StatusLabel>
          <StatusLabel type="blue" bold>
            ツリー・グリッド
          </StatusLabel>
          <StatusLabel type="warning">ウィンドウ・スプリッター</StatusLabel>
          <StatusLabel type="error" bold>
            ランドマーク・リージョン
          </StatusLabel>
        </Cluster>
      </Stack>
      <Stack as="figure" gap="X3S">
        <figcaption>
          間隔を <code>gap</code> で変えられます。
        </figcaption>
        <Cluster gap="XS">
          {[...Array(10)].map((_, i) => (
            <ColorBox key={i} />
          ))}
        </Cluster>
      </Stack>
      <Stack as="figure" gap="X3S">
        <figcaption>垂直方向と水平方向で異なった余白を設定できます。</figcaption>
        <StyledBase>
          <Cluster gap={{ row: 'X3S', column: 'XS' }}>
            <RadioButton name="部署" defaultChecked={true}>
              申請者に戻す
            </RadioButton>
            <RadioButton name="部署" defaultChecked={false}>
              ステップ1に戻す
            </RadioButton>
            <RadioButton name="部署" defaultChecked={false}>
              ステップ2に戻す
            </RadioButton>
            <RadioButton name="部署" defaultChecked={false}>
              ステップ3に戻す
            </RadioButton>
            <RadioButton name="部署" defaultChecked={false}>
              ステップ4に戻す
            </RadioButton>
          </Cluster>
        </StyledBase>
      </Stack>
      <Stack as="figure" gap="X3S">
        <figcaption>
          入れ子にして <code>align</code> や <code>justify</code>{' '}
          を組み合わせるとメディアクエリを使用せずに柔軟なレイアウトを作れます。
        </figcaption>
        <Cluster align="center" justify="space-between">
          <Heading>これは Cluster の構成例です</Heading>

          <Cluster>
            <StatusLabel type="grey">アコーディオン</StatusLabel>
            <StatusLabel type="blue">コンボボックス</StatusLabel>
            <StatusLabel type="red">ディスクロージャ</StatusLabel>
          </Cluster>
        </Cluster>
      </Stack>
    </StyledStack>
  )
}
ClusterStory.parameters = { withTheming: true }

const Heading = styled(shrHeading)`
  margin-top: 0;
  margin-bottom: 0;
`

const StyledStack = styled(Stack)(
  ({ theme }) => css`
    padding: ${theme.spacing.L};
  `,
)

const StyledBase = styled(Base)(({ theme }) => {
  const { color, spacing } = theme

  return css`
    width: 50%;
    padding: ${spacing.M};
    background-color: ${color.BACKGROUND};
  `
})

const ColorBox = styled.div(
  ({ theme: { radius, color } }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${radius.m};
    background-color: ${color.BRAND};
    color: ${color.TEXT_WHITE};
    width: 80px;
    height: 80px;
  `,
)
