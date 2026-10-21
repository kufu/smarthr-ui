import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { FormControl } from '../../FormGroup'

import { Input } from './Input'

describe('Input', () => {
  it('defaultValue のみ指定した場合(非制御)、初期値が表示される', () => {
    render(
      <form>
        <FormControl label="Input">
          <Input name="input" defaultValue="初期値" />
        </FormControl>
      </form>,
    )

    expect(screen.getByRole('textbox')).toHaveValue('初期値')
  })

  it('defaultValue のみ指定した場合(非制御)、ユーザー入力で値が更新される', async () => {
    const user = userEvent.setup()

    render(
      <form>
        <FormControl label="Input">
          <Input name="input" defaultValue="初期値" />
        </FormControl>
      </form>,
    )

    const input = screen.getByRole('textbox')
    await user.type(input, '追加')

    expect(input).toHaveValue('初期値追加')
  })

  it('subActionAreaがsuffixより手前(input側)に配置される', () => {
    render(
      <form>
        <FormControl label="Input">
          <Input
            name="input"
            suffix={<span>suffix</span>}
            subActionArea={<button type="button">action</button>}
          />
        </FormControl>
      </form>,
    )

    const wrapper = screen.getByRole('textbox').closest('.smarthr-ui-Input')!
    const children = Array.from(wrapper.children).map((el) => el.textContent)

    expect(children.indexOf('action')).toBeLessThan(children.indexOf('suffix'))
  })

  it('FormControlを使わない単体利用でも、prefix/suffixのidがaria-labelledbyに結合される', () => {
    render(
      // eslint-disable-next-line smarthr/a11y-input-in-form-control
      <Input name="input" prefix="定員" suffix="名" />,
    )

    const textbox = screen.getByRole('textbox')
    const labelledBy = textbox.getAttribute('aria-labelledby')!.split(' ')

    expect(labelledBy).toHaveLength(3)
    expect(labelledBy[1]).toBe(textbox.id)
  })

  it('subActionAreaはaria-labelledbyに一切影響しない', () => {
    render(
      <form>
        <FormControl label="Input">
          <Input name="input" suffix="名" subActionArea={<button type="button">クリア</button>} />
        </FormControl>
      </form>,
    )

    expect(screen.getByRole('textbox')).not.toHaveAccessibleName(/クリア/)
  })

  it('prefix/suffixがいずれも無い場合、aria-labelledbyが設定されない(従来通り)', () => {
    render(
      <form>
        <FormControl label="Input">
          <Input name="input" />
        </FormControl>
      </form>,
    )

    const textbox = screen.getByRole('textbox')

    expect(textbox).not.toHaveAttribute('aria-labelledby')
  })
})
