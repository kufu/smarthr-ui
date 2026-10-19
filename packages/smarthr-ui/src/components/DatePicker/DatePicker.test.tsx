import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react'

import { IntlProvider } from '../../intl'
import { FormControl } from '../FormGroup'

import { DatePicker } from './client'

describe('DatePicker', () => {
  const renderWithIntl = (component: React.ReactElement) =>
    render(<IntlProvider locale="ja">{component}</IntlProvider>)

  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0)
      return 0
    })
  })

  it('カレンダーから日付を選択することができる', async () => {
    renderWithIntl(
      <form>
        <FormControl label="DatePicker">
          <DatePicker name="date" value="2024-09-25" onChangeDate={vi.fn()} />
        </FormControl>
      </form>,
    )
    const textbox = screen.getByRole('textbox', { name: 'DatePicker' })

    // カレンダーを開く
    act(() => textbox.click())

    // カレンダーが開かれていることを確認
    expect(textbox).toHaveProperty('ariaExpanded', 'true')

    // 日にちを選択する
    act(() => screen.getByRole('button', { name: '4' }).click())

    // 日付がテキストボックスに入ることを確認
    expect(textbox).toHaveProperty('value', '2024/09/04')

    // 選択後はカレンダーが閉じられていることを確認
    expect(textbox).toHaveProperty('ariaExpanded', 'false')
  })

  it('フォーカスを失うときにテキストボックスの内容がフォーマットされること', async () => {
    renderWithIntl(
      <form>
        <FormControl label="DatePicker">
          <DatePicker name="date" onChangeDate={vi.fn()} />
        </FormControl>
      </form>,
    )
    const textbox = screen.getByRole('textbox', { name: 'DatePicker' })
    await userEvent.type(textbox, '平成4年5月29日{tab}')
    expect(textbox).toHaveProperty('value', '1992/05/29')
  })

  it('defaultValue のみ指定した場合(非制御)、初期表示時点でフォーマット済みの値が表示されること', () => {
    renderWithIntl(
      <form>
        <FormControl label="DatePicker">
          <DatePicker name="date" defaultValue="2024-09-25" />
        </FormControl>
      </form>,
    )
    const textbox = screen.getByRole('textbox', { name: 'DatePicker' })
    expect(textbox).toHaveProperty('value', '2024/09/25')
  })

  it('defaultValue のみ指定した場合(非制御)、カレンダーの初期選択日が反映されること', () => {
    renderWithIntl(
      <form>
        <FormControl label="DatePicker">
          <DatePicker name="date" defaultValue="2024-09-25" />
        </FormControl>
      </form>,
    )
    const textbox = screen.getByRole('textbox', { name: 'DatePicker' })

    act(() => textbox.click())

    expect(screen.getByRole('button', { name: '25' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('defaultValue のみ指定した場合(非制御)、ユーザー入力後もフォーカスを失うとフォーマットされること', async () => {
    renderWithIntl(
      <form>
        <FormControl label="DatePicker">
          <DatePicker name="date" defaultValue="2024-09-25" />
        </FormControl>
      </form>,
    )
    const textbox = screen.getByRole('textbox', { name: 'DatePicker' })
    await userEvent.clear(textbox)
    await userEvent.type(textbox, '平成4年5月29日{tab}')
    expect(textbox).toHaveProperty('value', '1992/05/29')
  })

  it('defaultValue のみ指定した場合(非制御)、初期表示時点でshowAlternativeの内容が表示されること', () => {
    renderWithIntl(
      <form>
        <FormControl label="DatePicker">
          <DatePicker
            name="date"
            defaultValue="2024-09-25"
            showAlternative={(d) => (d ? `alt:${d.getFullYear()}` : null)}
          />
        </FormControl>
      </form>,
    )
    expect(screen.getByText('alt:2024')).toBeVisible()
  })

  it('value と defaultValue を両方指定した場合、value が優先されること', () => {
    renderWithIntl(
      <form>
        <FormControl label="DatePicker">
          <DatePicker
            name="date"
            value="2024-09-25"
            defaultValue="2020-01-01"
            onChangeDate={vi.fn()}
          />
        </FormControl>
      </form>,
    )
    const textbox = screen.getByRole('textbox', { name: 'DatePicker' })
    expect(textbox).toHaveProperty('value', '2024/09/25')
  })

  it('value に null、defaultValue に値を指定した場合、defaultValue は無視されshowAlternativeの初期表示もされないこと', () => {
    renderWithIntl(
      <form>
        <FormControl label="DatePicker">
          <DatePicker
            name="date"
            value={null}
            defaultValue="2020-01-01"
            showAlternative={(d) => (d ? `alt:${d.getFullYear()}` : null)}
            onChangeDate={vi.fn()}
          />
        </FormControl>
      </form>,
    )
    const textbox = screen.getByRole('textbox', { name: 'DatePicker' })
    expect(textbox).toHaveProperty('value', '')
    expect(screen.queryByText('alt:2020')).not.toBeInTheDocument()
  })

  it('defaultValue が parseInput で解析できない場合、入力欄に defaultValue がそのまま残ること', () => {
    renderWithIntl(
      <form>
        <FormControl label="DatePicker">
          <DatePicker name="date" defaultValue="invalid-date-string" parseInput={() => null} />
        </FormControl>
      </form>,
    )
    const textbox = screen.getByRole('textbox', { name: 'DatePicker' })
    expect(textbox).toHaveProperty('value', 'invalid-date-string')
  })

  it('value・defaultValue とも未指定の場合、formatDate が渡されていても初期表示は空のままであること', () => {
    renderWithIntl(
      <form>
        <FormControl label="DatePicker">
          <DatePicker
            name="date"
            formatDate={(d) => (d ? d.toISOString() : '未選択')}
            onChangeDate={vi.fn()}
          />
        </FormControl>
      </form>,
    )
    const textbox = screen.getByRole('textbox', { name: 'DatePicker' })
    expect(textbox).toHaveProperty('value', '')
  })
})
