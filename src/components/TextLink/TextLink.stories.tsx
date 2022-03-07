import { storiesOf } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'
import { TextLink } from './TextLink'
import { FaFlagIcon } from '../Icon'
import readme from './README.md'

storiesOf('TextLink', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => (
    <Wrapper>
      <li>
        <TextLink href="/" prefix={<FaFlagIcon />}>
          ルートへのリンク
        </TextLink>
      </li>
      <li>
        <TextLink href="/" target="_blank">
          別タブで開くルートへのリンク
        </TextLink>
      </li>
      <li>
        <TextLink href="/" target="_blank" suffix={null}>
          別タブで開くルートへのリンク（suffix なし）
        </TextLink>
      </li>
      <li>
        <TextLink onClick={() => alert('click!')}>
          onClick しか設定していなくてもフォーカスできます。
        </TextLink>
      </li>
      <li>
        <TextLink>onClick も href も指定されていない場合はフォーカスできません</TextLink>
      </li>
      <li>
        <TextLink href="/?path=/story/textlink--all" prefix={<FaFlagIcon />} target="_blank">
          健康保険厚生年金保険被保険者生年月日訂正届船員保険厚生年金保険被保険者生年月日訂正届船員保険厚生年金保険被保険者資格記録訂正届船員保険厚生年金保険被保険者資格記録取消届船員保険被保険者離職事由訂正届基礎年金番号氏名生年月日性別変更（訂正）届
        </TextLink>
      </li>
    </Wrapper>
  ))

const Wrapper = styled.ul`
  list-style: none;
  margin: 24px;

  li + li {
    margin-top: 16px;
  }
`
