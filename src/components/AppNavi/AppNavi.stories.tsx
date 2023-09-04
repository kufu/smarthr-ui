import { action } from '@storybook/addon-actions'
import { Story } from '@storybook/react'
import React, { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'

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

export const WithChildren: Story = () => (
    <Wrapper>
      <AppNavi label="機能名" buttons={withoutIconButtons} displayDropdownCaret>
        <Child>Some child components</Child>
      </AppNavi>
    </Wrapper>
  )
WithChildren.storyName = 'with children'

export const WithoutChildren: Story = () => (
    <Wrapper>
      <AppNavi label="機能名" buttons={withoutIconButtons} displayDropdownCaret />
    </Wrapper>
  )
WithoutChildren.storyName = 'without children'

export const UnclickableCurrent: Story = () => {
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
            isCurrentUnclickable
            displayDropdownCaret
          />
        </InnerWrapper>
      ))}
    </Wrapper>
  )
}
UnclickableCurrent.storyName = 'unclickable current'

export const NoIconAndCaret: Story = () => (
    <Wrapper>
      <AppNavi label="機能名" buttons={buttons} />
    </Wrapper>
  )
NoIconAndCaret.storyName = 'アイコンありドロップダウン示唆なし'

export const ContainerScrollX: Story = () => (
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
