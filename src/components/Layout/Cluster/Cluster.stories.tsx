import { StoryFn } from '@storybook/react'
import React from 'react'
import styled, { css } from 'styled-components'

import { Base } from '../../Base'
import { Heading } from '../../Heading'
import { Fieldset } from '../../NewFieldset'
import { RadioButton } from '../../RadioButton'
import { StatusLabel } from '../../StatusLabel'
import { Stack } from '../Stack'

import { Cluster } from '.'

export default {
  title: 'Layouts（レイアウト）/Cluster',
  component: Cluster,
  parameters: {
    withTheming: true,
  },
}

export const All: StoryFn = () => (
  <StyledStack gap="L">
    <Fieldset title="幅を狭めて収まり切らなくなると折返します。">
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
    </Fieldset>
    <Fieldset
      title={
        <>
          間隔を <code>gap</code> で変えられます。
        </>
      }
    >
      <Cluster gap="XS">
        {[...Array(10)].map((_, i) => (
          <ColorBox key={i} />
        ))}
      </Cluster>
    </Fieldset>
    <Fieldset title="垂直方向と水平方向で異なった余白を設定できます。">
      <StyledBase>
        <Cluster gap={{ row: 'X3S', column: 'XS' }}>
          <RadioButton name="department" defaultChecked={true}>
            申請者に戻す
          </RadioButton>
          <RadioButton name="department" defaultChecked={false}>
            ステップ1に戻す
          </RadioButton>
          <RadioButton name="department" defaultChecked={false}>
            ステップ2に戻す
          </RadioButton>
          <RadioButton name="department" defaultChecked={false}>
            ステップ3に戻す
          </RadioButton>
          <RadioButton name="department" defaultChecked={false}>
            ステップ4に戻す
          </RadioButton>
        </Cluster>
      </StyledBase>
    </Fieldset>
    <Fieldset
      title={
        <>
          入れ子にして <code>align</code> や <code>justify</code>{' '}
          を組み合わせるとメディアクエリを使用せずに柔軟なレイアウトを作れます。
        </>
      }
    >
      <Cluster align="center" justify="space-between" as="section">
        {/* TODO: eslint を修正したら外す */}
        {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
        <StyledHeading>これは Cluster の構成例です</StyledHeading>
        <Cluster>
          <StatusLabel type="grey">アコーディオン</StatusLabel>
          <StatusLabel type="blue">コンボボックス</StatusLabel>
          <StatusLabel type="red">ディスクロージャ</StatusLabel>
        </Cluster>
      </Cluster>
    </Fieldset>
  </StyledStack>
)

const StyledHeading = styled(Heading)`
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
