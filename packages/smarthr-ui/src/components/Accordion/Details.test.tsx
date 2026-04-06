import { render, screen } from '@testing-library/react'
import { config } from 'react-transition-group'
import { userEvent } from 'storybook/test'

import { Fieldset } from '../Fieldset'
import { RadioButton } from '../RadioButton'

import { Details } from './Details'
import { DetailsContent } from './DetailsContent'
import { DetailsItem } from './DetailsItem'
import { Summary } from './Summary'

describe('Details', () => {
  beforeAll(() => {
    config.disabled = true
  })

  afterAll(() => {
    config.disabled = false
  })

  test('アコーディオン内に配置したラジオボタンをキーボード操作できる', async () => {
    render(
      <form>
        <Details>
          <DetailsItem name="accordion-panel-1">
            <Summary>アコーディオンパネル1</Summary>
            <DetailsContent>
              <Fieldset legend="ラジオボタン" innerMargin={0.5}>
                <RadioButton name="radio1">ラジオボタン1-1</RadioButton>
                <RadioButton name="radio1">ラジオボタン1-2</RadioButton>
              </Fieldset>
            </DetailsContent>
          </DetailsItem>

          <DetailsItem name="accordion-panel-2">
            <Summary>アコーディオンパネル2</Summary>
            <DetailsContent>
              <Fieldset legend="ラジオボタン" innerMargin={0.5}>
                <RadioButton name="radio2">ラジオボタン2-1</RadioButton>
                <RadioButton name="radio2">ラジオボタン2-2</RadioButton>
              </Fieldset>
            </DetailsContent>
          </DetailsItem>
        </Details>
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

  test('矢印キーでDetailsItem間を移動できる', async () => {
    render(
      <form>
        <Details>
          <DetailsItem name="accordion-panel-1">
            <Summary>アコーディオンパネル1</Summary>
            <DetailsContent>
              <Fieldset legend="ラジオボタン" innerMargin={0.5}>
                <RadioButton name="radio1">ラジオボタン1-1</RadioButton>
                <RadioButton name="radio1">ラジオボタン1-2</RadioButton>
              </Fieldset>
            </DetailsContent>
          </DetailsItem>

          <DetailsItem name="accordion-panel-2">
            <Summary>アコーディオンパネル2</Summary>
            <DetailsContent>
              <Fieldset legend="ラジオボタン" innerMargin={0.5}>
                <RadioButton name="radio2">ラジオボタン2-1</RadioButton>
                <RadioButton name="radio2">ラジオボタン2-2</RadioButton>
              </Fieldset>
            </DetailsContent>
          </DetailsItem>
        </Details>
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
