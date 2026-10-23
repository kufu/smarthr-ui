import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { EnvironmentProvider } from '../../hooks/client/useEnvironment'

import { Switch } from './client'

import type { Environment } from '../../hooks/client/useEnvironment'
import type { ComponentPropsWithoutRef } from 'react'

const S_WRAPPER_CLASS = 'shr-w-[calc(theme(fontSize.base)*2)]'
const M_WRAPPER_CLASS = 'shr-w-[calc(theme(fontSize.xl)*2)]'

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

  describe('サイズ（size / mobile）', () => {
    it('mobile 環境では M サイズになる', () => {
      renderSwitch({ children: 'スイッチ' }, { mobile: true })

      expect(getWrapper()).toHaveClass(M_WRAPPER_CLASS)
      expect(getWrapper()).not.toHaveClass(S_WRAPPER_CLASS)
    })

    it('mobile 以外の環境では S サイズになる', () => {
      renderSwitch({ children: 'スイッチ' }, { mobile: false })

      expect(getWrapper()).toHaveClass(S_WRAPPER_CLASS)
      expect(getWrapper()).not.toHaveClass(M_WRAPPER_CLASS)
    })

    it('size="M" を指定すると mobile 以外の環境でも M サイズになる', () => {
      renderSwitch({ size: 'M', children: 'スイッチ' }, { mobile: false })

      expect(getWrapper()).toHaveClass(M_WRAPPER_CLASS)
    })

    it('M サイズのときはチェックアイコンも大きくなる', () => {
      renderSwitch({ size: 'M', children: 'スイッチ' }, { mobile: false })

      expect(getWrapper().querySelector('svg')).toHaveClass('shr-size-[theme(fontSize.base)]')
    })

    it('size="S" を指定すると mobile 環境でも S サイズになる', () => {
      renderSwitch({ size: 'S', children: 'スイッチ' }, { mobile: true })

      expect(getWrapper()).toHaveClass(S_WRAPPER_CLASS)
      expect(getWrapper()).not.toHaveClass(M_WRAPPER_CLASS)
    })
  })
})
