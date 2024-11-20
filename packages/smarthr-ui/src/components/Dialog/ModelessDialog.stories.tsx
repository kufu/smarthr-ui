import { StoryFn } from '@storybook/react'
import React, { useState } from 'react'
import styled, { css } from 'styled-components'

import { Button } from '../Button'
import { DatePicker } from '../DatePicker'
import { Fieldset } from '../Fieldset'
import { Heading } from '../Heading'
import { Cluster, Stack } from '../Layout'
import { RadioButton } from '../RadioButton'
import { Table, Td, TdCheckbox, Th, ThCheckbox } from '../Table'

import { ModelessDialog } from '.'

export default {
  title: 'Dialog（ダイアログ）/ModelessDialog',
  component: ModelessDialog,
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
      story: {
        inline: false,
        iframeHeight: '500px',
      },
    },
    withTheming: true,
  },
}

export const Modeless_Dialog: StoryFn = () => {
  const [isOpen1, setIsOpen1] = useState(true)
  const [isOpen2, setIsOpen2] = useState(false)
  return (
    <TriggerList style={{ height: '200vh' }}>
      <li>
        <Button
          onClick={() => setIsOpen1(!isOpen1)}
          aria-haspopup="dialog"
          aria-controls="modeless-dialog-1"
        >
          中央表示
        </Button>
        <ModelessDialog
          isOpen={isOpen1}
          // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
          header={<Heading tag="h2">モードレスダイアログ（中央表示）</Heading>}
          footer={<ModelessFooter>フッタ</ModelessFooter>}
          onClickClose={() => setIsOpen1(false)}
          onPressEscape={() => setIsOpen1(false)}
          resizable
          width="50%"
          height="50%"
          id="modeless-dialog-1"
          decorators={{
            closeButtonIconAlt: (txt) => `close.(${txt})`,
            dialogHandlerAriaLabel: (txt) => `label.(${txt})`,
            dialogHandlerAriaValuetext: (txt, data) =>
              `valuetext.(${txt}: ${data?.left}, ${data?.top})`,
          }}
        >
          <Stack gap="S">
            <Fieldset title="ラジオボタン" innerMargin={0.5}>
              <Cluster gap={1.25}>
                <RadioButton name="modeless_dialog_center_radio_1">ラジオボタン1</RadioButton>
                <RadioButton name="modeless_dialog_center_radio_2">ラジオボタン2</RadioButton>
              </Cluster>
            </Fieldset>
            <DatePicker name="modeless_dialog_center_datepicker" title="test" />
            <SpreadTableArea>
              <Table>
                <thead>
                  <tr>
                    <ThCheckbox name="modeless_dialog_center_checkbox" />
                    <Th>テーブル見出し1</Th>
                    <Th>テーブル見出し2</Th>
                    <Th>テーブル見出し3</Th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(Array(20).keys()).map((i) => (
                    <tr key={i}>
                      <TdCheckbox
                        name={`modeless_dialog_center_checkbox_${i}`}
                        aria-labelledby={`name-${i}`}
                      />
                      <Td id={`name=${i}`}>データ1-{i}</Td>
                      <Td>データ2-{i}</Td>
                      <Td>データ3-{i}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </SpreadTableArea>
          </Stack>
        </ModelessDialog>
      </li>
      <li>
        <Button
          onClick={() => setIsOpen2(!isOpen2)}
          data-test="dialog-trigger"
          aria-haspopup="dialog"
          aria-controls="modeless-dialog-2"
        >
          座標指定
        </Button>
        <ModelessDialog
          isOpen={isOpen2}
          // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
          header={<Heading tag="h2">座標指定表示</Heading>}
          onClickClose={() => setIsOpen2(false)}
          onPressEscape={() => setIsOpen2(false)}
          bottom={100}
          right="10%"
          id="modeless-dialog-2"
          data-test="dialog"
        >
          <p>
            bottom: 100px
            <br /> right: 10%
          </p>
        </ModelessDialog>
      </li>
    </TriggerList>
  )
}

export const RegOpenedModeless: StoryFn = () => (
  <ModelessDialog
    isOpen
    // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
    header={<Heading tag="h2">モードレスダイアログ</Heading>}
    footer={<ModelessFooter>フッタ</ModelessFooter>}
    height={500}
    width={600}
    contentBgColor="BACKGROUND"
    contentPadding={1.5}
  >
    <p>
      <code>contentBgColor</code> と <code>contentPadding</code>{' '}
      でコンテンツ領域の背景色とパディングを設定できます。
    </p>
  </ModelessDialog>
)

const TriggerList = styled.ul`
  margin: 0;
  padding: 0;

  & > li {
    display: inline-block;
    margin: 8px;
  }
`

const SpreadTableArea = styled.div`
  ${({ theme: { space } }) => css`
    margin-inline: ${space(-1.5)};

    &&& {
      margin-block-end: ${space(-1.5)};
    }
  `}
`
const ModelessFooter = styled.div`
  ${({ theme: { space } }) => css`
    padding: ${space(1)} ${space(1.5)};
  `}
`
