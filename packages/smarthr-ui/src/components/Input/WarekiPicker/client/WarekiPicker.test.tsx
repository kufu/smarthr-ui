import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act, useState } from 'react'

import { IntlProvider } from '../../../../intl'
import { FormControl } from '../../../FormGroup'

import { WarekiPicker } from './WarekiPicker'

describe('WarekiPicker', () => {
  const renderWithIntl = (component: React.ReactElement, locale: 'ja' | 'en-us' = 'ja') =>
    render(<IntlProvider locale={locale}>{component}</IntlProvider>)

  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0)
      return 0
    })
  })

  it('日本語で正しく和暦を表示する', () => {
    renderWithIntl(
      <form>
        <FormControl label="WarekiPicker">
          <WarekiPicker name="date" value="2024-09-25" onChangeDate={vi.fn()} />
        </FormControl>
      </form>,
      'ja',
    )

    const textbox = screen.getByRole('textbox', { name: 'WarekiPicker' })
    act(() => textbox.click())

    expect(screen.getByText('令和6年9月25日')).toBeTruthy()
  })

  it('非日本語で正しく和暦を表示する', () => {
    renderWithIntl(
      <form>
        <FormControl label="WarekiPicker">
          <WarekiPicker name="date" value="2024-09-25" onChangeDate={vi.fn()} />
        </FormControl>
      </form>,
      'en-us',
    )

    const textbox = screen.getByRole('textbox', { name: 'WarekiPicker' })
    act(() => textbox.click())

    const warekiText = screen.getByText('September 25, 6 Reiwa')
    expect(warekiText).toBeTruthy()
  })

  it('カレンダーから日付を選択することができる', async () => {
    renderWithIntl(
      <form>
        <FormControl label="WarekiPicker">
          <WarekiPicker name="date" value="2024-09-25" onChangeDate={vi.fn()} />
        </FormControl>
      </form>,
    )
    const textbox = screen.getByRole('textbox', { name: 'WarekiPicker' })

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

  it('showAlternativeにfalseを指定した場合、和暦の別表記を表示しない', () => {
    renderWithIntl(
      <form>
        <FormControl label="WarekiPicker">
          <WarekiPicker
            name="date"
            value="2024-09-25"
            showAlternative={false}
            onChangeDate={vi.fn()}
          />
        </FormControl>
      </form>,
      'ja',
    )

    const textbox = screen.getByRole('textbox', { name: 'WarekiPicker' })
    act(() => textbox.click())

    expect(screen.queryByText('令和6年9月25日')).not.toBeInTheDocument()
  })

  it('showAlternativeに関数を指定した場合、その関数の結果を別表記として表示する', () => {
    renderWithIntl(
      <form>
        <FormControl label="WarekiPicker">
          <WarekiPicker
            name="date"
            value="2024-09-25"
            showAlternative={(date) => (date ? `custom:${date.getFullYear()}` : null)}
            onChangeDate={vi.fn()}
          />
        </FormControl>
      </form>,
      'ja',
    )

    const textbox = screen.getByRole('textbox', { name: 'WarekiPicker' })
    act(() => textbox.click())

    expect(screen.getByText('custom:2024')).toBeTruthy()
    expect(screen.queryByText('令和6年9月25日')).not.toBeInTheDocument()
  })

  it('showAlternativeの値を動的に切り替えても再マウントされない', () => {
    const Wrapper = () => {
      const [showAlternative, setShowAlternative] = useState(true)

      return (
        <form>
          <FormControl label="WarekiPicker">
            <WarekiPicker
              name="date"
              defaultValue="2024-09-25"
              showAlternative={showAlternative}
              onChangeDate={vi.fn()}
            />
          </FormControl>
          <button type="button" onClick={() => setShowAlternative(false)}>
            toggle
          </button>
        </form>
      )
    }

    renderWithIntl(<Wrapper />)

    const textboxBefore = screen.getByRole('textbox', { name: 'WarekiPicker' })

    expect(screen.getByText('令和6年9月25日')).toBeTruthy()

    act(() => screen.getByRole('button', { name: 'toggle' }).click())

    const textboxAfter = screen.getByRole('textbox', { name: 'WarekiPicker' })

    expect(textboxAfter).toBe(textboxBefore)
    expect(textboxAfter).toHaveProperty('value', '2024/09/25')
  })

  it('選択日が変わらないままshowAlternativeをtrueからfalseに切り替えると、別表記が消える', () => {
    const Wrapper = () => {
      const [showAlternative, setShowAlternative] = useState(true)

      return (
        <form>
          <FormControl label="WarekiPicker">
            <WarekiPicker
              name="date"
              defaultValue="2024-09-25"
              showAlternative={showAlternative}
              onChangeDate={vi.fn()}
            />
          </FormControl>
          <button type="button" onClick={() => setShowAlternative(false)}>
            toggle
          </button>
        </form>
      )
    }

    renderWithIntl(<Wrapper />)

    expect(screen.getByText('令和6年9月25日')).toBeTruthy()

    act(() => screen.getByRole('button', { name: 'toggle' }).click())

    expect(screen.queryByText('令和6年9月25日')).not.toBeInTheDocument()
  })

  it('フォーカスを失うときにテキストボックスの内容がフォーマットされること', async () => {
    renderWithIntl(
      <form>
        <FormControl label="WarekiPicker">
          <WarekiPicker name="date" onChangeDate={vi.fn()} />
        </FormControl>
      </form>,
    )
    const textbox = screen.getByRole('textbox', { name: 'WarekiPicker' })
    await userEvent.type(textbox, '平成4年5月29日{tab}')
    expect(textbox).toHaveProperty('value', '1992/05/29')
  })

  it('defaultValue のみ指定した場合(非制御)、初期表示時点でフォーマット済みの値が表示されること', () => {
    renderWithIntl(
      <form>
        <FormControl label="WarekiPicker">
          <WarekiPicker name="date" defaultValue="2024-09-25" />
        </FormControl>
      </form>,
    )
    const textbox = screen.getByRole('textbox', { name: 'WarekiPicker' })
    expect(textbox).toHaveProperty('value', '2024/09/25')
  })

  it('defaultValue のみ指定した場合(非制御)、カレンダーの初期選択日が反映されること', () => {
    renderWithIntl(
      <form>
        <FormControl label="WarekiPicker">
          <WarekiPicker name="date" defaultValue="2024-09-25" />
        </FormControl>
      </form>,
    )
    const textbox = screen.getByRole('textbox', { name: 'WarekiPicker' })

    act(() => textbox.click())

    expect(screen.getByRole('button', { name: '25' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('defaultValue のみ指定した場合(非制御)、ユーザー入力後もフォーカスを失うとフォーマットされること', async () => {
    renderWithIntl(
      <form>
        <FormControl label="WarekiPicker">
          <WarekiPicker name="date" defaultValue="2024-09-25" />
        </FormControl>
      </form>,
    )
    const textbox = screen.getByRole('textbox', { name: 'WarekiPicker' })
    await userEvent.clear(textbox)
    await userEvent.type(textbox, '平成4年5月29日{tab}')
    expect(textbox).toHaveProperty('value', '1992/05/29')
  })

  it('非制御で入力を変更後、form.reset()を呼ぶとdefaultValueに戻り、和暦alt表示も追従すること', async () => {
    const { container } = renderWithIntl(
      <form>
        <FormControl label="WarekiPicker">
          <WarekiPicker name="date" defaultValue="2024-09-25" />
        </FormControl>
      </form>,
    )
    const textbox = screen.getByRole('textbox', { name: 'WarekiPicker' })

    await userEvent.clear(textbox)
    await userEvent.type(textbox, '2024/10/15{tab}')
    expect(textbox).toHaveProperty('value', '2024/10/15')
    expect(screen.getByText('令和6年10月15日')).toBeVisible()

    act(() => {
      container.querySelector('form')!.reset()
    })

    expect(textbox).toHaveProperty('value', '2024/09/25')
    expect(screen.getByText('令和6年9月25日')).toBeVisible()
  })

  it('マウント後にdefaultValueが変更されても、form.reset()ではマウント時のdefaultValueに戻ること', () => {
    const { container, rerender } = renderWithIntl(
      <form>
        <FormControl label="WarekiPicker">
          <WarekiPicker name="date" defaultValue="2024-09-25" />
        </FormControl>
      </form>,
    )
    const textbox = screen.getByRole('textbox', { name: 'WarekiPicker' })

    rerender(
      <IntlProvider locale="ja">
        <form>
          <FormControl label="WarekiPicker">
            <WarekiPicker name="date" defaultValue="2024-12-01" />
          </FormControl>
        </form>
      </IntlProvider>,
    )

    act(() => {
      container.querySelector('form')!.reset()
    })

    expect(textbox).toHaveProperty('value', '2024/09/25')
    expect(screen.getByText('令和6年9月25日')).toBeVisible()
  })

  it('制御時(value指定)は、form.reset()を呼んでも表示が変わらないこと', () => {
    const { container } = renderWithIntl(
      <form>
        <FormControl label="WarekiPicker">
          <WarekiPicker name="date" value="2024-10-15" />
        </FormControl>
      </form>,
    )
    const textbox = screen.getByRole('textbox', { name: 'WarekiPicker' })

    expect(textbox).toHaveProperty('value', '2024/10/15')
    expect(screen.getByText('令和6年10月15日')).toBeVisible()

    act(() => {
      container.querySelector('form')!.reset()
    })

    expect(screen.getByText('令和6年10月15日')).toBeVisible()
  })

  it('defaultValue のみ指定した場合(非制御)、初期表示時点でshowAlternativeの内容が表示されること', () => {
    renderWithIntl(
      <form>
        <FormControl label="WarekiPicker">
          <WarekiPicker
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
        <FormControl label="WarekiPicker">
          <WarekiPicker
            name="date"
            value="2024-09-25"
            defaultValue="2020-01-01"
            onChangeDate={vi.fn()}
          />
        </FormControl>
      </form>,
    )
    const textbox = screen.getByRole('textbox', { name: 'WarekiPicker' })
    expect(textbox).toHaveProperty('value', '2024/09/25')
  })

  it('value に null、defaultValue に値を指定した場合、defaultValue は無視されshowAlternativeの初期表示もされないこと', () => {
    renderWithIntl(
      <form>
        <FormControl label="WarekiPicker">
          <WarekiPicker
            name="date"
            value={null}
            defaultValue="2020-01-01"
            showAlternative={(d) => (d ? `alt:${d.getFullYear()}` : null)}
            onChangeDate={vi.fn()}
          />
        </FormControl>
      </form>,
    )
    const textbox = screen.getByRole('textbox', { name: 'WarekiPicker' })
    expect(textbox).toHaveProperty('value', '')
    expect(screen.queryByText('alt:2020')).not.toBeInTheDocument()
  })

  it('defaultValue が parseInput で解析できない場合、入力欄に defaultValue がそのまま残ること', () => {
    renderWithIntl(
      <form>
        <FormControl label="WarekiPicker">
          <WarekiPicker name="date" defaultValue="invalid-date-string" parseInput={() => null} />
        </FormControl>
      </form>,
    )
    const textbox = screen.getByRole('textbox', { name: 'WarekiPicker' })
    expect(textbox).toHaveProperty('value', 'invalid-date-string')
  })

  it('value・defaultValue とも未指定の場合、formatDate が渡されていても初期表示は空のままであること', () => {
    renderWithIntl(
      <form>
        <FormControl label="WarekiPicker">
          <WarekiPicker
            name="date"
            formatDate={(d) => (d ? d.toISOString() : '未選択')}
            onChangeDate={vi.fn()}
          />
        </FormControl>
      </form>,
    )
    const textbox = screen.getByRole('textbox', { name: 'WarekiPicker' })
    expect(textbox).toHaveProperty('value', '')
  })

  it('showAlternativeにfalseを指定した場合、和暦の別表記を表示しない', () => {
    renderWithIntl(
      <form>
        <FormControl label="WarekiPicker">
          <WarekiPicker
            name="date"
            value="2024-09-25"
            showAlternative={false}
            onChangeDate={vi.fn()}
          />
        </FormControl>
      </form>,
      'ja',
    )

    const textbox = screen.getByRole('textbox', { name: 'WarekiPicker' })
    act(() => textbox.click())

    expect(screen.queryByText('令和6年9月25日')).not.toBeInTheDocument()
  })

  it('showAlternativeに関数を指定した場合、その関数の結果を別表記として表示する', () => {
    renderWithIntl(
      <form>
        <FormControl label="WarekiPicker">
          <WarekiPicker
            name="date"
            value="2024-09-25"
            showAlternative={(date) => (date ? `custom:${date.getFullYear()}` : null)}
            onChangeDate={vi.fn()}
          />
        </FormControl>
      </form>,
      'ja',
    )

    const textbox = screen.getByRole('textbox', { name: 'WarekiPicker' })
    act(() => textbox.click())

    expect(screen.getByText('custom:2024')).toBeTruthy()
    expect(screen.queryByText('令和6年9月25日')).not.toBeInTheDocument()
  })

  it('showAlternativeの値を動的に切り替えても再マウントされない', () => {
    const Wrapper = () => {
      const [showAlternative, setShowAlternative] = useState(true)

      return (
        <form>
          <FormControl label="WarekiPicker">
            <WarekiPicker
              name="date"
              defaultValue="2024-09-25"
              showAlternative={showAlternative}
              onChangeDate={vi.fn()}
            />
          </FormControl>
          <button type="button" onClick={() => setShowAlternative(false)}>
            toggle
          </button>
        </form>
      )
    }

    renderWithIntl(<Wrapper />)

    const textboxBefore = screen.getByRole('textbox', { name: 'WarekiPicker' })

    expect(screen.getByText('令和6年9月25日')).toBeTruthy()

    act(() => screen.getByRole('button', { name: 'toggle' }).click())

    const textboxAfter = screen.getByRole('textbox', { name: 'WarekiPicker' })

    expect(textboxAfter).toBe(textboxBefore)
    expect(textboxAfter).toHaveProperty('value', '2024/09/25')
  })

  it('選択日が変わらないままshowAlternativeをtrueからfalseに切り替えると、別表記が消える', () => {
    const Wrapper = () => {
      const [showAlternative, setShowAlternative] = useState(true)

      return (
        <form>
          <FormControl label="WarekiPicker">
            <WarekiPicker
              name="date"
              defaultValue="2024-09-25"
              showAlternative={showAlternative}
              onChangeDate={vi.fn()}
            />
          </FormControl>
          <button type="button" onClick={() => setShowAlternative(false)}>
            toggle
          </button>
        </form>
      )
    }

    renderWithIntl(<Wrapper />)

    expect(screen.getByText('令和6年9月25日')).toBeTruthy()

    act(() => screen.getByRole('button', { name: 'toggle' }).click())

    expect(screen.queryByText('令和6年9月25日')).not.toBeInTheDocument()
  })
})
