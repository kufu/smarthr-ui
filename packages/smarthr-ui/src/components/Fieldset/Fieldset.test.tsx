import { render, screen } from '@testing-library/react'

import { FormControl } from '../FormControl'
import { Input } from '../Input'

import { Fieldset } from './Fieldset'

describe('Fieldset', () => {
  it('子要素が可視ラベルを持つフォームコントロール要素の場合、アクセシブルネームは可視ラベルになる', async () => {
    render(
      <form>
        <Fieldset legend="fieldset-legend">
          <FormControl label="form-control-label">
            <Input name="test" />
          </FormControl>
        </Fieldset>
      </form>,
    )

    expect(screen.getByRole('textbox', { name: 'form-control-label' })).toBeInTheDocument()
  })

  it('子要素が可視ラベルを持たないaria-labelを持つフォームコントロール要素の場合、アクセシブルネームにlegend文言を追加する', async () => {
    render(
      <form>
        {/* eslint-disable-next-line smarthr/a11y-input-in-form-control */}
        <Fieldset legend="fieldset-legend">
          <Input name="test1" aria-label="input-accessible-name-1" />
          <Input name="test2" aria-label="input-accessible-name-2" />
        </Fieldset>
      </form>,
    )

    expect(
      screen.getByRole('textbox', { name: 'input-accessible-name-1 fieldset-legend' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('textbox', { name: 'input-accessible-name-2 fieldset-legend' }),
    ).toBeInTheDocument()
  })

  it('子要素がlabel.dangerouslyHide:trueを持つフォームコントロール要素の場合、アクセシブルネームにlegend文言を追加する', async () => {
    render(
      <form>
        <Fieldset legend="fieldset-legend">
          <FormControl label={{ text: 'form-control-label1', dangerouslyHide: true }}>
            <Input name="test1" />
          </FormControl>
          <FormControl label={{ text: 'form-control-label2', dangerouslyHide: true }}>
            <Input name="test2" />
          </FormControl>
        </Fieldset>
      </form>,
    )

    expect(
      screen.getByRole('textbox', { name: 'form-control-label1 fieldset-legend' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('textbox', { name: 'form-control-label2 fieldset-legend' }),
    ).toBeInTheDocument()
  })

  it('子要素が可視ラベルを持たないaria-labelを持つフォームコントロール要素であってもラベルが重複する内容の場合、アクセシブルネームにlegend文言を追加しない', async () => {
    render(
      <form>
        <Fieldset legend="追加されないラベル1">
          <FormControl label={{ text: '追加されないラベル1の子ラベル', dangerouslyHide: true }}>
            <Input name="test1" />
          </FormControl>
        </Fieldset>
        <Fieldset legend="追加されないラベル2の親ラベル">
          <FormControl label={{ text: '追加されないラベル2', dangerouslyHide: true }}>
            <Input name="test1" />
          </FormControl>
        </Fieldset>
      </form>,
    )

    expect(
      screen.getByRole('textbox', { name: '追加されないラベル1の子ラベル' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: '追加されないラベル2' })).toBeInTheDocument()
  })
})
