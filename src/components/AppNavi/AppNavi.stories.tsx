import { action } from '@storybook/addon-actions'
import { Story } from '@storybook/react'
import React, { ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { FaBirthdayCakeIcon, FaChartPieIcon, FaCogIcon, FaFileIcon, FaUserAltIcon } from '../Icon/'
import { AppNavi } from './AppNavi'
import { Theme, useTheme } from '../../hooks/useTheme'

import readme from './README.md'

export default {
  title: 'AppNavi',
  component: AppNavi,
  parameters: {
    readme: {
      sidebar: readme,
    },
  },
}

const Link: VFC<{ to: string; children: ReactNode; disabled?: boolean; className?: string }> = ({
  to,
  children,
  disabled = false,
  className = '',
  ...props
}) => (
  <a className={className} {...(disabled ? {} : { href: to })} {...props}>
    {children}
  </a>
)

const List: VFC = () => {
  const theme = useTheme()

  return (
    <ListWrapper themes={theme}>
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
}

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

export const WithChildren: Story = () => {
  const theme = useTheme()

  return (
    <Wrapper themes={theme}>
      <AppNavi label="機能名" buttons={withoutIconButtons} displayDrodownCaret>
        <Child>Some child components</Child>
      </AppNavi>
    </Wrapper>
  )
}
WithChildren.storyName = 'with children'

export const WithoutChildren: Story = () => {
  const theme = useTheme()

  return (
    <Wrapper themes={theme}>
      <AppNavi label="機能名" buttons={withoutIconButtons} displayDrodownCaret />
    </Wrapper>
  )
}
WithoutChildren.storyName = 'without children'

export const UnclickableCurrent: Story = () => {
  const theme = useTheme()
  const items = buttons.map(({ current, ...button }) => button)

  return (
    <Wrapper themes={theme}>
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
            displayDrodownCaret
          />
        </InnerWrapper>
      ))}
    </Wrapper>
  )
}
UnclickableCurrent.storyName = 'unclickable current'

export const NoIconAndCaret: Story = () => {
  const theme = useTheme()

  return (
    <Wrapper themes={theme}>
      <AppNavi label="機能名" buttons={buttons} />
    </Wrapper>
  )
}
NoIconAndCaret.storyName = 'アイコンありドロップダウン示唆なし'

const Wrapper = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { color } = themes

    return css`
      padding: 32px 0;
      overflow-x: auto;
      background-color: ${color.BACKGROUND};
    `
  }}
`
const Child = styled.p`
  margin: 0 0 0 auto;
`
const InnerWrapper = styled.div`
  margin-bottom: 40px;
`

const ListWrapper = styled.ul<{ themes: Theme }>`
  ${({ themes }) => {
    const { color } = themes

    return css`
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
    `
  }}
`
