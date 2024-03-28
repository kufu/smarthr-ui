import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import React, { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { FaBirthdayCakeIcon, FaChartPieIcon, FaCogIcon, FaFileIcon, FaUserAltIcon } from '../Icon'
import { InformationPanel } from '../InformationPanel'

import { AppNavi } from './AppNavi'
import { WithChildren } from './AppNavi.stories'

export default {
  title: 'Navigation（ナビゲーション）/AppNavi',
  component: AppNavi,
  parameters: {
    withTheming: true,
  },
}

const Link: FC<{ to: string; children: ReactNode; disabled?: boolean; className?: string }> = ({
  to,
  children,
  disabled = false,
  className = '',
  ...props
}) => (
  // eslint-disable-next-line smarthr/a11y-anchor-has-href-attribute
  <a {...props} {...(disabled ? {} : { href: to })} className={className}>
    {children}
  </a>
)

const List = () => (
  <ListWrapper>
    <li>
      <button onClick={action('clicked item 1')}>ドロップダウンアイテム1</button>
    </li>
    <li>
      <button onClick={action('clicked item 2')}>ドロップダウンアイテム2</button>
    </li>
    <li>
      <button onClick={action('clicked item 3')}>ドロップダウンアイテム3</button>
    </li>
    <li>
      <button onClick={action('clicked item 4')}>ドロップダウンアイテム4</button>
    </li>
  </ListWrapper>
)

export const VRTHover: StoryFn = () => {
  const buttons = [
    {
      children: 'カレントボタン',
      icon: FaFileIcon,
      current: true,
      onClick: action('click!!'),
    },
    {
      children: 'ボタン',
      icon: FaUserAltIcon,
      onClick: action('click!!'),
    },
    {
      children: 'アンカー',
      icon: FaCogIcon,
      href: '/',
    },
    {
      children: 'ドロップダウン',
      icon: FaChartPieIcon,
      dropdownContent: <List />,
    },
    {
      children: 'カスタムタグ',
      icon: FaBirthdayCakeIcon,
      tag: Link,
      href: '/',
    },
  ]
  const items = buttons.map(({ current, ...button }) => button)

  return (
    <Wrapper>
      <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
        hoverした状態で表示されます
      </VRTInformationPanel>
      <InnerWrapper>
        <AppNavi
          label="hover"
          buttons={items.map((item, index) => {
            if (index === 0) {
              return { ...item, current: true }
            }
            return item
          })}
          displayDropdownCaret
        />
      </InnerWrapper>
    </Wrapper>
  )
}
VRTHover.parameters = {
  controls: { hideNoControlsWarning: true },
  pseudo: {
    hover: ['button, a'],
  },
}

export const VRTFocusButton: StoryFn = () => {
  const buttons = [
    {
      children: 'ボタン',
      icon: FaUserAltIcon,
      onClick: action('click!!'),
    },
  ]

  return (
    <Wrapper>
      <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
        ボタンをフォーカスした状態で表示されます
      </VRTInformationPanel>
      <InnerWrapper>
        <AppNavi
          label="focus"
          buttons={buttons.map(({ ...button }) => button)}
          displayDropdownCaret
        />
      </InnerWrapper>
    </Wrapper>
  )
}
VRTFocusButton.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const button = await canvas.findByRole('button')
  await button.focus()
}

export const VRTFocusAnchor: StoryFn = () => {
  const buttons = [
    {
      children: 'アンカー',
      icon: FaCogIcon,
      href: '/',
    },
  ]

  return (
    <Wrapper>
      <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
        アンカーをフォーカスした状態で表示されます
      </VRTInformationPanel>
      <InnerWrapper>
        <AppNavi
          label="focus"
          buttons={buttons.map(({ ...button }) => button)}
          displayDropdownCaret
        />
      </InnerWrapper>
    </Wrapper>
  )
}
VRTFocusAnchor.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const anchor = await canvas.findByRole('link')
  await anchor.focus()
}

export const VRTDropDown: StoryFn = () => {
  const buttons = [
    {
      children: 'ドロップダウン',
      icon: FaChartPieIcon,
      dropdownContent: <List />,
    },
  ]

  return (
    <Wrapper>
      <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
        ドロップダウンを表示した状態で表示されます
      </VRTInformationPanel>
      <InnerWrapperDropdown>
        <AppNavi
          label="dropdown"
          buttons={buttons.map(({ ...button }) => button)}
          displayDropdownCaret
        />
      </InnerWrapperDropdown>
    </Wrapper>
  )
}
VRTDropDown.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const button = await canvas.findByRole('button')
  await userEvent.click(button)
}

export const VRTForcedColors: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <Wrapper>
      <InnerWrapperDropdown>
        <WithChildren />
      </InnerWrapperDropdown>
    </Wrapper>
  </>
)
VRTForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}
VRTForcedColors.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const button = await canvas.findByRole('button', { name: 'ドロップダウン' })
  await userEvent.click(button)
}

const VRTInformationPanel = styled(InformationPanel)`
  margin-bottom: 24px;
`

const InnerWrapper = styled.div`
  margin-bottom: 40px;
`

const InnerWrapperDropdown = styled.div`
  margin-bottom: 200px;
`

const Wrapper = styled.div`
  ${({ theme }) => {
    const { color } = theme

    return css`
      padding: 32px 0;
      background-color: ${color.BACKGROUND};
    `
  }}
`

const ListWrapper = styled.ul(
  ({ theme: { color } }) => css`
    margin: 0;
    padding: 8px 0;
    list-style: none;

    & > li > button {
      line-height: 40px;
      width: 100%;
      padding: 0 20px;
      border: none;
      background-color: ${color.WHITE};
      color: ${color.TEXT_BLACK};

      &:hover {
        background-color: ${color.hoverColor(color.WHITE)};
      }
    }
  `,
)
