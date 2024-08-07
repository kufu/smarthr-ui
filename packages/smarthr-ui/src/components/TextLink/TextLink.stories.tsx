import { StoryFn } from '@storybook/react'
import React from 'react'
import styled, { css } from 'styled-components'

import { FaAddressCardIcon } from '../Icon'

import { TextLink } from './TextLink'

export default {
  title: 'Navigation（ナビゲーション）/TextLink',
  component: TextLink,
  parameters: {
    withTheming: true,
  },
}

export const All: StoryFn = () => (
  <Wrapper>
    <li>
      <TextLink href="/" prefix={<FaAddressCardIcon />}>
        ルートへのリンク
      </TextLink>
    </li>
    <li>
      <TextLink href="/" target="_blank">
        別タブで開くルートへのリンク
      </TextLink>
    </li>
    <li>
      <TextLink href="/" target="_blank" rel={null}>
        別タブで開くルートへのリンク（rel属性 なし）
      </TextLink>
    </li>
    <li>
      <TextLink href="/" target="_blank" suffix={null}>
        別タブで開くルートへのリンク（suffix なし）
      </TextLink>
    </li>
    <li>
      {/* eslint-disable-next-line smarthr/a11y-anchor-has-href-attribute */}
      <TextLink onClick={() => alert('click!')}>
        onClick しか設定していなくてもフォーカスできます。
      </TextLink>
    </li>
    <li>
      {/* eslint-disable-next-line smarthr/a11y-anchor-has-href-attribute */}
      <TextLink>onClick も href も指定されていない場合はフォーカスできません</TextLink>
      <br />
      <TextLink href={undefined}>hrefがundefinedの場合もフォーカスできません</TextLink>
    </li>
    <li>
      <TextLink href="/?path=/story/textlink--all" prefix={<FaAddressCardIcon />} target="_blank">
        健康保険厚生年金保険被保険者生年月日訂正届船員保険厚生年金保険被保険者生年月日訂正届船員保険厚生年金保険被保険者資格記録訂正届船員保険厚生年金保険被保険者資格記録取消届船員保険被保険者離職事由訂正届基礎年金番号氏名生年月日性別変更（訂正）届
      </TextLink>
    </li>
  </Wrapper>
)
All.storyName = 'all'

const Wrapper = styled.ul(
  ({ theme: { spacingByChar } }) => css`
    list-style: none;
    margin: ${spacingByChar(1.5)};

    li + li {
      margin-top: ${spacingByChar(1)};
    }
  `,
)
