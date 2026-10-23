import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { config } from 'react-transition-group'

import { Fieldset } from '../../FormGroup'
import { RadioButton } from '../../RadioButton'

import { Accordion } from './Accordion'
import { AccordionContent } from './AccordionContent'
import { AccordionItem } from './AccordionItem'
import { AccordionTrigger } from './AccordionTrigger'

describe('Accordion', () => {
  beforeAll(() => {
    config.disabled = true
  })

  afterAll(() => {
    config.disabled = false
  })

  test('アコーディオン内に配置したラジオボタンをキーボード操作できる', async () => {
    render(
      <form>
        <Accordion>
          <AccordionItem name="accordion-panel-1">
            <AccordionTrigger>アコーディオンパネル1</AccordionTrigger>
            <AccordionContent>
              <Fieldset innerMargin={0.5} legend="ラジオボタン">
                <RadioButton name="radio1">ラジオボタン1-1</RadioButton>
                <RadioButton name="radio1">ラジオボタン1-2</RadioButton>
              </Fieldset>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem name="accordion-panel-2">
            <AccordionTrigger>アコーディオンパネル2</AccordionTrigger>
            <AccordionContent>
              <Fieldset innerMargin={0.5} legend="ラジオボタン">
                <RadioButton name="radio2">ラジオボタン2-1</RadioButton>
                <RadioButton name="radio2">ラジオボタン2-2</RadioButton>
              </Fieldset>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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

  test('矢印キーでAccordionItem間を移動できる', async () => {
    render(
      <form>
        <Accordion>
          <AccordionItem name="accordion-panel-1">
            <AccordionTrigger>アコーディオンパネル1</AccordionTrigger>
            <AccordionContent>
              <Fieldset innerMargin={0.5} legend="ラジオボタン">
                <RadioButton name="radio1">ラジオボタン1-1</RadioButton>
                <RadioButton name="radio1">ラジオボタン1-2</RadioButton>
              </Fieldset>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem name="accordion-panel-2">
            <AccordionTrigger>アコーディオンパネル2</AccordionTrigger>
            <AccordionContent>
              <Fieldset innerMargin={0.5} legend="ラジオボタン">
                <RadioButton name="radio2">ラジオボタン2-1</RadioButton>
                <RadioButton name="radio2">ラジオボタン2-2</RadioButton>
              </Fieldset>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
