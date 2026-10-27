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

    expect(children).toContain('action')
    expect(children).toContain('suffix')
    expect(children.indexOf('action')).toBeLessThan(children.indexOf('suffix'))
  })

  it('subActionArea内の要素をクリックしても、inputにフォーカスが移らずフォーカスが保たれる', async () => {
    const user = userEvent.setup()

    render(
      <form>
        <FormControl label="Input">
          <Input name="input" subActionArea={<button type="button">action</button>} />
        </FormControl>
      </form>,
    )

    const button = screen.getByRole('button', { name: 'action' })
    await user.click(button)

    expect(button).toHaveFocus()
  })

  it('subActionArea内の要素をクリックすると、Inputの外側の祖先要素のonClickも発火する', async () => {
    const user = userEvent.setup()
    const handleClickAncestor = vi.fn()

    render(
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events, smarthr/best-practice-for-interactive-element
      <div onClick={handleClickAncestor}>
        <form>
          <FormControl label="Input">
            <Input name="input" subActionArea={<button type="button">action</button>} />
          </FormControl>
        </form>
      </div>,
    )

    await user.click(screen.getByRole('button', { name: 'action' }))

    expect(handleClickAncestor).toHaveBeenCalledTimes(1)
  })
})
