import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React, { ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { FaBirthdayCakeIcon, FaChartPieIcon, FaCogIcon, FaFileIcon, FaUserAltIcon } from '../Icon/'
import { AppNavi } from './AppNavi'
import readme from './README.md'
import { Theme, useTheme } from '../../hooks/useTheme'

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
    href: 'http://www.google.com',
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
    to: 'http://www.google.com',
  },
]

storiesOf('AppNavi', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('with children', () => {
    const theme = useTheme()

    return (
      <Wrapper themes={theme}>
        <AppNavi label="プラスメニュー" buttons={buttons}>
          <Child>Some child components</Child>
        </AppNavi>
      </Wrapper>
    )
  })
  .add('without children', () => {
    const theme = useTheme()

    return (
      <Wrapper themes={theme}>
        <AppNavi label="プラスメニュー" buttons={buttons} />
      </Wrapper>
    )
  })
  .add('unclickable current', () => {
    const theme = useTheme()

    const items = [
      {
        children: 'ボタン',
        icon: FaUserAltIcon,
        onClick: action('click!!'),
      },
      {
        children: 'アンカー',
        icon: FaCogIcon,
        href: 'http://www.google.com',
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
        to: 'http://www.google.com',
      },
    ]
    return (
      <Wrapper themes={theme}>
        {items.map((_, currentIndex) => (
          <InnerWrapper key={currentIndex}>
            <AppNavi
              label="プラスメニュー"
              buttons={items.map((item, index) => {
                if (index === currentIndex) {
                  return { ...item, current: true }
                }
                return item
              })}
              isCurrentUnclickable
            />
          </InnerWrapper>
        ))}
      </Wrapper>
    )
  })

const Wrapper = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { palette } = themes

    return css`
      padding: 32px 0;
      background-color: ${palette.BACKGROUND};
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
    const { palette } = themes

    return css`
      margin: 0;
      padding: 8px 0;
      list-style: none;

      & > li > button {
        line-height: 40px;
        width: 100%;
        padding: 0 20px;
        border: none;
        background-color: #fff;
        font-size: 14px;
        color: ${palette.TEXT_BLACK};

        &:hover {
          background-color: ${palette.hoverColor('#fff')};
        }
      }
    `
  }}
`
