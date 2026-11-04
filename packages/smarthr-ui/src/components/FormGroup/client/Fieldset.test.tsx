import { render, screen, waitFor } from '@testing-library/react'

import { Input } from '../../Input'

import { Fieldset } from './Fieldset'
import { FormControl } from './FormControl'

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

  it('子要素がlabel.unrecommendedHide:trueを持つフォームコントロール要素の場合、アクセシブルネームにlegend文言を追加する', async () => {
    render(
      <form>
        <Fieldset legend="fieldset-legend">
          <FormControl label={{ text: 'form-control-label1', unrecommendedHide: true }}>
            <Input name="test1" />
          </FormControl>
          <FormControl label={{ text: 'form-control-label2', unrecommendedHide: true }}>
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
          <FormControl label={{ text: '追加されないラベル1の子ラベル', unrecommendedHide: true }}>
            <Input name="test1" />
          </FormControl>
        </Fieldset>
        <Fieldset legend="追加されないラベル2の親ラベル">
          <FormControl label={{ text: '追加されないラベル2', unrecommendedHide: true }}>
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

  it('legendが変更されても、アクセシブルネームに古いlegend文言が蓄積されない', async () => {
    const { rerender } = render(
      <form>
        <Fieldset legend="旧legend">
          <Input name="test" aria-label="input-accessible-name" />
        </Fieldset>
      </form>,
    )

    rerender(
      <form>
        <Fieldset legend="新legend">
          <Input name="test" aria-label="input-accessible-name" />
        </Fieldset>
      </form>,
    )

    await waitFor(() =>
      expect(
        screen.getByRole('textbox', { name: 'input-accessible-name 新legend' }),
      ).toBeInTheDocument(),
    )
  })

  it('errorMessagesが指定されている場合、子のinput要素にaria-invalidが付与される', () => {
    render(
      <form>
        <Fieldset errorMessages="error" legend="fieldset-legend">
          <Input name="test" aria-label="input-accessible-name" />
        </Fieldset>
      </form>,
    )

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('errorMessagesが指定されていない場合、子のinput要素にaria-invalidが付与されない', () => {
    render(
      <form>
        <Fieldset legend="fieldset-legend">
          <Input name="test" aria-label="input-accessible-name" />
        </Fieldset>
      </form>,
    )

    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid')
  })

  it('autoBindErrorInput:falseの場合、errorMessagesが指定されていても子のinput要素にaria-invalidが付与されない', () => {
    render(
      <form>
        <Fieldset errorMessages="error" autoBindErrorInput={false} legend="fieldset-legend">
          <Input name="test" aria-label="input-accessible-name" />
        </Fieldset>
      </form>,
    )

    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid')
  })

  it('Fieldset > FormControlのように入れ子の場合、内側のFormControlが付与したaria-invalidを外側のFieldsetが消さない', () => {
    render(
      <form>
        <Fieldset legend="fieldset-legend">
          <FormControl errorMessages="error" label="label">
            <Input name="test" aria-label="input-accessible-name" />
          </FormControl>
        </Fieldset>
      </form>,
    )

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('外側のFieldsetがerrorMessagesを持つ場合、errorMessagesを持たない内側のFormControlの入力要素にもaria-invalidが付与される', () => {
    render(
      <form>
        <Fieldset errorMessages="error" legend="fieldset-legend">
          <FormControl label="label">
            <Input name="test" aria-label="input-accessible-name" />
          </FormControl>
        </Fieldset>
      </form>,
    )

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('3階層のネストで中間のFormControlが付与したaria-invalidを最も外側のFieldsetが消さない', () => {
    render(
      <form>
        <Fieldset legend="outer-legend">
          <Fieldset errorMessages="error" legend="middle-legend">
            <FormControl label="label">
              <Input name="test" aria-label="input-accessible-name" />
            </FormControl>
          </Fieldset>
        </Fieldset>
      </form>,
    )

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  // HINT: FormControlのlabelと構造を揃え、subActionAreaの有無でLabelClusterの親が変わらないようにする
  describe.each([
    ['subActionAreaが指定されていない場合', undefined],
    [
      'subActionAreaが指定されている場合',
      <button key="sub" type="button">
        sub
      </button>,
    ],
  ])('%s', (_, subActionArea) => {
    it('可視legendがwrapper直下に配置されない', () => {
      const { container } = render(
        <form>
          <Fieldset legend="fieldset-legend" subActionArea={subActionArea}>
            <Input name="test" aria-label="input-accessible-name" />
          </Fieldset>
        </form>,
      )

      const wrapper = container.querySelector('.smarthr-ui-FormControl')
      const legend = container.querySelector('.smarthr-ui-FormControl-label')

      expect(legend).not.toBeNull()
      expect(legend!.parentElement).not.toBe(wrapper)
    })
  })
})
