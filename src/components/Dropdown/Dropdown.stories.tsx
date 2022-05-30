import { Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import * as React from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { Dropdown } from './Dropdown'
import { DropdownTrigger } from './DropdownTrigger'
import { DropdownContent } from './DropdownContent'
import { DropdownCloser } from './DropdownCloser'
import { DropdownScrollArea } from './DropdownScrollArea'
import { Button } from '../Button'
import { RadioButton } from '../RadioButton'
import { Input } from '../Input'
import { Cluster, Stack } from '../Layout'
import { Text } from '../Text'
import { FaCaretDownIcon } from '../Icon'

import readme from './README.md'

export default {
  title: 'Dropdown',
  component: Dropdown,
  subcomponents: {
    DropdownTrigger,
    DropdownContent,
    DropdownCloser,
    DropdownScrollArea,
  },
  parameters: {
    readme: {
      sidebar: readme,
    },
  },
}

const ListMenu = () => {
  const themes = useTheme()
  return (
    <ActionList as="ul" themes={themes}>
      <li>
        <Button id="dropdown-list-item-1" onClick={action('clicked 編集')}>
          編集
        </Button>
      </li>
      <li>
        <Button onClick={action('clicked 複製')}>複製</Button>
      </li>
      <li>
        <Button onClick={action('clicked プレビュー')}>プレビュー</Button>
      </li>
      <li>
        <Button onClick={action('clicked 削除')}>削除</Button>
      </li>
    </ActionList>
  )
}

const ControllableDropdown = () => {
  const [value, setValue] = React.useState('hoge')
  const [text, setText] = React.useState('')
  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.name)
  const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => setText(e.currentTarget.value)
  const themes = useTheme()

  return (
    <Dropdown>
      <DropdownTrigger>
        <TriggerButton>制御可能な Dropdown</TriggerButton>
      </DropdownTrigger>
      <DropdownContent controllable>
        <DropdownScrollArea>
          <ControllableBoxMain>
            <Text as="p">`DropdownControllableContent` を使うとドロップダウン制御できます。</Text>
            <Text as="p">
              制御可能なドロップダウン内のコンテンツをクリックしても、ドロップダウンは閉じません。
              <br />
              ドロップダウンを閉じたいときは、`DropdownCloser` を使います。
            </Text>
            <RadioButtonList>
              <li>
                <RadioButton name="hoge" checked={value === 'hoge'} onChange={onChangeValue}>
                  hoge
                </RadioButton>
              </li>
              <li>
                <RadioButton name="fuga" checked={value === 'fuga'} onChange={onChangeValue}>
                  fuga
                </RadioButton>
              </li>
              <li>
                <RadioButton name="piyo" checked={value === 'piyo'} onChange={onChangeValue}>
                  piyo
                </RadioButton>
              </li>
              <li>
                <Input name="test" value={text} onChange={onChangeText} />
              </li>
            </RadioButtonList>
          </ControllableBoxMain>
          <ControllableBoxBottom themes={themes}>
            <Cluster justify="flex-end">
              <DropdownCloser>
                <Button>Close only</Button>
              </DropdownCloser>
              <DropdownCloser>
                <Button variant="primary" onClick={action('clicked button 1')}>
                  Action and close
                </Button>
              </DropdownCloser>
              <Button variant="primary" onClick={action('clicked button 2')}>
                Action only
              </Button>
            </Cluster>
          </ControllableBoxBottom>
        </DropdownScrollArea>
      </DropdownContent>
    </Dropdown>
  )
}

export const All: Story = () => {
  const themes = useTheme()
  return (
    <Wrapper themes={themes}>
      <Legends>
        <li>
          <Box>
            <Dropdown>
              <DropdownTrigger>
                <TriggerButton id="dropdown-button-1">制御不能な Dropdown</TriggerButton>
              </DropdownTrigger>
              <DropdownContent>
                <ListMenu />
              </DropdownContent>
            </Dropdown>
          </Box>
        </li>
        <li>
          <Box>
            <ControllableDropdown />
          </Box>
        </li>
        <li>
          <Dropdown>
            <DropdownTrigger>
              <Button>入れ子にできる Dropdown</Button>
            </DropdownTrigger>
            <DropdownContent controllable>
              <DropdownScrollArea>
                <ControllableBoxMain>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button>さらに入れ子にできる Dropdown</Button>
                    </DropdownTrigger>
                    <DropdownContent controllable>
                      <DropdownScrollArea>
                        <ControllableBoxMain>
                          <Dropdown>
                            <DropdownTrigger>
                              <TriggerButton>いくらでも入れ子にできる Dropdown</TriggerButton>
                            </DropdownTrigger>
                            <DropdownContent>
                              <ListMenu />
                            </DropdownContent>
                          </Dropdown>
                        </ControllableBoxMain>
                      </DropdownScrollArea>
                    </DropdownContent>
                  </Dropdown>
                </ControllableBoxMain>
              </DropdownScrollArea>
            </DropdownContent>
          </Dropdown>
        </li>
        <li>
          <Stack gap={8}>
            <Text as="p">
              `DropdownTrigger` の場所に依って、`DropdownContent` が表示される場所は決まります。
            </Text>
            <Text as="p">
              ↓<br />↓
            </Text>
            <Text as="p">
              ↓<br />↓
            </Text>
          </Stack>
        </li>
        <li>
          <Box>
            <Dropdown>
              <DropdownTrigger>
                <TriggerButton>制御不能な Dropdown</TriggerButton>
              </DropdownTrigger>
              <DropdownContent>
                <ListMenu />
              </DropdownContent>
            </Dropdown>
          </Box>
        </li>
        <li>
          <RightAlign>
            <Box>
              <Dropdown>
                <DropdownTrigger>
                  <TriggerButton>制御不能な Dropdown</TriggerButton>
                </DropdownTrigger>
                <DropdownContent>
                  <ListMenu />
                </DropdownContent>
              </Dropdown>
            </Box>
          </RightAlign>
        </li>
        <li>
          <Bottom />
        </li>
      </Legends>
    </Wrapper>
  )
}
All.storyName = 'all'

const ActionList = styled(Stack).attrs({ gap: 0 })<{ themes: Theme }>(
  ({ themes: { spacingByChar } }) => css`
    list-style: none;
    margin-block: 0;
    padding-block: ${spacingByChar(0.5)};
    padding-inline-start: 0;

    .smarthr-ui-Button {
      justify-content: flex-start;
      border: none;
      padding-block: ${spacingByChar(0.5)};
      width: 100%;
      font-weight: normal;
    }
  `,
)
const TriggerButton = styled(Button).attrs({ suffix: <FaCaretDownIcon /> })``
const Wrapper = styled.div<{ themes: Theme }>`
  padding: 24px;
  color: ${({ themes }) => themes.color.TEXT_BLACK};
`
const Legends = styled.ul`
  margin: 0;
  padding: 10px 0;
  list-style: none;

  & > li:not(:first-child) {
    margin-top: 24px;
  }
`
const Box = styled.div`
  display: inline-block;
`
const ControllableBoxMain = styled(Stack)`
  padding: 24px;
`
const ControllableBoxBottom = styled.div<{ themes: Theme }>`
  border-top: ${({ themes }) => themes.border.shorthand};
  padding: 16px 24px;
`
const RightAlign = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 100px;
`
const Bottom = styled.div`
  height: 500px;
`
const RadioButtonList = styled.ul`
  list-style: none;
`
