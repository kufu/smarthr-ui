import React from 'react'
import { Story } from '@storybook/react'

import { Theme, useTheme } from '../../../hooks/useTheme'
import { Cluster } from '.'
import { Stack } from '../Stack'
import { Heading as shrHeading } from '../../Heading'
import { StatusLabel } from '../../StatusLabel'

import readme from './README.md'
import styled, { css } from 'styled-components'
import { Base } from '../../Base'
import { RadioButton } from '../../RadioButton'

export default {
  title: 'Cluster',
  component: Cluster,
  parameters: {
    docs: {
      description: { component: readme },
    },
  },
}

export const Default: Story = () => {
  const themes = useTheme()
  const { spacing } = themes

  return (
    <Stack gap="L" style={{ padding: spacing.L }}>
      <Stack as="figure" gap="X3S">
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
        <StyledBase themes={themes}>
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
            <StatusLabel type="done">アコーディオン</StatusLabel>
            <StatusLabel type="success">コンボボックス</StatusLabel>
            <StatusLabel type="process">ディスクロージャ</StatusLabel>
          </Cluster>
        </Cluster>
      </Stack>
    </Stack>
  )
}

const Heading = styled(shrHeading)`
  margin-top: 0;
  margin-bottom: 0;
`

const StyledBase = styled(Base)<{ themes: Theme }>(({ themes }) => {
  const { color, spacing } = themes

  return css`
    width: 50%;
    padding: ${spacing.M};
    background-color: ${color.BACKGROUND};
  `
})

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
