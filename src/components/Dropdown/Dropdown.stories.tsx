import { action } from '@storybook/addon-actions'
import { Story } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'
import * as React from 'react'
import styled, { css } from 'styled-components'

import { Button } from '../Button'
import { Dialog } from '../Dialog'
import { FaCaretDownIcon } from '../Icon'
import { Input } from '../Input'
import { Cluster, Stack } from '../Layout'
import { Fieldset } from '../NewFieldset'
import { RadioButton } from '../RadioButton'
import { Text } from '../Text'

import { Dropdown } from './Dropdown'
import { DropdownCloser } from './DropdownCloser'
import { DropdownContent } from './DropdownContent'
import { DropdownMenuButton } from './DropdownMenuButton'
import { DropdownScrollArea } from './DropdownScrollArea'
import { DropdownTrigger } from './DropdownTrigger'
import { FilterDropdown } from './FilterDropdown'
import { SortDropdown } from './SortDropdown'

export default {
  title: 'Buttons（ボタン）/Dropdown',
  component: Dropdown,
  subcomponents: {
    DropdownMenuButton,
    FilterDropdown,
    SortDropdown,
    DropdownTrigger,
    DropdownContent,
    DropdownCloser,
    DropdownScrollArea,
  },
  parameters: {
    withTheming: true,
  },
}

const ListMenu = () => (
  <ActionList as="ul">
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

export const ControllableDropdown = () => {
  const [value, setValue] = React.useState('hoge')
  const [text, setText] = React.useState('')
  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.name)
  const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => setText(e.currentTarget.value)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <TriggerButton data-test="controlled-dropdown-trigger">制御された Dropdown</TriggerButton>
        </DropdownTrigger>
        <DropdownContent controllable>
          <DropdownScrollArea>
            <ControllableBoxMainStack>
              <Fieldset title="Dropdown内部">
                <Text as="p">
                  `DropdownControllableContent` を使うとドロップダウン制御できます。
                </Text>
                <Text as="p">
                  制御されたドロップダウン内のコンテンツをクリックしても、ドロップダウンは閉じません。
                  <br />
                  ドロップダウンを閉じたいときは、`DropdownCloser` を使います。
                </Text>
                <Stack align="flex-start">
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
                  </RadioButtonList>
                  <Input name="test" value={text} onChange={onChangeText} title="test" />
                  <DropdownCloser>
                    <Button
                      onClick={() => setIsDialogOpen(true)}
                      aria-controls="dropdown-dialog"
                      aria-haspopup="dialog"
                      data-test="dropdown-dialog-trigger"
                    >
                      ダイアログを開く
                    </Button>
                  </DropdownCloser>
                </Stack>
              </Fieldset>
            </ControllableBoxMainStack>
            <ControllableBoxBottom>
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
      <Dialog isOpen={isDialogOpen} id="dropdown-dialog">
        <div style={{ padding: '2rem' }}>
          <Stack>
            <div>ドロップダウンから開いたダイアログ</div>
            <Button onClick={() => setIsDialogOpen(false)} data-test="dropdown-dialog-closer">
              閉じる
            </Button>
          </Stack>
        </div>
      </Dialog>
    </>
  )
}

const Template: Story = () => (
  <Wrapper>
    <Legends>
      <li>
        <Box>
          <Dropdown>
            <DropdownTrigger>
              <TriggerButton id="dropdown-button-1">非制御 Dropdown</TriggerButton>
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
              <ControllableBoxMainStack>
                <Dropdown>
                  <DropdownTrigger>
                    <Button>さらに入れ子にできる Dropdown</Button>
                  </DropdownTrigger>
                  <DropdownContent controllable>
                    <DropdownScrollArea>
                      <ControllableBoxMainStack>
                        <Dropdown>
                          <DropdownTrigger>
                            <TriggerButton>いくらでも入れ子にできる Dropdown</TriggerButton>
                          </DropdownTrigger>
                          <DropdownContent>
                            <ListMenu />
                          </DropdownContent>
                        </Dropdown>
                      </ControllableBoxMainStack>
                    </DropdownScrollArea>
                  </DropdownContent>
                </Dropdown>
              </ControllableBoxMainStack>
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
              <TriggerButton>非制御 Dropdown</TriggerButton>
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
                <TriggerButton>非制御 Dropdown</TriggerButton>
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
export const All = Template.bind({})

export const RegOpenDropdown = Template.bind({})
RegOpenDropdown.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const buttons = await canvas.findAllByRole('button')
  userEvent.click(buttons[0])
}

const ActionList = styled(Stack).attrs({ gap: 0 })(
  ({ theme: { spacingByChar } }) => css`
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
const Wrapper = styled.div`
  padding: 24px;
  color: ${({ theme }) => theme.color.TEXT_BLACK};
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
const ControllableBoxMainStack = styled(Stack)`
  padding: 24px;
`
const ControllableBoxBottom = styled.div`
  border-top: ${({ theme }) => theme.border.shorthand};
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
