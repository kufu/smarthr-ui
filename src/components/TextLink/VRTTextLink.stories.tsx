import { StoryFn } from '@storybook/react'
import { within } from '@storybook/testing-library'
import * as React from 'react'
import styled, { css } from 'styled-components'

import { FaFlagIcon } from '../Icon'
import { InformationPanel } from '../InformationPanel'

import { TextLink } from './TextLink'
import { All } from './TextLink.stories'

export default {
  title: 'Text（テキスト）/TextLink',
  component: TextLink,
  parameters: {
    withTheming: true,
  },
}

export const VRTState: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      hover, activeなどの状態で表示されます
    </VRTInformationPanel>
    <Wrapper>
      <li id="hover">
        <p>hover</p>
        <TextLink href="/?path=/story/textlink--all" prefix={<FaFlagIcon />} target="_blank">
          健康保険厚生年金保険被保険者生年月日訂正届船員保険厚生年金保険被保険者生年月日訂正届船員保険厚生年金保険被保険者資格記録訂正届船員保険厚生年金保険被保険者資格記録取消届船員保険被保険者離職事由訂正届基礎年金番号氏名生年月日性別変更（訂正）届
        </TextLink>
      </li>
      <li id="focus">
        <p>focus</p>
        <TextLink href="/?path=/story/textlink--all" prefix={<FaFlagIcon />} target="_blank">
          健康保険厚生年金保険被保険者生年月日訂正届船員保険厚生年金保険被保険者生年月日訂正届船員保険厚生年金保険被保険者資格記録訂正届船員保険厚生年金保険被保険者資格記録取消届船員保険被保険者離職事由訂正届基礎年金番号氏名生年月日性別変更（訂正）届
        </TextLink>
      </li>
      <li id="focus-visible">
        <p>focusVisible</p>
        <TextLink href="/?path=/story/textlink--all" prefix={<FaFlagIcon />} target="_blank">
          健康保険厚生年金保険被保険者生年月日訂正届船員保険厚生年金保険被保険者生年月日訂正届船員保険厚生年金保険被保険者資格記録訂正届船員保険厚生年金保険被保険者資格記録取消届船員保険被保険者離職事由訂正届基礎年金番号氏名生年月日性別変更（訂正）届
        </TextLink>
      </li>
      <li id="active">
        <p>active</p>
        <TextLink href="/?path=/story/textlink--all" prefix={<FaFlagIcon />} target="_blank">
          健康保険厚生年金保険被保険者生年月日訂正届船員保険厚生年金保険被保険者生年月日訂正届船員保険厚生年金保険被保険者資格記録訂正届船員保険厚生年金保険被保険者資格記録取消届船員保険被保険者離職事由訂正届基礎年金番号氏名生年月日性別変更（訂正）届
        </TextLink>
      </li>
    </Wrapper>
  </>
)
VRTState.parameters = {
  controls: { hideNoControlsWarning: true },
  pseudo: {
    hover: ['#hover a'],
    focus: ['#focus a'],
    focusVisible: ['#focus-visible a'],
    active: ['#active a'],
  },
}

export const VRTUserFocus: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      ユーザーのフォーカス操作をシミュレートした状態で表示されます
    </VRTInformationPanel>
    <Wrapper>
      <li id="hover">
        <p>hover</p>
        <TextLink href="/?path=/story/textlink--all" prefix={<FaFlagIcon />} target="_blank">
          健康保険厚生年金保険被保険者生年月日訂正届船員保険厚生年金保険被保険者生年月日訂正届船員保険厚生年金保険被保険者資格記録訂正届船員保険厚生年金保険被保険者資格記録取消届船員保険被保険者離職事由訂正届基礎年金番号氏名生年月日性別変更（訂正）届
        </TextLink>
      </li>
    </Wrapper>
  </>
)
VRTUserFocus.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const link = await canvas.findByRole('link')
  link.focus()
}

export const VRTForcedColors: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <All />
  </>
)
VRTForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}

const VRTInformationPanel = styled(InformationPanel)`
  margin-bottom: 24px;
`
const Wrapper = styled.ul(
  ({ theme: { spacingByChar } }) => css`
    list-style: none;
    margin: ${spacingByChar(1.5)};
    padding-inline-start: unset;

    li + li {
      margin-top: ${spacingByChar(1)};
    }
  `,
)
