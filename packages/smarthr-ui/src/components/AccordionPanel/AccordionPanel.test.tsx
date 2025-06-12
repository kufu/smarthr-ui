import { render, screen } from '@testing-library/react'
import { config } from 'react-transition-group'
import { userEvent } from 'storybook/test'

import { Fieldset } from '../Fieldset'
import { RadioButton } from '../RadioButton'

import { AccordionPanel } from './AccordionPanel'
import { AccordionPanelContent } from './AccordionPanelContent'
import { AccordionPanelItem } from './AccordionPanelItem'
import { AccordionPanelTrigger } from './AccordionPanelTrigger'

describe('AccordionPanel', () => {
  beforeAll(() => {
    config.disabled = true
  })

  afterAll(() => {
    config.disabled = false
  })

  test('アコーディオン内に配置したラジオボタンをキーボード操作できる', async () => {
    render(
      <form>
        <AccordionPanel>
          <AccordionPanelItem name="accordion-panel-1">
            <AccordionPanelTrigger>アコーディオンパネル1</AccordionPanelTrigger>
            <AccordionPanelContent>
              <Fieldset title="ラジオボタン" innerMargin={0.5}>
                <RadioButton name="radio1">ラジオボタン1-1</RadioButton>
                <RadioButton name="radio1">ラジオボタン1-2</RadioButton>
              </Fieldset>
            </AccordionPanelContent>
          </AccordionPanelItem>

          <AccordionPanelItem name="accordion-panel-2">
            <AccordionPanelTrigger>アコーディオンパネル2</AccordionPanelTrigger>
            <AccordionPanelContent>
              <Fieldset title="ラジオボタン" innerMargin={0.5}>
                <RadioButton name="radio2">ラジオボタン2-1</RadioButton>
                <RadioButton name="radio2">ラジオボタン2-2</RadioButton>
              </Fieldset>
            </AccordionPanelContent>
          </AccordionPanelItem>
        </AccordionPanel>
      </form>,
    )

    await userEvent.keyboard('[Tab]')
    await userEvent.keyboard('[Space]')
    expect(screen.getByRole('button', { name: 'アコーディオンパネル1' })).toHaveFocus()

    await userEvent.keyboard('[Tab]')
    await userEvent.keyboard('[Space]')
    expect(screen.getByRole('radio', { name: 'ラジオボタン1-1' })).toHaveFocus()
    expect(screen.getByRole('radio', { name: 'ラジオボタン1-1' })).toBeChecked()

    await userEvent.keyboard('[ArrowRight]')
    await userEvent.keyboard('[Space]')
    expect(screen.getByRole('radio', { name: 'ラジオボタン1-2' })).toHaveFocus()
    expect(screen.getByRole('radio', { name: 'ラジオボタン1-2' })).toBeChecked()

    await userEvent.keyboard('[ArrowLeft]')
    await userEvent.keyboard('[Space]')
    expect(screen.getByRole('radio', { name: 'ラジオボタン1-1' })).toHaveFocus()
    expect(screen.getByRole('radio', { name: 'ラジオボタン1-1' })).toBeChecked()
  })

  test('矢印キーでAccordionPanelItem間を移動できる', async () => {
    render(
      <form>
        <AccordionPanel>
          <AccordionPanelItem name="accordion-panel-1">
            <AccordionPanelTrigger>アコーディオンパネル1</AccordionPanelTrigger>
            <AccordionPanelContent>
              <Fieldset title="ラジオボタン" innerMargin={0.5}>
                <RadioButton name="radio1">ラジオボタン1-1</RadioButton>
                <RadioButton name="radio1">ラジオボタン1-2</RadioButton>
              </Fieldset>
            </AccordionPanelContent>
          </AccordionPanelItem>

          <AccordionPanelItem name="accordion-panel-2">
            <AccordionPanelTrigger>アコーディオンパネル2</AccordionPanelTrigger>
            <AccordionPanelContent>
              <Fieldset title="ラジオボタン" innerMargin={0.5}>
                <RadioButton name="radio2">ラジオボタン2-1</RadioButton>
                <RadioButton name="radio2">ラジオボタン2-2</RadioButton>
              </Fieldset>
            </AccordionPanelContent>
          </AccordionPanelItem>
        </AccordionPanel>
      </form>,
    )

    await userEvent.keyboard('[Tab]')
    await userEvent.keyboard('[Space]')
    expect(screen.getByRole('button', { name: 'アコーディオンパネル1' })).toHaveFocus()

    await userEvent.keyboard('[ArrowDown]')
    expect(screen.getByRole('button', { name: 'アコーディオンパネル2' })).toHaveFocus()

    await userEvent.keyboard('[ArrowUp]')
    expect(screen.getByRole('button', { name: 'アコーディオンパネル1' })).toHaveFocus()
  })
})
