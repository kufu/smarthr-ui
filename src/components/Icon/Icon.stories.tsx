import { Story } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import * as Icons from './Icon'
import { Stack } from '../Layout'
import { Text } from '../Text'

const icons: Array<React.ComponentType<Icons.ComponentProps>> = Object.values(Icons)
const { FaAddressBookIcon, FaBullhornIcon, FaInfoCircleIcon } = Icons

export default {
  title: 'Icon',
  component: FaAddressBookIcon,
}

export const Default: Story = () => <FaAddressBookIcon />

export const All: Story = () => {
  return (
    <IconList>
      {icons.map((Component) => {
        return (
          <ItemWrapper key={`${Component.displayName}`}>
            <IconName>{Component.displayName?.replace(/Icon$/, '')}</IconName>
            <dd>
              <Component />
            </dd>
          </ItemWrapper>
        )
      })}
    </IconList>
  )
}

export const Size: Story = () => (
  <List>
    <FaAddressBookIcon size={16} />
    <FaAddressBookIcon size={24} />
    <FaAddressBookIcon size={32} />
    <FaAddressBookIcon size={40} />
    <FaAddressBookIcon size={48} />
    <FaAddressBookIcon size={56} />
    <FaAddressBookIcon size="2em" />
    <FaAddressBookIcon size="4rem" />
  </List>
)

export const AltText: Story = () => (
  <div>
    <p>
      <span id="text">連絡帳</span>
    </p>
    <dl>
      <dt>visually hidden text</dt>
      <dd>
        <FaAddressBookIcon alt="連絡帳" />
      </dd>
      <dt>
        <code>aria-labelledby</code>
      </dt>
      <dd>
        <FaAddressBookIcon aria-labelledby="text" />
      </dd>
      <dt>
        <code>aria-label</code>
      </dt>
      <dd>
        <FaAddressBookIcon aria-label="連絡帳" />
      </dd>
      <dt>
        none ( <code>aria-hidden</code> )
      </dt>
      <dd>
        <FaAddressBookIcon />
      </dd>
    </dl>
  </div>
)

export const Color: Story = () => (
  <List>
    <FaAddressBookIcon size={40} color="#D4F4F5" />
    <FaAddressBookIcon size={40} color="#69D9DE" />
    <FaAddressBookIcon size={40} color="#12ABB1" />
    <FaAddressBookIcon size={40} color="#0F7F85" />
    <FaAddressBookIcon size={40} color="WARNING" />
    <FaAddressBookIcon size={40} color="DANGER" />
  </List>
)

export const WithText: Story = () => (
  <Stack align="flex-start">
    <FaAddressBookIcon text="連絡帳" />
    <FaAddressBookIcon text="連絡帳（逆位置）" right />
    <Text as="p">
      文中にも
      <FaBullhornIcon text="アイコン付きテキスト" />
      を使えます。
    </Text>
    <Text as="p" size="XL">
      <FaInfoCircleIcon text="文字サイズは親要素から継承されます。" />
      <Text size="S">
        <FaBullhornIcon
          text="そのため一文の中で別の文字サイズを使いたければ Text コンポーネントを入れ子にしてください。"
          right
        />
      </Text>
    </Text>
  </Stack>
)

const IconList = styled.dl`
  display: flex;
  justify-content: start;
  align-items: center;
  flex-wrap: wrap;
  margin: 0;
`
const ItemWrapper = styled.div`
  margin: 10px;
  padding: 10px;
  background-color: #eee;
  text-align: center;

  & > dd {
    margin: 0;
  }
`
const IconName = styled.dt`
  margin-bottom: 10px;
  color: #222;
`
const List = styled.div`
  display: flex;
  align-items: flex-end;
  & > * {
    margin-right: 16px;
  }
`
