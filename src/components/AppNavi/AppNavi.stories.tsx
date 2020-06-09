import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React, { FC, ReactNode } from 'react'
import styled from 'styled-components'

import { AppNavi } from './AppNavi'
import readme from './README.md'

const List = styled.ul`
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
    color: #333;

    &:hover {
      background-color: #f5f5f5;
    }
  }
`
const Link: FC<{ to: string; children: ReactNode; disabled?: boolean; className?: string }> = ({
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
const buttons = [
  {
    children: 'カレントボタン',
    icon: 'fa-file' as const,
    current: true,
    onClick: action('click!!'),
  },
  {
    children: 'ボタン',
    icon: 'fa-user-alt' as const,
    onClick: action('click!!'),
  },
  {
    children: 'アンカー',
    icon: 'fa-cog' as const,
    href: 'http://www.google.com',
  },
  {
    children: 'ドロップダウン',
    icon: 'fa-chart-pie' as const,
    dropdownContent: (
      <List>
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
      </List>
    ),
  },
  {
    children: 'カスタムタグ',
    icon: 'fa-birthday-cake' as const,
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
  .add('with children', () => (
    <Wrapper>
      <AppNavi label="プラスメニュー" buttons={buttons}>
        <Child>Some child components</Child>
      </AppNavi>
    </Wrapper>
  ))
  .add('without children', () => (
    <Wrapper>
      <AppNavi label="プラスメニュー" buttons={buttons} />
    </Wrapper>
  ))
  .add('with disalbed', () => (
    <Wrapper>
      <AppNavi
        label="プラスメニュー"
        buttons={buttons.map((item) => ({ ...item, disabled: true }))}
      >
        <Child>Some child components</Child>
      </AppNavi>
    </Wrapper>
  ))

const Wrapper = styled.div`
  padding: 32px 0;
  background-color: #f5f6fa;
`
const Child = styled.p`
  margin: 0 0 0 auto;
`
