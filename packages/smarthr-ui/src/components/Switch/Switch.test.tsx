import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { EnvironmentProvider } from '../../hooks/client/useEnvironment'

import { Switch } from './client'

import type { Environment } from '../../hooks/client/useEnvironment'
import type { ComponentPropsWithoutRef } from 'react'

const NORMAL_WRAPPER_CLASS = 'shr-w-[calc(theme(fontSize.base)*2)]'
const LARGE_WRAPPER_CLASS = 'shr-w-[calc(theme(fontSize.xl)*2)]'

const renderSwitch = (
  props: ComponentPropsWithoutRef<typeof Switch>,
  environment?: Partial<Environment>,
) =>
  render(
    <EnvironmentProvider environment={environment}>
      <Switch {...props} />
    </EnvironmentProvider>,
  )

// Switch の input の親が、サイズ用のクラスを持つ wrapper
const getWrapper = () => screen.getByRole('switch').parentElement!

describe('Switch', () => {
  it('defaultChecked を指定した場合(非制御)、初期状態でオンになる', () => {
    renderSwitch({ name: 'switch', defaultChecked: true, children: 'スイッチ' })

    expect(screen.getByRole('switch', { name: 'スイッチ' })).toBeChecked()
  })

  it('非制御の場合、複数設置してもユーザー操作で各Switchが独立してオン/オフを切り替えられる', async () => {
    const user = userEvent.setup()

    render(
      <EnvironmentProvider>
        <Switch name="switch-a">スイッチA</Switch>
        <Switch name="switch-b" defaultChecked>
          スイッチB
        </Switch>
      </EnvironmentProvider>,
    )

    const switchA = screen.getByRole('switch', { name: 'スイッチA' })
    const switchB = screen.getByRole('switch', { name: 'スイッチB' })
    expect(switchA).not.toBeChecked()
    expect(switchB).toBeChecked()

    await user.click(switchA)

    expect(switchA).toBeChecked()
    expect(switchB).toBeChecked()
  })

  describe('サイズ（large / mobile）', () => {
    it('mobile 環境では大きいサイズになる', () => {
      renderSwitch({ children: 'スイッチ' }, { mobile: true })

      expect(getWrapper()).toHaveClass(LARGE_WRAPPER_CLASS)
      expect(getWrapper()).not.toHaveClass(NORMAL_WRAPPER_CLASS)
    })

    it('mobile 以外の環境では通常サイズになる', () => {
      renderSwitch({ children: 'スイッチ' }, { mobile: false })

      expect(getWrapper()).toHaveClass(NORMAL_WRAPPER_CLASS)
      expect(getWrapper()).not.toHaveClass(LARGE_WRAPPER_CLASS)
    })

    it('large を指定すると mobile 以外の環境でも大きいサイズになる', () => {
      renderSwitch({ large: true, children: 'スイッチ' }, { mobile: false })

      expect(getWrapper()).toHaveClass(LARGE_WRAPPER_CLASS)
    })

    it('large のときはチェックアイコンも大きくなる', () => {
      renderSwitch({ large: true, children: 'スイッチ' }, { mobile: false })

      expect(getWrapper().querySelector('svg')).toHaveClass('shr-size-[theme(fontSize.base)]')
    })

    it('large={false} を指定すると mobile 環境でも通常サイズになる', () => {
      renderSwitch({ large: false, children: 'スイッチ' }, { mobile: true })

      expect(getWrapper()).toHaveClass(NORMAL_WRAPPER_CLASS)
      expect(getWrapper()).not.toHaveClass(LARGE_WRAPPER_CLASS)
    })
  })
})
