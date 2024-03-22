import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import React, { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { UnstyledButton } from '../Button'
import { FaBirthdayCakeIcon, FaChartPieIcon, FaCogIcon, FaFileIcon, FaUserAltIcon } from '../Icon'

import { AppNavi } from './AppNavi'

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

const List: FC = () => (
  <ListWrapper>
    <li>
      <UnstyledButton onClick={action('clicked item 1')}>ドロップダウンアイテム1</UnstyledButton>
    </li>
    <li>
      <UnstyledButton onClick={action('clicked item 2')}>ドロップダウンアイテム2</UnstyledButton>
    </li>
    <li>
      <UnstyledButton onClick={action('clicked item 3')}>ドロップダウンアイテム3</UnstyledButton>
    </li>
    <li>
      <UnstyledButton onClick={action('clicked item 4')}>ドロップダウンアイテム4</UnstyledButton>
    </li>
  </ListWrapper>
)

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
const withoutIconButtons = buttons.map(({ icon, ...button }) => button)

export const WithChildren: StoryFn = () => (
  <Wrapper>
    <AppNavi label="機能名" buttons={withoutIconButtons} displayDropdownCaret>
      <Child>Some child components</Child>
    </AppNavi>
  </Wrapper>
)
WithChildren.storyName = 'with children'

export const WithoutChildren: StoryFn = () => (
  <Wrapper>
    <AppNavi label="機能名" buttons={withoutIconButtons} displayDropdownCaret />
  </Wrapper>
)
WithoutChildren.storyName = 'without children'

export const UnclickableCurrent: StoryFn = () => {
  const items = buttons.map(({ current, ...button }) => button)

  return (
    <Wrapper>
      {items.map((_, currentIndex) => (
        <InnerWrapper key={currentIndex}>
          <AppNavi
            label="機能名"
            buttons={items.map((item, index) => {
              if (index === currentIndex) {
                return { ...item, current: true }
              }
              return item
            })}
            displayDropdownCaret
          />
        </InnerWrapper>
      ))}
    </Wrapper>
  )
}
UnclickableCurrent.storyName = 'unclickable current'

export const NoIconAndCaret: StoryFn = () => (
  <Wrapper>
    <AppNavi label="機能名" buttons={buttons} />
  </Wrapper>
)
NoIconAndCaret.storyName = 'アイコンありドロップダウン示唆なし'

export const ContainerScrollX: StoryFn = () => (
  <OverflowWrapper>
    <AppNavi label="機能名" buttons={withoutIconButtons} displayDropdownCaret>
      <Child>Some child components</Child>
    </AppNavi>
  </OverflowWrapper>
)
ContainerScrollX.storyName = '横スクロールさせる場合'

const Wrapper = styled.div`
  ${({ theme }) => {
    const { color } = theme

    return css`
      padding: 32px 0;
      background-color: ${color.BACKGROUND};
    `
  }}
`
const OverflowWrapper = styled(Wrapper)`
  overflow-x: auto;
`
const Child = styled.p`
  margin: 0 0 0 auto;
`
const InnerWrapper = styled.div`
  margin-bottom: 40px;
`

const ListWrapper = styled.ul(
  ({ theme: { color } }) => css`
    margin: 0;
    padding: 8px 0;
    list-style: none;

    & > li > button {
      line-height: 40px;
      padding-inline: 20px;
      background-color: ${color.WHITE};

      &:hover {
        background-color: ${color.hoverColor(color.WHITE)};
      }
    }
  `,
)
