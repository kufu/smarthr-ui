import { render, screen } from '@testing-library/react'

import { Input } from '../../Input'

import { FormControl } from './FormControl'

describe('FormControl', () => {
  it('errorMessagesが指定されている場合、子のinput要素にaria-invalidが付与される', () => {
    render(
      <form>
        <FormControl errorMessages="error" label="label">
          <Input name="test" />
        </FormControl>
      </form>,
    )

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('errorMessagesが指定されていない場合、子のinput要素にaria-invalidが付与されない', () => {
    render(
      <form>
        <FormControl label="label">
          <Input name="test" />
        </FormControl>
      </form>,
    )

    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid')
  })

  it('autoBindErrorInput:falseの場合、errorMessagesが指定されていても子のinput要素にaria-invalidが付与されない', () => {
    render(
      <form>
        <FormControl errorMessages="error" autoBindErrorInput={false} label="label">
          <Input name="test" />
        </FormControl>
      </form>,
    )

    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid')
  })

  it('errorMessagesを指定していなくても、子のinput要素が自身のerror propでaria-invalidを付与している場合は消されない', () => {
    render(
      <form>
        <FormControl label="label">
          <Input name="test" error />
        </FormControl>
      </form>,
    )

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  // HINT: labelが縦方向のwrapper直下に来るとalign-items:stretchで全幅に広がり、
  // テキストが無い部分をクリックしても入力要素にフォーカスが移ってしまう
  describe.each([
    ['subActionAreaが指定されていない場合', undefined],
    [
      'subActionAreaが指定されている場合',
      <button key="sub" type="button">
        sub
      </button>,
    ],
  ])('%s', (_, subActionArea) => {
    it('label要素がwrapper直下に配置されない', () => {
      const { container } = render(
        <form>
          <FormControl label="label" subActionArea={subActionArea}>
            <Input name="test" />
          </FormControl>
        </form>,
      )

      const wrapper = container.querySelector('.smarthr-ui-FormControl')
      const label = container.querySelector('.smarthr-ui-FormControl-label')

      expect(label).not.toBeNull()
      expect(label!.parentElement).not.toBe(wrapper)
    })
  })
})
